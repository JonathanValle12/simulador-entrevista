'use client';

import { X, Code2, Server, Smartphone, Boxes, Database, Tag } from "lucide-react";
import { STACK_GROUPS_BY_ROLE } from "@/data/stacks";

type Props = {
    open: boolean;
    role: string | null;
    selected: string[];
    onChange: (next: string[]) => void;
    onClose: () => void;
};

const MAX = 6;

const GROUP_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
    Frontend: Code2,
    Backend: Server,
    Mobile: Smartphone,
    DevOps: Boxes,
    Data: Database,
};

function initialFor(name: string) {
    const m = name.match(/[A-Za-zÁÉÍÓÚÜÑ0-9]/i);
    return (m?.[0] ?? name[0] ?? "?").toUpperCase();
}

export default function StackModal({ open, role, selected, onChange, onClose }: Props) {
    if (!open || !role) return null;

    const groups = STACK_GROUPS_BY_ROLE[role] ?? [];

    const atLimit = selected.length >= MAX;
    const remove = (t: string) => onChange(selected.filter(s => s !== t));
    const toggle = (t: string) => {
        const has = selected.includes(t);
        if (has) return remove(t);
        if (atLimit) return;
        onChange([...selected, t]);
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="stack-title"
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
        >
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative z-10 mx-4 w-full max-w-3xl rounded-2xl bg-white shadow-xl overflow-hidden">
                <header className="px-6 pt-6 pb-4 border-b border-slate-200">
                    <h2 id="stack-title" className="text-xl font-semibold">Seleccionar Tecnologías</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Elige hasta {MAX} tecnologías que dominas ({selected.length}/{MAX})
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {selected.length === 0 ? (
                            <span className="text-xs text-slate-500">Ninguna seleccionada</span>
                        ) : selected.map(t => (
                            <span key={t}
                                className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200"
                            >
                                {t}
                                <button type="button" onClick={() => remove(t)} aria-label={`Quitar ${t}`} className="rounded p-0.5 hover:bg-blue-100">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                </header>

                <div className="px-5 py-3 max-h-[36vh] md:max-h-[40vh] overflow-y-auto">
                    {groups.map((g, gi) => {
                        const Icon = GROUP_ICON[g.label] ?? Tag;
                        return (
                            <section key={gi} className="mb-5">
                                {g.label && (
                                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Icon className="h-4 w-4 text-slate-500" aria-hidden />
                                        {g.label}
                                    </h3>
                                )}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                                    {g.items.map((t) => {
                                        const active = selected.includes(t);
                                        const disabled = !active && atLimit;
                                        return (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => !disabled && toggle(t)}
                                                aria-pressed={active}
                                                aria-label={t}
                                                className={[
                                                    "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                                                    active
                                                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                                                        : "border-slate-200 hover:bg-slate-50",
                                                    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                                                ].join(" ")}
                                            >
                                                <span
                                                    aria-hidden
                                                    className={[
                                                        "grid place-items-center rounded-full",
                                                        active
                                                            ? "h-8 w-8 bg-blue-600 text-white text-sm font-bold"
                                                            : "h-7 w-7 bg-slate-200 text-slate-700 text-xs font-semibold"
                                                    ].join(" ")}
                                                >
                                                    {initialFor(t)}
                                                </span>
                                                <span className={active ? "font-semibold text-blue-700 truncate" : "text-slate-800 truncate"}>
                                                    {t}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>

                <footer className="px-6 py-4 border-t border-slate-200 flex justify-end">
                    <button type="button" onClick={onClose}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 cursor-pointer">
                        Cerrar
                    </button>
                </footer>
            </div>
        </div>
    );
}
