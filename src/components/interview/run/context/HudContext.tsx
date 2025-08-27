'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import type { QuestionType, Difficulty } from '@/types/interview';

type HUDState = {
  total: number;
  answered: number;
  completed: number;
  elapsedSec: number;
  remainingSec: number;
  paused: boolean;
  chipType?: QuestionType;
  chipDifficulty?: Difficulty;
};

type HUDCtx = HUDState & {
  setHUD: (p: Partial<HUDState>) => void;
  setPaused: (p: boolean) => void;
};

const Ctx = createContext<HUDCtx | null>(null);

export function HUDProvider({
  children,
  initial,
}: {
  children: React.ReactNode;
  initial?: Partial<HUDState>;
}) {
  const [hud, setHud] = useState<HUDState>({
    total: 0,
    answered: 0,
    completed: 0,
    elapsedSec: 0,
    remainingSec: 0,
    paused: false,
    ...(initial ?? {}),
  });

  const setHUD = useCallback((p: Partial<HUDState>) => {
    setHud(prev => {
      const next = { ...prev, ...p };
      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
    });
  }, []);

  const setPaused = useCallback((p: boolean) => {
    setHud(prev => (prev.paused === p ? prev : { ...prev, paused: p }));
  }, []);

  return <Ctx.Provider value={{ ...hud, setHUD, setPaused }}>{children}</Ctx.Provider>;
}

export function useHUD() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useHUD must be used inside HUDProvider');
  return v;
}