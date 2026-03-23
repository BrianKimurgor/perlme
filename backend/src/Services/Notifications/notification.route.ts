import { Router } from "express";
import {
    deleteNotificationController,
    getNotificationsController,
    getUnreadCountController,
    markAllAsReadController,
    markAsReadController,
} from "./notification.controller";

const notificationRouter = Router();

// GET /api/notifications — list all notifications (paginated)
notificationRouter.get("/notifications", getNotificationsController);

// GET /api/notifications/unread-count — unread badge count
notificationRouter.get("/notifications/unread-count", getUnreadCountController);

// PATCH /api/notifications/:id/read — mark single notification as read
notificationRouter.patch("/notifications/:id/read", markAsReadController);

// PATCH /api/notifications/read-all — mark all as read
notificationRouter.patch("/notifications/read-all", markAllAsReadController);

// DELETE /api/notifications/:id — delete a notification
notificationRouter.delete("/notifications/:id", deleteNotificationController);

export default notificationRouter;
