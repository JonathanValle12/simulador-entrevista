import { type QA, type Difficulty } from "./interview";

export type TimeComment = "Muy corto" | "Adecuado" | "Muy largo";
export type EfficiencyLabel = "Excelente" | "Buena" | "Mejorable";

export type QAResult = {
    index: number;
    question: string;
    type: QA["type"],
    difficulty: Difficulty;
    answer: string;
    timeSec: number;
    score: number;
    feedback: string;
    strengths: string[],
    improvements: string[];
    timeComment: TimeComment;
}

export type InterviewResult = {
    sessionId: string;
    totalAnswered: number;
    totalPlanned: number;
    overallScore: number;
    time: {
        totalSec: number;
        avgPerQuestionSec: number;
        efficiencyLabel: EfficiencyLabel;
    },
    recommendations: string[],
    nextSteps: string[],
    questions: QAResult[];
}