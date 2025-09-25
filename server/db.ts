import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// For development, use a mock database URL if no DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  console.log("No DATABASE_URL found, using mock database for development");
  process.env.DATABASE_URL = "postgresql://mock:mock@localhost:5432/mock";
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });