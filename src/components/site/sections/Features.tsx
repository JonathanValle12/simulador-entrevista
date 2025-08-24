import { BarChart3, Code2, MessagesSquare, Settings, Target, Users } from "lucide-react";

export default function Features() {
    return (
        <section id="caracteristicas" className="py-20">
            <h2 className="mb-4 text-center text-3xl font-extrabold md:text-4xl">
                Todo lo que Necesitas para Triunfar
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-slate-600">
                Herramientas profesionales diseñadas para prepararte para cualquier entrevista técnica
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <MessagesSquare className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1 text-lg font-semibold">IA conversacional</h3>
                    <p className="text-slate-600">Entrevistador IA que simula conversaciones reales con preguntas adaptativas.</p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Target className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1 text-lg font-semibold">Feedback Instantáneo</h3>
                    <p className="text-slate-600">Evaluación de tus respuestas con sugerencias de mejora específicas</p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Code2 className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1 text-lg font-semibold">Simulación Realista</h3>
                    <p className="text-slate-600">Entrevistas cronometradas que replican el ambiente real.</p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Users className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1 text-lg font-semibold">Múltiples Roles</h3>
                    <p className="text-slate-600">Frontend, Backend, Full-Stack, DevOps y más especialidades.</p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <BarChart3 className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1 text-lg font-semibold">Seguimiento de Progreso</h3>
                    <p className="text-slate-600">Historial de entrevistas y métricas de mejora continua.</p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Settings className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1 text-lg font-semibold">Personalizable</h3>
                    <p className="text-slate-600">Ajusta dificultad, duración y tipo de preguntas según tus necesidades.</p>
                </article>
            </div>
        </section>
    )
}