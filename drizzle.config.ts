import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/__internals/db/schemas/index.ts",
  out: "./src/server/__internals/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: false,
  },
});
