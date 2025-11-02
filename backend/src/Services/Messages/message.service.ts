import db  from "../../drizzle/db";
import { messages, users, blocks } from "../../drizzle/schema";
import { eq, and, or, desc, sql } from "drizzle-orm";
import { getSocketService } from "../../socket/socket";

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

        // If receiver is online, emit the message and update status to DELIVERED
        if (socketService.isUserOnline(receiverId)) {
            // Emit to receiver
            socketService.emitToUser(receiverId, "new_message", {
                message: newMessage,
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

            return updatedMessage;
        }

        // Notify sender that message was sent
        socketService.emitToUser(senderId, "message_sent", {
            message: newMessage,
            tempId,
        });

        return newMessage;
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

        return conversation.reverse(); // Return oldest first
    }

    async getConversationList(userId: string) {
        // Get list of users with recent conversations
        const conversations = await db
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
                username: users.username,
                avatarUrl: users.avatarUrl,
                isVerified: users.isVerified,
            })
            .from(messages)
            .leftJoin(
                users,
                sql`${users.id} = CASE 
          WHEN ${messages.senderId} = ${userId} THEN ${messages.receiverId}
          ELSE ${messages.senderId}
        END`
            )
            .where(
                or(eq(messages.senderId, userId), eq(messages.receiverId, userId))
            )
            .groupBy(
                sql`CASE 
          WHEN ${messages.senderId} = ${userId} THEN ${messages.receiverId}
          ELSE ${messages.senderId}
        END`,
                messages.id,
                users.username,
                users.avatarUrl,
                users.isVerified
            )
            .orderBy(desc(messages.createdAt));

        // Get unique conversations with latest message
        const uniqueConversations = new Map<string, typeof conversations[number]>();

        for (const conv of conversations) {
            if (!uniqueConversations.has(conv.otherUserId)) {
                uniqueConversations.set(conv.otherUserId, conv);
            }
        }

        return Array.from(uniqueConversations.values());
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

    //get messages between two users
    async getMessagesBetweenUsers(userId1: string, userId2: string) {
        const messagesBetween = await db
            .select()
            .from(messages)
            .where(
                or(
                    and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
                    and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
                )
            )
            .orderBy(desc(messages.createdAt));
            if (messagesBetween.length > 0) {
                return messagesBetween;
            }
            else {
                throw new Error("No messages found between the users");
            }


        return messagesBetween;
    }

    //
}



