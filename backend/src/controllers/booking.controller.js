import { bookingService } from '../services/booking.service.js';
import { asyncHandler } from '../middlewares/error.middleware.js';
import { APIError } from '../middlewares/error.middleware.js';

export const bookingController = {
  getAvailableSeats: asyncHandler(async (req, res) => {
    const date = new Date(req.query.date || new Date());
    const seats = await bookingService.getAvailableSeats(date);
    res.json({ status: 'success', data: seats });
  }),

  bookSeat: asyncHandler(async (req, res) => {
    const { seat_id, date } = req.body;
    if (!seat_id || !date) {
      throw new APIError('Seat ID and date are required', 400, 'VALIDATION_ERROR');
    }

    const booking = await bookingService.bookSeat(
      req.user.id,
      seat_id,
      new Date(date)
    );
    res.status(201).json({
      status: 'success',
      message: 'Seat booked successfully',
      data: booking
    });
  }),

  getUserBookings: asyncHandler(async (req, res) => {
    const bookings = await bookingService.getUserBookings(req.user.id);
    res.json({ status: 'success', data: bookings });
  }),

  cancelBooking: asyncHandler(async (req, res) => {
    const booking = await bookingService.cancelBooking(
      req.user.id,
      parseInt(req.params.id)
    );
    res.json({
      status: 'success',
      message: 'Booking cancelled successfully',
      data: booking
    });
  })
};