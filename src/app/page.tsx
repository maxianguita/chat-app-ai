"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  BrainCircuit,
  User,
  Bot
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const techs = [
    "Next.js",
    "NestJS",
    "Firebase",
    "Firestore",
    "OpenRouter",
    "GPT-4o Mini",
    "Tailwind CSS",
    "TypeScript",
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white selection:bg-cyan-500/30">

      {/* Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-[180px]" />
        <div className="absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[170px]" />
        <div className="absolute right-0 top-1/3 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[170px]" />
      </div>

      {/* Tech Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center px-6 py-20">

        {/* Top Feature Badge */}
        <div className="rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 backdrop-blur-xl animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="text-cyan-400" size={14} />
            <span className="text-xs font-medium tracking-wide text-sky-200/90">
              Conversación inteligente en tiempo real
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mt-10 flex flex-col items-center text-center">
          <h1 className="max-w-5xl text-5xl font-black tracking-tight leading-[1.1] md:text-7xl lg:text-8xl">
            Tu asistente inteligente
            <span className="block mt-3 bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent pb-2">
              Resolvé problemas más rápido.
            </span>
          </h1>
          
          <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-neutral-400 font-light">
            Desarrollá aplicaciones impulsadas por IA utilizando un ecosistema potente basado en 
            <span className="text-zinc-200 font-medium"> Next.js</span>, 
            <span className="text-zinc-200 font-medium"> NestJS</span> y 
            <span className="text-zinc-200 font-medium"> Firebase</span>. Seguridad y velocidad nativas.
          </p>
        </div>

        {/* Call to Actions (CTAs) */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="group flex items-center gap-2.5 rounded-xl bg-zinc-100 px-7 py-3.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-white hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(56,189,248,0.2)]"
          >
            Comenzar ahora
            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => router.push("/register")}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-7 py-3.5 text-sm font-semibold backdrop-blur-xl transition-all duration-300 hover:border-sky-500/50 hover:bg-sky-500/10"
          >
            Crear cuenta
          </button>
        </div>

        {/* Features Grid */}
        <div className="mt-28 grid w-full max-w-6xl gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-zinc-800">
            <BrainCircuit className="mb-5 text-sky-400" size={28} />
            <h3 className="text-lg font-semibold text-zinc-100">IA Conversacional</h3>
            <p className="mt-2.5 text-sm text-neutral-400 leading-relaxed font-light">
              Integración nativa con modelos avanzados para responder consultas complejas, optimizar flujos y automatizar tareas críticas.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-zinc-800">
            <ShieldCheck className="mb-5 text-emerald-400" size={28} />
            <h3 className="text-lg font-semibold text-zinc-100">Arquitectura Segura</h3>
            <p className="mt-2.5 text-sm text-neutral-400 leading-relaxed font-light">
              Validación robusta desde el servidor mediante Firebase Admin SDK, protegiendo rutas y datos de manera estricta.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-zinc-800">
            <Zap className="mb-5 text-amber-400" size={28} />
            <h3 className="text-lg font-semibold text-zinc-100">Alto Rendimiento</h3>
            <p className="mt-2.5 text-sm text-neutral-400 leading-relaxed font-light">
              Sincronización fluida en tiempo real estructurada en Firestore, asegurando tiempos de respuesta mínimos y escalabilidad.
            </p>
          </div>
        </div>

        {/* Technologies Badges */}
        <div className="mt-20 flex flex-wrap justify-center gap-2 max-w-3xl">
          {techs.map((tech) => (
            <div
              key={tech}
              className="rounded-full border border-zinc-900 bg-zinc-950/60 px-4 py-1.5 text-xs text-zinc-400 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-500/30 hover:text-sky-300"
            >
              {tech}
            </div>
          ))}
        </div>

        {/* Chat Preview (UI Match) */}
        <div className="relative mt-24 w-full max-w-4xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-sky-500/5 to-indigo-500/5 blur-2xl pointer-events-none" />
          
          <div className="relative rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 md:p-8 backdrop-blur-2xl">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h2 className="text-sm font-medium text-zinc-200">Nova AI Chat Preview</h2>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Asistente en línea</p>
                </div>
              </div>
              <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-1 text-[10px] text-zinc-400 tracking-wider uppercase">
                GPT-4o Mini
              </div>
            </div>

            <div className="space-y-4">
              {/* Msg Usuario */}
              <div className="flex items-end gap-2.5 justify-end">
                <div className="max-w-[75%] rounded-2xl rounded-tr-none bg-zinc-100 px-4 py-3 text-xs text-zinc-900 shadow-sm font-light">
                  ¿Cómo autentico usuarios con Firebase y Next.js?
                </div>
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                  <User size={12} />
                </div>
              </div>

              {/* Msg Bot */}
              <div className="flex items-end gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <Bot size={12} />
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-tl-none border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 text-xs text-zinc-300 font-light leading-relaxed">
                  Utilizá Firebase Authentication en el cliente para gestionar la sesión. Luego, enviá el ID Token obtenido hacia tu servidor NestJS para verificarlo con el SDK de administración antes de autorizar solicitudes.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 w-full border-t border-zinc-900 pt-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h3 className="text-md font-semibold tracking-wide text-zinc-200">Nova AI</h3>
              <p className="mt-1 text-xs text-neutral-500 font-light">
                Infraestructura robusta para asistentes conversacionales modernos.
              </p>
            </div>

            <div className="flex gap-6 text-xs text-neutral-500 font-medium">
              <button className="transition hover:text-zinc-200">Documentación</button>
              <button className="transition hover:text-zinc-200">GitHub</button>
              <button className="transition hover:text-zinc-200">Contacto</button>
            </div>
          </div>

          <div className="mt-10 border-t border-zinc-900/60 pt-6 text-center text-xs text-neutral-600 font-light">
            <p>© {new Date().getFullYear()} Nova AI. Todos los derechos reservados.</p>
            <p className="mt-2 text-zinc-400 font-normal tracking-wide">
              Designed & Developed by <span className="font-semibold text-zinc-300">Maxi Anguita</span>
            </p>
          </div>
        </footer>

      </div>
    </main>
  );
}