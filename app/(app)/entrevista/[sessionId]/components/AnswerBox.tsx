import { ArrowRight, Eraser, Pause, SkipForward } from "lucide-react";
import { useState } from "react"

export default function AnswerBox() {

    const [value, setValue] = useState('');

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                    <h3 className="text-base font-semibold text-slate-900">Tu Respuesta</h3>
                    <p className="mt-1 text-sm text-slate-500">Tiempo superido: <span className="font-medium">3 minutos</span></p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">Comportamental</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">Dificultad 1/5</span>
                </div>
            </div>

            <form>
                <label className="sr-only">Escribe tu respuesta</label>
                <textarea rows={7} value={value} onChange={(e) => setValue(e.target.value)}
                    placeholder="Escribe tu respuesta aquí... Puedes estructurar tu respuesta, dar ejemplos especificos y explicar tu razonamiento"
                    className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600" />

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button type="button" title="Pausar"
                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <Pause className="h-4 w-4" aria-hidden />
                        Pausar
                    </button>

                    <button type="button" onClick={() => setValue('')} title="Limpiar"
                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <Eraser className="h-4 w-4" aria-hidden />
                        Limpiar
                    </button>

                    <div className="ml-auto flex items-center gap-2">
                        <button type="button" title="Saltar"
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            <SkipForward className="h-4 w-4" aria-hidden />
                            Saltar
                        </button>

                        <button type="submit" title="Siguiente Pregunta"
                            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                            Siguiente Pregunta
                            <ArrowRight className="h-4 w-4" aria-hidden />
                        </button>
                    </div>
                </div>
            </form>
        </article>
    )
}