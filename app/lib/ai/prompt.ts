import type { InterviewConfig, QA } from "@/app/types/interview";

export function buildQuestionPrompt(config: InterviewConfig, history: QA[]) {
  const isFirst = history.length === 0;

  // Nivel y dificultad acotadas por experiencia
  const ranges = {
    Junior: [1, 3],
    "Mid-Level": [2, 4],
    Senior: [3, 5],
  } as const;
  const [minD, maxD] = ranges[config.experiencia];
  const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
  const base = clamp(config.dificultad, minD, maxD);
  const difficulty = isFirst ? clamp(base - 1, minD, maxD) : base;

  const level =
    config.experiencia === "Junior" ? "básico" :
    config.experiencia === "Mid-Level" ? "intermedio" : "senior";

  const levelGuidance =
    config.experiencia === "Junior"
      ? "Fundamentos y ejemplos sencillos."
      : config.experiencia === "Mid-Level"
      ? "Aplicación práctica y decisiones justificadas."
      : "Arquitectura, trade-offs y rendimiento.";

  // Conteo por tipo
  const askedTech = history.filter(h => h.type === "Técnica").length;
  const askedBeh  = history.filter(h => h.type === "Comportamental").length;

  // En Mixta, rota SOLO entre Técnica y Comportamental
  const rotateMixta = (): QA["type"] =>
    askedTech <= askedBeh ? "Técnica" : "Comportamental";

  const chosenType: QA["type"] =
    config.tipo === "Mixta"
      ? rotateMixta()
      : (config.tipo as Exclude<InterviewConfig["tipo"], "Mixta">);

  // En Mixta abrimos con presentación (Comportamental); en otros, respeta el tipo
  const firstType: QA["type"] =
    config.tipo === "Mixta" ? "Comportamental" : chosenType;

  // Si la última respuesta es “ruido”, repite el MISMO tipo una vez
  const last = history.at(-1) || null;
  const lastQ = last?.question ?? "";
  const lastAnswer = (last?.answer ?? "").trim();
  const tooShort   = lastAnswer.length > 0 && lastAnswer.length < 15;
  const looksNoise = !!lastAnswer && !/\s/.test(lastAnswer) && lastAnswer.length >= 10;
  const repeatSame = !isFirst && (tooShort || looksNoise);

  const targetType: QA["type"] =
    isFirst ? firstType : repeatSame && last ? last.type : chosenType;

  // Reglas por tipo (solo Técnica/Comportamental)
  const typeRules =
    targetType === "Técnica"
      ? "Pregunta concreta del stack/código. Puedes incluir snippet breve (≤15 líneas). Prohibido pedir historias personales."
      : "Pregunta de experiencias reales (enfoque STAR). Prohibido pedir código.";

  // Prompt estricto y breve
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