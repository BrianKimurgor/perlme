import { Request, Response, NextFunction } from "express";
import { httpRequestsTotal, httpRequestDuration } from "../metrics/metrics";

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();

    res.on("finish", () => {
        const durationInSeconds = (() => {
            const diff = process.hrtime(start);
            return diff[0] + diff[1] / 1e9;
        })();

        const route = req.route?.path || req.path;
        const method = req.method;
        const statusCode = res.statusCode.toString();

        httpRequestsTotal.labels(method, route, statusCode).inc();
        httpRequestDuration.labels(method, route, statusCode).observe(durationInSeconds);
    });

    next();
};
