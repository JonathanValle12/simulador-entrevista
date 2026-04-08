import { type QA, QuestionType, ConfigType } from "./interview";

export type TimeComment = "Muy corto" | "Adecuado" | "Muy largo";
export type EfficiencyLabel = "Excelente" | "Buena" | "Mejorable";

export type QAResult = {
    index: number;
    question: string;
    type: QA["type"],
    answer: string;
    timeSec: number;
    score: number;
    feedback: string;
    strengths: string[],
    improvements: string[];
    timeComment: TimeComment;
}

export type SkippedItem = {
    index: number;
    question: string;
    timeSec: number;
    type: QuestionType;
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

    mode: ConfigType;
    stack: string[];
    skipped: SkippedItem[];
}