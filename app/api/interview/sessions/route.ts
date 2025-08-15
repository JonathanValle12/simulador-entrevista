import { NextResponse } from "next/server";
import { createSession } from "../../../lib/sessions";
import { type InterviewConfig } from "@/app/types/interview";

export async function POST(req: Request) {
    const { id, config } = (await req.json()) as { id: string; config: InterviewConfig};

    if (!id || !config) return NextResponse.json({ error: "Missing id/config" }, { status: 400});

    const s = createSession(id, config);
    return NextResponse.json({ id: s.id, planeed: s.planned});
}