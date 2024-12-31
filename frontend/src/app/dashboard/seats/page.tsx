"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/store/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogOut, Train } from "lucide-react";
import axios from "axios";
import { ReservationForm } from "@/app/components/booking/ReservationForm";
import { SeatMap } from "@/app/components/booking/SeatMap";

interface BookingStats {
  total_seats: number;
  booked_seats: number;
  available_seats: number;
}

interface Seat {
  id: number;
  row_number: number;
  seat_number: number;
  is_booked: boolean;
}

export default function DashboardPage() {
  const { user, logout, token } = useAuth();
  const router = useRouter();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [stats, setStats] = useState(null);
  const [isReservationVisible, setIsReservationVisible] = useState(false);

  const fetchBookingStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/bookings/seats/available?date=${
          new Date().toISOString().split("T")[0]
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStats(response.data.data.statistics);
      setSeats(response.data.data.seats);
    } catch (error) {
      console.error("Failed to fetch booking status:", error);
    }
  };

  useEffect(() => {
    fetchBookingStatus();
    const intervalId = setInterval(fetchBookingStatus, 30000);
    return () => clearInterval(intervalId);
  }, [token]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `url('/train-interior.jpg')`,
          backgroundColor: "rgba(255,255,255,0.9)",
          backgroundBlendMode: "overlay",
        }}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center"
              >
                <Train size={36} className="text-primary mr-3" />
                <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                  Luxury Train
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-gray-600">{user?.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Mobile Reservation Toggle */}
        <div className="lg:hidden sticky top-[73px] z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <Button
              onClick={() => setIsReservationVisible(!isReservationVisible)}
              className="w-full"
              variant="outline"
            >
              {isReservationVisible
                ? "Hide Reservation Form"
                : "Show Reservation Form"}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Reservation Form - Fixed on desktop, expandable on mobile */}
            <motion.div
              className={`
                lg:w-[400px] lg:block
                ${isReservationVisible ? "block" : "hidden"}
              `}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="lg:sticky lg:top-[100px]">
                <ReservationForm
                  stats={stats}
                  onReservation={fetchBookingStatus}
                />
              </div>
            </motion.div>

            {/* Seat Map - Fills remaining space */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SeatMap seats={seats} />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
