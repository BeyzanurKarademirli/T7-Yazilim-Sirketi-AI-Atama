import { getAssistantReply, isUnknownAssistantReply } from "@/lib/ai-assistant";

const emptyCtx = {
  employees: [{ id: "1", name: "Ali", email: "a@x.com", department: "d1", role: "manager" as const }],
  departments: [{ id: "d1", name: "Engineering" }],
  projects: [{ id: "p1", name: "Alpha", description: "", groups: [{ id: "g1", name: "G", employees: [] }] }],
  tasks: [
    { id: "t1", title: "Task", status: "inProgress" as const, priority: "medium" as const, assigneeId: "1", assigneeName: "Ali", dueDate: "2026-01-01" },
  ],
  totalSalary: 100_000,
};

describe("getAssistantReply", () => {
  it("answers Turkish suggestion about employee count", () => {
    const reply = getAssistantReply("Kaç çalışanımız var?", emptyCtx, "tr");
    expect(reply).toContain("1");
    expect(isUnknownAssistantReply(reply)).toBe(false);
  });

  it("answers Turkish suggestion about salary", () => {
    const reply = getAssistantReply("Toplam maaş ne kadar?", emptyCtx, "tr");
    expect(reply.toLowerCase()).toContain("maaş");
    expect(isUnknownAssistantReply(reply)).toBe(false);
  });

  it("answers Turkish suggestion about in-progress tasks", () => {
    const reply = getAssistantReply("Kaç görev devam ediyor?", emptyCtx, "tr");
    expect(reply).toContain("devam");
    expect(isUnknownAssistantReply(reply)).toBe(false);
  });
});
