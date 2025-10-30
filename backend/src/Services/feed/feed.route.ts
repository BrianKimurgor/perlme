import { Router } from "express";
import { authMiddleware } from "../../Middlewares/BearAuth";
import { feedController } from "./feed.controller";

const router = Router();

router.get(
  "/",
  authMiddleware(),
  feedController.getPersonalizedFeed.bind(feedController)
);

router.get(
  "/trending",
  authMiddleware(),
  feedController.getTrendingPosts.bind(feedController)
);

router.get(
  "/following",
  authMiddleware(),
  feedController.getFollowingFeed.bind(feedController)
);

export default router;
