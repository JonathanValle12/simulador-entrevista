import { NextResponse } from "next/server";
import { getSession } from "@/lib/session/store";
import { scoreSession } from "@/lib/scoring/score";
import { hasFinished } from "@/lib/session/logic";

export async function GET(_req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = await params;
    const s = getSession(sessionId);
    if (!s) return NextResponse.json({ error: "not-found" }, { status: 404 });

    if (!hasFinished(s).done) return NextResponse.json({ error: "not-finished" }, { status: 400 });

    try {
        if (!s.result) {
            console.log("[scoreSession] 🔄 Starting scoring for session:", sessionId);
            console.log("[scoreSession] 📊 History length:", s.history.length);
            s.result = await scoreSession(s);
            console.log("[scoreSession] ✅ Scoring completed successfully");
        }
        return NextResponse.json(s.result)
    } catch (error) {
        console.error("[scoreSession] ❌ CRITICAL ERROR:", error);
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error("[scoreSession] Error details:", errorMsg);
        
        return NextResponse.json({ 
            error: 'score-failed',
            details: errorMsg
        }, { status: 503 });
    }
}
