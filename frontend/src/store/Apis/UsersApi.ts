import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

// -------------------- TYPES --------------------
export interface UserProfile {
    id: string;
    username: string;
    email: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE" | "NON_BINARY" | "OTHER" | null;
    orientation:
    | "STRAIGHT"
    | "GAY"
    | "LESBIAN"
    | "BISEXUAL"
    | "ASEXUAL"
    | "PANSEXUAL"
    | "OTHER"
    | null;
    isSuspended: boolean;
    suspendedUntil: string | null;
    bio: string | null;
    avatarUrl: string | null;
    coverPhotoUrl: string | null;
    isVerified: boolean;
    visibility: "PUBLIC" | "PRIVATE" | "FRIENDS_ONLY";
    role: "REGULAR" | "CREATOR" | "MODERATOR" | "ADMIN";
    createdAt: string;
    updatedAt: string;
    _count?: {
        posts: number;
        followers: number;
        following: number;
    };
}

export interface UpdateUserRequest {
    username?: string;
    bio?: string;
    avatarUrl?: string;
    coverPhotoUrl?: string;
    gender?: "MALE" | "FEMALE" | "NON_BINARY" | "OTHER";
    orientation?:
    | "STRAIGHT"
    | "GAY"
    | "LESBIAN"
    | "BISEXUAL"
    | "ASEXUAL"
    | "PANSEXUAL"
    | "OTHER";
    visibility?: "PUBLIC" | "PRIVATE" | "FRIENDS_ONLY";
}

// -------------------- API --------------------
export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "Users"],

    endpoints: (builder) => ({
        // Get user by ID
        getUserById: builder.query<UserProfile, string>({
            query: (userId) => `users/${userId}`,
            providesTags: (_result, _error, userId) => [{ type: "User", id: userId }],
            transformResponse: (response: any) => response.data,
        }),

        // Get all users (admin/moderator only)
        getAllUsers: builder.query<UserProfile[], void>({
            query: () => "users/all",
            providesTags: ["Users"],
            transformResponse: (response: any) => response.data || [],
        }),

        // Update user
        updateUser: builder.mutation<
            UserProfile,
            { userId: string; data: UpdateUserRequest }
        >({
            query: ({ userId, data }) => ({
                url: `users/${userId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { userId }) => [
                { type: "User", id: userId },
            ],
            transformResponse: (response: any) => response.data,
        }),

        // Delete user
        deleteUser: builder.mutation<{ message: string }, string>({
            query: (userId) => ({
                url: `users/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],
            transformResponse: (response: any) => response.data || { message: response.message },
        }),

        // Check user status
        checkUserStatus: builder.query<
            { isSuspended: boolean; suspendedUntil: string | null },
            string
        >({
            query: (userId) => `users/${userId}/status`,
            transformResponse: (response: any) => response.data,
        }),

        // Follow user
        followUser: builder.mutation<{ message: string }, string>({
            query: (userId) => ({
                url: `users/${userId}/follow`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, userId) => [
                { type: "User", id: userId },
                { type: "User", id: `following-${userId}` },
                "Users",
            ],
            transformResponse: (response: any) => response.data || { message: response.message },
            async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
                try {
                    await queryFulfilled;
                    // Also invalidate the current user's profile to update their following count
                    const state = getState() as any;
                    const currentUserId = state.auth.user?.id;
                    if (currentUserId) {
                        dispatch(
                            usersApi.util.invalidateTags([{ type: "User", id: currentUserId }])
                        );
                    }
                } catch {
                    // Error already handled by the mutation
                }
            },
        }),

        // Unfollow user
        unfollowUser: builder.mutation<{ message: string }, string>({
            query: (userId) => ({
                url: `users/${userId}/unfollow`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, userId) => [
                { type: "User", id: userId },
                { type: "User", id: `following-${userId}` },
                "Users",
            ],
            transformResponse: (response: any) => response.data || { message: response.message },
            async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
                try {
                    await queryFulfilled;
                    // Also invalidate the current user's profile to update their following count
                    const state = getState() as any;
                    const currentUserId = state.auth.user?.id;
                    if (currentUserId) {
                        dispatch(
                            usersApi.util.invalidateTags([{ type: "User", id: currentUserId }])
                        );
                    }
                } catch {
                    // Error already handled by the mutation
                }
            },
        }),

        // Check if following
        checkIfFollowing: builder.query<{ isFollowing: boolean }, string>({
            query: (userId) => `users/${userId}/following`,
            providesTags: (_result, _error, userId) => [
                { type: "User", id: `following-${userId}` },
            ],
            transformResponse: (response: any) => response.data,
        }),
    }),
});

// -------------------- HOOKS --------------------
export const {
    useGetUserByIdQuery,
    useGetAllUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useCheckUserStatusQuery,
    useFollowUserMutation,
    useUnfollowUserMutation,
    useCheckIfFollowingQuery,
} = usersApi;
