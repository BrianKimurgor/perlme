import cors from "cors";
import express, { Application } from 'express';
import { applySecurityHeaders, corsOptions } from './Middlewares/securityHeader.middleware';
import { authRouter } from './Auth/Auth.route';
import { anyAuth } from './Middlewares/BearAuth';
import { checkUserActive } from './Middlewares/checkUserActivity';
import { logger } from './Middlewares/Logger';
import { rateLimiterMiddleware } from './Middlewares/rateLimiter';
import "./Middlewares/schedule";
import blockRouters from './Services/Block/block.routes';
import exploreRouter from './Services/Explore and Recommendations/exploreAndRecommend.routes';
import messageRouter from './Services/Messages/message.route';
import postRouter from './Services/posts/post.route';
import reportRouters from './Services/Reports/report.route';
import userRouters from './Services/Users/user.route';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import { EmailServiceFactory, EmailProviderType } from './Services/email/EmailServiceFactory';
import healthRoute from "./routes/health.route";
import metricsRoute from "./routes/metrics.route";


console.log("🟢 Scheduler file loaded");

const app: Application = express();

// ============================================================================
// 🏥 HEALTH CHECK (Before other middleware)
// ============================================================================
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// ===== INITIALIZE EMAIL SERVICE =====
// This should happen early in your app initialization
const emailProvider = (process.env.EMAIL_PROVIDER as EmailProviderType) || 'resend';

try {
    EmailServiceFactory.initialize(emailProvider);
    console.log(`✅ Email service initialized with provider: ${emailProvider}`);
} catch (error) {
    console.error('❌ Failed to initialize email service:', error);
    process.exit(1);
}

// ============================================================================
// 🌐 CORS CONFIGURATION
// ============================================================================
// Use production-ready CORS config from securityHeaders.middleware
app.use(cors(corsOptions));

// ============================================================================
// 📦 BODY PARSING (with size limits to prevent DoS)
// ============================================================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================================================
// 🚦 RATE LIMITING
// ============================================================================
app.use(rateLimiterMiddleware);
app.set("trust proxy", true);

// ============================================================================
// 📝 LOGGING
// ============================================================================
app.use(logger);

// ============================================================================
// 🔧 TRUST PROXY (if behind nginx/load balancer/cloudflare)
// ============================================================================
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1); // Trust first proxy
}

// ============================================================================
// 📚 SWAGGER DOCS (Development only)
// ============================================================================
if (process.env.NODE_ENV !== "production") {
    app.use(
        "/api/docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        })
    );
}

// ============================================================================
// 🛣️ PUBLIC ROUTES (No authentication required)
// ============================================================================
app.use('/api/auth', authRouter);
app.use('/api/discover', exploreRouter);

// Health and Metrics routes
app.use(healthRoute);
app.use(metricsRoute);

// ============================================================================
// 🔐 PROTECTED ROUTES (Require authentication + active account)
// ============================================================================
app.use('/api', anyAuth, checkUserActive, userRouters);
app.use('/api', anyAuth, checkUserActive, postRouter);
app.use('/api', anyAuth, checkUserActive, messageRouter);
app.use('/api', anyAuth, checkUserActive, blockRouters);
app.use('/api', anyAuth, checkUserActive, reportRouters);
// ============================================================================
// ❌ 404 HANDLER
// ============================================================================
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// ============================================================================
// 🚨 GLOBAL ERROR HANDLER
// ============================================================================
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled error:", err);

    // Don't expose internal error details in production
    const message = process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message;

    res.status(err.status || 500).json({
        error: message,
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    });
});

export default app;
