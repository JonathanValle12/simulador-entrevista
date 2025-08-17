'use client'

import { InterviewResult } from "@/app/types/result";
import SummaryHeader from "./components/SummaryHeader";
import Tabs from "./components/Tabs";
import { useState } from "react";
import QuestionResultCard from "./components/QuestionResultCard";
import { Clock, LineChart, TrendingUp } from "lucide-react";
import Recommendations from "./components/Recommendations";
import GeneralPerformance from "./components/GeneralPerformance";
import TimeAnalysis from "./components/TimeAnalysis";

type TabKey = 'detalles' | 'general' | 'recomendaciones';

export default function ResultClient({ data }: { data: InterviewResult }) {

    const [tab, setTab] = useState<TabKey>('detalles');

    return (
        <div className="mx-auto w-full max-w-7xl px-2 lg:px-6 py-3.5">
            <SummaryHeader score={data.overallScore} answered={data.totalAnswered} planned={data.totalPlanned} totalSec={data.time.totalSec} />

            <div className="mt-6">
                <Tabs value={tab} onChange={setTab} />
            </div>

            {tab === 'detalles' && (
                <section className="mt-6 space-y-6">
                    {data.questions.map((q) => (
                        <QuestionResultCard key={q.index} item={q} indexLabel={`Pregunta ${q.index + 1}`} />
                    ))}
                </section>
            )}

            {tab === 'general' && (
                <section className="mt-6 grid gap-6 lg:grid-cols-2">
                    <article className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                        <h3 className="mb-3 flex items-center gap-2 text-slate-800 font-semibold">
                            <TrendingUp className="h-5 w-5 text-blue-600 -mt-px" aria-hidden />
                            Rendimiento General
                        </h3>
                        <GeneralPerformance data={data} />
                    </article>

                    <article className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                        <h3 className="mb-3 flex items-center gap-2 text-slate-800 font-semibold">
                            <Clock className="h-5 w-5 text-green-600" />
                            Análisis de Tiempo
                        </h3>
                        <TimeAnalysis data={data} />
                    </article>

                </section>
            )}

            {tab === 'recomendaciones' && (
                <section className="mt-5 grid gap-6 lg:grid-cols-2">
                    <Recommendations personalized={data.recommendations} nextSteps={data.nextSteps} />
                </section>
            )}
        </div>
    )
}