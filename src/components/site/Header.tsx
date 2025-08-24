"use client";

import { useState } from "react";
import { Code2, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="flex justify-between h-16 items-center mx-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-blue-600">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">CodePrep AI</span>
        </Link>
        <nav className="hidden md:flex space-x-8">
          <a href="#caracteristicas" className="text-gray-700 hover:text-blue-600 transition-colors">Características</a>
          <a href="#como-funciona" className="text-gray-700 hover:text-blue-600 transition-colors">Cómo Funciona</a>
        </nav>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none cursor-pointer">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <nav className="flex flex-col space-y-2 p-4">
            <a href="#caracteristicas" className="text-gray-700 hover:text-blue-600 transition-colors">Características</a>
            <a href="#como-funciona" className="text-gray-700 hover:text-blue-600 transition-colors">Cómo Funciona</a>
          </nav>
        </div>
      )}
    </header>
  );
}