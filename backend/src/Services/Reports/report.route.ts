import { Router } from "express";
import {
  createReportController,
  getAllReportsController,
  getReportsByUserController,
  getReportsByStatusController,
  updateReportStatusController,
  deleteReportController,
} from "./report.controller";

import {anyAuth,adminAuth, adminOrModeratorAuth} from "../../Middlewares/BearAuth";
import { rateLimiterMiddleware } from "../../Middlewares/rateLimiter";

const reportRouters = Router();

const applyRatelimiting = rateLimiterMiddleware;

reportRouters.use(applyRatelimiting);

/**
 * ==========================
 * REPORT MANAGEMENT ROUTES
 * ==========================
 */

// 🔹 Create a new report — any authenticated user
reportRouters.post("/reports", anyAuth, createReportController);

// 🔹 Get all reports — only admins or moderators
reportRouters.get("/reports", adminOrModeratorAuth, getAllReportsController);

// 🔹 Get reports by reported user — only admins or moderators
reportRouters.get("/reports/user/:userId",adminOrModeratorAuth, getReportsByUserController
);

// 🔹 Get reports by status — only admins or moderators
reportRouters.get("/reports/status/:status",adminOrModeratorAuth,getReportsByStatusController);

// 🔹 Update report status — only admins or moderators
reportRouters.patch(
  "/reports/:reportId", adminOrModeratorAuth, updateReportStatusController);

// 🔹 Delete report — only admins
reportRouters.delete(
  "/reports/:reportId", adminAuth, deleteReportController);

export default reportRouters;
