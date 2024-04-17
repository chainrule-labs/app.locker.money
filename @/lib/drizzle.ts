import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const getDrizzleDb = () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  return drizzle(client);
};
