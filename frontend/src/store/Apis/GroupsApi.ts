import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

// -------------------- TYPES --------------------
export interface Group {
    id: string;
    name: string;
    description: string | null;
    creatorId: string;
    avatarUrl: string | null;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
    members?: GroupMember[];
    _count?: {
        members: number;
        messages: number;
    };
}

export interface GroupMember {
    id: string;
    groupId: string;
    userId: string;
    role: "GROUP_ADMIN" | "GROUP_MODERATOR" | "GROUP_MEMBER" | "GROUP_REMOVED";
    joinedAt: string;
    user?: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
}

export interface GroupMessage {
    id: string;
    groupId: string;
    senderId: string;
    content: string;
    mediaUrl: string | null;
    mediaType: string | null;
    createdAt: string;
    sender?: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
}

export interface CreateGroupRequest {
    name: string;
    description?: string;
    avatarUrl?: string;
    isPrivate?: boolean;
}

export interface UpdateGroupRequest {
    name?: string;
    description?: string;
    avatarUrl?: string;
    isPrivate?: boolean;
}

export interface AddMemberRequest {
    userId: string;
}

export interface UpdateMemberRoleRequest {
    role: "GROUP_ADMIN" | "GROUP_MODERATOR" | "GROUP_MEMBER";
}

export interface SendGroupMessageRequest {
    content: string;
    mediaUrl?: string;
    mediaType?: string;
}

// -------------------- API --------------------
export const groupsApi = createApi({
    reducerPath: "groupsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Groups", "Group", "GroupMembers", "GroupMessages"],

    endpoints: (builder) => ({
        // Create group
        createGroup: builder.mutation<Group, CreateGroupRequest>({
            query: (payload) => ({
                url: "",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Groups"],
        }),

        // Get all groups
        getAllGroups: builder.query<Group[], void>({
            query: () => "",
            providesTags: ["Groups"],
        }),

        // Get group by ID
        getGroupById: builder.query<Group, string>({
            query: (groupId) => groupId,
            providesTags: (_result, _error, groupId) => [
                { type: "Group", id: groupId },
            ],
        }),

        // Update group
        updateGroup: builder.mutation<
            Group,
            { groupId: string; data: UpdateGroupRequest }
        >({
            query: ({ groupId, data }) => ({
                url: groupId,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { groupId }) => [
                { type: "Group", id: groupId },
                "Groups",
            ],
        }),

        // Delete group
        deleteGroup: builder.mutation<{ message: string }, string>({
            query: (groupId) => ({
                url: groupId,
                method: "DELETE",
            }),
            invalidatesTags: ["Groups"],
        }),

        // Add member to group
        addGroupMember: builder.mutation<
            GroupMember,
            { groupId: string; data: AddMemberRequest }
        >({
            query: ({ groupId, data }) => ({
                url: `${groupId}/members`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { groupId }) => [
                { type: "GroupMembers", id: groupId },
                { type: "Group", id: groupId },
            ],
        }),

        // Remove member from group
        removeGroupMember: builder.mutation<
            { message: string },
            { groupId: string; memberId: string }
        >({
            query: ({ groupId, memberId }) => ({
                url: `${groupId}/members/${memberId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, { groupId }) => [
                { type: "GroupMembers", id: groupId },
                { type: "Group", id: groupId },
            ],
        }),

        // Update member role
        updateMemberRole: builder.mutation<
            GroupMember,
            { groupId: string; memberId: string; data: UpdateMemberRoleRequest }
        >({
            query: ({ groupId, memberId, data }) => ({
                url: `${groupId}/members/${memberId}/role`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { groupId }) => [
                { type: "GroupMembers", id: groupId },
            ],
        }),

        // Get group members
        getGroupMembers: builder.query<GroupMember[], string>({
            query: (groupId) => `${groupId}/members`,
            providesTags: (_result, _error, groupId) => [
                { type: "GroupMembers", id: groupId },
            ],
        }),

        // Send group message
        sendGroupMessage: builder.mutation<
            GroupMessage,
            { groupId: string; data: SendGroupMessageRequest }
        >({
            query: ({ groupId, data }) => ({
                url: `${groupId}/messages`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { groupId }) => [
                { type: "GroupMessages", id: groupId },
            ],
        }),

        // Get group messages
        getGroupMessages: builder.query<GroupMessage[], string>({
            query: (groupId) => `${groupId}/messages`,
            providesTags: (_result, _error, groupId) => [
                { type: "GroupMessages", id: groupId },
            ],
        }),
    }),
});

// -------------------- HOOKS --------------------
export const {
    useCreateGroupMutation,
    useGetAllGroupsQuery,
    useGetGroupByIdQuery,
    useUpdateGroupMutation,
    useDeleteGroupMutation,
    useAddGroupMemberMutation,
    useRemoveGroupMemberMutation,
    useUpdateMemberRoleMutation,
    useGetGroupMembersQuery,
    useSendGroupMessageMutation,
    useGetGroupMessagesQuery,
} = groupsApi;
