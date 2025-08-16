'use client'

import Link from "next/link";
import { Home, Brain, Clock } from "lucide-react";
import { mmss, useHUD } from "../hud";

export default function Header() {
  const { remainingSec } = useHUD();

  const over = remainingSec <= 0;
  const tText = mmss(Math.max(0, remainingSec));

  return (
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-2 lg:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800">
          <Link href="/" aria-label="Ir al inicio" className="text-slate-400 hover:text-slate-600">
            <Home className="h-5 w-5" />
          </Link>
          <Brain className="h-5 w-5 text-blue-600" aria-hidden />
          <h1 className="text-base font-semibold">Entrevista en Progreso</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Clock className="h-4 w-4 text-slate-500" aria-hidden />
            {/* tamaño un poco mayor */}
            <span className="text-base font-semibold leading-none tabular-nums tracking-[0.2em]">
              {tText}
            </span>
          </div>

          {/* solo cambia el chip */}
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              over ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {over ? "Tiempo Limitado" : "En Tiempo"}
          </span>
        </div>
      </div>
    </header>
  );
}