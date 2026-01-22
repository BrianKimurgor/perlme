import { Router } from "express";
import {
  createBlockController,
  removeBlockController,
  checkBlockStatusController,
  getBlockedUsersController,
  getBlockedByController,
} from "./block.controller";

import { anyAuth } from "../../Middlewares/BearAuth";
import { rateLimiterMiddleware } from "../../Middlewares/rateLimiter";

const blockRouters = Router();
const applyRatelimiting = rateLimiterMiddleware;

blockRouters.use(applyRatelimiting);

/**
 * @swagger
 * tags:
 *   name: Blocks
 *   description: User block management
 */

/**
 * @swagger
 * /api/blocks:
 *   post:
 *     summary: Block a user
 *     tags: [Blocks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetUserId
 *             properties:
 *               targetUserId:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User blocked successfully
 *       400:
 *         description: Already blocked or invalid request
 */
blockRouters.post("/blocks", anyAuth, createBlockController);

/**
 * @swagger
 * /api/blocks:
 *   delete:
 *     summary: Unblock a user
 *     tags: [Blocks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetUserId
 *             properties:
 *               targetUserId:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User unblocked successfully
 *       400:
 *         description: User was not blocked
 */
blockRouters.delete("/blocks", anyAuth, removeBlockController);

/**
 * @swagger
 * /api/blocks/status/{targetUserId}:
 *   get:
 *     summary: Check if a specific user is blocked
 *     tags: [Blocks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to check
 *     responses:
 *       200:
 *         description: Block status returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blocked:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Target user not found
 */
blockRouters.get("/blocks/status/:targetUserId", anyAuth, checkBlockStatusController);

/**
 * @swagger
 * /api/blocks/me/blocked:
 *   get:
 *     summary: Get all users I have blocked
 *     tags: [Blocks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of blocked users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   email:
 *                     type: string
 */
blockRouters.get("/blocks/me/blocked", anyAuth, getBlockedUsersController);

/**
 * @swagger
 * /api/blocks/me/blocked-by:
 *   get:
 *     summary: Get all users who have blocked me
 *     tags: [Blocks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users who blocked me
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   email:
 *                     type: string
 */
blockRouters.get("/blocks/me/blocked-by", anyAuth, getBlockedByController);

export default blockRouters;
