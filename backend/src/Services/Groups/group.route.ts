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

const groupRouters = Router();

/**
 * ==========================
 * GROUP MANAGEMENT ROUTES
 * ==========================
 */

// 🔹 Create new group — any authenticated user
groupRouters.post("/groups", anyAuth, createGroupController);

// 🔹 Get all groups — any authenticated user
groupRouters.get("/groups", anyAuth, getAllGroupsController);

// 🔹 Get group by ID — any member or admin
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

// 🔹 Update group — only GROUP_ADMIN or GROUP_MODERATOR
groupRouters.patch(
  "/groups/:groupId",
  anyAuth,
  authorizeGroupAction([
    groupRoleEnum.enum.GROUP_ADMIN,
    groupRoleEnum.enum.GROUP_MODERATOR,
  ]),
  updateGroupController
);

// 🔹 Delete group — only GROUP_ADMIN or SYSTEM ADMIN
groupRouters.delete(
  "/groups/:groupId",
  anyAuth,
  authorizeGroupAction([groupRoleEnum.enum.GROUP_ADMIN]),
  deleteGroupController
);

/**
 * ==========================
 * MEMBER MANAGEMENT ROUTES
 * ==========================
 */

// 🔹 Add member — only GROUP_ADMIN or GROUP_MODERATOR
groupRouters.post(
  "/groups/:groupId/members",
  anyAuth,
  authorizeGroupAction([
    groupRoleEnum.enum.GROUP_ADMIN,
    groupRoleEnum.enum.GROUP_MODERATOR,
  ]),
  addGroupMemberController
);

// 🔹 Remove member — only GROUP_ADMIN or GROUP_MODERATOR
groupRouters.delete(
  "/groups/:groupId/members/:userId",
  anyAuth,
  authorizeGroupAction([
    groupRoleEnum.enum.GROUP_ADMIN,
    groupRoleEnum.enum.GROUP_MODERATOR,
  ]),
  removeGroupMemberController
);

// 🔹 Update member role — only GROUP_ADMIN
groupRouters.patch(
  "/groups/:groupId/members/:userId/role",
  anyAuth,
  authorizeGroupAction([groupRoleEnum.enum.GROUP_ADMIN]),
  updateMemberRoleController
);

// 🔹 Get group members — any group member
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
 * ==========================
 * GROUP MESSAGING ROUTES
 * ==========================
 */

// 🔹 Send message — any group member
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

// 🔹 Get messages — any group member
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
