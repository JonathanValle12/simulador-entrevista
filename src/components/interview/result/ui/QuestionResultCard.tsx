import { BadgeCheck, AlertCircle, Bot, Eye, Clock } from "lucide-react";
import { type QAResult } from "@/types/result";
import { mmss } from "@/lib/utils/time";

type Props = { item: QAResult; indexLabel: string };

export default function QuestionResultCard({ item, indexLabel }: Props) {
  const timeClasses =
    item.timeComment === "Adecuado"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : item.timeComment === "Muy corto"
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : "bg-rose-50 text-rose-700 ring-rose-200";

  const timeLabel =
    item.timeComment === "Adecuado"
      ? "Tiempo adecuado"
      : item.timeComment === "Muy corto"
      ? "Tiempo corto"
      : "Tiempo largo";

  return (
    <article className="rounded-2xl bg-white p-6 md:p-7 ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{indexLabel}</h3>
          <p className="mt-1.5 text-[15px] leading-7 text-slate-600">
            {item.question}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-semibold text-white">
            {Math.round(item.score)}%
          </span>
          <span className="rounded-full border border-slate-300 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {item.type}
          </span>
        </div>
      </div>

      <div className="mt-7">
        <div className="mb-2 flex items-center gap-2 text-[15px] font-semibold text-slate-700">
          <Eye className="h-4 w-4" />
          Tu Respuesta
        </div>

        <div className="relative rounded-xl bg-slate-50 p-5 md:p-6 ring-1 ring-slate-200">
          <div className="absolute right-3 top-3">
            <span
              className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium ring-1 ${timeClasses}`}
              title={`Duración: ${mmss(item.timeSec)}`}
            >
              {timeLabel}
            </span>
          </div>

          <p className="pr-28 text-[15px] leading-relaxed text-slate-800">
            {item.answer || "—"}
          </p>

          <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
            <Clock className="h-3.5 w-3.5" />
            <span>Duración: {mmss(item.timeSec)}</span>
          </div>
        </div>
      </div>

      <div className="mt-7">
        <div className="mb-2 flex items-center gap-2 text-[15px] font-semibold text-slate-700">
          <Bot className="h-4 w-4 text-blue-600" />
          Feedback de IA
        </div>
        <div className="rounded-xl bg-sky-50 p-5 md:p-6 ring-1 ring-sky-200">
          <p className="text-[15px] leading-relaxed text-slate-800">
            {item.feedback}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-2">
        {item.strengths?.length > 0 && (
          <div>
            <div className="mb-1 flex items-center gap-2 font-semibold text-emerald-700">
              <BadgeCheck className="h-4 w-4 text-emerald-600" />
              Fortalezas
            </div>
            <ul className="mt-2 space-y-2">
              {item.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-6 text-slate-600 text-[15px]">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.improvements?.length > 0 && (
          <div>
            <div className="mb-1 flex items-center gap-2 font-semibold text-orange-700">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              Áreas de Mejora
            </div>
            <ul className="mt-2 space-y-2">
              {item.improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2 leading-6 text-slate-600 text-[15px]">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-orange-600" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
