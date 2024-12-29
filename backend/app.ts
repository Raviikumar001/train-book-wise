import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase, disconnectFromDatabase, db } from "./src/db";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", async (req, res) => {
  try {
    const isConnected = await connectToDatabase();
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      database: isConnected ? "connected" : "disconnected",
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Failed to check database connection",
    });
  }
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Ensure database connection before starting server
    const isConnected = await connectToDatabase();
    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

    // Handle graceful shutdown
    const shutdown = async () => {
      console.log("Shutting down server...");
      await disconnectFromDatabase();
      process.exit(0);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
