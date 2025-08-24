import { Play } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="py-24 text-center">
            <span className="mx-auto mb-6 inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                Feedback al instante
            </span>
            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight md:text-6xl">
                Domina las Entrevistas de {""}
                <span className="text-blue-700">Programación</span> con IA
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
                Practica con un entrevistador virtual que simula entrevistas técnicas reales.
                Recibe feedback instantáneo y mejora tus habilidades de programación.
            </p>

            <div className="mt-10 flex justify-center">
                <Link href="/config" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow hover:bg-blue-700">
                    <Play className="h-5 w-5" />
                    Comenzar Práctica
                </Link>
            </div>
        </section>
    )
}