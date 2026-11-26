import { db } from "./db";
import type {
  Student,
  StudentMarks,
  Section,
  ProjectGroup,
  GroupRequest,
  Assignment,
  Announcement,
} from "@/types";
import { computeGrade } from "./teacher";

export interface StudentDashboardData {
  student: Student;
  section: Section | null;
  marks: StudentMarks | null;
  grade: string;
  percentage: number;
  approvedGroup: ProjectGroup | null;
  pendingRequest: GroupRequest | null;
  assignments: Assignment[];
  announcements: Announcement[];
}

export function getStudentDashboardData(studentId: string): StudentDashboardData | null {
  const student = db.getStudentById(studentId);
  if (!student) return null;

  const section = db.getSectionById(student.sectionId) || null;
  const marks = db.getStudentMarks(student.id) || null;

  const total = marks?.total ?? 0;
  const maxTotal = marks?.maxTotal ?? 80;
  const percentage = Math.round((total / maxTotal) * 100);
  const grade = computeGrade(total, maxTotal);

  // Group status
  const approvedGroup =
    db
      .getProjectGroups(student.sectionId)
      .find(
        (g) => g.id === student.projectGroupId || g.members.some((m) => m.studentId === student.id),
      ) || null;

  const pendingRequest =
    db
      .getGroupRequests(student.sectionId)
      .find((r) => r.studentId === student.id && r.status === "Pending") || null;

  const assignments = db.getAssignments(student.sectionId);
  const announcements = db.getAnnouncements(student.sectionId);

  return {
    student,
    section,
    marks,
    grade,
    percentage,
    approvedGroup,
    pendingRequest,
    assignments,
    announcements,
  };
}
