import { Router } from "express";
import { VibeController } from "./vibe.controller";

const vibeRouter = Router();
const vibeController = new VibeController();

/**
 * @swagger
 * tags:
 *   name: Vibes
 *   description: Crowd-sourced vibe badges for user profiles
 */

/**
 * @swagger
 * /api/vibes/{targetUserId}:
 *   post:
 *     summary: Cast (or change) a vibe vote for a user
 *     tags: [Vibes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
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
 *               - vibeType
 *             properties:
 *               vibeType:
 *                 type: string
 *                 enum:
 *                   - SOCIAL_BUTTERFLY
 *                   - SOLO_ADVENTURER
 *                   - DEEP_DIVER
 *                   - INSTANT_MATCH
 *                   - SLOW_BURNER
 *                   - EVENING_STAR
 *                   - CAFFEINE_CRITIC
 *                   - NIGHT_OWL
 *                   - ACTIVITY_JUNKIE
 *                   - WITTY_ONE
 *                   - WHOLESOME
 *                   - MEME_DEALER
 *     responses:
 *       200:
 *         description: Vibe recorded
 */
vibeRouter.post("/:targetUserId", vibeController.castVibe);

/**
 * @swagger
 * /api/vibes/{targetUserId}:
 *   get:
 *     summary: Get vibe summary for a user (top vibe + all counts + your vote)
 *     tags: [Vibes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vibe data
 */
vibeRouter.get("/:targetUserId", vibeController.getVibes);

/**
 * @swagger
 * /api/vibes/{targetUserId}/prompt:
 *   get:
 *     summary: Check if the vibe prompt should be shown in the conversation
 *     tags: [Vibes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "{ data: { show: boolean } }"
 */
vibeRouter.get("/:targetUserId/prompt", vibeController.getPromptStatus);

export default vibeRouter;
