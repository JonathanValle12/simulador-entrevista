import type { InterviewConfig, QA } from "@/app/types/interview";

export function buildQuestionPrompt(config: InterviewConfig, history: QA[]) {
    const askedTech = history.filter(h => h.type === "Técnica").length;
    const askedBeh = history.filter(h => h.type === "Comportamental").length;
    const askedSys = history.filter(h => h.type === "Diseño de Sistemas").length;

    const nextType: QA["type"] =
    config.tipo === "Mixta"
      ? (askedTech <= askedBeh
          ? "Técnica"
          : (askedSys < Math.floor(history.length / 3)
              ? "Diseño de Sistemas"
              : "Comportamental"))
      : (config.tipo as Exclude<InterviewConfig["tipo"], "Mixta">);

    
    const level = 
        config.experiencia === "Junior" ? "básico" :
        config.experiencia === "Mid-Level" ? "intermedio" : "senior";

    const difficulty = config.dificultad;

    const systemText = 
        `Eres un entrevistador para el rol "${config.role}". ` +
        `Genera EXACTAMENTE un objeto JSON con una única pregunta ${nextType.toLowerCase()}, ` +
        `nivel ${level}, dificultad ${difficulty}/5. Sin explicación.`;

    const userParts = [
        {text: `Historial: ${JSON.stringify(history.map(h => ({ type: h.type, q: h.question, answered: !!h.answer})))}`}
    ]
    
    return { nextType, difficulty, systemText, userParts};
}