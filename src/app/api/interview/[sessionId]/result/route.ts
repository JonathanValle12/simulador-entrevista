import { NextResponse } from "next/server";
import { getSession } from "@/lib/sessions";
import { scoreSession } from "@/lib/scoring/score";
import { hasFinished } from "@/lib/session-logic";

export async function GET(_req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = await params;
    const s = getSession(sessionId);
    if (!s) return NextResponse.json({ error: "not-found" }, { status: 404 });

    if (!hasFinished(s).done) return NextResponse.json({ error: "not-finished" }, { status: 400 });

    try {
        if (!s.result) s.result = await scoreSession(s);
        return NextResponse.json(s.result)
    } catch {
        return NextResponse.json({ error: 'score-failed' }, { status: 503 });
    }

}