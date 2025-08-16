import { NextResponse } from "next/server";
import { getSession, answerCurrent } from "@/app/lib/sessions";

export async function POST(req: Request, ctx: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await ctx.params;  
    const s = getSession(sessionId);
    if (!s) return NextResponse.json({ error: "not-found" }, { status: 404 });

    const { answer } = (await req.json()) as { answer: string };
    answerCurrent(s.id, answer);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[score] error:", e);
    return NextResponse.json({ error: "internal-error" }, { status: 500 });
  }
}