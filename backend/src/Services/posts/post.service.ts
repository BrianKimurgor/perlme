import db from "../../drizzle/db";
import {posts,likes,comments,media,TSelectPost,TInsertPost,TInsertMedia,} from "../../drizzle/schema";
import { eq, and, desc, lt, asc, sql } from "drizzle-orm";
import { PaginationHandler } from "../../utils/paginationHandler";

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

const formatPost = (post: any, currentUserId?: string) => ({
    id: post.id,
    content: post.content,
    authorId: post.authorId,
    createdAt: post.createdAt ?? new Date(0),
    updatedAt: post.updatedAt ?? post.createdAt ?? new Date(0),
    author: post.author ?? { id: "", username: "Unknown", avatarUrl: null },
    media: post.media ?? [],
    likeCount: post.likes?.length ?? 0,
    isLikedByCurrentUser: !!post.likes?.some((like: any) => like.userId === currentUserId),
});

const fetchPostsBase = async ({
    currentUserId,
    whereCondition,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
}: {
    currentUserId?: string;
    whereCondition?: any;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}) => {
    const offset = PaginationHandler.getOffset(page, limit);

    if (!(sortBy in posts)) sortBy = "createdAt";

    const orderByClause =
        sortOrder === "asc"
        ? asc((posts as any)[sortBy])
        : desc((posts as any)[sortBy]);

    const [totalResult, postsResult] = await Promise.all([
        db
        .select({ count: sql<number>`count(${posts.id})`.as("count") })
        .from(posts)
        .where(whereCondition),
        db.query.posts.findMany({
            where: whereCondition,
            with: {
                author: { columns: { id: true, username: true, avatarUrl: true } },
                media: { columns: { id: true, url: true, type: true } },
                likes: { columns: { id: true, userId: true } },
            },
            orderBy: orderByClause,
            limit,
            offset,
        }),
    ]);

    const totalItems = Number(totalResult[0]?.count ?? 0);

    const enrichedPosts = postsResult.map((p) => formatPost(p, currentUserId));

    return PaginationHandler.createResult(enrichedPosts, totalItems, page, limit);
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
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
) => {
  return fetchPostsBase({
        currentUserId,
        whereCondition: undefined,
        page,
        limit,
        sortBy,
        sortOrder,
  });
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

export const getPostsByUserService = async (
    targetUserId: string,
    currentUserId?: string,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder: "asc" | "desc" = "desc"
) => {
    return fetchPostsBase({
        currentUserId,
        whereCondition: eq(posts.authorId, targetUserId),
        page,
        limit,
        sortBy,
        sortOrder,
    });
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
