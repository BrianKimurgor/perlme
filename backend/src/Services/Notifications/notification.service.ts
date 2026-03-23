import { and, desc, eq } from "drizzle-orm";
import db from "../../drizzle/db";
import type { TInsertNotification, TSelectNotification } from "../../drizzle/schema";
import { notifications } from "../../drizzle/schema";

export type NotificationType =
    | "MESSAGE"
    | "LIKE"
    | "COMMENT"
    | "REPOST"
    | "FOLLOW"
    | "TIP"
    | "SUBSCRIPTION"
    | "ADMIN_MESSAGE"
    | "MATCH";

export interface NotificationWithActor extends TSelectNotification {
    actor?: {
        id: string;
        username: string;
        avatarUrl: string | null;
    } | null;
}

export const createNotification = async (
    actorId: string,
    recipientId: string,
    type: NotificationType,
    message: string,
    entityId?: string
): Promise<TSelectNotification> => {
    // Don't notify yourself
    if (actorId === recipientId) {
        return null as any;
    }

    const [notification] = await db
        .insert(notifications)
        .values({
            userId: recipientId,
            actorId,
            type,
            message,
            entityId: entityId ?? null,
            isRead: false,
        } as TInsertNotification)
        .returning();

    return notification;
};

export const getUserNotifications = async (
    userId: string,
    page = 1,
    limit = 20
): Promise<{ data: NotificationWithActor[]; total: number }> => {
    const offset = (page - 1) * limit;

    const rows = await db.query.notifications.findMany({
        where: eq(notifications.userId, userId),
        orderBy: [desc(notifications.createdAt)],
        limit,
        offset,
        with: {
            actor: {
                columns: { id: true, username: true, avatarUrl: true },
            },
        },
    });

    // Get total count
    const allRows = await db
        .select({ id: notifications.id })
        .from(notifications)
        .where(eq(notifications.userId, userId));

    return { data: rows as NotificationWithActor[], total: allRows.length };
};

export const markNotificationAsRead = async (
    notificationId: string,
    userId: string
): Promise<TSelectNotification | null> => {
    const [updated] = await db
        .update(notifications)
        .set({ isRead: true })
        .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
        .returning();

    return updated ?? null;
};

export const markAllNotificationsAsRead = async (userId: string): Promise<number> => {
    const result = await db
        .update(notifications)
        .set({ isRead: true })
        .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
        .returning({ id: notifications.id });

    return result.length;
};

export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
    const result = await db
        .select({ id: notifications.id })
        .from(notifications)
        .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

    return result.length;
};

export const deleteNotification = async (
    notificationId: string,
    userId: string
): Promise<boolean> => {
    const result = await db
        .delete(notifications)
        .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
        .returning({ id: notifications.id });

    return result.length > 0;
};
