import 'server-only';

import type { InterviewConfig, QA } from "@/app/types/interview";
import { gemini } from "./client";
import { questionSchema } from "./schema";
import { buildQuestionPrompt } from "./prompt";

export async function generateQuestion(
  config: InterviewConfig,
  history: QA[]
): Promise<{ preface?: string } & QA> {
  if (!gemini) {
    // Si quieres, aquí puedes lanzar error para no “inventar” nada cuando no haya IA:
    throw new Error("IA no configurada (falta API key).");
  }

  const { nextType, difficulty, systemText, userParts } = buildQuestionPrompt(config, history);

  const resp = await gemini.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: [{ role: "user", parts: [{ text: systemText }, ...userParts] }],
    config: {
      temperature: 0.2,
      maxOutputTokens: 256,
      responseMimeType: "application/json",
      responseSchema: questionSchema as Record<string, unknown>,
    },
  });

  const raw = resp.text ?? "{}";
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Respuesta IA inválida (JSON parse): ${e}`);
  }

  const obj = parsed as { preface?: unknown; question?: unknown; type?: unknown; difficulty?: unknown };

  return {
    preface: typeof obj.preface === "string" ? obj.preface : undefined,
    question:
      typeof obj.question === "string" ? obj.question : "Pregunta no válida: vuelve a intentar.",
    type: (obj.type as QA["type"]) || nextType,
    difficulty,
  };
}