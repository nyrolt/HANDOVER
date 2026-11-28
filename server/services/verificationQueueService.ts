import crypto from "crypto";
import { sql } from "../db/supabase";
import { DocumentVerificationService, ExistingSubmissionText } from "./documentVerificationService";
import { NotificationService } from "./notificationService";
import type { VerificationJob, VerificationResult } from "../../backend/models/types";

export interface QueueProgress {
  batchId: string;
  total: number;
  processed: number;
  pending: number;
  processing: number;
  verified: number;
  needsReview: number;
  failed: number;
  percent: number;
  isComplete: boolean;
}

// In-memory job state cache for high responsiveness and offline resilience
const memoryJobs: Map<string, VerificationJob> = new Map();
const memoryResults: Map<string, VerificationResult> = new Map();

export class VerificationQueueService {
  private static concurrencyLimit = 5;
  private static activeWorkers = 0;
  private static isLoopRunning = false;

  /**
   * Enqueues a batch of submissions for verification.
   */
  public static async enqueueBatch(
    submissions: Array<{
      id: string;
      institutionId: string;
      sectionId: string;
      assignmentId: string;
      studentId: string;
      studentName: string;
    }>,
    batchId = `batch_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`,
  ): Promise<{ batchId: string; queuedCount: number }> {
    let position = 1;
    for (const sub of submissions) {
      const jobId = `job_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
      const job: VerificationJob = {
        id: jobId,
        institutionId: sub.institutionId,
        sectionId: sub.sectionId,
        assignmentId: sub.assignmentId,
        submissionId: sub.id,
        studentId: sub.studentId,
        batchId: batchId,
        status: "PENDING",
        attemptCount: 0,
        maxAttempts: 3,
        queuePosition: position++,
        priority: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      memoryJobs.set(job.id, job);

      try {
        await sql`
          INSERT INTO verification_jobs (
            id, institution_id, section_id, assignment_id, submission_id, student_id,
            batch_id, status, attempt_count, max_attempts, queue_position, priority, created_at, updated_at
          ) VALUES (
            ${job.id}, ${job.institutionId}, ${job.sectionId}, ${job.assignmentId}, ${job.submissionId},
            ${job.studentId}, ${job.batchId}, ${job.status}, ${job.attemptCount}, ${job.maxAttempts},
            ${job.queuePosition}, ${job.priority}, ${job.createdAt}, ${job.updatedAt}
          )
        `;

        // Update submission status to 'Queued for Verification'
        await sql`
          UPDATE assignment_submissions
          SET status = 'Queued for Verification', verification_status = 'Queued', updated_at = NOW()
          WHERE id = ${sub.id}
        `;
      } catch {
        // Fallback to memory
      }
    }

    // Trigger queue worker processing in background
    this.startWorkerPool();

    return { batchId, queuedCount: submissions.length };
  }

  /**
   * Recovers jobs that were left in 'PROCESSING' state due to server restart or process crash.
   */
  public static async recoverStaleJobs(): Promise<number> {
    try {
      const recovered = await sql`
        UPDATE verification_jobs
        SET status = 'PENDING', started_at = NULL, worker_id = NULL, updated_at = NOW()
        WHERE status = 'PROCESSING'
          AND (started_at IS NULL OR started_at < NOW() - INTERVAL '5 minutes')
        RETURNING id
      `;
      if (recovered && recovered.length > 0) {
        return recovered.length;
      }
    } catch {
      // Memory fallback: reset memory jobs in PROCESSING
      let count = 0;
      for (const job of memoryJobs.values()) {
        if (job.status === "PROCESSING") {
          job.status = "PENDING";
          job.workerId = undefined;
          job.startedAt = undefined;
          count++;
        }
      }
      return count;
    }
    return 0;
  }

  /**
   * Starts worker pool to process pending jobs up to concurrency limit.
   */
  public static startWorkerPool(): void {
    if (this.isLoopRunning) return;
    this.isLoopRunning = true;
    this.recoverStaleJobs()
      .catch(() => {})
      .finally(() => {
        this.processNextJobs().catch(() => {});
      });
  }

  private static async processNextJobs(): Promise<void> {
    try {
      while (this.activeWorkers < this.concurrencyLimit) {
        // Find next pending job from DB or memory
        const nextJob = await this.claimNextPendingJob();
        if (!nextJob) break;

        this.activeWorkers++;
        this.executeJob(nextJob)
          .catch((err) => {
            console.error(`[VerificationQueue] Job ${nextJob.id} failed:`, err);
          })
          .finally(() => {
            this.activeWorkers--;
            // Recursively process remaining queue
            this.processNextJobs().catch(() => {});
          });
      }
    } finally {
      this.isLoopRunning = false;
    }
  }

  /**
   * Atomically claims the next pending job from the queue.
   */
  private static async claimNextPendingJob(): Promise<VerificationJob | null> {
    const workerId = `worker_${process.pid}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      const rows = await sql<VerificationJob[]>`
        UPDATE verification_jobs
        SET status = 'PROCESSING', started_at = NOW(), worker_id = ${workerId}, updated_at = NOW(), attempt_count = attempt_count + 1
        WHERE id = (
          SELECT id FROM verification_jobs
          WHERE status = 'PENDING'
          ORDER BY priority DESC, queue_position ASC, created_at ASC
          LIMIT 1
          FOR UPDATE SKIP LOCKED
        )
        RETURNING *
      `;
      if (rows && rows.length > 0 && rows[0]) {
        memoryJobs.set(rows[0].id, rows[0]);
        return rows[0];
      }
    } catch {
      // Memory fallback
    }

    // Fallback: check memoryJobs
    for (const job of memoryJobs.values()) {
      if (job.status === "PENDING") {
        job.status = "PROCESSING";
        job.startedAt = new Date().toISOString();
        job.workerId = workerId;
        job.attemptCount++;
        return job;
      }
    }

    return null;
  }

  /**
   * Executes verification on a single claimed job.
   */
  private static async executeJob(job: VerificationJob): Promise<void> {
    try {
      // 1. Fetch submission details
      interface DbSubmissionRow {
        id: string;
        student_id: string;
        student_name: string;
        storage_path: string;
        original_filename: string;
        file_mime_type: string;
        file_size: number | string;
        checksum_sha256: string;
        created_at: string;
      }
      let submission: DbSubmissionRow | null = null;
      try {
        const subRows = await sql<
          DbSubmissionRow[]
        >`SELECT * FROM assignment_submissions WHERE id = ${job.submissionId}`;
        if (subRows && subRows.length > 0 && subRows[0]) submission = subRows[0];
      } catch {
        // Query fallback
      }

      if (!submission) {
        // Mark failed
        await this.finalizeJob(job, "FAILED", "Submission not found");
        return;
      }

      // 2. Fetch assignment constraints
      interface DbAssignmentRow {
        title: string;
        deadline?: string;
        allowed_formats?: string[];
      }
      let assignment: DbAssignmentRow = {
        title: "Course Assignment",
        allowed_formats: ["pdf", "docx", "txt", "zip"],
      };
      try {
        const assignRows = await sql<
          DbAssignmentRow[]
        >`SELECT * FROM assignments WHERE id = ${job.assignmentId}`;
        if (assignRows && assignRows.length > 0 && assignRows[0]) assignment = assignRows[0];
      } catch {
        // Fallback to default assignment constraints
      }

      // 3. Fetch peer submissions for plagiarism / text similarity comparison
      const peerList: ExistingSubmissionText[] = [];
      try {
        interface PeerRow {
          id: string;
          student_id: string;
          student_name: string;
          storage_path: string;
          original_filename: string;
        }
        const peerRows = await sql<PeerRow[]>`
          SELECT id, student_id, student_name, storage_path, original_filename
          FROM assignment_submissions
          WHERE assignment_id = ${job.assignmentId} AND id != ${job.submissionId}
          LIMIT 50
        `;
        for (const peer of peerRows) {
          const text = await DocumentVerificationService.extractTextFromFile(
            peer.storage_path,
            peer.original_filename,
          );
          if (text) {
            peerList.push({
              submissionId: peer.id,
              studentId: peer.student_id,
              studentName: peer.student_name,
              text,
            });
          }
        }
      } catch {
        // Peer fetch fallback
      }

      // 4. Run modular document verification pipeline
      const evaluation = await DocumentVerificationService.evaluateSubmission(
        {
          id: submission.id,
          studentId: submission.student_id,
          studentName: submission.student_name,
          storagePath: submission.storage_path,
          originalFilename: submission.original_filename,
          fileMimeType: submission.file_mime_type,
          fileSize: Number(submission.file_size),
          checksumSha256: submission.checksum_sha256,
          submittedAt: submission.created_at,
        },
        {
          title: assignment.title,
          deadline: assignment.deadline,
          allowedFormats: assignment.allowed_formats,
        },
        peerList,
      );

      // 5. Store Verification Result
      const resultId = `res_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
      const overallStatus =
        evaluation.status === "Verified"
          ? "Verified"
          : evaluation.status === "Needs Review"
            ? "Needs Teacher Review"
            : evaluation.status === "Invalid File"
              ? "Invalid File"
              : "Processing Failed";

      const result: VerificationResult = {
        id: resultId,
        jobId: job.id,
        submissionId: job.submissionId,
        overallStatus,
        integrityStatus: evaluation.status,
        formatValid: evaluation.status !== "Invalid File",
        metadataFindings: {
          wordCount: evaluation.extractedWordCount,
        },
        textSimilarityFindings: {
          maxSimilarityScore: evaluation.similarityMetrics.maxSimilarity,
          matchedSubmissionId: evaluation.similarityMetrics.matchedSubmissionId,
          matchedStudentName: evaluation.similarityMetrics.matchedStudentName,
          isFlagged: evaluation.similarityMetrics.flagged,
        },
        imageSimilarityFindings: {
          maxVisualSimilarity: 0,
          isFlagged: false,
        },
        warnings: evaluation.checks.filter((c) => !c.passed).map((c) => c.details),
        recommendation: evaluation.summary,
        confidenceScore: evaluation.score,
        createdAt: new Date().toISOString(),
      };

      memoryResults.set(result.id, result);

      try {
        await sql`
          INSERT INTO verification_results (
            id, job_id, submission_id, status, score, checks, similarity_metrics, summary, notes, created_at
          ) VALUES (
            ${result.id}, ${result.jobId || null}, ${result.submissionId}, ${result.overallStatus}, ${result.confidenceScore},
            ${JSON.stringify(evaluation.checks)}, ${JSON.stringify(evaluation.similarityMetrics)},
            ${evaluation.summary}, ${evaluation.notes}, ${result.createdAt}
          )
        `;

        // Update submission master status
        const newSubStatus =
          evaluation.status === "Verified"
            ? "Verified"
            : evaluation.status === "Needs Review"
              ? "Needs Teacher Review"
              : "Rejected";

        await sql`
          UPDATE assignment_submissions
          SET status = ${newSubStatus}, verification_status = ${evaluation.status}, updated_at = NOW()
          WHERE id = ${job.submissionId}
        `;
      } catch {
        // Handled via memory
      }

      // 6. Notify Student & Teacher (System E)
      await NotificationService.createNotification({
        institutionId: job.institutionId || "inst_demo",
        userId: job.studentId,
        role: "student",
        title:
          evaluation.status === "Verified"
            ? "Submission Verified"
            : "Submission Flagged for Review",
        message:
          evaluation.status === "Verified"
            ? `Your submission for "${assignment.title || "Assignment"}" has successfully passed automated verification.`
            : `Your submission for "${assignment.title || "Assignment"}" requires teacher review: ${evaluation.summary}`,
        type: evaluation.status === "Verified" ? "success" : "warning",
      });

      // 7. Finalize Job Status
      const finalJobStatus = evaluation.status === "Needs Review" ? "NEEDS_REVIEW" : "COMPLETED";
      await this.finalizeJob(job, finalJobStatus);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (job.attemptCount < job.maxAttempts) {
        // Re-queue
        job.status = "PENDING";
        job.errorMessage = errMsg;
        try {
          await sql`
            UPDATE verification_jobs
            SET status = 'PENDING', error_message = ${errMsg}, updated_at = NOW()
            WHERE id = ${job.id}
          `;
        } catch {
          // Re-queue error fallback
        }
      } else {
        await this.finalizeJob(job, "FAILED", errMsg);
      }
    }
  }

  private static async finalizeJob(
    job: VerificationJob,
    status: "COMPLETED" | "NEEDS_REVIEW" | "FAILED",
    errorMsg?: string,
  ): Promise<void> {
    job.status = status;
    job.completedAt = new Date().toISOString();
    if (errorMsg) job.errorMessage = errorMsg;

    try {
      await sql`
        UPDATE verification_jobs
        SET status = ${status}, completed_at = NOW(), error_message = ${errorMsg || null}, updated_at = NOW()
        WHERE id = ${job.id}
      `;
    } catch {
      // Memory state already preserved
    }
  }

  /**
   * Returns current progress of a verification batch or overall queue.
   */
  public static async getBatchProgress(batchId?: string): Promise<QueueProgress> {
    try {
      const condition = batchId ? sql`WHERE batch_id = ${batchId}` : sql``;
      const rows = await sql`
        SELECT 
          COUNT(*)::int as total,
          COUNT(*) FILTER (WHERE status = 'PENDING')::int as pending,
          COUNT(*) FILTER (WHERE status = 'PROCESSING')::int as processing,
          COUNT(*) FILTER (WHERE status = 'COMPLETED')::int as completed,
          COUNT(*) FILTER (WHERE status = 'NEEDS_REVIEW')::int as needs_review,
          COUNT(*) FILTER (WHERE status = 'FAILED')::int as failed
        FROM verification_jobs
        ${condition}
      `;

      if (rows && rows.length > 0) {
        const r = rows[0];
        const total = Number(r.total || 0);
        const pending = Number(r.pending || 0);
        const processing = Number(r.processing || 0);
        const completed = Number(r.completed || 0);
        const needsReview = Number(r.needs_review || 0);
        const failed = Number(r.failed || 0);
        const processed = completed + needsReview + failed;
        const percent = total > 0 ? Math.round((processed / total) * 100) : 100;

        return {
          batchId: batchId || "all",
          total,
          processed,
          pending,
          processing,
          verified: completed,
          needsReview,
          failed,
          percent,
          isComplete: processed >= total && total > 0,
        };
      }
    } catch {
      // Fallback to in-memory state
    }

    // Fallback using memoryJobs
    const jobs = Array.from(memoryJobs.values()).filter((j) => !batchId || j.batchId === batchId);
    const total = jobs.length;
    const pending = jobs.filter((j) => j.status === "PENDING").length;
    const processing = jobs.filter((j) => j.status === "PROCESSING").length;
    const completed = jobs.filter((j) => j.status === "COMPLETED").length;
    const needsReview = jobs.filter((j) => j.status === "NEEDS_REVIEW").length;
    const failed = jobs.filter((j) => j.status === "FAILED").length;
    const processed = completed + needsReview + failed;

    return {
      batchId: batchId || "all",
      total,
      processed,
      pending,
      processing,
      verified: completed,
      needsReview,
      failed,
      percent: total > 0 ? Math.round((processed / total) * 100) : 100,
      isComplete: processed >= total && total > 0,
    };
  }
}
