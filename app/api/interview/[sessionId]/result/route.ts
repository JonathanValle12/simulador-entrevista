import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/sessions";
import { scoreSession } from "@/app/lib/ai/score";

export async function GET(_req: Request, ctx: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = await ctx.params;
    const s = getSession(sessionId);
    if (!s) return NextResponse.json({ error: "not-found" }, { status: 404 });

    const completed = s.history.filter(h => h.skipped || h.answer !== undefined).length;
    const timeUp = Date.now() >= s.endsAt;
    const finishedByCount = completed >= s.planned;

    if (!timeUp && !finishedByCount) {
        return NextResponse.json({ error: "not-finished" }, { status: 400 });
    }

    try {
        if (!s.result) s.result = await scoreSession(s);
        return NextResponse.json(s.result)
    } catch {
        return NextResponse.json({ error: 'score-failed' }, { status: 503 });
    }

}