import { Router } from "express";
import { anyAuth } from "../../Middlewares/BearAuth";
import { rateLimiterMiddleware } from "../../Middlewares/rateLimiter";
import {
    getMyProfileController,
    getUserProfileController,
    listInterestsController,
    listLanguagesController,
    listPersonalityTraitsController,
    requestPhoneOtpController,
    setDiscoveryPreferencesController,
    setInterestedInController,
    setInterestsController,
    setLanguagesController,
    setLocationController,
    setPersonalityTraitsController,
    updateProfileController,
    verifyPhoneOtpController,
} from "./profile.controller";

const profileRouter = Router();
profileRouter.use(rateLimiterMiddleware);

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management and discovery preferences
 */

// ─── Own profile ────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/profile/me:
 *   get:
 *     summary: Get your own full profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full profile including languages, traits, preferences
 */
profileRouter.get("/profile/me", anyAuth, getMyProfileController);

/**
 * @swagger
 * /api/profile/me:
 *   patch:
 *     summary: Update core profile fields (bio, pronouns, lifestyle, education, etc.)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 */
profileRouter.patch("/profile/me", anyAuth, updateProfileController);

/**
 * @swagger
 * /api/profile/me/languages:
 *   put:
 *     summary: Set spoken languages (replaces existing)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               languageIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 */
profileRouter.put("/profile/me/languages", anyAuth, setLanguagesController);

/**
 * @swagger
 * /api/profile/me/personality:
 *   put:
 *     summary: Set personality traits (replaces existing)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 */
profileRouter.put("/profile/me/personality", anyAuth, setPersonalityTraitsController);

/**
 * @swagger
 * /api/profile/me/interested-in:
 *   put:
 *     summary: Set who you want to see (genders)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 */
profileRouter.put("/profile/me/interested-in", anyAuth, setInterestedInController);

/**
 * @swagger
 * /api/profile/me/location:
 *   put:
 *     summary: Set or update city and country
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [country, city]
 *             properties:
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 */
profileRouter.put("/profile/me/location", anyAuth, setLocationController);

/**
 * @swagger
 * /api/profile/me/discovery-preferences:
 *   put:
 *     summary: Set discovery/matching preferences (age range, distance, etc.)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 */
profileRouter.put("/profile/me/discovery-preferences", anyAuth, setDiscoveryPreferencesController);

// ─── Reference data (no auth required — needed for onboarding dropdowns) ────

/**
 * @swagger
 * /api/profile/languages:
 *   get:
 *     summary: List all available languages
 *     tags: [Profile]
 */
profileRouter.get("/profile/languages", listLanguagesController);

/**
 * @swagger
 * /api/profile/personality-traits:
 *   get:
 *     summary: List all available personality traits
 *     tags: [Profile]
 */
profileRouter.get("/profile/personality-traits", listPersonalityTraitsController);

/**
 * @swagger
 * /api/profile/interests:
 *   get:
 *     summary: List all available interests
 *     tags: [Profile]
 */
profileRouter.get("/profile/interests", listInterestsController);

/**
 * @swagger
 * /api/profile/me/interests:
 *   put:
 *     summary: Set user interests (replaces existing)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 */
profileRouter.put("/profile/me/interests", anyAuth, setInterestsController);

/**
 * @swagger
 * /api/profile/me/phone/request-otp:
 *   post:
 *     summary: Send a 6-digit OTP to verify phone number
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 */
profileRouter.post("/profile/me/phone/request-otp", anyAuth, requestPhoneOtpController);

/**
 * @swagger
 * /api/profile/me/phone/verify:
 *   post:
 *     summary: Verify phone number with OTP code
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 */
profileRouter.post("/profile/me/phone/verify", anyAuth, verifyPhoneOtpController);

// ─── View another user's profile ─────────────────────────────────────────────

/**
 * @swagger
 * /api/profile/{userId}:
 *   get:
 *     summary: Get another user's public profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 */
profileRouter.get("/profile/:userId", anyAuth, getUserProfileController);

export default profileRouter;
