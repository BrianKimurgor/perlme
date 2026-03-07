import dotenv from "dotenv";
import path from "node:path";
import { logger } from "./utils/logger";

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debug - verify environment loaded
logger.info(
    {
        nodeEnv: process.env.NODE_ENV || "development",
        port: process.env.PORT,
        jwtSecretExists: !!process.env.JWT_SECRET,
    },
    "Environment loaded"
);

// NOW import app (after environment is loaded)
import app from "./app";
import http from "node:http";
import { initializeSocketService } from "./socket/socket";

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocketService(server);

const PORT = Number.parseInt(process.env.PORT || "3000", 10);

if (Number.isNaN(PORT)) {
    throw new TypeError("Invalid PORT environment variable");
}

server.listen(PORT, "0.0.0.0", () => {
    logger.info({ port: PORT }, "PerlMe API running");
    logger.info({ environment: process.env.NODE_ENV || "development" }, "Environment");

    if (process.env.NODE_ENV !== "production") {
        logger.info({ docsUrl: `http://0.0.0.0:${PORT}/api/docs` }, "Swagger docs");
    }
});

// Graceful shutdown
process.on("SIGTERM", () => {
    logger.warn("SIGTERM signal received: closing HTTP server");
    server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
    });
});

process.on("SIGINT", () => {
    logger.warn("SIGINT signal received: closing HTTP server");
    server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
    });
});