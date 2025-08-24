import "server-only";
import { getGemini } from "../ai/client";
import { resultSchema } from "../validators/result";
import type { InterviewResult, QAResult } from "@/types/result";
import type { SessionState } from "@/types/interview";
import { buildResultPrompt } from "../ai/prompts/result";

export async function scoreSession(s: SessionState): Promise<InterviewResult> {
    const gemini = getGemini();

    const answered = s.history.filter(q => !!q.answer && !q.skipped);
    const totalSec = answered.reduce((acc, q) => acc + Math.round((q.timeMs ?? 0) / 1000), 0);
    const avgSec = answered.length ? Math.round(totalSec / answered.length) : 0;

    const { system, user } = buildResultPrompt(s);

    const resp = await gemini.models.generateContent({
        model: "gemini-2.0-flash-001",
        contents: [{ role: "user", parts: [{ text: system }, ...user] }],
        config: {
            temperature: 0.2,
            maxOutputTokens: 1200,
            responseMimeType: "application/json",
            responseSchema: resultSchema as Record<string, unknown>,
        },
    });

    const raw = resp.text ?? "{}";
    let data: {
        overallScore: number;
        questions: Array<{ index: number; score: number; feedback: string; strengths: string[]; improvements: string[]; timeComment: "Muy corto" | "Adecuado" | "Muy largo"; }>;
        recommendations: string[];
        nextSteps: string[];
    };

    try {
        data = JSON.parse(raw);
    } catch(e) {
        throw new Error(`Respuesta IA inválida (JSON parse): ${e}`);
    }

    const detailed: QAResult[] = data.questions.map(r => {
        const i = Number.isFinite(r.index) ? r.index : 0;
        const base = s.history[i];
        if (!base) {
            console.warn(`[scoreSession] Índice fuera de rango: ${r.index}`);
            return null;
        }

        const timeSec = Math.round((base.timeMs ?? 0) / 1000);
        return {
            index: r.index,
            question: base.question,
            type: base.type,
            difficulty: base.difficulty,
            answer: base.answer ?? "",
            timeSec,
            score: r.score,
            feedback: r.feedback,
            strengths: r.strengths,
            improvements: r.improvements,
            timeComment: r.timeComment,
        } as QAResult;
    }).filter(Boolean) as QAResult[];

    const efficiencyLabel =
        avgSec <= 60 ? "Excelente" :
            avgSec <= 120 ? "Buena" : "Mejorable";

    return {
        sessionId: s.id,
        totalAnswered: answered.length,
        totalPlanned: s.planned,
        overallScore: data.overallScore,
        time: { totalSec, avgPerQuestionSec: avgSec, efficiencyLabel },
        recommendations: data.recommendations,
        nextSteps: data.nextSteps,
        questions: detailed,
    };
}