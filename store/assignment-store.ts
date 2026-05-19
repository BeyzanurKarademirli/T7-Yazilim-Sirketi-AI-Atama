import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AiCandidate, AssignmentLogEntry } from "@/types/assignment";

type AssignmentStore = {
  logs: AssignmentLogEntry[];
  candidates: AiCandidate[];
  skillWeight: number;
  workWeight: number;
  setCandidates: (candidates: AiCandidate[]) => void;
  addLog: (entry: Omit<AssignmentLogEntry, "id" | "time">) => void;
  setWeights: (skill: number, work: number) => void;
  clearLogs: () => void;
};

export const useAssignmentStore = create<AssignmentStore>()(
  persist(
    (set) => ({
      logs: [],
      candidates: [],
      skillWeight: 60,
      workWeight: 40,
      setCandidates: (candidates) => set({ candidates }),
      addLog: (entry) =>
        set((state) => ({
          logs: [
            {
              ...entry,
              id: crypto.randomUUID(),
              time: new Date().toLocaleTimeString("tr-TR"),
            },
            ...state.logs,
          ],
        })),
      setWeights: (skill, work) => set({ skillWeight: skill, workWeight: work }),
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: "ai-assignment-store",
      version: 1,
    },
  ),
);
