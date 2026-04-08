import { type SessionState } from "@/types/interview";

export function answeredCount(s: SessionState) {
    return s.history.filter(h => !!h.answer && !h.skipped).length;
}

export function completedCount(s: SessionState) {
    return s.history.filter(h => h.skipped || h.answer !== undefined).length;
}

export function isTimeUp(s: SessionState, now = Date.now()) {
    return now >= s.endsAt;
}

export function hasFinished(s: SessionState, now = Date.now()) {
    const timeUp = isTimeUp(s, now);
    const finishedByCount = completedCount(s) >= s.planned;
    return {
        done: timeUp || finishedByCount,
        endedBy: timeUp ? "time" : (finishedByCount ? "count" : null) as "time" | "count" | null
    };
}

export function hudFromSession(s: SessionState, now = Date.now()) {
  const baseNow = now;
  const totalSec = s.config.duracion * 60;

  const remainingSec = Math.max(0, Math.floor((s.endsAt - baseNow) / 1000));
  const elapsedSec   = Math.max(0, totalSec - remainingSec);

  const answered = answeredCount(s);
  return { total: s.planned, answered, elapsedSec, remainingSec, paused: !!s.pausedAt };
}