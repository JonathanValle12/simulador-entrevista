import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/sessions";
import { scoreSession } from "@/app/lib/ai/score";
import { type InterviewResult } from "@/app/types/result";

const cache = new Map<string, InterviewResult>();

export async function GET(_req: Request, ctx: { params: Promise<{ sessionId: string}> }) {
    const {sessionId} = await ctx.params;
    const s = getSession(sessionId);
    if (!s) return NextResponse.json({ error: "not-found"}, { status: 404});

    const completed = s.history.filter(h => h.skipped || h.answer !== undefined).length;
    if (completed < Math.min(3, s.planned)) {
        return NextResponse.json({ error: "not-finished"}, { status: 400});
    }

    if (cache.has(sessionId)) return NextResponse.json(cache.get(sessionId)!);

    const result = await scoreSession(s);
    cache.set(sessionId, result);
    return NextResponse.json(result)

}