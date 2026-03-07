import { API_BASE_URL } from "./config";

type LogLevel = "debug" | "info" | "warn" | "error";

const endpoint = `${API_BASE_URL}internal/logs`;

const sendLog = async (level: LogLevel, message: string, metadata?: unknown) => {
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "expo",
        level,
        message,
        metadata,
      }),
    });
  } catch {
    // Ignore network failures to avoid app crashes during logging.
  }
};

export const expoLogger = {
  debug: (message: string, metadata?: unknown) => void sendLog("debug", message, metadata),
  info: (message: string, metadata?: unknown) => void sendLog("info", message, metadata),
  warn: (message: string, metadata?: unknown) => void sendLog("warn", message, metadata),
  error: (message: string, metadata?: unknown) => void sendLog("error", message, metadata),
};
