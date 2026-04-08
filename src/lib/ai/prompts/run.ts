import { STACK_GROUPS_BY_ROLE } from "@/data/stacks";
import type { InterviewConfig, QA } from "@/types/interview";

export interface PromptBuildResult {
  nextType: QA["type"];
  systemText: string;
  userParts: { text: string }[];
  focus?: string | null;
  effectiveStack?: string[];
}

export const allowedSetForRole = (role: string): Set<string> => {
  const groups = STACK_GROUPS_BY_ROLE[role] ?? [];
  return new Set(groups.flatMap((g) => g.items));
};

const norm = (s: string) => (s || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
const canonKey = (s: string) => norm(s).replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
const wordsOf = (txt: string): Set<string> => new Set(canonKey(txt).split(" ").filter(Boolean));

export const tokensInTextStrict = (txt: string, tokens: string[]) => {
  const words = wordsOf(txt);
  return tokens.filter((t) => words.has(canonKey(t)));
};

export const canonicalizeDeclared = (declared: string[], allowed: Set<string>): string[] => {
  const allowedMap = new Map<string, string>();
  for (const a of allowed) allowedMap.set(canonKey(a), a);
  const acc: string[] = [];
  for (const d of declared) {
    const k = canonKey(d);
    const hit = allowedMap.get(k);
    if (hit && !acc.includes(hit)) acc.push(hit);
  }
  return acc;
};

const inferStackFromHistory = (history: QA[], allowed: Set<string>) => {
  const acc: string[] = [];
  const push = (t: string) => { if (!acc.includes(t)) acc.push(t); };

  // ✅ Ignora Q1 (presentación), solo procesa Q2 en adelante (respuesta del gate)
  const relevantHistory = history.slice(1);
  
  for (const h of relevantHistory) {
    const a = h.answer ?? "";
    for (const t of tokensInTextStrict(a, [...allowed])) push(t);
  }
  return acc;
};

export function determineEffectiveStack(config: InterviewConfig, history: QA[]): string[] {
  const allowed = allowedSetForRole(config.role);
  const declaredCanon = canonicalizeDeclared((config.stack ?? []).filter(Boolean), allowed);
  const inferredCanon = inferStackFromHistory(history, allowed);
  return [...new Set([...declaredCanon, ...inferredCanon])];
}

export function buildQuestionPrompt(
  config: InterviewConfig,
  history: QA[],
  plannedQuestions: number
): PromptBuildResult {
  
  const level =
    config.experiencia === "Junior" ? "básico" :
    config.experiencia === "Mid-Level" ? "intermedio" : "senior";

  const levelGuidance =
    config.experiencia === "Junior"
      ? "Fundamentos, conceptos básicos y ejemplos sencillos."
      : config.experiencia === "Mid-Level"
      ? "Aplicación práctica, escenarios reales y justificación de decisiones."
      : "Diseño de arquitectura, trade-offs complejos, optimización y liderazgo técnico.";

  // --- LÓGICA DE TIPO DE PREGUNTA ---
  const askedTech = history.filter((h) => h.type === "Técnica").length;
  const askedBeh  = history.filter((h) => h.type === "Comportamental").length;
  const rotateMixta = (): QA["type"] => (askedTech <= askedBeh ? "Técnica" : "Comportamental");
  
  const chosenType: QA["type"] =
    config.tipo === "Mixta" ? rotateMixta()
      : (config.tipo as Exclude<InterviewConfig["tipo"], "Mixta">);

  // Determinar stack: primero lo configurado, luego lo inferido (solo desde Q2+)
  const inScope = determineEffectiveStack(config, history);
  const hasConfiguredStack = config.stack && config.stack.length > 0;
  
  const baseHeader =
    `Eres un entrevistador IA experto para el rol "${config.role}" (nivel ${level}).` +
    ` Tu objetivo es evaluar al candidato de forma realista y conversacional.` +
    ` Devuelve EXACTAMENTE UN OBJETO JSON con el formato: {"preface": string, "question": string, "type": string, "difficulty": number}\n` +
    `Reglas CRÍTICAS:\n` +
    `- **Ajusta al Nivel:** La complejidad debe ser ${level}. Guía: ${levelGuidance}.\n` +
    `- **NO REPETIR:** Revisa el historial de preguntas y NUNCA formules una pregunta conceptualmente similar a una ya hecha.\n` +
    `- **Formato:** Responde únicamente con el JSON plano, sin markdown ni explicaciones.`;

  // --- LÓGICA DE 3 PASOS ---

  // PASO 1: La primera pregunta de todas (presentación)
  if (history.length === 0) {
    const targetType = "Comportamental";
    const systemText =
      baseHeader +
      `- **"preface"**: Una bienvenida breve, profesional y natural (ej: "Hola, ¿qué tal? Empecemos.").\n` +
      `- **"question"**: Formula la pregunta "¿Podrías contarme un poco sobre ti y tu experiencia como ${config.role}?".\n` +
      `- **"type"**: "${targetType}"`;

    return { 
      nextType: targetType, 
      systemText, 
      userParts: [{ text: `Rol: ${config.role}` }], 
      effectiveStack: inScope 
    };
  }

  // PASO 2: Después de Q1 (history.length === 1)
  // Si NO hay stack configurado → Pedir el stack explícitamente
  if (history.length === 1 && !hasConfiguredStack) {
    const targetType = "Comportamental";
    const lastAnswer = history.at(-1)?.answer ?? "No respondió.";
    
    const userParts = [
      { text: `Rol: ${config.role}` },
      { text: `Stack: (Aún por determinar - usuario NO configuró stack)` }
    ];

    const systemText =
      baseHeader +
      `- **Contexto**: El candidato acaba de presentarse. Su respuesta fue: "${lastAnswer.slice(0, 150)}".\n` +
      `- **Tu Tarea**: Ahora necesitas saber su stack tecnológico para continuar la entrevista.\n` +
      `- **"preface"**: Formula una transición natural desde su presentación (ej: "Entendido, gracias por compartir.", "Muy interesante.").\n` +
      `- **"question"**: Formula la pregunta para saber su stack: "Para poder personalizar las siguientes preguntas, ¿podrías indicarme 2 o 3 de las tecnologías principales que manejas para el rol de ${config.role}?".\n` +
      `- **"type"**: "${targetType}"`;

    return { 
      nextType: targetType,
      systemText, 
      userParts, 
      effectiveStack: inScope 
    };
  }

  // PASO 3: Flujo normal de la entrevista
  // Se ejecuta cuando:
  // - history.length >= 2 (ya pasamos el gate) O
  // - history.length === 1 pero hay stack configurado (saltamos el gate)
  const questionHistory = history
    .map((h, i) => `Pregunta ${i+1}: ${h.question}`)
    .filter(Boolean);

  const numTechs = inScope.length || 1;
  const technicalQuestions = history.filter(h => h.type === 'Técnica');
  const currentTechQuestionIndex = technicalQuestions.length;
  const plannedTechnicalQuestions = Math.max(1, plannedQuestions - (history.length - technicalQuestions.length));
  const questionsPerTech = Math.ceil(plannedTechnicalQuestions / numTechs);
  const techIndex = Math.floor(currentTechQuestionIndex / questionsPerTech);
  const focus = inScope[techIndex % numTechs] || inScope[0] || "General";
  
  const systemText =
    baseHeader +
    `- **"preface"**: Incluye SIEMPRE una transición corta y natural (ej: "Perfecto, ahora hablemos de...", "Interesante, gracias.").\n` +
    `- **Foco Estricto**: Para ESTA pregunta, céntrate EXCLUSIVAMENTE en la tecnología: **${focus}**.\n` +
    `- **"type"**: "${chosenType}"\n` +
    (chosenType === "Comportamental"
      ? `- Formula una pregunta conductual (método STAR) contextualizada con "${focus}".\n`
      : `- Formula una pregunta técnica específica y concreta sobre **${focus}**.`);

  const userParts = [
    { text: `Rol a evaluar: ${config.role}` },
    { text: `Stack completo del candidato: ${inScope.join(", ") || "(sin determinar aún)"}` },
    { text: `Foco para ESTA pregunta: ${focus}` },
    { text: `Historial de preguntas (NO REPETIR CONCEPTOS): \n${questionHistory.join("\n") || "(ninguna)"}` },
    { text: `Respuesta anterior del candidato (para contexto): ${(history.at(-1)?.answer ?? "N/A").slice(0, 300)}` },
  ];

  return { nextType: chosenType, systemText, userParts, focus, effectiveStack: inScope };
}