export default function NextQuestion() {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-5 text-base font-semibold text-slate-900">Próximas Preguntas</h3>
            
            <ol className="space-y-2 text-sm">
                <li className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-2.5 ring-1 ring-inset ring-blue-200">
                    <span className="font-medium text-slate-900">Pregunta 2</span>
                    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Técnica</span>
                </li>
                <li className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 ring-1 ring-inset ring-slate-200">
                    <span className="font-medium text-slate-900">Pregunta 3</span>
                    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Técnica</span>
                </li>
                <li className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 ring-1 ring-inset ring-slate-200">
                    <span className="font-medium text-slate-900">Pregunta 4</span>
                    <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700">Comportamental</span>
                </li>
            </ol>
        </article>
    )
}