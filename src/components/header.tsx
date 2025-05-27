"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Heart } from "lucide-react";

export default function Header() {
  const router = useRouter();

  const loginRoute = '/login';

  const handleLoginClick = () => {
    router.push(loginRoute);
  };

  return (
    <header className="w-full bg-white border-b">
      <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-blue-600">VolunteerConnect</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#sobre" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Sobre
          </Link>
          <Link href="/#ongs" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Para ONGs
          </Link>
          <Link href="/#voluntarios" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Para Voluntários
          </Link>
          <Link href="/#como-funciona" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Como Funciona
          </Link>
        </nav>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          onClick={handleLoginClick}
        >
          Login / Cadastro
        </button>
      </div>


      <div className="container mx-auto mt-12 md:mt-16 mb-16 md:mb-24 text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
          Conectando Corações, <span className="text-blue-600">Transformando Vidas</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Facilitamos a colaboração entre ONGs e voluntários para construir um futuro mais justo e equitativo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-8 rounded-md transition-colors shadow-md hover:shadow-lg"
            onClick={handleLoginClick}
          >
            Sou uma ONG
          </button>
          <button
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 text-lg font-semibold py-3 px-8 rounded-md transition-colors shadow-md hover:shadow-lg"
            onClick={handleLoginClick}
          >
            Quero ser Voluntário
          </button>
        </div>
      </div>
    </header>
  );
}