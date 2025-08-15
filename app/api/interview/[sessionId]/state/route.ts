import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/sessions";

export async function GET(_req: Request, ctx: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await ctx.params;
  const s = getSession(sessionId);
  return s
    ? NextResponse.json(s)
    : NextResponse.json({ error: "not-found" }, { status: 404 });
}