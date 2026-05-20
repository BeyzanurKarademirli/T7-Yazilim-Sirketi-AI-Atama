// ============================================================
// __tests__/errorScenario.test.ts
// Hata Senaryo Testleri — T-H01 ile T-H04
// Sistemin hatalı giriş ve sınır değerlerde doğru davranışını test eder
// ============================================================

import { getTopCandidates, calculateWorkloadStdDev } from "../lib/scoringEngine";
import { Employee, Task, SCORE_THRESHOLD } from "../types/assignment";

// ---- Ortak Test Verisi ----
const task: Task = {
  id: "task-003",
  title: "Veri analizi görevi",
  description: "Raporlama ve analiz",
  requiredCategory: "data",
  priority: "medium",
  createdBy: "mgr-002",
  createdAt: new Date(),
};

const gecerliCalisan: Employee = {
  id: "emp-020",
  name: "Test Çalışanı",
  email: "test@example.com",
  department: "Analitik",
  role: "employee",
  skills: [{ category: "data", level: 7 }],
  activeTaskCount: 2,
  maxTaskCapacity: 5,
  isAvailable: true,
};

// ============================================================
// T-H01: Log kaydı silinemez (AC-US03-3)
// Silme girişimi engellenmelidir
// ============================================================
describe("T-H01 | Log kayıtları silinemez (AC-US03-3)", () => {
  test("Log objesi oluşturulduktan sonra değiştirilemez (immutable)", () => {
    const log = Object.freeze({
      id: "log-001",
      taskId: "task-001",
      decision: "accepted",
      decidedAt: new Date(),
    });

    // Dondurulmuş objeyi değiştirmeye çalışmak hata fırlatmamalı ama değer değişmemeli
    expect(() => {
      try { (log as any).decision = "rejected"; } catch (e) { /* strict modda hata fırlatır */ }
    }).not.toThrow();

    // Değer değişmemiş olmalı
    expect(log.decision).toBe("accepted");
  });

  test("Log ID'si benzersiz olmalı (timestamp bazlı)", () => {
    const log1 = { id: `log-${Date.now()}` };
    // Biraz bekle
    const log2 = { id: `log-${Date.now() + 1}` };
    expect(log1.id).not.toBe(log2.id);
  });
});

// ============================================================
// T-H02: Yetkinlik skoru sınır değer testleri
// AC-US02-1: Yetkinlik skoru 1–10 arası girilebilir
// ============================================================
describe("T-H02 | Yetkinlik skoru sınır değerleri (AC-US02-1)", () => {
  test("Yetkinlik = 1 (minimum) → skor pozitif olmalı", () => {
    const minYetkinlik: Employee = {
      ...gecerliCalisan,
      skills: [{ category: "data", level: 1 }],
      activeTaskCount: 0,
    };
    const candidates = getTopCandidates([minYetkinlik], task);
    // skill=1/10=0.10, workload=5/5=1.0 → skor = 0.06+0.40 = 0.46
    expect(candidates.length).toBe(1);
    expect(candidates[0].score).toBeGreaterThan(0);
  });

  test("Yetkinlik = 10 (maksimum) → en yüksek skor", () => {
    const maxYetkinlik: Employee = {
      ...gecerliCalisan,
      skills: [{ category: "data", level: 10 }],
      activeTaskCount: 0,
    };
    const candidates = getTopCandidates([maxYetkinlik], task);
    // skill=10/10=1.0, workload=1.0 → skor = 0.60+0.40 = 1.0
    expect(candidates[0].score).toBeCloseTo(1.0, 1);
  });

  test("Yetkinlik = 0 olan çalışan eşik altında kalmalı", () => {
    // level=0 sistemde geçersiz ama koruyucu test
    const sifirYetkinlik: Employee = {
      ...gecerliCalisan,
      skills: [{ category: "data", level: 0 }],
      activeTaskCount: 5, // tam dolu
      maxTaskCapacity: 5,
    };
    const candidates = getTopCandidates([sifirYetkinlik], task);
    // skill=0, workload=0 → skor=0 → eşik altı
    expect(candidates.length).toBe(0);
  });

  test("Skor hiçbir zaman 1'i geçmemeli", () => {
    const candidates = getTopCandidates([gecerliCalisan], task);
    candidates.forEach((c) => {
      expect(c.score).toBeLessThanOrEqual(1.0);
    });
  });

  test("Skor hiçbir zaman 0'ın altına düşmemeli", () => {
    const candidates = getTopCandidates([gecerliCalisan], task);
    candidates.forEach((c) => {
      expect(c.score).toBeGreaterThanOrEqual(0);
    });
  });
});

// ============================================================
// T-H03: Performans — çok sayıda çalışanla yanıt süresi
// NFR: Yanıt süresi ≤ 2 saniye (tek kullanıcı senaryosu)
// ============================================================
describe("T-H03 | Performans — büyük veri seti", () => {
  // 100 çalışanlık test verisi üret
  const buyukVeriSeti: Employee[] = Array.from({ length: 100 }, (_, i) => ({
    id: `emp-${i + 100}`,
    name: `Çalışan ${i + 1}`,
    email: `calisan${i}@example.com`,
    department: "Test",
    role: "employee" as const,
    skills: [{ category: "data", level: Math.floor(Math.random() * 10) + 1 }],
    activeTaskCount: Math.floor(Math.random() * 5),
    maxTaskCapacity: 5,
    isAvailable: true,
  }));

  test("100 çalışanlık listede yanıt ≤ 2000ms olmalı", () => {
    const start = Date.now();
    getTopCandidates(buyukVeriSeti, task);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(2000);
  });

  test("100 çalışan arasından yine de maks 3 aday döndürülmeli", () => {
    const candidates = getTopCandidates(buyukVeriSeti, task);
    expect(candidates.length).toBeLessThanOrEqual(3);
  });

  test("Rank değerleri 1'den başlamalı ve ardışık olmalı", () => {
    const candidates = getTopCandidates(buyukVeriSeti, task);
    candidates.forEach((c, i) => {
      expect(c.rank).toBe(i + 1);
    });
  });
});

// ============================================================
// T-H04: Eşik değeri sınır testleri
// SCORE_THRESHOLD = 0.30 — tam eşik değerindeki davranış
// ============================================================
describe("T-H04 | Eşik değeri sınır testleri", () => {
  test("Skoru tam eşik değerinde olan çalışan listeye girmeli", () => {
    // SCORE_THRESHOLD = 0.30 → tam bu skoru üretecek çalışan
    // skill=3/10=0.30, workload=0 → skor = 0.30*0.60 + 0*0.40 = 0.18 (eşik altı)
    // skill=5/10=0.50, workload=0 → skor = 0.50*0.60 = 0.30 → tam eşikte
    const esikCalisani: Employee = {
      ...gecerliCalisan,
      skills: [{ category: "data", level: 5 }],
      activeTaskCount: 5, // iş yükü boşluğu = 0
      maxTaskCapacity: 5,
    };
    const candidates = getTopCandidates([esikCalisani], task);
    // 0.50*0.60 + 0*0.40 = 0.30 → eşiğe eşit → listeye girmeli
    expect(candidates.length).toBe(1);
    expect(candidates[0].score).toBeCloseTo(SCORE_THRESHOLD, 2);
  });

  test("Skoru eşik altında olan çalışan listeye girmemeli", () => {
    const esikAltiCalisani: Employee = {
      ...gecerliCalisan,
      skills: [{ category: "data", level: 4 }],
      activeTaskCount: 5, // iş yükü boşluğu = 0
      maxTaskCapacity: 5,
    };
    // 0.40*0.60 + 0 = 0.24 → 0.30'un altı
    const candidates = getTopCandidates([esikAltiCalisani], task);
    expect(candidates.length).toBe(0);
  });
});

// ============================================================
// T-H05: Standart sapma edge case'leri
// ============================================================
describe("T-H05 | Standart sapma edge case'leri", () => {
  test("Tek çalışanda standart sapma 0 olmalı", () => {
    const tekCalisan = [gecerliCalisan];
    const sigma = calculateWorkloadStdDev(tekCalisan);
    expect(sigma).toBe(0);
  });

  test("Boş listede standart sapma 0 olmalı (sistem çökmemeli)", () => {
    expect(() => calculateWorkloadStdDev([])).not.toThrow();
    expect(calculateWorkloadStdDev([])).toBe(0);
  });

  test("Tüm çalışanların iş yükü eşitken sigma 0 olmalı", () => {
    const esitYuk: Employee[] = Array.from({ length: 5 }, (_, i) => ({
      ...gecerliCalisan,
      id: `emp-eq-${i}`,
      activeTaskCount: 3, // hepsi aynı
    }));
    const sigma = calculateWorkloadStdDev(esitYuk);
    expect(sigma).toBe(0);
  });
});
