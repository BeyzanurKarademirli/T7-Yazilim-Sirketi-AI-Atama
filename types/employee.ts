import type { RoleId } from "@/lib/seed";

export type SkillCategory = "frontend" | "backend" | "devops" | "data";

export type EmployeeSkill = {
  cat: SkillCategory;
  lv: number;
};

export type AssignmentRole = "employee" | "scrum_master";

export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  salary: number;
  role: RoleId;
  init?: string;
  maxCapacity?: number;
  activeTaskCount?: number;
  available?: boolean;
  skills?: EmployeeSkill[];
  assignmentRole?: AssignmentRole;
};
