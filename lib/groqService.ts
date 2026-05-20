// ============================================================
// lib/groqService.ts
// Groq API Entegrasyonu — US-01 / US-02 implementasyonu
// API anahtarı .env.local ile korunur: GROQ_API_KEY
// Backend servis katmanından güvenli sorgu (istemcide çağrılmaz)
// ============================================================

<<<<<<< HEAD
import {
  getAssistantReply,
  isUnknownAssistantReply,
  type AssistantContext,
  type AssistantLocale,
} from "./ai-assistant";
=======
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
import { Candidate, Task } from "../types/assignment";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
<<<<<<< HEAD
const GROQ_TIMEOUT_MS = 12_000;
=======
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8

const FALLBACK_EXPLANATION =
  "Bu aday, görevin gerektirdiği yetkinlik ve mevcut iş yükü dengesi açısından en uygun profili sergilemiştir.";

<<<<<<< HEAD
export type GroqChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type DashboardChatResult = {
  reply: string;
  usedAi: boolean;
};

/**
 * Groq chat/completions çağrısı. API anahtarı yoksa veya hata olursa null döner.
 */
export async function callGroqChat(
  messages: GroqChatMessage[],
  options?: { temperature?: number; maxTokens?: number },
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: options?.temperature ?? 0.4,
        max_tokens: options?.maxTokens ?? 1024,
      }),
      signal: AbortSignal.timeout(GROQ_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Groq API HTTP ${response.status}`);
    }

    const data = await response.json();
    const text: string = data?.choices?.[0]?.message?.content ?? "";
    return text.trim() || null;
  } catch (error) {
    console.error("[GroqService] Chat API hatası:", error);
    return null;
  }
}

function buildDashboardSystemPrompt(
  context: AssistantContext,
  locale: AssistantLocale,
  recommendationBlock?: string,
): string {
  const lang = locale === "tr" ? "Türkçe" : "English";
  const payload = JSON.stringify(
    {
      employees: context.employees,
      departments: context.departments,
      projects: context.projects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        memberCount: p.groups.reduce((s, g) => s + g.employees.length, 0),
      })),
      tasks: context.tasks,
      totalSalary: context.totalSalary,
    },
    null,
    2,
  );

  return `Sen bir kurumsal yönetim paneli asistanısın. Yanıtlarını yalnızca ${lang} dilinde ver.
Verilen JSON verisindeki çalışan, görev, departman ve proje bilgilerine dayan; uydurma kayıt ekleme.
Görev atama önerisi verilmişse skor ve AI açıklamalarını kullanarak net öneri sun.

PANEL VERİSİ (JSON):
${payload}
${recommendationBlock ? `\nGÖREV ATAMA ÖNERİSİ:\n${recommendationBlock}` : ""}`;
}

/**
 * Dashboard sohbet yanıtı — Groq ile; başarısız olursa yerel kural tabanlı asistana düşer.
 */
export async function getDashboardChatReply(
  question: string,
  context: AssistantContext,
  locale: AssistantLocale,
  history: GroqChatMessage[] = [],
  recommendationBlock?: string,
): Promise<DashboardChatResult> {
  const localReply = getAssistantReply(question, context, locale);

  if (!isUnknownAssistantReply(localReply)) {
    return {
      reply: recommendationBlock ? `${localReply}\n\n${recommendationBlock}` : localReply,
      usedAi: false,
    };
  }

  if (recommendationBlock) {
    const intro =
      locale === "tr"
        ? "Görev atama önerisi:"
        : "Task assignment recommendation:";
    return { reply: `${intro}\n\n${recommendationBlock}`, usedAi: false };
  }

  const systemPrompt = buildDashboardSystemPrompt(context, locale, recommendationBlock);
  const recentHistory = history
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-8);

  const last = recentHistory[recentHistory.length - 1];
  const historyEndsWithSameQuestion =
    last?.role === "user" && last.content.trim() === question.trim();

  const aiText = await callGroqChat(
    [
      { role: "system", content: systemPrompt },
      ...recentHistory,
      ...(historyEndsWithSameQuestion ? [] : [{ role: "user" as const, content: question }]),
    ],
    { temperature: 0.35, maxTokens: 1024 },
  );

  if (aiText) {
    return { reply: aiText, usedAi: true };
  }

  return { reply: localReply, usedAi: false };
}

=======
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
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

<<<<<<< HEAD
function parseJsonArrayFromAiText<T>(rawText: string): T {
  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
      return JSON.parse(fenced[1].trim()) as T;
    }
    const arrayStart = trimmed.indexOf("[");
    const arrayEnd = trimmed.lastIndexOf("]");
    if (arrayStart >= 0 && arrayEnd > arrayStart) {
      return JSON.parse(trimmed.slice(arrayStart, arrayEnd + 1)) as T;
    }
    throw new Error("AI yanıtından JSON çıkarılamadı");
  }
}

=======
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8
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
<<<<<<< HEAD
    const rawText = await callGroqChat(
      [{ role: "user", content: prompt }],
      { temperature: 0.3, maxTokens: 512 },
    );

    if (!rawText) {
      throw new Error("Groq API boş yanıt");
    }

    const explanations: GroqExplanation[] = parseJsonArrayFromAiText(rawText);
=======

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
>>>>>>> a2ebc7a252b7ad714759a736da8116988d61fab8

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
