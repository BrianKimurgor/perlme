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
 * ==========================
 * USER BLOCK MANAGEMENT ROUTES
 * ==========================
 */

// 🔹 Block a user — any authenticated user
blockRouters.post("/blocks", anyAuth, createBlockController);

// 🔹 Unblock a user — any authenticated user
blockRouters.delete("/blocks", anyAuth, removeBlockController);

// 🔹 Check if a specific user is blocked
blockRouters.get("/blocks/status/:targetUserId", anyAuth, checkBlockStatusController);

// 🔹 Get all users I have blocked
blockRouters.get("/blocks/me/blocked", anyAuth, getBlockedUsersController);

// 🔹 Get all users who have blocked me
blockRouters.get("/blocks/me/blocked-by", anyAuth, getBlockedByController);

export default blockRouters;
