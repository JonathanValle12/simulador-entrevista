import { ArrowRight, Eraser, Pause, SkipForward } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onSkip?: () => void;
  meta?: { type?: string; difficulty?: number }; // viene de la pregunta actual
};

export default function AnswerBox({ value, onChange, onSubmit, onSkip, meta }: Props) {
  const canSend = value.trim().length > 0;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Tu Respuesta</h3>
          <p className="mt-1 text-sm text-slate-500">
            Tiempo transcurrido: <span className="font-medium">—</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {meta?.type && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {meta.type}
            </span>
          )}
          {meta?.difficulty && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              Dificultad {meta.difficulty}/5
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
        <label className="sr-only" htmlFor="answer">Escribe tu respuesta</label>
        <textarea
          id="answer"
          rows={8}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe tu respuesta aquí... Puedes estructurarla, dar ejemplos específicos y explicar tu razonamiento."
          className="w-full min-h-[260px] resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            title="Pausar"
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Pause className="h-4 w-4" aria-hidden />
            Pausar
          </button>

          <button
            type="button"
            title="Limpiar"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Eraser className="h-4 w-4" aria-hidden />
            Limpiar
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              title="Saltar"
              onClick={onSkip}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <SkipForward className="h-4 w-4" aria-hidden />
              Saltar
            </button>

            <button
              type="submit"
              title="Siguiente Pregunta"
              disabled={!canSend}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1
                ${canSend
                  ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed focus:ring-slate-200"
                }`}
            >
              Siguiente Pregunta
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </form>
    </article>
  );
}