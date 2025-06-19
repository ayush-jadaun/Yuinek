// src/store/authStore.ts

import { create } from "zustand";
import { IUser } from "@/models/User";

type UserState = Omit<IUser, "password_hash" | "addresses"> & { id: string };

interface AuthState {
  user: UserState | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserState | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to check for session
  setUser: (user) => {
    set({ user, isAuthenticated: !!user, isLoading: false });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
