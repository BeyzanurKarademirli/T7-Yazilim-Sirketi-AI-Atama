import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "system" | "light" | "dark";
export type FontSize = "sm" | "md" | "lg";
export type RoleName = "Admin" | "Manager" | "Employee";

export const DEFAULT_USERNAME = "admin";
export const DEFAULT_PASSWORD = "admin1234";

export type SettingsState = {
  // Credentials (login)
  username: string;
  password: string;

  // User settings
  profileName: string;
  profileEmail: string;
  profileImageDataUrl: string | null;
  notifyEmail: boolean;
  notifyToast: boolean;

  // Appearance
  theme: ThemeMode;
  fontSize: FontSize;
  sidebarCollapsed: boolean;

  // System
  enabledRoles: RoleName[];
  cardsVisibility: {
    totalEmployees: boolean;
    totalSalary: boolean;
    departments: boolean;
    averageSalary: boolean;
  };

  // Security
  twoFactorEnabled: boolean;
  lastLoginAt: string; // ISO

  // Actions
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setProfile: (patch: Partial<Pick<SettingsState, "profileName" | "profileEmail" | "profileImageDataUrl">>) => void;
  setNotify: (patch: Partial<Pick<SettingsState, "notifyEmail" | "notifyToast">>) => void;
  recordLogin: () => void;
  setAppearance: (patch: Partial<Pick<SettingsState, "theme" | "fontSize" | "sidebarCollapsed">>) => void;
  setEnabledRoles: (roles: RoleName[]) => void;
  setCardVisibility: (key: keyof SettingsState["cardsVisibility"], value: boolean) => void;
  setTwoFactorEnabled: (value: boolean) => void;
  logoutAllDevices: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
  username: DEFAULT_USERNAME,
  password: DEFAULT_PASSWORD,

  profileName: "Admin User",
  profileEmail: "admin@company.com",
  profileImageDataUrl: null,
  notifyEmail: true,
  notifyToast: true,

  theme: "system",
  fontSize: "md",
  sidebarCollapsed: false,

  enabledRoles: ["Admin", "Manager", "Employee"],
  cardsVisibility: {
    totalEmployees: true,
    totalSalary: true,
    departments: true,
    averageSalary: true,
  },

  twoFactorEnabled: false,
  lastLoginAt: new Date().toISOString(),

  setUsername: (username) => set(() => ({ username: username.trim() })),
  setPassword: (password) => set(() => ({ password })),
  setProfile: (patch) =>
    set((state) => ({
      ...state,
      ...patch,
    })),
  recordLogin: () => set(() => ({ lastLoginAt: new Date().toISOString() })),
  setNotify: (patch) =>
    set((state) => ({
      ...state,
      ...patch,
    })),
  setAppearance: (patch) =>
    set((state) => ({
      ...state,
      ...patch,
    })),
  setEnabledRoles: (roles) => set(() => ({ enabledRoles: roles })),
  setCardVisibility: (key, value) =>
    set((state) => ({ cardsVisibility: { ...state.cardsVisibility, [key]: value } })),
  setTwoFactorEnabled: (value) => set(() => ({ twoFactorEnabled: value })),
  logoutAllDevices: () => set(() => ({ lastLoginAt: new Date().toISOString() })),
    }),
    {
      name: "employee-dashboard-settings",
      version: 2,
      migrate: (persisted, version) => {
        const state = persisted as Partial<SettingsState>;
        if (version < 2) {
          return {
            ...state,
            username: state.username ?? DEFAULT_USERNAME,
            password: state.password ?? DEFAULT_PASSWORD,
          };
        }
        return state as SettingsState;
      },
    },
  ),
);

