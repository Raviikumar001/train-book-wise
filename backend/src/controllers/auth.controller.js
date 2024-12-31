import { authService } from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../validators/auth.validation.js";
import { asyncHandler } from "../middlewares/error.middleware.js";
import { logger } from "../utils/logger.js";
import { APIError } from "../middlewares/error.middleware.js";

export const authController = {
  register: asyncHandler(async (req, res) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new APIError(
        "Validation failed",
        400,
        "VALIDATION_ERROR",
        errorMessages
      );
    }

    const result = await authService.register(req.body);

    logger.success("User registered successfully");
    res.status(201).json({
      status: "success",
      message: "Registration successful!",
      data: result,
    });
  }),

  login: asyncHandler(async (req, res) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new APIError(
        "Validation failed",
        400,
        "VALIDATION_ERROR",
        errorMessages
      );
    }

    const result = await authService.login(req.body.email, req.body.password);

    logger.success("User logged in successfully");
    res.json({
      status: "success",
      message: "Login successful!",
      data: result,
    });
  }),
};
