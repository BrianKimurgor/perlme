import app from "./app";
import dotenv from "dotenv";
import http from "node:http";
import { initializeSocketService } from "./socket/socket";

dotenv.config();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocketService(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 PerlMe API running on http://localhost:${PORT}`);
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
