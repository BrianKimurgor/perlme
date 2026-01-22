import { Router } from "express";
import {
  createGroupController,
  getAllGroupsController,
  getGroupByIdController,
  updateGroupController,
  deleteGroupController,
  addGroupMemberController,
  removeGroupMemberController,
  updateMemberRoleController,
  getGroupMembersController,
  sendGroupMessageController,
  getGroupMessagesController,
} from "./group.controller";

import { anyAuth } from "../../Middlewares/BearAuth";
import { groupRoleEnum } from "../../Validators/Group.Validators";
import { authorizeGroupAction } from "../../Middlewares/GroupAuthoraization";
import { rateLimiterMiddleware } from "../../Middlewares/rateLimiter";

const groupRouters = Router();
groupRouters.use(rateLimiterMiddleware);

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Group, member, and group messaging management
 */

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Group
 *     responses:
 *       201:
 *         description: Group created successfully
 */
groupRouters.post("/groups", anyAuth, createGroupController);

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Get all groups
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of groups
 */
groupRouters.get("/groups", anyAuth, getAllGroupsController);

/**
 * @swagger
 * /api/groups/{groupId}:
 *   get:
 *     summary: Get group by ID
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the group
 *     responses:
 *       200:
 *         description: Group details
 *       403:
 *         description: Unauthorized access
 */
groupRouters.get(
  "/groups/:groupId",
  anyAuth,
  authorizeGroupAction([
    groupRoleEnum.enum.GROUP_ADMIN,
    groupRoleEnum.enum.GROUP_MODERATOR,
    groupRoleEnum.enum.GROUP_MEMBER,
  ]),
  getGroupByIdController
);

/**
 * @swagger
 * /api/groups/{groupId}:
 *   patch:
 *     summary: Update group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       403:
 *         description: Unauthorized
 */
groupRouters.patch(
  "/groups/:groupId",
  anyAuth,
  authorizeGroupAction([
    groupRoleEnum.enum.GROUP_ADMIN,
    groupRoleEnum.enum.GROUP_MODERATOR,
  ]),
  updateGroupController
);

/**
 * @swagger
 * /api/groups/{groupId}:
 *   delete:
 *     summary: Delete a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Group deleted
 *       403:
 *         description: Unauthorized
 */
groupRouters.delete(
  "/groups/:groupId",
  anyAuth,
  authorizeGroupAction([groupRoleEnum.enum.GROUP_ADMIN]),
  deleteGroupController
);

/**
 * @swagger
 * /api/groups/{groupId}/members:
 *   post:
 *     summary: Add a member to group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
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
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member added successfully
 */
groupRouters.post(
  "/groups/:groupId/members",
  anyAuth,
  authorizeGroupAction([
    groupRoleEnum.enum.GROUP_ADMIN,
    groupRoleEnum.enum.GROUP_MODERATOR,
  ]),
  addGroupMemberController
);

/**
 * @swagger
 * /api/groups/{groupId}/members/{userId}:
 *   delete:
 *     summary: Remove a member from group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member removed
 */
groupRouters.delete(
  "/groups/:groupId/members/:userId",
  anyAuth,
  authorizeGroupAction([
    groupRoleEnum.enum.GROUP_ADMIN,
    groupRoleEnum.enum.GROUP_MODERATOR,
  ]),
  removeGroupMemberController
);

/**
 * @swagger
 * /api/groups/{groupId}/members/{userId}/role:
 *   patch:
 *     summary: Update member role
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
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
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 example: GROUP_MEMBER
 *     responses:
 *       200:
 *         description: Member role updated
 */
groupRouters.patch(
  "/groups/:groupId/members/:userId/role",
  anyAuth,
  authorizeGroupAction([groupRoleEnum.enum.GROUP_ADMIN]),
  updateMemberRoleController
);

/**
 * @swagger
 * /api/groups/{groupId}/members:
 *   get:
 *     summary: Get all members of a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of group members
 */
groupRouters.get(
  "/groups/:groupId/members",
  anyAuth,
  authorizeGroupAction([
    groupRoleEnum.enum.GROUP_ADMIN,
    groupRoleEnum.enum.GROUP_MODERATOR,
    groupRoleEnum.enum.GROUP_MEMBER,
  ]),
  getGroupMembersController
);

/**
 * @swagger
 * /api/groups/{groupId}/messages:
 *   post:
 *     summary: Send a message in a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
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
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: Hello group!
 *     responses:
 *       200:
 *         description: Message sent
 */
groupRouters.post(
  "/groups/:groupId/messages",
  anyAuth,
  authorizeGroupAction([
    groupRoleEnum.enum.GROUP_ADMIN,
    groupRoleEnum.enum.GROUP_MODERATOR,
    groupRoleEnum.enum.GROUP_MEMBER,
  ]),
  sendGroupMessageController
);

/**
 * @swagger
 * /api/groups/{groupId}/messages:
 *   get:
 *     summary: Get all messages in a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 */
groupRouters.get(
  "/groups/:groupId/messages",
  anyAuth,
  authorizeGroupAction([
    groupRoleEnum.enum.GROUP_ADMIN,
    groupRoleEnum.enum.GROUP_MODERATOR,
    groupRoleEnum.enum.GROUP_MEMBER,
  ]),
  getGroupMessagesController
);

export default groupRouters;
