import { NextResponse } from "next/server";
import { getSession, pauseSession, resumeSession } from "@/lib/session/store";
import { setSessionCookie, clearSessionCookie } from "@/lib/http/cookies";

export async function GET(_req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const s = getSession(sessionId);

  if (!s) {

    const res = NextResponse.json({ error: "not-found" }, { status: 404 });
    clearSessionCookie(res);
    return res;
  }

  const res = NextResponse.json(s);
  setSessionCookie(res, sessionId);
  return res;
}

export async function POST(req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
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

  if (action === "finish") {
    s.endsAt = Date.now()
    s.pausedAt = undefined;
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "bad-action" }, { status: 400 });
}