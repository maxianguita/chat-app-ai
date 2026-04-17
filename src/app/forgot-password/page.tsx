"use client";

import { useState } from "react";
import { auth } from "@/app/lib/firebase"; 
import { sendPasswordResetEmail } from "firebase/auth";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: string; text: string }>({
    type: "",
    text: "",
  });
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: "error", text: "Please enter your email" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({
        type: "success",
        text: "Check your inbox to reset your password.",
      });
    } catch {
      setMessage({
        type: "error",
        text: "We couldn't find an account with that email.",
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
          <h1 className="text-2xl font-bold text-gray-900">
            Forgot your password?
          </h1>
          <p className="text-gray-500 mt-2">
            Enter your email and we’ll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="email@example.com"
            className="w-full border px-4 py-3 rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Send instructions"
            )}
          </button>
        </form>

        {message.text && (
          <div className="mt-4 text-center text-sm">
            {message.text}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 mx-auto text-sm text-gray-600 hover:text-black"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

      </div>
    </div>
  );
}