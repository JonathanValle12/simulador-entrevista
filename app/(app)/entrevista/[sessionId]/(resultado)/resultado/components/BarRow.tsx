// app/(app)/entrevista/[sessionId]/resultado/components/BarRow.tsx
export default function BarRow({
  label,
  value,
}: {
  label: string;
  value: number; // 0–100
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-slate-700">
        <span>{label}</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div aria-hidden className="mt-1.5 h-2 w-full rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
