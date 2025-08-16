'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AnswerBox from "./components/AnswerBox";
import ControlsCard from "./components/ControlsCard";
import ProgressCard from "./components/ProgressCard";
import QuestionCard from "./components/QuestionCard";
import Stage from "./components/Stage";
import TipsCard from "./components/TipsCard";
import type { QA, SessionState } from "@/app/types/interview";
import { useHUD } from "./hud";

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
  const { setHUD, paused, total: hudTotal, answered: hudAnswered } = useHUD();

  // semilla desde SSR
  const [state, setState] = useState<SessionState | null>(initialState ?? null);
  const [question, setQuestion] = useState<QA | null>(initialQuestion ?? null);
  const [preface, setPreface] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [answer, setAnswer] = useState("");
  const [loadingNext, setLoadingNext] = useState(false);
  const initRef = useRef(false);

  // helpers
  const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
  const ranges: Record<SessionState["config"]["experiencia"], [number, number]> = {
    Junior: [1, 3],
    "Mid-Level": [2, 4],
    Senior: [3, 5],
  };

  // tick local
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // init: refrescar estado y, si no hay pendiente, pedir la primera
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      try {
        const s: SessionState = await fetch(`/api/interview/${sessionId}/state`, { cache: 'no-store' }).then(r => r.json());
        setState(s);

        // si ya venías con pregunta pendiente por SSR, no pidas nada
        const last = s.history.at(-1);
        if (last && !last.answer) {
          setQuestion(last);
          setPreface(last.preface ?? null);
          return;
        }

        setLoadingNext(true);
        const raw = await fetch(`/api/interview/${sessionId}/next`, { method: "POST" }).then(r => r.json());
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

  // refresca al pausar/reanudar
  useEffect(() => {
    (async () => {
      const s: SessionState = await fetch(`/api/interview/${sessionId}/state`, { cache: 'no-store' }).then(r => r.json());
      setState(s);
    })();
  }, [paused, sessionId]);

  // usa el mejor estado disponible (CSR o SSR)
  const S = state ?? initialState ?? null;

  // progreso
  const totalFromS = S?.planned ?? 0;
  const answeredFromS = S?.history?.filter(h => !!h.answer).length ?? 0;
  const completedFromS = S?.history?.filter(h => h.skipped || h.answer !== undefined).length ?? 0;

  const total = S ? totalFromS : (hudTotal || 0);
  const completed = S ? completedFromS : Math.min(hudAnswered || 0, total || 0);
  const current = Math.min(completed + 1, total || 1);
  const percent = total ? Math.round((completed / total) * 100) : 0;

  // tiempos con pausa
  const baseNow = S?.pausedAt ? S.pausedAt : now;
  const plannedMs = S ? S.config.duracion * 60_000 : 0;
  const totalPausedMs = S ? Math.max(0, S.endsAt - (S.startedAt + plannedMs)) : 0;
  const elapsedSec = S ? Math.max(0, Math.floor((baseNow - S.startedAt - totalPausedMs) / 1000)) : 0;
  const remainingSec = S ? Math.max(0, Math.floor((S.startedAt + plannedMs + totalPausedMs - baseNow) / 1000)) : 0;

  // publica al HUD
  useEffect(() => {
    if (!S) return;
    setHUD({
      total,
      answered: answeredFromS,
      elapsedSec,
      remainingSec,
      paused: !!S.pausedAt,
    });
  }, [S, total, answeredFromS, elapsedSec, remainingSec, setHUD]);

  async function submitAnswer() {
    if (!answer.trim()) return;
    try {
      setLoadingNext(true);
      const raw = await fetch(`/api/interview/${sessionId}/next`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      }).then(r => r.json());
      setLoadingNext(false);

      if (raw?.done) { router.push(`/entrevista/${sessionId}/resultado`); return; }

      setPreface(raw?.preface ?? null);
      const nextQ = raw?.next ?? raw;
      setQuestion(nextQ);
      setAnswer("");

      const s = await fetch(`/api/interview/${sessionId}/state`, { cache: 'no-store' }).then(r => r.json());
      setState(s);
    } catch (e) {
      setLoadingNext(false);
      console.error("[submit] error:", e);
    }
  }

  async function handleSkip() {
    try {
      setLoadingNext(true);
      const raw = await fetch(`/api/interview/${sessionId}/next`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skip: true }),
      }).then(r => r.json());
      setLoadingNext(false);

      if (raw?.done) { router.push(`/entrevista/${sessionId}/resultado`); return; }

      setPreface(raw?.preface ?? null);
      const q = raw?.next ?? raw;
      setAnswer("");
      setQuestion(q);

      const s = await fetch(`/api/interview/${sessionId}/state`, { cache: "no-store" }).then(r => r.json());
      setState(s);
    } catch (e) {
      setLoadingNext(false);
      console.error("[skip] error:", e);
    }
  }

  // chips fallback para la PRIMERA pintura si aún no hay question
  const fallbackType =
    S ? (S.config.tipo === "Mixta" ? "Comportamental" : S.config.tipo) : undefined;
  const fallbackDifficulty =
    S ? (() => {
      const [minD, maxD] = ranges[S.config.experiencia];
      return clamp(S.config.dificultad, minD, maxD);
    })() : undefined;

  const metaForBox = {
    type: question?.type ?? fallbackType,
    difficulty: question?.difficulty ?? fallbackDifficulty,
  };

  const barPercent = Math.max(0, Math.min(100, percent));

  // 👉 cambio clave: `instant` sólo si la combinación actual == combinación inicial (SSR)
  const currentComboKey = `${preface ?? question?.preface ?? ""}|${question?.question ?? ""}`;
  const initialComboKey = `${initialQuestion?.preface ?? ""}|${initialQuestion?.question ?? ""}`;
  const instant = !!initialComboKey && currentComboKey === initialComboKey;

  return (
    <div className="mx-auto w-full max-w-7xl px-2 lg:px-6 py-3.5">
      <div className="flex justify-between items-center">
        <p className="text-base text-slate-700 text-sm">
          Pregunta {current} de {total || "-"}
        </p>
        <p className="text-base text-slate-700 text-sm">{percent}% Completado</p>
      </div>

      <div aria-hidden className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-500 ease-out"
          style={{ width: `${barPercent}%` }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        <section className="space-y-4 lg:col-span-2">
          <article className="rounded-2xl bg-slate-900 p-4 text-slate-100 shadow-sm">
            <Stage />
            <QuestionCard
              key={currentComboKey}
              q={question}
              preface={preface ?? question?.preface ?? undefined}
              sessionId={sessionId}
              instant={instant}   // ✅ sólo para la combinación inicial
            />
          </article>
          <AnswerBox
            value={answer}
            onChange={setAnswer}
            onSubmit={submitAnswer}
            onSkip={handleSkip}
            meta={metaForBox}
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