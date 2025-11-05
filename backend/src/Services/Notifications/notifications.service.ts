import { eq, desc, and } from "drizzle-orm";
import { notifications } from "../../drizzle/schema";
import type { TInsertNotification } from "../../drizzle/schema";
import type { SocketService } from "../../socket/socket";

export class NotificationService {
  constructor(private db: any, private socketService?: SocketService) {}

  // Create a single notification
  async createNotification(payload: {
    userId: string;
    actorId?: string | null;
    type:
      | "MESSAGE"
      | "LIKE"
      | "COMMENT"
      | "REPOST"
      | "FOLLOW"
      | "TIP"
      | "SUBSCRIPTION"
      | "ADMIN_MESSAGE"
      | "MATCH";
    title?: string | null;
    body?: string | null;
    data?: object | null;
  }) {
    const { userId, actorId, type, title, body, data } = payload;

    const row: TInsertNotification = {
      userId,
      actorId: actorId ?? null,
      type,
      title: title ?? null,
      body: body ?? null,
      data: data ? JSON.stringify(data) : null,
      isRead: false,
      createdAt: new Date(),
    } as any;

    const inserted = await this.db.insert(notifications).values(row).returning();
    const created = Array.isArray(inserted) ? inserted[0] : inserted;

    // Emit real-time notification
    if (this.socketService) {
      this.socketService.emitToUser(userId, "notification:new", created);
    }

    return created;
  }

  // Create notifications for multiple users (bulk)
  async createNotificationsForUsers(payload: {
    userIds: string[];
    actorId?: string | null;
    type: TInsertNotification["type"];
    title?: string | null;
    body?: string | null;
    data?: object | null;
  }) {
    const { userIds, actorId, type, title, body, data } = payload;

    const rows = userIds.map((uid) => ({
      userId: uid,
      actorId: actorId ?? null,
      type,
      title: title ?? null,
      body: body ?? null,
      data: data ? JSON.stringify(data) : null,
      isRead: false,
      createdAt: new Date(),
    }));

    await this.db.insert(notifications).values(rows);

    // Emit notifications in real-time
    if (this.socketService) {
      for (const uid of userIds) {
        this.socketService.emitToUser(uid, "notification:new", {
          userId: uid,
          type,
          title,
          body,
          data,
        });
      }
    }

    return { ok: true };
  }

  // List notifications for a user
  async listNotifications(userId: string, opts?: { limit?: number; offset?: number }) {
    const limit = opts?.limit ?? 50;
    const offset = opts?.offset ?? 0;

    const rows = await this.db
      .select()
      .from(notifications)
      .where(eq(notifications.id, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);

    return rows.map((r: any) => ({
      ...r,
      data: r.data ? JSON.parse(r.data) : null,
    }));
  }

  // Mark one notification as read
  async markAsRead(userId: string, notificationId: string) {
    await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, notificationId), eq(notifications.id, userId)));

    return { ok: true };
  }

  // Mark all notifications as read
  async markAllRead(userId: string) {
    await this.db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, userId));

    return { ok: true };
  }

  // Delete a single notification
  async deleteNotification(userId: string, notificationId: string) {
    await this.db
      .delete(notifications)
      .where(and(eq(notifications.id, notificationId), eq(notifications.id, userId)));

    return { ok: true };
  }
}

export default NotificationService;
