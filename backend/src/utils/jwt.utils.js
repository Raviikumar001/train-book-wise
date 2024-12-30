import jwt from "jsonwebtoken";
import { logger } from "./logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use env variable in production

export const generateToken = (userId) => {
  try {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "24h" });
  } catch (error) {
    logger.error("Error generating token:", error);
    throw error;
  }
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    logger.error("Error verifying token:", error);
    throw error;
  }
};
