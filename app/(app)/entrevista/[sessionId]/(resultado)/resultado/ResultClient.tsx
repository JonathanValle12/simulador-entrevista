'use client'

import { InterviewResult } from "@/app/types/result";
import SummaryHeader from "./components/SummaryHeader";
import Tabs from "./components/Tabs";
import { useEffect, useState } from "react";
import QuestionResultCard from "./components/QuestionResultCard";
import { Clock, Home, RotateCcw, TrendingUp } from "lucide-react";
import Recommendations from "./components/Recommendations";
import GeneralPerformance from "./components/GeneralPerformance";
import TimeAnalysis from "./components/TimeAnalysis";
import { useRouter } from "next/navigation";
import PDFExport from "./components/PDFExport";

type TabKey = 'detalles' | 'general' | 'recomendaciones';

export default function ResultClient({ sessionId, initialData = null }: { sessionId: string, initialData?: InterviewResult | null }) {
    const router = useRouter();

    const [tab, setTab] = useState<TabKey>('detalles');
    const [data, setData] = useState<InterviewResult | null>(initialData);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(initialData ? 'ready' : 'loading');
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (data) return;
        let alive = true;
        const ctrl = new AbortController();

        (async () => {
            try {
                const res = await fetch(`/api/interview/${sessionId}/result`, { cache: "no-store", signal: ctrl.signal });

                if (!res.ok) throw new Error(await res.text());
                const json: InterviewResult = await res.json();
                if (alive) { setData(json); setStatus('ready'); }
            } catch {
                if (alive) setStatus('error');
            }
        })();

        return () => { alive = false; ctrl.abort(); };
    }, [sessionId, data]);

    async function handleNewInterview() {
        try {
            setBusy(true);

            await fetch(`/api/interview/${sessionId}`, { method: 'delete' }).catch(() => { });
        } finally {
            router.push('/config');
        }
    }

    function handleGoHome() {
        router.push('/');
    }

    if (status !== 'ready' || !data) {
        return (
            <div className="mx-auto w-full max-w-7xl px-2 lg:px-6 py-3.5">
                <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="mt-4 h-40 bg-white ring-1 ring-slate-200 rounded-2xl animate-pulse" />
            </div>
        );
    }



    return (
        <>
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

                <hr className="my-6 border-slate-200" />
                <div className="flex flex-wrap justify-center items-center gap-3">
                    <button type="button" onClick={handleNewInterview} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 cursor-pointer">
                        <RotateCcw className="h-4 w-4" />
                        Nueva Entrevista
                    </button>

                    <button type="button" onClick={handleGoHome} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-medium text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer">
                        <Home className="h-4 w-4" />
                        Volver al Inicio
                    </button>
                </div>
            </div>

            <PDFExport data={data} />
        </>
    )
}