import { describe, it, expect, beforeEach } from "vitest";
import { db } from "../services/db";
import { authService } from "../services/auth";
import { authController } from "../controllers/authController";
import { teacherController } from "../controllers/teacherController";
import { studentController } from "../controllers/studentController";
import { can } from "../services/permissions";
import type { User, Section, Student } from "../models/types";
import * as fs from "fs";
import * as path from "path";

// Mock response creator for controller tests
function createMockResponse() {
  const res: {
    statusCode: number;
    data: unknown;
    cookies: Record<string, { value: string; options: Record<string, unknown> }>;
    clearedCookies: string[];
    status: (code: number) => typeof res;
    json: (payload: unknown) => typeof res;
    cookie: (name: string, val: string, opts: Record<string, unknown>) => typeof res;
    clearCookie: (name: string) => typeof res;
  } = {
    statusCode: 200,
    data: null,
    cookies: {},
    clearedCookies: [],
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.data = payload;
      return this;
    },
    cookie(name: string, val: string, opts: Record<string, unknown>) {
      this.cookies[name] = { value: val, options: opts };
      return this;
    },
    clearCookie(name: string) {
      this.clearedCookies.push(name);
      return this;
    },
  };
  return res;
}

describe("Backend Architecture & Complete Functionalities", () => {
  beforeEach(() => {
    db.resetToDefault();
    authService.logout();
  });

  describe("NO MONGODB GUARANTEE", () => {
    it("should ensure no mongodb or mongoose packages are installed in the project", () => {
      const rootPkg = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, "../../package.json"), "utf8"),
      );
      const backendPkg = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8"),
      );
      const serverPkg = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, "../../server/package.json"), "utf8"),
      );

      const allDeps = {
        ...rootPkg.dependencies,
        ...rootPkg.devDependencies,
        ...backendPkg.dependencies,
        ...backendPkg.devDependencies,
        ...serverPkg.dependencies,
        ...serverPkg.devDependencies,
      };

      expect(allDeps["mongoose"]).toBeUndefined();
      expect(allDeps["mongodb"]).toBeUndefined();
    });
  });

  describe("Authentication & Session Management", () => {
    beforeEach(() => {
      authService.registerTeacher({
        name: "Dr. Eleanor Vance",
        email: "e.vance@university.edu",
        department: "Computer Science",
        initialSectionName: "CS-301: Algorithms & Data Structures",
        password: "Faculty@2026",
      });
      authService.logout();
    });

    it("should authenticate teacher and issue session token + HTTP cookie", async () => {
      const res = createMockResponse();
      await authController.login(
        {
          body: {
            email: "e.vance@university.edu",
            password: "Faculty@2026",
            role: "teacher",
          },
        },
        res,
      );

      expect(res.statusCode).toBe(200);
      const data = res.data as {
        success: boolean;
        data?: { token?: string; user?: { role: string; email: string } };
      };
      expect(data.success).toBe(true);
      expect(data.data?.token).toBeDefined();
      expect(data.data?.user?.email).toBe("e.vance@university.edu");
      expect(res.cookies["handover_session"]).toBeDefined();
      expect(res.cookies["handover_session"]?.value).toBe(data.data?.token);
    });

    it("should verify active session via session token", async () => {
      const loginRes = createMockResponse();
      await authController.login(
        {
          body: {
            email: "e.vance@university.edu",
            password: "Faculty@2026",
            role: "teacher",
          },
        },
        loginRes,
      );
      const token = (loginRes.data as { data: { token: string } }).data.token;

      const session = authService.verifySession(token);
      expect(session).not.toBeNull();
      expect(session?.user.email).toBe("e.vance@university.edu");
    });

    it("should clear session and remove cookie on logout", async () => {
      const loginRes = createMockResponse();
      await authController.login(
        {
          body: {
            email: "e.vance@university.edu",
            password: "Faculty@2026",
            role: "teacher",
          },
        },
        loginRes,
      );
      const token = (loginRes.data as { data: { token: string } }).data.token;

      const logoutRes = createMockResponse();
      await authController.logout(
        {
          cookies: { handover_session: token },
          body: {},
        } as unknown as Parameters<typeof authController.logout>[0],
        logoutRes,
      );

      expect(logoutRes.statusCode).toBe(200);
      expect(logoutRes.clearedCookies).toContain("handover_session");
      expect(authService.verifySession(token)).toBeNull();
    });
  });

  describe("Teacher Management Endpoints", () => {
    let teacherUser: User;
    let baseSection: Section;

    beforeEach(() => {
      authService.registerTeacher({
        name: "Dr. Eleanor Vance",
        email: "e.vance@university.edu",
        department: "Computer Science",
        initialSectionName: "CS-301: Algorithms & Data Structures",
        password: "Faculty@2026",
      });
      teacherUser = db.getUserByEmail("e.vance@university.edu")!;
      baseSection = db.getSections()[0]!;
    });

    it("should allow teacher to create, retrieve, and delete class sections", async () => {
      const createRes = createMockResponse();
      await teacherController.createSection(
        {
          user: teacherUser,
          body: {
            sectionName: "AI & ML - Section C",
            courseName: "Artificial Intelligence",
            academicYear: "2026-2027",
          },
        },
        createRes,
      );

      expect(createRes.statusCode).toBe(201);
      const newSection = (createRes.data as { data: { id: string; sectionName: string } }).data;
      expect(newSection.sectionName).toBe("AI & ML - Section C");

      // Verify in section list
      const listRes = createMockResponse();
      await teacherController.getSections({ user: teacherUser, body: {} }, listRes);
      const sections = (listRes.data as { data: Array<{ id: string }> }).data;
      expect(sections.some((s) => s.id === newSection.id)).toBe(true);

      // Delete the section
      const delRes = createMockResponse();
      await teacherController.deleteSection(
        {
          user: teacherUser,
          params: { sectionId: newSection.id },
          body: {},
        },
        delRes,
      );
      expect(delRes.statusCode).toBe(200);
      expect(db.getSectionById(newSection.id)).toBeUndefined();
    });

    it("should manage assignments: create, list, and delete", async () => {
      const createRes = createMockResponse();
      await teacherController.createAssignment(
        {
          user: teacherUser,
          body: {
            title: "Distributed Systems Lab 1",
            subject: "Cloud Architecture",
            description: "Implement Raft consensus algorithm",
            sectionId: baseSection.id,
            deadline: "2026-12-15",
          },
        },
        createRes,
      );
      expect(createRes.statusCode).toBe(201);
      const assignment = (createRes.data as { data: { id: string; title: string } }).data;
      expect(assignment.title).toBe("Distributed Systems Lab 1");

      // List assignments
      const listRes = createMockResponse();
      await teacherController.getAssignments(
        {
          user: teacherUser,
          query: { sectionId: baseSection.id },
          body: {},
        },
        listRes,
      );
      expect(listRes.statusCode).toBe(200);
      const assignments = (listRes.data as { data: Array<{ id: string }> }).data;
      expect(assignments.some((a) => a.id === assignment.id)).toBe(true);

      // Delete assignment
      const delRes = createMockResponse();
      await teacherController.deleteAssignment(
        {
          user: teacherUser,
          params: { assignmentId: assignment.id },
          body: {},
        },
        delRes,
      );
      expect(delRes.statusCode).toBe(200);
      expect(db.getAssignments(baseSection.id).some((a) => a.id === assignment.id)).toBe(false);
    });

    it("should review group proposals and auto-provision project groups upon approval", async () => {
      // 1. Create a student in this section
      const student = db.addStudent({
        name: "Alexander Wright",
        email: "a.wright@student.university.edu",
        rollNumber: "2024-CS-001",
        sectionId: baseSection.id,
      });

      // 2. Student submits proposal
      const proposal = db.submitGroupRequest({
        studentId: student.id,
        studentName: student.name,
        sectionId: baseSection.id,
        proposedGroupName: "HyperScale DB",
        proposedProjectTitle: "High-Performance Distributed Key-Value Store",
        proposedMembers: [student.name, "Sophia Martinez"],
      });

      // 3. Teacher retrieves pending requests
      const listRes = createMockResponse();
      await teacherController.getGroupRequests(
        {
          user: teacherUser,
          query: { sectionId: baseSection.id },
          body: {},
        },
        listRes,
      );
      expect(listRes.statusCode).toBe(200);
      const requests = (listRes.data as { data: Array<{ id: string; status: string }> }).data;
      expect(requests.some((r) => r.id === proposal.id && r.status === "Pending")).toBe(true);

      // 4. Teacher approves the proposal
      const reviewRes = createMockResponse();
      await teacherController.reviewGroupProposal(
        {
          user: teacherUser,
          params: { requestId: proposal.id },
          body: {
            status: "Approved",
            feedback: "Great architecture proposal. Proceed to sprint 1.",
          },
        },
        reviewRes,
      );
      expect(reviewRes.statusCode).toBe(200);

      // 5. Verify project group was automatically created in the database
      const groups = db.getProjectGroups(baseSection.id);
      const createdGroup = groups.find((g) => g.groupName === "HyperScale DB");
      expect(createdGroup).toBeDefined();
      expect(createdGroup?.projectTitle).toBe("High-Performance Distributed Key-Value Store");
      expect(createdGroup?.guide).toBe(teacherUser.name);
    });

    it("should support CSV spreadsheet export and import for sections", async () => {
      // Export CSV
      const exportRes = createMockResponse();
      await teacherController.exportCSV(
        {
          user: teacherUser,
          params: { sectionId: baseSection.id },
          body: {},
        },
        exportRes,
      );
      expect(exportRes.statusCode).toBe(200);
      const csvData = (exportRes.data as { data: string }).data;
      expect(csvData).toContain("Roll No");
      expect(csvData).toContain("Student Name");
      expect(csvData).toContain("Total (/80)");

      // Import CSV
      const sampleCsv = `Roll Number,Student Name,Email
2024-CS-099,Jordan Hayes,jordan.hayes@college.edu`;
      const importRes = createMockResponse();
      await teacherController.importCSV(
        {
          user: teacherUser,
          params: { sectionId: baseSection.id },
          body: { csvContent: sampleCsv },
        },
        importRes,
      );
      expect(importRes.statusCode).toBe(200);
      const student = db.getStudents(baseSection.id).find((s) => s.rollNumber === "2024-CS-099");
      expect(student).toBeDefined();
      expect(student?.name).toBe("Jordan Hayes");
    });
  });

  describe("Student Portal & Read-Only Protection", () => {
    let studentUser: User;
    let studentProfile: Student;

    beforeEach(() => {
      authService.registerTeacher({
        name: "Dr. Eleanor Vance",
        email: "e.vance@university.edu",
        department: "Computer Science",
        initialSectionName: "CS-301: Algorithms & Data Structures",
        password: "Faculty@2026",
      });
      const section = db.getSections()[0]!;

      const regStudent = authService.registerStudent({
        name: "Alexander Wright",
        email: "a.wright@student.university.edu",
        rollNumber: "2024-CS-001",
        sectionId: section.id,
        password: "Password@123",
      });

      studentUser = db.getUserByEmail("a.wright@student.university.edu")!;
      studentProfile = db.getStudents(section.id).find((s) => s.email === studentUser.email)!;
    });

    it("should retrieve student personal dashboard and verified read-only marks", async () => {
      const dashRes = createMockResponse();
      await studentController.getDashboard({ user: studentUser, body: {} }, dashRes);
      expect(dashRes.statusCode).toBe(200);
      const dashData = (
        dashRes.data as { data: { student: { name: string }; verifiedScores: unknown } }
      ).data;
      expect(dashData.student.name).toBe("Alexander Wright");

      // Verify marks read-only
      const marksRes = createMockResponse();
      await studentController.getMarks({ user: studentUser, body: {} }, marksRes);
      expect(marksRes.statusCode).toBe(200);
      const marks = (marksRes.data as { data: { internalMarks: number; labRecordMarks: number } })
        .data;
      expect(marks.internalMarks).toBeGreaterThanOrEqual(0);
      expect(marks.internalMarks).toBeLessThanOrEqual(20);
    });

    it("should prevent students from modifying marks (RBAC assertion)", () => {
      expect(can(studentUser, "update:marks", "marks")).toBe(false);
      expect(can(studentUser, "create:section", "section")).toBe(false);
      expect(can(studentUser, "delete:student", "student")).toBe(false);
    });
  });
});
