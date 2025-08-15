export default function ProgressCard() {
    return (
        <article className="rounded-2xl border border-slate-200 bfg-white p-5 shadow-sm">
            <h3 className="mb-5 text-base font-semibold text-slate-900">Progreso</h3>

            <dl className="mt-4 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                    <dt className="text-slate-700">Preguntas respondidas:</dt>
                    <dd className="font-medium text-slate-900 tabular-nums tracking-[0.01em]">1/5</dd>
                </div>
                <div className="flex items-center justify-between">
                    <dt className="text-slate-700">Tiempo transcurrido:</dt>
                    <dd className="font-medium text-slate-900 tabular-nums tracking-[0.01em]">06/34</dd>
                </div>
                <div className="flex items-center justify-between">
                    <dt className="text-slate-700">Tiempo restante:</dt>
                    <dd className="font-medium text-slate-900 tabular-nums tracking-[0.01em]">23:15</dd>
                </div>
            </dl>
        </article>
    )
}