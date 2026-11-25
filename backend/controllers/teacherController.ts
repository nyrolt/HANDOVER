import { db } from "../db/database";
import { getSectionSpreadsheetRows, parseAndImportCSV, exportToCSV } from "../services/teacher";
import { assertCan } from "../services/permissions";
import type { User, Student } from "../models/types";
import { ControllerRequest, ControllerResponse } from "./authController";

export class TeacherController {
  public static getSections(user: User) {
    assertCan(user, "read:section", "section", { institutionId: user.institutionId });
    return db.getSections();
  }

  public static createSection(
    user: User,
    data: {
      sectionName: string;
      courseName: string;
      academicYear: string;
    },
  ) {
    assertCan(user, "create:section", "section", { institutionId: user.institutionId });
    return db.createSection({
      ...data,
      teacherId: user.id,
    });
  }

  public static getSpreadsheet(user: User, sectionId: string) {
    assertCan(user, "read:student", "student", { institutionId: user.institutionId, sectionId });
    return getSectionSpreadsheetRows(sectionId);
  }

  public static importStudentsCSV(user: User, sectionId: string, csvContent: string) {
    assertCan(user, "create:student", "student", { institutionId: user.institutionId, sectionId });
    return parseAndImportCSV(csvContent, sectionId);
  }

  public static exportStudentsCSV(user: User, sectionId: string) {
    const section = db.getSectionById(sectionId);
    assertCan(user, "read:student", "student", { institutionId: user.institutionId, sectionId });
    const rows = getSectionSpreadsheetRows(sectionId);
    return exportToCSV(section, rows);
  }

  public static getAssignments(user: User, sectionId?: string) {
    assertCan(user, "read:assignment", "assignment", {
      institutionId: user.institutionId,
      sectionId,
    });
    return db.getAssignments(sectionId);
  }

  public static createAssignment(
    user: User,
    data: {
      title: string;
      subject: string;
      description: string;
      sectionId: string;
      deadline: string;
    },
  ) {
    assertCan(user, "create:assignment", "assignment", {
      institutionId: user.institutionId,
      sectionId: data.sectionId,
    });
    return db.createAssignment({
      ...data,
      createdBy: user.name,
    });
  }

  public static getProjectGroups(user: User, sectionId?: string) {
    assertCan(user, "read:group", "projectGroup", { institutionId: user.institutionId, sectionId });
    return db.getProjectGroups(sectionId);
  }

  public static reviewGroupProposal(
    user: User,
    requestId: string,
    status: "Approved" | "Rejected",
    feedback?: string,
  ) {
    assertCan(user, "review:proposal", "groupRequest", { institutionId: user.institutionId });
    return db.reviewGroupRequest(requestId, status, user.name, feedback);
  }

  // API HTTP Handlers
  async getDashboard(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const sections = db.getSections();
      const students = db.getStudents();
      const assignments = db.getAssignments();
      const groups = db.getProjectGroups();
      const pendingRequests = db.getGroupRequests().filter((r) => r.status === "Pending");
      return res.status(200).json({
        success: true,
        data: {
          totalSections: sections.length,
          totalStudents: students.length,
          activeAssignments: assignments.length,
          projectGroups: groups.length,
          pendingApprovals: pendingRequests.length,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load dashboard";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  async getSections(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const sections = TeacherController.getSections(user);
      return res.status(200).json({ success: true, data: sections });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load sections";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  async createSection(
    req: ControllerRequest<{ sectionName: string; courseName: string; academicYear: string }>,
    res: ControllerResponse,
  ) {
    try {
      const user = req.user as User;
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const section = TeacherController.createSection(user, req.body);
      return res.status(201).json({ success: true, data: section });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create section";
      return res.status(400).json({ success: false, error: msg });
    }
  }

  async getSectionStudents(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const sectionId = req.params?.["sectionId"] || "";
      const rows = TeacherController.getSpreadsheet(user, sectionId);
      return res.status(200).json({ success: true, data: rows });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load students";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  async addStudent(
    req: ControllerRequest<{
      name: string;
      email: string;
      rollNumber: string;
      sectionId: string;
      phone?: string;
    }>,
    res: ControllerResponse,
  ) {
    try {
      const user = req.user as User;
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      assertCan(user, "create:student", "student", {
        institutionId: user.institutionId,
        sectionId: req.body.sectionId,
      });
      const student = db.addStudent(req.body);
      return res.status(201).json({ success: true, data: student });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add student";
      return res.status(400).json({ success: false, error: msg });
    }
  }

  async updateStudent(
    req: ControllerRequest<{
      name?: string | undefined;
      email?: string | undefined;
      rollNumber?: string | undefined;
    }>,
    res: ControllerResponse,
  ) {
    try {
      const user = req.user as User;
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const studentId = req.params?.["studentId"] || "";
      assertCan(user, "update:student", "student", { institutionId: user.institutionId });
      const { name, email, rollNumber } = req.body;
      const payload: Partial<Student> = {};
      if (name !== undefined) payload.name = name;
      if (email !== undefined) payload.email = email;
      if (rollNumber !== undefined) payload.rollNumber = rollNumber;

      const updated = db.updateStudent(studentId, payload);
      return res.status(200).json({ success: true, data: updated });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update student";
      return res.status(400).json({ success: false, error: msg });
    }
  }

  async removeStudent(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const studentId = req.params?.["studentId"] || "";
      assertCan(user, "delete:student", "student", { institutionId: user.institutionId });
      db.deleteStudent(studentId);
      return res.status(200).json({ success: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete student";
      return res.status(400).json({ success: false, error: msg });
    }
  }

  async createAssignment(
    req: ControllerRequest<{
      title: string;
      subject: string;
      description: string;
      sectionId: string;
      deadline: string;
    }>,
    res: ControllerResponse,
  ) {
    try {
      const user = req.user as User;
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      const assignment = TeacherController.createAssignment(user, req.body);
      return res.status(201).json({ success: true, data: assignment });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create assignment";
      return res.status(400).json({ success: false, error: msg });
    }
  }

  async createProjectGroup(
    req: ControllerRequest<{
      groupName: string;
      projectTitle: string;
      sectionId: string;
      guideName?: string;
      members?: Array<{ studentId: string; studentName: string; rollNumber: string; role: string }>;
    }>,
    res: ControllerResponse,
  ) {
    try {
      const user = req.user as User;
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      assertCan(user, "create:group", "projectGroup", {
        institutionId: user.institutionId,
        sectionId: req.body.sectionId,
      });
      const group = db.createProjectGroup({
        groupName: req.body.groupName,
        projectTitle: req.body.projectTitle,
        sectionId: req.body.sectionId,
        guide: req.body.guideName || user.name,
        approvedBy: user.name,
        memberStudentIds: req.body.members?.map((m) => m.studentId) || [],
      });
      return res.status(201).json({ success: true, data: group });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create group";
      return res.status(400).json({ success: false, error: msg });
    }
  }

  async setProjectGroupStatus(
    req: ControllerRequest<{ status: "In Progress" | "Completed" | "Pending Review" }>,
    res: ControllerResponse,
  ) {
    try {
      const user = req.user as User;
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      assertCan(user, "update:group", "projectGroup", { institutionId: user.institutionId });
      const groupId = req.params?.["groupId"] || "";
      const { status } = req.body;
      const updated = db.updateProjectGroup(groupId, { status });
      return res.status(200).json({ success: true, data: updated });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update project status";
      return res.status(400).json({ success: false, error: msg });
    }
  }

  async createAnnouncement(
    req: ControllerRequest<{
      title: string;
      content: string;
      sectionId: string;
      priority?: "low" | "normal" | "high";
    }>,
    res: ControllerResponse,
  ) {
    try {
      const user = req.user as User;
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });
      assertCan(user, "create:announcement", "announcement", {
        institutionId: user.institutionId,
        sectionId: req.body.sectionId,
      });
      const announcement = db.createAnnouncement({
        title: req.body.title,
        message: req.body.content,
        sectionId: req.body.sectionId,
        teacherName: user.name,
        priority: req.body.priority === "high" ? "important" : "normal",
      });
      return res.status(201).json({ success: true, data: announcement });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create announcement";
      return res.status(400).json({ success: false, error: msg });
    }
  }
}

export const teacherController = new TeacherController();
