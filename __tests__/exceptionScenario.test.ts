import { describe, expect, test } from "vitest";

import { getIncompleteProfiles, getTopCandidates } from "../lib/scoringEngine";
import type { Employee, Task } from "../types/assignment";

const task: Task = {
  id: "task-002",
  title: "Backend API",
  description: "REST endpoint",
  requiredCategory: "backend",
  priority: "critical",
  createdBy: "mgr-001",
  createdAt: new Date(),
};

const baseEmployee: Employee = {
  id: "emp-010",
  name: "Ali Kaya",
  email: "ali@example.com",
  department: "Muhendislik",
  role: "employee",
  skills: [{ category: "backend", level: 8 }],
  activeTaskCount: 1,
  maxTaskCapacity: 5,
  isAvailable: true,
};

describe("Istisna senaryolari", () => {
  test("Tum calisanlar max kapasitede iken workload skoru 0 olmali", () => {
    const list: Employee[] = [
      { ...baseEmployee, id: "emp-011", activeTaskCount: 5 },
      { ...baseEmployee, id: "emp-012", activeTaskCount: 5, skills: [{ category: "backend", level: 9 }] },
    ];
    const candidates = getTopCandidates(list, task);
    candidates.forEach((c) => expect(c.workloadScore).toBe(0));
  });

  test("Bos profilli calisan aday listesine girmemeli", () => {
    const list: Employee[] = [
      baseEmployee,
      { ...baseEmployee, id: "emp-013", name: "Bos Profil", skills: [] },
    ];
    const candidates = getTopCandidates(list, task);
    expect(candidates.map((c) => c.employee.id)).not.toContain("emp-013");
    expect(getIncompleteProfiles(list).map((e) => e.id)).toContain("emp-013");
  });

  test("Müsait olmayan calisan filtrelenmeli", () => {
    const list: Employee[] = [
      baseEmployee,
      {
        ...baseEmployee,
        id: "emp-014",
        name: "Izinli Calisan",
        isAvailable: false,
        skills: [{ category: "backend", level: 10 }],
      },
    ];
    const candidates = getTopCandidates(list, task);
    expect(candidates.every((c) => c.employee.isAvailable)).toBe(true);
  });

  test("Bos calisan listesi hata vermeden bos donmeli", () => {
    expect(() => getTopCandidates([], task)).not.toThrow();
    expect(getTopCandidates([], task)).toEqual([]);
  });

  test("Kategori eslesmezse skill skoru sifir olmali", () => {
    const list: Employee[] = [
      {
        ...baseEmployee,
        id: "emp-015",
        skills: [{ category: "frontend", level: 10 }],
      },
    ];
    const candidates = getTopCandidates(list, task);
    if (candidates.length > 0) {
      expect(candidates[0]?.skillScore).toBe(0);
    } else {
      expect(candidates).toEqual([]);
    }
  });
});
