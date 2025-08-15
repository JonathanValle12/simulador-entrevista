
export default function TipsCard() {
    return (
        <article className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-blue-900 mb-5">Consejos</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-blue-700 marker:text-blue-500">
                <li>Estructura tus respuestas con ejemplos especificos</li>
                <li>Explica tu proceso de pensamiento</li>
                <li>No tengas miedo de hacer preguntas aclaratorias</li>
                <li>Mantén la calma y tómate tu tiempo</li>
            </ul>
        </article>
    )
}