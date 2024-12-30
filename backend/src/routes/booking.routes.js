import express from "express";
import { bookingController } from "../controllers/booking.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/seats/available", bookingController.getAvailableSeats);
router.post("/book", bookingController.bookSeats);
router.get("/my-bookings", bookingController.getUserBookings);
router.post("/reset", bookingController.resetUserBookings);
router.get("/status", bookingController.getBookingStatus);

export default router;
