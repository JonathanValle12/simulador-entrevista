import { Brain } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { QA } from "@/app/types/interview";

export default function QuestionCard({ q, preface }: { q: QA | null; preface?: string }) {
    const text = q?.question || "...generando pregunta";

    return (
        <div className="py-3 pb-6 flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 ring-2 ring-blue-400/30 shadow">
                <Brain className="h-4 w-4" aria-hidden />
            </span>

            <div className="flex-1 rounded-xl bg-slate-700/80 px-4 py-3 text-slate-50">
                <h3 className="text-sm font-semibold">Entrevistador IA</h3>

                {preface && (
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-200/90 italic">
                        {preface}
                    </p>
                )}

                {/* Render Markdown (bloques de código, listas, etc.) */}
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        p: ({ children }) => (
                            <p className="mt-1 text-[15px] leading-relaxed">{children}</p>
                        ),
                        code({ className, children, ...props }) {
                            const text = String(children ?? "");
                            const isBlock = text.includes("\n"); // 👈 sin depender de `inline`
                            if (isBlock) {
                                return (
                                    <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900/90 p-3 ring-1 ring-white/10">
                                        <code className={`font-mono text-[13px] leading-6 ${className ?? ""}`} {...props}>
                                            {text.replace(/\n$/, "")}
                                        </code>
                                    </pre>
                                );
                            }
                            return (
                                <code className="rounded bg-slate-800/60 px-1.5 py-0.5 font-mono text-[0.85em]" {...props}>
                                    {children}
                                </code>
                            );
                        },
                    }}
                >
                    {text}
                </ReactMarkdown>


                {q && (
                    <p className="mt-1 text-xs text-slate-300/85">
                        {q.type} · dificultad {q.difficulty}/5
                    </p>
                )}
            </div>
        </div>
    );
}