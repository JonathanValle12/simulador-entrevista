'use client';

import { useEffect, useRef, useState } from "react";
import AnswerBox from "./components/AnswerBox";
import ControlsCard from "./components/ControlsCard";
import NextQuestion from "./components/NextQuestion";
import ProgressCard from "./components/ProgressCard";
import QuestionCard from "./components/QuestionCard";
import Stage from "./components/Stage";
import TipsCard from "./components/TipsCard";
import type { QA, SessionState } from "@/app/types/interview";

export default function InterviewClient({ sessionId }: { sessionId: string }) {

    const [state, setState] = useState<SessionState | null>(null);
    const [question, setQuestion] = useState<QA | null>(null);
    const [preface, setPreface] = useState<string | null>(null);
    const [answer, setAnswer] = useState("");
    const initRef = useRef(false);

    useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    (async () => {
      try {
        const s: SessionState = await fetch(`/api/interview/${sessionId}/state`).then(r => r.json());
        setState(s);

        // ¿Hay pendiente?
        const last = s.history.at(-1);
        if (last && !last.answer) {
          setQuestion(last);
          setPreface(null);
          return; // NO llamamos a /next
        }

        // No hay pendiente: pedir la primera/siguiente
        const raw = await fetch(`/api/interview/${sessionId}/next`, { method: "POST" }).then(r => r.json());
        const first = raw?.next ?? raw;
        setPreface(raw?.preface ?? null);
        setQuestion(first);
      } catch (e) {
        console.error("[init] error:", e);
      }
    })();
  }, [sessionId]);

    const total = state?.planned ?? 0;
    const answered = state?.history?.filter(h => !!h.answer).length ?? 0;
    const current = Math.min(answered + 1, total || 1);
    const percent = total ? Math.round((answered / total) * 100) : 0;

    async function submitAnswer() {
        if (!answer.trim()) return;
        try {
            // Una sola llamada: guarda la respuesta y devuelve { preface, next }
            const raw = await fetch(`/api/interview/${sessionId}/next`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer }),
            }).then(r => r.json());

            setAnswer("");
            setPreface(raw?.preface ?? null);
            const nextQ = raw?.next ?? raw;
            setQuestion(nextQ);

            const s = await fetch(`/api/interview/${sessionId}/state`).then(r => r.json());
            setState(s);
        } catch (e) {
            console.error("[submit] error:", e);
        }
    }

    async function handleSkip() {
        try {
            const q = await fetch(`/api/interview/${sessionId}/next`, { method: "POST" }).then(r => r.json());
            setAnswer("");
            setQuestion(q);
            const s = await fetch(`/api/interview/${sessionId}/state`).then(r => r.json());
            setState(s);
        } catch (e) {
            console.error("[skip] error:", e);
        }
    }


    return (
        <div className="mx-auto w-full max-w-7xl px-2 lg:px-6 py-3.5">
            <div className="flex justify-between items-center">
                <p className="text-base text-slate-700 text-sm">Pregunta {current} de {total || "-"}</p>
                <p className="text-base text-slate-700 text-sm">{percent}% Completado</p>
            </div>
            <div aria-hidden className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-2 w-0/5 rounded-full bg-blue-600" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3 mt-6">
                <section className="space-y-4 lg:col-span-2">

                    <article className="rounded-2xl bg-slate-900 p-4 text-slate-100 shadow-sm">
                        <Stage />
                        <QuestionCard q={question} preface={preface ?? undefined} />
                    </article>
                    <AnswerBox
                        value={answer}
                        onChange={setAnswer}
                        onSubmit={submitAnswer}
                        onSkip={handleSkip}
                        meta={{ type: question?.type, difficulty: question?.difficulty }}
                    />
                </section>

                <aside className="space-y-6">
                    <ControlsCard />
                    <ProgressCard />
                    <TipsCard />
                    <NextQuestion />
                </aside>
            </div>
        </div>
    )
}