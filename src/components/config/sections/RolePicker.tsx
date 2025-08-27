import { Code2 } from "lucide-react";
import Card from "@/components/common/Card";
import { ROLES } from "@/data/interviewOptions";
export default function RolePicker({
    role,
    onSelect,
}: {
    role: string | null;
    onSelect: (value: string) => void;
}) {
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
        </section>
    )
}