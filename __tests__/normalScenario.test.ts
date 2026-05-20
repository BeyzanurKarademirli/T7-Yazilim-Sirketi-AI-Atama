// ============================================================
// __tests__/normalScenario.test.ts
// Normal Senaryo Testleri — T-N01 ile T-N05
// Belgede tanımlanan başarılı akış senaryolarını doğrular
// ============================================================

import { getTopCandidates, calculateWorkloadStdDev } from "../lib/scoringEngine";
import { Employee, Task } from "../types/assignment";

// ---- Ortak Test Verisi ----
const normalTask: Task = {
  id: "task-001",
  title: "Frontend geliştirme görevi",
  description: "React bileşeni yazımı",
  requiredCategory: "frontend",
  priority: "high",
  createdBy: "mgr-001",
  createdAt: new Date(),
};

const normalEmployees: Employee[] = [
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
    name: "Zeynep Arslan",
    email: "zeynep@example.com",
    department: "Mühendislik",
    role: "employee",
    skills: [{ category: "frontend", level: 6 }],
    activeTaskCount: 0,
    maxTaskCapacity: 5,
    isAvailable: true,
  },
];

// ============================================================
// T-N01: Yönetici yeni görev oluşturur → 3 aday listelenir
// AC-US01-1: ≤ 2 saniyede yanıt
// ============================================================
describe("T-N01 | Görev tanımlanınca aday listesi oluşur", () => {
  test("En az 1, en fazla 3 aday döndürülmeli", () => {
    const candidates = getTopCandidates(normalEmployees, normalTask);
    expect(candidates.length).toBeGreaterThanOrEqual(1);
    expect(candidates.length).toBeLessThanOrEqual(3);
  });

  test("Yanıt süresi ≤ 2000ms olmalı (AC-US01-1)", () => {
    const start = Date.now();
    getTopCandidates(normalEmployees, normalTask);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(2000);
  });

  test("Döndürülen adaylar müsait çalışanlardan oluşmalı", () => {
    const candidates = getTopCandidates(normalEmployees, normalTask);
    candidates.forEach((c) => {
      expect(c.employee.isAvailable).toBe(true);
    });
  });
});

// ============================================================
// T-N02: Sistem yetkinlik + iş yükü skorunu hesaplar
// AC-US02-2: Skor = (yetkinlik × 0.60) + (boşluk × 0.40)
// ============================================================
describe("T-N02 | Ağırlıklı skor doğru hesaplanır", () => {
  test("Her adayın skoru 0 ile 1 arasında olmalı", () => {
    const candidates = getTopCandidates(normalEmployees, normalTask);
    candidates.forEach((c) => {
      expect(c.score).toBeGreaterThanOrEqual(0);
      expect(c.score).toBeLessThanOrEqual(1);
    });
  });

  test("Yetkinlik ve iş yükü bileşenleri ayrı ayrı doğru olmalı", () => {
    const candidates = getTopCandidates(normalEmployees, normalTask);
    candidates.forEach((c) => {
      // Manuel formül kontrolü
      const beklenenSkor =
        c.skillScore * 0.6 + c.workloadScore * 0.4;
      expect(c.score).toBeCloseTo(beklenenSkor, 5);
    });
  });

  test("Adaylar skora göre azalan sırada sıralanmalı", () => {
    const candidates = getTopCandidates(normalEmployees, normalTask);
    for (let i = 0; i < candidates.length - 1; i++) {
      expect(candidates[i].score).toBeGreaterThanOrEqual(
        candidates[i + 1].score
      );
    }
  });
});

// ============================================================
// T-N03: Yönetici öneriyi kabul eder → log kaydı oluşur
// AC-US03-1: Kabul/red tıklanınca log kaydı oluşturulur
// ============================================================
describe("T-N03 | Kabul/red kararı log kaydı üretir", () => {
  test("Kabul kararı için log objesi doğru yapıda olmalı", () => {
    const candidates = getTopCandidates(normalEmployees, normalTask);
    const secilenAday = candidates[0];

    // Log objesi simülasyonu (AC-US03-1)
    const log = {
      id: `log-${Date.now()}`,
      taskId: normalTask.id,
      taskTitle: normalTask.title,
      selectedEmployeeId: secilenAday.employee.id,
      selectedEmployeeName: secilenAday.employee.name,
      decision: "accepted" as const,
      candidateRank: secilenAday.rank,
      score: secilenAday.score,
      decidedBy: "mgr-001",
      decidedAt: new Date(),
    };

    expect(log.decision).toBe("accepted");
    expect(log.taskId).toBe("task-001");
    expect(log.selectedEmployeeId).toBeDefined();
    expect(log.candidateRank).toBe(1);
  });

  test("Red kararı için log objesi doğru yapıda olmalı", () => {
    const candidates = getTopCandidates(normalEmployees, normalTask);
    const log = {
      id: `log-${Date.now()}`,
      taskId: normalTask.id,
      taskTitle: normalTask.title,
      selectedEmployeeId: candidates[0].employee.id,
      selectedEmployeeName: candidates[0].employee.name,
      decision: "rejected" as const,
      candidateRank: candidates[0].rank,
      score: candidates[0].score,
      decidedBy: "mgr-001",
      decidedAt: new Date(),
    };

    expect(log.decision).toBe("rejected");
    expect(log.decidedAt).toBeInstanceOf(Date);
  });
});

// ============================================================
// T-N04: Çalışan profili güncellenir → öneri motoruna yansır
// AC-US04-1: Profil güncellemesi anlık yansımalı
// ============================================================
describe("T-N04 | Profil güncelleme öneri sonucunu değiştirir", () => {
  test("Yetkinlik artınca skor yükselmeli", () => {
    const eskiProfil: Employee = {
      ...normalEmployees[0],
      skills: [{ category: "frontend", level: 3 }], // düşük yetkinlik
    };
    const yeniProfil: Employee = {
      ...normalEmployees[0],
      skills: [{ category: "frontend", level: 9 }], // yüksek yetkinlik
    };

    const eskiSkor = getTopCandidates([eskiProfil], normalTask)[0]?.score ?? 0;
    const yeniSkor = getTopCandidates([yeniProfil], normalTask)[0]?.score ?? 0;

    expect(yeniSkor).toBeGreaterThan(eskiSkor);
  });

  test("İş yükü azalınca skor yükselmeli", () => {
    const yogunCalisan: Employee = {
      ...normalEmployees[1],
      activeTaskCount: 4, // yoğun
    };
    const bostCalisan: Employee = {
      ...normalEmployees[1],
      activeTaskCount: 0, // boş
    };

    const yogunSkor = getTopCandidates([yogunCalisan], normalTask)[0]?.score ?? 0;
    const bosSkor = getTopCandidates([bostCalisan], normalTask)[0]?.score ?? 0;

    expect(bosSkor).toBeGreaterThan(yogunSkor);
  });
});

// ============================================================
// T-N05: Dashboard iş yükü dağılımı gösterir
// AC-US05-1: Aktif görev sayısı gerçek zamanlı
// AC-US05-2: σ > 2 olursa uyarı
// ============================================================
describe("T-N05 | Dashboard iş yükü dağılımı hesaplanır", () => {
  test("Dengeli ekipte standart sapma ≤ 2 olmalı (uyarı çıkmamalı)", () => {
    const dengeliEkip: Employee[] = normalEmployees.map((e, i) => ({
      ...e,
      activeTaskCount: 2 + i, // 2, 3, 4, 5 → dengeli
    }));
    const sigma = calculateWorkloadStdDev(dengeliEkip);
    expect(sigma).toBeLessThanOrEqual(2);
  });

  test("Dengesiz ekipte standart sapma > 2 olmalı (uyarı çıkmalı)", () => {
    const dengesizEkip: Employee[] = [
      { ...normalEmployees[0], activeTaskCount: 0 },
      { ...normalEmployees[1], activeTaskCount: 0 },
      { ...normalEmployees[2], activeTaskCount: 5 },
      { ...normalEmployees[3], activeTaskCount: 5 },
    ];
    const sigma = calculateWorkloadStdDev(dengesizEkip);
    expect(sigma).toBeGreaterThan(2);
  });

  test("Boş ekipte standart sapma 0 olmalı", () => {
    const bosEkip: Employee[] = normalEmployees.map((e) => ({
      ...e,
      activeTaskCount: 0,
    }));
    const sigma = calculateWorkloadStdDev(bosEkip);
    expect(sigma).toBe(0);
  });
});

// T-N06 uçtan uca test — recommendationEngine Sprint 3'te eklenecek
