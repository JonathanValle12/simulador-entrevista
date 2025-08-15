import 'server-only';

import type { InterviewConfig, QA } from "@/app/types/interview";
import { gemini } from "./client";
import { questionSchema } from "./schema";
import { buildQuestionPrompt } from "./prompt";

export async function generateQuestion(
    config: InterviewConfig,
    history: QA[]
): Promise<QA> {
    const { nextType, difficulty, systemText, userParts} = buildQuestionPrompt(config, history);

    if (!gemini) {
        return {
            question: `Redacta una pregunta ${nextType.toLowerCase()} nivel ${config.experiencia} para ${config.role}`,
            type: nextType,
            difficulty
        }
    }

    const schema: Record<string, unknown> = questionSchema;

    const resp = await gemini.models.generateContent({
        model: "gemini-2.0-flash-001",
        contents: [{ role: "user", parts: [{ text: systemText}, ...userParts]}],
        config: {
            temperature: 0.6,
            responseMimeType: "application/json",
            responseSchema: schema,
        },
    });

    const raw = resp.text ?? "{}";

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch(e) {
        throw new Error(`Respuesta IA inválida (JSON parse): ${e}`);
    }

    return {
        question: parsed.question,
        type: parsed.type,
        difficulty: parsed.difficulty
    };
}