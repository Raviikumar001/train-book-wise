// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// import * as schema from "../models/schema.js";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// export const db = drizzle(pool, { schema });

// // Initialize seats if they don't exist
// export const initializeSeats = async () => {
//   try {
//     const existingSeats = await db.select().from(schema.seats);

//     if (existingSeats.length === 0) {
//       const seatData = [];
//       let seatId = 1;

//       // Create 11 rows with 7 seats each
//       for (let row = 1; row <= 11; row++) {
//         for (let seat = 1; seat <= 7; seat++) {
//           seatData.push({
//             id: seatId++,
//             row_number: row,
//             seat_number: seat,
//             is_booked: false,
//           });
//         }
//       }

//       // Create last row with 3 seats
//       for (let seat = 1; seat <= 3; seat++) {
//         seatData.push({
//           id: seatId++,
//           row_number: 12,
//           seat_number: seat,
//           is_booked: false,
//         });
//       }

//       await db.insert(schema.seats).values(seatData);
//       console.log("Seats initialized successfully");
//     }
//   } catch (error) {
//     console.error("Error initializing seats:", error);
//   }
// };

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../models/schema.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Create database connection
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle({ client: sql }, { schema });

// Simple connection check
export const checkDatabaseConnection = async () => {
  try {
    await db.select().from(schema.seats).limit(1);
    console.log("✅ Database connected successfully");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Initialize seats if they don't exist
export const initializeSeats = async () => {
  try {
    console.log("Checking seats...");
    const existingSeats = await db.select().from(schema.seats);

    if (existingSeats.length === 0) {
      const seatData = [];
      let seatId = 1;

      // Create 11 rows with 7 seats each
      for (let row = 1; row <= 11; row++) {
        for (let seat = 1; seat <= 7; seat++) {
          seatData.push({
            id: seatId++,
            row_number: row,
            seat_number: seat,
            is_booked: false,
          });
        }
      }

      // Create last row with 3 seats
      for (let seat = 1; seat <= 3; seat++) {
        seatData.push({
          id: seatId++,
          row_number: 12,
          seat_number: seat,
          is_booked: false,
        });
      }

      await db.insert(schema.seats).values(seatData);
      console.log("✅ Seats initialized successfully");
    } else {
      console.log("✅ Seats already exist");
    }
    return true;
  } catch (error) {
    console.error("❌ Error initializing seats:", error.message);
    return false;
  }
};
