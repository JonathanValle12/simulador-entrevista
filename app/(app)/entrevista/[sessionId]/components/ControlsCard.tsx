// app/entrevista/[sessionId]/components/ControlsCard.tsx
import { Pause, Play, Scissors } from "lucide-react";
import { useRouter } from "next/navigation";
import { useHUD } from "../hud";

export default function ControlsCard({ sessionId }: { sessionId?: string }) {
    const router = useRouter();
    const { paused, setPaused } = useHUD();

    async function togglePause() {
        if (!sessionId) return;
        const action = paused ? "resume" : "pause";
        await fetch(`/api/interview/${sessionId}/state`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
        });
        // ahora actualiza HUD; el efecto de arriba hará el re-sync de state
        setPaused(!paused);
    }

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
                    onClick={() => sessionId && router.push(`/entrevista/${sessionId}/resultado`)}
                    className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                    <span className="flex items-center justify-center gap-2">
                        <Scissors className="h-4 w-4" />
                        Terminar Entrevista
                    </span>
                </button>
            </div>
        </article>
    );
}