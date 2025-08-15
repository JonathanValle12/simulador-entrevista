import type { SessionState, InterviewConfig, QA } from "../types/interview";

type Store = Map<string, SessionState>;

declare global {
  var _interviewStore: Store | undefined;
}

const store: Store = global._interviewStore ?? (global._interviewStore = new Map());

export function createSession(id: string, config: InterviewConfig): SessionState {
    const existing = store.get(id);
    if (existing) return existing;

    const planned = Math.min(10, Math.max(3, Math.round(config.duracion / 5)));
    const state: SessionState = { id, config, startedAt: Date.now(), planned, history: [] };
    store.set(id, state);
    return state;
}

export function getSession(id: string) {
    return store.get(id);
}

export function pushQuestion(id: string, qa: QA){
    const s = store.get(id);
    if(!s) return;

    s.history.push(qa);
}

export function answerCurrent(id: string, answer: string) {
    const s = store.get(id);
    if (!s) return;

    const last = s.history.at(-1);
    if (last && !last.answer) last.answer = answer;
}

export function resetStore() {
  store.clear();
}