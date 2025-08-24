import type { InterviewConfig, QA } from "@/types/interview";

export function buildQuestionPrompt(config: InterviewConfig, history: QA[]) {
  const isFirst = history.length === 0;

  const toInt = (v: unknown) => Math.max(1, Math.min(5, Number(v) || 3));
  const difficulty = toInt(config.dificultad);
  
  const level =
    config.experiencia === "Junior" ? "básico" :
    config.experiencia === "Mid-Level" ? "intermedio" : "senior";

  const levelGuidance =
    config.experiencia === "Junior"
      ? "Fundamentos y ejemplos sencillos."
      : config.experiencia === "Mid-Level"
      ? "Aplicación práctica y decisiones justificadas."
      : "Arquitectura, trade-offs y rendimiento.";

  const askedTech = history.filter(h => h.type === "Técnica").length;
  const askedBeh  = history.filter(h => h.type === "Comportamental").length;
  const rotateMixta = (): QA["type"] => askedTech <= askedBeh ? "Técnica" : "Comportamental";

  const chosenType: QA["type"] =
    config.tipo === "Mixta"
      ? rotateMixta()
      : (config.tipo as Exclude<InterviewConfig["tipo"], "Mixta">);

  const firstType: QA["type"] = config.tipo === "Mixta" ? "Comportamental" : chosenType;

  const last = history.at(-1) || null;
  const lastQ = last?.question ?? "";
  const lastAnswer = (last?.answer ?? "").trim();
  const tooShort   = lastAnswer.length > 0 && lastAnswer.length < 15;
  const looksNoise = !!lastAnswer && !/\s/.test(lastAnswer) && lastAnswer.length >= 10;
  const repeatSame = !isFirst && (tooShort || looksNoise);

  const targetType: QA["type"] =
    isFirst ? firstType : repeatSame && last ? last.type : chosenType;

  const typeRules =
    targetType === "Técnica"
      ? "Pregunta concreta del stack/código. Puedes incluir snippet breve (≤15 líneas). Prohibido pedir historias personales."
      : "Pregunta de experiencias reales (enfoque STAR). Prohibido pedir código.";

  const systemText = isFirst
    ? `Eres entrevistador para "${config.role}". Nivel ${level}.
       Devuelve EXACTAMENTE:
       {"preface": string, "question": string, "type": "${firstType}", "difficulty": ${difficulty}}
       REGLAS:
       - "preface": saludo breve (1 frase) y encuadre. SIN pregunta aquí.
       - "question": presentación: “Cuéntame sobre ti y tu experiencia como ${config.role}…”.
       - Respeta el tipo "${firstType}" (NUNCA "Mixta" en el JSON).
       - ${typeRules}
       - Ajusta a nivel ${level}: ${levelGuidance}
       - Dificultad EXACTA = ${difficulty}.
       - Sin placeholders ni campos extra.`
    : `Eres entrevistador para "${config.role}". Nivel ${level}.
       Devuelve EXACTAMENTE:
       {"preface": string, "question": string, "type": "${targetType}", "difficulty": ${difficulty}}
       REGLAS:
       - "preface": reacción breve (1–2 frases) a la respuesta previa y transición. SIN meter la pregunta.
       - "question": ${targetType.toLowerCase()} concreta (sin divagar).
       - Respeta el tipo "${targetType}" (NUNCA "Mixta" en el JSON).
       - ${typeRules}
       - Ajusta a nivel ${level}: ${levelGuidance}
       - Dificultad EXACTA = ${difficulty}.
       - Evita repetir la misma pregunta salvo respuesta de ruido.
       - Sin placeholders ni campos extra.`;

  const userParts = [
    { text: `Última pregunta: ${lastQ || "N/A"}` },
    { text: `Última respuesta (recorte): ${lastAnswer || "N/A"}` },
    { text: `Historial: ${JSON.stringify(history.map(h => ({ type: h.type, q: h.question, answered: !!h.answer })))}` },
  ];

  return { nextType: targetType, difficulty, systemText, userParts };
}