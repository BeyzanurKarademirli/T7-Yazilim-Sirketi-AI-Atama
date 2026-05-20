import { formatCurrency } from "@/lib/format";
import type { Department } from "@/types/department";
import type { Employee } from "@/types/employee";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";

export type AssistantLocale = "en" | "tr";

export type AssistantContext = {
  employees: Employee[];
  departments: Department[];
  projects: Project[];
  tasks: Task[];
  totalSalary: number;
};

const UNKNOWN_REPLY_MARKERS = [
  "tam anlayamadim",
  "could not fully understand",
] as const;

/** Soru eşleştirmesi için Türkçe karakterleri ASCII'ye indirir. */
export function normalizeForMatch(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "c");
}

export function isUnknownAssistantReply(reply: string): boolean {
  const normalized = normalizeForMatch(reply);
  return UNKNOWN_REPLY_MARKERS.some((marker) => normalized.includes(marker));
}

function matches(text: string, patterns: string[]) {
  return patterns.some((p) => text.includes(p));
}

function hasAny(text: string, patterns: string[]) {
  return patterns.some((p) => text.includes(p));
}

function departmentLabel(departmentId: string, departments: Department[]) {
  const dept = departments.find((d) => d.id === departmentId);
  return dept?.name ?? departmentId;
}

function isEmployeeCountQuestion(q: string): boolean {
  if (matches(q, ["how many employee", "employee count", "total employee", "number of employee"])) {
    return true;
  }
  return (
    hasAny(q, ["calisan", "personel", "employee", "employees"]) &&
    hasAny(q, ["kac", "sayi", "sayisi", "count", "how many", "toplam"])
  );
}

function isTotalSalaryQuestion(q: string): boolean {
  return matches(q, [
    "toplam maas",
    "total salary",
    "maas toplam",
    "payroll total",
    "maas ne kadar",
    "what is the total salary",
  ]);
}

function isAverageSalaryQuestion(q: string): boolean {
  return matches(q, ["ortalama maas", "average salary", "avg salary"]);
}

function isTaskStatusQuestion(q: string): boolean {
  if (
    matches(q, [
      "devam eden gorev",
      "in progress task",
      "tasks in progress",
      "how many task",
      "task status",
    ])
  ) {
    return true;
  }
  return (
    hasAny(q, ["gorev", "task", "tasks"]) &&
    hasAny(q, ["devam", "progress", "durum", "status", "kac", "how many"])
  );
}

function isDepartmentQuestion(q: string): boolean {
  return matches(q, ["departman", "department"]);
}

function isProjectListQuestion(q: string): boolean {
  if (matches(q, ["proje", "project", "projelerimizi", "list our projects", "list projects"])) {
    return true;
  }
  return hasAny(q, ["proje", "project"]) && hasAny(q, ["listele", "list", "goster", "show"]);
}

function isEmployeeListQuestion(q: string): boolean {
  return matches(q, [
    "calisan list",
    "employee list",
    "kimler calis",
    "who works",
    "calisanlar",
    "calisanlari listele",
    "list employees",
    "show employees",
  ]);
}

export function getAssistantReply(
  question: string,
  ctx: AssistantContext,
  locale: AssistantLocale,
): string {
  const q = normalizeForMatch(question);
  const { employees, departments, projects, tasks, totalSalary } = ctx;
  const avgSalary = employees.length > 0 ? totalSalary / employees.length : 0;
  const inProgress = tasks.filter((t) => t.status === "inProgress").length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const done = tasks.filter((t) => t.status === "done").length;

  if (isEmployeeCountQuestion(q)) {
    return locale === "tr"
      ? `Şu anda ${employees.length} kayıtlı çalışan var.`
      : `You currently have ${employees.length} registered employees.`;
  }

  if (isTotalSalaryQuestion(q)) {
    return locale === "tr"
      ? `Toplam maaş: ${formatCurrency(totalSalary)}. Ortalama maaş: ${formatCurrency(avgSalary)}.`
      : `Total salary: ${formatCurrency(totalSalary)}. Average salary: ${formatCurrency(avgSalary)}.`;
  }

  if (isAverageSalaryQuestion(q)) {
    return locale === "tr"
      ? `Ortalama maaş ${formatCurrency(avgSalary)} (${employees.length} çalışan üzerinden).`
      : `Average salary is ${formatCurrency(avgSalary)} (across ${employees.length} employees).`;
  }

  if (isTaskStatusQuestion(q)) {
    return locale === "tr"
      ? `Görev durumu: ${todo} yapılacak, ${inProgress} devam ediyor, ${done} tamamlandı.`
      : `Task status: ${todo} to do, ${inProgress} in progress, ${done} done.`;
  }

  if (isDepartmentQuestion(q)) {
    if (departments.length === 0) {
      return locale === "tr" ? "Henüz departman tanımlı değil." : "No departments defined yet.";
    }
    const lines = departments.map((d) => {
      const count = employees.filter((e) => e.department === d.id).length;
      return `• ${d.name}: ${count}`;
    });
    return locale === "tr"
      ? `Departmanlara göre çalışan sayısı:\n${lines.join("\n")}`
      : `Employees per department:\n${lines.join("\n")}`;
  }

  if (isProjectListQuestion(q)) {
    if (projects.length === 0) {
      return locale === "tr" ? "Henüz proje yok." : "There are no projects yet.";
    }
    const lines = projects.map((p) => {
      const memberCount = p.groups.reduce((sum, g) => sum + g.employees.length, 0);
      return `• ${p.name} (${memberCount} ${locale === "tr" ? "üye" : "members"})`;
    });
    return locale === "tr"
      ? `Projeler:\n${lines.join("\n")}`
      : `Projects:\n${lines.join("\n")}`;
  }

  if (isEmployeeListQuestion(q)) {
    if (employees.length === 0) {
      return locale === "tr" ? "Henüz çalışan kaydı yok." : "No employee records yet.";
    }
    const lines = employees.slice(0, 12).map((e) => {
      const dept = departmentLabel(e.department, departments);
      return `• ${e.name} — ${dept}, ${e.role}`;
    });
    const more =
      employees.length > 12
        ? locale === "tr"
          ? `\n…ve ${employees.length - 12} kişi daha.`
          : `\n…and ${employees.length - 12} more.`
        : "";
    return locale === "tr"
      ? `Çalışanlar:\n${lines.join("\n")}${more}`
      : `Employees:\n${lines.join("\n")}${more}`;
  }

  if (matches(q, ["merhaba", "hello", "hi", "selam"])) {
    return locale === "tr"
      ? "Merhaba! Çalışan, görev, departman veya proje hakkında soru sorabilirsiniz."
      : "Hello! Ask me about employees, tasks, departments, or projects.";
  }

  return locale === "tr"
    ? "Bu soruyu tam anlayamadım. Örnek: “Kaç çalışanımız var?”, “Toplam maaş ne kadar?”, “Projelerimizi listele”."
    : "I could not fully understand that question. Try: “How many employees do we have?”, “What is the total salary?”, or “List our projects”.";
}
