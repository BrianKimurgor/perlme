const registerChatEvents = (io) => {
    io.on("connection", (socket) => {
        console.log("✅ User connected:", socket.id);

        // --- Join a chat room ---
        socket.on("chat:join", ({ conversationId, userId }) => {
            socket.join(conversationId);
            socket.conversationId = conversationId;
            socket.userId = userId;

            console.log(`👥 User ${userId} joined room ${conversationId}`);

            // Notify others in the room
            socket.to(conversationId).emit("user:online", { userId });
        });

        // --- Leave a chat room ---
        socket.on("chat:leave", ({ conversationId, userId }) => {
            socket.leave(conversationId);
            console.log(`👋 User ${userId} left room ${conversationId}`);
            socket.to(conversationId).emit("user:offline", { userId });
        });

        // --- Send text message ---
        socket.on("chat:send", ({ conversationId, from, message, timestamp }) => {
            console.log(`💬 [${conversationId}] ${from}: ${message}`);
            io.to(conversationId).emit("chat:receive", { from, message, timestamp });
        });

        // --- Typing indicator ---
        socket.on("chat:typing", ({ conversationId, from, isTyping }) => {
            socket.to(conversationId).emit("chat:typing", { from, isTyping });
        });

        // --- Read receipts ---
        socket.on("chat:read", ({ conversationId, messageId, readerId }) => {
            socket.to(conversationId).emit("chat:read", { messageId, readerId, readAt: Date.now() });
        });

        // --- Media messages (images, voice notes, videos, etc.) ---
        socket.on("chat:media", ({ conversationId, from, mediaUrl, mediaType, timestamp }) => {
            io.to(conversationId).emit("chat:media", { from, mediaUrl, mediaType, timestamp });
        });

        // --- Match notifications (sent directly to a user room, not conversation) ---
        socket.on("match:new", ({ userId, matchedUserId }) => {
            // Each user can be in their own "personal room" = userId
            io.to(matchedUserId).emit("match:new", { userId });
        });

        // --- Disconnect cleanup ---
        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
            if (socket.conversationId && socket.userId) {
                socket.to(socket.conversationId).emit("user:offline", { userId: socket.userId });
            }
        });
    });
}

export default registerChatEvents;
