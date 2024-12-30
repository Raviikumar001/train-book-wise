import express from "express";
import { bookingController } from "../controllers/booking.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateUser); // Changed from authMiddleware

// Get available seats
router.get("/seats/available", bookingController.getAvailableSeats);

// Book a seat
router.post("/book", bookingController.bookSeat);

// Get user's bookings
router.get("/my-bookings", bookingController.getUserBookings);

// Cancel booking
router.put("/cancel/:id", bookingController.cancelBooking);

export default router;
