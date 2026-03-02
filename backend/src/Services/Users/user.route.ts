import { Router } from "express";
import {
  checkIfFollowingController,
  checkUserStatusController,
  deleteUserController,
  followUserController,
  getAllUsersController,
  getUser,
  getUserByEmailController,
  suspendUserController,
  unfollowUserController,
  unsuspendUserController,
  updateUserController,
} from "./user.controller";

import { adminAuth, adminOrModeratorAuth, anyAuth } from "../../Middlewares/BearAuth";
import { rateLimiterMiddleware } from "../../Middlewares/rateLimiter";

const userRouters = Router();
userRouters.use(rateLimiterMiddleware);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and account status
 */

/**
 * @swagger
 * /api/users/all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: Only accessible by admins or moderators
 *     responses:
 *       200:
 *         description: List of all users
 */
userRouters.get("/users/all", adminOrModeratorAuth, getAllUsersController);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User details
 */
userRouters.get("/users/:id", anyAuth, getUser);

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Get user by email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the user
 *     responses:
 *       200:
 *         description: User details
 *     description: Only accessible by admins or moderators
 */
userRouters.get("/users/", adminOrModeratorAuth, getUserByEmailController);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update user data
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: User updated successfully
 */
userRouters.patch("/users/:id", anyAuth, updateUserController);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *     description: Only accessible by admins
 */
userRouters.delete("/users/:id", adminAuth, deleteUserController);

/**
 * @swagger
 * /api/users/{id}/suspend:
 *   post:
 *     summary: Suspend a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to suspend
 *     responses:
 *       200:
 *         description: User suspended successfully
 *     description: Only accessible by admins or moderators
 */
userRouters.post("/users/:id/suspend", adminOrModeratorAuth, suspendUserController);

/**
 * @swagger
 * /api/users/{id}/unsuspend:
 *   post:
 *     summary: Unsuspend a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to unsuspend
 *     responses:
 *       200:
 *         description: User unsuspended successfully
 *     description: Only accessible by admins or moderators
 */
userRouters.post("/users/:id/unsuspend", adminOrModeratorAuth, unsuspendUserController);

/**
 * @swagger
 * /api/users/{id}/status:
 *   get:
 *     summary: Check if user is active
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User status returned
 */
userRouters.get("/users/:id/status", anyAuth, checkUserStatusController);

/**
 * @swagger
 * /api/users/{userId}/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to follow
 *     responses:
 *       200:
 *         description: User followed successfully
 */
userRouters.post("/users/:userId/follow", anyAuth, followUserController);

/**
 * @swagger
 * /api/users/{userId}/unfollow:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to unfollow
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 */
userRouters.delete("/users/:userId/unfollow", anyAuth, unfollowUserController);

/**
 * @swagger
 * /api/users/{userId}/following:
 *   get:
 *     summary: Check if following a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to check
 *     responses:
 *       200:
 *         description: Follow status returned
 */
userRouters.get("/users/:userId/following", anyAuth, checkIfFollowingController);

export default userRouters;
