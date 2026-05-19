import { describe, expect, test } from "vitest";

import { calculateWorkloadStdDev, getTopCandidates } from "../lib/scoringEngine";
import { SCORE_THRESHOLD, type Employee, type Task } from "../types/assignment";

const task: Task = {
  id: "task-003",
  title: "Veri analizi",
  description: "Raporlama",
  requiredCategory: "data",
  priority: "medium",
  createdBy: "mgr-002",
  createdAt: new Date(),
};

const validEmployee: Employee = {
  id: "emp-020",
  name: "Test Calisani",
  email: "test@example.com",
  department: "Analitik",
  role: "employee",
  skills: [{ category: "data", level: 7 }],
  activeTaskCount: 2,
  maxTaskCapacity: 5,
  isAvailable: true,
};

describe("Hata ve sinir senaryolari", () => {
  test("Log kaydi immutable kalmali", () => {
    const log = Object.freeze({
      id: "log-001",
      taskId: "task-001",
      decision: "accepted",
    });
    expect(() => {
      try {
        (log as { decision: string }).decision = "rejected";
      } catch {
        // no-op
      }
    }).not.toThrow();
    expect(log.decision).toBe("accepted");
  });

  test("Yetkinlik 1 iken de skor pozitif olmali", () => {
    const emp = { ...validEmployee, skills: [{ category: "data" as const, level: 1 }], activeTaskCount: 0 };
    const candidates = getTopCandidates([emp], task);
    expect(candidates.length).toBe(1);
    expect(candidates[0]?.score).toBeGreaterThan(0);
  });

  test("Yetkinlik 10 ve bosluk tam iken skor 1 olmali", () => {
    const emp = { ...validEmployee, skills: [{ category: "data" as const, level: 10 }], activeTaskCount: 0 };
    const candidates = getTopCandidates([emp], task);
    expect(candidates[0]?.score).toBeCloseTo(1, 2);
  });

  test("Skor tam esikteyse aday listeye girmeli", () => {
    const thresholdEmp = {
      ...validEmployee,
      skills: [{ category: "data" as const, level: 5 }],
      activeTaskCount: 5,
      maxTaskCapacity: 5,
    };
    const candidates = getTopCandidates([thresholdEmp], task);
    expect(candidates.length).toBe(1);
    expect(candidates[0]?.score).toBeCloseTo(SCORE_THRESHOLD, 2);
  });

  test("Performans: 100 calisan listesinde 2 saniye alti", () => {
    const bigSet: Employee[] = Array.from({ length: 100 }, (_, i) => ({
      ...validEmployee,
      id: `emp-${i}`,
      name: `Calisan ${i}`,
      email: `c${i}@example.com`,
      skills: [{ category: "data", level: (i % 10) + 1 }],
      activeTaskCount: i % 5,
    }));
    const start = Date.now();
    const candidates = getTopCandidates(bigSet, task);
    const elapsed = Date.now() - start;
    expect(candidates.length).toBeLessThanOrEqual(3);
    expect(elapsed).toBeLessThan(2000);
  });

  test("Standart sapma edge-case: tek calisan ve bos liste", () => {
    expect(calculateWorkloadStdDev([validEmployee])).toBe(0);
    expect(calculateWorkloadStdDev([])).toBe(0);
  });
});
