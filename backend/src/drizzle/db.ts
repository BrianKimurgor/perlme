// Imports
import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import type { Logger as DrizzleLogger } from "drizzle-orm/logger"
import { Client } from "pg"
import * as schema from "../drizzle/schema"
import { logger } from "../utils/logger"

// define Client
export const client =new Client({
    connectionString: process.env.DATABASE_URL as string,
})

const connectDatabase = async () => {
    try {
        await client.connect()
    } catch (error) {
        logger.error({ error }, "Database connection failed")
    }
}

void connectDatabase()

const drizzleLogger: DrizzleLogger = {
    logQuery: (query, params) => {
        logger.info({ query, params }, "db_query")
    },
};

const db = drizzle(client, { schema, logger: drizzleLogger });

export default db;