"use client";

import { useState } from "react";
import { auth } from "../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Mail, ArrowLeft, Loader2 } from "lucide-react"; 

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); 

    if (!email) {
      setMessage({ type: "error", text: "Por favor, ingresá tu email" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({ 
        type: "success", 
        text: "¡Listo! Revisá tu bandeja de entrada para restablecer tu clave." 
      });
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: "No pudimos encontrar una cuenta con ese correo." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

        <div className="text-center mb-8">
          <div className="bg-black text-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Mail size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">¿Olvidaste tu clave?</h1>
          <p className="text-gray-500 mt-2">
            No te preocupes, te enviaremos instrucciones para recuperarla.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="nombre@ejemplo.com"
            className="w-full border px-4 py-3 rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Enviar instrucciones"}
          </button>
        </form>

        {message.text && (
          <div className="mt-4 text-center text-sm">
            {message.text}
          </div>
        )}

        <div className="mt-6 text-center">
          <button onClick={() => window.history.back()}>
            <ArrowLeft size={16} /> Volver
          </button>
        </div>

      </div>
    </div>
  );
}