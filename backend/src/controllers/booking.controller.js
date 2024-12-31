import { bookingService } from "../services/booking.service.js";
import { asyncHandler } from "../middlewares/error.middleware.js";
import { APIError } from "../middlewares/error.middleware.js";
import { db } from "../config/db.config.js";
import { seats } from "../models/schema.js";
import { eq } from "drizzle-orm";
export const bookingController = {
  getAvailableSeats: asyncHandler(async (req, res) => {
    const date = new Date(req.query.date || new Date().toISOString());
    const seatData = await bookingService.getAvailableSeats(date);
    res.json({
      status: "success",
      data: {
        seats: seatData.seats,
        statistics: seatData.statistics,
      },
    });
  }),

  bookSeats: asyncHandler(async (req, res) => {
    const { num_seats, date } = req.body;

    if (!num_seats || !date) {
      throw new APIError(
        "Number of seats and date are required",
        400,
        "VALIDATION_ERROR"
      );
    }

    const numSeats = parseInt(num_seats);
    if (isNaN(numSeats) || numSeats < 1 || numSeats > 7) {
      throw new APIError(
        "Number of seats must be between 1 and 7",
        400,
        "INVALID_SEATS_NUMBER"
      );
    }

    const result = await bookingService.bookSeats(
      req.user.id,
      numSeats,
      new Date(date)
    );

    // Get updated seat availability
    const updatedSeatData = await bookingService.getAvailableSeats(
      new Date(date)
    );

    res.status(201).json({
      status: "success",
      message: result.message,
      data: {
        bookings: result.bookings,
        booked_seats: result.seats,
        updated_seat_status: updatedSeatData,
      },
    });
  }),

  getUserBookings: asyncHandler(async (req, res) => {
    const userBookings = await bookingService.getUserBookings(req.user.id);

    res.json({
      status: "success",
      data: {
        bookings: userBookings,
        total_bookings: userBookings.length,
      },
    });
  }),

  resetUserBookings: asyncHandler(async (req, res) => {
    const result = await bookingService.resetUserBookings(req.user.id);

    // If there were no active bookings, check if there are any seats that need resetting
    if (result.cancelledBookings.length === 0) {
      // Find any seats that might be stuck with is_booked = true
      const stuckSeats = await db
        .select()
        .from(seats)
        .where(eq(seats.is_booked, true));

      if (stuckSeats.length > 0) {
        // Reset these seats
        await db
          .update(seats)
          .set({ is_booked: false })
          .where(eq(seats.is_booked, true))
          .returning();

        return res.json({
          status: "success",
          message: "Reset stuck seats",
          data: {
            seats_reset: stuckSeats,
            total_reset: stuckSeats.length,
          },
        });
      }
    }

    res.json({
      status: "success",
      message: result.message,
      data: {
        cancelled_bookings: result.cancelledBookings,
        updated_seats: result.updatedSeats,
        total_cancelled: result.cancelledBookings.length,
      },
    });
  }),

  getBookingStatus: asyncHandler(async (req, res) => {
    const status = await bookingService.getBookingStatus(req.user.id);
    res.json({
      status: "success",
      data: status,
    });
  }),
};
