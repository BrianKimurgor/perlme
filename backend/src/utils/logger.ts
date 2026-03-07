import fs from "node:fs";
import path from "node:path";
import pino from "pino";

const logsDir = path.resolve(__dirname, "../../../logs");
const backendLogFile = path.join(logsDir, "backend.log");

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const destination = pino.destination({
    dest: backendLogFile,
    sync: false,
});

export const logger = pino(
    {
        level: process.env.LOG_LEVEL || "info",
        base: {
            service: "perlme-backend",
            env: process.env.NODE_ENV || "development",
        },
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    destination
);

export const logFiles = {
    logsDir,
    backendLogFile,
};
