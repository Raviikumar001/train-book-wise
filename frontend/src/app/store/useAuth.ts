// store/useAuth.ts
"use client";
import { create } from "zustand";
import Cookies from "js-cookie";
import axios from "axios";

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: Cookies.get("token") || null,
  user: null,
  isAuthenticated: !!Cookies.get("token"),

  setToken: (token: string) => {
    Cookies.set("token", token, { expires: 7 });
    set({ token, isAuthenticated: true });
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      const { token, user } = response.data.data;

      Cookies.set("token", token, { expires: 7 });

      set({
        token,
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email,
          password,
        }
      );
      const { token, user } = response.data.data;

      Cookies.set("token", token, { expires: 7 });

      set({
        token,
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
