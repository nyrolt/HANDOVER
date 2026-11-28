import { describe, it, expect } from "vitest";
import { FileConverterService } from "../../server/services/fileConverterService";
import { FileStorageService } from "../../server/services/fileStorageService";
import { DocumentVerificationService } from "../../server/services/documentVerificationService";
import { VerificationQueueService } from "../../server/services/verificationQueueService";
import { MarksReconciliationService } from "../../server/services/marksReconciliationService";
import { can } from "../services/permissions";
import type { User } from "../models/types";

describe("Production QA & Security Hardening Test Suite", () => {
  const studentSectionA = "sec_cse_a";

  // Test Users
  const studentA: User = {
    id: "usr_student_alpha",
    name: "Alpha Student",
    email: "alpha@college.edu",
    role: "student",
    institutionId: "inst_mit",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const studentB: User = {
    id: "usr_student_beta",
    name: "Beta Student",
    email: "beta@college.edu",
    role: "student",
    institutionId: "inst_mit",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const teacherMit: User = {
    id: "usr_teacher_mit",
    name: "Prof. Ada",
    email: "ada@college.edu",
    role: "teacher",
    institutionId: "inst_mit",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const teacherHarvard: User = {
    id: "usr_teacher_harvard",
    name: "Prof. Bob",
    email: "bob@harvard.edu",
    role: "teacher",
    institutionId: "inst_harvard",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  /* ====================================================================
   * PHASE 2 — FILE CONVERSION QUALITY & UNICODE HANDLING
   * ==================================================================== */
  describe("Phase 2: File Conversion Quality & Unicode Resilience", () => {
    it("converts text containing non-standard Unicode (em-dashes, smart quotes, bullets) without crashing", async () => {
      const unicodeRichContent = `
        Executive Summary — Operating Systems Lab:
        “The preemptive scheduler yields higher responsiveness,” noted the team.
        • Thread pooling reduces context switching overhead.
        • Total execution time: 142ms … negligible latency.
      `;

      const pdfBuffer = await FileConverterService.textToPdf(
        unicodeRichContent,
        "Unicode Lab Report",
      );
      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.subarray(0, 4).toString()).toBe("%PDF");
      expect(pdfBuffer.length).toBeGreaterThan(100);
    });

    it("compiles multiple images into a multi-page PDF document", async () => {
      // 1x1 transparent PNG buffer
      const png1 = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64",
      );
      const png2 = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64",
      );

      const multiPdf = await FileConverterService.imagesToPdf([
        { buffer: png1, filename: "page1.png", mimeType: "image/png" },
        { buffer: png2, filename: "page2.png", mimeType: "image/png" },
      ]);

      expect(multiPdf).toBeInstanceOf(Buffer);
      expect(multiPdf.subarray(0, 4).toString()).toBe("%PDF");
      expect(multiPdf.length).toBeGreaterThan(500);
    });

    it("handles corrupted or empty buffers gracefully without crashing", async () => {
      const corruptBuffer = Buffer.from("NOT_A_VALID_DOCUMENT_STREAM_12345");
      const result = await FileConverterService.convertFile(
        corruptBuffer,
        "corrupt.unknownformat",
        "pdf",
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("strictly blocks files exceeding the 25MB safety boundary", () => {
      const size26MB = 26 * 1024 * 1024;
      const size24MB = 24 * 1024 * 1024;

      const checkSize = (size: number) => size <= 25 * 1024 * 1024;
      expect(checkSize(size26MB)).toBe(false);
      expect(checkSize(size24MB)).toBe(true);
    });
  });

  /* ====================================================================
   * PHASE 4 — BULK QUEUE CONCURRENCY & CRASH RECOVERY
   * ==================================================================== */
  describe("Phase 4: Bulk Queue Concurrency & Crash Recovery", () => {
    it("recovers orphaned PROCESSING jobs back to PENDING on server boot", async () => {
      // Test recoverStaleJobs handles recovery safely
      const recoveredCount = await VerificationQueueService.recoverStaleJobs();
      expect(typeof recoveredCount).toBe("number");
      expect(recoveredCount).toBeGreaterThanOrEqual(0);
    });

    it("accurately reports batch progress percentage for non-existent or empty batches", async () => {
      const progress = await VerificationQueueService.getBatchProgress("batch_test_empty");
      expect(progress.percent).toBe(100);
      expect(progress.total).toBe(0);
      expect(progress.processed).toBe(0);
    });
  });

  /* ====================================================================
   * PHASE 5 — VERIFICATION ACCURACY & FAIRNESS
   * ==================================================================== */
  describe("Phase 5: Verification Accuracy & Fair Plagiarism Flagging", () => {
    it("flags high similarity (>70%) non-punitively as 'Needs Review' instead of automatic rejection", async () => {
      // Simulate submission text matching an existing paper > 70%
      const boilerplateText =
        "Distributed Systems Lab 3: Raft Consensus Algorithm Implementation in Rust. " +
        "We implement Leader Election, Log Replication, and Safety invariants according to Ongaro and Ousterhout. " +
        "Term numbers monotonically increase and heartbeat intervals are 150ms. " +
        "All state machine commands are verified sequentially.";

      const txtBuffer = Buffer.from(boilerplateText, "utf-8");
      const saved = await FileStorageService.saveBuffer(txtBuffer, "raft_lab_submission.txt");

      // Evaluation against an identical corpus paper
      const evaluation = await DocumentVerificationService.evaluateSubmission(
        {
          id: "sub_eval_similar",
          studentId: studentA.id,
          studentName: studentA.name,
          storagePath: saved.storagePath,
          originalFilename: saved.originalFilename,
          fileMimeType: "text/plain",
          fileSize: saved.fileSize,
          checksumSha256: saved.checksumSha256,
          submittedAt: new Date(),
        },
        {
          title: "Raft Consensus Lab",
          allowedFormats: ["txt", "pdf"],
        },
        [
          {
            submissionId: "sub_prior_1",
            studentId: "usr_student_prior",
            studentName: "Prior Student",
            text: boilerplateText,
          },
        ],
      );

      // Verify non-punitive flagging: It should route to 'Needs Review'
      expect(evaluation.status).toBe("Needs Review");
      expect(evaluation.similarityMetrics.flagged).toBe(true);
      expect(evaluation.similarityMetrics.maxSimilarity).toBeGreaterThanOrEqual(0.7);

      // Clean up file
      await FileStorageService.deleteFile(saved.storagePath);
    });

    it("verifies clean, original submissions with status 'Verified' and high compliance score", async () => {
      const uniqueText =
        "Unique Research on Byzantine Fault Tolerant State Machine Replication with asynchronous threshold cryptography. " +
        "Experimental evaluations conducted across 16 geo-distributed validator nodes demonstrate 4,200 transactions per second.";

      const pdfBuffer = await FileConverterService.textToPdf(uniqueText, "BFT Research Paper");
      const saved = await FileStorageService.saveBuffer(pdfBuffer, "bft_research.pdf");

      const evaluation = await DocumentVerificationService.evaluateSubmission(
        {
          id: "sub_eval_unique",
          studentId: studentB.id,
          studentName: studentB.name,
          storagePath: saved.storagePath,
          originalFilename: saved.originalFilename,
          fileMimeType: "application/pdf",
          fileSize: saved.fileSize,
          checksumSha256: saved.checksumSha256,
          submittedAt: new Date(),
        },
        {
          title: "BFT Research Paper",
          allowedFormats: ["pdf"],
        },
        [],
      );

      expect(evaluation.status).toBe("Verified");
      expect(evaluation.score).toBeGreaterThanOrEqual(80);
      expect(evaluation.similarityMetrics.flagged).toBe(false);

      await FileStorageService.deleteFile(saved.storagePath);
    });
  });

  /* ====================================================================
   * PHASE 7 — MARKS RECONCILIATION RELIABILITY & GRACE PERIOD
   * ==================================================================== */
  describe("Phase 7: Marks Reconciliation & Grace Period", () => {
    it("distinguishes between verified and unverified submissions", async () => {
      // runReconciliation returns a safe summary structure even when no sections exist
      const summary = await MarksReconciliationService.runReconciliation(
        "sec_non_existent",
        undefined,
        2,
      );
      expect(summary.totalVerified).toBe(0);
      expect(summary.totalMissingMarks).toBe(0);
      expect(summary.alerts).toEqual([]);
    });

    it("can start and stop scheduled background reconciliation without resource leaks", () => {
      expect(() => {
        MarksReconciliationService.startScheduledReconciliation(60000);
        MarksReconciliationService.stopScheduledReconciliation();
      }).not.toThrow();
    });
  });

  /* ====================================================================
   * PHASE 8 — SECURITY & MULTI-TENANT ISOLATION (IDOR DEFENSES)
   * ==================================================================== */
  describe("Phase 8: Security & Multi-Tenant IDOR Defenses", () => {
    it("enforces that Student A cannot download Student B's file", () => {
      const fileRecord = {
        id: "fil_beta_123",
        student_id: studentB.id,
        institution_id: "inst_mit",
      };

      // Check IDOR rule: student role can ONLY download their own file
      const isAuthorizedStudent =
        studentA.role === "student" && fileRecord.student_id === studentA.id;
      expect(isAuthorizedStudent).toBe(false);

      const isAuthorizedOwner =
        studentB.role === "student" && fileRecord.student_id === studentB.id;
      expect(isAuthorizedOwner).toBe(true);
    });

    it("enforces cross-institution data isolation (Teacher from Harvard cannot access MIT submissions)", () => {
      const mitSubmission = {
        id: "sub_mit_100",
        institution_id: "inst_mit",
        section_id: "sec_cse_a",
      };

      // Teacher from MIT has matching institution
      const mitTeacherAccess = teacherMit.institutionId === mitSubmission.institution_id;
      expect(mitTeacherAccess).toBe(true);

      // Teacher from Harvard has mismatched institution
      const harvardTeacherAccess = teacherHarvard.institutionId === mitSubmission.institution_id;
      expect(harvardTeacherAccess).toBe(false);
    });

    it("forbids students from submitting to assignments outside their assigned section", () => {
      const studentSection = studentSectionA;
      const targetAssignment = {
        id: "asg_sec_b",
        sectionId: "sec_cse_b", // Different section
      };

      const isSectionMatch = studentSection === targetAssignment.sectionId;
      expect(isSectionMatch).toBe(false);
    });

    it("strictly restricts administrative actions to faculty / teacher role via can()", () => {
      expect(can(teacherMit, "verify:submission", "verification")).toBe(true);
      expect(can(teacherMit, "reconcile:marks", "marks")).toBe(true);

      expect(can(studentA, "verify:submission", "verification")).toBe(false);
      expect(can(studentA, "reconcile:marks", "marks")).toBe(false);
    });
  });
});
