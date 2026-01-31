// internalOnly.middleware.ts
import { Request, Response, NextFunction } from "express";

export const internalOnly = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["x-internal-token"];
    if (!token || token !== process.env.INTERNAL_METRICS_TOKEN) {
        return res.status(403).json({ error: "Forbidden" });
    }
    next();
};
