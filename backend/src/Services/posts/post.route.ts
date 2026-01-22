import { Router } from "express";
import {
    commentOnPostController,
    createPostController,
    deletePostController,
    getAllPublicPostsController,
    getPostByIdController,
    likePostController,
    unlikePostController,
} from "./post.controller";
import { authMiddleware } from "../../Middlewares/BearAuth";
import { rateLimiterMiddleware } from "../../Middlewares/rateLimiter";

const postRouter = Router();
postRouter.use(rateLimiterMiddleware);

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: CRUD operations for posts, likes, and comments
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all public posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of public posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   postId:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   author:
 *                     type: string
 */
postRouter.get("/posts", getAllPublicPostsController);

/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Post details
 */
postRouter.get("/posts/:postId", getPostByIdController);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: My first post
 *               content:
 *                 type: string
 *                 example: Hello world!
 *     responses:
 *       201:
 *         description: Post created successfully
 */
postRouter.post("/posts", authMiddleware(), createPostController);

/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted
 */
postRouter.delete("/posts/:postId", authMiddleware(), deletePostController);

/**
 * @swagger
 * /api/posts/{postId}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post liked
 */
postRouter.post("/posts/:postId/like", authMiddleware(), likePostController);

/**
 * @swagger
 * /api/posts/{postId}/like:
 *   delete:
 *     summary: Unlike a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post unliked
 */
postRouter.delete("/posts/:postId/like", authMiddleware(), unlikePostController);

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: Comment on a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Great post!
 *     responses:
 *       201:
 *         description: Comment added
 */
postRouter.post("/posts/:postId/comments", authMiddleware(), commentOnPostController);

export default postRouter;
