'use client';

import Link from 'next/link';
import { Home, Brain, Download } from 'lucide-react';

export default function Header({ sessionId }: { sessionId: string }) {
    function onDownload() {
        document.dispatchEvent(new CustomEvent('download-pdf', { detail: { sessionId } }));
    }

    return (
        <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="mx-auto w-full max-w-7xl px-2 lg:px-6 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800">
                    <Link href="/" aria-label="Ir al inicio" className="text-slate-400 hover:text-slate-600">
                        <Home className="h-5 w-5" />
                    </Link>
                    <Brain className="h-5 w-5 text-blue-600" aria-hidden />
                    <h1 className="text-base font-semibold">Resultados de Entrevista</h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        title="Descargar PDF"
                        onClick={onDownload}
                        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 cursor-pointer"
                    >
                        <Download className="h-4 w-4" />
                        <span>Descargar PDF</span>
                    </button>
                </div>
            </div>
        </header>
    );
}