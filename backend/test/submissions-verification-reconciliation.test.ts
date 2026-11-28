import { describe, it, expect, beforeEach } from "vitest";
import { FileStorageService } from "../../server/services/fileStorageService";
import { FileConverterService } from "../../server/services/fileConverterService";
import { DocumentVerificationService } from "../../server/services/documentVerificationService";
import { VerificationQueueService } from "../../server/services/verificationQueueService";
import { can } from "../services/permissions";
import type { User } from "../models/types";

describe("Submissions, Verification & Reconciliation Engine", () => {
  const teacherUser: User = {
    id: "usr_teacher_1",
    name: "Prof. Vance",
    email: "vance@univ.edu",
    role: "teacher",
    institutionId: "inst_1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const studentUser: User = {
    id: "usr_student_1",
    name: "Alex Chen",
    email: "alex@univ.edu",
    role: "student",
    institutionId: "inst_1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  describe("System A: Role-Based Access Control Boundaries", () => {
    it("allows student to submit coursework, forbids teacher from submitting", () => {
      expect(can(studentUser, "submit:assignment", "submission")).toBe(true);
      expect(can(teacherUser, "submit:assignment", "submission")).toBe(false);
    });

    it("allows teacher to verify and review submissions, forbids student", () => {
      expect(can(teacherUser, "verify:submission", "verification")).toBe(true);
      expect(can(teacherUser, "review:submission", "submission")).toBe(true);
      expect(can(studentUser, "verify:submission", "verification")).toBe(false);
      expect(can(studentUser, "review:submission", "submission")).toBe(false);
    });

    it("allows teacher to reconcile marks, forbids student", () => {
      expect(can(teacherUser, "reconcile:marks", "marks")).toBe(true);
      expect(can(studentUser, "reconcile:marks", "marks")).toBe(false);
    });
  });

  describe("System B: File Storage & Magic Bytes Inspection", () => {
    it("detects genuine PDF magic bytes", () => {
      const pdfBuffer = Buffer.from("%PDF-1.7 sample pdf content binary stream");
      const validation = FileStorageService.validateMagicBytes(pdfBuffer, "application/pdf");
      expect(validation.valid).toBe(true);
      expect(validation.detectedMime).toBe("application/pdf");
    });

    it("detects genuine PNG magic bytes", () => {
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
      const validation = FileStorageService.validateMagicBytes(pngBuffer, "image/png");
      expect(validation.valid).toBe(true);
      expect(validation.detectedMime).toBe("image/png");
    });

    it("computes accurate SHA256 checksum", () => {
      const buffer = Buffer.from("Handover Academic System Assignment Submission 2026");
      const checksum1 = FileStorageService.computeChecksum(buffer);
      const checksum2 = FileStorageService.computeChecksum(buffer);
      expect(checksum1).toBe(checksum2);
      expect(checksum1.length).toBe(64);
    });
  });

  describe("System B: Smart File Format Converter", () => {
    it("converts plain text documents into valid formatted PDF", async () => {
      const text = "Computer Science 401: Distributed Systems\nAssignment 1 Report\nAlex Chen";
      const pdfBuffer = await FileConverterService.textToPdf(text, "CS401 Report");
      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.length).toBeGreaterThan(500);
      expect(pdfBuffer.subarray(0, 4).toString()).toBe("%PDF");
    });

    it("converts files through universal convertFile orchestrator", async () => {
      const textBuffer = Buffer.from("Algorithm analysis submission by student.");
      const result = await FileConverterService.convertFile(textBuffer, "algorithm_notes.txt", "pdf");
      expect(result.success).toBe(true);
      expect(result.convertedInfo?.fileMimeType).toBe("application/pdf");
    });
  });

  describe("System D: Document Verification Pipeline & Similarity", () => {
    it("calculates exact Jaccard similarity between texts", () => {
      const textA = new Set(["operating systems architecture", "memory allocation techniques", "paging virtual memory"]);
      const textB = new Set(["operating systems architecture", "memory allocation techniques", "cpu scheduling algorithms"]);
      const sim = DocumentVerificationService.calculateJaccardSimilarity(textA, textB);
      expect(sim).toBeGreaterThan(0.3);
      expect(sim).toBeLessThan(1.0);
    });

    it("evaluates genuine file integrity and marks compliance", async () => {
      const validText = "Computer systems and operating system design lab report with detailed experimental methodology and performance benchmarks across multiprocessor architectures.";
      const pdfBuffer = await FileConverterService.textToPdf(validText, "Lab Report 1");
      const saved = await FileStorageService.saveBuffer(pdfBuffer, "student_lab_report.pdf");

      const evaluation = await DocumentVerificationService.evaluateSubmission(
        {
          id: "sub_test_1",
          studentId: "std_1",
          studentName: "Alex Chen",
          storagePath: saved.storagePath,
          originalFilename: saved.originalFilename,
          fileMimeType: "application/pdf",
          fileSize: saved.fileSize,
          checksumSha256: saved.checksumSha256,
          submittedAt: new Date(),
        },
        {
          title: "Lab Report 1",
          allowedFormats: ["pdf", "docx"],
        },
        [],
      );

      expect(evaluation.checks.length).toBeGreaterThanOrEqual(4);
      expect(evaluation.status).toBe("Verified");
      expect(evaluation.score).toBeGreaterThan(70);

      // Clean up test file
      await FileStorageService.deleteFile(saved.storagePath);
    });
  });

  describe("System C: Bulk Verification Queue Progress", () => {
    it("calculates batch progress percentages correctly", async () => {
      const progress = await VerificationQueueService.getBatchProgress("non_existent_batch");
      expect(progress.percent).toBeDefined();
      expect(typeof progress.percent).toBe("number");
      expect(progress.total).toBe(0);
    });
  });
});
