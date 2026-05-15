// ============================================================
// lib/recommendationEngine.ts
// Ana Orkestratör — Skorlama + Gemini API birleştirici
// US-01 + US-02 tam akış implementasyonu
// ============================================================

import { Employee, Task, RecommendationResult } from "../types/assignment";
import { getTopCandidates, getIncompleteProfiles } from "./scoringEngine";
import { getAiExplanations } from "./groqService";

export interface RecommendationResponse {
  result: RecommendationResult | null;
  warning: string | null; // eksik profil veya müsait aday yoksa dolu
}

/**
 * Tam öneri akışı:
 * 1. Çalışanlar filtrelenir ve skorlanır
 * 2. Eksik profiller tespit edilip uyarı üretilir
 * 3. Gemini API açıklama ekler (hata olursa fallback devreye girer)
 * 4. Sonuç döndürülür
 *
 * AC-US01-1: Yanıt ≤ 2 saniyede tamamlanmalı
 */
export async function generateRecommendation(
  employees: Employee[],
  task: Task
): Promise<RecommendationResponse> {
  // Eksik profil kontrolü (AC-US01-3)
  const incomplete = getIncompleteProfiles(employees);
  const warning =
    incomplete.length > 0
      ? `Profil eksik çalışanlar listeye dahil edilmedi: ${incomplete
          .map((e) => e.name)
          .join(", ")}`
      : null;

  // Ağırlıklı skorlama — üst 3 aday
  const candidates = getTopCandidates(employees, task);

  // Müsait aday bulunamadı (İstisna Senaryo T-I01)
  if (candidates.length === 0) {
    return {
      result: null,
      warning: "Müsait ve uygun aday bulunamadı. Görevi erteleyebilir veya manuel atama yapabilirsiniz.",
    };
  }

  // Gemini API açıklamaları ekle
  const candidatesWithExplanations = await getAiExplanations(task, candidates);

  const result: RecommendationResult = {
    taskId: task.id,
    candidates: candidatesWithExplanations,
    generatedAt: new Date(),
    hasAiExplanation: candidatesWithExplanations.some((c) => c.aiExplanation),
  };

  return { result, warning };
}
