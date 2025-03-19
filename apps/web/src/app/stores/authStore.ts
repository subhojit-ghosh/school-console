import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AuthUser } from '../types/auth';

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
  }))
);
