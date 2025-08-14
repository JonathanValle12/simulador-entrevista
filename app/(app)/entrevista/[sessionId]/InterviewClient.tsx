'use client';

import AnswerBox from "./components/AnswerBox";
import ControlsCard from "./components/ControlsCard";
import NextQuestion from "./components/NextQuestion";
import ProgressCard from "./components/ProgressCard";
import QuestionCard from "./components/QuestionCard";
import Stage from "./components/Stage";
import TipsCard from "./components/TipsCard";

export default function InterviewClient({ sessionId }: { sessionId: string }) {


    return (
        <div className="mx-auto w-full max-w-7xl px-2 lg:px-6 py-3.5">
            <div className="flex justify-between items-center">
                <p className="text-base text-slate-700 text-sm">Pregunta 1 de 5</p>
                <p className="text-base text-slate-700 text-sm">0% Completado</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 mt-8">
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