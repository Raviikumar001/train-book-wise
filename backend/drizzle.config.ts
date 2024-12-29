// import type { Config } from "drizzle-kit";
// import * as dotenv from "dotenv";
// dotenv.config();

// export default {
//   schema: "./src/db/schema/*",
//   out: "./src/db/migrations",
//   driver: "pg",
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL!,
//     ssl: true,
//   },
// } satisfies Config;

// import type { Config } from "drizzle-kit";
// import * as dotenv from "dotenv";

// dotenv.config();

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL is not defined");
// }

// const config: Config = {
//   schema: "./src/db/schema/*",
//   out: "./src/db/migrations",
//   driver: "postgresql",
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL!,
//   },
// };

// export default config;

// import 'dotenv/config';
// import  defineConfig  from 'drizzle-kit';
// // import { defineConfig } from 'drizzle-kit';

// export default defineConfig({
//   out: './drizzle',
//   schema: './src/db/schema.ts',
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//   },
// });

// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   dialect: "postgresql", // "mysql" | "sqlite" | "postgresql" | "turso" | "singlestore"
//   schema: "./src/schema/*",
//   out: "./drizzle",
// });

import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema/*",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
