import { Router } from "express";
import { MessageController } from "./message.controller";
import { authMiddleware } from "../../Middlewares/BearAuth";
import { rateLimiterMiddleware } from "../../Middlewares/rateLimiter";

const messageRouter = Router();
const messageController = new MessageController();
const applyRatelimiting = rateLimiterMiddleware;
messageRouter.use(applyRatelimiting);

// All routes require authentication
messageRouter.use(authMiddleware);

// Send a message
messageRouter.post("/", messageController.sendMessage);

// Get conversation list (all chats)
messageRouter.get("/conversations", messageController.getConversationList);

// Get unread message count
messageRouter.get("/unread-count", messageController.getUnreadCount);

// Get conversation with specific user
messageRouter.get("/conversation/:otherUserId", messageController.getConversation);

// Mark conversation as read
messageRouter.patch("/conversation/:otherUserId/read", messageController.markConversationAsRead);

// Update message status (delivered/read)
messageRouter.patch("/:messageId/status", messageController.updateMessageStatus);

// Delete message
messageRouter.delete("/:messageId", messageController.deleteMessage);

export default messageRouter;
