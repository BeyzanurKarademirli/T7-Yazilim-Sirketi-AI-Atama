import { normalizeForMatch } from "@/lib/ai-assistant";
import type { RoleId } from "@/lib/seed";
import type {
  Employee as AssignmentEmployee,
  Skill,
  Task as AssignmentTask,
} from "@/types/assignment";
import type { Department } from "@/types/department";
import type { Employee as DashboardEmployee } from "@/types/employee";
import type { Task as DashboardTask } from "@/types/task";

const ROLE_SKILL_MAP: Record<
  RoleId,
  { category: string; level: number }
> = {
  frontendEngineer: { category: "frontend", level: 7 },
  backendEngineer: { category: "backend", level: 7 },
  fullstackEngineer: { category: "frontend", level: 8 },
  hrSpecialist: { category: "hr", level: 6 },
  accountant: { category: "finance", level: 6 },
  manager: { category: "management", level: 7 },
};

const MAX_TASK_CAPACITY = 5;

function skillsFromRole(role: RoleId): Skill[] {
  const mapped = ROLE_SKILL_MAP[role];
  return mapped ? [mapped] : [{ category: "general", level: 5 }];
}

export function mapEmployeesToAssignment(
  employees: DashboardEmployee[],
  tasks: DashboardTask[],
  departments: Department[],
): AssignmentEmployee[] {
  const deptNameById = new Map(departments.map((d) => [d.id, d.name]));

  return employees.map((employee) => {
    const activeTaskCount = tasks.filter(
      (t) =>
        t.assigneeId === employee.id &&
        (t.status === "todo" || t.status === "inProgress"),
    ).length;

    return {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      department: deptNameById.get(employee.department) ?? employee.department,
      role: "employee",
      skills: skillsFromRole(employee.role),
      activeTaskCount,
      maxTaskCapacity: MAX_TASK_CAPACITY,
      isAvailable: activeTaskCount < MAX_TASK_CAPACITY,
    };
  });
}

export function mapDashboardTaskToAssignment(
  task: DashboardTask,
  requiredCategory?: string,
): AssignmentTask {
  const category =
    requiredCategory ??
    inferCategoryFromTitle(task.title) ??
    "general";

  const priority =
    task.priority === "high"
      ? "high"
      : task.priority === "medium"
        ? "medium"
        : "low";

  return {
    id: task.id,
    title: task.title,
    description: `Atanan: ${task.assigneeName}. Son tarih: ${task.dueDate}. Durum: ${task.status}.`,
    requiredCategory: category,
    priority,
    createdBy: "dashboard",
    createdAt: new Date(),
  };
}

function inferCategoryFromTitle(title: string): string | null {
  const lower = title.toLowerCase();
  if (/frontend|react|ui|arayüz/.test(lower)) return "frontend";
  if (/backend|api|sunucu/.test(lower)) return "backend";
  if (/devops|deploy|ci\//.test(lower)) return "devops";
  if (/finans|muhasebe|account/.test(lower)) return "finance";
  if (/hr|insan kaynak/.test(lower)) return "hr";
  return null;
}

export function isRecommendationQuestion(question: string): boolean {
  const q = normalizeForMatch(question);

  return [
    "gorev ata",
    "kim atan",
    "atanmali",
    "atanmal",
    "kime atan",
    "oneri",
    "aday",
    "uygun calisan",
    "assign",
    "recommend",
    "candidate",
    "who should",
    "who to assign",
  ].some((p) => q.includes(p));
}

export function findTaskForRecommendation(
  question: string,
  tasks: DashboardTask[],
): DashboardTask | undefined {
  const normalized = question.trim().toLowerCase();
  const byTitle = tasks.find((t) =>
    normalized.includes(t.title.trim().toLowerCase()),
  );
  if (byTitle) return byTitle;

  return (
    tasks.find((t) => t.status === "todo") ??
    tasks.find((t) => t.status === "inProgress") ??
    tasks[0]
  );
}
