"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">MiApp</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <a href="#caracteristicas" className="text-gray-700 hover:text-blue-600 transition-colors">Características</a>
            <a href="#como-funciona" className="text-gray-700 hover:text-blue-600 transition-colors">Cómo Funciona</a>
          </nav>

          <div className="hidden md:block">
            <Link href="/config" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">Empezar Gratis</Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col space-y-2 p-4">
            <a href="#caracteristicas" className="text-gray-700 hover:text-blue-600 transition-colors">Características</a>
            <a href="#como-funciona" className="text-gray-700 hover:text-blue-600 transition-colors">Cómo Funciona</a>
            <a href="#empezar" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-center">Empezar Gratis</a>
          </nav>
        </div>
      )}
    </header>
  );
}