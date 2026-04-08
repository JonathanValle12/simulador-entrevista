'use client';

import { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';
import type { SessionState } from '@/types/interview';
import { useHUD } from '@/components/interview/run/context/HudContext';

export function useSessionClock(sessionId: string, initialState?: SessionState | null) {
  const { setHUD, paused: hudPaused, total: hudTotal, answered: hudAnswered } = useHUD();

  const [state, setState] = useState<SessionState | null>(initialState ?? null);
  const [now, setNow] = useState(() => Date.now());

  const S = state ?? initialState ?? null;
  const isPaused = !!S?.pausedAt;

  const baseNow = isPaused ? (S?.pausedAt as number) : now;
  const totalSec = S ? S.config.duracion * 60 : 0;
  const remainingSec = S ? Math.max(0, Math.floor((S.endsAt - baseNow) / 1000)) : 0;
  const elapsedSec = S ? Math.max(0, totalSec - remainingSec) : 0;

  // Intervalo solo en vivo
  useEffect(() => {
    if (!S || isPaused) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [S, isPaused]);

  // Primer snapshot si venía en pausa
  useEffect(() => {
    if (initialState?.pausedAt) {
      const base = initialState.pausedAt as number;
      const r = Math.max(0, Math.floor((initialState.endsAt - base) / 1000));
      const e = Math.max(0, (initialState.config.duracion * 60) - r);
      setHUD({ paused: true, remainingSec: r, elapsedSec: e });
    }
  }, []);

  // HUD contadores
  const totalFromS = S?.planned ?? 0;
  const answeredFromS = S?.history?.filter(h => !!h.answer)?.length ?? 0;
  const completedFromS = answeredFromS;
  const total = S ? totalFromS : (hudTotal || 0);
  const completed = S ? completedFromS : Math.min(hudAnswered || 0, total || 0);
  const current = Math.min(completed + 1, total || 1);
  const percent = total ? Math.round((completed / total) * 100) : 0;

  useLayoutEffect(() => {
    if (!S) return;
    setHUD({
      total,
      answered: answeredFromS,
      completed: completedFromS,
      elapsedSec,
      remainingSec,
      paused: isPaused,
    });
  }, [S, total, answeredFromS, completedFromS, elapsedSec, remainingSec, isPaused, setHUD]);

  // ✅ MEMOIZA el return para que los valores sean estables
  return useMemo(() => ({
    state: S,
    setState,
    isPaused,
    current,
    total,
    percent,
  }), [S, setState, isPaused, current, total, percent]);
}