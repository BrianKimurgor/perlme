import { Request, Response } from "express";
import { exploreAndRecommendValidator } from "../../Validators/Explore.validator";
import { exploreService, recommendationService } from "./exploreAndRecommendations.service";


// ========================== 🧭 EXPLORE CONTROLLER ==========================
export const exploreController = async (req: Request, res: Response) => {
  try {
    const parsed = exploreAndRecommendValidator.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten(),
      });
    }

    const data = await exploreService(parsed.data);

    if (!data.posts.length && !data.groups.length) {
      return res.status(404).json({
        message: "No content found for explore feed.",
      });
    }

    return res.status(200).json({
      message: "Explore feed fetched successfully.",
      data,
    });
  } catch (error: any) {
    console.error("❌ Explore Controller Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to fetch explore feed.",
    });
  }
};

// ========================== ❤️ RECOMMENDATION CONTROLLER ==========================
export const recommendationController = async (req: Request, res: Response) => {
  try {
    const parsed = exploreAndRecommendValidator.safeParse({
      ...req.query,
      userId: req.user?.id, // attach userId from auth middleware
    });

    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.flatten(),
      });
    }

    const recommendations = await recommendationService(parsed.data);

    if (!recommendations.length) {
      return res.status(404).json({
        message: "No recommendations found based on your preferences.",
      });
    }

    return res.status(200).json({
      message: "Recommendations fetched successfully.",
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error: any) {
    console.error("❌ Recommendation Controller Error:", error);
    return res.status(500).json({
      error: error.message || "Failed to fetch recommendations.",
    });
  }
};
