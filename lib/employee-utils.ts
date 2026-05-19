import type { RoleId } from "@/lib/seed";
import type { Employee, EmployeeSkill, SkillCategory } from "@/types/employee";

export const V6_DEPARTMENTS = [
  { id: "eng", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "full-stack", label: "Full-Stack" },
  { id: "devops", label: "DevOps" },
  { id: "data", label: "Data" },
] as const;

export const SKILL_CATEGORIES: SkillCategory[] = ["frontend", "backend", "devops", "data"];

export const EMPLOYEE_AVATAR_CLASSES = [
  "bg-[rgba(0,201,167,0.15)] text-[#007a67]",
  "bg-[rgba(74,158,255,0.15)] text-[#1666cc]",
  "bg-[rgba(255,179,71,0.15)] text-[#a06200]",
  "bg-[rgba(147,112,219,0.15)] text-[#5b3fa8]",
  "bg-[rgba(255,78,78,0.12)] text-[#cc0000]",
] as const;

export function roleIdFromSkills(skills: EmployeeSkill[]): RoleId {
  const cats = new Set(skills.map((s) => s.cat));
  if (cats.has("frontend") && cats.has("backend")) return "fullstackEngineer";
  if (cats.has("backend")) return "backendEngineer";
  return "frontendEngineer";
}

export function employeeInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export function topSkillLevel(employee: Employee): number {
  if (!employee.skills?.length) return 5;
  return employee.skills.reduce((max, s) => (s.lv > max ? s.lv : max), 0);
}

export function departmentDisplayName(departmentId: string): string {
  const map: Record<string, string> = {
    eng: "Frontend",
    hr: "HR",
    fin: "Finance",
    ops: "Operations",
    frontend: "Frontend",
    backend: "Backend",
    "full-stack": "Full-Stack",
    devops: "DevOps",
    data: "Data",
  };
  return map[departmentId] ?? departmentId;
}

export function normalizeSkills(skills: EmployeeSkill[]): EmployeeSkill[] {
  return skills.filter((s) => s.lv >= 1 && s.lv <= 10);
}
