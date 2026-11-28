import { assertCan } from "../services/permissions";
import { User } from "../models/types";
import { ControllerRequest, ControllerResponse } from "./authController";
import { VerificationQueueService } from "../../server/services/verificationQueueService";
import { MarksReconciliationService } from "../../server/services/marksReconciliationService";
import { NotificationService } from "../../server/services/notificationService";
import { sql } from "../../server/db/supabase";

export class VerificationController {
  /**
   * Bulk triggers verification on submissions (batch of 50-60 files)
   */
  async triggerBulkVerification(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      assertCan(user, "verify:submission", "verification");

      const { assignmentId, sectionId, submissionIds } = req.body as {
        assignmentId?: string;
        sectionId?: string;
        submissionIds?: string[];
      };

      let submissionsToQueue: any[] = [];

      if (submissionIds && submissionIds.length > 0) {
        submissionsToQueue = await sql`
          SELECT id, institution_id as "institutionId", section_id as "sectionId",
                 assignment_id as "assignmentId", student_id as "studentId", student_name as "studentName"
          FROM assignment_submissions
          WHERE id = ANY(${submissionIds})
        `;
      } else if (assignmentId || sectionId) {
        submissionsToQueue = await sql`
          SELECT id, institution_id as "institutionId", section_id as "sectionId",
                 assignment_id as "assignmentId", student_id as "studentId", student_name as "studentName"
          FROM assignment_submissions
          WHERE (${assignmentId || null}::text IS NULL OR assignment_id = ${assignmentId || null})
            AND (${sectionId || null}::text IS NULL OR section_id = ${sectionId || null})
          ORDER BY created_at ASC
          LIMIT 100
        `;
      }

      if (submissionsToQueue.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No matching submissions found to queue for verification.",
        });
      }

      const { batchId, queuedCount } = await VerificationQueueService.enqueueBatch(submissionsToQueue);

      return res.status(202).json({
        success: true,
        data: {
          message: `Queued ${queuedCount} submissions for background batch verification.`,
          batchId,
          queuedCount,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Bulk verification failed";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Returns live background queue progress for a batch or whole queue
   */
  async getQueueProgress(req: ControllerRequest, res: ControllerResponse) {
    try {
      const { batchId } = req.query as { batchId?: string };
      const progress = await VerificationQueueService.getBatchProgress(batchId);
      return res.status(200).json({ success: true, data: progress });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load queue progress";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Run Marks Reconciliation Scan
   */
  async runReconciliation(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      assertCan(user, "reconcile:marks", "marks");

      const { sectionId, assignmentId } = req.body as { sectionId: string; assignmentId?: string };
      if (!sectionId) {
        return res.status(400).json({ success: false, error: "Section ID is required" });
      }

      const summary = await MarksReconciliationService.runReconciliation(sectionId, assignmentId);
      return res.status(200).json({ success: true, data: summary });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Reconciliation scan failed";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Get open Marks Reconciliation Alerts
   */
  async getReconciliationAlerts(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const { sectionId } = req.query as { sectionId?: string };
      const alerts = await MarksReconciliationService.getOpenAlerts(sectionId);
      return res.status(200).json({ success: true, data: alerts });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load alerts";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Resolve an alert
   */
  async resolveReconciliationAlert(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const { id } = req.params as { id: string };
      const success = await MarksReconciliationService.resolveAlert(id);
      return res.status(200).json({ success });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resolve alert";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Notifications query
   */
  async getNotifications(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const notifications = await NotificationService.getNotificationsForUser(user.id, user.role);
      return res.status(200).json({ success: true, data: notifications });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to get notifications";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(req: ControllerRequest, res: ControllerResponse) {
    try {
      const { id } = req.params as { id: string };
      const ok = await NotificationService.markAsRead(id);
      return res.status(200).json({ success: ok });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update notification";
      return res.status(500).json({ success: false, error: msg });
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(req: ControllerRequest, res: ControllerResponse) {
    try {
      const user = req.user as User;
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const ok = await NotificationService.markAllAsRead(user.id);
      return res.status(200).json({ success: ok });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to mark all notifications read";
      return res.status(500).json({ success: false, error: msg });
    }
  }
}

export const verificationController = new VerificationController();
