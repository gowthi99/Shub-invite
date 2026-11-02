import "server-only";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

type DB = ReturnType<typeof drizzleNeon<typeof schema>>;

const globalForDb = globalThis as unknown as { __db?: Promise<DB> };

async function init(): Promise<DB> {
  let db: DB;
  if (process.env.DATABASE_URL) {
    db = drizzleNeon(neon(process.env.DATABASE_URL), { schema });
  } else {
    // Local development fallback: embedded Postgres persisted to ./.pglite
    const { PGlite } = await import("@electric-sql/pglite");
    const client = new PGlite("./.pglite");
    db = drizzlePglite(client, { schema }) as unknown as DB;
  }
  for (const stmt of schema.SCHEMA_SQL) await db.execute(sql.raw(stmt));
  return db;
}

/** Returns the shared Drizzle client, creating tables on first use. */
export function getDb(): Promise<DB> {
  if (!globalForDb.__db) {
    globalForDb.__db = init().catch((e) => {
      globalForDb.__db = undefined;
      throw e;
    });
  }
  return globalForDb.__db;
}

export { schema };
