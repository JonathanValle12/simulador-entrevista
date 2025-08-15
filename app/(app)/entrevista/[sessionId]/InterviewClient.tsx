'use client';

import { useEffect, useState } from "react";
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
    const [answer, setAnswer] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const s = await fetch(`/api/interview/${sessionId}/state`).then(r => r.json());
            console.log("[state]", s);
            setState(s);
            const q = await fetch(`/api/interview/${sessionId}/next`, { method: "POST" }).then(r => r.json());
            console.log("[next-question]", q);
            setQuestion(q);
            } catch(e) {
                console.error("[init] error: ", e);
            }
        })();
    }, [sessionId]);

    return (
        <div className="mx-auto w-full max-w-7xl px-2 lg:px-6 py-3.5">
            <div className="flex justify-between items-center">
                <p className="text-base text-slate-700 text-sm">Pregunta 1 de 5</p>
                <p className="text-base text-slate-700 text-sm">0% Completado</p>
            </div>
            <div aria-hidden className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-2 w-0/5 rounded-full bg-blue-600" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3 mt-6">
                <section className="space-y-4 lg:col-span-2">

                    <article className="rounded-2xl bg-slate-900 p-4 text-slate-100 shadow-sm">
                        <Stage />
                        <QuestionCard />
                    </article>
                    <AnswerBox />
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