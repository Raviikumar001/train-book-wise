// src/app/layout.tsx
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Train Booking System",
  description: "Book your train seats easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-center" />
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}
