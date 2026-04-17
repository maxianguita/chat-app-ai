"use client";

import { useState } from "react";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();


  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const hasLength = password.length >= 6;

  const isValidPassword =
    hasUpper && hasNumber && hasSymbol && hasLength;

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
    condition ? "text-green-500" : "text-gray-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-sky-900 to-slate-800 p-6">

      <div className="w-full max-w-sm bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-8 border border-white/20">

     
        <button
          onClick={() => router.push("/login")}
          className="text-sm text-gray-400 hover:text-black mb-6"
        >
          ← Volver al login
        </button>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">
            Crear cuenta
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Registrate para comenzar
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full mt-2 px-4 py-3 rounded-xl border outline-none text-sm text-black ${
                error ? "border-red-400" : "border-gray-200"
              }`}
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full mt-2 px-4 py-3 rounded-xl border outline-none text-sm text-black ${
                error ? "border-red-400" : "border-gray-200"
              }`}
            />
          </div>
          <div className="text-xs space-y-1 mt-1">
            <p className={checkStyle(hasLength)}>• Mínimo 6 caracteres</p>
            <p className={checkStyle(hasUpper)}>• Una mayúscula</p>
            <p className={checkStyle(hasNumber)}>• Un número</p>
            <p className={checkStyle(hasSymbol)}>• Un carácter especial</p>
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full mt-4 bg-black text-white py-3 rounded-xl font-semibold transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            {loading ? "Cargando..." : "Registrarse"}
          </button>
        </div>
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