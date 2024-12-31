// src/lib/axios.ts

"use client";
import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { toast } from "react-hot-toast";

// Type for custom error handling
interface CustomAxiosError extends AxiosError {
  config: InternalAxiosRequestConfig & { _retry?: boolean };
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only try to get token if we're in the browser
    if (typeof window !== "undefined") {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: CustomAxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Only attempt localStorage operations in browser
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");

          // Show error message
          toast.error("Session expired. Please login again.");

          // Use router for navigation if available, fallback to window.location
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      } catch (error) {
        console.error("Error handling unauthorized request:", error);
      }
    }

    // Handle other common errors
    if (error.response?.status === 403) {
      toast.error(
        "Access denied. You do not have permission to perform this action."
      );
    }

    if (error.response?.status === 404) {
      toast.error("Resource not found.");
    }

    if (error.response?.status === 500) {
      toast.error("Server error. Please try again later.");
    }

    if (error.code === "ECONNABORTED") {
      toast.error("Request timed out. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

// Export type-safe instance
export type ApiInstance = typeof api;
export default api;

// Utility function to handle API errors
export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "An unexpected error occurred";
  }
  return "An unexpected error occurred";
};
