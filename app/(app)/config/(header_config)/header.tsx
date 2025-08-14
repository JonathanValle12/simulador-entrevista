import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
        {/* Izquierda: volver al inicio */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          aria-label="Volver al inicio"
        >
          {/* Flecha izquierda dentro de un sutil círculo */}
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white transition-colors group-hover:border-blue-200">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </span>
          <span className="underline-offset-4 group-hover:underline">
            Volver al inicio
          </span>
        </Link>

        {/* Derecha: icono + título */}
        <div className="inline-flex items-center gap-2">
          {/* Badge con icono “cerebro” en azul */}
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/10">
            <svg
              className="h-5 w-5 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {/* círculo exterior sutil (opcional) */}
              <circle cx="12" cy="12" r="9.2" className="stroke-blue-600/30" />
              {/* “cerebro” simple */}
              <path d="M9 8.5a2.5 2.5 0 0 1 5 0v7a2.5 2.5 0 0 1-5 0z" />
              <path d="M12 6v12" />
              <path d="M9 10.5H7.8a2.3 2.3 0 0 1 0-4.6H9" />
              <path d="M15 13.5h1.2a2.3 2.3 0 0 1 0 4.6H15" />
            </svg>
          </span>

          <span className="text-sm font-semibold text-gray-900 sm:text-base">
            Configurar Entrevista
          </span>
        </div>
      </div>
    </header>
  );
}