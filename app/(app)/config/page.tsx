'use client'

import "../../styles/globals.css";
import { useState } from "react";
import { BoltIcon, ClockIcon, PlayCircleIcon, UsersIcon, Code2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Config() {
    const [duracion, setDuracion] = useState(30);
    const [nivel, setNivel] = useState(3);
    const [role, setRole] = useState<string | null>(null);
    const [experiencia, setExperiencia] = useState<string | null>(null);
    const [tipo, setTipo] = useState<string | null>(null);

    
    const router = useRouter();

    const onStart = async () => {
        const id = crypto.randomUUID();
        const config = {
            role, experiencia, tipo,
            duracion,
            dificultad: nivel
        }

        await fetch("/api/interview/sessions", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ id, config })
        });

        router.push(`/entrevista/${id}`)
    }

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
                            <article onClick={() => setRole("Frontend Developer")}
                                className={`h-full cursor-pointer rounded-xl border p-4 transition ${role === "Frontend Developer" ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`} itemScope itemType="https://schema.org/Service">
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                    <span aria-hidden className="text-lg">🎨</span>
                                    <span itemProp="name">Frontend Developer</span>
                                </h3>
                                <p className="mt-1 text-xs text-slate-500" itemProp="description">React, Vue, Angular, CSS</p>
                                <a href="#" className="sr-only" aria-label="Seleccionar rol Frontend Developer">Seleccionar</a>
                            </article>
                            <article onClick={() => setRole("Backend Developer")}
                                className={`h-full cursor-pointer rounded-xl border p-4 transition ${role === "Backend Developer" ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`} itemScope itemType="https://schema.org/Service">
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                    <span aria-hidden className="text-lg">⚙️</span>
                                    <span itemProp="name">Backend Developer</span>
                                </h3>
                                <p className="mt-1 text-xs text-slate-500" itemProp="description">Node.js, Python, Java, APis</p>
                                <a href="#" className="sr-only" aria-label="Seleccionar rol Backend Developer">Seleccionar</a>
                            </article>
                            <article onClick={() => setRole("Full Stack Developer")}
                                className={`h-full cursor-pointer rounded-xl border p-4 transition ${role === "Full Stack Developer" ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`} itemScope itemType="https://schema.org/Service">
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                    <span aria-hidden className="text-lg">🧩</span>
                                    <span itemProp="name">Full-Stack Developer</span>
                                </h3>
                                <p className="mt-1 text-xs text-slate-500" itemProp="description">Frontend + Backend</p>
                                <a href="#" className="sr-only" aria-label="Seleccionar rol Full-Stack Developer">Seleccionar</a>
                            </article>
                            <article onClick={() => setRole("Mobile Developer")}
                                className={`h-full cursor-pointer rounded-xl border p-4 transition ${role === "Mobile Developer" ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`} itemScope itemType="https://schema.org/Service">
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                    <span aria-hidden className="text-lg">📱</span>
                                    <span itemProp="name">Mobile Developer</span>
                                </h3>
                                <p className="mt-1 text-xs text-slate-500" itemProp="description">React Native, Flutter, iOS, Android</p>
                                <a href="#" className="sr-only" aria-label="Seleccionar rol Mobile Developer">Seleccionar</a>
                            </article>
                            <article onClick={() => setRole("DevOps Engineer")}
                                className={`h-full cursor-pointer rounded-xl border p-4 transition ${role === "DevOps Engineer" ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`} itemScope itemType="https://schema.org/Service">
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                    <span aria-hidden className="text-lg">🚀</span>
                                    <span itemProp="name">DevOps Engineer</span>
                                </h3>
                                <p className="mt-1 text-xs text-slate-500" itemProp="description">AWS, Docker, Kubernetes, CI/CD</p>
                                <a href="#" className="sr-only" aria-label="Seleccionar rol DevOps Engineer">Seleccionar</a>
                            </article>
                            <article onClick={() => setRole("Data Engineer")}
                                className={`h-full cursor-pointer rounded-xl border p-4 transition ${role === "Data Engineer" ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`} itemScope itemType="https://schema.org/Service">
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                    <span aria-hidden className="text-lg">📊</span>
                                    <span itemProp="name">Data Engineer</span>
                                </h3>
                                <p className="mt-1 text-xs text-slate-500" itemProp="description">Python, SQL, ETL, Big Data</p>
                                <a href="#" className="sr-only" aria-label="Seleccionar rol Data Engineer">Seleccionar</a>
                            </article>
                        </div>
                    </section>

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
                            <label className="flex items-start gap-3 p-3 hover:bg-slate-50 cursor-pointer">
                                <input type="radio" name="experience-level" className="mt-1 h-4 w-4 ascent-blue-600" aria-label="Junior (0-2 años)" onChange={() => setExperiencia("Junior")} />
                                <div>
                                    <p className="text-sm font-medium text-slate-800">Junior (0-2 años)</p>
                                    <p className="text-xs text-slate-500">Conceptos básicos y fundamentos</p>
                                </div>
                            </label>
                            <label className="flex items-start gap-3 p-3 hover:bg-slate-50 cursor-pointer">
                                <input type="radio" name="experience-level" className="mt-1 h-4 w-4 ascent-blue-600" aria-label="Junior (0-2 años)" onChange={() => setExperiencia("Mid-Level")} />
                                <div>
                                    <p className="text-sm font-medium text-slate-800">Mid-Level (2-5 años)</p>
                                    <p className="text-xs text-slate-500">Experiencia práctica y proyectos</p>
                                </div>
                            </label>
                            <label className="flex items-start gap-3 p-3 hover:bg-slate-50 cursor-pointer">
                                <input type="radio" name="experience-level" className="mt-1 h-4 w-4 ascent-blue-600" aria-label="Junior (0-2 años)" onChange={() => setExperiencia("Senior")} />
                                <div>
                                    <p className="text-sm font-medium text-slate-800">Senior (5+ años)</p>
                                    <p className="text-xs text-slate-500">Liderazgo técnico y arquitectura</p>
                                </div>
                            </label>
                        </fieldset>
                    </section>

                    <section aria-labelledby="tipo-title" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <header className="mb-4">
                            <h2 id="tipo-title" className="flex items-center gap-2 text-base font-semibold">
                                <BoltIcon className="h-5 w-5 text-purple-600" aria-hidden="true" />
                                Tipo de Entrevista
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">¿Qué tipo de entrevista quieres practicar?</p>
                        </header>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <article onClick={() => setTipo("Técnica")}
                                className={`cursor-pointer rounded-xl border p-4 transition ${tipo === "Técnica" ? "border-purple-600 bg-purple-50 ring-2 ring-purple-200" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}>
                                <h3 className="text-sm font-semibold text-slate-800">Técnica</h3>
                                <p className="mt-1 text-xs text-slate-500">Algoritmos, estructuras de datos, coding</p>
                                <a href="#" className="sr-only" aria-label="Elegir Técnica">Elegir tipo Técnica</a>
                            </article>
                            <article onClick={() => setTipo("Comportamental")}
                                className={`cursor-pointer rounded-xl border p-4 transition ${tipo === "Comportamental" ? "border-purple-600 bg-purple-50 ring-2 ring-purple-200" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}>
                                <h3 className="text-sm font-semibold text-slate-800">Comportamental</h3>
                                <p className="mt-1 text-xs text-slate-500">Experiencias, situaciones, soft skills</p>
                                <a href="#" className="sr-only" aria-label="Elegir Técnica">Elegir tipo Comportamental</a>
                            </article>
                            <article onClick={() => setTipo("Diseño de Sistemas")}
                                className={`cursor-pointer rounded-xl border p-4 transition ${tipo === "Diseño de Sistemas" ? "border-purple-600 bg-purple-50 ring-2 ring-purple-200" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}>
                                <h3 className="text-sm font-semibold text-slate-800">Diseño de Sistemas</h3>
                                <p className="mt-1 text-xs text-slate-500">Arquitectura, escalabilidad, trade-offs</p>
                                <a href="#" className="sr-only" aria-label="Elegir Técnica">Elegir tipo Diseño de Sistemas</a>
                            </article>
                            <article onClick={() => setTipo("Mixta")}
                                className={`cursor-pointer rounded-xl border p-4 transition ${tipo === "Mixta" ? "border-purple-600 bg-purple-50 ring-2 ring-purple-200" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}>
                                <h3 className="text-sm font-semibold text-slate-800">Mixta</h3>
                                <p className="mt-1 text-xs text-slate-500">Combinación de técnica y comportamental</p>
                                <a href="#" className="sr-only" aria-label="Elegir Técnica">Elegir tipo Mixta</a>
                            </article>
                        </div>
                    </section>
                </section>

                <aside aria-labelledby="resumen-title" className="space-y-6" role="complementary">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <header className="mb-2">
                            <h2 className="flex items-center gap-2 text-base font-semibold">
                                <ClockIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                                Duración
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">Tiempo estimado de la entrevista</p>
                        </header>

                        {/* Valor centrado como en tu captura */}
                        <div className="mt-3 flex justify-center">
                            <div className="inline-flex items-baseline gap-1">
                                <span className="text-2xl font-semibold text-blue-600 leading-none tabular-nums">
                                    {duracion}
                                </span>
                                <span className="text-base font-normal text-slate-500 leading-none">
                                    minutos
                                </span>
                            </div>
                        </div>
                        <input type="range" min={15} max={90} step={5} value={duracion}
                            onChange={(e) => {
                                const val = Number(e.target.value); setDuracion(val);
                                const percent = ((val - 15) / (90 - 15)) * 100;
                                e.target.style.setProperty("--value-percent", `${percent}%`);
                            }}
                            style={{ "--value-percent": `${((duracion - 15) / (90 - 15)) * 100}%` } as React.CSSProperties} />

                        <div className="mt-2 flex justify-between text-xs text-slate-500">
                            <span>15 min</span>
                            <span>90 min</span>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <header className="mb-2">
                            <h2 className="text-base font-semibold">Dificultad</h2>
                            <p className="mt-1 text-sm text-slate-500">Nivel de complejidad de las preguntas</p>
                        </header>
                        <div className="flex items-center justify-center mt-6 gap-2">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={`inline-block h-3 w-3 rounded-full ${i < nivel ? "bg-blue-600" : "bg-blue-300"}`} />
                            ))}
                        </div>
                        <p className="mt-2 text-sm text-slate-600 text-center">
                            {['Muy fácil', 'Fácil', 'Intermedio', 'Difícil', 'Muy difícil'][nivel - 1]}
                        </p>
                        <input type="range" min={1} max={5} step={1} value={nivel}
                            onChange={(e) => {
                                const val = Number(e.target.value); setNivel(val);
                                e.target.style.setProperty("--value-percent", `${((val - 1) / 4) * 100}%`);
                            }}
                            style={{ "--value-percent": `${((nivel - 1) / 4) * 100}%` } as React.CSSProperties}
                            className="range mt-4 accent-blue-600"
                            aria-label="Dificultad" />
                    </section>

                    <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
                        <h2 className="mb-4 text-[15px] font-semibold leading-none text-[#1E3ABA]">Resumen</h2>
                        <dl className="space-y-2 text-sm">
                            {[
                                { label: "Rol", value: role },
                                { label: "Experiencia", value: experiencia },
                                { label: "Tipo", value: tipo },
                                { label: "Duración", value: `${duracion} min`, alwaysShow: true }
                            ]
                                .filter(item => item.value || item.alwaysShow)
                                .map(({ label, value }) => (
                                    <div key={label} className="flex items-center justify-between">
                                        <dt className="text-gray-700">{label}:</dt>
                                        <dd className="font-medium text-gray-900">{value}</dd>
                                    </div>
                                ))
                            }
                        </dl>
                    </section>

                    <button
                        type="button"
                        onClick={onStart}
                        title="Iniciar entrevista"
                        disabled={!role || !tipo || !experiencia || !duracion}
                        className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1
                            ${role && tipo && experiencia && duracion
                                ? "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300 cursor-pointer"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed focus:ring-gray-300"
                            }`}>
                        <PlayCircleIcon className="h-5 w-5" />
                        Comenzar Entrevista
                    </button>
                </aside>
            </div>
        </>
    )
}