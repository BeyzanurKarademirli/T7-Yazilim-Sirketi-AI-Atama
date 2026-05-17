"use client";

import * as React from "react";
import { Bot, Send, Trash2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/provider";
import { getAssistantReply } from "@/lib/ai-assistant";
import { notifyError } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { useEmployeeStore } from "@/store/employee-store";
import { useTaskStore } from "@/store/task-store";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function AskAiScreen() {
  const { locale, t } = useI18n();
  const employees = useEmployeeStore((s) => s.employees);
  const departments = useEmployeeStore((s) => s.departments);
  const projects = useEmployeeStore((s) => s.projects);
  const totalSalary = useEmployeeStore((s) => s.totalSalary);
  const tasks = useTaskStore((s) => s.tasks);
  const loadTasks = useTaskStore((s) => s.loadTasks);

  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);

  const suggestions = React.useMemo(
    () => [
      t("askAiSuggestionEmployees"),
      t("askAiSuggestionSalary"),
      t("askAiSuggestionTasks"),
      t("askAiSuggestionProjects"),
      t("askAiSuggestionAssign"),
    ],
    [t],
  );

  React.useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  React.useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const context = React.useMemo(
    () => ({ employees, departments, projects, tasks, totalSalary }),
    [employees, departments, projects, tasks, totalSalary],
  );

  const submitQuestion = React.useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || thinking) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setThinking(true);

      const history = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let reply: string;

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: trimmed,
            locale,
            history,
            context,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = (await response.json()) as { reply: string };
        reply = data.reply;
      } catch {
        notifyError(t("askAiError"));
        reply = getAssistantReply(trimmed, context, locale);
      }

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: reply },
      ]);
      setThinking(false);
    },
    [context, locale, messages, thinking, t],
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void submitQuestion(input);
  }

  return (
    <div className="flex h-full min-h-[calc(100dvh-8rem)] flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{t("askAi")}</h2>
        <p className="text-sm text-[var(--muted-foreground)]">{t("askAiDescription")}</p>
      </div>

      <Card className="flex min-h-0 flex-1 flex-col border-[var(--border)] shadow-sm">
        <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-0">
          <div
            ref={listRef}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 md:p-6"
          >
            <div className="flex gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[var(--surface-muted)] px-4 py-3 text-sm leading-relaxed text-[var(--foreground)]">
                {t("askAiWelcome")}
              </div>
            </div>

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse",
                )}
              >
                <div
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full",
                    message.role === "assistant"
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--border)] text-[var(--foreground)]",
                  )}
                >
                  {message.role === "assistant" ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    message.role === "assistant"
                      ? "rounded-tl-sm bg-[var(--surface-muted)] text-[var(--foreground)]"
                      : "rounded-tr-sm bg-[var(--primary)] text-white",
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {thinking ? (
              <div className="flex gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--muted-foreground)]">
                  {t("askAiThinking")}
                </div>
              </div>
            ) : null}
          </div>

          {messages.length === 0 ? (
            <div className="flex flex-wrap gap-2 border-t border-[var(--border)] px-4 py-3 md:px-6">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-auto whitespace-normal text-left"
                  onClick={() => void submitQuestion(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          ) : null}

          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-2 border-t border-[var(--border)] p-4 md:flex-row md:p-6"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("askAiPlaceholder")}
              disabled={thinking}
              className="min-h-10 flex-1"
            />
            <div className="flex gap-2">
              {messages.length > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMessages([])}
                  disabled={thinking}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-2">{t("askAiClearChat")}</span>
                </Button>
              ) : null}
              <Button type="submit" disabled={thinking || !input.trim()} className="flex-1 md:flex-none">
                <Send className="h-4 w-4" />
                {t("askAiSend")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
