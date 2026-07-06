"use client";

import { useEffect, useState, useRef } from "react";
import { db, auth } from "@/app/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { 
  Search, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile, 
  CheckCheck,
  Trash,
  LogOut,
  Loader2,
  X,
  User,
  Bot
} from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/app/lib/store/useChatStore";
import { where } from "firebase/firestore";

export default function ChatPage() {
  const { messages, setMessages, setUser } = useChatStore();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); 
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 1. PROTEGER RUTA Y DETECTAR USUARIO
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, [router, setUser]);

  // 2. ESCUCHAR MENSAJES EN TIEMPO REAL
  useEffect(() => {
    let unsubscribeMessages: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const q = query(
        collection(db, "messages"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "asc")
      );

      if (unsubscribeMessages) unsubscribeMessages();

      unsubscribeMessages = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [setMessages]);

  // 3. AUTO-SCROLL
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 4. ENVIAR MENSAJE
  const sendMessage = async () => {
    if (!text.trim() || loading) return;

    const userText = text;
    setText("");
    setLoading(true);

    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("Usuario no autenticado");
      setLoading(false);
      return;
    }

    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.error("API URL not defined");
        return;
      }

      const token = await currentUser.getIdToken();

      await addDoc(collection(db, "messages"), {
        text: userText,
        user: currentUser.email,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat`,
        { message: userText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await addDoc(collection(db, "messages"), {
        text: res.data.reply || "No response from AI",
        user: "bot",
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error("🔥 Error enviando mensaje:", error?.response || error);

      await addDoc(collection(db, "messages"), {
        text: "Error al conectar con el servidor",
        user: "bot",
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } finally {
      setLoading(false);
    }
  };

  // 5. LOGICA DE BORRADO CON MODAL
  const handleClearChat = async () => {
    try {
      setLoading(true);
      setShowConfirm(false); 
      const snapshot = await getDocs(collection(db, "messages"));
      const deletes = snapshot.docs.map((d) => deleteDoc(doc(db, "messages", d.id)));
      await Promise.all(deletes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <div className="flex h-screen bg-[#09090B] overflow-hidden text-zinc-200 font-sans">
      
      {/* --- SIDEBAR IZQUIERDO --- */}
      <div className="hidden md:flex w-full max-w-[320px] border-r border-zinc-900 flex-col bg-[#0f0f13]">
        <div className="p-5 flex items-center justify-between">
          <h1 className="text-lg font-medium tracking-wider text-zinc-100">Nova AI</h1>
        </div>

        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-zinc-900/50 border border-zinc-800 py-1.5 pl-9 pr-4 rounded-xl text-xs outline-none text-zinc-300 focus:border-zinc-700 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {/* Item de Chat */}
          <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all hover:bg-zinc-900">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-500 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-blue-500/10">
              AI
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0f0f13] rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-medium text-sm text-zinc-200 truncate">Asistente Bot</h3>
                <span className="text-[10px] text-zinc-500 font-light">Activo</span>
              </div>
              <p className="text-xs truncate text-zinc-400 font-light mt-0.5">Conversación inteligente</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-zinc-900 flex items-center justify-between bg-zinc-950/40">
           <span className="text-xs text-zinc-500 truncate max-w-[150px] font-light">{auth.currentUser?.email}</span>
           <button onClick={handleLogout} className="p-2 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-xl transition-all">
              <LogOut size={15} />
           </button>
        </div>
      </div>

      {/* --- ÁREA DE CHAT --- */}
      <div className="flex-1 flex flex-col relative bg-[#09090B]">
        {/* Fondo sutil */}
        <div className="absolute inset-0 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

        {/* HEADER CHAT */}
        <div className="h-16 flex items-center justify-between px-6 bg-[#09090B]/80 backdrop-blur-md border-b border-zinc-900 z-30 relative">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center font-semibold text-xs text-white shadow-lg shadow-cyan-500/10">
              AI
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg blur-md"></div>
              
              <div className="relative">
                <h2 className="font-medium text-zinc-100 text-sm tracking-wide flex items-center gap-1.5">
                  Asistente Bot
                  <span className="text-[9px] font-bold bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20 uppercase tracking-wider">System</span>
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-light">Listo para ayudarte</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-full transition-colors ${showMenu ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-white"}`}
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-900 rounded-xl shadow-2xl z-50 py-1.5 text-xs animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  <button
                    onClick={() => { setShowMenu(false); setShowConfirm(true); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/5 transition-colors"
                  >
                    <Trash size={14} />
                    Limpiar historial
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
                  >
                    <LogOut size={14} />
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* MENSAJES CON ICONOS DE USUARIO Y ROBOT */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative z-10 custom-scrollbar">
          {messages.map((msg: any) => {
            const isUser = msg.user === auth.currentUser?.email;
            return (
              <div key={msg.id} className={`flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                
                {/* ICONO DEL ROBOT (Lado izquierdo si no es el usuario) */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 shrink-0 shadow-sm">
                    <Bot size={15} strokeWidth={2} />
                  </div>
                )}

                {/* BURBUJA DE MENSAJE */}
                <div className={`relative max-w-[85%] md:max-w-[65%] p-3.5 ${
                  isUser 
                    ? "bg-zinc-100 text-zinc-900 rounded-2xl rounded-tr-none shadow-md" 
                    : "bg-zinc-900/60 text-zinc-200 rounded-2xl rounded-tl-none border border-zinc-800/80"
                }`}>
                  <p className="text-sm leading-relaxed font-light">{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1.5 opacity-40 text-[9px] ${isUser ? "text-zinc-800" : "text-zinc-400"}`}>
                    <span>
                      {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                    </span>
                    {isUser && <CheckCheck size={12} />}
                  </div>
                </div>

                {/* ICONO DEL USUARIO (Lado derecho si es el usuario) */}
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0 shadow-sm">
                    <User size={15} strokeWidth={2} />
                  </div>
                )}

              </div>
            );
          })}

          {/* INDICADOR DE CARGA AJUSTADO CON ICONO */}
          {loading && (
            <div className="flex items-end gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 shrink-0">
                <Bot size={15} className="animate-pulse" />
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800/60 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2.5">
                <Loader2 size={13} className="animate-spin text-cyan-400" />
                <span className="text-xs text-zinc-400 font-light">Procesando respuesta...</span>
              </div>
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="p-4 bg-[#09090B]/80 backdrop-blur-md border-t border-zinc-900 z-10">
          <div className="max-w-3xl mx-auto flex items-center gap-2">
            <button className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
              <Paperclip size={18} />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Pregúntale algo a Nova AI..."
                className="w-full bg-zinc-900/40 border border-zinc-800 py-2.5 px-4 pr-10 rounded-xl focus:outline-none focus:border-zinc-700 transition-all text-xs text-zinc-200 placeholder-zinc-500"
              />
              <Smile size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors" />
            </div>
            <button 
              onClick={sendMessage}
              disabled={!text.trim() || loading}
              className={`p-2.5 rounded-xl transition-all ${
                text.trim() && !loading 
                  ? "bg-zinc-100 text-zinc-900 hover:bg-white scale-105" 
                  : "bg-zinc-900 text-zinc-600 cursor-not-allowed"
              }`}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowConfirm(false)}
          />

          <div className="relative w-full max-w-xs bg-zinc-950 rounded-2xl p-6 shadow-2xl border border-zinc-900 animate-in zoom-in-95 duration-200 text-center">
            <button 
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Trash className="w-5 h-5 text-rose-500" />
            </div>

            <h2 className="text-base font-medium text-zinc-100">¿Limpiar historial?</h2>
            <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
              Esta acción eliminará de forma permanente todos tus mensajes actuales en la base de datos.
            </p>

            <div className="mt-5 space-y-2">
              <button
                onClick={handleClearChat}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium py-2.5 rounded-xl transition-colors"
              >
                Confirmar eliminación
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-medium py-2.5 rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCROLLBAR PERSONALIZADA */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
}