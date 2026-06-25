"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white selection:bg-white/20 relative font-sans antialiased">
      
      {/* Sutil halo de luz central, imperceptible pero suaviza el fondo negro puro */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 text-center max-w-xl px-6 flex flex-col items-center">
        
        {/* Identificador Minimalista (Círculo Perfecto) */}
        <div className="w-24 h-24 rounded-full border border-sky-500/30 bg-black flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(14,165,233,0.15)] transition-all duration-700 hover:border-sky-400">
          <span className="text-[11px] font-light text-neutral-400 tracking-[0.25em] pl-[0.25em] uppercase">
            chat app
          </span>
        </div>

        {/* Título Tipográfico Limpio */}
        <h1 className="text-4xl sm:text-5xl font-normal text-neutral-100 tracking-tight mb-4 leading-tight">
          Chat evolutivo en tiempo real.
        </h1>

        {/* Subtexto Reducido y Elegante */}
        <p className="text-neutral-500 text-sm sm:text-base font-light max-w-sm mx-auto leading-relaxed mb-12">
          Minimalismo. Velocidad. Seguridad profesional.
        </p>

        {/* Acciones Ultra-Minimalistas (Botones Circulares e Iconográficos) */}
        <div className="flex items-center justify-center gap-6 mb-24">
          {/* Botón Principal (Login) */}
          <button
            onClick={() => router.push("/login")}
            className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.1)] group"
            title="Comenzar ahora"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.8} 
              stroke="currentColor" 
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </button>

          {/* Botón Secundario (Register) */}
          <button
            onClick={() => router.push("/register")}
            className="w-14 h-14 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm text-neutral-400 flex items-center justify-center transition-all duration-300 hover:border-neutral-700 hover:text-white active:scale-95 group"
            title="Crear cuenta"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.8} 
              stroke="currentColor" 
              className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        {/* Indicadores Abstractos Inferiores (Estilo Interfaz de Hardware o Portafolio Premium) */}
        <div className="flex items-center justify-center gap-5 text-neutral-600 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            <span className="w-2 h-2 rounded-full border border-neutral-700" />
          </div>
          <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

      </div>

      {/* Detalle decorativo fino en la esquina inferior derecha */}
      <div className="absolute bottom-12 right-12 text-neutral-800 pointer-events-none select-none hidden sm:block">
        <svg className="w-6 h-6 opacity-30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/>
        </svg>
      </div>

    </div>
  );
}