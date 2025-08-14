import { Brain } from "lucide-react";

export default function QuestionCard() {
    return (
        <div className="py-3 pb-6 flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 ring-2 ring-blue-400/30 shadow">
                <Brain className="h-4 w-4" aria-hidden />
            </span>

            <div className="flex-1 rounded-xl bg-slate-700/80 px-4 py-3 text-slate-50">
                <h3 className="text-sm font-semibold">Entrevistador IA</h3>
                <p className="mt-1 text-[15px] leading-relaxed">Cuénteme sobre ti y tu experiencia en desarrollo de software.</p>
                <p className="mt-1 text-xs italic text-slate-300/85">Está es una pregunta de apertura para conocerte mejor</p>
            </div>
        </div>
    )
}