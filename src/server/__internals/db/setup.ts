import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getEnv } from "../env";
import * as schema from "./schemas/index";

const pool = new Pool({
  connectionString: getEnv("DATABASE_URL"),
});

const db = drizzle({ client: pool, schema });
export { db };
