import type { RoleId } from "@/lib/seed";

export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string; // department id
  salary: number;
  role: RoleId; // role id
};

