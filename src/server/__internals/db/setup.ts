import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "",
});

const db = drizzle({ client: pool });
export { db };
