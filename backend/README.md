# Train Seat Booking System API

A RESTful API built with Node.js, MongoDB, and Drizzle ORM for managing train seat reservations.

## Features

### Authentication

- User registration with email and password
- JWT-based authentication
- Login/Logout functionality
- Demo account access (email: hello@gmail.com, password: qwertY123)

### Seat Management

- **Total Seats:** 80
- **Row Layout:** 12 rows (7 seats each, last row 3 seats)
- Seat status tracking (available/booked)
- Real-time seat availability updates

### Booking System

- Reserve multiple seats (max 7 seats per booking)
- View booking statistics
- Reset booking functionality

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

### Database Schema

#### User Model

```javascript
{
  username: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Seat Model

```javascript
{
  seatNumber: Number,
  isBooked: Boolean,
  bookedBy: ObjectId,
  bookingDate: Date
}
```

## Setup and Installation

### Clone the Repository

```bash
git clone https://github.com/Raviikumar001/train-book-wise.git
```

### Install Dependencies

```bash
cd backend
npm install
```

### Create Environment Variables

1. Create a `.env` file in the project root directory.
2. Add the following variables:

```env
PORT=4000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Drizzle ORM Setup

1. Generate the database schema:
   ```bash
   npx drizzle-kit generate:sql --output ./migrations
   ```
2. Push the migrations to the database:
   ```bash
   npx drizzle-kit push
   ```

### Start the Server

#### Development Mode

```bash
npm run dev
```

#### Production Mode

```bash
npm start
```

## Error Handling

- Custom error handling middleware
- Detailed error responses
- Proper HTTP status codes

## Security Features

- Password hashing
- JWT token validation

## Development Notes

### Dependencies

- `express`
- `mongoose`
- `jsonwebtoken`
- `bcryptjs`
- `cookie-parser`
- `cors`
- `dotenv`
- `drizzle-orm`

### Dev Dependencies

- `nodemon`

## Repository Link

[Train Seat Booking System API](https://github.com/Raviikumar001/train-book-wise.git)
