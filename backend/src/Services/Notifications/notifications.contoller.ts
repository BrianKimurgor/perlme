import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../../Services/Notifications/notifications.service";

export class NotificationController {
  constructor(private service: NotificationService) {}

  // 📬 Create a new notification (optional, for admin/system/internal use)
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, actorId, type, title, body, data } = req.body;

      if (!userId || !type) {
        return res.status(400).json({ error: "userId and type are required" });
      }

      const notification = await this.service.createNotification({
        userId,
        actorId,
        type,
        title,
        body,
        data,
      });

      return res.status(201).json({ notification });
    } catch (err) {
      next(err);
    }
  };

  // 🔔 Get a user's notifications
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const limit = Number(req.query.limit ?? 50);
      const offset = Number(req.query.offset ?? 0);
      const notifications = await this.service.listNotifications(userId, { limit, offset });

      return res.status(200).json({ notifications });
    } catch (err) {
      next(err);
    }
  };

  // ✅ Mark one notification as read
  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { id } = req.params;
      await this.service.markAsRead(userId, id);

      return res.status(200).json({ ok: true });
    } catch (err) {
      next(err);
    }
  };

  // ✅ Mark all notifications as read
  markAllRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await this.service.markAllRead(userId);

      return res.status(200).json({ ok: true });
    } catch (err) {
      next(err);
    }
  };

  // ❌ Delete a notification
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { id } = req.params;
      await this.service.deleteNotification(userId, id);

      return res.status(200).json({ ok: true });
    } catch (err) {
      next(err);
    }
  };
}

export default NotificationController;
