// src/app/dashboard/seats/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "@/app/lib/axios";

// Types
interface Seat {
  id: number;
  seatNumber: string;
  isBooked: boolean;
  price: number;
  row: number;
  column: number;
}

export default function SeatsPage() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Fetch seats data
  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await api.get("http://localhost:4000/api/seats");
      setSeats(response.data);
    } catch (error) {
      toast.error("Failed to load seats");
    } finally {
      setLoading(false);
    }
  };

  // Handle seat selection
  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked) return;

    setSelectedSeats((prev) => {
      const isSelected = prev.includes(seat.id);
      const updated = isSelected
        ? prev.filter((id) => id !== seat.id)
        : [...prev, seat.id];

      // Update total price
      const newTotalPrice = updated.reduce((sum, seatId) => {
        const seat = seats.find((s) => s.id === seatId);
        return sum + (seat?.price || 0);
      }, 0);
      setTotalPrice(newTotalPrice);

      return updated;
    });
  };

  // Handle booking submission
  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    try {
      await api.post("http://localhost:4000/api/bookings", {
        seatIds: selectedSeats,
      });

      toast.success("Booking successful!");
      setSelectedSeats([]);
      setTotalPrice(0);
      fetchSeats(); // Refresh seats data
    } catch (error) {
      toast.error("Booking failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Select Your Seats</h1>

        {/* Legend */}
        <div className="flex gap-6 mb-6">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white border-2 border-blue-500 rounded mr-2" />
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-300 rounded mr-2" />
            <span>Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded mr-2" />
            <span>Selected</span>
          </div>
        </div>

        {/* Seats Grid */}
        <div className="grid grid-cols-8 gap-2 mb-8">
          {seats.map((seat) => (
            <button
              key={seat.id}
              onClick={() => handleSeatClick(seat)}
              disabled={seat.isBooked}
              className={`
                w-12 h-12 rounded-lg flex items-center justify-center text-sm font-semibold
                transition-all duration-200
                ${
                  seat.isBooked
                    ? "bg-gray-300 cursor-not-allowed"
                    : selectedSeats.includes(seat.id)
                    ? "bg-green-500 text-white"
                    : "bg-white border-2 border-blue-500 hover:bg-blue-50"
                }
              `}
            >
              {seat.seatNumber}
            </button>
          ))}
        </div>

        {/* Booking Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-600">
                Selected Seats: {selectedSeats.length}
              </p>
              <p className="text-gray-600">Total Price: ${totalPrice}</p>
            </div>
            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                       disabled:bg-gray-300 disabled:cursor-not-allowed
                       transition-colors duration-200"
            >
              Book Selected Seats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
