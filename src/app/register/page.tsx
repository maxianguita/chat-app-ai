"use client";

import { useState } from "react";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Validaciones de contraseña en tiempo real
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const hasLength = password.length >= 6;

  const isValidPassword = hasUpper && hasNumber && hasSymbol && hasLength;

  const handleRegister = async () => {
    setError("");

    if (!email || !password) {
      setError("Completa todos los campos");
      return;
    }

    if (!email.includes("@")) {
      setError("Email inválido");
      return;
    }

    if (!isValidPassword) {
      setError("La contraseña no cumple los requisitos");
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/chat");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Este email ya está registrado");
      } else {
        setError("Error al registrarse");
      }
      setLoading(false);
    }
  };

  const checkStyle = (condition: boolean) =>
    condition ? "text-emerald-600 font-medium" : "text-gray-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-sky-900 to-slate-800 p-6">
      <div className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-8 border border-white/20">
        
        {/* Botón Volver */}
        <button
          onClick={() => router.push("/login")}
          className="group flex items-center gap-1.5 text-sm text-gray-400 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          Volver al login
        </button>

        {/* Encabezado */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">
            Crear cuenta
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Registrate para comenzar
          </p>
        </div>

        <div className="space-y-4">
          {/* Input Email */}
          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full mt-2 px-4 py-3 rounded-xl border outline-none text-sm text-black transition-all ${
                error && (!email || !email.includes("@") || error === "Este email ya está registrado")
                  ? "border-red-400 focus:border-red-400"
                  : "border-gray-200 focus:border-black"
              }`}
            />
          </div>

          {/* Input Password con el Ojo */}
          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
              Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 pr-11 rounded-xl border outline-none text-sm text-black transition-all ${
                  error && (!password || !isValidPassword)
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-200 focus:border-black"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                tabIndex={-1} // Evita que interrumpa el flujo del tabulador
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Requisitos de la Contraseña */}
          <div className="text-xs space-y-1.5 mt-2 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
            <p className={checkStyle(hasLength)}>• Mínimo 6 caracteres</p>
            <p className={checkStyle(hasUpper)}>• Una mayúscula</p>
            <p className={checkStyle(hasNumber)}>• Un número</p>
            <p className={checkStyle(hasSymbol)}>• Un carácter especial</p>
          </div>

          {/* Feedback de Error */}
          {error && (
            <p className="text-red-500 text-xs text-center font-medium bg-red-50 py-2 rounded-lg border border-red-100 animate-fade-in">
              {error}
            </p>
          )}

          {/* Botón de Registro */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full mt-4 bg-black text-white py-3 rounded-xl font-semibold transition-all ${
              loading 
                ? "opacity-70 cursor-not-allowed" 
                : "hover:bg-gray-800 active:scale-[0.99]"
            }`}
          >
            {loading ? "Cargando..." : "Registrarse"}
          </button>
        </div>

        {/* Enlace al Login */}
        <p className="text-center text-gray-400 text-xs mt-6">
          ¿Ya tenés cuenta?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-black font-semibold cursor-pointer hover:underline"
          >
            Iniciar sesión
          </span>
        </p>

      </div>
    </div>
  );
}