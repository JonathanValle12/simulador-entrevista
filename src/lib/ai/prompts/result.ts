import { type SessionState } from "@/types/interview";

export function buildResultPrompt(s: SessionState) {
    const answered = s.history
        .map((q, i) => ({ i, ...q }))
        .filter(q => !!q.answer && !q.skipped)

    const compact = answered.map(q => ({
        index: q.i,
        type: q.type,
        timeSec: Math.round((q.timeMs ?? 0) / 1000),
        question: q.question,
        answer: q.answer,
    }));

    const system = `
            Eres un evaluador experto técnico y de comunicación para entrevistas.
            Tu tarea: Evaluar cada respuesta del candidato y devolver un JSON con puntuacion, feedback y analisis.
            ESTRUCTURA DE RESPUESTA (JSON exacto):
                {
                "overallScore": number (0-100),
                "questions": [
                    {
                    "index": number,
                    "score": number (0-100),
                    "feedback": string,
                    "strengths": [string, string, ...],
                    "improvements": [string, string, ...],
                    "timeComment": "Muy corto" | "Adecuado" | "Muy largo"
                    }
                ],
                "recommendations": [string, string, ...],
                "nextSteps": [string, string, ...]
                }

            REGLAS DE EVALUACIÓN:
            0. **overallScore**:
             - Promedio de todos los scores individuales, redondeado al entero más cercano
             - Rango: 0-100

            1. **Score (0-100) - Por CADA pregunta**:
             - 80-100: Excelente (respuesta completa y técnicamente sólida)
             - 60-79: Buena (respuesta adecuada con profundidad)
             - 40-59: Regular (respuesta incompleta o con lagunas)
             - 20-39: Débil (intento pero errores significativos o muy superficial)
             - 10-19: Muy débil (intento mínimo, respuesta muy superficial, casi sin contenido)
             - 0: Sin valor (vacia, irrelevante, "no sé", sin intento real - NUNCA intenta).

            2. **timeComment**:
             - "Muy corto": respuesta rápida (usualmente mala señal)
             - "Adecuado": tiempo esperado para el nivel y el tipo
             - "Muy largo": respuesta muy extensa (puede indicar divagación) 

            3. **Contenido - Por CADA pregunta**:
             -No inventes tecnologias o conceptos que el candidato no mencionó
             - Diferencia entre sin intento (score 0), intento mínimo (10-19), e intento real (20+)
             - Feedback: 1-2 oraciones, especifico, señala qué estuvo bien Y qué faltó
             - Strengths: máximo 2, comportamientos observables en esta respuesta
              Ejemplos: "Explica conceptos con ejemplos prácticos", "Demuestra comprensión profunda"
             - Improvements: máximo 2-3, especificos a esta pregunta
              Ejemplos: "Profundizar en cómo X funciona", "Estructurar mejor las explicaciones"
 
           4. **Recommendations - PATRONES entre TODAS las preguntas**:
             - Analiza todas las respuestas buscando patrones débiles:
             - Respuestas breves en 3+ preguntas → "Practicar explicaciones estructuradas"
             - Falta profundidad en conceptos → "Profundizar en fundamentos de [tecnología]"
             - Confunde conceptos relacionados → "Aclarar diferencias entre [concepto A] y [concepto B]"
             - Máximo 3 recomendaciones, específicas y accionables
             - Deben abordar problemas COMUNES en múltiples respuestas

            5. **NextSteps - Pasos concretos PRIORIZADOS**:
             - Máximo 3 acciones, ordenadas por IMPACTO (lo más importante primero)
             - Cada una debe tener: acción + razón basada en las respuestas
             - Formato: "[Número]. [Acción específica] - razón: [observación de las respuestas]"
             - Ejemplos:
              "1. Estudiar [concepto específico] - razón: respondiste mal sobre esto en P2"
              "2. Practicar explicaciones más estructuradas - razón: tus respuestas fueron muy breves"
              "3. Revisar fundamentos de [tema] - razón: hay lagunas en conceptos básicos"

            CONTEXTO:
             -Rol: ${s.config.role}
             - Nivel: ${s.config.experiencia}
             - Tipo de entrevista: ${s.config.tipo}

            Devuelve SOLO el JSON, sin markdown ni explicaciónes.`;

    const user = [
        {
            text: `Evaluación de ${answered.length} respuestas:

            ${compact.map(q => `Pregunta ${q.index} (${q.type}, ${q.timeSec}s)
            Q: ${q.question}
            A: ${q.answer}
            ---`).join("\n")}`
        }
    ];

    return { system, user };
}