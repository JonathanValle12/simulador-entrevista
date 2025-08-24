
export const questionSchema = {
    type: "object",
    properties: {
        preface: { type: "string" },
        question: { type: "string" },
        type: { type: "string", enum: ["Técnica", "Comportamental", "Diseño de Sistemas"]},
        difficulty: { type: "integer", minimum: 1, maximum: 5 }
    },
    required: ["question", "type", "difficulty"],
    additionalProperties: false,
} as const;