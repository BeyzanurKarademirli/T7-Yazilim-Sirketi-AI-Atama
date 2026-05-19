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
