import db from "../../drizzle/db";
import {posts,likes,comments,media,TSelectPost,TInsertPost,TInsertMedia,} from "../../drizzle/schema";
import { eq, and, desc, lt } from "drizzle-orm";

export type TPostAuthor = {
    id: string;
    username: string;
    avatarUrl: string | null;
};

export type TPostMedia = {
    id: string;
    url: string;
    type: string;
};

export type TPostSummary = {
    id: string;
    content: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
    author: TPostAuthor;
    media: TPostMedia[];
    likeCount: number;
    isLikedByCurrentUser: boolean;
};

export type TPaginatedPosts = {
    posts: TPostSummary[];
    nextCursor: string | null;
};

export type TPostCommentUser = {
    id: string;
    username: string;
    avatarUrl: string | null;
};

export type TPostComment = {
    id: string;
    postId: string;
    userId: string;
    content: string;
    createdAt: Date | null;
    user: TPostCommentUser;
};

export type TCreatePostResult = TSelectPost & {
  media: TPostMedia[];
};

export const createPostService = async (postData: TInsertPost,mediaItems?: Omit<TInsertMedia, "postId">[]
): Promise<TCreatePostResult> => {
    const [newPost] = await db.insert(posts).values(postData).returning();

    if (!newPost) throw new Error("Failed to create post");

    let insertedMedia: TPostMedia[] = [];
    if (mediaItems && mediaItems.length > 0) {
        const mediaRecords = mediaItems.map((m) => ({
        ...m,
        postId: newPost.id,
        }));

        insertedMedia = await db
        .insert(media)
        .values(mediaRecords)
        .returning({ id: media.id, url: media.url, type: media.type });
    }

    return {
        ...newPost,
        media: insertedMedia,
    };
};


export const getAllPublicPostsService = async (
  currentUserId?: string,
  cursor?: string,
  limit = 10
): Promise<TPaginatedPosts> => {
  const whereCondition = cursor ? lt(posts.createdAt, new Date(cursor)) : undefined;

    const postsResult = await db.query.posts.findMany({
        where: whereCondition,
        with: {
            author: {
                columns: { id: true, username: true, avatarUrl: true },
            },
            media: {
                columns: { id: true, url: true, type: true },
            },
            likes: {
                columns: { id: true, userId: true },
            },
        },
        orderBy: desc(posts.createdAt),
        limit: limit + 1, // fetch one extra to check if more posts exist
    });

    const enrichedPosts: TPostSummary[] = postsResult.map((post) => {
        const likeCount = post.likes?.length ?? 0;
        const isLikedByCurrentUser = !!post.likes?.some(
            (like) => like.userId === currentUserId
        );

        return {
            id: post.id,
            content: post.content,
            authorId: post.authorId,
            createdAt: post.createdAt ?? new Date(0),
            updatedAt: post.updatedAt ?? post.createdAt ?? new Date(0),
            author: post.author ?? { id: "", username: "Unknown", avatarUrl: null },
            media: post.media ?? [],
            likeCount,
            isLikedByCurrentUser,
        };
    });

  // Cursor-based pagination
    const hasMore = enrichedPosts.length > limit;
    const slicedPosts = hasMore ? enrichedPosts.slice(0, limit) : enrichedPosts;

    const lastPost = slicedPosts.at(-1);
    const nextCursor: string | null =
        hasMore && lastPost?.createdAt
        ? lastPost.createdAt.toISOString()
        : null;

    return { posts: slicedPosts, nextCursor };
};

export const getPostByIdService = async (postId: string,currentUserId?: string) => {
    const post = await db.query.posts.findFirst({
        where: eq(posts.id, postId),
        with: {
            author: {
                columns: { id: true, username: true, avatarUrl: true },
            },
            media: {
                columns: { id: true, url: true, type: true },
            },
            comments: {
                with: {
                    user: {
                        columns: { id: true, username: true, avatarUrl: true },
                    },
                },
                orderBy: desc(comments.createdAt),
            },
            likes: {
                columns: { id: true, userId: true },
            },
        },
    });

    if (!post) return null;

    const likeCount = post.likes?.length || 0;
    const isLikedByCurrentUser = !!post.likes?.some(
        (like) => like.userId === currentUserId
    );

    const { likes, ...rest } = post;

    return {
        ...rest,
        likeCount,
        isLikedByCurrentUser,
    };
};

export const getPostsByUserService = async (targetUserId: string,currentUserId?: string,cursor?: string,
  limit = 10
): Promise<TPaginatedPosts> => {
    const whereConditions = [eq(posts.authorId, targetUserId)];
    if (cursor) {
        whereConditions.push(lt(posts.createdAt, new Date(cursor)));
    }

    const postsResult = await db.query.posts.findMany({
        where: and(...whereConditions),
        with: {
            author: {
                columns: { id: true, username: true, avatarUrl: true },
            },
            media: {
                columns: { id: true, url: true, type: true },
            },
            likes: {
                columns: { id: true, userId: true },
            },
        },
        orderBy: desc(posts.createdAt),
        limit: limit + 1, 
    });

    const enrichedPosts: TPostSummary[] = postsResult.map((post) => {
        const likeCount = post.likes?.length ?? 0;
        const isLikedByCurrentUser = !!post.likes?.some(
            (like) => like.userId === currentUserId
        );

        return {
            id: post.id,
            content: post.content,
            authorId: post.authorId,
            createdAt: post.createdAt ?? new Date(0),
            updatedAt: post.updatedAt ?? post.createdAt ?? new Date(0),
            author: post.author ?? { id: "", username: "Unknown", avatarUrl: null },
            media: post.media ?? [],
            likeCount,
            isLikedByCurrentUser,
        };
    });

    const hasMore = enrichedPosts.length > limit;
    const slicedPosts = hasMore ? enrichedPosts.slice(0, limit) : enrichedPosts;
    const lastPost = slicedPosts.at(-1);

    const nextCursor = hasMore && lastPost?.createdAt
        ? lastPost.createdAt.toISOString()
        : null;

    return { posts: slicedPosts, nextCursor };
};

export const updatePostService = async (postId: string,authorId: string,content: string) => {
    const [updatedPost] = await db
        .update(posts)
        .set({ content, updatedAt: new Date() })
        .where(and(eq(posts.id, postId), eq(posts.authorId, authorId)))
        .returning();

    return updatedPost || null;
};

export const deletePostService = async (postId: string,authorId: string): Promise<boolean> => {
    const result = await db
        .delete(posts)
        .where(and(eq(posts.id, postId), eq(posts.authorId, authorId)))
        .returning({ id: posts.id });

    return result.length > 0;
};

export const likePostService = async (userId: string, postId: string) => {
    const existing = await db.query.likes.findFirst({
        where: and(eq(likes.userId, userId), eq(likes.postId, postId)),
    });

    if (existing) return existing;

    const [like] = await db.insert(likes).values({ userId, postId }).returning();
    return like;
};

export const unlikePostService = async (userId: string, postId: string) => {
    const result = await db
        .delete(likes)
        .where(and(eq(likes.userId, userId), eq(likes.postId, postId)))
        .returning({ id: likes.id });

    return result.length > 0;
};

export const commentOnPostService = async (userId: string,postId: string,content: string
): Promise<TPostComment | null> => {
    const [inserted] = await db
        .insert(comments)
        .values({ userId, postId, content })
        .returning({ id: comments.id });

    const [commentWithUser] = await db.query.comments.findMany({
        where: eq(comments.id, inserted.id),
        with: {
        user: {
            columns: { id: true, username: true, avatarUrl: true },
        },
        },
    });

    return commentWithUser;
};
