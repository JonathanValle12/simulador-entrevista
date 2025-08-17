import { type QA } from "./interview";

export type QAResult = {
    index: number;
    question: string;
    type: QA["type"],
    difficulty: number;
    answer: string;
    timeSec: number;
    score: number;
    feedback: string;
    strengths: string[],
    improvements: string[];
    timeComment: "Muy corto" | "Adecuado" | "Muy largo";
}

export type InterviewResult = {
    sessionId: string;
    totalAnswered: number;
    totalPlanned: number;
    overallScore: number;
    time: {
        totalSec: number;
        avgPerQuestionSec: number;
        efficiencyLabel: "Excelente" | "Buena" | "Mejorable"
    },
    recommendations: string[],
    nextSteps: string[],
    questions: QAResult[];
}