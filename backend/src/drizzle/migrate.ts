import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { logger } from "../utils/logger";
import db, { client } from "./db";

// Creating our migrations
async function migration() {
    logger.info("-----Migration Started SuccessFully!------");
    await migrate(db, { migrationsFolder: __dirname + "/migrations" });
    await client.end();
    logger.info("-----Migration ended SuccessFully!-------");
    process.exit(0);
}

// Catch Errors
migration().catch()
