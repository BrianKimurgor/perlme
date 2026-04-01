import { and, desc, eq, inArray, or, sql } from "drizzle-orm";
import db from "../../drizzle/db";
import { blocks, messages, users } from "../../drizzle/schema";
import { getSocketService } from "../../socket/socket";
import { logger } from "../../utils/logger";
import { createNotification } from "../Notifications/notification.service";

export interface SendMessageDTO {
    senderId: string;
    receiverId: string;
    content: string;
    mediaUrl?: string;
    mediaType?: string;
    tempId?: string; // Client-generated temp ID for optimistic updates
}

export interface UpdateMessageStatusDTO {
    messageId: string;
    status: "DELIVERED" | "READ";
    userId: string; // The user updating the status (must be receiver)
}

export class MessageService {
    async sendMessage(data: SendMessageDTO) {
        const { senderId, receiverId, content, mediaUrl, mediaType, tempId } = data;

        // Validate users exist
        const [sender, receiver] = await Promise.all([
            db.select().from(users).where(eq(users.id, senderId)).limit(1),
            db.select().from(users).where(eq(users.id, receiverId)).limit(1),
        ]);

        if (!sender.length || !receiver.length) {
            throw new Error("Sender or receiver not found");
        }

        // Check if blocked
        const block = await db
            .select()
            .from(blocks)
            .where(
                or(
                    and(eq(blocks.blockerId, senderId), eq(blocks.blockedId, receiverId)),
                    and(eq(blocks.blockerId, receiverId), eq(blocks.blockedId, senderId))
                )
            )
            .limit(1);

        if (block.length > 0) {
            throw new Error("Cannot send message to blocked user");
        }

        // Insert message with SENT status
        const [newMessage] = await db
            .insert(messages)
            .values({
                senderId,
                receiverId,
                content,
                mediaUrl,
                mediaType,
                status: "SENT",
            })
            .returning();

        // Get socket service
        const socketService = getSocketService();

        // Prepare message with sender info for response
        const messageWithSender = {
            ...newMessage,
            sender: {
                id: sender[0].id,
                username: sender[0].username,
                avatarUrl: sender[0].avatarUrl,
            },
        };

        // If receiver is online, emit the message and update status to DELIVERED
        if (socketService.isUserOnline(receiverId)) {
            // Emit to receiver
            socketService.emitToUser(receiverId, "new_message", {
                message: messageWithSender,
                sender: {
                    id: sender[0].id,
                    username: sender[0].username,
                    avatarUrl: sender[0].avatarUrl,
                },
            });

            // Auto-update to DELIVERED since receiver is online
            const [updatedMessage] = await db
                .update(messages)
                .set({ status: "DELIVERED" })
                .where(eq(messages.id, newMessage.id))
                .returning();

            // Notify sender about delivery
            socketService.emitToUser(senderId, "message_delivered", {
                messageId: updatedMessage.id,
                tempId,
            });

            return {
                ...updatedMessage,
                sender: {
                    id: sender[0].id,
                    username: sender[0].username,
                    avatarUrl: sender[0].avatarUrl,
                },
            };
        }

        // Notify sender that message was sent
        socketService.emitToUser(senderId, "message_sent", {
            message: messageWithSender,
            tempId,
        });

        // Notify receiver about new message (fire-and-forget, only if not online)
        createNotification(senderId, receiverId, "MESSAGE", "sent you a message", newMessage.id).catch(() => { });

        return messageWithSender;
    }

    async updateMessageStatus(data: UpdateMessageStatusDTO) {
        const { messageId, status, userId } = data;

        // Get the message
        const [message] = await db
            .select()
            .from(messages)
            .where(eq(messages.id, messageId))
            .limit(1);

        if (!message) {
            throw new Error("Message not found");
        }

        // Only receiver can update status
        if (message.receiverId !== userId) {
            throw new Error("Unauthorized to update message status");
        }

        // Prevent downgrading status
        const statusOrder = { SENT: 0, DELIVERED: 1, READ: 2 };
        const currentStatus = message.status || "SENT";

        if (statusOrder[currentStatus] >= statusOrder[status]) {
            return message; // Already at this status or higher
        }

        // Update status
        const [updatedMessage] = await db
            .update(messages)
            .set({ status })
            .where(eq(messages.id, messageId))
            .returning();

        // Notify sender about status change
        const socketService = getSocketService();
        const eventName = status === "DELIVERED" ? "message_delivered" : "message_read";

        socketService.emitToUser(message.senderId, eventName, {
            messageId: updatedMessage.id,
            status: updatedMessage.status,
        });

        return updatedMessage;
    }

    async markConversationAsRead(userId: string, otherUserId: string) {
        // Mark all messages from otherUserId to userId as READ
        const updatedMessages = await db
            .update(messages)
            .set({ status: "READ" })
            .where(
                and(
                    eq(messages.receiverId, userId),
                    eq(messages.senderId, otherUserId),
                    or(eq(messages.status, "SENT"), eq(messages.status, "DELIVERED"))
                )
            )
            .returning();

        if (updatedMessages.length > 0) {
            // Notify sender that messages were read
            const socketService = getSocketService();
            socketService.emitToUser(otherUserId, "messages_read", {
                messageIds: updatedMessages.map((m) => m.id),
                readBy: userId,
            });
        }

        return updatedMessages;
    }

    async getConversation(userId: string, otherUserId: string, limit = 50, offset = 0) {
        const conversation = await db
            .select({
                id: messages.id,
                senderId: messages.senderId,
                receiverId: messages.receiverId,
                content: messages.content,
                mediaUrl: messages.mediaUrl,
                mediaType: messages.mediaType,
                status: messages.status,
                createdAt: messages.createdAt,
                senderUsername: users.username,
                senderAvatar: users.avatarUrl,
            })
            .from(messages)
            .leftJoin(users, eq(messages.senderId, users.id))
            .where(
                or(
                    and(eq(messages.senderId, userId), eq(messages.receiverId, otherUserId)),
                    and(eq(messages.senderId, otherUserId), eq(messages.receiverId, userId))
                )
            )
            .orderBy(desc(messages.createdAt))
            .limit(limit)
            .offset(offset);

        // Transform to match frontend Message type with nested sender object
        const formattedMessages = conversation.map((msg) => ({
            id: msg.id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            content: msg.content,
            mediaUrl: msg.mediaUrl,
            mediaType: msg.mediaType,
            status: msg.status,
            createdAt: msg.createdAt,
            sender: {
                id: msg.senderId,
                username: msg.senderUsername || "Unknown",
                avatarUrl: msg.senderAvatar,
            },
        }));

        return formattedMessages.reverse(); // Return oldest first
    }

    async getConversationList(userId: string) {
        logger.info("📥 Starting getConversationList for user:", userId);

        // Get list of users with recent conversations using a subquery approach
        logger.info("🔍 Fetching latest messages...");
        const latestMessages = await db
            .select({
                otherUserId: sql<string>`CASE 
          WHEN ${messages.senderId} = ${userId} THEN ${messages.receiverId}
          ELSE ${messages.senderId}
        END`,
                lastMessage: messages.content,
                lastMessageId: messages.id,
                lastMessageStatus: messages.status,
                lastMessageTime: messages.createdAt,
                lastMessageSenderId: messages.senderId,
            })
            .from(messages)
            .where(
                or(eq(messages.senderId, userId), eq(messages.receiverId, userId))
            )
            .orderBy(desc(messages.createdAt));

        logger.info("✅ Found", latestMessages.length, "messages");

        // Get unique conversations with latest message for each user
        const uniqueConversations = new Map<string, typeof latestMessages[number]>();

        for (const msg of latestMessages) {
            if (!uniqueConversations.has(msg.otherUserId)) {
                uniqueConversations.set(msg.otherUserId, msg);
            }
        }

        logger.info("✅ Found", uniqueConversations.size, "unique conversations");

        // Get user details for all conversation partners
        const otherUserIds = Array.from(uniqueConversations.keys());

        // Return empty array if no conversations
        if (otherUserIds.length === 0) {
            logger.info("ℹ️ No conversations found");
            return [];
        }

        logger.info("🔍 Fetching user details for", otherUserIds.length, "users...");
        const conversationUsers = await db
            .select({
                id: users.id,
                username: users.username,
                avatarUrl: users.avatarUrl,
                isVerified: users.isVerified,
            })
            .from(users)
            .where(inArray(users.id, otherUserIds));

        logger.info("✅ Found", conversationUsers.length, "users");

        // Create user map for quick lookup
        const userMap = new Map(conversationUsers.map(u => [u.id, u]));

        logger.info("🔍 Calculating unread counts...");
        // Get unread counts for each conversation
        const unreadCounts = await Promise.all(
            Array.from(uniqueConversations.keys()).map(async (otherUserId) => {
                const count = await this.getUnreadCount(userId, otherUserId);
                return { otherUserId, count };
            })
        );

        const unreadMap = new Map(unreadCounts.map(u => [u.otherUserId, u.count]));
        logger.info("✅ Calculated unread counts");

        // Combine message data with user data in the format expected by frontend
        const conversations = Array.from(uniqueConversations.entries()).map(([otherUserId, msg]) => {
            const user = userMap.get(otherUserId);
            return {
                otherUser: {
                    id: otherUserId,
                    username: user?.username || 'Unknown',
                    avatarUrl: user?.avatarUrl || null,
                    isVerified: user?.isVerified || false,
                },
                lastMessage: {
                    content: msg.lastMessage,
                    createdAt: msg.lastMessageTime,
                    senderId: msg.lastMessageSenderId,
                },
                unreadCount: unreadMap.get(otherUserId) || 0,
            };
        });

        // Sort by last message time (most recent first)
        conversations.sort((a, b) => {
            const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
            return timeB - timeA;
        });

        logger.info("✅ Conversation list ready:", conversations.length, "conversations");
        return conversations;
    }

    async getUnreadCount(userId: string, otherUserId?: string) {
        const conditions = [
            eq(messages.receiverId, userId),
            or(eq(messages.status, "SENT"), eq(messages.status, "DELIVERED")),
        ];

        if (otherUserId) {
            conditions.push(eq(messages.senderId, otherUserId));
        }

        const [result] = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(messages)
            .where(and(...conditions));

        return result.count;
    }

    async deleteMessage(messageId: string, userId: string) {
        // Get the message
        const [message] = await db
            .select()
            .from(messages)
            .where(eq(messages.id, messageId))
            .limit(1);

        if (!message) {
            throw new Error("Message not found");
        }

        // Only sender can delete
        if (message.senderId !== userId) {
            throw new Error("Unauthorized to delete message");
        }

        // Delete message
        await db.delete(messages).where(eq(messages.id, messageId));

        // Notify both users
        const socketService = getSocketService();
        socketService.emitToMultipleUsers(
            [message.senderId, message.receiverId],
            "message_deleted",
            { messageId }
        );

        return { success: true };
    }
}

