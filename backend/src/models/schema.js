import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
export const seats = pgTable("seats", {
  id: serial("id").primaryKey(),
  row_number: integer("row_number").notNull(),
  seat_number: integer("seat_number").notNull(),
  is_booked: boolean("is_booked").default(false),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .references(() => users.id)
    .notNull(),
  seat_id: integer("seat_id")
    .references(() => seats.id)
    .notNull(),
  booking_date: timestamp("booking_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  created_at: timestamp("created_at").defaultNow(),
});
