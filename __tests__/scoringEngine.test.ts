import { describe, expect, test } from "vitest";

import {
  calculateWorkloadStdDev,
  getIncompleteProfiles,
  getTopCandidates,
} from "../lib/scoringEngine";
import type { Employee, Task } from "../types/assignment";

const mockTask: Task = {
  id: "task-001",
  title: "Frontend gelistirme",
  description: "React bileseni yazimi",
  requiredCategory: "frontend",
  priority: "high",
  createdBy: "mgr-001",
  createdAt: new Date(),
};

const mockEmployees: Employee[] = [
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
    name: "Fatma Celik",
    email: "fatma@example.com",
    department: "Muhendislik",
    role: "employee",
    skills: [{ category: "frontend", level: 4 }],
    activeTaskCount: 5,
    maxTaskCapacity: 5,
    isAvailable: true,
  },
  {
    id: "emp-005",
    name: "Zeynep Arslan",
    email: "zeynep@example.com",
    department: "Muhendislik",
    role: "employee",
    skills: [],
    activeTaskCount: 0,
    maxTaskCapacity: 5,
    isAvailable: true,
  },
];

describe("Aday puanlama motoru", () => {
  test("Formul dogru hesaplanmali", () => {
    const candidates = getTopCandidates([mockEmployees[0]], mockTask);
    expect(candidates[0]?.score).toBeCloseTo(0.74, 2);
    expect(candidates[0]?.skillScore).toBeCloseTo(0.7, 2);
    expect(candidates[0]?.workloadScore).toBeCloseTo(0.8, 2);
  });

  test("Maksimum 3 aday donmeli", () => {
    const candidates = getTopCandidates(mockEmployees, mockTask);
    expect(candidates.length).toBeLessThanOrEqual(3);
  });

  test("Skora gore siralama ve rank olmali", () => {
    const candidates = getTopCandidates(mockEmployees, mockTask);
    expect(candidates[0]?.rank).toBe(1);
    for (let i = 0; i < candidates.length - 1; i += 1) {
      expect(candidates[i]!.score).toBeGreaterThanOrEqual(candidates[i + 1]!.score);
    }
  });

  test("Eksik profiller tespit edilmeli", () => {
    const incomplete = getIncompleteProfiles(mockEmployees);
    expect(incomplete.map((e) => e.id)).toContain("emp-005");
  });

  test("Dengesiz yukte sigma 2'den buyuk olmali", () => {
    const sigma = calculateWorkloadStdDev([
      { ...mockEmployees[0], activeTaskCount: 0 },
      { ...mockEmployees[1], activeTaskCount: 0 },
      { ...mockEmployees[2], activeTaskCount: 5 },
    ]);
    expect(sigma).toBeGreaterThan(2);
  });
});
