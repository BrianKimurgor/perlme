type LogLevel = "debug" | "info" | "warn" | "error";

const endpoint = "/api/internal/logs";

const sendLog = async (level: LogLevel, message: string, metadata?: unknown) => {
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level,
        message,
        metadata,
      }),
    });
  } catch {
    // Ignore logging failures in client runtime.
  }
};

export const webLogger = {
  debug: (message: string, metadata?: unknown) => void sendLog("debug", message, metadata),
  info: (message: string, metadata?: unknown) => void sendLog("info", message, metadata),
  warn: (message: string, metadata?: unknown) => void sendLog("warn", message, metadata),
  error: (message: string, metadata?: unknown) => void sendLog("error", message, metadata),
};
