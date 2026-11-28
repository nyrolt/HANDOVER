import fs from "fs";
import zlib from "zlib";
import { FileStorageService } from "./fileStorageService";
import mammoth from "mammoth";

export interface VerificationCheckItem {
  name: string;
  passed: boolean;
  score: number;
  details: string;
}

export interface VerificationSimilarityMatch {
  submissionId: string;
  studentId: string;
  studentName: string;
  similarityScore: number;
}

export interface VerificationEvaluation {
  status: "Verified" | "Needs Review" | "Invalid File" | "Failed";
  score: number; // 0 - 100
  checks: VerificationCheckItem[];
  similarityMetrics: {
    maxSimilarity: number;
    matchedSubmissionId?: string;
    matchedStudentName?: string;
    flagged: boolean;
  };
  summary: string;
  notes: string;
  extractedWordCount: number;
}

export interface ExistingSubmissionText {
  submissionId: string;
  studentId: string;
  studentName: string;
  text: string;
}

export class DocumentVerificationService {
  /**
   * Tokenizes text into normalized word list.
   */
  private static tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);
  }

  /**
   * Generates 3-word shingles for similarity comparison.
   */
  private static getShingles(tokens: string[], n = 3): Set<string> {
    const shingles = new Set<string>();
    for (let i = 0; i <= tokens.length - n; i++) {
      shingles.add(tokens.slice(i, i + n).join(" "));
    }
    return shingles;
  }

  /**
   * Computes Jaccard similarity between two shingle sets.
   */
  public static calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 || setB.size === 0) return 0;
    let intersection = 0;
    for (const item of setA) {
      if (setB.has(item)) intersection++;
    }
    const union = setA.size + setB.size - intersection;
    return union === 0 ? 0 : Number((intersection / union).toFixed(4));
  }

  /**
   * Extracts text from file path according to extension.
   */
  public static async extractTextFromFile(filePath: string, filename: string): Promise<string> {
    try {
      if (!fs.existsSync(filePath)) return "";
      const ext = filename.split(".").pop()?.toLowerCase() || "";
      const buffer = await fs.promises.readFile(filePath);

      if (ext === "txt") {
        return buffer.toString("utf-8");
      }
      if (ext === "docx" || ext === "doc") {
        const res = await mammoth.extractRawText({ buffer });
        return res.value || "";
      }
      if (ext === "pdf") {
        const textParts: string[] = [];
        // Scan for streams (both compressed and uncompressed)
        const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
        const binaryContent = buffer.toString("binary");
        let streamMatch;

        while ((streamMatch = streamRegex.exec(binaryContent)) !== null) {
          const rawStream = Buffer.from(streamMatch[1] || "", "binary");
          try {
            const decompressed = zlib.inflateSync(rawStream).toString("utf-8");
            const textRegex = /\(([^)]+)\)\s*T[jJ]/g;
            let m;
            while ((m = textRegex.exec(decompressed)) !== null) {
              if (m[1]) textParts.push(m[1]);
            }
          } catch {
            // Not compressed or raw stream
            const textRegex = /\(([^)]+)\)\s*T[jJ]/g;
            let m;
            while ((m = textRegex.exec(streamMatch[1] || "")) !== null) {
              if (m[1]) textParts.push(m[1]);
            }
          }
        }

        if (textParts.length > 0) {
          return textParts.join(" ");
        }

        // Fallback: search for readable ASCII words in buffer
        const asciiWords = buffer
          .toString("ascii")
          .replace(/[^a-zA-Z0-9\s]/g, " ")
          .split(/\s+/)
          .filter((w) => w.length > 3);
        return asciiWords.slice(0, 100).join(" ");
      }
    } catch {
      // Text extraction fallback
    }
    return "";
  }

  /**
   * Evaluates submission against integrity, format, requirements, and peer similarity.
   */
  public static async evaluateSubmission(
    submission: {
      id: string;
      studentId: string;
      studentName: string;
      storagePath: string;
      originalFilename: string;
      fileMimeType: string;
      fileSize: number;
      checksumSha256: string;
      submittedAt: Date | string;
    },
    assignment: {
      title: string;
      deadline?: string | Date;
      maxSizeBytes?: number;
      allowedFormats?: string[];
    },
    peerSubmissions: ExistingSubmissionText[] = [],
  ): Promise<VerificationEvaluation> {
    const checks: VerificationCheckItem[] = [];
    let passedChecks = 0;
    const totalChecks = 4;

    // 1. File Integrity & Disk Check
    const fileExists = fs.existsSync(submission.storagePath);
    let diskChecksum = "";
    let integrityPassed = false;
    let fileBuffer: Buffer | null = null;

    if (fileExists) {
      fileBuffer = await fs.promises.readFile(submission.storagePath);
      diskChecksum = FileStorageService.computeChecksum(fileBuffer);
      integrityPassed = diskChecksum === submission.checksumSha256 && fileBuffer.length > 0;
    }

    checks.push({
      name: "File Integrity & Storage Check",
      passed: integrityPassed,
      score: integrityPassed ? 100 : 0,
      details: integrityPassed
        ? `Checksum verified: ${diskChecksum.substring(0, 12)}... (${fileBuffer?.length} bytes)`
        : fileExists
        ? "Checksum mismatch: file may have been altered or corrupted on disk."
        : "File not found on storage disk.",
    });
    if (integrityPassed) passedChecks++;

    // 2. Binary Magic Bytes Validation
    let magicPassed = false;
    let magicMsg = "";
    if (fileBuffer) {
      const magic = FileStorageService.validateMagicBytes(fileBuffer, submission.fileMimeType);
      magicPassed = magic.valid;
      magicMsg = magic.valid
        ? `Valid binary signature detected (${magic.detectedMime})`
        : `Invalid file signature: header mismatch.`;
    }
    checks.push({
      name: "Binary Header & MIME Verification",
      passed: magicPassed,
      score: magicPassed ? 100 : 0,
      details: magicMsg,
    });
    if (magicPassed) passedChecks++;

    // 3. Academic Requirements & Constraints
    const allowed = (assignment.allowedFormats && assignment.allowedFormats.length > 0)
      ? assignment.allowedFormats
      : ["pdf", "docx", "txt", "zip", "png", "jpg", "jpeg"];
    const ext = submission.originalFilename.split(".").pop()?.toLowerCase() || "";
    const formatAllowed = allowed.includes(ext);
    const maxSize = assignment.maxSizeBytes || 25 * 1024 * 1024; // 25 MB
    const sizeOk = submission.fileSize <= maxSize && submission.fileSize > 0;

    let deadlinePassed = true;
    if (assignment.deadline) {
      const deadlineDate = new Date(assignment.deadline).getTime();
      const subDate = new Date(submission.submittedAt).getTime();
      deadlinePassed = subDate <= deadlineDate + 5 * 60 * 1000; // 5 min grace window
    }

    const reqPassed = formatAllowed && sizeOk;
    checks.push({
      name: "Assignment Guidelines & Format Compliance",
      passed: reqPassed,
      score: reqPassed ? (deadlinePassed ? 100 : 80) : 0,
      details: `Format: .${ext} (${formatAllowed ? "Permitted" : "Disallowed"}), Size: ${(
        submission.fileSize / 1024
      ).toFixed(1)} KB (Max: ${(maxSize / (1024 * 1024)).toFixed(0)} MB), Deadline: ${
        deadlinePassed ? "On-Time" : "Late Submission"
      }`,
    });
    if (reqPassed) passedChecks++;

    // 4. Content Inspection & Pairwise Similarity Check
    const extractedText = await this.extractTextFromFile(submission.storagePath, submission.originalFilename);
    const tokens = this.tokenize(extractedText);
    const wordCount = tokens.length;
    const shingles = this.getShingles(tokens);

    let maxSim = 0;
    let matchedSubId: string | undefined;
    let matchedStudent: string | undefined;

    for (const peer of peerSubmissions) {
      if (peer.submissionId === submission.id || peer.studentId === submission.studentId) continue;
      const peerTokens = this.tokenize(peer.text);
      const peerShingles = this.getShingles(peerTokens);
      const sim = this.calculateJaccardSimilarity(shingles, peerShingles);
      if (sim > maxSim) {
        maxSim = sim;
        matchedSubId = peer.submissionId;
        matchedStudent = peer.studentName;
      }
    }

    const similarityFlagged = maxSim >= 0.70; // > 70% content overlap
    const similarityPassed = !similarityFlagged;

    checks.push({
      name: "Cross-Submission Similarity & Originality Check",
      passed: similarityPassed,
      score: Math.max(0, Math.round((1 - maxSim) * 100)),
      details: wordCount < 10
        ? `Document contains minimal or no extractable text (${wordCount} words detected).`
        : similarityFlagged
        ? `High peer similarity detected (${(maxSim * 100).toFixed(1)}% match with ${
            matchedStudent || "another submission"
          }). Flagged for manual review.`
        : `Verified original. Max peer similarity: ${(maxSim * 100).toFixed(1)}% (${wordCount} words).`,
    });
    if (similarityPassed) passedChecks++;

    // Overall Status Determination
    let status: "Verified" | "Needs Review" | "Invalid File" | "Failed" = "Verified";
    const isEmptyFile = submission.fileSize < 100 || (wordCount < 5 && ["txt", "docx", "doc"].includes(ext));
    if (!integrityPassed || !magicPassed) {
      status = "Invalid File";
    } else if (similarityFlagged || !reqPassed || !deadlinePassed || isEmptyFile) {
      status = "Needs Review";
    } else {
      status = "Verified";
    }

    const totalScore = Math.round(
      checks.reduce((acc, c) => acc + (c.score || 0), 0) / checks.length,
    );

    return {
      status,
      score: totalScore,
      checks,
      similarityMetrics: {
        maxSimilarity: maxSim,
        matchedSubmissionId: matchedSubId,
        matchedStudentName: matchedStudent,
        flagged: similarityFlagged,
      },
      summary:
        status === "Verified"
          ? "All automated verification criteria satisfied. Document intact, original, and compliant."
          : status === "Needs Review"
          ? `Document flagged for teacher attention: ${similarityFlagged ? "High similarity detected" : "Formatting or deadline anomaly"}.`
          : "Verification failed: Corrupt binary or invalid file signature.",
      notes: `Evaluated by Handover Automated Verification Engine v2.0 on ${new Date().toISOString()}`,
      extractedWordCount: wordCount,
    };
  }
}
