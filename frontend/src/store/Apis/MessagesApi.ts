import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

// -------------------- TYPES --------------------
export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    mediaUrl: string | null;
    mediaType: string | null;
    status: "SENT" | "DELIVERED" | "READ";
    createdAt: string;
    sender?: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
    receiver?: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
}

export interface Conversation {
    otherUser: {
        id: string;
        username: string;
        avatarUrl: string | null;
        isOnline?: boolean;
    };
    lastMessage: {
        content: string;
        createdAt: string;
        senderId: string;
    } | null;
    unreadCount: number;
}

export interface SendMessageRequest {
    receiverId: string;
    content: string;
    mediaUrl?: string;
    mediaType?: string;
}

export interface UpdateMessageStatusRequest {
    status: "SENT" | "DELIVERED" | "READ";
}

// -------------------- API --------------------
export const messagesApi = createApi({
    reducerPath: "messagesApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Messages", "Conversations", "UnreadCount"],

    endpoints: (builder) => ({
        // Send message
        sendMessage: builder.mutation<Message, SendMessageRequest>({
            query: (payload) => ({
                url: "messages",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: (result, error, arg) => [
                "Conversations",
                "UnreadCount",
                { type: "Messages", id: arg.receiverId },
            ],
            transformResponse: (response: any) => response.data,
        }),

        // Get conversation list
        getConversationList: builder.query<Conversation[], void>({
            query: () => "messages/conversations",
            transformResponse: (response: any) => response.data || [],
            providesTags: ["Conversations"],
        }),

        // Get unread count
        getUnreadCount: builder.query<{ count: number }, void>({
            query: () => "messages/unread-count",
            providesTags: ["UnreadCount"],
            transformResponse: (response: any) => response.data || { count: 0 },
        }),

        // Get conversation with specific user
        getConversation: builder.query<Message[], string>({
            query: (otherUserId) => `messages/conversation/${otherUserId}`,
            providesTags: (_result, _error, otherUserId) => [
                { type: "Messages", id: otherUserId },
            ],
            transformResponse: (response: any) => response.data || [],
        }),

        // Mark conversation as read
        markConversationAsRead: builder.mutation<{ message: string }, string>({
            query: (otherUserId) => ({
                url: `messages/conversation/${otherUserId}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["UnreadCount", "Conversations"],
            transformResponse: (response: any) => response.data || { message: response.message },
        }),

        // Update message status
        updateMessageStatus: builder.mutation<
            { message: string },
            { messageId: string; data: UpdateMessageStatusRequest }
        >({
            query: ({ messageId, data }) => ({
                url: `messages/${messageId}/status`,
                method: "PATCH",
                body: data,
            }),
            transformResponse: (response: any) => response.data || { message: response.message },
        }),

        // Delete message
        deleteMessage: builder.mutation<{ message: string }, string>({
            query: (messageId) => ({
                url: `messages/${messageId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Conversations"],
            transformResponse: (response: any) => response.data || { message: response.message },
        }),
    }),
});

// -------------------- HOOKS --------------------
export const {
    useSendMessageMutation,
    useGetConversationListQuery,
    useGetUnreadCountQuery,
    useGetConversationQuery,
    useMarkConversationAsReadMutation,
    useUpdateMessageStatusMutation,
    useDeleteMessageMutation,
} = messagesApi;
