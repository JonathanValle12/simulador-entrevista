'use client'

import { InterviewResult } from "@/types/result";
import SummaryHeader from "@/components/interview/result/summary/SummaryHeader";
import Tabs from "@/components/interview/result/ui/Tabs";
import { useEffect, useState } from "react";
import QuestionResultCard from "@/components/interview/result/ui/QuestionResultCard";
import { Clock, Home, RotateCcw, SkipForward, TrendingUp } from "lucide-react";
import Recommendations from "@/components/interview/result/ui/Recommendations";
import GeneralPerformance from "@/components/interview/result/charts/GeneralPerformance";
import TimeAnalysis from "@/components/interview/result/charts/TimeAnalysis";
import { useRouter } from "next/navigation";
import PDFExport from "@/components/interview/result/export/PDFExport";
import { type TabKey } from "@/types/ui";
import { ConfigType, SessionState } from "@/types/interview";
import { mmss } from "@/lib/utils/time";

export default function ResultClient({ sessionId, initialData = null }: { sessionId: string, initialData?: InterviewResult | null }) {
    const router = useRouter();

    const [tab, setTab] = useState<TabKey>('detalles');
    const [data, setData] = useState<InterviewResult | null>(initialData);
    const [showSkeleton, setShowSkeleton] = useState(false);

    const [session, setSession] = useState<SessionState | null>(null);

    useEffect(() => {
        const t = setTimeout(() => setShowSkeleton(true), 200);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (data) return;
        let alive = true;
        const ctrl = new AbortController();

        const fetchResult = () => {
            fetch(`/api/interview/${sessionId}/result`, { cache: "no-store", signal: ctrl.signal })
                .then(async (res) => {

                    if (res.status === 404) { router.replace('/config'); return; }
                    if (res.status === 400) { router.replace(`/entrevista/${sessionId}`); return; }
                    if (res.status === 503) {
                        setTimeout(fetchResult, 900);
                        return;
                    }

                    if (!res.ok) { return; }

                    const json: InterviewResult = await res.json();
                    if (alive) setData(json);
                })
                .catch(() => { if (alive) setTimeout(fetchResult, 900); });
        };

        fetchResult();

        return () => { alive = false; ctrl.abort(); };
    }, [sessionId, data, router]);

    useEffect(() => {
        let alive = true;
        fetch(`/api/interview/${sessionId}/state`, { cache: "no-store" })
            .then(r => r.json())
            .then((s: SessionState) => { if (alive) setSession(s); })
            .catch(() => { });
        return () => { alive = false; };

    }, [sessionId]);

    function clearSession(id: string) {
        return fetch(`/api/interview/${id}`, { method: 'DELETE', keepalive: true }).catch(() => { });
    }

    function go(path: string) { clearSession(sessionId); router.push(path); }

    if (!data && !showSkeleton) return null;

    if (!data) {
        return (
            <div className="mx-auto w-full max-w-7xl px-2 lg:px-6 py-3.5">
                <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="mt-4 h-40 bg-white ring-1 ring-slate-200 rounded-2xl animate-pulse" />
            </div>
        );
    }

    const answeredSeq = data.questions;

    const stackUsed = data.stack ?? [];
    const skipped = data.skipped ?? [];

    return (
        <>
            <div className="mx-auto w-full max-w-7xl px-2 lg:px-6 py-3.5">
                <SummaryHeader score={data.overallScore} answered={data.totalAnswered} planned={data.totalPlanned} totalSec={data.time.totalSec} />

                {stackUsed.length > 0 && (
                    <div className="mt-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                            <span className="font-medium">Stack usado:</span>
                            <span>{stackUsed.join(", ")}</span>
                        </span>
                    </div>
                )}

                <div className="mt-6">
                    <Tabs value={tab} onChange={setTab} />
                </div>

                {tab === 'detalles' && (
                    <section className="mt-6 space-y-6">
                        {/* Respondidas (puntuadas) con numeración SECUENCIAL para UI */}
                        {answeredSeq.map((q, idx) => (
                            <QuestionResultCard key={`${q.index}-${idx}`} item={q} indexLabel={`Pregunta ${idx + 1}`} />
                        ))}

                        {/* NEW: bloque de preguntas saltadas */}
                        {skipped.length > 0 && (
                            <article className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                                <h3 className="mb-3 text-slate-800 font-semibold flex items-center gap-2">
                                    <SkipForward className="h-5 w-5 text-slate-600" />
                                    Preguntas saltadas (no puntúan)
                                </h3>

                                <ul className="space-y-3">
                                    {skipped.map((s) => (
                                        <li key={s.index} className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="text-[15px] leading-7 text-slate-700">{s.question}</div>
                                                <span className="rounded-full bg-white ring-1 ring-slate-300 px-2.5 py-0.5 text-xs text-slate-700">Saltada</span>
                                            </div>
                                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>Duración: {mmss(s.timeSec)}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        )}
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
                    <button type="button" onClick={() => go('/config')} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 cursor-pointer">
                        <RotateCcw className="h-4 w-4" />
                        Nueva Entrevista
                    </button>

                    <button type="button" onClick={() => go('/')} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-medium text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer">
                        <Home className="h-4 w-4" />
                        Volver al Inicio
                    </button>
                </div>
            </div>

            <PDFExport data={data} />
        </>
    )
}