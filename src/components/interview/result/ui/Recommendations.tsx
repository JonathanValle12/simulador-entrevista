'use client';

import { Target, ArrowRight } from 'lucide-react';

export default function Recommendations({
  personalized,
  nextSteps,
}: {
  personalized: string[];
  nextSteps: string[];
}) {
  return (
    <>
      <article className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <h3 className="mb-1 flex items-center gap-2 font-semibold text-slate-800">
          <Target className="h-5 w-5 text-blue-600" aria-hidden />
          Recomendaciones Personalizadas
        </h3>
        <p className="mb-4 text-sm text-slate-500">
          Basadas en tu rendimiento en esta entrevista
        </p>

        <ol className="space-y-3">
          {personalized?.length ? (
            personalized.map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[12px] font-semibold text-blue-700 ring-1 ring-blue-200">
                  {i + 1}
                </span>
                <span className="text-slate-800">{text}</span>
              </li>
            ))
          ) : (
            <p className="text-sm text-slate-500">Sin recomendaciones por ahora.</p>
          )}
        </ol>
      </article>

      <article className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <h3 className="mb-1 flex items-center gap-2 font-semibold text-slate-800">
          <ArrowRight className="h-5 w-5 text-emerald-600" aria-hidden />
          Próximos Pasos
        </h3>
        <p className="mb-4 text-sm text-slate-500">
          Plan de acción para mejorar tus habilidades
        </p>

        <ol className="space-y-3">
          {nextSteps?.length ? (
            nextSteps.map((text, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[12px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  {i + 1}
                </span>
                <span className="text-slate-800">{text}</span>
              </li>
            ))
          ) : (
            <p className="text-sm text-slate-500">Sin pasos sugeridos por ahora.</p>
          )}
        </ol>
      </article>
    </>
  );
}