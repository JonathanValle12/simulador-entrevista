
export const questionSchema = {
    type: "object",
    properties: {
        question: { type: "string" },
        type: { type: "string", enum: ["Técnica", "Comportamental", "Diseño de Sistemas", "Mixta"]},
        difficulty: { type: "integer", minimum: 1, maximum: 5 }
    },
    required: ["question", "type", "difficulty"],
    additionalProperties: false,
} as const;

export type QuestionPayload = {
    question: string;
    type: "Técnica" | "Comportamental" | "Diseño de Sistemas" | "Mixta";
    difficulty: number;
}