// ============================================================
// lib/groqService.ts
// Groq API Entegrasyonu — US-01 / US-02 implementasyonu
// API anahtarı .env.local ile korunur: GROQ_API_KEY
// Backend servis katmanından güvenli sorgu (istemcide çağrılmaz)
// ============================================================

import { Candidate, Task } from "../types/assignment";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const FALLBACK_EXPLANATION =
  "Bu aday, görevin gerektirdiği yetkinlik ve mevcut iş yükü dengesi açısından en uygun profili sergilemiştir.";

/**
 * Groq API'ye gönderilecek prompt'u oluşturur.
 * Personel listesi + görev detayları JSON formatında gönderilir.
 */
function buildPrompt(task: Task, candidates: Candidate[]): string {
  const candidateSummary = candidates
    .map(
      (c) =>
        `${c.rank}. ${c.employee.name} — Toplam Skor: ${c.score.toFixed(2)} ` +
        `(Yetkinlik: ${c.skillScore.toFixed(2)}, İş Yükü Boşluğu: ${c.workloadScore.toFixed(2)}, ` +
        `Aktif Görev: ${c.employee.activeTaskCount}/${c.employee.maxTaskCapacity})`
    )
    .join("\n");

  return `Sen bir insan kaynakları asistanısın. Aşağıdaki görev için yapay zekâ destekli bir sistem en uygun 3 çalışanı seçti.
Her aday için kısa, net ve Türkçe bir atama gerekçesi yaz (maksimum 2 cümle).

GÖREV:
- Başlık: ${task.title}
- Açıklama: ${task.description}
- Gerekli Yetkinlik: ${task.requiredCategory}
- Öncelik: ${task.priority}

ÖNERİLEN ADAYLAR (yetkinlik %60 + iş yükü %40 ağırlıklı skor):
${candidateSummary}

Her aday için şu formatta yanıt ver (JSON dizisi):
[
  { "rank": 1, "explanation": "..." },
  { "rank": 2, "explanation": "..." },
  { "rank": 3, "explanation": "..." }
]
Yalnızca JSON döndür, başka metin ekleme.`;
}

interface GroqExplanation {
  rank: number;
  explanation: string;
}

/**
 * Groq API'den her aday için doğal dil açıklaması alır.
 * API hatası durumunda fallback metin kullanılır — sistem çalışmaya devam eder.
 */
export async function getAiExplanations(
  task: Task,
  candidates: Candidate[]
): Promise<Candidate[]> {
  // API anahtarı yoksa direkt fallback
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("[GroqService] GROQ_API_KEY bulunamadı, fallback kullanılıyor.");
    return candidates.map((c) => ({
      ...c,
      aiExplanation: FALLBACK_EXPLANATION,
    }));
  }

  try {
    const prompt = buildPrompt(task, candidates);

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 512,
      }),
      signal: AbortSignal.timeout(8000), // 8 sn zaman aşımı
    });

    if (!response.ok) {
      throw new Error(`Groq API HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawText: string = data?.choices?.[0]?.message?.content ?? "";

    // JSON parse — başarısız olursa fallback
    const explanations: GroqExplanation[] = JSON.parse(rawText);

    // Her adaya açıklamasını eşleştir
    return candidates.map((candidate) => {
      const match = explanations.find((e) => e.rank === candidate.rank);
      return {
        ...candidate,
        aiExplanation: match?.explanation ?? FALLBACK_EXPLANATION,
      };
    });
  } catch (error) {
    // Hata logu — öneri sistemi çalışmaya devam eder (İstisna Senaryo T-I03)
    console.error("[GroqService] API hatası, fallback kullanılıyor:", error);
    return candidates.map((c) => ({
      ...c,
      aiExplanation: FALLBACK_EXPLANATION,
    }));
  }
}
