import { useCallback } from "react";
import { type TabKey } from "@/types/ui";

type TabsProps = {
    value: TabKey;
    onChange: (v: TabKey) => void;
    className?: string;
}

const ITEMS: Array<{ key: TabKey; label: string }> = [
    { key: 'detalles', label: 'Preguntas Detalladas' },
    { key: 'general', label: 'Feedback General' },
    { key: 'recomendaciones', label: 'Recomendaciones' },
];

export default function Tabs({ value, onChange, className = '' }: TabsProps) {
    const idx = ITEMS.findIndex(i => i.key === value);

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            e.preventDefault();
            const dir = e.key === 'ArrowRight' ? 1 : -1;
            const next = (idx + dir + ITEMS.length) % ITEMS.length;
            onChange(ITEMS[next].key);
        },
        [idx, onChange]
    );


    return (
        <nav aria-label="Selecciones del informe" role="tablist" className={`w-full rounded-xl bg-slate-100 p-1 grid grid-cols-3 gap-1 ${className}`}>
            {ITEMS.map((it, i) => {
                const active = value === it.key;
                return (
                    <button key={it.key} role="tab" type="button" aria-selected={active} tabIndex={active ? 0 : -1} 
                            onClick={() => onChange(it.key)} 
                            onKeyDown={onKeyDown} 
                            className={[
                                'h-9 rounded-lg text-sm font-medium transition-colors',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60',
                                active  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-600 hover:text-slate-800'
                            ].join(' ')}>
                        {it.label}
                    </button>
                )
            })}
        </nav>
    )
}