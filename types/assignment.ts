export type AssignmentDecision = "accepted" | "rejected";

export type AssignmentLogEntry = {
  id: string;
  taskTitle: string;
  employeeName: string;
  employeeId: string;
  rank: number;
  score: number;
  decision: AssignmentDecision;
  time: string;
};

export type TaskCategory = "frontend" | "backend" | "devops" | "data";

export type AiCandidate = {
  employeeId: string;
  name: string;
  init: string;
  departmentLabel: string;
  active: number;
  max: number;
  rank: number;
  skillPct: number;
  workloadPct: number;
  total: number;
  rationale: string;
};

// Legacy test compatibility types
export const SCORE_THRESHOLD = 0.3;

export type SkillCategoryLegacy = "frontend" | "backend" | "devops" | "data";

export type EmployeeSkillLegacy = {
  category: SkillCategoryLegacy;
  level: number;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  role: "employee" | "scrum_master";
  skills: EmployeeSkillLegacy[];
  activeTaskCount: number;
  maxTaskCapacity: number;
  isAvailable: boolean;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  requiredCategory: SkillCategoryLegacy;
  priority: "low" | "medium" | "high" | "critical";
  createdBy: string;
  createdAt: Date;
};

export type ScoredCandidate = {
  employee: Employee;
  rank: number;
  score: number;
  skillScore: number;
  workloadScore: number;
};
