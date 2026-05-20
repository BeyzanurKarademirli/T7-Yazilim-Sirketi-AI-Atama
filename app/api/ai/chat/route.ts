import { NextResponse } from "next/server";

import type { AssistantContext } from "@/lib/ai-assistant";
import {
  findTaskForRecommendation,
  isRecommendationQuestion,
  mapDashboardTaskToAssignment,
  mapEmployeesToAssignment,
} from "@/lib/assignment-mapper";
import { getDashboardChatReply, type GroqChatMessage } from "@/lib/groqService";
import { formatRecommendationBlock } from "@/lib/recommendation-format";
import { generateRecommendation } from "@/lib/recommendationEngine";
import type { AssistantLocale } from "@/lib/ai-assistant";

type ChatRequestBody = {
  question: string;
  locale?: AssistantLocale;
  history?: GroqChatMessage[];
  context: AssistantContext;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const question = body.question?.trim();

    if (!question) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    if (!body.context) {
      return NextResponse.json({ error: "context is required" }, { status: 400 });
    }

    const locale: AssistantLocale = body.locale === "en" ? "en" : "tr";
    const history = Array.isArray(body.history) ? body.history : [];

    let recommendationBlock: string | undefined;

    if (isRecommendationQuestion(question) && body.context.tasks.length > 0) {
      const dashboardTask = findTaskForRecommendation(question, body.context.tasks);
      if (dashboardTask) {
        const assignmentEmployees = mapEmployeesToAssignment(
          body.context.employees,
          body.context.tasks,
          body.context.departments,
        );
        const assignmentTask = mapDashboardTaskToAssignment(dashboardTask);
        const recommendation = await generateRecommendation(
          assignmentEmployees,
          assignmentTask,
        );
        recommendationBlock = formatRecommendationBlock(
          recommendation,
          dashboardTask.title,
          locale,
        );
      }
    }

    const { reply, usedAi } = await getDashboardChatReply(
      question,
      body.context,
      locale,
      history,
      recommendationBlock,
    );

    return NextResponse.json({ reply, usedAi });
  } catch (error) {
    console.error("[API /ai/chat]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
