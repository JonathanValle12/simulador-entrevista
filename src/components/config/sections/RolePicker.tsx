import { Code2, Settings, X } from "lucide-react";
import Card from "@/components/common/Card";
import { ROLES } from "@/data/interviewOptions";
import { useState } from "react";
import StackModal from "../stack/StackModal";
export default function RolePicker({
    role,
    stack,
    onSelect,
    onChangeStack
}: {
    role: string | null;
    stack: string[];
    onSelect: (value: string) => void;
    onChangeStack: (next: string[]) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <section aria-labelledby="roles-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <header className="mb-4">
                <h2 id="roles-title" className="flex items-center gap-2 text-base font-semibold">
                    <Code2 className="h-5 w-5 text-blue-600" aria-hidden="true" />
                    Selecciona tu Rol
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    ¿Para qué posición te estás preparando?
                </p>
            </header>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ROLES.map(r => (
                    <Card key={r.key} selected={role === r.key} onSelect={() => onSelect(r.key)} variant="blue">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                            <span aria-hidden className="text-lg">{r.emoji}</span>
                            {r.label}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500" itemProp="description">{r.description}</p>
                    </Card>
                ))}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-xl border border-dashed border-slate-300 p-4" role="group" aria-labelledby="stack-title">
                <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-slate-600" aria-hidden />
                    <div>
                        <h3 id="stack-title" className="text-[15px] font-semibold text-slate-600">Especificar Stack Tecnológico</h3>
                        <p className="text-sm text-slate-500">Opcional - Ayuda a personalizar las preguntas</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    disabled={!role}
                    title={role ? "" : "Selecciona un rol primero"}
                    className={[
                        "rounded-lg px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none",
                        role ? "bg-white text-slate-800 ring-1 ring-slate-300 hover:bg-slate-50 cursor-pointer" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    ].join(" ")}>
                    Seleccionar
                </button>
            </div>
            {stack.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {stack.map(t => (
                        <span key={t} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                            {t}
                            <button type="button" aria-label={`Quitar ${t}`} onClick={() => onChangeStack(stack.filter(s => s!== t))} className="rounded text-blue-700/70 hover:bg-blue-100">
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <StackModal open={open} role={role} selected={stack} onChange={onChangeStack} onClose={() => setOpen(false)} />
        </section>
    )
}