import db from "../../drizzle/db";
import { posts, likes, comments, TSelectPost, TInsertPost } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

// CREATE A POST
export const createPostService = async (data: TInsertPost): Promise<TSelectPost | null> => {
    const [result] = await db.insert(posts).values(data).returning();
    return result;
};

// GET ALL PUBLIC POSTS (feed)
export const getAllPublicPostsService = async (): Promise<TSelectPost[]> => {
    const result = await db.query.posts.findMany({
        with: {
            likes: true
        },
        orderBy: desc(posts.createdAt)
    })
    
    return result;
};

// GET SINGLE POST
export const getPostByIdService = async (postId: string): Promise<TSelectPost | null> => {
    const [result] = await db.select().from(posts).where(eq(posts.id, postId));
    return result;
};

// DELETE POST (only by author)
export const deletePostService = async (postId: string, authorId: string): Promise<boolean> => {
    const result = await db
        .delete(posts)
        .where(and(eq(posts.id, postId), eq(posts.authorId, authorId)))
        .returning();
    return result.length > 0;
};

// LIKE POST
export const likePostService = async (userId: string, postId: string) => {
    await db.insert(likes).values({ userId, postId });
};

// UNLIKE POST
export const unlikePostService = async (userId: string, postId: string) => {
    await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
};

// COMMENT ON POST
export const commentOnPostService = async (userId: string, postId: string, content: string) => {
    const [comment] = await db
        .insert(comments)
        .values({ userId, postId, content })
        .returning();
    return comment;
};
