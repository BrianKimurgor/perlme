import { Request, Response, NextFunction } from "express";
import { feedService } from "./feed.service";

export class FeedController {
  async getPersonalizedFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const includeFollowing = req.query.includeFollowing !== "false";
      const includeTrending = req.query.includeTrending !== "false";

      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          success: false,
          message: "Invalid pagination parameters. Page must be >= 1, limit must be between 1-100",
        });
      }

      const feed = await feedService.getPersonalizedFeed({
        userId,
        page,
        limit,
        includeFollowing,
        includeTrending,
      });

      return res.status(200).json({
        success: true,
        message: "Feed retrieved successfully",
        data: feed,
      });
    } catch (error) {
      console.error("Error getting personalized feed:", error);
      next(error);
    }
  }

  async getTrendingPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const limit = parseInt(req.query.limit as string) || 20;
      const timeframe = parseInt(req.query.timeframe as string) || 7;

      if (limit < 1 || limit > 100) {
        return res.status(400).json({
          success: false,
          message: "Limit must be between 1-100",
        });
      }

      if (timeframe < 1 || timeframe > 30) {
        return res.status(400).json({
          success: false,
          message: "Timeframe must be between 1-30 days",
        });
      }

      const posts = await feedService.getTrendingPosts(userId, limit, timeframe);

      return res.status(200).json({
        success: true,
        message: "Trending posts retrieved successfully",
        data: {
          posts,
          timeframe,
        },
      });
    } catch (error) {
      console.error("Error getting trending posts:", error);
      next(error);
    }
  }

  async getFollowingFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          success: false,
          message: "Invalid pagination parameters. Page must be >= 1, limit must be between 1-100",
        });
      }

      const feed = await feedService.getFollowingFeed(userId, page, limit);

      return res.status(200).json({
        success: true,
        message: "Following feed retrieved successfully",
        data: feed,
      });
    } catch (error) {
      console.error("Error getting following feed:", error);
      next(error);
    }
  }
}

export const feedController = new FeedController();
