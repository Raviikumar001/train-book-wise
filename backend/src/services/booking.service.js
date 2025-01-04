import { db } from "../config/db.config.js";
import { bookings, seats } from "../models/schema.js";
import { eq, and, gte, inArray } from "drizzle-orm";
import { APIError } from "../middlewares/error.middleware.js";
import { logger } from "../utils/logger.js";

export const bookingService = {
  async getAvailableSeats(date) {
    try {
      const allSeats = await db.select().from(seats);

      // Get active bookings for the given date
      const activeBookings = await db
        .select()
        .from(bookings)
        .where(
          and(eq(bookings.booking_date, date), eq(bookings.status, "active"))
        );

      // Create a Set of booked seat IDs for quick lookup
      const bookedSeatIds = new Set(
        activeBookings.map((booking) => booking.seat_id)
      );

      // Map seats with their booking status
      const seatsWithStatus = allSeats.map((seat) => ({
        ...seat,
        is_booked: bookedSeatIds.has(seat.id),
      }));

      // Calculate statistics
      const totalSeats = allSeats.length;
      const bookedSeatsCount = bookedSeatIds.size;
      const availableSeatsCount = totalSeats - bookedSeatsCount;

      return {
        seats: seatsWithStatus,
        statistics: {
          total_seats: totalSeats,
          booked_seats: bookedSeatsCount,
          available_seats: availableSeatsCount,
        },
      };
    } catch (error) {
      logger.error("Error in getAvailableSeats:", error);
      throw new APIError(
        "Failed to fetch available seats",
        500,
        "FETCH_SEATS_ERROR"
      );
    }
  },

  //   // Book multiple seats

  async bookSeats(userId, numSeats, date) {
    try {
      if (numSeats > 7) {
        throw new APIError(
          "Maximum 7 seats can be booked at once",
          400,
          "EXCEED_MAX_SEATS"
        );
      }

      // Get current seat availability
      const { seats: availableSeats, statistics } =
        await this.getAvailableSeats(date);

      if (statistics.available_seats < numSeats) {
        throw new APIError(
          `Only ${statistics.available_seats} seats available`,
          400,
          "INSUFFICIENT_SEATS"
        );
      }

      // Find seats in the same row if possible
      const seatsToBook = await this.findBestAvailableSeats(
        numSeats,
        availableSeats
      );

      const bookedSeats = [];
      for (const seat of seatsToBook) {
        try {
          // Double-check if seat is still available
          const existingBooking = await db
            .select()
            .from(bookings)
            .where(
              and(
                eq(bookings.seat_id, seat.id),
                eq(bookings.booking_date, date),
                eq(bookings.status, "active")
              )
            )
            .limit(1);

          if (existingBooking.length > 0) {
            // If any seat is already taken, cancel all previous bookings
            if (bookedSeats.length > 0) {
              await this.cancelBookings(bookedSeats.map((b) => b.id));
              // Reset is_booked for cancelled bookings
              await db
                .update(seats)
                .set({ is_booked: false })
                .where(
                  inArray(
                    seats.id,
                    bookedSeats.map((b) => b.seat_id)
                  )
                );
            }
            throw new APIError(
              "Selected seats are no longer available",
              400,
              "SEATS_UNAVAILABLE"
            );
          }

          // Book the seat and update is_booked status
          const [booking] = await db
            .insert(bookings)
            .values({
              user_id: userId,
              seat_id: seat.id,
              booking_date: date,
              status: "active",
            })
            .returning();

          // Update seat status
          await db
            .update(seats)
            .set({ is_booked: true })
            .where(eq(seats.id, seat.id));

          bookedSeats.push(booking);
        } catch (error) {
          // If there's an error booking any seat, cancel all previous bookings
          if (bookedSeats.length > 0) {
            await this.cancelBookings(bookedSeats.map((b) => b.id));
            // Reset is_booked for cancelled bookings
            await db
              .update(seats)
              .set({ is_booked: false })
              .where(
                inArray(
                  seats.id,
                  bookedSeats.map((b) => b.seat_id)
                )
              );
          }
          throw error;
        }
      }

      // Get updated seat information
      const bookedSeatsDetails = await Promise.all(
        bookedSeats.map(async (booking) => {
          const [seatInfo] = await db
            .select()
            .from(seats)
            .where(eq(seats.id, booking.seat_id));
          return {
            booking,
            seat: seatInfo,
          };
        })
      );

      return {
        message: `Successfully booked ${numSeats} seat(s)`,
        bookings: bookedSeats,
        seats: bookedSeatsDetails,
      };
    } catch (error) {
      logger.error("Error in bookSeats:", error);
      if (error instanceof APIError) throw error;
      throw new APIError(
        error.message || "Failed to book seats",
        500,
        "BOOKING_ERROR"
      );
    }
  },

  // cancelBookings method
  async cancelBookings(bookingIds) {
    try {
      // Get the seat IDs from the bookings
      const bookingsToCancel = await db
        .select()
        .from(bookings)
        .where(inArray(bookings.id, bookingIds));

      // Update bookings status
      await db
        .update(bookings)
        .set({ status: "cancelled" })
        .where(inArray(bookings.id, bookingIds));

      // Reset is_booked status for the seats
      await db
        .update(seats)
        .set({ is_booked: false })
        .where(
          inArray(
            seats.id,
            bookingsToCancel.map((b) => b.seat_id)
          )
        );
    } catch (error) {
      logger.error("Error cancelling bookings:", error);
    }
  },

  async getUserBookings(userId) {
    try {
      const userBookings = await db
        .select({
          booking: {
            id: bookings.id,
            booking_date: bookings.booking_date,
            status: bookings.status,
            created_at: bookings.created_at,
          },
          seat: {
            id: seats.id,
            row_number: seats.row_number,
            seat_number: seats.seat_number,
          },
        })
        .from(bookings)
        .leftJoin(seats, eq(bookings.seat_id, seats.id))
        .where(and(eq(bookings.user_id, userId), eq(bookings.status, "active")))
        .orderBy(bookings.booking_date);

      return userBookings.map(({ booking, seat }) => ({
        ...booking,
        seat_details: seat,
      }));
    } catch (error) {
      logger.error("Error fetching user bookings:", error);
      throw new APIError(
        "Failed to fetch user bookings",
        500,
        "FETCH_BOOKINGS_ERROR"
      );
    }
  },

  // Reset (cancel) all user's bookings
  async resetUserBookings(userId) {
    try {
      logger.info(`Attempting to reset bookings for user: ${userId}`);

      // First check if the user has any active bookings
      const activeBookings = await db
        .select()
        .from(bookings)
        .where(
          and(eq(bookings.user_id, userId), eq(bookings.status, "active"))
        );

      logger.info(
        `Found ${activeBookings.length} active bookings for user ${userId}`
      );

      if (activeBookings.length === 0) {
        return {
          message: "No bookings found to reset",
          cancelledBookings: [],
          updatedSeats: [],
        };
      }

      const seatIds = activeBookings.map((booking) => booking.seat_id);

      const updatedSeats = await db
        .update(seats)
        .set({ is_booked: false })
        .where(inArray(seats.id, seatIds))
        .returning();

      const cancelledBookings = await db
        .update(bookings)
        .set({
          status: "cancelled",
          cancelled_at: new Date(),
        })
        .where(and(eq(bookings.user_id, userId), eq(bookings.status, "active")))
        .returning();

      return {
        message: `Successfully reset ${cancelledBookings.length} booking(s)`,
        cancelledBookings,
        updatedSeats,
      };
    } catch (error) {
      logger.error(`Error resetting bookings for user ${userId}:`, error);
      throw new APIError(
        "Failed to reset bookings",
        500,
        "RESET_BOOKINGS_ERROR"
      );
    }
  },

  async verifySeatStatus(seatIds) {
    const seatStatus = await db
      .select()
      .from(seats)
      .where(inArray(seats.id, seatIds));

    return seatStatus;
  },

  async getBookingStatus(userId) {
    const [activeBookings, bookedSeats] = await Promise.all([
      db
        .select()
        .from(bookings)
        .where(
          and(eq(bookings.user_id, userId), eq(bookings.status, "active"))
        ),
      db.select().from(seats).where(eq(seats.is_booked, true)),
    ]);

    return {
      activeBookings,
      bookedSeats,
      totalActiveBookings: activeBookings.length,
      totalBookedSeats: bookedSeats.length,
    };
  },

  async findBestAvailableSeats(numSeats, availableSeats) {
    // Group available seats by row
    const seatsByRow = availableSeats.reduce((acc, seat) => {
      if (!seat.is_booked) {
        acc[seat.row_number] = acc[seat.row_number] || [];
        acc[seat.row_number].push(seat);
      }
      return acc;
    }, {});

    // Try to find seats in the same row
    for (const [row, rowSeats] of Object.entries(seatsByRow)) {
      if (rowSeats.length >= numSeats) {
        return rowSeats.slice(0, numSeats);
      }
    }

    // If no single row has enough seats, get nearest available seats
    const allAvailableSeats = availableSeats
      .filter((seat) => !seat.is_booked)
      .sort((a, b) => {
        // Sort by row and then by seat number
        if (a.row_number === b.row_number) {
          return a.seat_number - b.seat_number;
        }
        return a.row_number - b.row_number;
      });

    if (allAvailableSeats.length >= numSeats) {
      return allAvailableSeats.slice(0, numSeats);
    }

    throw new APIError(
      `Not enough seats available. Only ${allAvailableSeats.length} seats available.`,
      400,
      "INSUFFICIENT_SEATS"
    );
  },
};
