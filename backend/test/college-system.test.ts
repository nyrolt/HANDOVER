import { describe, expect, it, beforeEach } from "vitest";
import { db } from "../services/db";
import { authService } from "../services/auth";
import { computeGrade, getSectionSpreadsheetRows, parseAndImportCSV } from "../services/teacher";
import { getStudentDashboardData } from "../services/student";

describe("College Management System - Database & Business Logic", () => {
  beforeEach(() => {
    db.resetToDefault();
  });

  it("initializes with realistic academic data matching university standards", () => {
    const sections = db.getSections();
    const students = db.getStudents();
    const marks = db.getMarks();
    const groups = db.getProjectGroups();

    expect(sections.length).toBeGreaterThanOrEqual(3);
    expect(students.length).toBeGreaterThanOrEqual(8);
    expect(marks.length).toBeGreaterThanOrEqual(8);
    expect(groups.length).toBeGreaterThanOrEqual(2);

    // Verify real student record:
    // Roll 2024-CS-001 Alexander Wright: 18, 19, 17, 18, total 72
    const alexander = students.find((s) => s.name === "Alexander Wright")!;
    expect(alexander).toBeDefined();
    const alexanderMarks = db.getStudentMarks(alexander.id)!;
    expect(alexanderMarks.internalMarks).toBe(18);
    expect(alexanderMarks.labRecordMarks).toBe(19);
    expect(alexanderMarks.practicalMarks).toBe(17);
    expect(alexanderMarks.projectMarks).toBe(18);
    expect(alexanderMarks.total).toBe(72);
  });

  it("correctly calculates total marks and clamps values within [0, 20]", () => {
    const student = db.getStudents()[0]!;

    // Update marks with valid values
    const updated = db.updateStudentMarks(
      student.id,
      {
        internalMarks: 20,
        labRecordMarks: 18,
        practicalMarks: 19,
        projectMarks: 17,
      },
      "Dr. Eleanor Vance, Ph.D.",
    )!;

    expect(updated.total).toBe(74); // 20 + 18 + 19 + 17

    // Test boundary clamping: values > 20 should be clamped to 20
    const clampedHigh = db.updateStudentMarks(
      student.id,
      {
        internalMarks: 25,
      },
      "Dr. Eleanor Vance, Ph.D.",
    )!;
    expect(clampedHigh.internalMarks).toBe(20);

    // Test negative clamping: values < 0 should be clamped to 0
    const clampedLow = db.updateStudentMarks(
      student.id,
      {
        internalMarks: -5,
      },
      "Dr. Eleanor Vance, Ph.D.",
    )!;
    expect(clampedLow.internalMarks).toBe(0);
  });

  it("computes academic letter grades accurately", () => {
    expect(computeGrade(76, 80)).toBe("O (Outstanding)"); // 95%
    expect(computeGrade(68, 80)).toBe("A+ (Excellent)"); // 85%
    expect(computeGrade(58, 80)).toBe("A (Very Good)"); // 72.5%
    expect(computeGrade(50, 80)).toBe("B+ (Good)"); // 62.5%
    expect(computeGrade(42, 80)).toBe("B (Above Average)"); // 52.5%
    expect(computeGrade(34, 80)).toBe("C (Pass)"); // 42.5%
    expect(computeGrade(25, 80)).toBe("F (Fail)"); // 31.25%
  });

  it("manages sections with independent student records", () => {
    // Create new section
    const newSection = db.createSection({
      sectionName: "CS-405: Distributed Databases (Sec C)",
      courseName: "B.S. Computer Science",
      academicYear: "2026-2027",
      teacherId: "usr-faculty-vance",
    });

    expect(db.getSectionById(newSection.id)).toBeDefined();

    // Add student to new section
    const newStudent = db.addStudent({
      name: "Hannah Lee",
      email: "h.lee@student.university.edu",
      rollNumber: "2024-CS-050",
      sectionId: newSection.id,
    });

    const secStudents = db.getStudents(newSection.id);
    expect(secStudents.length).toBe(1);
    expect(secStudents[0]?.name).toBe("Hannah Lee");

    // Records do not mix between sections
    const cseStudents = db.getStudents("sec-cse-a");
    expect(cseStudents.some((s) => s.id === newStudent.id)).toBe(false);
  });

  it("supports group projects: student proposals and teacher approval workflow", () => {
    const student = db.getStudents("sec-cse-b")[0]!;

    // Student proposes a group
    const request = db.submitGroupRequest({
      studentId: student.id,
      studentName: student.name,
      proposedGroupName: "Team Quantum",
      proposedProjectTitle: "Quantum Cryptography Protocol Simulator",
      proposedMembers: ["Ethan Takahashi", "Maya Johnson"],
      sectionId: student.sectionId,
    });

    expect(request.status).toBe("Pending");
    expect(db.getGroupRequests(student.sectionId).some((r) => r.id === request.id)).toBe(true);

    // Teacher reviews and approves proposal
    const approved = db.reviewGroupRequest(request.id, "Approved", "Dr. Eleanor Vance, Ph.D.");
    expect(approved).toBe(true);

    // Official group should now be created
    const createdGroup = db
      .getProjectGroups(student.sectionId)
      .find((g) => g.groupName === "Team Quantum")!;
    expect(createdGroup).toBeDefined();
    expect(createdGroup.projectTitle).toBe("Quantum Cryptography Protocol Simulator");
    expect(createdGroup.members.length).toBeGreaterThanOrEqual(1);

    // Student's dashboard should now reflect approved group
    const studentData = getStudentDashboardData(student.id)!;
    expect(studentData.approvedGroup?.groupName).toBe("Team Quantum");
  });

  it("parses and imports students from CSV text accurately", () => {
    const csvContent = `Roll No,Student Name,Email
2024-CS-020,Lucas Miller,l.miller@student.university.edu
2024-CS-021,Emma Davis,e.davis@student.university.edu`;

    const result = parseAndImportCSV(csvContent, "sec-cse-a");
    expect(result.addedCount).toBe(2);
    expect(result.errors.length).toBe(0);

    const imported = db.getStudents("sec-cse-a").find((s) => s.rollNumber === "2024-CS-020")!;
    expect(imported).toBeDefined();
    expect(imported.name).toBe("Lucas Miller");
  });

  it("provides student dashboard data with strictly read-only marks", () => {
    const alexander = db.getStudents().find((s) => s.name === "Alexander Wright")!;
    const dashData = getStudentDashboardData(alexander.id)!;

    expect(dashData.student.name).toBe("Alexander Wright");
    expect(dashData.marks?.total).toBe(72);
    expect(dashData.approvedGroup?.groupName).toBe("Team Veritas");
    expect(dashData.assignments.length).toBeGreaterThan(0);
    expect(dashData.announcements.length).toBeGreaterThan(0);
  });

  it("handles student registration, creates section link, and routes to student role", () => {
    const regResult = authService.registerStudent({
      name: "Lucas Vance",
      email: "l.vance@student.university.edu",
      rollNumber: "2024-CS-099",
      sectionId: "sec-cse-a",
      password: "Password@123",
    });

    expect(regResult.success).toBe(true);
    expect(regResult.role).toBe("student");

    // Student profile should exist in DB
    const student = db
      .getStudents("sec-cse-a")
      .find((s) => s.email === "l.vance@student.university.edu");
    expect(student).toBeDefined();
    expect(student?.name).toBe("Lucas Vance");
    expect(student?.rollNumber).toBe("2024-CS-099");

    // Initial marks should be initialized
    const marks = db.getStudentMarks(student!.id);
    expect(marks).toBeDefined();
    expect(marks?.total).toBe(0);

    // Active session should reflect the new student
    const session = authService.getSession();
    expect(session?.user.role).toBe("student");
    expect(session?.studentProfile?.name).toBe("Lucas Vance");
  });

  it("handles faculty registration and creates initial department section", () => {
    const teacherRegResult = authService.registerTeacher({
      name: "Dr. Marcus Brody",
      email: "m.brody@university.edu",
      department: "Data Science & AI",
      initialSectionName: "DS-101: Foundation of Machine Learning",
      password: "FacultyPassword@123",
    });

    expect(teacherRegResult.success).toBe(true);
    expect(teacherRegResult.role).toBe("teacher");

    const session = authService.getSession();
    expect(session?.user.role).toBe("teacher");
    expect(session?.user.name).toBe("Dr. Marcus Brody");

    const createdSection = db
      .getSections()
      .find((s) => s.sectionName === "DS-101: Foundation of Machine Learning");
    expect(createdSection).toBeDefined();
    expect(createdSection?.teacherId).toBe(session?.user.id);
  });

  it("authenticates registered users and assigns the appropriate session role", () => {
    // Teacher login
    const teacherLogin = authService.login("e.vance@university.edu", "teacher");
    expect(teacherLogin.success).toBe(true);
    expect(teacherLogin.role).toBe("teacher");
    expect(authService.getSession()?.user.role).toBe("teacher");

    // Student login
    const studentLogin = authService.login("a.wright@student.university.edu", "student");
    expect(studentLogin.success).toBe(true);
    expect(studentLogin.role).toBe("student");
    expect(authService.getSession()?.studentProfile?.name).toBe("Alexander Wright");
  });

  it("rejects invalid logins and role mismatches with helpful errors", () => {
    // Non-existent email
    const nonExistent = authService.login("unknown@student.university.edu", "student");
    expect(nonExistent.success).toBe(false);
    expect(nonExistent.error).toContain("No student account found");

    // Role mismatch: Teacher trying to sign in via student tab
    const roleMismatch = authService.login("e.vance@university.edu", "student");
    expect(roleMismatch.success).toBe(false);
    expect(roleMismatch.error).toContain("registered as a teacher");
  });
});
