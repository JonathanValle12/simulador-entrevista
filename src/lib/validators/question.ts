
export const questionSchema = {
    type: "object",
    properties: {
        preface: { type: "string" },
        question: { type: "string" },
        type: { type: "string", enum: ["Técnica", "Comportamental", "Diseño de Sistemas"]}
    },
    required: ["question", "type", "difficulty"],
    additionalProperties: false,
} as const;