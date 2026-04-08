import type { ConfigType, ExperienceLevel } from "@/types/interview";
import { ClockIcon, PlayCircleIcon } from "lucide-react";

const pctDur = (v: number) => ((v - 15) / (90 - 15)) * 100;

export default function Sidebar({
    duracion, setDuracion,
    role, experiencia, tipo,
    stack,
    onStart
}: {
    duracion: number; setDuracion: (n: number) => void;
    role: string | null;
    experiencia: ExperienceLevel | null;
    tipo: ConfigType | null;
    stack: string[];
    onStart: () => void;
}) {

    const ready = !!(role && experiencia && tipo && duracion);
    const stackLabel = stack.join(", ");
    const stackShort = stackLabel.length > 18 ? stackLabel.slice(0, 18) + "…" : stackLabel;

    return (
        <aside aria-labelledby="resumen-title" className="space-y-6" role="complementary">

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <header className="mb-2">
                    <h2 className="flex items-center gap-2 text-base font-semibold">
                        <ClockIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                        Duración
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">Tiempo estimado de la entrevista</p>
                </header>

                <div className="mt-3 flex justify-center">
                    <div className="inline-flex items-baseline gap-1">
                        <span className="text-2xl font-semibold text-blue-600 leading-none tabular-nums">{duracion}</span>
                        <span className="text-base font-normal text-slate-500 leading-none">minutos</span>
                    </div>
                </div>
                <input
                    type="range" min={15} max={90} step={5} value={duracion}
                    onChange={(e) => {
                        const val = Number(e.currentTarget.value);
                        setDuracion(val)
                        e.currentTarget.style.setProperty("--value-percent", `${pctDur(val)}%`)
                    }}
                    style={{ ["--value-percent" as string]: `${pctDur(duracion)}%` }}
                    className="w-full" />
                <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>15 min</span>
                    <span>90 min</span>
                </div>
            </section>

            <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
                <h2 className="mb-4 text-[15px] font-semibold leading-none text-[#1E3ABA]">Resumen</h2>
                <dl className="space-y-2 text-sm">
                    {[
                        { label: "Rol", value: role },
                        { label: "Stack", value: stackShort },
                        { label: "Experiencia", value: experiencia },
                        { label: "Tipo", value: tipo },
                        { label: "Duración", value: `${duracion} min`, alwaysShow: true }
                    ]
                        .filter(item => item?.value || item?.alwaysShow)
                        .map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between">
                                <dt className="text-gray-700">{label}:</dt>
                                <dd className="font-medium text-gray-900">{value}</dd>
                            </div>
                        ))
                    }
                </dl>
            </section>

            <button
                type="button"
                onClick={onStart}
                disabled={!ready}
                className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1
                        ${role && tipo && experiencia && duracion
                        ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300 cursor-pointer"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed focus:ring-gray-300"
                    }`}>
                <PlayCircleIcon className="h-5 w-5" />
                Comenzar Entrevista
            </button>
        </aside>
    )
}