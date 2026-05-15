// ============================================================
// __tests__/scoringEngine.test.ts
// Algoritma v1 birim testleri — US-02 kabul kriterleri
// ============================================================

import {
  getTopCandidates,
  calculateWorkloadStdDev,
  getIncompleteProfiles,
} from "../lib/scoringEngine";
import { Employee, Task } from "../types/assignment";

// ---- Test Veri Seti ----
const mockTask: Task = {
  id: "task-001",
  title: "Frontend geliştirme",
  description: "React bileşeni yazımı",
  requiredCategory: "frontend",
  priority: "high",
  createdBy: "mgr-001",
  createdAt: new Date(),
};

const mockEmployees: Employee[] = [
  {
    id: "emp-001",
    name: "Ayşe Kaya",
    email: "ayse@example.com",
    department: "Mühendislik",
    role: "employee",
    skills: [{ category: "frontend", level: 7 }],
    activeTaskCount: 1,
    maxTaskCapacity: 5,
    isAvailable: true,
  },
  {
    id: "emp-002",
    name: "Ali Yılmaz",
    email: "ali@example.com",
    department: "Mühendislik",
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
    department: "Mühendislik",
    role: "employee",
    skills: [{ category: "frontend", level: 9 }],
    activeTaskCount: 4,
    maxTaskCapacity: 5,
    isAvailable: true,
  },
  {
    id: "emp-004",
    name: "Fatma Çelik",
    email: "fatma@example.com",
    department: "Mühendislik",
    role: "employee",
    skills: [{ category: "frontend", level: 4 }],
    activeTaskCount: 5, // max kapasitede
    maxTaskCapacity: 5,
    isAvailable: true,
  },
  {
    id: "emp-005",
    name: "Zeynep Arslan",
    email: "zeynep@example.com",
    department: "Mühendislik",
    role: "employee",
    skills: [], // eksik profil
    activeTaskCount: 0,
    maxTaskCapacity: 5,
    isAvailable: true,
  },
];

// ============================================================
// TEST 1: Formül doğruluğu (AC-US02-2)
// Skor = (yetkinlik/10 × 0.60) + (boşluk × 0.40)
// ============================================================
describe("Ağırlıklı Puanlama Formülü (AC-US02-2)", () => {
  test("Ayşe için skor doğru hesaplanmalı", () => {
    const candidates = getTopCandidates([mockEmployees[0]], mockTask);
    // (7/10 × 0.60) + ((5-1)/5 × 0.40) = 0.42 + 0.32 = 0.74
    expect(candidates[0].score).toBeCloseTo(0.74, 2);
    expect(candidates[0].skillScore).toBeCloseTo(0.70, 2);
    expect(candidates[0].workloadScore).toBeCloseTo(0.80, 2);
  });

  test("Ali için skor doğru hesaplanmalı", () => {
    const candidates = getTopCandidates([mockEmployees[1]], mockTask);
    // (8/10 × 0.60) + ((5-2)/5 × 0.40) = 0.48 + 0.24 = 0.72
    expect(candidates[0].score).toBeCloseTo(0.72, 2);
  });

  test("Fatma eşik altında kalmalı (skor < 0.30)", () => {
    const candidates = getTopCandidates([mockEmployees[3]], mockTask);
    // (4/10 × 0.60) + (0/5 × 0.40) = 0.24 + 0 = 0.24 → elenmiş
    expect(candidates.length).toBe(0);
  });
});

// ============================================================
// TEST 2: Sıralama doğruluğu (AC-US02-2)
// Ayşe 0.74 > Ali 0.72 → Ayşe #1 olmalı
// ============================================================
describe("Aday Sıralaması", () => {
  test("En yüksek skorlu aday #1 olmalı", () => {
    const candidates = getTopCandidates(mockEmployees, mockTask);
    expect(candidates[0].employee.name).toBe("Ayşe Kaya");
    expect(candidates[0].rank).toBe(1);
  });

  test("Maksimum 3 aday döndürülmeli (AC-US01-1)", () => {
    const candidates = getTopCandidates(mockEmployees, mockTask);
    expect(candidates.length).toBeLessThanOrEqual(3);
  });
});

// ============================================================
// TEST 3: Eşit skorlarda alfabetik sıra (AC-US02-3)
// ============================================================
describe("Eşit Skor Durumu (AC-US02-3)", () => {
  test("Eşit skorlarda alfabetik sıra uygulanmalı", () => {
    const eqEmployees: Employee[] = [
      { ...mockEmployees[0], name: "Zeynep", skills: [{ category: "frontend", level: 7 }], activeTaskCount: 1 },
      { ...mockEmployees[1], name: "Ahmet",  skills: [{ category: "frontend", level: 7 }], activeTaskCount: 1 },
    ];
    const candidates = getTopCandidates(eqEmployees, mockTask);
    expect(candidates[0].employee.name).toBe("Ahmet");
    expect(candidates[1].employee.name).toBe("Zeynep");
  });
});

// ============================================================
// TEST 4: Eksik profil tespiti (AC-US01-3)
// ============================================================
describe("Eksik Profil Kontrolü (AC-US01-3)", () => {
  test("Boş profilli çalışan listeye dahil edilmemeli", () => {
    const candidates = getTopCandidates(mockEmployees, mockTask);
    const ids = candidates.map((c) => c.employee.id);
    expect(ids).not.toContain("emp-005"); // Zeynep — boş profil
  });

  test("getIncompleteProfiles boş profilli çalışanları döndürmeli", () => {
    const incomplete = getIncompleteProfiles(mockEmployees);
    expect(incomplete.map((e) => e.id)).toContain("emp-005");
  });
});

// ============================================================
// TEST 5: Standart sapma hesabı (AC-US05-2)
// σ > 2 olursa dashboard'da uyarı çıkmalı
// ============================================================
describe("İş Yükü Standart Sapması (AC-US05-2)", () => {
  test("Dengeli dağılımda σ ≤ 2 olmalı", () => {
    const balanced: Employee[] = mockEmployees.slice(0, 3).map((e, i) => ({
      ...e,
      activeTaskCount: i + 2, // 2, 3, 4
    }));
    const sigma = calculateWorkloadStdDev(balanced);
    expect(sigma).toBeLessThanOrEqual(2);
  });

  test("Dengesiz dağılımda σ > 2 olmalı", () => {
    const unbalanced: Employee[] = [
      { ...mockEmployees[0], activeTaskCount: 0 },
      { ...mockEmployees[1], activeTaskCount: 0 },
      { ...mockEmployees[2], activeTaskCount: 5 },
    ];
    const sigma = calculateWorkloadStdDev(unbalanced);
    expect(sigma).toBeGreaterThan(2);
  });
});
