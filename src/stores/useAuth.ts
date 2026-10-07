import type { Role } from "@/types/user";
import { persist } from "zustand/middleware";
import { create } from "zustand";

interface UserAuth {
  id: number;
  name: string;
  email: string;
  role: Role;
  picture: string | null;
  referralCode: string;
  accessToken: string;
}

type Store = {
  user: UserAuth | null;
  login: (user: UserAuth) => void;
  logout: () => void;
};

export const useAuth = create<Store>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: "auth" },
  ),
);
