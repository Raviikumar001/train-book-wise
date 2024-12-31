"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Train } from "lucide-react";

interface Seat {
  id: number;
  row_number: number;
  seat_number: number;
  is_booked: boolean;
}

interface SeatMapProps {
  seats: Seat[];
}

// Shimmer Effect Component
const ShimmerSeat = () => (
  <div className="animate-pulse">
    <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 m-0.5 md:m-1 rounded-lg bg-gray-200" />
  </div>
);

const ShimmerRow = () => (
  <div className="flex items-center justify-center gap-1 md:gap-2">
    <div className="w-6 md:w-8 flex items-center justify-center">
      <div className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
    </div>
    <div className="flex gap-0.5 md:gap-2">
      {[...Array(7)].map((_, index) => (
        <ShimmerSeat key={index} />
      ))}
    </div>
  </div>
);

export function SeatMap({ seats }: SeatMapProps) {
  // Sort seats by id to ensure proper ordering
  const sortedSeats = seats?.length
    ? [...seats].sort((a, b) => a.id - b.id)
    : [];
  const isLoading = !seats || seats.length === 0;

  const renderSeat = (seat: Seat) => (
    <motion.div
      key={seat.id}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Button
        className={`
          w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 
          m-0.5 md:m-1 rounded-lg text-xs md:text-sm 
          transition-all duration-200
          ${
            seat.is_booked
              ? "bg-red-500 hover:bg-red-600 text-white cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-white"
          }
        `}
        disabled={seat.is_booked}
      >
        {seat.id}
      </Button>
    </motion.div>
  );

  const renderRow = (rowNumber: number) => {
    const rowSeats = sortedSeats.filter(
      (seat) => seat.row_number === rowNumber
    );
    return (
      <div
        key={rowNumber}
        className="flex items-center justify-center gap-1 md:gap-2"
      >
        <div className="w-6 md:w-8 flex items-center justify-center">
          <span className="text-xs md:text-sm font-medium text-gray-500">
            R{rowNumber}
          </span>
        </div>
        <div className="flex gap-0.5 md:gap-2">{rowSeats.map(renderSeat)}</div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl text-center flex items-center justify-center gap-2">
          <Train className="w-5 h-5 md:w-6 md:h-6" />
          Select Your Seats
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mb-4 px-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-primary" />
            <span className="text-xs md:text-sm text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-red-500" />
            <span className="text-xs md:text-sm text-gray-600">Booked</span>
          </div>
        </div>

        {/* Seat Grid */}
        <div className="border-2 border-primary/20 rounded-lg p-2 md:p-4 lg:p-6 bg-gray-50/50">
          <div className="space-y-2 md:space-y-3">
            {/* Front of train indicator */}
            <div className="text-center mb-4">
              <div className="inline-block px-3 py-1 md:px-4 md:py-2 bg-primary/10 rounded">
                <span className="text-xs md:text-sm font-medium text-primary">
                  Front of Train
                </span>
              </div>
            </div>

            {/* Seat rows */}
            <div className="space-y-2 md:space-y-3">
              {isLoading ? (
                // Shimmer Loading Effect
                <div className="space-y-2 md:space-y-3">
                  {[...Array(12)].map((_, index) => (
                    <ShimmerRow key={index} />
                  ))}
                </div>
              ) : (
                // Actual Seats
                Array.from({ length: 12 }, (_, i) => i + 1).map((rowNumber) =>
                  renderRow(rowNumber)
                )
              )}
            </div>

            {/* Back of train indicator */}
            <div className="text-center mt-4">
              <div className="inline-block px-3 py-1 md:px-4 md:py-2 bg-primary/10 rounded">
                <span className="text-xs md:text-sm font-medium text-primary">
                  Back of Train
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-4 text-center text-xs md:text-sm text-gray-600">
          {isLoading ? (
            <div className="h-4 w-64 mx-auto bg-gray-200 rounded animate-pulse" />
          ) : (
            <p>
              Total Seats: 80 | Row Layout: 12 rows (7 seats each, last row 3
              seats)
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default SeatMap;
