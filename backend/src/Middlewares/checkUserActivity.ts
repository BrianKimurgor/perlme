import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import db from "../drizzle/db";
import { users } from "../drizzle/schema";
import { logger } from "../utils/logger";
import { ResponseHandler } from "../utils/responseHandler";

// Middleware to block suspended users
export const checkUserActive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return ResponseHandler.unauthorized(res, "Unauthorized");
    }

    // Only fetch the fields needed to check suspension — avoids 3 extra count queries
    const [user] = await db
      .select({ isSuspended: users.isSuspended, suspendedUntil: users.suspendedUntil })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return ResponseHandler.notFound(res, "User not found");
    }

    const now = new Date();
    const isSuspended =
      user.isSuspended &&
      (user.suspendedUntil === null || user.suspendedUntil > now);

    if (isSuspended) {
      return ResponseHandler.forbidden(res, "Your account is suspended. Please contact support or wait until your suspension period ends.");
    }

    next();
  } catch (error) {
    logger.error("Error checking user suspension:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

