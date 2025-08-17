'use client';

import type { InterviewResult } from '@/app/types/result';
import { mmss } from '../../../(run)/hud';

export default function TimeAnalysis({ data }: { data: InterviewResult }) {
  const total = Math.max(0, data.time.totalSec);
  const avg = Math.max(0, data.time.avgPerQuestionSec);
  const eff = data.time.efficiencyLabel as 'Excelente' | 'Buena' | 'Mejorable';

  const effBadge =
    eff === 'Excelente'
      ? 'bg-green-50 text-green-700 ring-green-200'
      : eff === 'Buena'
      ? 'bg-amber-50 text-amber-700 ring-amber-200'
      : 'bg-rose-50 text-rose-700 ring-rose-200';

  return (
    <div>
      {/* Tiempo total centrado */}
      <div className="flex flex-col items-center">
        <p className="text-4xl font-bold leading-none text-slate-900">{mmss(total)}</p>
        <p className="mt-1 text-sm text-slate-600">Tiempo total utilizado</p>
      </div>

      {/* Filas compactas */}
      <div className="mt-4 divide-y divide-slate-100">
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-slate-700">Promedio por pregunta</span>
          <span className="text-sm font-medium tabular-nums text-slate-900">
            {mmss(avg)}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-slate-700">Eficiencia de tiempo</span>
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${effBadge}`}>
            {eff}
          </span>
        </div>
      </div>
    </div>
  );
}