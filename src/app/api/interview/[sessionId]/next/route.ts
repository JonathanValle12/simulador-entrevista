import { NextResponse } from "next/server";
import { getSession, pushQuestion, answerCurrent } from "@/lib/sessions";
import { generateQuestion } from "@/lib/ai/generate";
import type { QA } from "@/types/interview";
import { hasFinished } from "@/lib/session-logic";

export async function POST(req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  const s = getSession(sessionId);
  if (!s) return NextResponse.json({ error: "not-found" }, { status: 404 });

  const body = await req.json().catch(() => ({} as { answer?: string; skip?: boolean }));
  const userAnswer = body?.answer?.trim();
  const skip = !!body?.skip;

  const last = s.history.at(-1);
  if (!skip && !userAnswer && last && !last.answer) {
    const payload: Partial<QA> = {
      question: last.question,
      type: last.type,
      difficulty: last.difficulty,
      preface: last.preface,
    };
    return NextResponse.json(payload);
  }

  if (userAnswer) {
    answerCurrent(s.id, userAnswer);
  } else if (skip && last && !last.answer) {
    last.answer = "";
    last.skipped = true;
  }

  const { done, endedBy } = hasFinished(s);
  if (done) {
    return NextResponse.json({
      done: true,
      answered: s.history.filter(h => !!h.answer && !h.skipped).length,
      planned: s.planned,
      endedBy
    });
  }

  try {
    const ai = await generateQuestion(s.config, s.history);
    pushQuestion(s.id, {
      question: ai.question,
      type: ai.type,
      difficulty: ai.difficulty,
      preface: ai.preface,
    });
    return NextResponse.json(ai);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : typeof e === "string" ? e : JSON.stringify(e);
    console.error("[/next] error:", e);
    return NextResponse.json({ error: "internal", message }, { status: 500 });
  }
}