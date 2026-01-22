import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Don't need dotenv.config() twice - remove the duplicate

// Debug - verify environment loaded
console.log("🔍 Environment loaded:");
console.log("   NODE_ENV:", process.env.NODE_ENV || "development");
console.log("   PORT:", process.env.PORT);
console.log("   JWT_SECRET exists:", !!process.env.JWT_SECRET);

// NOW import app (after environment is loaded)
import app from "./app";
import http from "node:http";
import { initializeSocketService } from "./socket/socket";

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocketService(server);

const PORT = Number.parseInt(process.env.PORT || "5000", 10);

if (Number.isNaN(PORT)) {
    throw new TypeError("Invalid PORT environment variable");
}

server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 PerlMe API running on http://0.0.0.0:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);

    if (process.env.NODE_ENV !== "production") {
        console.log(`📚 Swagger docs: http://0.0.0.0:${PORT}/api/docs`);
    }
});

// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
    });
});

process.on("SIGINT", () => {
    console.log("SIGINT signal received: closing HTTP server");
    server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
    });
});