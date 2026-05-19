import type { Employee } from "@/types/employee";
import { topSkillLevel } from "@/lib/employee-utils";

export type EmployeeScore = {
  total: number;
  skillRatio: number;
  workloadRatio: number;
};

export function scoreEmployee(
  employee: Employee,
  skillWeight = 0.6,
  workWeight = 0.4,
): EmployeeScore {
  const max = employee.maxCapacity ?? 5;
  const active = employee.activeTaskCount ?? 0;
  const skillRatio = topSkillLevel(employee) / 10;
  const workloadRatio = max > 0 ? (max - active) / max : 0;
  const total = skillRatio * skillWeight + workloadRatio * workWeight;
  return { total, skillRatio, workloadRatio };
}

export const AI_RATIONALE = [
  "Yüksek iş yükü boşluğu ve güçlü yetkinliğiyle öne çıkıyor.",
  "Dengeli iş yükü ve teknik yetkinliği bu göreve uygun kılıyor.",
  "Güçlü yetkinliğe karşın iş yükü yüksek; üçüncü en uygun aday.",
] as const;
