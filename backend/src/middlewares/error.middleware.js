import { logger } from "../utils/logger.js";

// Custom error class for API errors
export class APIError extends Error {
  constructor(message, status = 500, code = "INTERNAL_SERVER_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error("Error occurred:", err);

  // Default error values
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";
  let code = err.code || "INTERNAL_SERVER_ERROR";
  let errors = err.errors || null;

  // Handle different types of errors
  if (err.name === "ValidationError") {
    status = 400;
    code = "VALIDATION_ERROR";
    errors = err.errors;
  } else if (err.name === "UnauthorizedError") {
    status = 401;
    code = "UNAUTHORIZED";
  } else if (err.name === "DatabaseError") {
    status = 503;
    code = "DATABASE_ERROR";
    // Don't expose database errors in production
    message =
      process.env.NODE_ENV === "production"
        ? "Database operation failed"
        : err.message;
  }

  // Create error response
  const errorResponse = {
    status: "error",
    code,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      detail: err.detail || null,
    }),
  };

  // Send error response
  res.status(status).json(errorResponse);
};

// Not Found middleware
export const notFoundHandler = (req, res, next) => {
  const err = new APIError("Resource not found", 404, "NOT_FOUND");
  next(err);
};

// Async handler wrapper
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Request logger middleware
export const requestLogger = (req, res, next) => {
  logger.request(req);
  next();
};
