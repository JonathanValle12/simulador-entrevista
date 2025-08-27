import { Pause, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useHUD } from "../context/HudContext";

export default function ControlsCard({ sessionId }: { sessionId?: string }) {
    const router = useRouter();
    const { paused, setPaused, completed = 0, total = 0 } = useHUD();

    async function togglePause() {
        if (!sessionId) return;
        const action = paused ? "resume" : "pause";
        await fetch(`/api/interview/${sessionId}/state`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
        });
        setPaused(!paused);
    }

    const minRequired = Math.min(3, total);
    const remaining = Math.max(0, minRequired - completed);
    const canFinish = remaining === 0;

    async function goToResults() {
        if (!sessionId || !canFinish) return;
        // 1) marca la sesión como finalizada
        await fetch(`/api/interview/${sessionId}/state`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "finish" }),
        }).catch(() => { });
        // 2) navega a resultados
        router.push(`/entrevista/${sessionId}/resultado`);
    }

    const hint = remaining
        ? `Falta${remaining === 1 ? '' : 'n'} ${remaining} respuesta${remaining === 1 ? '' : 's'} para habilitar el botón.`
        : '';


    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-5 text-base font-semibold text-slate-900">Controles</h3>

            <div className="space-y-3">
                <button
                    type="button"
                    onClick={togglePause}                       // 👈
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    <span className="flex items-center justify-center gap-2">
                        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        {paused ? "Reanudar Entrevista" : "Pausar Entrevista"}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={goToResults}
                    disabled={!canFinish}
                    className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    Terminar entrevista
                </button>

                {!canFinish && (
                    <p className="mt-1 text-xs text-slate-500 text-center">{hint}</p>
                )}
            </div>
        </article>
    );
}