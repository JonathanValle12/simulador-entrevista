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
    const answered = answeredCount(s);
    const plannedMs = s.config.duracion * 60_000;
    const totalPausedMs = Math.max(0, s.endsAt - (s.startedAt + plannedMs));
    const baseNow = s.pausedAt ?? now;

    const elapsedSec = Math.max(0, Math.floor((baseNow - s.startedAt - totalPausedMs) / 1000));
    const remainingSec = Math.max(0, Math.floor((s.startedAt + plannedMs + totalPausedMs - baseNow) / 1000));

    return { total: s.planned, answered, elapsedSec, remainingSec, paused: !!s.pausedAt };
}