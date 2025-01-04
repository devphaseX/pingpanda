import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/__internals/db/schema/index.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: false,
  },
});
