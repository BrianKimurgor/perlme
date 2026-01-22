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

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messaging system (send, receive, conversation management)
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *               - content
 *             properties:
 *               recipientId:
 *                 type: string
 *                 example: 123456
 *               content:
 *                 type: string
 *                 example: Hello, how are you?
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
messageRouter.post("/", messageController.sendMessage);

/**
 * @swagger
 * /api/messages/conversations:
 *   get:
 *     summary: Get conversation list (all chats)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   conversationId:
 *                     type: string
 *                   participants:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                         name:
 *                           type: string
 *                   lastMessage:
 *                     type: string
 */
messageRouter.get("/conversations", messageController.getConversationList);

/**
 * @swagger
 * /api/messages/unread-count:
 *   get:
 *     summary: Get unread message count
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread message count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 unreadCount:
 *                   type: integer
 *                   example: 5
 */
messageRouter.get("/unread-count", messageController.getUnreadCount);

/**
 * @swagger
 * /api/messages/conversation/{otherUserId}:
 *   get:
 *     summary: Get conversation with a specific user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: otherUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the other user
 *     responses:
 *       200:
 *         description: Messages in the conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   messageId:
 *                     type: string
 *                   senderId:
 *                     type: string
 *                   content:
 *                     type: string
 *                   status:
 *                     type: string
 *                     example: delivered
 *                   createdAt:
 *                     type: string
 */
messageRouter.get("/conversation/:otherUserId", messageController.getConversation);

/**
 * @swagger
 * /api/messages/conversation/{otherUserId}/read:
 *   patch:
 *     summary: Mark conversation as read
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: otherUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the other user
 *     responses:
 *       200:
 *         description: Conversation marked as read
 */
messageRouter.patch("/conversation/:otherUserId/read", messageController.markConversationAsRead);

/**
 * @swagger
 * /api/messages/{messageId}/status:
 *   patch:
 *     summary: Update message status (delivered/read)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [delivered, read]
 *                 example: read
 *     responses:
 *       200:
 *         description: Message status updated
 */
messageRouter.patch("/:messageId/status", messageController.updateMessageStatus);

/**
 * @swagger
 * /api/messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 */
messageRouter.delete("/:messageId", messageController.deleteMessage);

export default messageRouter;
