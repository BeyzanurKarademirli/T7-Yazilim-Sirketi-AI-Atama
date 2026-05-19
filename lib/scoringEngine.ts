import {
  SCORE_THRESHOLD,
  type Employee,
  type ScoredCandidate,
  type Task,
} from "../types/assignment";

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function getSkillScore(employee: Employee, task: Task): number {
  const matched = employee.skills.find((s) => s.category === task.requiredCategory);
  if (!matched) return 0;
  return clamp(matched.level / 10);
}

function getWorkloadScore(employee: Employee): number {
  const max = employee.maxTaskCapacity > 0 ? employee.maxTaskCapacity : 5;
  const active = Math.max(0, employee.activeTaskCount);
  return clamp((max - active) / max);
}

function isCompleteProfile(employee: Employee): boolean {
  return Array.isArray(employee.skills) && employee.skills.length > 0;
}

export function getIncompleteProfiles(employees: Employee[]): Employee[] {
  return employees.filter((e) => !isCompleteProfile(e));
}

export function getTopCandidates(
  employees: Employee[],
  task: Task,
  skillWeight = 0.6,
  workloadWeight = 0.4,
): ScoredCandidate[] {
  if (!employees.length) return [];

  return employees
    .filter((e) => e.isAvailable && isCompleteProfile(e))
    .map((employee) => {
      const skillScore = getSkillScore(employee, task);
      const workloadScore = getWorkloadScore(employee);
      const score = clamp(skillScore * skillWeight + workloadScore * workloadWeight);
      return { employee, score, skillScore, workloadScore };
    })
    .filter((c) => c.score >= SCORE_THRESHOLD)
    .sort(
      (a, b) =>
        b.score - a.score || a.employee.name.localeCompare(b.employee.name, "tr"),
    )
    .slice(0, 3)
    .map((candidate, idx) => ({
      ...candidate,
      rank: idx + 1,
    }));
}

export function calculateWorkloadStdDev(employees: Employee[]): number {
  if (employees.length <= 1) return 0;
  const values = employees.map((e) => Math.max(0, e.activeTaskCount));
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Number(Math.sqrt(variance).toFixed(4));
}
