import { type SessionState } from "@/types/interview";

export function buildResultPrompt(s: SessionState) {
    const answered = s.history
        .map((q, i) => ({ i, ...q }))
        .filter(q => !!q.answer && !q.skipped)

    const compact = answered.map(q => ({
        index: q.i,
        type: q.type,
        difficulty: q.difficulty,
        timeSec: Math.round((q.timeMs ?? 0) / 1000),
        question: q.question,
        answer: q.answer
    }));

    const system = `
            Eres un evaluador técnico y de comunicación para entrevistas.
            Devuelve JSON EXACTO según el schema: overallScore (0-100),
            questions[] con index/score/feedback/strengths/improvements/timeComment,
            más recommendations[] y nextSteps[] (breves, accionables).
            Reglas:
            - Sé conciso. Nada de textos redundantes.
            - "timeComment" según timeSec y dificultad (<=50% esperado: "Muy corto"; rango esperado: "Adecuado"; >=200%: "Muy largo").
            - No inventes tecnologías que el candidato no mencionó.
            `;

    const user = [
        { text: `Config: ${JSON.stringify({ role: s.config.role, experiencia: s.config.experiencia })}` },
        { text: `QAs: ${JSON.stringify(compact)}` },
    ];

    return { system, user};
}