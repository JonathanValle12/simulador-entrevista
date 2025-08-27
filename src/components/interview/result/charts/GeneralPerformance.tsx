"use client";

import type { InterviewResult } from "@/types/result";
import { type QuestionType } from "@/types/interview";

export default function GeneralPerformance({ data }: { data: InterviewResult }) {
  const groups: Array<{ key: QuestionType; label: string }> = [
    { key: "Técnica", label: "Conocimiento Técnico" },
    { key: "Comportamental", label: "Habilidades Comportamentales" },
    { key: "Diseño de Sistemas", label: "Diseño de Sistemas" },
  ];

  const items = groups
    .map(g => {
      const qs = data.questions.filter(q => q.type === g.key);
      if (!qs.length) return null;
      const avg = Math.round(qs.reduce((a, b) => a + b.score, 0) / qs.length);
      return { label: g.label, value: clamp(avg), samples: qs.length };
    })
    .filter(Boolean) as Array<{ label: string; value: number; samples: number }>;

  if (!items.length) {
    items.push({
      label: "Rendimiento General",
      value: clamp(data.overallScore),
      samples: data.totalAnswered,
    });
  }

  return (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
    {items.map(({ label, value, samples }) => (
      <MetricCard key={label} label={label} value={value} samples={samples} />
    ))}
  </div>
  );
}

function MetricCard({
  label,
  value,
  samples,
}: {
  label: string;
  value: number;
  samples: number;
}) {
  const tone =
    value >= 80
      ? { chip: "bg-green-50 text-green-700 ring-green-200", color: "#16a34a", tag: "Excelente" }
      : value >= 60
        ? { chip: "bg-amber-50 text-amber-700 ring-amber-200", color: "#f59e0b", tag: "Aceptable" }
        : { chip: "bg-rose-50 text-rose-700 ring-rose-200", color: "#e11d48", tag: "A mejorar" };

  return (
    <article className="relative rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        Promedio sobre {samples} pregunta{samples !== 1 ? "s" : ""}.
      </p>
      <div className="mt-3 grid place-items-center">
        <Donut value={value} color={tone.color} size={120} stroke={10} />
      </div>
      <span
        className={`absolute bottom-3 right-3 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${tone.chip}`}
      >
        {tone.tag}
      </span>
    </article>
  );
}

function Donut({
  value,
  size = 136,
  stroke = 12,
  color = "#2563eb",
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = (value / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle r={r} cx={0} cy={0} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
          <g transform="rotate(-90)">
            <circle
              r={r}
              cx={0}
              cy={0}
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${filled} ${c - filled}`}
            />
          </g>
        </g>
      </svg>

      <div className="absolute inset-0 grid place-items-center">
        <span className="text-2xl font-bold tabular-nums text-slate-900">{value}%</span>
      </div>
    </div>
  );
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}