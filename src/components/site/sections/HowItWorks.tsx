
export default function HowItWorks() {
    const steps = [
        {
            n: "1",
            title: "Configura tu Entrevista",
            description: "Selecciona el rol, nivel de experiencia y tipo de entrevista que deseas practicar."
        },
        {
            n: "2",
            title: "Practica con IA",
            description: "Responde preguntas técnicas y de comportamiento en tiempo real."
        },
        {
            n: "3",
            title: "Recibe Feedback",
            description: "Obtén una evaluación detallada y recomendaciones personalizadas para mejorar."
        }
    ];

    return (
        <section id="como-funciona" className="py-20">
            <h2 className="mb-3 text-center text-3xl font-extrabold md:text-4xl">
                Cómo Funciona
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-slate-600">
                Tres simples pasos para mejorar tus habilidades de entrevista
            </p>
            <div className="grid gap-10 text-center md:grid-cols-3">
                {steps.map((s, i) => (
                    <div key={i} className="mx-auto max-w-sm">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-700 text-white">
                            <span className="text-xl font-bold">{s.n}</span>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                        <p className="text-slate-600">{s.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}