import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const logsDir = path.resolve(process.cwd(), "../logs");
const webLogFile = path.join(logsDir, "web.log");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const level = body?.level || "info";
    const message = body?.message;
    const metadata = body?.metadata;

    if (typeof message !== "string") {
      return NextResponse.json({ error: "Invalid log payload" }, { status: 400 });
    }

    const line = JSON.stringify({
      timestamp: new Date().toISOString(),
      source: "web",
      level,
      message,
      metadata: metadata ?? null,
    });

    await fs.promises.appendFile(webLogFile, `${line}\n`, "utf8");
    return NextResponse.json({ accepted: true }, { status: 202 });
  } catch {
    return NextResponse.json({ error: "Failed to write log" }, { status: 500 });
  }
}