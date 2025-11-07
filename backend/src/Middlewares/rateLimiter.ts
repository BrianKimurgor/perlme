import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { Request, Response, NextFunction } from "express";

// Configure limits
const USER_LIMIT = 10; 
const GUEST_LIMIT = 5; 
const DURATION = 60; 

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
  const anyReq = req as any;
  const uid = anyReq.user?.id ?? (req.headers['x-user-id'] as string | undefined);
  const identifier = uid ? `user:${String(uid)}` : `ip:${req.ip}`;

  try {
    if (uid) {
      // Logged-in user
      const rlRes = await userLimiter.consume(identifier);
      res.setHeader("X-RateLimit-Limit", String(USER_LIMIT));
      res.setHeader("X-RateLimit-Remaining", String(Math.max(0, rlRes.remainingPoints)));
      res.setHeader("X-RateLimit-Reset", String(Math.floor((Date.now() + (rlRes.msBeforeNext ?? 0)) / 1000)));
      next();
    } else {
      // Guest
      const rlRes = await guestLimiter.consume(identifier);
      res.setHeader("X-RateLimit-Limit", String(GUEST_LIMIT));
      res.setHeader("X-RateLimit-Remaining", String(Math.max(0, rlRes.remainingPoints)));
      res.setHeader("X-RateLimit-Reset", String(Math.floor((Date.now() + (rlRes.msBeforeNext ?? 0)) / 1000)));
      next();
    }
  } catch (err) {
    // rate-limiter-flexible rejects with RateLimiterRes on consumed too many
    const errObj = err as RateLimiterRes | any;
    const retrySec = Math.ceil((errObj.msBeforeNext ?? 0) / 1000) || 1;
    res.setHeader('Retry-After', String(retrySec));
    res.status(429).json({
      error: "Too many requests. Please try again later.",
      retryAfter: retrySec,
    });
  }
};
