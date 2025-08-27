import type { Difficulty, InterviewConfig, QA } from "@/types/interview";

const toDifficulty = (v: unknown): Difficulty => {
  const n = Number(v ?? 3);
  const idx = Math.max(0, Math.min(4, Math.round(n) - 1));
  return ([1, 2, 3, 4, 5] as const)[idx]; // ← literal 1|2|3|4|5
};

export function buildQuestionPrompt(config: InterviewConfig, history: QA[]) {
  const isFirst = history.length === 0;

  const difficulty: Difficulty = toDifficulty(config.dificultad);

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
  const askedBeh = history.filter(h => h.type === "Comportamental").length;
  const rotateMixta = (): QA["type"] => askedTech <= askedBeh ? "Técnica" : "Comportamental";

  const chosenType: QA["type"] =
    config.tipo === "Mixta" ? rotateMixta()
      : (config.tipo as Exclude<InterviewConfig["tipo"], "Mixta">);

  const firstType: QA["type"] = config.tipo === "Mixta" ? "Comportamental" : chosenType;

  const last = history.at(-1) || null;
  const lastQ = last?.question ?? "";
  const lastAnswer = (last?.answer ?? "").trim();
  const tooShort = lastAnswer.length > 0 && lastAnswer.length < 15;
  const looksNoise = !!lastAnswer && !/\s/.test(lastAnswer) && lastAnswer.length >= 10;
  const repeatSame = !isFirst && (tooShort || looksNoise);

  const targetType: QA["type"] =
    isFirst ? firstType : repeatSame && last ? last.type : chosenType;

  const declaredStack = (config.stack ?? []).filter(Boolean);
  const hasStack = declaredStack.length > 0;

  const stackSentence = hasStack 
    ? `Stack declarado: ${declaredStack.join(", ")}. Usa estrictamente ese stack en los ejemplos/código. Evita tecnologias fuera del stack.`
    : `No asumas un stack concreto. Si el candidato menciona uno en su respuesta, adóptalo de ahí en adelante. Hasta entonces, mantén las preguntas técnicas agnósticas a lenguaje (HTTP/REST, bases de datos, índices/transacciones, concurrencias, cachés, testing, diseño de APIs, patrones). Si incluyes código, usa pseudocódigo o ejemplos neutrales.`;

  const antiTrivia = `PROHIBIDO: trivialidades (p.ej "¿qué imprime console.log('Hola')"), adivinanzas y preguntas sin contexto del rol. Para Junior: fundamentos aplicados al rol; nada de ejercicios de 1 línea que no evalúan criterio.`;

  const techRules =
    targetType === "Técnica"
      ? `Pregunta concreta, aplicada al rol. Puedes incluir como máximo 1 snippet breve (<12-15 lineas) solo si aporta valor.
        ${stackSentence}
        ${antiTrivia}`
      : "Pregunta de experiencias reales (formato STAR), orientada al rol. PROHIBIDO pedir código.";

  const systemText = isFirst
    ? `Eres entrevistador para "${config.role}". Nivel ${level}.
       Devuelve EXACTAMENTE:
       {"preface": string, "question": string, "type": "${firstType}", "difficulty": ${difficulty}}
       REGLAS:
       - "preface": saludo breve (1 frase) y encuadre. SIN pregunta aquí.
       - "question": presentación: “Cuéntame sobre ti y tu experiencia como ${config.role}…”.
       - Respeta el tipo "${firstType}" (NUNCA "Mixta" en el JSON).
       - ${techRules}
       - Ajusta a nivel ${level}: ${levelGuidance}
       - Dificultad EXACTA = ${difficulty}.
       - Solo JSON plano, sin markdown ni texto adicional`
    : `Eres entrevistador para "${config.role}". Nivel ${level}.
       Devuelve EXACTAMENTE:
       {"preface": string, "question": string, "type": "${targetType}", "difficulty": ${difficulty}}
       REGLAS:
       - "preface": reacción breve (1–2 frases) a la respuesta previa y transición. SIN meter la pregunta.
       - "question": ${targetType.toLowerCase()} concreta (sin divagar).
       - Respeta el tipo "${targetType}" (NUNCA "Mixta" en el JSON).
       - ${techRules}
       - Ajusta a nivel ${level}: ${levelGuidance}
       - Dificultad EXACTA = ${difficulty}.
       - Evita repetir la misma pregunta salvo respuesta de ruido.
       - Solo JSON plano, sin markdown ni texto adicional.`;

  const userParts = [
    { text: `Última pregunta: ${lastQ || "N/A"}` },
    { text: `Última respuesta (recorte): ${lastAnswer || "N/A"}` },
    { text: `Historial: ${JSON.stringify(history.map(h => ({ type: h.type, q: h.question, answered: !!h.answer })))}` },
    { text: `Si en respuestas previas se mencionan tecnologías/lenguajes específicos, úsalos de forma consistente en preguntas posteriores.`}
  ];

  return { nextType: targetType, difficulty, systemText, userParts };
}