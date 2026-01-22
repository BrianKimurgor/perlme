import { Router } from "express";
import {
  createReportController,
  getAllReportsController,
  getReportsByUserController,
  getReportsByStatusController,
  updateReportStatusController,
  deleteReportController,
} from "./report.controller";

import { anyAuth, adminAuth, adminOrModeratorAuth } from "../../Middlewares/BearAuth";
import { rateLimiterMiddleware } from "../../Middlewares/rateLimiter";

const reportRouters = Router();
reportRouters.use(rateLimiterMiddleware);

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report management (create, view, update, delete reports)
 */

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Create a new report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reportedUserId
 *               - reason
 *             properties:
 *               reportedUserId:
 *                 type: string
 *                 example: 123456
 *               reason:
 *                 type: string
 *                 example: Inappropriate content
 *               description:
 *                 type: string
 *                 example: User posted offensive content
 *     responses:
 *       201:
 *         description: Report created successfully
 */
reportRouters.post("/reports", anyAuth, createReportController);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all reports
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all reports
 *     description: Only accessible to admins or moderators
 */
reportRouters.get("/reports", adminOrModeratorAuth, getAllReportsController);

/**
 * @swagger
 * /api/reports/user/{userId}:
 *   get:
 *     summary: Get reports by a specific reported user
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reported user
 *     responses:
 *       200:
 *         description: List of reports for the user
 */
reportRouters.get("/reports/user/:userId", adminOrModeratorAuth, getReportsByUserController);

/**
 * @swagger
 * /api/reports/status/{status}:
 *   get:
 *     summary: Get reports by status
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, reviewed, resolved]
 *         description: Status of reports to filter
 *     responses:
 *       200:
 *         description: List of reports with the given status
 */
reportRouters.get("/reports/status/:status", adminOrModeratorAuth, getReportsByStatusController);

/**
 * @swagger
 * /api/reports/{reportId}:
 *   patch:
 *     summary: Update report status
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the report
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, resolved]
 *                 example: resolved
 *     responses:
 *       200:
 *         description: Report status updated successfully
 */
reportRouters.patch("/reports/:reportId", adminOrModeratorAuth, updateReportStatusController);

/**
 * @swagger
 * /api/reports/{reportId}:
 *   delete:
 *     summary: Delete a report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the report
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *     description: Only accessible by admins
 */
reportRouters.delete("/reports/:reportId", adminAuth, deleteReportController);

export default reportRouters;
