import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/sessions";

export async function GET(_req: Request, { params }: { params: { sessionId: string } }) {
  const s = getSession(params.sessionId);
  return s
    ? NextResponse.json(s)
    : NextResponse.json({ error: "not-found" }, { status: 404 });
}