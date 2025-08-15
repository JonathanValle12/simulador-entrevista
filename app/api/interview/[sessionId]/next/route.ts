import { NextResponse } from "next/server";
import { getSession, pushQuestion, answerCurrent } from "@/app/lib/sessions";
import { generateQuestion } from "@/app/lib/ai/generate";
import type { QA } from "@/app/types/interview";

export async function POST(req: Request, ctx: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await ctx.params;           // 👈 await
  const s = getSession(sessionId);
  if (!s) return NextResponse.json({ error: "not-found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const userAnswer: string | undefined = body?.answer?.trim();

  const last = s.history.at(-1);
  if (!userAnswer && last && !last.answer) {
    return NextResponse.json({ question: last.question, type: last.type, difficulty: last.difficulty } satisfies QA);
  }

  if (userAnswer) answerCurrent(s.id, userAnswer);

  try {
    const ai = await generateQuestion(s.config, s.history);
    pushQuestion(s.id, { question: ai.question, type: ai.type, difficulty: ai.difficulty });
    return NextResponse.json(ai);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
    console.error("[/next] error:", e);
    return NextResponse.json({ error: "internal", message }, { status: 500 });
  }
}
