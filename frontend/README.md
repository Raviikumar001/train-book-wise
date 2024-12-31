# Train Ticket Booking System - Frontend Documentation

## Project Overview

A modern train ticket booking system built with Next.js 13, featuring user authentication, seat selection, and real-time booking management.

## Tech Stack

- **Framework:** Next.js 13 (App Router)
- **Language:** TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS + ShadcnUI
- **Authentication:** JWT with Cookie Storage
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **UI Components:**
  - Radix UI (via ShadcnUI)
  - Lucide Icons
- **Toast Notifications:** React Hot Toast

## Key Features

- User Authentication (Login/Register)
- Interactive Seat Selection
- Real-time Booking Management
- Responsive Design
- Loading States & Animations
- Demo Account Access
- Toast Notifications

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Raviikumar001/train-book-wise.git
   cd train-book-wise
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Add the required variables:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).
