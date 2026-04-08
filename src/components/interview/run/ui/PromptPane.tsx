'use client';

import Stage from "@/components/interview/run/ui/Stage";
import QuestionCard from "@/components/interview/run/question/QuestionCard";
import type { QA } from "@/types/interview";

type Props = {
  sessionId: string;
  q: QA | null;
  preface?: string | null;
  instant?: boolean;
  showMeta?: boolean;
  paused?: boolean;
};

export default function PromptPane({
  sessionId,
  q,
  preface,
  instant,
  showMeta = true,
  paused = false,
}: Props) {
  const currentComboKey = `${(preface ?? q?.preface ?? "")}|${q?.question ?? ""}`;

  return (
    <article className="relative rounded-2xl bg-slate-900 p-4 text-slate-100 shadow-sm overflow-hidden">
      {/* contenido normal */}
      <Stage />
      <QuestionCard
        key={currentComboKey}
        q={q}
        preface={preface ?? undefined}
        sessionId={sessionId}
        instant={instant}
        showMeta={showMeta}
        paused={paused}
      />

      {/* overlay pausa, siempre encima */}
      {paused && (
        <>
          <div className="absolute inset-0 z-[60] bg-slate-900/40 backdrop-blur-[1px]" />
          <div className="absolute top-2 right-2 z-[70]">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/95 px-2.5 py-1 text-xs font-medium text-amber-900 ring-1 ring-amber-300 shadow">
              ⏸ Pausado
            </span>
          </div>
        </>
      )}
    </article>
  );
}
