import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Seats table
export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),
  seatNumber: integer("seat_number").notNull(),
  rowNumber: integer("row_number").notNull(),
  isBooked: boolean("is_booked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  seatId: integer("seat_id").references(() => seats.id),
  bookingTime: timestamp("booking_time").defaultNow(),
  status: varchar("status", { length: 20 }).default("active"),
});
