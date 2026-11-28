import { assertCan } from "../services/permissions";
import { User } from "../models/types";
import { ControllerRequest, ControllerResponse } from "./authController";
import { sql } from "../../server/db/supabase";
import { FileStorageService } from "../../server/services/fileStorageService";
import { FileConverterService } from "../../server/services/fileConverterService";
import { VerificationQueueService } from "../../server/services/verificationQueueService";
import { NotificationService } from "../../server/services/notificationService";
import { db } from "../db/database";
import crypto from "crypto";
import fs from "fs";

export class SubmissionController {
  /**
   * Submit an assignment (with file upload or base64 payload)
   */
  async submitAssignment(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Authentication required" });
      }

      assertCan(user, "submit:assignment", "submission");

      const student =
        db.getStudentByUserId(user.id) ||
        db.getStudents().find((s) => s.email.toLowerCase() === user.email.toLowerCase());

      if (!student) {
        return res
          .status(403)
          .json({ success: false, error: "Only enrolled students can submit assignments" });
      }

      const body = req.body as {
        assignmentId: string;
        sectionId?: string;
        filename: string;
        fileBase64: string; // Base64 encoded file payload
        fileMimeType?: string;
        autoConvertDocx?: boolean;
      };

      if (!body.assignmentId || !body.filename || !body.fileBase64) {
        return res.status(400).json({
          success: false,
          error:
            "Missing required parameters: assignmentId, filename, and fileBase64 are required.",
        });
      }

      const assignment = db.getAssignments().find((a) => a.id === body.assignmentId);
      if (!assignment) {
        return res.status(404).json({ success: false, error: "Assignment not found." });
      }
      if (assignment.sectionId && assignment.sectionId !== student.sectionId) {
        return res.status(403).json({
          success: false,
          error: "Forbidden: You are not enrolled in the section for this coursework assignment.",
        });
      }
      const sectionId = student.sectionId;
      const institutionId = user.institutionId || "inst_demo";

      // 1. Decode buffer
      const base64Data = body.fileBase64.replace(/^data:.*?;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      if (buffer.length === 0) {
        return res.status(400).json({ success: false, error: "File buffer is empty or corrupt." });
      }

      // Max file size check: default 25 MB
      const maxLimit = 25 * 1024 * 1024;
      if (buffer.length > maxLimit) {
        return res.status(400).json({ success: false, error: "File exceeds 25 MB size limit." });
      }

      // 2. Save original file
      const originalSaved = await FileStorageService.saveBuffer(buffer, body.filename, "originals");

      // 3. Check existing submissions for version incrementing
      let version = 1;
      try {
        const prevSubs = await sql`
          SELECT submission_version FROM assignment_submissions
          WHERE assignment_id = ${body.assignmentId} AND student_id = ${student.id}
          ORDER BY submission_version DESC LIMIT 1
        `;
        if (prevSubs && prevSubs.length > 0 && prevSubs[0]) {
          version = Number(prevSubs[0].submission_version) + 1;
          // Mark previous submissions as is_latest = false
          await sql`
            UPDATE assignment_submissions
            SET is_latest = false
            WHERE assignment_id = ${body.assignmentId} AND student_id = ${student.id}
          `;
        }
      } catch {
        // Fallback to version 1 if query fails
      }

      // 4. Create new submission record
      const submissionId = `sub_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
      const originalFileId = `file_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

      const newSubmission = {
        id: submissionId,
        institution_id: institutionId,
        section_id: sectionId,
        assignment_id: body.assignmentId,
        student_id: student.id,
        student_name: student.name,
        roll_number: student.rollNumber,
        status: "Submitted",
        verification_status: "Pending",
        teacher_review_status: "Pending",
        submission_version: version,
        is_latest: true,
        original_filename: originalSaved.originalFilename,
        stored_filename: originalSaved.storedFilename,
        storage_path: originalSaved.storagePath,
        file_mime_type: originalSaved.fileMimeType,
        file_size: originalSaved.fileSize,
        checksum_sha256: originalSaved.checksumSha256,
        created_at: new Date().toISOString(),
      };

      try {
        await sql`
          INSERT INTO assignment_submissions (
            id, institution_id, section_id, assignment_id, student_id, student_name, roll_number,
            status, verification_status, teacher_review_status, submission_version, is_latest,
            original_filename, stored_filename, storage_path, file_mime_type, file_size, checksum_sha256, created_at
          ) VALUES (
            ${newSubmission.id}, ${newSubmission.institution_id}, ${newSubmission.section_id},
            ${newSubmission.assignment_id}, ${newSubmission.student_id}, ${newSubmission.student_name},
            ${newSubmission.roll_number}, ${newSubmission.status}, ${newSubmission.verification_status},
            ${newSubmission.teacher_review_status}, ${newSubmission.submission_version}, ${newSubmission.is_latest},
            ${newSubmission.original_filename}, ${newSubmission.stored_filename}, ${newSubmission.storage_path},
            ${newSubmission.file_mime_type}, ${newSubmission.file_size}, ${newSubmission.checksum_sha256},
            ${newSubmission.created_at}
          )
        `;

        // Insert into submission_files
        await sql`
          INSERT INTO submission_files (
            id, submission_id, file_role, original_filename, stored_filename, storage_path, file_mime_type, file_size, checksum_sha256
          ) VALUES (
            ${originalFileId}, ${newSubmission.id}, 'original', ${originalSaved.originalFilename},
            ${originalSaved.storedFilename}, ${originalSaved.storagePath}, ${originalSaved.fileMimeType},
            ${originalSaved.fileSize}, ${originalSaved.checksumSha256}
          )
        `;
      } catch (dbErr) {
        console.error("Database insert error:", dbErr);
      }

      // 5. Automatic DOCX/Image conversion if requested or appropriate
      let convertedInfo = null;
      const ext = originalSaved.originalFilename.split(".").pop()?.toLowerCase();
      if (body.autoConvertDocx && (ext === "docx" || ext === "doc" || ext === "txt")) {
        const conv = await FileConverterService.convertFile(
          buffer,
          originalSaved.originalFilename,
          "pdf",
        );
        if (conv.success && conv.convertedInfo) {
          convertedInfo = conv.convertedInfo;
          const convFileId = `file_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
          try {
            await sql`
              INSERT INTO submission_files (
                id, submission_id, file_role, original_filename, stored_filename, storage_path, file_mime_type, file_size, checksum_sha256
              ) VALUES (
                ${convFileId}, ${newSubmission.id}, 'converted', ${conv.convertedInfo.originalFilename},
                ${conv.convertedInfo.storedFilename}, ${conv.convertedInfo.storagePath}, ${conv.convertedInfo.fileMimeType},
                ${conv.convertedInfo.fileSize}, ${conv.convertedInfo.checksumSha256}
              )
            `;
            await sql`
              UPDATE assignment_submissions
              SET converted_from_format = ${ext}
              WHERE id = ${newSubmission.id}
            `;
          } catch {
            // Conversion record failure fallback
          }
        }
      }

      // 6. Automatically trigger background verification queue
      await VerificationQueueService.enqueueBatch([
        {
          id: newSubmission.id,
          institutionId,
          sectionId,
          assignmentId: body.assignmentId,
          studentId: student.id,
          studentName: student.name,
        },
      ]);

      // 7. Dispatch Notification to Teacher
      await NotificationService.createNotification({
        institutionId,
        userId: "teacher",
        role: "teacher",
        title: "New Assignment Submitted",
        message: `${student.name} (${student.rollNumber}) submitted assignment: "${assignment?.title || body.assignmentId}"`,
        type: "info",
        link: `/teacher/assignments`,
        metadata: { submissionId, studentId: student.id, assignmentId: body.assignmentId },
      });

      return res.status(201).json({
        success: true,
        data: {
          message: "Assignment submitted successfully and queued for verification.",
          submission: newSubmission,
          convertedFile: convertedInfo,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * List submissions with section, assignment, and role-based filtering
   */
  async getSubmissions(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      assertCan(user, "read:submission", "submission");

      const query = req.query as {
        assignmentId?: string;
        sectionId?: string;
        studentId?: string;
        status?: string;
      };

      let studentIdFilter = query.studentId;
      if (user.role === "student") {
        const student =
          db.getStudentByUserId(user.id) ||
          db.getStudents().find((s) => s.email.toLowerCase() === user.email.toLowerCase());
        studentIdFilter = student?.id;
      }

      const userInstId = user.institutionId || "inst_demo";

      try {
        const rows = await sql`
          SELECT s.*, 
            r.status as verified_status, r.score as verification_score, r.checks as verification_checks,
            r.similarity_metrics, r.summary as verification_summary
          FROM assignment_submissions s
          LEFT JOIN verification_results r ON r.submission_id = s.id
          WHERE (s.institution_id = ${userInstId} OR ${user.role} = 'admin')
            AND (${query.assignmentId || null}::text IS NULL OR s.assignment_id = ${query.assignmentId || null})
            AND (${query.sectionId || null}::text IS NULL OR s.section_id = ${query.sectionId || null})
            AND (${studentIdFilter || null}::text IS NULL OR s.student_id = ${studentIdFilter || null})
            AND (${query.status || null}::text IS NULL OR s.status = ${query.status || null})
          ORDER BY s.created_at DESC
        `;

        return res.status(200).json({ success: true, data: rows || [] });
      } catch {
        return res.status(200).json({ success: true, data: [] });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load submissions";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Get single submission details with verification results and file attachments
   */
  async getSubmissionDetails(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const { id } = req.params as { id: string };
      if (!id) {
        return res.status(400).json({ success: false, error: "Submission ID required" });
      }

      const rows = await sql`
        SELECT s.*,
          r.id as result_id, r.status as result_status, r.score as verification_score,
          r.checks as verification_checks, r.similarity_metrics, r.summary as verification_summary,
          r.notes as verification_notes
        FROM assignment_submissions s
        LEFT JOIN verification_results r ON r.submission_id = s.id
        WHERE s.id = ${id}
      `;

      if (!rows || rows.length === 0 || !rows[0]) {
        return res.status(404).json({ success: false, error: "Submission not found" });
      }

      const submission = rows[0];

      // Multi-tenancy check
      if (
        user.institutionId &&
        submission.institution_id !== user.institutionId &&
        user.role !== "admin"
      ) {
        return res.status(403).json({ success: false, error: "Access denied across institutions" });
      }

      // IDOR protection: student can only read their own
      if (user.role === "student") {
        const student =
          db.getStudentByUserId(user.id) ||
          db.getStudents().find((s) => s.email.toLowerCase() === user.email.toLowerCase());
        if (student?.id !== submission.student_id) {
          return res.status(403).json({ success: false, error: "Access denied" });
        }
      }

      // Fetch attached files
      const files = await sql`
        SELECT * FROM submission_files WHERE submission_id = ${id} ORDER BY created_at ASC
      `;

      return res.status(200).json({
        success: true,
        data: {
          ...submission,
          files: files || [],
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load submission";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Download a submitted file safely with strict IDOR verification
   */
  async downloadFile(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Authentication required" });
      }

      const { id } = req.params as { id: string };
      const rows = await sql`
        SELECT f.*, s.institution_id, s.section_id, s.student_id
        FROM submission_files f
        JOIN assignment_submissions s ON s.id = f.submission_id
        WHERE f.id = ${id}
      `;
      if (!rows || rows.length === 0 || !rows[0]) {
        return res.status(404).json({ success: false, error: "File not found" });
      }

      const fileRecord = rows[0];

      // IDOR verification
      if (user.role === "student") {
        const student =
          db.getStudentByUserId(user.id) ||
          db.getStudents().find((s) => s.email.toLowerCase() === user.email.toLowerCase());
        if (!student || student.id !== fileRecord.student_id) {
          return res.status(403).json({
            success: false,
            error: "Access denied: you are not authorized to download this student's file",
          });
        }
      } else if (user.role === "teacher") {
        if (user.institutionId && fileRecord.institution_id !== user.institutionId) {
          return res.status(403).json({
            success: false,
            error: "Access denied: submission belongs to another institution",
          });
        }
      } else if (user.role !== "admin") {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }

      if (!fs.existsSync(fileRecord.storage_path)) {
        return res.status(404).json({ success: false, error: "File removed or missing on disk" });
      }

      const buffer = await fs.promises.readFile(fileRecord.storage_path);
      const streamRes = res as unknown as {
        setHeader: (name: string, value: string) => void;
        status: (code: number) => { send: (chunk: Buffer) => void };
      };
      streamRes.setHeader("Content-Type", fileRecord.file_mime_type);
      streamRes.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileRecord.original_filename}"`,
      );
      return streamRes.status(200).send(buffer);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "File download error";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Standalone File Converter (DOCX -> PDF, Image -> PDF, TXT -> PDF)
   */
  async convertFileStandalone(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const { filename, fileBase64, targetFormat } = req.body as {
        filename: string;
        fileBase64: string;
        targetFormat?: "pdf" | "png" | "jpg";
      };

      if (!filename || !fileBase64) {
        return res.status(400).json({ success: false, error: "Filename and fileBase64 required." });
      }

      const base64Data = fileBase64.replace(/^data:.*?;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      if (buffer.length > 25 * 1024 * 1024) {
        return res.status(400).json({ success: false, error: "File exceeds 25 MB size limit." });
      }

      const result = await FileConverterService.convertFile(
        buffer,
        filename,
        targetFormat || "pdf",
      );

      if (!result.success || !result.convertedInfo) {
        return res.status(400).json({ success: false, error: result.error || "Conversion failed" });
      }

      // Read converted buffer to return base64 for direct browser download / preview
      const convertedBuffer = await fs.promises.readFile(result.convertedInfo.storagePath);
      const convertedBase64 = `data:${result.convertedInfo.fileMimeType};base64,${convertedBuffer.toString("base64")}`;

      return res.status(200).json({
        success: true,
        data: {
          originalFilename: filename,
          convertedFilename: result.convertedInfo.originalFilename,
          fileMimeType: result.convertedInfo.fileMimeType,
          fileSize: result.convertedInfo.fileSize,
          convertedBase64,
          extractedText: result.extractedText || "",
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "File conversion error";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Teacher manual review of submission (Approve, Reject, Request Resubmission)
   */
  async reviewSubmission(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      assertCan(user, "review:submission", "submission");

      const { id } = req.params as { id: string };
      const { status, reviewNotes } = req.body as {
        status: "Approved" | "Rejected" | "Resubmission Requested";
        reviewNotes?: string;
      };

      if (!["Approved", "Rejected", "Resubmission Requested"].includes(status)) {
        return res.status(400).json({ success: false, error: "Invalid review status" });
      }

      const rows = await sql`
        UPDATE assignment_submissions
        SET 
          teacher_review_status = ${status},
          teacher_review_notes = ${reviewNotes || null},
          reviewed_by = ${user.name || user.id},
          reviewed_at = NOW(),
          status = ${
            status === "Approved"
              ? "Verified"
              : status === "Rejected"
                ? "Rejected"
                : "Resubmission Required"
          },
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;

      if (!rows || rows.length === 0 || !rows[0]) {
        return res.status(404).json({ success: false, error: "Submission not found" });
      }

      const updated = rows[0];

      // Notify Student
      await NotificationService.createNotification({
        institutionId: updated.institution_id,
        userId: updated.student_id,
        role: "student",
        title: `Submission Review: ${status}`,
        message: reviewNotes
          ? `Teacher review feedback: "${reviewNotes}"`
          : `Your submission has been reviewed by your faculty and marked as ${status}.`,
        type: status === "Approved" ? "success" : "warning",
      });

      return res.status(200).json({ success: true, data: updated });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Review submission failed";
      return res.status(500).json({ success: false, error: msg });
    }
  }
}

export const submissionController = new SubmissionController();
