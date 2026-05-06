// ============================================================
// lib/scoringEngine.ts
// Ağırlıklı Puanlama Motoru — US-02 implementasyonu
// Formül: Skor = (yetkinlik × 0.60) + (iş_yükü_boşluğu × 0.40)
// ============================================================

import {
  Employee,
  Task,
  Candidate,
  ScoringWeights,
  DEFAULT_WEIGHTS,
  SCORE_THRESHOLD,
  MAX_CANDIDATES,
} from "../types/assignment";

/**
 * Bir çalışanın belirli bir görev için yetkinlik skorunu hesaplar.
 * Çalışanın ilgili kategorideki skill level'ı 1–10 → normalize → 0–1
 */
function calculateSkillScore(employee: Employee, task: Task): number {
  const relevantSkill = employee.skills.find(
    (s) => s.category.toLowerCase() === task.requiredCategory.toLowerCase()
  );

  if (!relevantSkill) return 0; // ilgili yetkinlik hiç tanımlanmamış

  // 1–10 aralığını 0–1'e normalize et
  return Math.min(Math.max(relevantSkill.level, 1), 10) / 10;
}

/**
 * Bir çalışanın iş yükü boşluğunu hesaplar.
 * Boşluk = (maksKapasite - aktifGörev) / maksKapasite
 * Tam dolu çalışan → 0.0, hiç görevi yok → 1.0
 */
function calculateWorkloadScore(employee: Employee): number {
  const { activeTaskCount, maxTaskCapacity } = employee;

  if (maxTaskCapacity <= 0) return 0;

  const gap = maxTaskCapacity - activeTaskCount;
  return Math.min(Math.max(gap / maxTaskCapacity, 0), 1);
}

/**
 * Tek bir çalışan için toplam uygunluk skorunu hesaplar.
 * Skor = (skillScore × weights.skill) + (workloadScore × weights.workload)
 */
function calculateTotalScore(
  employee: Employee,
  task: Task,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): { total: number; skillScore: number; workloadScore: number } {
  const skillScore = calculateSkillScore(employee, task);
  const workloadScore = calculateWorkloadScore(employee);
  const total = skillScore * weights.skill + workloadScore * weights.workload;

  return { total, skillScore, workloadScore };
}

/**
 * Ana fonksiyon: Verilen görev için en uygun MAX_CANDIDATES adayı döndürür.
 *
 * Kurallar (belgeden):
 * - Yalnızca müsait (isAvailable: true) ve profili dolu çalışanlar değerlendirilir
 * - Skor < SCORE_THRESHOLD olanlar elenir
 * - Eşit skorlarda alfabetik sıra uygulanır (AC-US02-3)
 * - En yüksek 3 aday döndürülür
 */
export function getTopCandidates(
  employees: Employee[],
  task: Task,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): Candidate[] {
  const scored = employees
    .filter((e) => {
      // Müsait değilse elimi
      if (!e.isAvailable) return false;
      // Profil boşsa (skill tanımlı değilse) uyar, listeye alma
      if (!e.skills || e.skills.length === 0) return false;
      return true;
    })
    .map((employee) => {
      const { total, skillScore, workloadScore } = calculateTotalScore(
        employee,
        task,
        weights
      );
      return { employee, score: total, skillScore, workloadScore };
    })
    .filter((c) => c.score >= SCORE_THRESHOLD) // eşik filtresi
    .sort((a, b) => {
      // Önce skora göre azalan
      if (b.score !== a.score) return b.score - a.score;
      // Eşit skorlarda alfabetik (AC-US02-3)
      return a.employee.name.localeCompare(b.employee.name, "tr");
    })
    .slice(0, MAX_CANDIDATES);

  // rank ata
  return scored.map((c, index) => ({
    ...c,
    rank: index + 1,
  }));
}

/**
 * Profili eksik çalışanların listesini döndürür (dashboard uyarısı için).
 */
export function getIncompleteProfiles(employees: Employee[]): Employee[] {
  return employees.filter(
    (e) => !e.skills || e.skills.length === 0
  );
}

/**
 * İş yükü standart sapmasını hesaplar (Dashboard uyarısı: σ > 2 → uyarı).
 * AC-US05-2 gereği kullanılır.
 */
export function calculateWorkloadStdDev(employees: Employee[]): number {
  if (employees.length === 0) return 0;

  const counts = employees.map((e) => e.activeTaskCount);
  const mean = counts.reduce((sum, c) => sum + c, 0) / counts.length;
  const variance =
    counts.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / counts.length;

  return Math.sqrt(variance);
}
