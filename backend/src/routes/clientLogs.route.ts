import fs from "node:fs";
import path from "node:path";
import { Router } from "express";

const router = Router();

type ClientSource = "expo" | "web";
type ClientLevel = "debug" | "info" | "warn" | "error";

const logsDir = path.resolve(__dirname, "../../../logs");

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const sourceToFile: Record<ClientSource, string> = {
    expo: path.join(logsDir, "expo.log"),
    web: path.join(logsDir, "web.log"),
};

router.post("/internal/logs", async (req, res) => {
    const source = req.body?.source as ClientSource | undefined;
    const level = (req.body?.level as ClientLevel | undefined) || "info";
    const message = req.body?.message;
    const metadata = req.body?.metadata;

    if (!source || !(source in sourceToFile) || typeof message !== "string") {
        return res.status(400).json({ error: "Invalid log payload" });
    }

    const logFile = sourceToFile[source];
    const line = JSON.stringify({
        timestamp: new Date().toISOString(),
        source,
        level,
        message,
        metadata: metadata ?? null,
    });

    try {
        await fs.promises.appendFile(logFile, `${line}\n`, "utf8");
        return res.status(202).json({ accepted: true });
    } catch {
        return res.status(500).json({ error: "Failed to write log" });
    }
});

export default router;