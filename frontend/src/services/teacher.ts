import { db } from "./db";
import type { Student, StudentMarks, Section } from "@/types";

export interface SpreadsheetRow {
  studentId: string;
  rollNumber: string;
  name: string;
  email: string;
  sectionId: string;
  sectionName: string;
  projectGroupName: string;
  internalMarks: number;
  labRecordMarks: number;
  practicalMarks: number;
  projectMarks: number;
  assignmentMarks: number;
  total: number;
  maxTotal: number;
  grade: string;
}

export function computeGrade(total: number, maxTotal = 80): string {
  const pct = (total / maxTotal) * 100;
  if (pct >= 90) return "O (Outstanding)";
  if (pct >= 80) return "A+ (Excellent)";
  if (pct >= 70) return "A (Very Good)";
  if (pct >= 60) return "B+ (Good)";
  if (pct >= 50) return "B (Above Average)";
  if (pct >= 40) return "C (Pass)";
  return "F (Fail)";
}

export function getSectionSpreadsheetRows(sectionId: string): SpreadsheetRow[] {
  const section = db.getSectionById(sectionId);
  const students = db.getStudents(sectionId);
  const marksList = db.getMarks(sectionId);
  const groups = db.getProjectGroups(sectionId);

  return students.map((student) => {
    const mark = marksList.find((m) => m.studentId === student.id);
    const group = groups.find(
      (g) => g.id === student.projectGroupId || g.members.some((m) => m.studentId === student.id),
    );

    const internal = mark?.internalMarks ?? 0;
    const lab = mark?.labRecordMarks ?? 0;
    const practical = mark?.practicalMarks ?? 0;
    const project = mark?.projectMarks ?? 0;
    const assignment = mark?.assignmentMarks ?? 0;
    const total = internal + lab + practical + project;
    const maxTotal = mark?.maxTotal ?? 80;

    return {
      studentId: student.id,
      rollNumber: student.rollNumber,
      name: student.name,
      email: student.email,
      sectionId: student.sectionId,
      sectionName: section?.sectionName || "General",
      projectGroupName: group?.groupName || "Unassigned",
      internalMarks: internal,
      labRecordMarks: lab,
      practicalMarks: practical,
      projectMarks: project,
      assignmentMarks: assignment,
      total,
      maxTotal,
      grade: computeGrade(total, maxTotal),
    };
  });
}

export function exportToCSV(section: Section | undefined, rows: SpreadsheetRow[]): void {
  const headers = [
    "Roll No",
    "Student Name",
    "Email",
    "Section",
    "Project Group",
    "Internal (/20)",
    "Lab (/20)",
    "Practical (/20)",
    "Project (/20)",
    "Total (/80)",
    "Grade",
  ];

  const csvRows = [headers.join(",")];

  rows.forEach((r) => {
    const line = [
      `"${r.rollNumber}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${r.sectionName.replace(/"/g, '""')}"`,
      `"${r.projectGroupName.replace(/"/g, '""')}"`,
      r.internalMarks,
      r.labRecordMarks,
      r.practicalMarks,
      r.projectMarks,
      r.total,
      `"${r.grade}"`,
    ];
    csvRows.push(line.join(","));
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const filename = section?.sectionName
    ? `${section.sectionName.replace(/\s+/g, "_")}_Marksheet.csv`
    : "Section_Marksheet.csv";
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseAndImportCSV(
  csvText: string,
  sectionId: string,
): { addedCount: number; errors: string[] } {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1 || !lines[0]) {
    return { addedCount: 0, errors: ["CSV file is empty or missing data rows."] };
  }

  const dataLines = lines.slice(1);
  let addedCount = 0;
  const errors: string[] = [];

  dataLines.forEach((line, idx) => {
    // Simple comma split handling quotes
    const parts = line.split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
    if (parts.length < 2) return;

    // Expected format: RollNo, Name, Email (optional rest)
    const rollNo = parts[0];
    const name = parts[1];
    if (!rollNo || !name) {
      errors.push(`Row ${idx + 2}: Missing roll number or name.`);
      return;
    }

    const email = parts[2] || `${name.toLowerCase().replace(/\s+/g, ".")}@college.edu`;

    try {
      // Check if student already exists
      const existing = db
        .getStudents(sectionId)
        .find((s) => s.rollNumber === rollNo || s.email === email);
      if (!existing) {
        db.addStudent({
          rollNumber: rollNo,
          name,
          email,
          sectionId,
        });
        addedCount++;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Import error";
      errors.push(`Row ${idx + 2}: ${msg}`);
    }
  });

  return { addedCount, errors };
}
