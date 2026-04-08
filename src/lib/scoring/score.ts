import "server-only";
import { getGemini } from "../ai/client";
import type { InterviewResult, QAResult, SkippedItem } from "@/types/result";
import type { SessionState } from "@/types/interview";
import { buildResultPrompt } from "../ai/prompts/result";

export async function scoreSession(s: SessionState): Promise<InterviewResult> {
    const gemini = getGemini();

    const answered = s.history.filter(q => !!q.answer && !q.skipped);
    const totalSec = answered.reduce((acc, q) => acc + Math.round((q.timeMs ?? 0) / 1000), 0);
    const avgSec = answered.length ? Math.round(totalSec / answered.length) : 0;

    const { system, user } = buildResultPrompt(s);

    try {
        const resp = await gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: system }, ...user] }],
            config: {
                temperature: 0.2,
                maxOutputTokens: 2048,
            },
        });

        let raw = resp.text ?? "{}";
        console.log("[scoreSession] Raw response from Gemini (first 200 chars):", raw.substring(0, 200));

        // ✅ Limpia markdown (```json ... ```)
        if (raw.includes("```json")) {
            console.warn("⚠️ Response contains markdown, cleaning...");
            raw = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            console.log("[scoreSession] Cleaned response (first 200 chars):", raw.substring(0, 200));
        }

        // ✅ Si el JSON está incompleto, intenta repararlo
        if (!raw.trim().endsWith("}")) {
            console.warn("⚠️ Response is incomplete, attempting to repair JSON...");

            const lastBrace = raw.lastIndexOf("}");
            if (lastBrace === -1) {
                raw = raw.replace(/,\s*$/, "") + '"}';
            } else {
                raw = raw.substring(0, lastBrace + 1);
            }
            console.log("[scoreSession] Repaired JSON: ", raw.substring(0, 200));
        }

        let data: {
            overallScore: number;
            questions: Array<{ index: number; score: number; feedback: string; strengths: string[]; improvements: string[]; timeComment: "Muy corto" | "Adecuado" | "Muy largo"; }>;
            recommendations: string[];
            nextSteps: string[];
        };

        try {
            console.log("[scoreSession] Attempting JSON parse...");
            data = JSON.parse(raw);
            console.log("[scoreSession] ✅ JSON parsed successfully");
            console.log("[scoreSession] Overall score from Gemini:", data.overallScore);
        } catch (e) {
            console.error("[scoreSession] ❌ JSON parse failed:", e);
            console.error("[scoreSession] Raw text:", raw.substring(0, 500));
            throw new Error(`Respuesta IA inválida (JSON parse): ${e}`);
        }

        const detailed: QAResult[] = data.questions.map(r => {
            const i = Number.isFinite(r.index) ? r.index : 0;
            const base = s.history[r.index];
            if (!base) {
                console.warn(`[scoreSession] Índice fuera de rango: ${r.index}`);
                return null;
            }

            const timeSec = Math.round((base.timeMs ?? 0) / 1000);
            return {
                index: r.index,
                question: base.question,
                type: base.type,
                answer: base.answer ?? "",
                timeSec,
                score: r.score,
                feedback: r.feedback,
                strengths: r.strengths,
                improvements: r.improvements,
                timeComment: r.timeComment,
            } as QAResult;
        }).filter(Boolean) as QAResult[];

        const finalScore = data.overallScore;

        // Calcula efficiencyLabel basado en timeComments
        const INTRO_INDEX = 0;
        const graded = detailed.filter(q => q.index !== INTRO_INDEX);

        let efficiencyLabel: "Excelente" | "Buena" | "Mejorable";

        if (!graded.length) {
            efficiencyLabel = "Mejorable";
        } else {
            const counts = graded.reduce((m, d) => {
                m[d.timeComment] = (m[d.timeComment] ?? 0) + 1;
                return m;
            }, {} as Record<"Muy corto" | "Adecuado" | "Muy largo", number>);

            const n = graded.length;
            const pAde = (counts["Adecuado"] ?? 0) / n;
            const pShort = (counts["Muy corto"] ?? 0) / n;
            const pLong = (counts["Muy largo"] ?? 0) / n;

            efficiencyLabel =
                pAde >= 0.60 && pShort <= 0.20 && pLong <= 0.20 ? "Excelente" :
                    pAde >= 0.35 && pShort <= 0.50 && pLong <= 0.35 ? "Buena" :
                        "Mejorable";
        }

        const skipped: SkippedItem[] = s.history
            .map((q, i) => ({ i, q }))
            .filter(({ q }) => q.skipped)
            .map(({ i, q }) => ({
                index: i,
                question: q.question,
                timeSec: Math.round((q.timeMs ?? 0) / 1000),
                type: q.type
            }));

        const stackUsed = (s.config.stack ?? []).filter(Boolean);

        console.log("[scoreSession] 🎯 Scoring complete:", {
            overallScore: finalScore,
            questionCount: detailed.length,
            skipCount: skipped.length,
            efficiencyLabel
        });

        return {
            sessionId: s.id,
            totalAnswered: answered.length,
            totalPlanned: s.planned,
            overallScore: finalScore,
            time: { totalSec, avgPerQuestionSec: avgSec, efficiencyLabel },
            recommendations: data.recommendations,
            nextSteps: data.nextSteps,
            questions: detailed,

            mode: s.config.tipo,
            stack: stackUsed,
            skipped
        };

    } catch (error) {
        console.error("[scoreSession] ❌ Error in scoreSession: ", error);
        throw error;
    }
}