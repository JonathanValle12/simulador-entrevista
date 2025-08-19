import type { SessionState, InterviewConfig, QA } from "@/app/types/interview";

type Store = Map<string, SessionState>;
declare global { var _interviewStore: Store | undefined; }
const store: Store = global._interviewStore ?? (global._interviewStore = new Map());

// ⏱️ minutos por pregunta (más ágiles para que en 30' salgan ~14–18)
function avgMinPerQuestion(cfg: InterviewConfig) {
  const byType = {
    "Técnica": {
      Junior: 2.2,
      "Mid-Level": 2.0,
      Senior: 2.4,
    },
    "Comportamental": {
      Junior: 2.7,
      "Mid-Level": 3.0,
      Senior: 3.2,
    },
    "Diseño de Sistemas": {
      Junior: 5.5,
      "Mid-Level": 6.5,
      Senior: 7.5,
    },
    "Mixta": {
      Junior: 2.4,
      "Mid-Level": 2.6,
      Senior: 2.8,
    },
  } as const;

  const base = byType[cfg.tipo][cfg.experiencia];
  const tweak = (cfg.dificultad - 3) * 0.15;
  return Math.max(1.6, base + tweak);
}

function clamp(n: number, a: number, b: number) { return Math.max(a, Math.min(b, n)); }

const lastChangeAt: Map<string, number> = new Map();

export function createSession(id: string, config: InterviewConfig): SessionState {
  const existing = store.get(id);
  if (existing) return existing;

  const startedAt = Date.now();
  const endsAt = startedAt + config.duracion * 60_000;

  const avg = avgMinPerQuestion(config);
  const rough = Math.round(config.duracion / avg);

  const minPlan = Math.max(6, Math.round(config.duracion / 5));
  const maxPlan = Math.max(minPlan + 4, Math.round(config.duracion / 1.5));
  const planned = clamp(rough, minPlan, maxPlan);

  const state: SessionState = { id, config, startedAt, endsAt, planned, history: [] };
  store.set(id, state);
  lastChangeAt.set(id, Date.now());
  return state;
}

export function getSession(id: string) { return store.get(id); }
export function pushQuestion(id: string, qa: QA) { const s = store.get(id); if (s) s.history.push(qa); }
export function answerCurrent(id: string, answer: string) {
  const s = store.get(id); if (!s) return;
  const last = s.history.at(-1);
  if (!last || last.answer) return;

  const started = lastChangeAt.get(id) ?? Date.now();
  const spent = Math.max(0, Date.now() - started);
  last.answer = answer;
  last.timeMs = spent;
  lastChangeAt.set(id, Date.now());
}
export function resetStore() { store.clear(); }

export function pauseSession(id: string) {
  const s = store.get(id); if (!s) return;
  if (!s.pausedAt) s.pausedAt = Date.now();
}

export function resumeSession(id: string): number {
  const s = store.get(id); if (!s) return 0;
  if (!s.pausedAt) return 0;
  const delta = Date.now() - s.pausedAt;
  s.endsAt += delta;
  s.pausedAt = undefined;
  return delta;
}

export function deleteSession(id: string) {
  store.delete(id);
  lastChangeAt.delete(id);
}