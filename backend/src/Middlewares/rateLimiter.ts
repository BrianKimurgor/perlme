import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { Request, Response, NextFunction } from "express";

/**
 * Rate limit configuration
 */
const RATE_LIMIT_CONFIG = {
  user: { points: 60, duration: 60 },   // 60 requests per minute
  guest: { points: 30, duration: 60 },  // 30 requests per minute
};

// Create memory-based limiters
const userLimiter = new RateLimiterMemory(RATE_LIMIT_CONFIG.user);
const guestLimiter = new RateLimiterMemory(RATE_LIMIT_CONFIG.guest);

/**
 * Rate limiting middleware
 */
export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers["x-user-id"] as string | undefined;

  // Use user ID if logged in, otherwise use IP
  const identifier = userId || req.ip || "unknown";

  // Select limiter
  const limiter = userId ? userLimiter : guestLimiter;

  try {
    const result = await limiter.consume(identifier);

    // Add helpful rate limit headers (best practice)
    res.setHeader("X-RateLimit-Limit", limiter.points);
    res.setHeader("X-RateLimit-Remaining", result.remainingPoints);

    console.log(
      `[RATE-LIMIT] ${userId ? "User" : "Guest"} ${identifier} -> OK (${result.remainingPoints} left)`
    );

    next();
  } catch (err) {
    const rlErr = err as RateLimiterRes;
    const retrySec = Math.ceil(rlErr.msBeforeNext / 1000);

    // Standard retry-after header
    res.setHeader("Retry-After", retrySec);

    // Rate limit headers
    res.setHeader("X-RateLimit-Limit", limiter.points);
    res.setHeader("X-RateLimit-Remaining", 0);

    console.warn(
      `[RATE-LIMIT] BLOCKED ${identifier}. Retry in ${retrySec}s`
    );

    return res.status(429).json({
      error: "Too many requests. Please try again later.",
      retryAfter: retrySec,
    });
  }
};
