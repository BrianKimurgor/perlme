import { Request, Response } from "express";
import {
  commentOnPostService,
  createPostService,
  deletePostService,
  getAllPublicPostsService,
  getPostByIdService,
  getPostsByUserService,
  likePostService,
  unlikePostService,
  updatePostService,
} from "./post.service";
import { ResponseHandler } from "../../utils/responseHandler";
import { PaginationHandler } from "../../utils/paginationHandler";

export const createPostController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return ResponseHandler.unauthorized(res);

        const { content, media } = req.body;
        if (!content?.trim()) return ResponseHandler.badRequest(res, "Post content is required");

        const mediaItems = Array.isArray(media)
        ? media.map((item) => ({
            url: item.url,
            type: item.type || "image",
            }))
        : [];

        const newPost = await createPostService({ authorId: userId, content: content.trim() }, mediaItems);
        return ResponseHandler.created(res, "Post created successfully", newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        return ResponseHandler.internal(res, "Internal server error", error);
    }
};

export const getAllPublicPostsController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        const { page, limit, sortBy, sortOrder } = PaginationHandler.parseParams(req.query);

        const { data: posts, meta } = await getAllPublicPostsService(
            userId,
            page,
            limit,
            sortBy,
            sortOrder
        );

        return PaginationHandler.send(res, posts, meta.totalItems, page, limit);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return ResponseHandler.internal(res, "Internal server error", error);
    }
};


export const getPostByIdController = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.id;
        if (!postId) return ResponseHandler.badRequest(res, "Post ID is required");

        const post = await getPostByIdService(postId, userId);
        if (!post) return ResponseHandler.notFound(res, "Post not found");

        return ResponseHandler.ok(res, "Post fetched successfully", post);
    } catch (error) {
        console.error("Error fetching post:", error);
        return ResponseHandler.internal(res, "Internal server error", error);
    }
};

export const getPostsByUserController = async (req: Request, res: Response) => {
    try {
        const { userId: targetUserId } = req.params;
        const currentUserId = req.user?.id;

        if (!targetUserId) return ResponseHandler.badRequest(res, "User ID is required");

        const { page, limit, sortBy, sortOrder } = PaginationHandler.parseParams(req.query);

        const paginatedResult = await getPostsByUserService(
            targetUserId,
            currentUserId,
            page,
            limit,
            sortBy,
            sortOrder
        );

        return PaginationHandler.send(
            res,
            paginatedResult.data,
            paginatedResult.meta.totalItems,
            page,
            limit,
            "User posts fetched successfully"
        );
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return ResponseHandler.internal(res, "Internal server error", error);
    }
};


export const updatePostController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { postId } = req.params;
        const { content } = req.body;

        if (!userId) return ResponseHandler.unauthorized(res);
        if (!postId) return ResponseHandler.badRequest(res, "Post ID is required");
        if (!content?.trim()) return ResponseHandler.badRequest(res, "Post content is required");

        const updatedPost = await updatePostService(postId, userId, content.trim());
        if (!updatedPost) return ResponseHandler.notFound(res, "Post not found or not owned by user");

        return ResponseHandler.ok(res, "Post updated successfully", updatedPost);
    } catch (error) {
        console.error("Error updating post:", error);
        return ResponseHandler.internal(res, "Internal server error", error);
    }
};

export const deletePostController = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.id;

        if (!userId) return ResponseHandler.unauthorized(res);
        if (!postId) return ResponseHandler.badRequest(res, "Post ID is required");

        const deleted = await deletePostService(postId, userId);
        if (!deleted) return ResponseHandler.notFound(res, "Post not found or not owned by user");

        return ResponseHandler.ok(res, "Post deleted successfully");
    } catch (error) {
        console.error("Error deleting post:", error);
        return ResponseHandler.internal(res, "Internal server error", error);
    }
};

export const likePostController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { postId } = req.params;

        if (!userId) return ResponseHandler.unauthorized(res);
        if (!postId) return ResponseHandler.badRequest(res, "Post ID is required");

        await likePostService(userId, postId);
        return ResponseHandler.ok(res, "Post liked successfully");
    } catch (error) {
        console.error("Error liking post:", error);
        return ResponseHandler.internal(res, "Internal server error", error);
    }
};

export const unlikePostController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { postId } = req.params;

        if (!userId) return ResponseHandler.unauthorized(res);
        if (!postId) return ResponseHandler.badRequest(res, "Post ID is required");

        await unlikePostService(userId, postId);
        return ResponseHandler.ok(res, "Post unliked successfully");
    } catch (error) {
        console.error("Error unliking post:", error);
        return ResponseHandler.internal(res, "Internal server error", error);
    }
};

export const commentOnPostController = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { postId } = req.params;
        const { content } = req.body;

        if (!userId) return ResponseHandler.unauthorized(res);
        if (!postId) return ResponseHandler.badRequest(res, "Post ID is required");
        if (!content?.trim()) return ResponseHandler.badRequest(res, "Comment content required");

        const comment = await commentOnPostService(userId, postId, content.trim());
        return ResponseHandler.created(res, "Comment added successfully", comment);
    } catch (error) {
        console.error("Error adding comment:", error);
        return ResponseHandler.internal(res, "Internal server error", error);
    }
};
