import { Express } from "express";
import helmet from "helmet";
import expectCt from "expect-ct"

/**
 * Apply security headers using Helmet
 * This should be called early in your Express app setup
 */
export const applySecurityHeaders = (app: Express) => {
    // Apply Helmet with secure defaults
    app.use(
        helmet({
            // Content Security Policy
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"], // Allow images from HTTPS
                    connectSrc: ["'self'"], // API calls
                    fontSrc: ["'self'"],
                    objectSrc: ["'none'"],
                    mediaSrc: ["'self'"],
                    frameSrc: ["'none'"],
                },
            },

            // Cross-Origin Embedder Policy
            crossOriginEmbedderPolicy: true,

            // Cross-Origin Opener Policy
            crossOriginOpenerPolicy: { policy: "same-origin" },

            // Cross-Origin Resource Policy
            crossOriginResourcePolicy: { policy: "same-origin" },

            // DNS Prefetch Control
            dnsPrefetchControl: { allow: false },

            // Expect-CT (handled separately below)

            // Frameguard (prevent clickjacking)
            frameguard: { action: "deny" },

            // Hide Powered-By header
            hidePoweredBy: true,

            // HTTP Strict Transport Security
            hsts: {
                maxAge: 31536000, // 1 year
                includeSubDomains: true,
                preload: true,
            },

            // IE No Open
            ieNoOpen: true,

            // Don't Sniff Mimetype
            noSniff: true,

            // Origin Agent Cluster
            originAgentCluster: true,

            // Permitted Cross-Domain Policies
            permittedCrossDomainPolicies: { permittedPolicies: "none" },

            // Referrer Policy
            referrerPolicy: { policy: "no-referrer" },

            // XSS Filter
            xssFilter: true,
        })
    );

    // Apply Expect-CT header separately
    app.use(
        expectCt({
            maxAge: 86400,
            enforce: true,
        })
    );

    // Additional custom headers
    app.use((req, res, next) => {
        // Prevent caching of sensitive data
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        // Feature Policy / Permissions Policy
        res.setHeader(
            "Permissions-Policy",
            "geolocation=(), microphone=(), camera=(), payment=()"
        );

        next();
    });
};

/**
 * CORS configuration
 * Apply this separately with the 'cors' package
 */
export const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600, // Cache preflight for 10 minutes
};
