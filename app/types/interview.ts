export type Difficulty = 1|2|3|4|5;
export type Tag = 'Técnica' | 'Comportamental' | 'Diseño' | 'Mixta';

export interface InterviewConfig {
    role: string;
    experiencia: "Junior" | "Mid-Level" | "Senior";
    tipo: "Técnica" | "Comportamental" | "Diseño de Sistemas" | "Mixta";
    duracion: number;
    dificultad: 1 | 2 | 3 | 4 | 5;
}

export type QA = {
    question: string;
    type: "Técnica" | "Comportamental" | "Diseño de Sistemas" | "Mixta";
    difficulty: number;
    preface?: string;
    answer?: string;
} 

export interface Answer {
    text: string;
    timeMs: number;
    score?: number;
    strengths?: string[];
    improvements?: string[];
    topicsToReview?: string[];
}

export interface SessionState {
    id: string;
    config: InterviewConfig;
    startedAt: number;
    planned: number;
    history: QA[];
}