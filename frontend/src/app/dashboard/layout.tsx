// src/app/dashboard/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/store/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  // Protect dashboard routes
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">
                  Train Booking
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard/seats"
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                           border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700"
                >
                  Book Seats
                </Link>
                <Link
                  href="/dashboard/bookings"
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium
                           border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700"
                >
                  My Bookings
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent
                         text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu - shown/hidden based on menu state */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard/seats"
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium
                     border-transparent hover:bg-gray-50 hover:border-gray-300 
                     text-gray-500 hover:text-gray-700"
            >
              Book Seats
            </Link>
            <Link
              href="/dashboard/bookings"
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium
                     border-transparent hover:bg-gray-50 hover:border-gray-300 
                     text-gray-500 hover:text-gray-700"
            >
              My Bookings
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
