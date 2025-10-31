import { RateLimiterMemory } from "rate-limiter-flexible";
import { Request, Response, NextFunction } from "express";

// Configure limits
const USER_LIMIT = 60; // 60 requests
const GUEST_LIMIT = 30; // 30 requests
const DURATION = 60; // per 60 seconds (1 minute)

// In-memory rate limiters
const userLimiter = new RateLimiterMemory({
  points: USER_LIMIT,
  duration: DURATION,
});
const guestLimiter = new RateLimiterMemory({
  points: GUEST_LIMIT,
  duration: DURATION,
});

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'] as string | undefined;
  const identifier = userId || req.ip || 'unknown';

  try {
    if (userId) {
      // Logged-in user
      await userLimiter.consume(identifier);
      console.log(`Rate limit passed for user: ${identifier}`);
    } else {
      // Guest
      await guestLimiter.consume(identifier);
      console.log(`Rate limit passed for guest IP: ${identifier}`);
    }
    next();
  } catch (error_) {
    // 'error_' is the rejected response object from rate-limiter-flexible
    const retrySec = Math.ceil((error_ as any).msBeforeNext / 1000);
    res.setHeader('Retry-After', String(retrySec));
    res.status(429).json({
      error: "Too many requests. Please try again later.",
      retryAfter: retrySec,
    });
  }
};
