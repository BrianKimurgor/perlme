import { Request, Response } from "express";
import {commentOnPostService,createPostService,deletePostService,getAllPublicPostsService,getPostByIdService,getPostsByUserService,likePostService,unlikePostService, updatePostService,} from "./post.service";

export const createPostController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const { content, media } = req.body;

        if (!content?.trim()) return res.status(400).json({ error: "Post content is required" });

        // Validate media array (optional)
        let mediaItems: { url: string; type: string }[] = [];
        if (Array.isArray(media) && media.length > 0) {
        mediaItems = media.map((item) => ({
            url: item.url,
            type: item.type || "image",
        }));
        }

        const newPost = await createPostService(
            {
                authorId: userId,
                content: content.trim(),
            },
            mediaItems
        );

        return res.status(201).json({
            message: "Post created successfully",
            post: newPost,
        });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllPublicPostsController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const cursor = req.query.cursor as string | undefined;
        const limit = Number(req.query.limit) || 10;

        const { posts, nextCursor } = await getAllPublicPostsService(userId, cursor, limit);

        return res.status(200).json({
            count: posts.length,
            nextCursor,
            posts,
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getPostByIdController = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.id;
        console.log(userId);

        if (!postId) return res.status(400).json({ error: "Post ID is required" });

        const post = await getPostByIdService(postId, userId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        return res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getPostsByUserController = async (req: Request, res: Response) => {
    try {
        const { userId: targetUserId } = req.params;
        const currentUserId = req.user?.id;
        const cursor = req.query.cursor as string | undefined;
        const limit = Number(req.query.limit) || 10;

        if (!targetUserId) return res.status(400).json({ error: "User ID is required" });

        const { posts, nextCursor } = await getPostsByUserService(
            targetUserId,
            currentUserId,
            cursor,
            limit
        );

        return res.status(200).json({
            count: posts.length,
            nextCursor,
            posts,
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updatePostController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { postId } = req.params;
        const { content } = req.body;

        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        if (!postId) return res.status(400).json({ error: "Post ID is required" });
        if (!content?.trim()) return res.status(400).json({ error: "Post content is required" });

        const updatedPost = await updatePostService(postId, userId, content.trim());
        if (!updatedPost) return res.status(404).json({ error: "Post not found or not owned by user" });

        return res.status(200).json({
            message: "Post updated successfully",
            post: updatedPost,
        });
    } catch (error) {
        console.error("Error updating post:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deletePostController = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        if (!postId) return res.status(400).json({ error: "Post ID is required" });

        const deleted = await deletePostService(postId, userId);
        if (!deleted) return res.status(404).json({ error: "Post not found or not owned by user" });

        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const likePostController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { postId } = req.params;

        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        if (!postId) return res.status(400).json({ error: "Post ID is required" });

        await likePostService(userId, postId);

        return res.status(200).json({ message: "Post liked successfully" });
    } catch (error) {
        console.error("Error liking post:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const unlikePostController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { postId } = req.params;

        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        if (!postId) return res.status(400).json({ error: "Post ID is required" });

        await unlikePostService(userId, postId);

        return res.status(200).json({ message: "Post unliked successfully" });
    } catch (error) {
        console.error("Error unliking post:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const commentOnPostController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { postId } = req.params;
        const { content } = req.body;

        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        if (!postId) return res.status(400).json({ error: "Post ID is required" });
        if (!content?.trim()) return res.status(400).json({ error: "Comment content required" });

        const comment = await commentOnPostService(userId, postId, content.trim());

        return res.status(201).json({
            message: "Comment added successfully",
            comment,
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
