import { Router } from "express";
import {
  exploreController,
  recommendationController,
} from "./exploreAndRecommendation.controller";
import {
  optionalAuth,
  anyAuth,
} from "../../Middlewares/BearAuth";
import { checkUserActive } from "../../Middlewares/checkUserActivity";

const exploreRouter = Router();

// ========================== 🧭 EXPLORE ==========================
// Public route — anyone can explore public content.
// If a user is logged in, req.user will still be available via the token.
exploreRouter.get(
  "/explore",
  optionalAuth([]), // ✅ Allows guest access (no role restriction)
  exploreController
);

// ========================== ❤️ RECOMMENDATIONS ==========================
// Authenticated + active users only.
exploreRouter.get(
  "/recommendations",
  anyAuth,         // ✅ Must be a logged-in user of any valid role
  checkUserActive, // ✅ Ensures user is not suspended
  recommendationController
);

export default exploreRouter;
