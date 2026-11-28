import crypto from "crypto";
import { sql } from "../db/supabase";
import { NotificationService } from "./notificationService";
import type { MarksReconciliationAlert } from "../../backend/models/types";

export interface ReconciliationSummary {
  sectionId: string;
  totalVerified: number;
  totalWithMarks: number;
  totalMissingMarks: number;
  alerts: MarksReconciliationAlert[];
}

export class MarksReconciliationService {
  private static scheduledInterval: NodeJS.Timeout | null = null;

  /**
   * Scans a section or assignment for verified submissions missing marks.
   * Only submissions with status 'Verified' that exceed the grace period (default 2 days)
   * are flagged as overdue missing marks.
   */
  public static async runReconciliation(
    sectionId: string,
    assignmentId?: string,
    gracePeriodDays: number = 2,
  ): Promise<ReconciliationSummary> {
    const alerts: MarksReconciliationAlert[] = [];

    try {
      // 1. Fetch strictly verified submissions for the section
      const subCondition = assignmentId ? sql`AND s.assignment_id = ${assignmentId}` : sql``;

      const verifiedSubs = await sql`
        SELECT 
          s.id as submission_id,
          s.institution_id,
          s.section_id,
          s.assignment_id,
          s.student_id,
          s.student_name,
          s.created_at,
          m.id as marks_record_id,
          m.internal_marks,
          m.lab_marks,
          m.practical_marks,
          m.project_marks
        FROM assignment_submissions s
        LEFT JOIN marks m ON m.student_id = s.student_id AND m.section_id = s.section_id
        WHERE s.section_id = ${sectionId}
          AND s.status = 'Verified'
          ${subCondition}
      `;

      let totalVerified = 0;
      let totalWithMarks = 0;
      let totalMissingMarks = 0;

      for (const row of verifiedSubs) {
        totalVerified++;
        // Check if marks exist and at least one component or total is filled
        const hasMarks =
          row.marks_record_id &&
          (row.internal_marks != null ||
            row.lab_marks != null ||
            row.practical_marks != null ||
            row.project_marks != null);

        if (hasMarks) {
          totalWithMarks++;
          // If there was an open alert, resolve it
          await sql`
            UPDATE marks_reconciliation_alerts
            SET status = 'RESOLVED', resolved_at = NOW()
            WHERE submission_id = ${row.submission_id} AND status = 'OPEN'
          `;
        } else {
          const submissionDate = new Date(row.created_at);
          const daysSince = Math.floor(
            (Date.now() - submissionDate.getTime()) / (1000 * 60 * 60 * 24),
          );

          // Phase 7: Respect evaluation grace period (e.g. 2 days)
          if (daysSince <= gracePeriodDays) {
            continue;
          }

          totalMissingMarks++;

          // Check if alert already exists
          const existing = await sql<MarksReconciliationAlert[]>`
            SELECT * FROM marks_reconciliation_alerts
            WHERE submission_id = ${row.submission_id}
          `;

          if (existing && existing.length > 0 && existing[0]) {
            const rawStatus = String(
              (existing[0] as unknown as Record<string, unknown>)["status"] || "",
            );
            if (rawStatus === "OPEN" || rawStatus === "ACTIVE") {
              alerts.push(existing[0]);
            }
          } else {
            const alertId = `rec_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
            const newAlert: MarksReconciliationAlert = {
              id: alertId,
              institutionId: row.institution_id,
              sectionId: row.section_id,
              assignmentId: row.assignment_id,
              submissionId: row.submission_id,
              studentId: row.student_id,
              studentName: row.student_name,
              status: "ACTIVE",
              daysPending: daysSince,
              reminderCount: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            await sql`
              INSERT INTO marks_reconciliation_alerts (
                id, institution_id, section_id, assignment_id, submission_id,
                student_id, student_name, status, days_since_submission, created_at
              ) VALUES (
                ${newAlert.id}, ${newAlert.institutionId}, ${newAlert.sectionId}, ${newAlert.assignmentId},
                ${newAlert.submissionId}, ${newAlert.studentId}, ${newAlert.studentName || null},
                'OPEN', ${newAlert.daysPending}, ${newAlert.createdAt}
              )
            `;

            alerts.push(newAlert);

            // Phase 7: Send reassuring, neutral notification to student
            if (row.student_id) {
              await NotificationService.createNotification({
                institutionId: row.institution_id || "inst_demo",
                userId: row.student_id,
                role: "student",
                title: "Assignment Evaluation Pending",
                message:
                  "Your assignment has been verified and is awaiting final evaluation by your instructor.",
                type: "info",
                link: "/student/assignments",
                metadata: { submissionId: row.submission_id, sectionId: row.section_id },
              }).catch(() => {});
            }
          }
        }
      }

      // Notify faculty if any missing marks detected
      if (totalMissingMarks > 0) {
        await NotificationService.createNotification({
          institutionId: verifiedSubs[0]?.institution_id || "inst_demo",
          userId: "faculty",
          role: "teacher",
          title: "Marks Reconciliation Alert",
          message: `${totalMissingMarks} student submission(s) in Section are verified but missing gradebook marks.`,
          type: "reconciliation",
          link: "/teacher/marks",
          metadata: { sectionId, totalMissingMarks },
        });
      }

      return {
        sectionId,
        totalVerified,
        totalWithMarks,
        totalMissingMarks,
        alerts,
      };
    } catch {
      return {
        sectionId,
        totalVerified: 0,
        totalWithMarks: 0,
        totalMissingMarks: 0,
        alerts: [],
      };
    }
  }

  /**
   * Fetches all open reconciliation alerts for a section or teacher.
   */
  public static async getOpenAlerts(sectionId?: string): Promise<MarksReconciliationAlert[]> {
    try {
      const condition = sectionId ? sql`AND section_id = ${sectionId}` : sql``;
      const rows = await sql<MarksReconciliationAlert[]>`
        SELECT * FROM marks_reconciliation_alerts
        WHERE status = 'OPEN'
        ${condition}
        ORDER BY days_since_submission DESC, created_at DESC
      `;
      return rows || [];
    } catch {
      return [];
    }
  }

  /**
   * Resolves a reconciliation alert manually or when marks are entered.
   */
  public static async resolveAlert(alertId: string): Promise<boolean> {
    try {
      await sql`
        UPDATE marks_reconciliation_alerts
        SET status = 'RESOLVED', resolved_at = NOW()
        WHERE id = ${alertId}
      `;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Starts a background cron/timer that runs reconciliation periodically across active sections.
   */
  public static startScheduledReconciliation(intervalMs: number = 3600000): void {
    if (this.scheduledInterval) return;
    this.scheduledInterval = setInterval(async () => {
      try {
        const sections = await sql<
          { id: string }[]
        >`SELECT id FROM sections WHERE deleted_at IS NULL`;
        for (const sec of sections) {
          await this.runReconciliation(sec.id);
        }
      } catch (err) {
        console.error("Scheduled reconciliation error:", err);
      }
    }, intervalMs);

    if (this.scheduledInterval.unref) {
      this.scheduledInterval.unref();
    }
  }

  /**
   * Stops the background reconciliation interval timer.
   */
  public static stopScheduledReconciliation(): void {
    if (this.scheduledInterval) {
      clearInterval(this.scheduledInterval);
      this.scheduledInterval = null;
    }
  }
}
