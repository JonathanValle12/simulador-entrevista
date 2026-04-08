import "server-only";
import type { InterviewConfig, QA } from "@/types/interview";
import { getGemini } from "./client";
import { buildQuestionPrompt, type PromptBuildResult } from "./prompts/run";

type GenerateQuestionReturn = {
  preface?: string;
  focus?: string | null;
} & QA;

export async function generateQuestion(
  config: InterviewConfig,
  history: QA[],
  plannedQuestions: number
): Promise<GenerateQuestionReturn> {
  const gemini = getGemini();

  const { nextType, systemText, userParts, focus }: PromptBuildResult =
    buildQuestionPrompt(config, history, plannedQuestions);

  try {
    const resp = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: systemText }, ...userParts] }],
      config: {
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    });

    let raw = resp.text ?? "{}";
    console.log("Raw response from Gemini: ", raw.substring(0, 200));

    // ✅ Limpia markdown (```json ... ```)
    if (raw.includes("```json")) {
      console.warn("⚠️ Response contains markdown, cleaning...");
      raw = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
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
      console.log("Repaired JSON: ", raw);
    }

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("JSON parse failed. Raw text:", raw.substring(0, 500));
      throw new Error(`Respuesta IA inválida (JSON parse): ${e}`);
    }

    if (!parsed.question || typeof parsed.question !== "string") {
      throw new Error(`Missing or invalid 'question' field in response: ${JSON.stringify(parsed)}`);
    }

    const q = parsed.question.trim();
    if (!q) {
      throw new Error("Question is empty after trim");
    }

    const finalResult: GenerateQuestionReturn = {
      preface: typeof parsed.preface === "string" ? parsed.preface : undefined,
      question: q || "Pregunta no válida: vuelve a intentar.",
      type: nextType,
    };

    if (focus !== null) {
      finalResult.focus = focus;
    }

    console.log("✅ Question generated successfully:", finalResult);
    return finalResult;
  } catch (error) {
    console.error("Error in generateQuestion: ", error);
    throw error;
  }
}