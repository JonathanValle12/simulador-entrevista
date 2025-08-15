import { NextResponse } from "next/server";
import { getSession, pushQuestion } from "@/app/lib/sessions";
import { generateQuestion } from "@/app/lib/ai/generate";

export async function POST(_req: Request, { params }: { params: { sessionId: string } }) {
  try {
    const s = getSession(params.sessionId);
    if (!s) return NextResponse.json({ error: "not-found" }, { status: 404 });

    const qa = await generateQuestion(s.config, s.history);
    pushQuestion(s.id, qa);

    return NextResponse.json(qa);
  } catch (e) {
    console.error("[next] error:", e);
    return NextResponse.json({ error: "internal-error" }, { status: 500 });
  }
}