import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config({
  path: ".env.development.local",
});

export default {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
