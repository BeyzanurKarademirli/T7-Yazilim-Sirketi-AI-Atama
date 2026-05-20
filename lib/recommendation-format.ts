import type { RecommendationResponse } from "./recommendationEngine";

export function formatRecommendationBlock(
  response: RecommendationResponse,
  taskTitle: string,
  locale: "en" | "tr",
): string {
  if (response.warning && !response.result) {
    return locale === "tr"
      ? `Görev: "${taskTitle}"\nUyarı: ${response.warning}`
      : `Task: "${taskTitle}"\nWarning: ${response.warning}`;
  }

  if (!response.result) {
    return locale === "tr"
      ? `Görev "${taskTitle}" için öneri üretilemedi.`
      : `Could not generate a recommendation for "${taskTitle}".`;
  }

  const lines = response.result.candidates.map((c) => {
    const pct = (c.score * 100).toFixed(0);
    const explanation = c.aiExplanation ? `\n   ${c.aiExplanation}` : "";
    return locale === "tr"
      ? `${c.rank}. ${c.employee.name} — Skor: %${pct} (yetkinlik: ${(c.skillScore * 100).toFixed(0)}%, iş yükü: ${(c.workloadScore * 100).toFixed(0)}%)${explanation}`
      : `${c.rank}. ${c.employee.name} — Score: ${pct}% (skill: ${(c.skillScore * 100).toFixed(0)}%, workload: ${(c.workloadScore * 100).toFixed(0)}%)${explanation}`;
  });

  const header =
    locale === "tr"
      ? `Görev: "${taskTitle}"\nÖnerilen adaylar (skorlama motoru + Groq açıklaması):`
      : `Task: "${taskTitle}"\nRecommended candidates (scoring engine + Groq explanation):`;

  const warning = response.warning ? `\n\n${response.warning}` : "";
  return `${header}\n${lines.join("\n")}${warning}`;
}
