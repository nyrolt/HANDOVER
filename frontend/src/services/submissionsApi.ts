import { api, ApiResponse } from "./api";
import type {
  AssignmentSubmission,
  SubmissionStatus,
  VerificationJob,
  VerificationResult,
  MarksReconciliationAlert,
  Notification,
} from "@/types";

export interface SubmissionDetailsResponse extends Partial<AssignmentSubmission> {
  id: string;
  assignmentId?: string;
  assignment_id?: string;
  studentId?: string;
  student_id?: string;
  studentName?: string;
  student_name?: string;
  rollNumber?: string;
  roll_number?: string;
  status?: SubmissionStatus;
  submissionVersion?: number;
  submission_version?: number;
  originalFilename?: string;
  original_filename?: string;
  fileSize?: number;
  file_size?: number;
  teacherReviewNotes?: string;
  teacher_review_notes?: string;
  createdAt?: string;
  created_at?: string;
  files?: Array<{
    id: string;
    fileRole: string;
    originalFilename: string;
    fileMimeType: string;
    fileSize: number;
  }>;
  result_id?: string;
  result_status?: string;
  verification_score?: number;
  verification_checks?: Array<{ name: string; passed: boolean; score: number; details: string }>;
  similarity_metrics?: {
    maxSimilarity: number;
    matchedSubmissionId?: string;
    matchedStudentName?: string;
    flagged: boolean;
  };
  verification_summary?: string;
  verification_notes?: string;
}

export interface QueueProgressResponse {
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

export interface ReconciliationResponse {
  sectionId: string;
  totalVerified: number;
  totalWithMarks: number;
  totalMissingMarks: number;
  alerts: MarksReconciliationAlert[];
}

export interface ConversionResponse {
  originalFilename: string;
  convertedFilename: string;
  fileMimeType: string;
  fileSize: number;
  convertedBase64: string;
  extractedText: string;
}

export const submissionsApi = {
  /**
   * Submit an assignment with file
   */
  async submitAssignment(payload: {
    assignmentId: string;
    sectionId?: string;
    filename: string;
    fileBase64: string;
    autoConvertDocx?: boolean;
  }): Promise<ApiResponse<{ submission: AssignmentSubmission; convertedFile?: unknown }>> {
    return api.post("/api/submissions", payload);
  },

  /**
   * List submissions
   */
  async getSubmissions(filters?: {
    assignmentId?: string;
    sectionId?: string;
    studentId?: string;
    status?: string;
  }): Promise<ApiResponse<SubmissionDetailsResponse[]>> {
    return api.get("/api/submissions", { params: filters });
  },

  /**
   * Get submission details with verification results
   */
  async getSubmissionDetails(id: string): Promise<ApiResponse<SubmissionDetailsResponse>> {
    return api.get(`/api/submissions/${id}`);
  },

  /**
   * Standalone file format converter
   */
  async convertFile(payload: {
    filename: string;
    fileBase64: string;
    targetFormat?: "pdf" | "png" | "jpg";
  }): Promise<ApiResponse<ConversionResponse>> {
    return api.post("/api/submissions/convert", payload);
  },

  /**
   * Teacher review
   */
  async reviewSubmission(
    id: string,
    payload: { status: "Approved" | "Rejected" | "Resubmission Requested"; reviewNotes?: string },
  ): Promise<ApiResponse<AssignmentSubmission>> {
    return api.post(`/api/submissions/${id}/review`, payload);
  },

  /**
   * Bulk verification trigger
   */
  async triggerBulkVerification(payload: {
    assignmentId?: string;
    sectionId?: string;
    submissionIds?: string[];
  }): Promise<ApiResponse<{ batchId: string; queuedCount: number }>> {
    return api.post("/api/verification/bulk", payload);
  },

  /**
   * Verification queue live progress
   */
  async getQueueProgress(batchId?: string): Promise<ApiResponse<QueueProgressResponse>> {
    return api.get("/api/verification/queue", { params: { batchId } });
  },

  /**
   * Run Marks Reconciliation
   */
  async runReconciliation(
    sectionId: string,
    assignmentId?: string,
  ): Promise<ApiResponse<ReconciliationResponse>> {
    return api.post("/api/marks/reconciliation/run", { sectionId, assignmentId });
  },

  /**
   * Get open Marks Reconciliation alerts
   */
  async getReconciliationAlerts(
    sectionId?: string,
  ): Promise<ApiResponse<MarksReconciliationAlert[]>> {
    return api.get("/api/marks/reconciliation/alerts", { params: { sectionId } });
  },

  /**
   * Resolve an alert
   */
  async resolveReconciliationAlert(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return api.post(`/api/marks/reconciliation/alerts/${id}/resolve`);
  },

  /**
   * Get user notifications
   */
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return api.get("/api/notifications");
  },

  /**
   * Mark notification as read
   */
  async markNotificationRead(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return api.patch(`/api/notifications/${id}/read`);
  },

  /**
   * Mark all notifications read
   */
  async markAllNotificationsRead(): Promise<ApiResponse<{ success: boolean }>> {
    return api.post("/api/notifications/read-all");
  },
};
