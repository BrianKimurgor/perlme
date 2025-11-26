import app from "./app";
import dotenv from "dotenv";
import http from "node:http";
import { initializeSocketService } from "./socket/socket";

dotenv.config();

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
