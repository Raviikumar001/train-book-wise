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
  userId: integer("user_id").references(() => users.id),
  seatId: integer("seat_id").references(() => seats.id),
  bookingTime: timestamp("booking_time").defaultNow(),
  status: varchar("status", { length: 20 }).default("active"),
});

// import {
//   pgTable,
//   serial,
//   varchar,
//   timestamp,
//   boolean,
//   integer,
// } from "drizzle-orm/pg-core";

// export const users = pgTable("users", {
//   id: serial("id").primaryKey(),
//   username: varchar("username", { length: 255 }).notNull(),
//   email: varchar("email", { length: 255 }).notNull().unique(),
//   password: varchar("password", { length: 255 }).notNull(),
//   created_at: timestamp("created_at").defaultNow(),
// });

// export const seats = pgTable("seats", {
//   id: serial("id").primaryKey(),
//   row_number: integer("row_number").notNull(),
//   seat_number: integer("seat_number").notNull(),
//   is_booked: boolean("is_booked").default(false),
// });

// export const bookings = pgTable("bookings", {
//   id: serial("id").primaryKey(),
//   userId: integer("user_id").references(() => users.id),
//   seatId: integer("seat_id").references(() => seats.id),
//   bookingTime: timestamp("booking_time").defaultNow(),
//   status: varchar("status", { length: 20 }).default("active"),
// });
// s;
