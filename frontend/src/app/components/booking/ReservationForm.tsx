"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Ticket, RefreshCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@/app/store/useAuth";

interface ReservationFormProps {
  stats: {
    total_seats: number;
    booked_seats: number;
    available_seats: number;
  };
  onReservation: () => void;
}

const ShimmerStats = () => (
  <div className="grid grid-cols-3 gap-2">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className={`
        p-2 rounded-lg text-center
        ${
          index === 0
            ? "bg-blue-50/50"
            : index === 1
            ? "bg-green-50/50"
            : "bg-red-50/50"
        }
      `}
      >
        <div className="h-5 w-12 mx-auto mb-1 rounded bg-gray-200 animate-pulse" />
        <div className="h-3 w-10 mx-auto rounded bg-gray-200 animate-pulse" />
      </div>
    ))}
  </div>
);

export function ReservationForm({
  stats,
  onReservation,
}: ReservationFormProps) {
  const { token } = useAuth();
  const [seatCount, setSeatCount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(seatCount);

    if (!count || count < 1 || count > 7) {
      toast.error("Please select between 1 and 7 seats");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings/book`,
        {
          num_seats: count,
          date: new Date().toISOString().split("T")[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Reserved ${count} seats successfully!`);
      setSeatCount("");
      onReservation();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reserve seats");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset your bookings?")) {
      return;
    }

    setIsResetting(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings/reset`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("All bookings have been reset");
      setSeatCount("");
      onReservation();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset bookings");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <Ticket className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl text-center">
          Reserve Your Seats
        </CardTitle>
        <CardDescription className="text-center">
          Enter the number of seats (1-7) you wish to reserve
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Grid with Shimmer Loading */}
        {!stats ? (
          <ShimmerStats />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 p-2 rounded-lg text-center">
              <div className="text-sm font-semibold text-blue-600">
                {stats.total_seats}
              </div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="bg-green-50 p-2 rounded-lg text-center">
              <div className="text-sm font-semibold text-green-600">
                {stats.available_seats}
              </div>
              <div className="text-xs text-gray-600">Available</div>
            </div>
            <div className="bg-red-50 p-2 rounded-lg text-center">
              <div className="text-sm font-semibold text-red-600">
                {stats.booked_seats}
              </div>
              <div className="text-xs text-gray-600">Booked</div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Number of seats"
              min={1}
              max={7}
              value={seatCount}
              onChange={(e) => setSeatCount(e.target.value)}
              className="w-full"
              required
            />
            <p className="text-xs text-gray-500 text-center">
              Maximum 7 seats per booking
            </p>
          </div>

          <div className="space-y-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Reserving..." : "Reserve Seats"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleReset}
              disabled={isResetting}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              {isResetting ? "Resetting..." : "Reset Bookings"}
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-xs text-center text-gray-500 w-full">
          Booked seats cannot be modified after reservation
        </p>
      </CardFooter>
    </Card>
  );
}
