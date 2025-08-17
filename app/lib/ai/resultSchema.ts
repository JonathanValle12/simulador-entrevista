export const resultSchema = {
    type: "object",
    properties: {
        overallScore: { type: "integer", minimum: 0, maximum: 100 },
        recommendations: { type: "array", items: { type: "string" }, maxItems: 6 },
        nextSteps: { type: "array", items: { type: "string" }, maxItems: 6 },
        questions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    index: { type: "integer" },
                    score: { type: "integer", minimum: 0, maximum: 100 },
                    feedback: { type: "string" },
                    strengths: { type: "array", items: { type: "string" }, maxItems: 5 },
                    improvements: { type: "array", items: { type: "string" }, maxItems: 5 },
                    timeComment: { type: "string", enum: ["Muy corto", "Adecuado", "Muy largo"] }
                },
                required: ["index", "score", "feedback", "strengths", "improvements", "timeComment"],
                additionalProperties: false
            }
        }
    },
    required: ["overallScore", "recommendations", "nextSteps", "questions"],
    additionalProperties: false,
} as const;