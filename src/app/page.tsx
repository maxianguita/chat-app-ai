"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] overflow-hidden relative">
      
      {/* Elementos Decorativos de Fondo (Efecto Aurora) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-900/30 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 blur-[120px] rounded-full"></div>

      <div className="relative z-10 text-center max-w-2xl px-6">
        {/* Badge Superior */}
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-[0.2em]">
            chat app
          </span>
        </div>

        {/* Título Principal con Gradiente */}
        <h1 className="text-5xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-6 tracking-tighter">
          Chat evolutivo <br /> en tiempo real.
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl mb-10 leading-relaxed max-w-lg mx-auto">
          Experimenta una interfaz minimalista diseñada para la velocidad. 
          Seguridad de nivel profesional con autenticación integrada.
        </p>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="group relative bg-white text-black font-bold px-8 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Comenzar ahora
          </button>

          <button
            onClick={() => router.push("/register")}
            className="group border border-white/10 bg-white/5 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-2xl transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
          >
            Crear cuenta
          </button>
        </div>

        {/* Footer Visual */}
        <div className="mt-20 flex justify-center items-center gap-8 opacity-30 grayscale italic font-medium text-sm text-white">
          <span>Rápido</span>
          <span className="w-1 h-1 bg-white rounded-full"></span>
          <span>Seguro</span>
          <span className="w-1 h-1 bg-white rounded-full"></span>
          <span>Minimalista</span>
        </div>
      </div>
    </div>
  );
}