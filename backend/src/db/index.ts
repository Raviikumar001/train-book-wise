import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/schema";
import dotenv from "dotenv";

dotenv.config();

class Database {
  private static instance: Database;
  private pool: Pool;
  public db: ReturnType<typeof drizzle<typeof schema>>;

  private constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });

    this.db = drizzle(this.pool, { schema });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      console.log("✅ Database connection established");
      client.release();
      return true;
    } catch (error) {
      console.error("❌ Failed to connect to database:", error);
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.pool.end();
      console.log("Database connection closed");
    } catch (error) {
      console.error("Error while closing database connection:", error);
      throw error;
    }
  }

  public getClient(): Pool {
    return this.pool;
  }
}

// Export database instance and schema
export const dbInstance = Database.getInstance();
export const db = dbInstance.db;
export * from "./schema/schema";

// Export helper functions
export const connectToDatabase = () => dbInstance.connect();
export const disconnectFromDatabase = () => dbInstance.disconnect();

// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// import * as schema from "./schema/schema";
// import dotenv from "dotenv";

// dotenv.config();

// // Validate environment variables
// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL is missing in environment variables");
// }

// // Create a singleton for database connection
// class Database {
//   private static instance: Database;
//   private pool: Pool;
//   public db: ReturnType<typeof drizzle>;

//   private constructor() {
//     this.pool = new Pool({
//       connectionString: process.env.DATABASE_URL,
//       ssl: true,
//     });

//     this.db = drizzle(this.pool, { schema });
//   }

//   public static getInstance(): Database {
//     if (!Database.instance) {
//       Database.instance = new Database();
//     }
//     return Database.instance;
//   }

//   public async connect(): Promise<boolean> {
//     try {
//       const client = await this.pool.connect();
//       console.log("✅ Database connection established");
//       client.release();
//       return true;
//     } catch (error) {
//       console.error("❌ Failed to connect to database:", error);
//       return false;
//     }
//   }

//   public async disconnect(): Promise<void> {
//     try {
//       await this.pool.end();
//       console.log("Database connection closed");
//     } catch (error) {
//       console.error("Error while closing database connection:", error);
//       throw error;
//     }
//   }

//   public getClient(): Pool {
//     return this.pool;
//   }
// }

// // Export a database instance
// export const dbInstance = Database.getInstance();
// export const db = dbInstance.db;

// // Export schema for type inference
// export * from "./schema/schema";

// // Export helper functions
// export const connectToDatabase = () => dbInstance.connect();
// export const disconnectFromDatabase = () => dbInstance.disconnect();
