import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon("postgresql://neondb_owner:npg_hxuGABL5mT7F@ep-billowing-glade-a7htev1r-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require");
export const db = drizzle({ client: sql });
