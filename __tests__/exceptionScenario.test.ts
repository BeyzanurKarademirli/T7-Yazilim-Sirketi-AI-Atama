// ============================================================
// __tests__/exceptionScenario.test.ts
// İstisna Senaryo Testleri — T-I01 ile T-I05
// Sistemin olağandışı durumlarda doğru davranıp davranmadığını test eder
// ============================================================

import { getTopCandidates, getIncompleteProfiles } from "../lib/scoringEngine";
import { Employee, Task } from "../types/assignment";

// ---- Ortak Test Verisi ----
const task: Task = {
  id: "task-002",
  title: "Backend API geliştirme",
  description: "REST endpoint yazımı",
  requiredCategory: "backend",
  priority: "critical",
  createdBy: "mgr-001",
  createdAt: new Date(),
};

const normalEmployee: Employee = {
  id: "emp-010",
  name: "Ali Kaya",
  email: "ali@example.com",
  department: "Mühendislik",
  role: "employee",
  skills: [{ category: "backend", level: 8 }],
  activeTaskCount: 1,
  maxTaskCapacity: 5,
  isAvailable: true,
};

// ============================================================
// T-I01: Tüm çalışanlar maksimum kapasitede
// Beklenen: "Müsait aday bulunamadı" uyarısı
// ============================================================
describe("T-I01 | Tüm çalışanlar maksimum kapasitede", () => {
  const doluCalısanlar: Employee[] = [
    {
      id: "emp-011",
      name: "Çalışan A",
      email: "a@example.com",
      department: "Mühendislik",
      role: "employee",
      skills: [{ category: "backend", level: 9 }],
      activeTaskCount: 5, // max kapasitede
      maxTaskCapacity: 5,
      isAvailable: true,
    },
    {
      id: "emp-012",
      name: "Çalışan B",
      email: "b@example.com",
      department: "Mühendislik",
      role: "employee",
      skills: [{ category: "backend", level: 8 }],
      activeTaskCount: 5, // max kapasitede
      maxTaskCapacity: 5,
      isAvailable: true,
    },
  ];

  test("Max kapasitedeki çalışanların iş yükü boşluğu 0 olmalı", () => {
    const candidates = getTopCandidates(doluCalısanlar, task);
    // iş yükü boşluğu = 0 ama yetkinlik skoru yüksek olduğu için
    // eşik üstünde kalabilirler — workloadScore 0 olmalı
    candidates.forEach((c) => {
      expect(c.workloadScore).toBe(0);
    });
  });

  test("Max kapasitedeki çalışanların skoru yalnızca yetkinlikten gelmeli", () => {
    const candidates = getTopCandidates(doluCalısanlar, task);
    candidates.forEach((c) => {
      // workload katkısı = 0, skor = skillScore × 0.60
      expect(c.score).toBeCloseTo(c.skillScore * 0.6, 5);
    });
  });

  // generateRecommendation testi — Sprint 3'te eklenecek
});

// ============================================================
// T-I02: Boş profilli çalışan var
// Beklenen: Boş profil uyarısı + kısmi liste
// AC-US01-3: Boş profil varsa uyarı mesajı gösterilir
// ============================================================
describe("T-I02 | Boş profilli çalışan mevcut", () => {
  const karışıkListe: Employee[] = [
    normalEmployee,
    {
      id: "emp-013",
      name: "Zeynep Boş",
      email: "zeynep@example.com",
      department: "Mühendislik",
      role: "employee",
      skills: [], // BOŞ PROFİL
      activeTaskCount: 0,
      maxTaskCapacity: 5,
      isAvailable: true,
    },
  ];

  test("Boş profilli çalışan aday listesine dahil edilmemeli", () => {
    const candidates = getTopCandidates(karışıkListe, task);
    const idler = candidates.map((c) => c.employee.id);
    expect(idler).not.toContain("emp-013");
  });

  test("getIncompleteProfiles boş profilli çalışanı tespit etmeli", () => {
    const eksikler = getIncompleteProfiles(karışıkListe);
    expect(eksikler.map((e) => e.id)).toContain("emp-013");
  });

  // generateRecommendation testi — Sprint 3'te eklenecek
});

// ============================================================
// T-I03: Müsait olmayan çalışanlar (isAvailable: false)
// Beklenen: Müsait olmayan çalışan listeye alınmaz
// ============================================================
describe("T-I03 | Müsait olmayan çalışanlar filtrelenir", () => {
  const karışıkMüsaitlik: Employee[] = [
    normalEmployee,
    {
      id: "emp-014",
      name: "İzinli Çalışan",
      email: "izin@example.com",
      department: "Mühendislik",
      role: "employee",
      skills: [{ category: "backend", level: 10 }], // çok yüksek yetkinlik
      activeTaskCount: 0,
      maxTaskCapacity: 5,
      isAvailable: false, // MÜSAİT DEĞİL
    },
  ];

  test("isAvailable: false olan çalışan listeye dahil edilmemeli", () => {
    const candidates = getTopCandidates(karışıkMüsaitlik, task);
    const idler = candidates.map((c) => c.employee.id);
    expect(idler).not.toContain("emp-014");
  });

  test("Yüksek yetkinliğe rağmen müsait olmayan çalışan önerilmemeli", () => {
    const candidates = getTopCandidates(karışıkMüsaitlik, task);
    // emp-014'ün yetkinliği 10 olsa da müsait olmadığı için çıkmamalı
    expect(candidates.every((c) => c.employee.isAvailable)).toBe(true);
  });
});

// ============================================================
// T-I04: Hiç çalışan yok
// Beklenen: Boş liste, sistem çökmemeli
// ============================================================
describe("T-I04 | Çalışan listesi tamamen boş", () => {
  test("Boş listeyle çağrılınca sistem çökmemeli", () => {
    expect(() => getTopCandidates([], task)).not.toThrow();
  });

  test("Boş listeden boş aday listesi dönmeli", () => {
    const candidates = getTopCandidates([], task);
    expect(candidates).toEqual([]);
  });

  // generateRecommendation testi — Sprint 3'te eklenecek
});

// ============================================================
// T-I05: Görevin yetkinlik kategorisiyle eşleşen çalışan yok
// Beklenen: İlgili kategoride yetkinliği olmayan çalışanlar elenir
// ============================================================
describe("T-I05 | Görevle eşleşen yetkinlik kategorisi yok", () => {
  const yanlisKategoriCalisan: Employee[] = [
    {
      id: "emp-015",
      name: "Frontend Uzmanı",
      email: "frontend@example.com",
      department: "Mühendislik",
      role: "employee",
      skills: [{ category: "frontend", level: 10 }], // frontend uzmanı
      activeTaskCount: 0,
      maxTaskCapacity: 5,
      isAvailable: true,
    },
  ];

  // Görev "backend" istiyor ama çalışanın sadece "frontend" yetkinliği var
  test("Farklı kategorideki çalışan eşik altında kalmalı veya elenmeli", () => {
    const candidates = getTopCandidates(yanlisKategoriCalisan, task);
    // skillScore = 0 (kategori eşleşmedi) → skor düşük → muhtemelen eşik altı
    if (candidates.length > 0) {
      expect(candidates[0].skillScore).toBe(0);
    } else {
      expect(candidates.length).toBe(0);
    }
  });
});
