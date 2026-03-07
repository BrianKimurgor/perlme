// internalOnly.middleware.ts
import { Request, Response, NextFunction } from "express";

export const internalOnly = (req: Request, res: Response, next: NextFunction) => {
    const expectedToken = process.env.INTERNAL_METRICS_TOKEN;
    const customHeaderToken = req.headers["x-internal-token"];
    const authHeader = req.headers.authorization;
    const bearerToken = typeof authHeader === "string" && authHeader.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length)
        : undefined;

    const token = typeof customHeaderToken === "string" ? customHeaderToken : bearerToken;

    if (!expectedToken || !token || token !== expectedToken) {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};
