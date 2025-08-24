import type { InterviewResult } from "./result";

export type Difficulty = 1|2|3|4|5;

export const EXPERIENCE_LEVELS = ["Junior","Mid-Level","Senior"] as const;
export const CONFIG_TYPES      = ["Técnica","Comportamental","Diseño de Sistemas","Mixta"] as const;
export const QUESTION_TYPES    = ["Técnica","Comportamental","Diseño de Sistemas"] as const;

export type ExperienceLevel = typeof EXPERIENCE_LEVELS[number];
export type ConfigType      = typeof CONFIG_TYPES[number];
export type QuestionType    = typeof QUESTION_TYPES[number];

export interface InterviewConfig {
    role: string;
    experiencia: ExperienceLevel;
    tipo: ConfigType;
    duracion: number;
    dificultad: Difficulty;
}

export type QA = {
    question: string;
    type: QuestionType;
    difficulty: Difficulty;
    preface?: string;
    answer?: string;
    skipped?: boolean;
    timeMs?: number;
}

export type SessionState = {
  id: string;
  config: InterviewConfig;
  startedAt: number;
  endsAt: number;
  planned: number;
  history: QA[];
  pausedAt?: number;

  result?: InterviewResult;
}