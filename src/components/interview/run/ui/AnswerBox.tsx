import { ArrowRight, Eraser, SkipForward } from "lucide-react";
import { useHUD } from "../context/HudContext";
import type { QuestionType, Difficulty } from "@/types/interview";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onSkip?: () => void;
  meta?: { type?: QuestionType; difficulty?: Difficulty };
};

export default function AnswerBox({ value, onChange, onSubmit, onSkip, meta }: Props) {
  const { paused, remainingSec, chipType, chipDifficulty } = useHUD();
  const disabled = paused || remainingSec <= 0;

  const type = (meta?.type as typeof chipType) ?? chipType;
  const difficulty = meta?.difficulty ?? chipDifficulty;

  const canSend = !disabled && value.trim().length > 0;
  const showDifficulty = typeof difficulty === "number" && type !== "Comportamental";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-4 pb-3 border-b border-slate-200/80">
        <h3 className="text-base font-semibold text-slate-900">Tu Respuesta</h3>
        <div className="flex items-center gap-2">
          {type && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {type}
            </span>
          )}
          {showDifficulty && (
            <span className="flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              Dificultad {difficulty}/5
              <span className="ml-1 flex items-center gap-1" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-4 rounded-full ${i < (difficulty ?? 0) ? "bg-blue-600" : "bg-slate-300"}`}
                  />
                ))}
              </span>
            </span>
          )}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canSend) onSubmit();
        }}
      >
        <div className={`rounded-xl border p-1 transition focus-within:ring-2
            ${disabled ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-gradient-to-b from-white to-slate-50 focus-within:ring-blue-200"}`}>
          <label className="sr-only" htmlFor="answer">Escribe tu respuesta</label>
          <textarea
            id="answer"
            rows={8}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Escribe tu respuesta aquí…"
            className="w-full min-h-[260px] resize-y rounded-lg border-0 bg-transparent px-3 py-2 text-sm leading-6 text-slate-800 placeholder:text-slate-400 disabled:text-slate-400 disabled:cursor-not-allowed focus:outline-none"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            title="Limpiar"
            onClick={() => !disabled && onChange("")}
            disabled={disabled || !value}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <Eraser className="h-4 w-4" />
            Limpiar
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              title="Saltar"
              onClick={onSkip}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <SkipForward className="h-4 w-4" />
              Saltar
            </button>

            <button
              type="submit"
              title="Siguiente Pregunta"
              disabled={!canSend}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1
                ${canSend ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed focus:ring-slate-200"}`}
            >
              Siguiente Pregunta
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </article>
  );
}