import express from "express";
import cors from "cors";
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
} from "./src/middlewares/error.middleware.js";
import { logger } from "./src/utils/logger.js";
import authRoutes from "./src/routes/auth.routes.js";
import bookingRoutes from "./src/routes/booking.routes.js";
import {
  db,
  checkDatabaseConnection,
  initializeSeats,
} from "./src/config/db.config.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/health", async (req, res) => {
  const isConnected = await checkDatabaseConnection();
  res.json({
    status: isConnected ? "OK" : "Error",
    database: isConnected ? "Connected" : "Not Connected",
  });
});

app.post("/test", (req, res) => {
  res.json({ message: "Test route working" });
});

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    if (!(await checkDatabaseConnection())) {
      throw new Error("Database connection failed");
    }

    await initializeSeats();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.success(`Server running on port ${PORT}`);
      logger.info("Environment:", process.env.NODE_ENV || "development");
    });
  } catch (error) {
    logger.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
