import fs from "node:fs";
import path from "node:path";

let initialized = false;

export async function register() {
  if (initialized) return;

  const logsDir = path.resolve(process.cwd(), "../logs");

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  initialized = true;
}