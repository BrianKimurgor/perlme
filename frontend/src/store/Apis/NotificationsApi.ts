import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

// -------------------- TYPES --------------------
export interface NotificationActor {
    id: string;
    username: string;
    avatarUrl: string | null;
}

export interface Notification {
    id: string;
    userId: string;
    actorId: string | null;
    type:
        | "MESSAGE"
        | "LIKE"
        | "COMMENT"
        | "REPOST"
        | "FOLLOW"
        | "TIP"
        | "SUBSCRIPTION"
        | "ADMIN_MESSAGE"
        | "MATCH";
    entityId: string | null;
    message: string;
    isRead: boolean;
    createdAt: string;
    actor?: NotificationActor | null;
}

export interface NotificationsMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface NotificationsResponse {
    notifications: Notification[];
    meta: NotificationsMeta;
}

// -------------------- API --------------------
export const notificationsApi = createApi({
    reducerPath: "notificationsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Notifications", "NotifUnreadCount"],

    endpoints: (builder) => ({
        // GET /api/notifications
        getNotifications: builder.query<NotificationsResponse, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 20 } = {}) =>
                `notifications?page=${page}&limit=${limit}`,
            providesTags: ["Notifications"],
            transformResponse: (response: any) =>
                response.data || { notifications: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } },
        }),

        // GET /api/notifications/unread-count
        getUnreadNotifCount: builder.query<{ count: number }, void>({
            query: () => "notifications/unread-count",
            providesTags: ["NotifUnreadCount"],
            transformResponse: (response: any) => response.data || { count: 0 },
        }),

        // PATCH /api/notifications/:id/read
        markNotificationRead: builder.mutation<Notification, string>({
            query: (id) => ({
                url: `notifications/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications", "NotifUnreadCount"],
            transformResponse: (response: any) => response.data,
        }),

        // PATCH /api/notifications/read-all
        markAllNotificationsRead: builder.mutation<{ count: number }, void>({
            query: () => ({
                url: "notifications/read-all",
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications", "NotifUnreadCount"],
            transformResponse: (response: any) => response.data || { count: 0 },
        }),

        // DELETE /api/notifications/:id
        deleteNotification: builder.mutation<void, string>({
            query: (id) => ({
                url: `notifications/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notifications", "NotifUnreadCount"],
        }),
    }),
});

// -------------------- HOOKS --------------------
export const {
    useGetNotificationsQuery,
    useGetUnreadNotifCountQuery,
    useMarkNotificationReadMutation,
    useMarkAllNotificationsReadMutation,
    useDeleteNotificationMutation,
} = notificationsApi;
