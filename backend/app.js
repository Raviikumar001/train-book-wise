import express from "express";
import cors from "cors";
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
} from "./src/middlewares/error.middleware.js";
import { logger } from "./src/utils/logger.js";
import authRoutes from "./src/routes/auth.routes.js";
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

// Debug Database URL
console.log(
  "Database URL:",
  process.env.DATABASE_URL ? "Defined" : "Not defined"
);

// Routes - Define all routes BEFORE error handlers
app.use("/api/auth", authRoutes);

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

// Error handlers should be LAST
app.use(notFoundHandler); // Handle 404 errors
app.use(errorHandler); // Handle all other errors

const startServer = async () => {
  try {
    // Check database connection
    if (!(await checkDatabaseConnection())) {
      throw new Error("Database connection failed");
    }

    // Initialize seats
    await initializeSeats();

    // Start server
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

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// import express from "express";
// import cors from "cors";
// import {
//   errorHandler,
//   notFoundHandler,
//   requestLogger,
// } from "./src/middlewares/error.middleware.js";
// import { logger } from "./src/utils/logger.js";
// import authRoutes from "./src/routes/auth.routes.js";
// import {
//   db,
//   checkDatabaseConnection,
//   initializeSeats,
// } from "./src/config/db.config.js";
// import dotenv from "dotenv";
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(requestLogger);

// // Health check endpoint
// app.get("/health", async (req, res) => {
//   const isConnected = await checkDatabaseConnection();
//   res.json({
//     status: isConnected ? "OK" : "Error",
//     database: isConnected ? "Connected" : "Not Connected",
//   });
// });

// const PORT = process.env.PORT || 3000;
// // Add this at the top of app.js after dotenv.config()
// console.log(
//   "Database URL:",
//   process.env.DATABASE_URL ? "Defined" : "Not defined"
// );
// // Start server

// // Error handling
// app.use(notFoundHandler); // Handle 404 errors
// app.use(errorHandler); // Handle all other errors

// app.use("/api/auth", authRoutes);

// app.post("/test", (req, res) => {
//   res.json({ message: "Test route working" });
// });

// const startServer = async () => {
//   try {
//     // Check database connection
//     if (!(await checkDatabaseConnection())) {
//       throw new Error("Database connection failed");
//     }

//     // Initialize seats
//     await initializeSeats();

//     // Start server
//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//       logger.success(`Server running on port ${PORT}`);
//       logger.info("Environment:", process.env.NODE_ENV || "development");
//     });
//   } catch (error) {
//     logger.error("Server startup failed:", error);
//     process.exit(1);
//   }
// };

// startServer();

// // Handle uncaught exceptions
// process.on("uncaughtException", (error) => {
//   logger.error("Uncaught Exception:", error);
//   process.exit(1);
// });

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (reason, promise) => {
//   logger.error("Unhandled Rejection at:", promise, "reason:", reason);
//   process.exit(1);
// });
