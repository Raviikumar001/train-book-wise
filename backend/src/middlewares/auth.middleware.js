import jwt from "jsonwebtoken";
import { db } from "../config/db.config.js";
import { users } from "../models/schema.js";
import { eq } from "drizzle-orm";
import { logger } from "../utils/logger.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        code: "AUTH_REQUIRED",
        message: "Authentication token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [user] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(eq(users.id, decoded.id))
        .limit(1);

      if (!user) {
        return res.status(401).json({
          status: "error",
          code: "USER_NOT_FOUND",
          message: "User no longer exists",
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      logger.error("JWT Verification failed:", jwtError);

      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "error",
          code: "TOKEN_EXPIRED",
          message: "Authentication token has expired",
        });
      }

      return res.status(401).json({
        status: "error",
        code: "INVALID_TOKEN",
        message: "Invalid authentication token",
      });
    }
  } catch (error) {
    logger.error("Authentication error:", error);
    return res.status(500).json({
      status: "error",
      code: "AUTH_ERROR",
      message: "Authentication failed",
    });
  }
};
