import { type ConfigType } from "@/types/interview";
import { BoltIcon } from "lucide-react";
import { TYPES } from "@/data/interviewOptions";
import Card from "../../common/Card";

export default function TypePicker({
    value,
    onSelect,
    isJunior,
}: {
    value: ConfigType | null;
    onSelect: (v: ConfigType) => void;
    isJunior: boolean
}) {
    return (
        <section aria-labelledby="tipo-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <header className="mb-4">
                <h2 id="tipo-title" className="flex items-center gap-2 text-base font-semibold">
                    <BoltIcon className="h-5 w-5 text-purple-600" aria-hidden="true" />
                    Tipo de Entrevista
                </h2>
                <p className="mt-1 text-sm text-slate-500">¿Qué tipo de entrevista quieres practicar?</p>
            </header>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {TYPES.map(t => {
                    const disabled = isJunior && t.disableWhenJunior;
                    return (
                        <Card
                            key={t.key}
                            selected={value === t.key}
                            disabled={disabled}
                            onSelect={() => onSelect(t.key)}
                            className={disabled ? "relative group" : ""}

                            variant="purple">
                            {disabled && (
                                <div className="pointer-events-none absolute -top-2 left-1/2 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white shadow group-hover:block">
                                    Disponible en Mid o Senior
                                    <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                </div>
                            )}
                            <h3 className="text-sm font-semibold text-slate-800">{t.label}</h3>
                            <p className="mt-1 text-xs text-slate-500">{t.description}</p>
                        </Card>
                    )
                })}
            </div>
        </section>
    )
}