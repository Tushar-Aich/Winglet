import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";

dotenv.config();
const url: string = process.env.POSTGRES_URL || "";
export const db = drizzle(url);