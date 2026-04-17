"use client";

import { useState } from "react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, KeyRound, X, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState({ type: "", text: "" });
  const [resetLoading, setResetLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) return setError("Completa todos los campos");
    
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/chat");
    } catch (err) {
      setError("Credenciales incorrectas o usuario no encontrado");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!resetEmail) return setResetMessage({ type: "error", text: "Ingresá tu email" });
    
    try {
      setResetLoading(true);
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage({ type: "success", text: "Email enviado. Revisá tu bandeja." });
    } catch {
      setResetMessage({ type: "error", text: "Error al enviar. Verificá el email." });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden p-6">
      

      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-sky-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-10 border border-white/20">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">CHAT APP</h1>
            <p className="text-slate-500 mt-2 font-medium">Iniciá sesión para continuar</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-semibold text-center animate-bounce">
                {error}
              </p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Ingresar"}
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-3 text-center">
            <button
              onClick={() => setShowReset(true)}
              className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
            <p className="text-sm text-slate-400">
              ¿No tenés cuenta?{" "}
              <span
                onClick={() => router.push("/register")}
                className="text-slate-900 font-bold cursor-pointer hover:underline"
              >
                Registrate
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* MODAL PARA  RECUPERAR CONTRASEÑA */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowReset(false)}
          />

          <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowReset(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <KeyRound className="w-8 h-8 text-sky-600" />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-900">Recuperar clave</h2>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Ingresá tu email y te enviaremos instrucciones de seguridad.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all text-slate-900"
              />

              <button
                onClick={handleReset}
                disabled={resetLoading}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-sky-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {resetLoading ? <Loader2 className="animate-spin" /> : "Enviar instrucciones"}
              </button>

              {resetMessage.text && (
                <div className={`p-4 rounded-2xl text-xs font-bold text-center animate-in fade-in slide-in-from-top-1 ${
                  resetMessage.type === "success" 
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                  : "bg-rose-50 text-rose-600 border border-rose-100"
                }`}>
                  {resetMessage.text}
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowReset(false)}
              className="w-full mt-6 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}