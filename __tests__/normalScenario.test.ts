import { describe, expect, test } from "vitest";

import { calculateWorkloadStdDev, getTopCandidates } from "../lib/scoringEngine";
import type { Employee, Task } from "../types/assignment";

const task: Task = {
  id: "task-normal",
  title: "Frontend gorevi",
  description: "React bileseni yazimi",
  requiredCategory: "frontend",
  priority: "high",
  createdBy: "mgr-001",
  createdAt: new Date(),
};

const employees: Employee[] = [
  {
    id: "emp-001",
    name: "Ayse Kaya",
    email: "ayse@example.com",
    department: "Muhendislik",
    role: "employee",
    skills: [{ category: "frontend", level: 7 }],
    activeTaskCount: 1,
    maxTaskCapacity: 5,
    isAvailable: true,
  },
  {
    id: "emp-002",
    name: "Ali Yilmaz",
    email: "ali@example.com",
    department: "Muhendislik",
    role: "employee",
    skills: [{ category: "frontend", level: 8 }],
    activeTaskCount: 2,
    maxTaskCapacity: 5,
    isAvailable: true,
  },
  {
    id: "emp-003",
    name: "Mehmet Demir",
    email: "mehmet@example.com",
    department: "Muhendislik",
    role: "employee",
    skills: [{ category: "frontend", level: 9 }],
    activeTaskCount: 4,
    maxTaskCapacity: 5,
    isAvailable: true,
  },
  {
    id: "emp-004",
    name: "Zeynep Arslan",
    email: "zeynep@example.com",
    department: "Muhendislik",
    role: "employee",
    skills: [{ category: "frontend", level: 6 }],
    activeTaskCount: 0,
    maxTaskCapacity: 5,
    isAvailable: true,
  },
];

describe("Normal senaryolar", () => {
  test("Aday listesi 1-3 araliginda donmeli", () => {
    const candidates = getTopCandidates(employees, task);
    expect(candidates.length).toBeGreaterThanOrEqual(1);
    expect(candidates.length).toBeLessThanOrEqual(3);
  });

  test("Yanit suresi 2 saniyeden kisa olmali", () => {
    const start = Date.now();
    getTopCandidates(employees, task);
    expect(Date.now() - start).toBeLessThan(2000);
  });

  test("Skorlar 0 ile 1 arasinda kalmali", () => {
    const candidates = getTopCandidates(employees, task);
    candidates.forEach((c) => {
      expect(c.score).toBeGreaterThanOrEqual(0);
      expect(c.score).toBeLessThanOrEqual(1);
    });
  });

  test("Profil degisimi sonucu etkilemeli", () => {
    const lowSkill = { ...employees[0], skills: [{ category: "frontend" as const, level: 3 }] };
    const highSkill = { ...employees[0], skills: [{ category: "frontend" as const, level: 9 }] };
    const low = getTopCandidates([lowSkill], task)[0]?.score ?? 0;
    const high = getTopCandidates([highSkill], task)[0]?.score ?? 0;
    expect(high).toBeGreaterThan(low);
  });

  test("Dashboard sigma hesabı calismali", () => {
    const balanced = employees.map((e, i) => ({ ...e, activeTaskCount: i + 2 }));
    const sigma = calculateWorkloadStdDev(balanced);
    expect(sigma).toBeLessThanOrEqual(2);
  });
});
