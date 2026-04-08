'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const AUTOBACK_SEC = 8;
const TIMEOUT_MS = 10_000;

export function useAutoBackGuard(onAutoBack: () => void) {
  const [timedOut, setTimedOut] = useState(false);
  const [autoBackActive, setAutoBackActive] = useState(false);
  const [autoBackSec, setAutoBackSec] = useState(AUTOBACK_SEC);

  const waitingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoBackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoBackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAutoBack = useCallback(() => {
    if (autoBackTimeoutRef.current) clearTimeout(autoBackTimeoutRef.current);
    if (autoBackIntervalRef.current) clearInterval(autoBackIntervalRef.current);
    autoBackTimeoutRef.current = null;
    autoBackIntervalRef.current = null;
    setAutoBackActive(false);
  }, []);

  const clearGuard = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    waitingRef.current = false;
    setTimedOut(false);
    stopAutoBack();
  }, [stopAutoBack]);

  const startAutoBack = useCallback(() => {
    stopAutoBack();
    setAutoBackActive(true);
    setAutoBackSec(AUTOBACK_SEC);
    autoBackIntervalRef.current = setInterval(() => {
      setAutoBackSec(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    autoBackTimeoutRef.current = setTimeout(onAutoBack, AUTOBACK_SEC * 1000);
  }, [onAutoBack, stopAutoBack]);

  const startGuard = useCallback((ms = TIMEOUT_MS, withAutoBack = true) => {
    clearGuard();
    waitingRef.current = true;
    timeoutRef.current = setTimeout(() => {
      if (!waitingRef.current) return;
      setTimedOut(true);
      if (withAutoBack) startAutoBack();
    }, ms);
  }, [clearGuard, startAutoBack]);

  useEffect(() => () => clearGuard(), [clearGuard]);

  return {
    // state
    timedOut, autoBackActive, autoBackSec, waitingRef,
    // controls
    startGuard, clearGuard, stopAutoBack,
  };
}
