// store/useAuth.ts
import { create } from "zustand";
import Cookies from "js-cookie";
import axios from "axios";

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: Cookies.get("token") || null,
  user: null,
  isAuthenticated: !!Cookies.get("token"),

  setToken: (token: string) => {
    Cookies.set("token", token, { expires: 7 }); // Token expires in 7 days
    set({ token, isAuthenticated: true });
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

      const { token, user } = response.data;

      // Store token in cookie
      Cookies.set("token", token, { expires: 7 });

      // Update state
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
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
