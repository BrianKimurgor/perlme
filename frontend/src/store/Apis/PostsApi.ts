import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

// -------------------- TYPES --------------------
export interface Post {
    id: string;
    authorId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    author?: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
    media?: Media[];
    likes?: Like[];
    comments?: Comment[];
    _count?: {
        likes: number;
        comments: number;
    };
    // Flat fields returned by the backend formatPost() helper
    likeCount?: number;
    commentCount?: number;
    isLikedByCurrentUser?: boolean;
}

export interface Media {
    id: string;
    postId: string;
    url: string;
    type: string;
    createdAt: string;
}

export interface Like {
    id: string;
    postId: string;
    userId: string;
    createdAt: string;
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    content: string;
    createdAt: string;
    user?: {
        id: string;
        username: string;
        avatarUrl: string | null;
    };
}

export interface CreatePostRequest {
    content: string;
    media?: { url: string; type: string }[];
}

export interface UploadedFile {
    url: string;
    type: string;
    originalName: string;
    size: number;
}

export interface CreateCommentRequest {
    content: string;
}

// -------------------- API --------------------
export const postsApi = createApi({
    reducerPath: "postsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Posts", "Post"],

    endpoints: (builder) => ({
        // Get all public posts
        getAllPosts: builder.query<Post[], void>({
            query: () => "posts",
            providesTags: ["Posts"],
            transformResponse: (response: any) => response.data || [],
        }),

        // Get post by ID
        getPostById: builder.query<Post, string>({
            query: (postId) => `posts/${postId}`,
            providesTags: (_result, _error, postId) => [{ type: "Post", id: postId }],
            transformResponse: (response: any) => response.data,
        }),

        // Create post
        createPost: builder.mutation<Post, CreatePostRequest>({
            query: (payload) => ({
                url: "posts",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["Posts"],
            transformResponse: (response: any) => response.data,
        }),

        // Upload media files
        uploadMedia: builder.mutation<UploadedFile[], FormData>({
            query: (formData) => ({
                url: "upload",
                method: "POST",
                body: formData,
            }),
            transformResponse: (response: any) => response.data,
        }),

        // Delete post
        deletePost: builder.mutation<{ message: string }, string>({
            query: (postId) => ({
                url: `posts/${postId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Posts"],
            transformResponse: (response: any) => response.data || { message: response.message },
        }),

        // Like post
        likePost: builder.mutation<{ message: string }, string>({
            query: (postId) => ({
                url: `posts/${postId}/like`,
                method: "POST",
            }),
            invalidatesTags: (_result, _error, postId) => [
                "Posts",
                { type: "Post", id: postId },
            ],
            transformResponse: (response: any) => response.data || { message: response.message },
        }),

        // Unlike post
        unlikePost: builder.mutation<{ message: string }, string>({
            query: (postId) => ({
                url: `posts/${postId}/like`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, postId) => [
                "Posts",
                { type: "Post", id: postId },
            ],
            transformResponse: (response: any) => response.data || { message: response.message },
        }),

        // Comment on post
        commentOnPost: builder.mutation<
            Comment,
            { postId: string; data: CreateCommentRequest }
        >({
            query: ({ postId, data }) => ({
                url: `posts/${postId}/comments`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { postId }) => [
                "Posts",
                { type: "Post", id: postId },
            ],
            transformResponse: (response: any) => response.data,
        }),

        // Repost to own feed
        repost: builder.mutation<Post, string>({
            query: (postId) => ({
                url: `posts/${postId}/repost`,
                method: "POST",
            }),
            invalidatesTags: ["Posts"],
            transformResponse: (response: any) => response.data,
        }),
    }),
});

// -------------------- HOOKS --------------------
export const {
    useGetAllPostsQuery,
    useGetPostByIdQuery,
    useCreatePostMutation,
    useDeletePostMutation,
    useLikePostMutation,
    useUnlikePostMutation,
    useCommentOnPostMutation,
    useUploadMediaMutation,
    useRepostMutation,
} = postsApi;
