import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const dbUrl = process.env.DATABASE_URL;

const isPlaceholder = !dbUrl || dbUrl.includes("placeholder") || dbUrl.includes("user:password");

export const isDbConnected = !isPlaceholder;

let dbInstance: ReturnType<typeof drizzle> | null = null;

if (isDbConnected && dbUrl) {
  try {
    const sql = neon(dbUrl);
    dbInstance = drizzle(sql, { schema });
  } catch (error) {
    console.warn("Failed to connect to Neon database, using fallback store:", error);
    dbInstance = null;
  }
}

export const db = dbInstance;
