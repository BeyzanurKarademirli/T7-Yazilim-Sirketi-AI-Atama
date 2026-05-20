import type { Department } from "@/types/department";

export const DEFAULT_DEPARTMENTS: Department[] = [
  { id: "eng", name: "Engineering" },
  { id: "hr", name: "HR" },
  { id: "fin", name: "Finance" },
  { id: "ops", name: "Operations" },
];

export const DEFAULT_ROLES = [
  "frontendEngineer",
  "backendEngineer",
  "fullstackEngineer",
  "hrSpecialist",
  "accountant",
  "manager",
] as const;

export type RoleId = (typeof DEFAULT_ROLES)[number];

