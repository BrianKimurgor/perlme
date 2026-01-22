import { Router } from "express";
import {
  exploreController,
  recommendationController,
} from "./exploreAndRecommendation.controller";
import { optionalAuth, anyAuth } from "../../Middlewares/BearAuth";
import { checkUserActive } from "../../Middlewares/checkUserActivity";

const exploreRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Explore
 *   description: Explore public content and personalized recommendations
 */

/**
 * @swagger
 * /api/discover/explore:
 *   get:
 *     summary: Explore public content
 *     description: Public endpoint. Guests can access, logged-in users will have req.user populated if token is provided.
 *     tags: [Explore]
 *     security:
 *       - bearerAuth: []  # Optional token
 *     responses:
 *       200:
 *         description: List of public content
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
 *                   author:
 *                     type: string
 */
exploreRouter.get(
  "/explore",
  optionalAuth([]), // Allows guest access
  exploreController
);

/**
 * @swagger
 * /api/discover/recommendations:
 *   get:
 *     summary: Get personalized recommendations
 *     description: Requires authentication and active account. Returns personalized content for the logged-in user.
 *     tags: [Explore]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recommended content
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
 *                   author:
 *                     type: string
 *       401:
 *         description: Unauthorized — user not logged in
 *       403:
 *         description: Forbidden — user not active or suspended
 */
exploreRouter.get(
  "/recommendations",
  anyAuth,         // Must be logged-in user
  checkUserActive, // Must not be suspended
  recommendationController
);

export default exploreRouter;
