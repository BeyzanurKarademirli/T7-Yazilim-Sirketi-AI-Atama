// ============================================================
// types/assignment.ts
// Grup 8 — Yapay Zekâ Destekli Görev Dağıtım Öneri Sistemi
// ============================================================

/** Çalışanın bir yetkinlik alanındaki seviyesi (1–10) */
export interface Skill {
  category: string; // örn. "frontend", "backend", "devops"
  level: number;    // 1–10 arası
}

/** Sistemdeki bir çalışanı temsil eder */
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: "admin" | "manager" | "employee";
  skills: Skill[];
  activeTaskCount: number; // şu an atanmış aktif görev sayısı
  maxTaskCapacity: number; // varsayılan: 5
  isAvailable: boolean;
}

/** Yöneticinin tanımladığı görevi temsil eder */
export interface Task {
  id: string;
  title: string;
  description: string;
  requiredCategory: string; // hangi yetkinlik kategorisi gerekiyor
  priority: "low" | "medium" | "high" | "critical";
  createdBy: string; // yönetici id
  createdAt: Date;
}

/** Algoritmanın ürettiği tek bir aday önerisi */
export interface Candidate {
  employee: Employee;
  score: number;             // 0–1 arası toplam uygunluk skoru
  skillScore: number;        // yetkinlik bileşeni (0–1)
  workloadScore: number;     // iş yükü bileşeni (0–1)
  rank: number;              // 1, 2 veya 3
  aiExplanation?: string;    // Gemini API'den gelen doğal dil açıklaması
}

/** Öneri motorunun döndürdüğü tam sonuç */
export interface RecommendationResult {
  taskId: string;
  candidates: Candidate[];   // en fazla 3 aday, skorla sıralı
  generatedAt: Date;
  hasAiExplanation: boolean;
}

/** Yöneticinin kabul/red kararı — log için */
export interface AssignmentLog {
  id: string;
  taskId: string;
  taskTitle: string;
  selectedEmployeeId: string;
  selectedEmployeeName: string;
  decision: "accepted" | "rejected";
  candidateRank: number;     // seçilen adayın öneri sırasındaki yeri
  score: number;
  decidedBy: string;         // yönetici id
  decidedAt: Date;
}

/** Skorlama algoritmasının ağırlık parametreleri */
export interface ScoringWeights {
  skill: number;    // varsayılan: 0.60
  workload: number; // varsayılan: 0.40
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  skill: 0.60,
  workload: 0.40,
};

export const SCORE_THRESHOLD = 0.30; // bu değerin altındaki adaylar elenir
export const MAX_CANDIDATES = 3;
