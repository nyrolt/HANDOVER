export type UserRole = "teacher" | "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string | undefined;
  department?: string | undefined;
  institutionId?: string | undefined;
  avatar?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  deletedAt?: string | null | undefined;
}

export interface Section {
  id: string;
  sectionName: string;
  courseName: string;
  academicYear: string;
  teacherId: string;
  institutionId?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  deletedAt?: string | null | undefined;
}

export interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  rollNumber: string;
  sectionId: string;
  institutionId?: string | undefined;
  projectGroupId?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  deletedAt?: string | null | undefined;
}

export interface StudentMarks {
  id: string;
  studentId: string;
  sectionId: string;
  institutionId?: string | undefined;
  internalMarks: number;
  labRecordMarks: number;
  practicalMarks: number;
  projectMarks: number;
  assignmentMarks: number;
  total: number;
  maxTotal: number;
  updatedBy: string;
  updatedAt: string;
  deletedAt?: string | null | undefined;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  sectionId: string;
  institutionId?: string | undefined;
  deadline: string;
  status: "Active" | "Closed";
  createdBy: string;
  createdAt: string;
  updatedAt?: string | undefined;
  deletedAt?: string | null | undefined;
}

export interface ProjectGroupMember {
  studentId: string;
  studentName: string;
  rollNumber: string;
  role: "Leader" | "Member";
}

export interface ProjectGroup {
  id: string;
  groupName: string;
  projectTitle: string;
  sectionId: string;
  institutionId?: string | undefined;
  projectDescription: string;
  guide: string;
  status: "In Progress" | "Pending Review" | "Completed";
  projectMarks: number;
  maxProjectMarks: number;
  approvedBy: string;
  members: ProjectGroupMember[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null | undefined;
}

export interface GroupRequest {
  id: string;
  studentId: string;
  studentName: string;
  proposedGroupName: string;
  proposedProjectTitle: string;
  proposedMembers: string[];
  sectionId: string;
  institutionId?: string | undefined;
  status: "Pending" | "Approved" | "Rejected";
  reviewedBy?: string | undefined;
  feedback?: string | undefined;
  createdAt: string;
  updatedAt?: string | undefined;
  deletedAt?: string | null | undefined;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  sectionId: string;
  institutionId?: string | undefined;
  teacherName: string;
  createdAt: string;
  updatedAt?: string | undefined;
  deletedAt?: string | null | undefined;
  priority?: "normal" | "important" | undefined;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  institutionId?: string | undefined;
  type: "student" | "assignment" | "project" | "marks" | "section";
}

export type SubmissionStatus =
  | "Not Submitted"
  | "Uploading"
  | "Submitted"
  | "Queued for Verification"
  | "Scanning"
  | "Verified"
  | "Needs Teacher Review"
  | "Rejected"
  | "Resubmission Required"
  | "Processing Failed";

export type VerificationStatus =
  "Pending" | "Queued" | "Scanning" | "Verified" | "Needs Review" | "Invalid File" | "Failed";

export type TeacherReviewStatus = "Pending" | "Approved" | "Rejected" | "Resubmission Requested";

export interface AssignmentSubmission {
  id: string;
  institutionId?: string | undefined;
  sectionId: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  status: SubmissionStatus;
  verificationStatus: VerificationStatus;
  teacherReviewStatus: TeacherReviewStatus;
  teacherReviewNotes?: string | undefined;
  reviewedBy?: string | undefined;
  reviewedAt?: string | undefined;
  submissionVersion: number;
  isLatest: boolean;
  convertedFromFormat?: string | undefined;
  originalFilename: string;
  storedFilename: string;
  storagePath: string;
  fileMimeType: string;
  fileSize: number;
  checksumSha256: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null | undefined;
}

export interface SubmissionFile {
  id: string;
  submissionId: string;
  fileRole: "original" | "converted" | "extracted_text" | "thumbnail";
  originalFilename: string;
  storedFilename: string;
  storagePath: string;
  fileMimeType: string;
  fileSize: number;
  checksumSha256: string;
  createdAt: string;
}

export type VerificationJobStatus =
  "PENDING" | "QUEUED" | "PROCESSING" | "COMPLETED" | "NEEDS_REVIEW" | "FAILED";

export interface VerificationJob {
  id: string;
  institutionId?: string | undefined;
  sectionId: string;
  assignmentId: string;
  submissionId: string;
  studentId: string;
  batchId: string;
  status: VerificationJobStatus;
  attemptCount: number;
  maxAttempts: number;
  queuePosition: number;
  priority: number;
  workerId?: string | undefined;
  startedAt?: string | undefined;
  completedAt?: string | undefined;
  errorMessage?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationResult {
  id: string;
  jobId?: string | undefined;
  submissionId: string;
  overallStatus: "Verified" | "Needs Teacher Review" | "Invalid File" | "Processing Failed";
  integrityStatus: string;
  formatValid: boolean;
  metadataFindings: {
    creationDate?: string;
    modificationDate?: string;
    author?: string;
    creator?: string;
    producer?: string;
    pageCount?: number;
    wordCount?: number;
    suspiciousFlags?: string[];
  };
  textSimilarityFindings: {
    maxSimilarityScore: number;
    matchedSubmissionId?: string;
    matchedStudentName?: string;
    matchedSnippet?: string;
    isFlagged: boolean;
  };
  imageSimilarityFindings: {
    maxVisualSimilarity: number;
    matchedSubmissionId?: string;
    isFlagged: boolean;
  };
  warnings: string[];
  recommendation: string;
  confidenceScore: number;
  createdAt: string;
}

export interface MarksReconciliationAlert {
  id: string;
  institutionId?: string | undefined;
  sectionId: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  rollNumber?: string;
  assignmentTitle?: string;
  submissionId: string;
  status: "ACTIVE" | "RESOLVED" | "DISMISSED";
  daysPending: number;
  reminderCount: number;
  lastRemindedAt?: string | undefined;
  resolvedAt?: string | undefined;
  resolvedBy?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType =
  | "submission_received"
  | "verification_completed"
  | "needs_review"
  | "invalid_file"
  | "resubmission_required"
  | "processing_failed"
  | "marks_pending"
  | "marks_reconciliation"
  | "general";

export interface Notification {
  id: string;
  institutionId?: string | undefined;
  recipientUserId: string;
  recipientRole: "teacher" | "student" | "admin";
  title: string;
  message: string;
  type: NotificationType;
  relatedAssignmentId?: string | undefined;
  relatedSubmissionId?: string | undefined;
  isRead: boolean;
  readAt?: string | undefined;
  createdAt: string;
}
