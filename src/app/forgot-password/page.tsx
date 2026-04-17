// "use client";

// import { useState } from "react";
// import { auth } from "../lib/firebase";
// import { sendPasswordResetEmail } from "firebase/auth";
// import { Mail, ArrowLeft, Loader2 } from "lucide-react"; 

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [loading, setLoading] = useState(false);

//   const handleReset = async (e) => {
//     e.preventDefault(); 
//     if (!email) {
//       setMessage({ type: "error", text: "Por favor, ingresá tu email" });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: "", text: "" });

//     try {
//       await sendPasswordResetEmail(auth, email);
//       setMessage({ 
//         type: "success", 
//         text: "¡Listo! Revisá tu bandeja de entrada para restablecer tu clave." 
//       });
//     } catch (err) {
//       setMessage({ 
//         type: "error", 
//         text: "No pudimos encontrar una cuenta con ese correo." 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       {/* Contenedor Principal (Card) */}
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transition-all">
        
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="bg-black text-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//             <Mail size={24} />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">¿Olvidaste tu clave?</h1>
//           <p className="text-gray-500 mt-2">
//             No te preocupes, te enviaremos instrucciones para recuperarla.
//           </p>
//         </div>

//         {/* Formulario */}
//         <form onSubmit={handleReset} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Correo electrónico
//             </label>
//             <input
//               type="email"
//               placeholder="nombre@ejemplo.com"
//               className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={loading}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md active:scale-[0.98]"
//           >
//             {loading ? (
//               <Loader2 className="animate-spin" size={20} />
//             ) : (
//               "Enviar instrucciones"
//             )}
//           </button>
//         </form>

//         {/* Mensajes de Feedback */}
//         {message.text && (
//           <div className={`mt-6 p-4 rounded-lg text-sm text-center animate-in fade-in slide-in-from-top-1 ${
//             message.type === "success" 
//             ? "bg-green-50 text-green-700 border border-green-100" 
//             : "bg-red-50 text-red-700 border border-red-100"
//           }`}>
//             {message.text}
//           </div>
//         )}

//         {/* Footer */}
//         <div className="mt-8 text-center">
//           <button 
//             onClick={() => window.history.back()}
//             className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
//           >
//             <ArrowLeft size={16} />
//             Volver al inicio de sesión
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }