'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ConfigType, ExperienceLevel, Difficulty } from "@/types/interview";
import RolePicker from "@/components/config/sections/RolePicker";
import ExperiencieLevel from "@/components/config/sections/ExperiencieLevel";
import TypePicker from "@/components/config/sections/TypePicker";
import Sidebar from "@/components/config/ui/Sidebar";

export default function Config() {
    const [duracion, setDuracion] = useState(30);
    const [nivel, setNivel] = useState<Difficulty>(3);
    const [role, setRole] = useState<string | null>(null);
    const [experiencia, setExperiencia] = useState<ExperienceLevel | null>(null);
    const [tipo, setTipo] = useState<ConfigType | null>(null);

    const router = useRouter();
    const isJunior = experiencia === "Junior";

    const onStart = async () => {
        const id = crypto.randomUUID();
        const config = { role, experiencia, tipo, duracion, dificultad: nivel };

        await fetch("/api/interview/sessions", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ id, config })
        });

        router.push(`/entrevista/${id}`)
    }

    useEffect(() => {
        if (isJunior && tipo === "Diseño de Sistemas") setTipo(null);
    }, [isJunior, tipo]);

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-sm font-medium text-slate-600">Configuración de Entrevista</h1>
                <p className="text-sm text-slate-500">Paso 1 de 2</p>
            </div>
            <div aria-hidden className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-2 w-1/2 rounded-full bg-blue-600" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <section className="space-y-6 lg:col-span-2">
                    <RolePicker role={role} onSelect={setRole} />
                    <ExperiencieLevel value={experiencia} onChange={setExperiencia} />
                    <TypePicker value={tipo} onSelect={setTipo} isJunior={isJunior} />
                </section>
                <Sidebar
                    duracion={duracion} setDuracion={setDuracion}
                    nivel={nivel} setNivel={setNivel}
                    role={role} experiencia={experiencia ?? null} tipo={tipo}
                    onStart={onStart} />
            </div>
        </>
    )
}