// import dotenv from "dotenv";
// dotenv.config();

// /** @type { import("drizzle-kit").Config } */
// export default {
//   schema: "./src/models/schema.js",
//   out: "./drizzle",
//   dialect: "pg", // Changed from 'driver' to 'dialect'
//   driver: "pg", // Keep this for backward compatibility
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL,
//   },
// };

import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

/** @type { import("drizzle-kit").Config } */
export default defineConfig({
  schema: "./src/models/schema.js",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
