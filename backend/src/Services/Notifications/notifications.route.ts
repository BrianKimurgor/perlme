import { Router } from "express";
import { NotificationController } from "../Notifications/notifications.contoller";
import { NotificationService } from "../Notifications/notifications.service";
import db from "../../drizzle/db";
import { getSocketService } from "../../socket/socket";

const router = Router();

// Get the existing socket service instance
const socketService = getSocketService();

// Initialize the service and controller
const notificationService = new NotificationService(db, socketService);
const notificationController = new NotificationController(notificationService);

// Define routes
router.get("/", notificationController.list);
router.patch("/:id/read", notificationController.markAsRead);
router.patch("/read-all", notificationController.markAllRead);
router.delete("/:id", notificationController.delete);

export default router;
