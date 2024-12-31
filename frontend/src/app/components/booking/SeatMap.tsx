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

export function SeatMap({ seats }: SeatMapProps) {
  // Sort seats by id to ensure proper ordering
  const sortedSeats = [...seats].sort((a, b) => a.id - b.id);

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
              {Array.from({ length: 12 }, (_, i) => i + 1).map((rowNumber) =>
                renderRow(rowNumber)
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
          <p>
            Total Seats: 80 | Row Layout: 12 rows (7 seats each, last row 3
            seats)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default SeatMap;

// // src/components/SeatMap.tsx
// "use client";

// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";

// interface Seat {
//   id: number;
//   row_number: number;
//   seat_number: number;
//   is_booked: boolean;
// }

// interface SeatMapProps {
//   seats: Seat[];
// }

// export function SeatMap({ seats }: SeatMapProps) {
//   // Sort seats by id to ensure proper ordering
//   const sortedSeats = [...seats].sort((a, b) => a.id - b.id);

//   const renderSeat = (seat: Seat) => (
//     <motion.div
//       key={seat.id}
//       whileHover={{ scale: 1.1 }}
//       whileTap={{ scale: 0.9 }}
//       className="relative"
//     >
//       <Button
//         className={`
//           w-12 h-12 m-1 rounded-full text-sm font-medium transition-all duration-200
//           ${
//             seat.is_booked
//               ? "bg-red-500 hover:bg-red-600 text-white cursor-not-allowed"
//               : "bg-primary hover:bg-primary/90 text-white"
//           }
//         `}
//         disabled={seat.is_booked}
//       >
//         {seat.id} {/* Using id instead of seat_number */}
//       </Button>
//     </motion.div>
//   );

//   const renderRow = (rowNumber: number) => {
//     const rowSeats = sortedSeats.filter(
//       (seat) => seat.row_number === rowNumber
//     );
//     return (
//       <div key={rowNumber} className="flex justify-center gap-2">
//         <div className="w-8 flex items-center justify-center">
//           <span className="text-sm font-medium text-gray-500">
//             R{rowNumber}
//           </span>
//         </div>
//         {rowSeats.map(renderSeat)}
//       </div>
//     );
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ duration: 0.5 }}
//       className="w-full"
//     >
//       <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
//         <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
//           Select Your Seats
//         </h2>

//         {/* Legend */}
//         <div className="flex justify-center gap-4 mb-6">
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 rounded-full bg-primary" />
//             <span className="text-sm text-gray-600">Available</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-4 h-4 rounded-full bg-red-500" />
//             <span className="text-sm text-gray-600">Booked</span>
//           </div>
//         </div>

//         {/* Seat Grid */}
//         <div className="border-2 border-primary/20 rounded-lg p-6 bg-gray-50/50">
//           <div className="space-y-4">
//             {/* Front of train indicator */}
//             <div className="text-center mb-8">
//               <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg">
//                 <span className="text-sm font-medium text-primary">
//                   Front of Train
//                 </span>
//               </div>
//             </div>

//             {/* Seat rows */}
//             <div className="space-y-4">
//               {Array.from({ length: 12 }, (_, i) => i + 1).map((rowNumber) =>
//                 renderRow(rowNumber)
//               )}
//             </div>

//             {/* Back of train indicator */}
//             <div className="text-center mt-8">
//               <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg">
//                 <span className="text-sm font-medium text-primary">
//                   Back of Train
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Additional info */}
//         <div className="mt-6 text-center text-sm text-gray-600">
//           <p>
//             Total Seats: 80 | Row Layout: 12 rows (7 seats each, last row 3
//             seats)
//           </p>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// // // src/components/SeatMap.tsx
// // "use client";

// // import { useState, useCallback } from "react";
// // import { Button } from "@/components/ui/button";
// // import { motion } from "framer-motion";
// // import { useAuth } from "@/app/store/useAuth";
// // import { toast } from "react-hot-toast";

// // interface Seat {
// //   id: number;
// //   isBooked: boolean;
// //   userId: string | null;
// // }

// // interface SeatMapProps {
// //   selectedSeats: number[];
// //   onSeatSelect: (seats: number[]) => void;
// //   onSeatUpdate: () => void;
// // }

// // // Memoized individual seat component
// // const SeatButton = ({
// //   seat,
// //   isSelected,
// //   isUserSeat,
// //   onClick,
// // }: {
// //   seat: Seat;
// //   isSelected: boolean;
// //   isUserSeat: boolean;
// //   onClick: () => void;
// // }) => (
// //   <motion.div
// //     whileHover={{ scale: 1.1 }}
// //     whileTap={{ scale: 0.9 }}
// //     className="relative"
// //   >
// //     <Button
// //       onClick={onClick}
// //       className={`
// //         w-12 h-12 m-1 rounded-full text-sm font-medium transition-all duration-200
// //         ${
// //           seat.isBooked
// //             ? isUserSeat
// //               ? "bg-green-500 hover:bg-green-600 text-white"
// //               : "bg-red-500 hover:bg-red-600 text-white cursor-not-allowed"
// //             : isSelected
// //             ? "bg-blue-500 hover:bg-blue-600 text-white"
// //             : "bg-primary hover:bg-primary/90 text-white"
// //         }
// //       `}
// //       disabled={seat.isBooked && !isUserSeat}
// //     >
// //       {seat.id}
// //     </Button>
// //     {(isUserSeat || isSelected) && (
// //       <motion.div
// //         initial={{ scale: 0 }}
// //         animate={{ scale: 1 }}
// //         className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white"
// //       />
// //     )}
// //   </motion.div>
// // );

// // export function SeatMap({
// //   selectedSeats,
// //   onSeatSelect,
// //   onSeatUpdate,
// // }: SeatMapProps) {
// //   const { user } = useAuth();
// //   const [seats, setSeats] = useState<Seat[]>(
// //     Array.from({ length: 80 }, (_, index) => ({
// //       id: index + 1,
// //       isBooked: false,
// //       userId: null,
// //     }))
// //   );

// //   const handleSeatClick = useCallback(
// //     (seatId: number) => {
// //       const seat = seats.find((s) => s.id === seatId);
// //       if (!seat || (seat.isBooked && seat.userId !== user?.id)) {
// //         return;
// //       }

// //       if (selectedSeats.includes(seatId)) {
// //         onSeatSelect(selectedSeats.filter((id) => id !== seatId));
// //       } else if (selectedSeats.length < 7) {
// //         onSeatSelect([...selectedSeats, seatId]);
// //       } else {
// //         toast.error("You can only select up to 7 seats at a time");
// //       }
// //     },
// //     [seats, selectedSeats, user?.id, onSeatSelect]
// //   );

// //   const renderRow = (start: number, end: number) => (
// //     <div className="flex justify-center gap-2" key={start}>
// //       {seats.slice(start, end).map((seat) => (
// //         <SeatButton
// //           key={seat.id}
// //           seat={seat}
// //           isSelected={selectedSeats.includes(seat.id)}
// //           isUserSeat={seat.userId === user?.id}
// //           onClick={() => handleSeatClick(seat.id)}
// //         />
// //       ))}
// //     </div>
// //   );

// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, scale: 0.9 }}
// //       animate={{ opacity: 1, scale: 1 }}
// //       transition={{ duration: 0.5 }}
// //       className="w-full"
// //     >
// //       <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
// //         <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
// //           Select Your Seats
// //         </h2>

// //         {/* Legend */}
// //         <div className="flex justify-center gap-4 mb-6">
// //           <div className="flex items-center gap-2">
// //             <div className="w-4 h-4 rounded-full bg-primary" />
// //             <span className="text-sm text-gray-600">Available</span>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <div className="w-4 h-4 rounded-full bg-green-500" />
// //             <span className="text-sm text-gray-600">Your Booking</span>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <div className="w-4 h-4 rounded-full bg-red-500" />
// //             <span className="text-sm text-gray-600">Booked</span>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <div className="w-4 h-4 rounded-full bg-blue-500" />
// //             <span className="text-sm text-gray-600">Selected</span>
// //           </div>
// //         </div>

// //         {/* Seat Grid */}
// //         <div className="border-2 border-primary/20 rounded-lg p-6 bg-gray-50/50">
// //           <div className="space-y-4">
// //             {/* Front of train indicator */}
// //             <div className="text-center mb-8">
// //               <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg">
// //                 <span className="text-sm font-medium text-primary">
// //                   Front of Train
// //                 </span>
// //               </div>
// //             </div>

// //             {/* Seat rows */}
// //             <div className="space-y-4">
// //               {Array.from({ length: 11 }).map((_, index) => (
// //                 <div key={index} className="flex justify-center">
// //                   {index === 10
// //                     ? renderRow(77, 80) // Last row with 3 seats
// //                     : renderRow(index * 7, (index + 1) * 7)}
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Back of train indicator */}
// //             <div className="text-center mt-8">
// //               <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg">
// //                 <span className="text-sm font-medium text-primary">
// //                   Back of Train
// //                 </span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Selected seats summary */}
// //         {selectedSeats.length > 0 && (
// //           <div className="mt-6 p-4 bg-blue-50 rounded-lg">
// //             <p className="text-center text-sm text-blue-600">
// //               Selected seats: {selectedSeats.sort((a, b) => a - b).join(", ")}
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //     </motion.div>
// //   );
// // }

// // export default SeatMap;
