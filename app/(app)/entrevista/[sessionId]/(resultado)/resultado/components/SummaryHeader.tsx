'use client';

import { mmss } from "../../../(run)/hud";

type Props = {
  score: number;
  answered: number;
  planned: number;
  totalSec: number;
};

export default function SummaryHeader({ score, answered, planned, totalSec }: Props) {
  return (
    <div className="flex flex-col items-center text-center py-4">
      <div
        className="
          flex h-20 w-20 items-center justify-center rounded-full
          bg-blue-100 ring-1 ring-blue-200/70 shadow-inner
        "
        aria-label={`Puntuación ${score}`}
      >
        <span className="text-3xl font-semibold text-amber-600">{Math.round(score)}</span>
      </div>

      <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-900">
        ¡Entrevista Completada!
      </h2>

      <p className="mt-2 text-base text-slate-600">
        Respondiste {answered} de {planned} preguntas en {mmss(totalSec)}
      </p>
    </div>
  );
}
