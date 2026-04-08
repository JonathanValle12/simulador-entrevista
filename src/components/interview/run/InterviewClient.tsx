'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { QA, SessionState, QuestionType } from '@/types/interview';

import PromptPane from './ui/PromptPane';
import AnswerBox from './ui/AnswerBox';
import ControlsCard from './ui/ControlsCard';
import ProgressCard from './ui/ProgressCard';
import TipsCard from './ui/TipsCard';

import { useAutoBackGuard } from './hooks/useAutoBackGuard';
import { useSessionClock } from './hooks/useSessionClock';
import { useQuestionFlow } from './hooks/useQuestionFlow';
import { useHUD } from './context/HudContext';

type DisplayType = QuestionType | 'Introducción' | 'Configurar Stack';

const ranges: Record<SessionState['config']['experiencia'], [number, number]> = {
  Junior: [1, 3],
  'Mid-Level': [2, 4],
  Senior: [3, 5],
};
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

export default function InterviewClient({
  sessionId,
  initialState,
  initialQuestion,
}: {
  sessionId: string;
  initialState?: SessionState | null;
  initialQuestion?: QA | null;
}) {
  const router = useRouter();

  console.log('[InterviewClient] rendering with sessionId:', sessionId);

  /*
  // --- AutoBack / Guard (memoizado) ---
  const { timedOut, autoBackActive, autoBackSec, startGuard, clearGuard, stopAutoBack } =
    useAutoBackGuard(() => router.back());

  const guardStart = useCallback(
    (withAutoBack?: boolean) => startGuard(10_000, withAutoBack),
    [startGuard]
  );

const myClearGuard = useCallback(
    () => clearGuard(),
    [clearGuard]
);
  const autoBackKick = useCallback(() => {
    stopAutoBack();
    startGuard(10_000, true);
  }, [stopAutoBack, startGuard]);
  */

  /*
  // --- Reloj + HUD + porcentajes ---
  const {
    state: S,
    setState,
    isPaused,
    current,
    total,
    percent,
  } = useSessionClock(sessionId, initialState);
  

  // --- Flujo de preguntas (submit/skip/retry) ---
  const {
    question,
    preface,
    canSkip,
    loadingNext,
    timedOut: flowTimedOut,
    submitAnswer,
    skip,
    retryPending,
  } = useQuestionFlow(sessionId, {
    initialQuestion,
    onGuardStart: guardStart,
    onGuardClear: myClearGuard,
    onAutoBackStart: autoBackKick,
  });

  */



  const { setHUD, paused: hudPaused, total: hudTotal, answered: hudAnswered } = useHUD();


  // --- UI state ---
  const [state, setState] = useState<SessionState | null>(initialState ?? null);
  const [question, setQuestion] = useState<QA | null>(initialQuestion ?? null);
  const [preface, setPreface] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [answer, setAnswer] = useState("");
  const [loadingNext, setLoadingNext] = useState(false);
  const initRef = useRef(false);
  type NextPayload = { answer?: string; skip?: true };
  const S = state ?? initialState ?? null;

  // --- Meta de la tarjeta / chips ---
  const historyLen = S?.history?.length ?? 0;
  const lastQA = S?.history?.at(-1);
  const lastUnanswered = !!lastQA && !lastQA.answer;
  const hasStack = (S?.config?.stack?.length ?? 0) > 0;

  // HUD contadores
  const totalFromS = S?.planned ?? 0;
  const answeredFromS = S?.history?.filter(h => !!h.answer)?.length ?? 0;
  const completedFromS = answeredFromS;
  const total = S ? totalFromS : (hudTotal || 0);
  const completed = S ? completedFromS : Math.min(hudAnswered || 0, total || 0);
  const current = Math.min(completed + 1, total || 1);
  const percent = total ? Math.round((completed / total) * 100) : 0;

  const baseNow = S?.pausedAt ? S.pausedAt : now;
  const plannedMs = S ? S.config.duracion * 60_000 : 0;
  const totalPausedMs = S ? Math.max(0, S.endsAt - (S.startedAt + plannedMs)) : 0;
  const elapsedSec = S ? Math.max(0, Math.floor((baseNow - S.startedAt - totalPausedMs) / 1000)) : 0;
  const remainingSec = S ? Math.max(0, Math.floor((S.startedAt + plannedMs + totalPausedMs - baseNow) / 1000)) : 0;

  const displayType: DisplayType | undefined = useMemo(() => {
    const fallbackType: QuestionType | undefined =
      S ? (S.config.tipo === 'Mixta' ? 'Comportamental' : S.config.tipo) : undefined;

    if (historyLen === 0 || (!hasStack && lastUnanswered && historyLen === 1)) return 'Introducción';
    if (!hasStack && lastUnanswered && historyLen >= 2) return 'Configurar Stack';
    return question?.type ?? fallbackType;
  }, [S, historyLen, hasStack, lastUnanswered, question?.type]);

  const metaForBox = {
    type: displayType,
  };

  const lastPayloadRef = useRef<NextPayload | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const barPercent = Math.max(0, Math.min(100, percent));

  const currentComboKey = `${preface ?? question?.preface ?? ''}|${question?.question ?? ''}`;
  const initialComboKey = `${initialQuestion?.preface ?? ''}|${initialQuestion?.question ?? ''}`;
  const instant = !!initialComboKey && currentComboKey === initialComboKey;
  const showMetaInQuestionCard = displayType !== 'Introducción' && displayType !== 'Configurar Stack';

  const [timedOut, setTimedOut] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  function isAbortError(e: unknown) {
    return e instanceof DOMException && e.name === 'AbortError';
  }
  const showTimeout = timedOut;

  const isPaused = !!S?.pausedAt;

  useEffect(() => {
    if (isPaused) return; // No actualices el reloj si está pausado

    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [isPaused]);

  useEffect(() => {
    const syncState = async () => {
      try {
        const s: SessionState = await fetch(`/api/interview/${sessionId}/state`, { cache: 'no-store' }).then(r => {
          if (!r.ok) throw new Error(`State failed: ${r.status}`);
          return r.json();
        });
        setState(s);
      } catch (e) {
        console.error("[syncState] error:", e);
      }
    };

    // Solo sincroniza cuando se pausa/reanuda (cuando hudPaused cambia)
    // y espera un pequeño delay para que el servidor procese
    const timer = setTimeout(syncState, 100);
    return () => clearTimeout(timer);
  }, [hudPaused, sessionId]);

  useEffect(() => {
    if (!S) return;
    setHUD({ total, answered: answeredFromS, completed: completedFromS, elapsedSec, remainingSec, paused: !!S.pausedAt, });
  }, [S, total, answeredFromS, completedFromS, elapsedSec, remainingSec, setHUD]);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      try {
        const s: SessionState = await fetch(`/api/interview/${sessionId}/state`, { cache: 'no-store' }).then(r => {
          if (!r.ok) throw new Error(`State failed: ${r.status}`);
          return r.json();
        });
        setState(s);

        const last = s.history.at(-1);
        if (last && !last.answer) {
          setQuestion(last);
          setPreface(last.preface ?? null);
          return;
        }

        setLoadingNext(true);
        const nextRes = await fetch(`/api/interview/${sessionId}/next`, { method: "POST" });
        if (!nextRes.ok) {
          const errorText = await nextRes.text();
          throw new Error(`Next failed: ${nextRes.status} - ${errorText}`);
        }
        const raw = await nextRes.json();
        setLoadingNext(false);

        if (raw?.done) { router.push(`/entrevista/${sessionId}/resultado`); return; }

        const first = raw?.next ?? raw;
        setPreface(raw?.preface ?? null);
        setQuestion(first);
      } catch (e) {
        setLoadingNext(false);
        console.error("[init] error:", e);
      }
    })();
  }, [sessionId, router]);

  function beginTransition(payload: NextPayload) {
    lastPayloadRef.current = payload;
    setLoadingNext(true);
    setTimedOut(false);
    setCanSkip(false);
    setPreface(null);
    setQuestion(null);
    //onGuardStart(true);
    abortRef.current?.abort();
    abortRef.current = new AbortController();
  }

  async function finishTransition(raw: unknown) {
    try {
      const r = raw as { done?: boolean; next?: QA; canSkip?: boolean; preface?: string | null } | QA;
      if ((r as { done?: boolean }).done) {
        window.location.assign(`/entrevista/${sessionId}/resultado`);
        return;
      }
      const nextQ: QA = (r as { next?: QA }).next ?? (r as QA);
      setPreface((r as { preface?: string | null }).preface ?? nextQ?.preface ?? null);
      setQuestion(nextQ);
      setCanSkip((r as { canSkip?: boolean }).canSkip ?? true);
      setAnswer("");

      const s = await fetch(`/api/interview/${sessionId}/state`, { cache: "no-store" }).then(r => {
        if (!r.ok) throw new Error(`State failed: ${r.status}`);
        return r.json();
      });
      setState(s);
    } finally {
      //onGuardClear();
      setLoadingNext(false);
    }
  }
  const submitAnswer = async () => {
    if (!answer.trim()) return;
    try {
      beginTransition({ answer });
      const r = await fetch(`/api/interview/${sessionId}/next`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current?.signal,
        body: JSON.stringify({ answer }),
      });
      if (!r.ok) throw new Error(`next submit failed: ${r.status}`);

      const raw = await r.json();

      if (raw?.isRegenerated) {
        console.log("[submitAnswer Q2 rechazada, mostrando animación");
        setQuestion(null);
        setPreface(null);

        setTimeout(() => {
          setPreface(raw?.preface ?? null);
          setQuestion(raw?.next);
        }, 50);

        setAnswer(""); // ← Limpia el input
        setLoadingNext(false);
        return;
      }
      await finishTransition(raw);

      const s = await fetch(`/api/interview/${sessionId}/state`, { cache: "no-store" }).then(r => {
        if (!r.ok) throw new Error(`State failed: ${r.status}`);
        return r.json();
      });
      setState(s);
    } catch (e) {
      if (isAbortError(e)) return;
      console.warn('[submitAnswer] error:', e);
      setTimedOut(true);
      setLoadingNext(false);
    }
  }

  async function handleSkip() {
    try {
      setLoadingNext(true);
      const nextRes = await fetch(`/api/interview/${sessionId}/next`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skip: true }),
      });
      if (!nextRes.ok) {
        const errorText = await nextRes.text();
        throw new Error(`Skip failed: ${nextRes.status} - ${errorText}`);
      }
      const raw = await nextRes.json();
      setLoadingNext(false);

      if (raw?.done) { router.push(`/entrevista/${sessionId}/resultado`); return; }

      setPreface(raw?.preface ?? null);
      const q = raw?.next ?? raw;
      setAnswer("");
      setQuestion(q);

      const s = await fetch(`/api/interview/${sessionId}/state`, { cache: "no-store" }).then(r => {
        if (!r.ok) throw new Error(`State failed: ${r.status}`);
        return r.json();
      });
      setState(s);
    } catch (e) {
      setLoadingNext(false);
      console.error("[handleSkip] error:", e);
    }
  }

  async function retryPending() {
    if (!lastPayloadRef.current) return;
    try {
      setTimedOut(false);
      //onGuardStart(true);
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      const r = await fetch(`/api/interview/${sessionId}/next`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify(lastPayloadRef.current),
      });
      if (!r.ok) throw new Error(`next retry failed: ${r.status}`);
      const raw = await r.json();
      await finishTransition(raw);
    } catch (e) {
      if (isAbortError(e)) return;
      console.warn('[useQuestionFlow] retry error:', e);
      setTimedOut(true);
      //onAutoBackStart();
      //onGuardClear();
      setLoadingNext(false);
    }
  }

  /*
    // --- Handlers UI ---
  const onSubmit = useCallback(async () => {
    if (!answer.trim()) return;
    await submitAnswer(answer);
    setAnswer('');
    // refresca estado para reloj/HUD
    const s: SessionState = await fetch(`/api/interview/${sessionId}/state`, { cache: 'no-store' }).then(r => r.json());
    setState(s);
  }, [answer, submitAnswer, sessionId, setState]);

  const onSkip = useCallback(async () => {
    await skip();
    const s: SessionState = await fetch(`/api/interview/${sessionId}/state`, { cache: 'no-store' }).then(r => r.json());
    setState(s);
  }, [skip, sessionId, setState]);
  */

  // --- Render ---
  return (
    <div className="mx-auto w-full max-w-7xl px-2 lg:px-6 py-3.5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-700">Pregunta {current} de {total || '-'}</p>
        <p className="text-sm text-slate-700">{percent}% Completado</p>
      </div>

      <div aria-hidden className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-blue-600 transition-[width] duration-500 ease-out" style={{ width: `${barPercent}%` }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        <section className="space-y-4 lg:col-span-2">
          {showTimeout && (
            <div className="rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-800 p-3 text-sm flex flex-wrap items-center gap-3">
              <span>Está tardando más de lo normal.</span>
              <span className="text-yellow-900">Volviendo atrás en <strong>s</strong>…</span>
              <div className="ml-auto flex gap-2">
                <button onClick={() => router.back()} className="px-3 py-1.5 rounded-md border border-yellow-400 bg-white">Volver atrás ahora</button>
                <button onClick={retryPending} className="px-3 py-1.5 rounded-md border border-yellow-400 bg-white">Reintentar</button>
                <button className="px-3 py-1.5 rounded-md border border-transparent underline">Seguir esperando</button>
              </div>
            </div>
          )}

          <PromptPane
            sessionId={sessionId}
            q={question}
            preface={preface ?? undefined}
            instant={instant}
            showMeta={showMetaInQuestionCard}
            paused={isPaused}
          />

          <AnswerBox
            value={answer}
            onChange={setAnswer}
            onSubmit={submitAnswer}
            onSkip={handleSkip}
            meta={metaForBox}
            canSkip={canSkip}
            loading={loadingNext}
          />
        </section>

        <aside className="space-y-6">
          <ControlsCard sessionId={sessionId} />
          <ProgressCard />
          <TipsCard />
        </aside>
      </div>
    </div>
  );
}
