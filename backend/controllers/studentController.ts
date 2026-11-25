import { db } from "../db/database";
import { getStudentDashboardData } from "../services/student";
import { assertCan } from "../services/permissions";
import { User } from "../models/types";
import { ControllerRequest, ControllerResponse } from "./authController";

export class StudentController {
  /**
   * Get student's dashboard summary and enrollment info
   */
  async getDashboard(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const student =
        db.getStudentByUserId(user.id) ||
        db.getStudents().find((s) => s.email.toLowerCase() === user.email.toLowerCase());
      if (!student) {
        return res.status(404).json({ success: false, error: "Student profile not found" });
      }

      const summary = getStudentDashboardData(student.id);
      return res.status(200).json({ success: true, data: summary });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load student dashboard";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Get enrolled section's coursework assignments
   */
  async getAssignments(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const student =
        db.getStudentByUserId(user.id) ||
        db.getStudents().find((s) => s.email.toLowerCase() === user.email.toLowerCase());
      if (!student) {
        return res.status(404).json({ success: false, error: "Student profile not found" });
      }

      assertCan(user, "read:assignment", "assignment", {
        institutionId: user.institutionId,
        sectionId: student.sectionId,
      });
      const assignments = db.getAssignments(student.sectionId);
      return res.status(200).json({ success: true, data: assignments });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load assignments";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Get verified continuous evaluation marks (read-only)
   */
  async getMarks(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const student =
        db.getStudentByUserId(user.id) ||
        db.getStudents().find((s) => s.email.toLowerCase() === user.email.toLowerCase());
      if (!student) {
        return res.status(404).json({ success: false, error: "Student profile not found" });
      }

      assertCan(user, "read:marks", "marks", {
        institutionId: user.institutionId,
        studentId: student.id,
        targetStudentId: student.id,
      });
      const marks = db.getStudentMarks(student.id);
      return res.status(200).json({ success: true, data: marks });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load marks";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Get project group and section teams
   */
  async getProjectGroup(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const student =
        db.getStudentByUserId(user.id) ||
        db.getStudents().find((s) => s.email.toLowerCase() === user.email.toLowerCase());
      if (!student) {
        return res.status(404).json({ success: false, error: "Student profile not found" });
      }

      const groups = db.getProjectGroups(student.sectionId);
      const myGroup =
        groups.find(
          (g) =>
            g.id === student.projectGroupId || g.members.some((m) => m.studentId === student.id),
        ) || null;

      return res.status(200).json({
        success: true,
        data: {
          myGroup,
          sectionGroups: groups,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load project group";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Propose a new collaborative project group
   */
  async proposeProjectGroup(
    req: ControllerRequest<{
      proposedGroupName: string;
      proposedTitle: string;
      partnerStudentIds?: string[];
    }>,
    res: ApiResponse,
  ) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const student =
        db.getStudentByUserId(user.id) ||
        db.getStudents().find((s) => s.email.toLowerCase() === user.email.toLowerCase());
      if (!student) {
        return res.status(404).json({ success: false, error: "Student profile not found" });
      }

      assertCan(user, "propose:group", "groupRequest", {
        institutionId: user.institutionId,
        sectionId: student.sectionId,
      });

      const { proposedGroupName, proposedTitle, partnerStudentIds } = req.body;
      const request = db.submitGroupRequest({
        studentId: student.id,
        studentName: student.name,
        sectionId: student.sectionId,
        proposedGroupName,
        proposedProjectTitle: proposedTitle,
        proposedMembers: [student.name, ...(partnerStudentIds || [])],
      });

      return res.status(201).json({ success: true, data: request });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to propose group";
      return res.status(400).json({ success: false, error: msg });
    }
  }

  /**
   * Get section announcements
   */
  async getAnnouncements(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const student =
        db.getStudentByUserId(user.id) ||
        db.getStudents().find((s) => s.email.toLowerCase() === user.email.toLowerCase());
      if (!student) {
        return res.status(404).json({ success: false, error: "Student profile not found" });
      }

      assertCan(user, "read:announcement", "announcement", {
        institutionId: user.institutionId,
        sectionId: student.sectionId,
      });
      const announcements = db.getAnnouncements(student.sectionId);
      return res.status(200).json({ success: true, data: announcements });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load announcements";
      return res.status(500).json({ success: false, error: msg });
    }
  }
}

export type ApiResponse<T = unknown> = ControllerResponse<T>;
export type ApiRequest<T = unknown> = ControllerRequest<T>;

export const studentController = new StudentController();
