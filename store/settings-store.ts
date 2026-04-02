import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "system" | "light" | "dark";
export type FontSize = "sm" | "md" | "lg";
export type RoleName = "Admin" | "Manager" | "Employee";

export type SettingsState = {
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
  setProfile: (patch: Partial<Pick<SettingsState, "profileName" | "profileEmail" | "profileImageDataUrl">>) => void;
  setNotify: (patch: Partial<Pick<SettingsState, "notifyEmail" | "notifyToast">>) => void;
  setAppearance: (patch: Partial<Pick<SettingsState, "theme" | "fontSize" | "sidebarCollapsed">>) => void;
  setEnabledRoles: (roles: RoleName[]) => void;
  setCardVisibility: (key: keyof SettingsState["cardsVisibility"], value: boolean) => void;
  setTwoFactorEnabled: (value: boolean) => void;
  logoutAllDevices: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
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

  setProfile: (patch) =>
    set((state) => ({
      ...state,
      ...patch,
    })),
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
      version: 1,
    },
  ),
);

