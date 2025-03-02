import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();
const URL: string = process.env.POSTGRES_URL || "";

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: URL,
    }
});