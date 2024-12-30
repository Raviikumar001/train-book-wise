import bcrypt from "bcryptjs";
import { db } from "../config/db.config.js";
import { users } from "../models/schema.js";
import { generateToken } from "../utils/jwt.utils.js";
import { eq } from "drizzle-orm";
import { APIError } from "../middlewares/error.middleware.js";
import { logger } from "../utils/logger.js";

export const authService = {
  async register(userData) {
    try {
      // Check if user exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email))
        .limit(1);

      if (existingUser.length > 0) {
        throw new APIError(
          "This email is already registered. Please try logging in or use a different email.",
          400,
          "EMAIL_EXISTS"
        );
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
        })
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
        });

      // Generate token
      const token = generateToken(newUser.id);

      return {
        user: newUser,
        token,
      };
    } catch (error) {
      logger.error("Registration error:", error);
      if (error instanceof APIError) throw error;
      throw new APIError(
        "Unable to complete registration. Please try again later.",
        500,
        "REGISTRATION_FAILED"
      );
    }
  },

  async login(email, password) {
    try {
      // Find user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        throw new APIError(
          "No account found with this email. Please check your email or register.",
          401,
          "USER_NOT_FOUND"
        );
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new APIError(
          "Incorrect password. Please try again.",
          401,
          "INVALID_PASSWORD"
        );
      }

      // Generate token
      const token = generateToken(user.id);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      };
    } catch (error) {
      logger.error("Login error:", error);
      if (error instanceof APIError) throw error;
      throw new APIError(
        "Unable to complete login. Please try again later.",
        500,
        "LOGIN_FAILED"
      );
    }
  },
};
