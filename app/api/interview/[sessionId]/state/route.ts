// app/api/interview/[sessionId]/state/route.ts
import { NextResponse } from "next/server";
import { getSession, pauseSession, resumeSession } from "@/app/lib/sessions";

export async function GET(_req: Request, ctx: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await ctx.params;
  const s = getSession(sessionId);
  return s ? NextResponse.json(s) : NextResponse.json({ error: "not-found" }, { status: 404 });
}

export async function POST(req: Request, ctx: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await ctx.params;
  const s = getSession(sessionId);
  if (!s) return NextResponse.json({ error: "not-found" }, { status: 404 });

  const { action } = await req.json().catch(() => ({} as { action?: string }));

  if (action === "pause") {
    pauseSession(sessionId);
    return NextResponse.json({ ok: true, pausedAt: s.pausedAt ?? Date.now() });
  }
  if (action === "resume") {
    const added = resumeSession(sessionId);
    return NextResponse.json({ ok: true, added });
  }
  return NextResponse.json({ error: "bad-action" }, { status: 400 });
}