import { NextResponse } from "next/server";

import type { AssistantContext } from "@/lib/ai-assistant";
import {
  mapDashboardTaskToAssignment,
  mapEmployeesToAssignment,
} from "@/lib/assignment-mapper";
import { formatRecommendationBlock } from "@/lib/recommendation-format";
import { generateRecommendation } from "@/lib/recommendationEngine";
import type { Task as DashboardTask } from "@/types/task";

type RecommendRequestBody = {
  task: DashboardTask;
  requiredCategory?: string;
  locale?: "en" | "tr";
  context: Pick<AssistantContext, "employees" | "departments" | "tasks">;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecommendRequestBody;

    if (!body.task?.id || !body.task?.title) {
      return NextResponse.json({ error: "task is required" }, { status: 400 });
    }

    if (!body.context) {
      return NextResponse.json({ error: "context is required" }, { status: 400 });
    }

    const locale = body.locale === "en" ? "en" : "tr";
    const assignmentEmployees = mapEmployeesToAssignment(
      body.context.employees,
      body.context.tasks,
      body.context.departments,
    );
    const assignmentTask = mapDashboardTaskToAssignment(
      body.task,
      body.requiredCategory,
    );

    const recommendation = await generateRecommendation(
      assignmentEmployees,
      assignmentTask,
    );

    const summary = formatRecommendationBlock(
      recommendation,
      body.task.title,
      locale,
    );

    return NextResponse.json({
      result: recommendation.result,
      warning: recommendation.warning,
      summary,
    });
  } catch (error) {
    console.error("[API /ai/recommend]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
