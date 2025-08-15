import { Pause, Play, Scissors } from "lucide-react";
import { useState } from "react";

export default function ControlsCard() {

    const [paused, setPaused] = useState(false);

    const handlePause = () => {
        const next = !paused;
        setPaused(next);

    }

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-900 mb-5">Controles</h3>

            <div className="space-y-3">
                <button type="button" onClick={handlePause}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300">
                    <span className="flex items-center justify-center gap-2">
                        {paused ? (
                            <Play className="h-4 w-4" aria-hidden />
                        ) : (
                            <Pause className="h-4 w-4" aria-hidden />
                        )}
                        {paused ? 'Reanudar Entrevista' : 'Pausar Entrevista'}
                    </span>
                </button>

                <button type="button" className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus-ring-2 focus:ring-red-300">
                    <span className="flex items-center justify-center gap-2">
                        <Scissors className="h-4 w-4" aria-hidden />
                        Terminar Entrevista
                    </span>
                </button>
            </div>

        </article>
    )
}