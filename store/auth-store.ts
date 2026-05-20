import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useSettingsStore } from "@/store/settings-store";

type AuthState = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,

      login: (username, password) => {
        const { username: storedUsername, password: storedPassword, recordLogin } =
          useSettingsStore.getState();

        if (username !== storedUsername || password !== storedPassword) {
          return false;
        }

        recordLogin();
        set({ isAuthenticated: true });
        return true;
      },

      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: "employee-dashboard-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    },
  ),
);
