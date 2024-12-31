// src/app/dashboard/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/store/useAuth";
import { Button } from "@/components/ui/button";
import { Train, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* //   <header className="bg-card shadow">
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //       <div className="flex justify-between items-center py-4">
    //         <div className="flex items-center">
    //           <Train className="h-8 w-8 text-primary" />
    //           <h1 className="ml-2 text-2xl font-bold text-primary">
    //             Luxury Train
    //           </h1>
    //         </div> */}
      {/* <nav className="hidden md:flex space-x-4">
              <Link
                href="/dashboard/seats"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Book Seats
              </Link>
              <Link
                href="/dashboard/bookings"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                My Bookings
              </Link>
            </nav> */}
      {/* <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div> */}

      {/* Mobile menu
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard/seats"
              className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
            >
              Book Seats
            </Link>
            <Link
              href="/dashboard/bookings"
              className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
            >
              My Bookings
            </Link>
          </div>
        </div> */}
      {/* </header> */}

      {children}
    </div>
  );
}
