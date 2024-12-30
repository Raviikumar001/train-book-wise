import { db } from "../config/db.config.js";
import { bookings, seats } from "../models/schema.js";
import { eq, and, gte } from "drizzle-orm";
import { APIError } from "../middlewares/error.middleware.js";

export const bookingService = {
  // Get all available seats
  async getAvailableSeats(date) {
    const allSeats = await db.select().from(seats);
    const bookedSeats = await db
      .select()
      .from(bookings)
      .where(
        and(eq(bookings.booking_date, date), eq(bookings.status, "active"))
      );

    const bookedSeatIds = new Set(
      bookedSeats.map((booking) => booking.seat_id)
    );
    return allSeats.filter((seat) => !bookedSeatIds.has(seat.id));
  },

  // Book a seat
  async bookSeat(userId, seatId, date) {
    // Check if seat is available
    const existingBooking = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.seat_id, seatId),
          eq(bookings.booking_date, date),
          eq(bookings.status, "active")
        )
      )
      .limit(1);

    if (existingBooking.length > 0) {
      throw new APIError("Seat is already booked", 400, "SEAT_UNAVAILABLE");
    }

    // Create booking
    const [booking] = await db
      .insert(bookings)
      .values({
        user_id: userId,
        seat_id: seatId,
        booking_date: date,
      })
      .returning();

    return booking;
  },

  // Get user's bookings
  async getUserBookings(userId) {
    return db
      .select({
        id: bookings.id,
        seat_id: bookings.seat_id,
        booking_date: bookings.booking_date,
        status: bookings.status,
        created_at: bookings.created_at,
      })
      .from(bookings)
      .where(eq(bookings.user_id, userId))
      .orderBy(bookings.booking_date);
  },

  // Cancel booking
  async cancelBooking(userId, bookingId) {
    const [booking] = await db
      .update(bookings)
      .set({ status: "cancelled" })
      .where(and(eq(bookings.id, bookingId), eq(bookings.user_id, userId)))
      .returning();

    if (!booking) {
      throw new APIError("Booking not found", 404, "BOOKING_NOT_FOUND");
    }

    return booking;
  },
};
