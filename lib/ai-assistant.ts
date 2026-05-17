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

function normalize(text: string) {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matches(text: string, patterns: string[]) {
  return patterns.some((p) => text.includes(p));
}

function departmentLabel(departmentId: string, departments: Department[]) {
  const dept = departments.find((d) => d.id === departmentId);
  return dept?.name ?? departmentId;
}

export function getAssistantReply(
  question: string,
  ctx: AssistantContext,
  locale: AssistantLocale,
): string {
  const q = normalize(question);
  const { employees, departments, projects, tasks, totalSalary } = ctx;
  const avgSalary = employees.length > 0 ? totalSalary / employees.length : 0;
  const inProgress = tasks.filter((t) => t.status === "inProgress").length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const done = tasks.filter((t) => t.status === "done").length;

  if (
    matches(q, [
      "kac calisan",
      "how many employee",
      "employee count",
      "toplam calisan",
      "total employee",
    ])
  ) {
    return locale === "tr"
      ? `Şu anda ${employees.length} kayıtlı çalışan var.`
      : `You currently have ${employees.length} registered employees.`;
  }

  if (
    matches(q, [
      "toplam maas",
      "total salary",
      "maas toplam",
      "payroll total",
    ])
  ) {
    return locale === "tr"
      ? `Toplam maaş: ${formatCurrency(totalSalary)}. Ortalama maaş: ${formatCurrency(avgSalary)}.`
      : `Total salary: ${formatCurrency(totalSalary)}. Average salary: ${formatCurrency(avgSalary)}.`;
  }

  if (
    matches(q, [
      "ortalama maas",
      "average salary",
      "avg salary",
    ])
  ) {
    return locale === "tr"
      ? `Ortalama maaş ${formatCurrency(avgSalary)} (${employees.length} çalışan üzerinden).`
      : `Average salary is ${formatCurrency(avgSalary)} (across ${employees.length} employees).`;
  }

  if (
    matches(q, [
      "devam eden gorev",
      "in progress task",
      "tasks in progress",
      "kac gorev",
      "how many task",
    ])
  ) {
    return locale === "tr"
      ? `Görev durumu: ${todo} yapılacak, ${inProgress} devam ediyor, ${done} tamamlandı.`
      : `Task status: ${todo} to do, ${inProgress} in progress, ${done} done.`;
  }

  if (
    matches(q, [
      "departman",
      "department",
    ])
  ) {
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

  if (
    matches(q, [
      "proje",
      "project",
      "listele",
      "list",
    ])
  ) {
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

  if (
    matches(q, [
      "calisan list",
      "employee list",
      "kimler",
      "who works",
      "calisanlar",
      "employees",
    ])
  ) {
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
