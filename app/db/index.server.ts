/*eslint-disable-next-line @typescript-eslint/no-unused-vars*/
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
dotenv.config();
declare const Netlify: any;
const DATABASE_URL =
  process.env.MODE === "development"
    ? process.env.DEV_DATABASE_URL
    : Netlify.env.get("DATABASE_URL");
const sql = neon(DATABASE_URL!);
export const db = drizzle({ client: sql });
