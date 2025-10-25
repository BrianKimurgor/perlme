import { Router } from "express";
import {
  getAllUsersController,
  getUser,
  getUserByEmailController,
  updateUserController,
  deleteUserController,
  suspendUserController,
  unsuspendUserController,
  checkUserStatusController,
} from "./user.controller";

import {
  anyAuth,
  adminAuth,
  adminOrModeratorAuth,
} from "../../Middlewares/BearAuth";

const userRouters = Router();

// ========================== USER ROUTES ==========================

// 🔹 Get all users — only ADMIN or MODERATOR can view all users
userRouters.get("/users/all", adminOrModeratorAuth, getAllUsersController);

// 🔹 Get user by ID — any authenticated user can view
userRouters.get("/users/:id", anyAuth, getUser);

// 🔹 Get user by email — only ADMIN or MODERATOR
userRouters.get("/users/", adminOrModeratorAuth, getUserByEmailController);

// 🔹 Update user — user can update their own data (or admin can update anyone)
userRouters.patch("/users/:id", anyAuth, updateUserController);

// 🔹 Delete user — only ADMIN can delete
userRouters.delete("/users/:id", adminAuth, deleteUserController);

// 🔹 Suspend user — only ADMIN or MODERATOR
userRouters.post("/users/:id/suspend", adminOrModeratorAuth, suspendUserController);

// 🔹 Unsuspend user — only ADMIN or MODERATOR
userRouters.post("/users/:id/unsuspend", adminOrModeratorAuth, unsuspendUserController);

// 🔹 Check if user is active — any authenticated user
userRouters.get("/users/:id/status", anyAuth, checkUserStatusController);

export default userRouters;
