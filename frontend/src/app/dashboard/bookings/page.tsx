// src/app/dashboard/bookings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "@/app/lib/axios";

interface Booking {
  id: number;
  seats: {
    id: number;
    seatNumber: string;
    price: number;
  }[];
  totalAmount: number;
  bookingDate: string;
  status: "CONFIRMED" | "CANCELLED";
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/my-bookings");
      setBookings(response.data);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };
  // Format date using native JavaScript
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await api.post(`http://localhost:4000/api/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled successfully");
      fetchBookings(); // Refresh bookings list
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No Bookings Found
          </h2>
          <p className="text-gray-500 mt-2">
            You haven't made any bookings yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Booking #{booking.id}</h3>
                <p className="text-sm text-gray-500">
                  Booked on: {formatDate(booking.bookingDate)}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium
                  ${
                    booking.status === "CONFIRMED"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
              >
                {booking.status}
              </span>
            </div>

            {/* Seats Details */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Seats Booked
              </h4>
              <div className="flex flex-wrap gap-2">
                {booking.seats.map((seat) => (
                  <div
                    key={seat.id}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm"
                  >
                    Seat {seat.seatNumber} - ${seat.price}
                  </div>
                ))}
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center border-t pt-4">
              <div className="text-gray-700">
                Total Amount:{" "}
                <span className="font-semibold">${booking.totalAmount}</span>
              </div>

              {booking.status === "CONFIRMED" && (
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 
                           rounded-lg transition-colors duration-200"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
