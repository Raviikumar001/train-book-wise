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
        "http://localhost:4000/api/bookings/book",
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
        "http://localhost:4000/api/bookings/reset",
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
        {/* Stats Grid */}
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

// // src/components/ReservationForm.tsx
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { motion } from "framer-motion";
// import { Ticket, RefreshCcw } from "lucide-react";
// import { toast } from "react-hot-toast";
// import axios from "axios";
// import { useAuth } from "@/app/store/useAuth";

// interface ReservationFormProps {
//   stats: {
//     total_seats: number;
//     booked_seats: number;
//     available_seats: number;
//   };
//   onReservation: () => void;
// }

// export function ReservationForm({
//   stats,
//   onReservation,
// }: ReservationFormProps) {
//   const { token } = useAuth();
//   const [seatCount, setSeatCount] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isResetting, setIsResetting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const count = parseInt(seatCount);

//     if (!count || count < 1 || count > 7) {
//       toast.error("Please select between 1 and 7 seats");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const responnse = await axios.post(
//         "http://localhost:4000/api/bookings/book",
//         {
//           num_seats: count,
//           date: new Date().toISOString().split("T")[0],
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log(responnse, "response");
//       toast.success(`Reserved ${count} seats successfully!`);
//       setSeatCount("");
//       onReservation();
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to reserve seats");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleReset = async () => {
//     if (!confirm("Are you sure you want to reset your bookings?")) {
//       return;
//     }

//     setIsResetting(true);
//     try {
//       await axios.post(
//         "http://localhost:4000/api/bookings/reset",
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       toast.success("All bookings have been reset");
//       setSeatCount("");
//       onReservation();
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to reset bookings");
//     } finally {
//       setIsResetting(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -50 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.5 }}
//       className="w-full lg:w-[400px] md:w-[350px] sm:w-full sticky top-4"
//     >
//       <Card className="bg-white/90 backdrop-blur-sm">
//         <CardHeader>
//           <div className="flex items-center justify-center mb-4">
//             <Ticket size={48} className="text-primary" />
//           </div>
//           <CardTitle className="text-2xl font-bold text-center">
//             Reserve Your Seats
//           </CardTitle>
//           <CardDescription className="text-center">
//             Enter the number of seats (1-7) you wish to reserve
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {/* Booking Statistics */}
//           <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
//             <div className="bg-blue-50 p-2 rounded-lg">
//               <div className="text-base sm:text-lg font-semibold text-blue-600">
//                 {stats.total_seats}
//               </div>
//               <div className="text-xs text-gray-600">Total</div>
//             </div>
//             <div className="bg-green-50 p-2 rounded-lg">
//               <div className="text-base sm:text-lg font-semibold text-green-600">
//                 {stats.available_seats}
//               </div>
//               <div className="text-xs text-gray-600">Available</div>
//             </div>
//             <div className="bg-red-50 p-2 rounded-lg">
//               <div className="text-base sm:text-lg font-semibold text-red-600">
//                 {stats.booked_seats}
//               </div>
//               <div className="text-xs text-gray-600">Booked</div>
//             </div>
//           </div>

//           {/* Reservation Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Input
//                 type="number"
//                 placeholder="Number of seats (1-7)"
//                 min={1}
//                 max={7}
//                 value={seatCount}
//                 onChange={(e) => setSeatCount(e.target.value)}
//                 className="w-full"
//                 required
//               />
//               <p className="text-xs text-gray-500 text-center">
//                 You can reserve up to 7 seats at once
//               </p>
//             </div>

//             <div className="space-y-2 pt-2">
//               <Button
//                 type="submit"
//                 className="w-full bg-primary hover:bg-primary/90"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Reserving..." : "Reserve Seats"}
//               </Button>

//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full"
//                 onClick={handleReset}
//                 disabled={isResetting}
//               >
//                 <RefreshCcw className="mr-2 h-4 w-4" />
//                 {isResetting ? "Resetting..." : "Reset My Bookings"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>

//         <CardFooter className="flex flex-col space-y-2">
//           <p className="text-xs text-center text-gray-500">
//             Note: Booked seats cannot be modified after reservation
//           </p>
//         </CardFooter>
//       </Card>
//     </motion.div>
//   );
// }