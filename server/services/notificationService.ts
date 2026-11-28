import crypto from "crypto";
import { sql } from "../db/supabase";

export interface NotificationRecord {
  id: string;
  institution_id: string;
  user_id: string;
  role: "teacher" | "student" | "admin" | "all";
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error" | "reconciliation";
  is_read: boolean;
  link?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// In-memory fallback if database connection has temporary latency
const memoryNotifications: NotificationRecord[] = [];

export class NotificationService {
  /**
   * Dispatches a persistent notification to a user or role.
   */
  public static async createNotification(params: {
    institutionId: string;
    userId: string;
    role: "teacher" | "student" | "admin" | "all";
    title: string;
    message: string;
    type?: "info" | "warning" | "success" | "error" | "reconciliation";
    link?: string;
    metadata?: Record<string, unknown>;
  }): Promise<NotificationRecord> {
    const id = `notif_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    const newRecord: NotificationRecord = {
      id,
      institution_id: params.institutionId,
      user_id: params.userId,
      role: params.role,
      title: params.title,
      message: params.message,
      type: params.type || "info",
      is_read: false,
      link: params.link,
      metadata: params.metadata || {},
      created_at: new Date().toISOString(),
    };

    memoryNotifications.unshift(newRecord);

    try {
      await sql`
        INSERT INTO notifications (
          id, institution_id, user_id, role, title, message, type, is_read, link, metadata, created_at
        ) VALUES (
          ${newRecord.id}, ${newRecord.institution_id}, ${newRecord.user_id}, ${newRecord.role},
          ${newRecord.title}, ${newRecord.message}, ${newRecord.type}, ${newRecord.is_read},
          ${newRecord.link || null}, ${JSON.stringify(newRecord.metadata)}, ${newRecord.created_at}
        )
      `;
    } catch {
      // Fallback to in-memory silently
    }

    return newRecord;
  }

  /**
   * Retrieves notifications for a given user and role.
   */
  public static async getNotificationsForUser(
    userId: string,
    role?: string,
  ): Promise<NotificationRecord[]> {
    try {
      const rows = await sql<NotificationRecord[]>`
        SELECT * FROM notifications 
        WHERE user_id = ${userId} OR role = ${role || ""} OR role = 'all'
        ORDER BY created_at DESC 
        LIMIT 50
      `;
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          ...r,
          is_read: Boolean(r.is_read),
          metadata: typeof r.metadata === "string" ? JSON.parse(r.metadata) : r.metadata,
        }));
      }
    } catch {
      // Fallback
    }

    return memoryNotifications.filter(
      (n) => n.user_id === userId || n.role === role || n.role === "all",
    );
  }

  /**
   * Marks a notification as read.
   */
  public static async markAsRead(notificationId: string): Promise<boolean> {
    const mem = memoryNotifications.find((n) => n.id === notificationId);
    if (mem) mem.is_read = true;

    try {
      await sql`
        UPDATE notifications 
        SET is_read = true 
        WHERE id = ${notificationId}
      `;
      return true;
    } catch {
      return Boolean(mem);
    }
  }

  /**
   * Marks all notifications as read for a user.
   */
  public static async markAllAsRead(userId: string): Promise<boolean> {
    memoryNotifications.forEach((n) => {
      if (n.user_id === userId) n.is_read = true;
    });

    try {
      await sql`
        UPDATE notifications 
        SET is_read = true 
        WHERE user_id = ${userId}
      `;
      return true;
    } catch {
      return true;
    }
  }
}
