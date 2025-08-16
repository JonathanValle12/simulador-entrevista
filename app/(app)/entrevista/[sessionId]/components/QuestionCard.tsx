'use client';

import { useEffect, useRef, useState } from "react";
import { Brain } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { QA } from "@/app/types/interview";

function hash(str: string): string {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
    return (h >>> 0).toString(36);
}

type Stage = "idle" | "preface" | "question" | "done";

/** Skeleton ligero para fondo oscuro */
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
}: {
    q: QA | null;
    preface?: string;
    sessionId: string;
    instant?: boolean;
}) {
    const fullPreface = (preface ?? q?.preface ?? "").trim();
    const fullQuestion = q?.question ?? "";

    const hasContent = (fullPreface.length + fullQuestion.length) > 0;

    // Firma & key solo tienen sentido si hay contenido
    const sig = hasContent ? JSON.stringify({ p: fullPreface, q: fullQuestion }) : "";
    const key = hasContent ? `typed:${sessionId}:${hash(sig)}` : "";

    // NO consideres sessionStorage si no hay contenido
    const alreadyShown =
        hasContent && typeof window !== "undefined" && !!window.sessionStorage.getItem(key);

    // "Instant" solo aplica si hay contenido
    const showInstant = hasContent && (!!instant || alreadyShown);

    // Estado visible
    const [prefDisp, setPrefDisp] = useState<string>(() =>
        showInstant ? fullPreface : ""
    );
    const [qDisp, setQDisp] = useState<string>(() =>
        showInstant ? fullQuestion : ""
    );
    const [stage, setStage] = useState<Stage>(() => {
        if (!hasContent) return "idle";
        return showInstant ? "done" : "idle";
    });

    // 👇 Skeleton desde el primer render cuando NO hay contenido,
    // o cuando habrá tipeo (no instant).
    const [showSkeleton, setShowSkeleton] = useState<boolean>(() =>
        !hasContent ? true : !showInstant
    );

    const tRef = useRef<number | null>(null);

    useEffect(() => {
        
        // helper local para evitar dependencia externa
        const typeText = (text: string, set: (s: string) => void, onEnd: () => void) => {
            let i = 0;
            set("");
            const id = window.setInterval(() => {
                if (i === 0) setShowSkeleton(false);
                i++;
                set(text.slice(0, i));
                if (i >= text.length) {
                    clearInterval(id);
                    tRef.current = null;
                    onEnd();
                }
            }, Math.max(14, Math.min(28, Math.round(160 / Math.log2(text.length + 4)))));
            tRef.current = id;
        };

        // Sin contenido: skeleton y salir
        if (!hasContent) {
            setStage("idle");
            setPrefDisp("");
            setQDisp("");
            setShowSkeleton(true);
            return;
        }

        // Modo instantáneo: pinta todo y sin skeleton
        if (showInstant) {
            setStage("done");
            setPrefDisp(fullPreface);
            setQDisp(fullQuestion);
            setShowSkeleton(false);
            if (!alreadyShown && typeof window !== "undefined" && key) {
                window.sessionStorage.setItem(key, "1");
            }
            return;
        }

        // Tipeo normal
        if (tRef.current) {
            clearInterval(tRef.current);
            tRef.current = null;
        }
        setPrefDisp("");
        setQDisp("");
        setShowSkeleton(true);

        if (fullPreface) {
            setStage("preface");
            typeText(fullPreface, setPrefDisp, () => {
                if (fullQuestion) {
                    setStage("question");
                    typeText(fullQuestion, setQDisp, () => {
                        setStage("done");
                        if (typeof window !== "undefined" && key) {
                            window.sessionStorage.setItem(key, "1");
                        }
                    });
                } else {
                    setStage("done");
                    if (typeof window !== "undefined" && key) {
                        window.sessionStorage.setItem(key, "1");
                    }
                }
            });
        } else if (fullQuestion) {
            setStage("question");
            typeText(fullQuestion, setQDisp, () => {
                setStage("done");
                if (typeof window !== "undefined" && key) {
                    window.sessionStorage.setItem(key, "1");
                }
            });
        }

        return () => {
            if (tRef.current) clearInterval(tRef.current);
            tRef.current = null;
        };
    }, [hasContent, showInstant, alreadyShown, key, fullPreface, fullQuestion]);

    const showChips = !!q && !showSkeleton && stage === "done";

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

                {showChips && (
                    <p className="mt-1 text-xs text-slate-300/85">
                        {q!.type} · dificultad {q!.difficulty}/5
                    </p>
                )}
            </div>
        </div>
    );
}