import { db } from "../db/database";
import { assertCan } from "../services/permissions";
import { User, StudentMarks } from "../models/types";
import { ControllerRequest, ControllerResponse } from "./authController";

export class MarksController {
  /**
   * Get marks spreadsheet for a section (Teacher only)
   */
  async getSectionMarks(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const sectionId = req.params?.["sectionId"];
      if (!sectionId) {
        return res.status(400).json({ success: false, error: "Section ID is required" });
      }

      assertCan(user, "read:marks", "marks", { institutionId: user.institutionId, sectionId });
      const marks = db.getMarks(sectionId);
      return res.status(200).json({ success: true, data: marks });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load marks";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Update student marks (Teacher only)
   */
  async updateMarks(
    req: ControllerRequest<{ studentId: string; marks: Partial<StudentMarks> }>,
    res: ControllerResponse,
  ) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const { studentId, marks } = req.body;
      if (!studentId || !marks) {
        return res
          .status(400)
          .json({ success: false, error: "Student ID and marks payload required" });
      }

      assertCan(user, "update:marks", "marks", { institutionId: user.institutionId });
      const updated = db.updateStudentMarks(studentId, marks, user.name);
      return res.status(200).json({ success: true, data: updated });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update marks";
      return res.status(400).json({ success: false, error: msg });
    }
  }

  /**
   * Bulk save marks spreadsheet (Teacher only)
   */
  async bulkUpdateMarks(
    req: ControllerRequest<{
      updates: Array<{ studentId: string; marks: Partial<StudentMarks> }>;
    }>,
    res: ControllerResponse,
  ) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      assertCan(user, "update:marks", "marks", { institutionId: user.institutionId });
      const { updates } = req.body;
      if (!Array.isArray(updates)) {
        return res.status(400).json({ success: false, error: "Updates must be an array" });
      }

      const results = updates.map((u) => db.updateStudentMarks(u.studentId, u.marks, user.name));
      return res.status(200).json({ success: true, data: results });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to bulk update marks";
      return res.status(400).json({ success: false, error: msg });
    }
  }

  /**
   * Get student's personal verified marks (Student only)
   */
  async getMyVerifiedMarks(req: ControllerRequest, res: ControllerResponse) {
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
      const msg = err instanceof Error ? err.message : "Failed to fetch marks";
      return res.status(500).json({ success: false, error: msg });
    }
  }
}

export const marksController = new MarksController();
