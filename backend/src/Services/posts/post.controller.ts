import { Request, Response } from "express";
import { commentOnPostService, createPostService, deletePostService, getAllPublicPostsService, getPostByIdService, likePostService, unlikePostService } from "./post.service";

// CREATE POST
export const createPostController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { content } = req.body;

        if (!content?.trim()) return res.status(400).json({ error: "Post content is required" });

        const newPost = await createPostService({
            authorId: userId!,
            content: content.trim(),
        });

        return res.status(201).json({ message: "Post created", post: newPost });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// GET ALL PUBLIC POSTS
export const getAllPublicPostsController = async (req: Request, res: Response) => {
    try {
        const posts = await getAllPublicPostsService();
        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// GET SINGLE POST
export const getPostByIdController = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const post = await getPostByIdService(postId);
        if (!post) return res.status(404).json({ error: "Post not found" });

        return res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// DELETE POST
export const deletePostController = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.id;

        const deleted = await deletePostService(postId, userId!);
        if (!deleted) return res.status(404).json({ error: "Post not found or unauthorized" });

        return res.status(200).json({ message: "Post deleted" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// LIKE POST
export const likePostController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { postId } = req.params;
        await likePostService(userId!, postId);
        return res.status(200).json({ message: "Post liked" });
    } catch (error) {
        console.error("Error liking post:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// UNLIKE POST
export const unlikePostController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { postId } = req.params;
        await unlikePostService(userId!, postId);
        return res.status(200).json({ message: "Post unliked" });
    } catch (error) {
        console.error("Error unliking post:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// COMMENT ON POST
export const commentOnPostController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { postId } = req.params;
        const { content } = req.body;

        if (!content?.trim()) return res.status(400).json({ error: "Comment content required" });

        const comment = await commentOnPostService(userId!, postId, content.trim());
        return res.status(201).json({ message: "Comment added", comment });
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
