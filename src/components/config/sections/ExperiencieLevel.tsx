import { UsersIcon } from "lucide-react";
import { type ExperienceLevel } from "@/types/interview";

export default function ExperiencieLevel({
    value,
    onChange,
}: {
    value: ExperienceLevel | null;
    onChange: (v: ExperienceLevel) => void;
}) {
    const options: { key: ExperienceLevel; title: string; description: string }[] = [
        { key: "Junior", title: "Junior (0-2 años)", description: "Conceptos básicos y fundamentos" },
        { key: "Mid-Level", title: "Mid-Level (2-5 años)", description: "Experiencia práctica y proyectos" },
        { key: "Senior", title: "Senior (5+ años)", description: "Liderazgo técnic y arquitectura" }
    ];

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="nivel-title">
            <header className="mb-4">
                <h2 id="nivel-title" className="flex items-center gap-2 text-base font-semibold">
                    <UsersIcon className="h-5 w-5 text-green-600" aria-hidden="true" />
                    Nivel de Experiencia
                </h2>
                <p className="mt-1 text-sm text-slate-500">¿Cuál es tu nivel de experiencia actual?</p>
            </header>
            <fieldset className="space-y-4">
                <legend className="sr-only">Nivel</legend>
                {options.map(o => (
                    <label key={o.key} className="flex items-start gap-3 p-3 hover:bg-slate-50 cursor-pointer">
                        <input type="radio"
                            name="experience-level"
                            className="mt-1 h-4 w-4 ascent-blue-600"
                            checked={value === o.key}
                            onChange={() => onChange(o.key)} />
                        <div>
                            <p className="text-sm font-medium text-slate-800">{o.title}</p>
                            <p className="text-xs text-slate-500">{o.description}</p>
                        </div>
                    </label>
                ))}
            </fieldset>
        </section>
    )
}