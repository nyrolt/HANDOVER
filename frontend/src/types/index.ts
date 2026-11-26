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
