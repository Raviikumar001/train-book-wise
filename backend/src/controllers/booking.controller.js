import { bookingService } from "../services/booking.service.js";
import { asyncHandler } from "../middlewares/error.middleware.js";
import { APIError } from "../middlewares/error.middleware.js";

export const bookingController = {
  getAvailableSeats: asyncHandler(async (req, res) => {
    const date = new Date(req.query.date || new Date());
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
    const bookings = await bookingService.getUserBookings(req.user.id);
    res.json({
      status: "success",
      data: bookings,
    });
  }),

  resetUserBookings: asyncHandler(async (req, res) => {
    const bookings = await bookingService.resetUserBookings(req.user.id);
    res.json({
      status: "success",
      message: "All bookings have been reset",
      data: bookings,
    });
  }),
};
