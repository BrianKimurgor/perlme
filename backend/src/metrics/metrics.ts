import client from "prom-client";

export const register = new client.Registry();

// Enable default metrics: CPU, memory, Node.js event loop, GC
client.collectDefaultMetrics({ register });

// HTTP requests counter
export const httpRequestsTotal = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "statusCode"] as const,
});

// HTTP request duration histogram
export const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "statusCode"] as const,
    buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5],
});

// Rate limit hits (we already discussed)
export const rateLimitHits = new client.Counter({
    name: "rate_limit_hits_total",
    help: "Total number of rate limit blocks",
    labelNames: ["scope"] as const,
});

register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDuration);
register.registerMetric(rateLimitHits);