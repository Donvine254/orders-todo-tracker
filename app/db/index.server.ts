import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
dotenv.config();

const sql = neon(import.meta.env.VITE_DATABASE_URL!);
export const db = drizzle({ client: sql });
