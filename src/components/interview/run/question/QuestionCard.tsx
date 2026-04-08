'use client';

import { useEffect, useRef, useState } from "react";
import { Brain } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type QA } from "@/types/interview";

function hash(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return (h >>> 0).toString(36);
}

type Stage = "idle" | "preface" | "question" | "done";

function Shimmer() {
  return (
    <div className="mt-2 animate-pulse" aria-busy="true" aria-live="polite">
      <div className="h-3 w-5/6 rounded bg-white/10" />
      <div className="mt-2 h-3 w-4/6 rounded bg-white/10" />
      <div className="mt-3 h-3 w-11/12 rounded bg-white/10" />
      <div className="mt-2 h-3 w-10/12 rounded bg-white/10" />
    </div>
  );
}

export default function QuestionCard({
  q,
  preface,
  sessionId,
  instant,
  showMeta = true,
  paused = false,               // 👈 nuevo
}: {
  q: QA | null;
  preface?: string;
  sessionId: string;
  instant?: boolean;
  showMeta?: boolean;
  paused?: boolean;
}) {
  const fullPreface = (preface ?? q?.preface ?? "").trim();
  const fullQuestion = q?.question ?? "";
  const hasContent = (fullPreface.length + fullQuestion.length) > 0;

  const sig = hasContent ? JSON.stringify({ p: fullPreface, q: fullQuestion }) : "";
  const key = hasContent ? `typed:${sessionId}:${hash(sig)}` : "";
  const alreadyShown = hasContent && typeof window !== "undefined" && !!window.sessionStorage.getItem(key);
  const showInstant = hasContent && (!!instant || alreadyShown);

  const [prefDisp, setPrefDisp] = useState<string>(() => showInstant ? fullPreface : "" );
  const [qDisp, setQDisp] = useState<string>(() => showInstant ? fullQuestion : "" );
  const [stage, setStage] = useState<Stage>(() => {
    if (!hasContent) return "idle";
    return showInstant ? "done" : "idle";
  });
  const [showSkeleton, setShowSkeleton] = useState<boolean>(() => !hasContent ? true : !showInstant );

  // motor de tipeo
  const tRef = useRef<number | null>(null);
  const iRef = useRef<number>(0);                // índice actual en el segmento
  const segRef = useRef<"preface" | "question" | null>(null);

  // velocidad según longitud
  const speedFor = (len: number) => Math.max(14, Math.min(28, Math.round(160 / Math.log2(len + 4))));

  // 1) Preparación cuando cambia el contenido o se debe mostrar instantáneo
  useEffect(() => {
    if (tRef.current) {
      clearInterval(tRef.current);
      tRef.current = null;
    }
    iRef.current = 0;

    if (!hasContent) {
      setStage("idle");
      setPrefDisp("");
      setQDisp("");
      setShowSkeleton(true);
      segRef.current = null;
      return;
    }

    if (showInstant) {
      setStage("done");
      setPrefDisp(fullPreface);
      setQDisp(fullQuestion);
      setShowSkeleton(false);
      segRef.current = null;
      if (!alreadyShown && typeof window !== "undefined" && key) {
        window.sessionStorage.setItem(key, "1");
      }
      return;
    }

    // preparar tipeo
    setPrefDisp("");
    setQDisp("");
    setShowSkeleton(true);
    if (fullPreface) {
      setStage("preface");
      segRef.current = "preface";
    } else if (fullQuestion) {
      setStage("question");
      segRef.current = "question";
    } else {
      setStage("done");
      segRef.current = null;
    }
  }, [sig, showInstant, alreadyShown, key, hasContent, fullPreface, fullQuestion]);

  // 2) Ejecución / pausa / reanudación del tipeo
  useEffect(() => {
    if (!hasContent || showInstant) return;
    if (stage !== "preface" && stage !== "question") return;

    // si está pausado, detener interval
    if (paused) {
      if (tRef.current) {
        clearInterval(tRef.current);
        tRef.current = null;
      }
      return;
    }

    // si ya hay interval corriendo, no duplicar
    if (tRef.current) return;

    const text = stage === "preface" ? fullPreface : fullQuestion;
    if (!text) return;

    // en el primer tick ocultamos skeleton
    if (iRef.current === 0) setShowSkeleton(false);

    // asegurar que el slice actual esté dibujado al reanudar
    if (stage === "preface") setPrefDisp(text.slice(0, iRef.current));
    if (stage === "question") setQDisp(text.slice(0, iRef.current));

    const id = window.setInterval(() => {
      iRef.current += 1;
      const slice = text.slice(0, iRef.current);
      if (stage === "preface") setPrefDisp(slice);
      if (stage === "question") setQDisp(slice);

      if (iRef.current >= text.length) {
        clearInterval(id);
        tRef.current = null;
        iRef.current = 0;

        if (stage === "preface" && fullQuestion) {
          setStage("question");
          segRef.current = "question";
        } else {
          setStage("done");
          segRef.current = null;
          if (typeof window !== "undefined" && key) {
            window.sessionStorage.setItem(key, "1");
          }
        }
      }
    }, speedFor(text.length));

    tRef.current = id;

    return () => {
      if (tRef.current) {
        clearInterval(tRef.current);
        tRef.current = null;
      }
    };
  }, [paused, stage, hasContent, showInstant, fullPreface, fullQuestion, key]);

  const showChips = showMeta && !!q && !showSkeleton && stage === "done";

  return (
    <div className="py-3 pb-6 flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 ring-2 ring-blue-400/30 shadow">
        <Brain className="h-4 w-4" aria-hidden />
      </span>

      <div className="flex-1 rounded-xl bg-slate-700/80 px-4 py-3 text-slate-50">
        <h3 className="text-sm font-semibold">Entrevistador IA</h3>

        {showSkeleton ? (
          <Shimmer />
        ) : stage !== "done" ? (
          <>
            {fullPreface ? (
              <p className="mt-1 text-[13px] leading-relaxed text-slate-200/90 italic">
                {prefDisp}
              </p>
            ) : null}
            {stage === "question" && (
              <p className="mt-1 text-[15px] leading-relaxed whitespace-pre-wrap">
                {qDisp}
              </p>
            )}
          </>
        ) : (
          <>
            {fullPreface ? (
              <p className="mt-1 text-[13px] leading-relaxed text-slate-200/90 italic">
                {fullPreface}
              </p>
            ) : null}

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="mt-1 text-[15px] leading-relaxed">{children}</p>
                ),
                code({ className, children, ...props }) {
                  const txt = String(children ?? "");
                  const isBlock = txt.includes("\n");
                  if (isBlock) {
                    return (
                      <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900/90 p-3 ring-1 ring-white/10">
                        <code
                          className={`font-mono text-[13px] leading-6 ${className ?? ""}`}
                          {...props}
                        >
                          {txt.replace(/\n$/, "")}
                        </code>
                      </pre>
                    );
                  }
                  return (
                    <code className="rounded bg-slate-800/60 px-1.5 py-0.5 font-mono text-[0.85em]">
                      {children}
                    </code>
                  );
                },
              }}
            >
              {fullQuestion || ""}
            </ReactMarkdown>
          </>
        )}
      </div>
    </div>
  );
}