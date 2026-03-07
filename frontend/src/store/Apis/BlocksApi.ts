import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

// -------------------- TYPES --------------------
export interface BlockedUser {
    id: string;
    blockerId: string;
    blockedId: string;
    createdAt: string;
    blocked?: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
}

export interface BlockRequest {
    targetUserId: string;
}

export interface BlockStatus {
    isBlocked: boolean;
    blockedByMe: boolean;
    blockedMe: boolean;
}

// -------------------- API --------------------
export const blocksApi = createApi({
    reducerPath: "blocksApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Blocks", "BlockStatus"],

    endpoints: (builder) => ({
        // Block a user
        blockUser: builder.mutation<{ message: string }, BlockRequest>({
            query: (payload) => ({
                url: "blocks",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Blocks", "BlockStatus"],
        }),

        // Unblock a user
        unblockUser: builder.mutation<{ message: string }, BlockRequest>({
            query: (payload) => ({
                url: "blocks",
                method: "DELETE",
                body: payload,
            }),
            invalidatesTags: ["Blocks", "BlockStatus"],
        }),

        // Check block status with specific user
        checkBlockStatus: builder.query<BlockStatus, string>({
            query: (targetUserId) => `blocks/status/${targetUserId}`,
            providesTags: (_result, _error, targetUserId) => [
                { type: "BlockStatus", id: targetUserId },
            ],
        }),

        // Get list of users I blocked
        getBlockedUsers: builder.query<BlockedUser[], void>({
            query: () => "blocks/me/blocked",
            providesTags: ["Blocks"],
        }),

        // Get list of users who blocked me
        getBlockedBy: builder.query<BlockedUser[], void>({
            query: () => "blocks/me/blocked-by",
            providesTags: ["Blocks"],
        }),
    }),
});

// -------------------- HOOKS --------------------
export const {
    useBlockUserMutation,
    useUnblockUserMutation,
    useCheckBlockStatusQuery,
    useGetBlockedUsersQuery,
    useGetBlockedByQuery,
} = blocksApi;
