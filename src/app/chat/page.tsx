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
  Menu,
  CheckCheck,
  Trash,
  LogOut,
  Loader2,
  X
} from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/app/lib/store/useChatStore";

export default function ChatPage() {
  const { messages, setMessages, setUser } = useChatStore();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); 
  const scrollRef = useRef(null);
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
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
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

  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("User not authenticated");
      return;
    }

    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("API URL not defined");
      return;
    }

    const token = await currentUser.getIdToken();

    // Guardar mensaje del usuario
    await addDoc(collection(db, "messages"), {
      text: userText,
      user: currentUser.email,
      createdAt: serverTimestamp(),
    });

    // Llamar backend
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/chat`,
      { message: userText },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Guardar respuesta del bot
    await addDoc(collection(db, "messages"), {
      text: res.data.reply || "No response from AI",
      user: "bot",
      createdAt: serverTimestamp(),
    });

  } catch (error: any) {
    console.error("🔥 Error enviando mensaje:", error?.response || error);

    // Mensaje fallback UX
    await addDoc(collection(db, "messages"), {
      text: "Error al conectar con el servidor 🤖",
      user: "bot",
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
    <div className="flex h-screen bg-gray-700 overflow-hidden text-slate-200 font-sans">
      
      {/* --- SIDEBAR IZQUIERDO --- */}
      <div className="hidden md:flex w-full max-w-[320px] border-r border-slate-800 flex-col bg-[#1e293b]/50 backdrop-blur-xl">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
        
            <h1 className="text-xl font-black tracking-tighter italic">CHAT APP</h1>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-slate-900/50 border border-slate-700 py-2 pl-10 pr-4 rounded-xl text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="bg-sky-600 flex items-center gap-3 px-4 py-3 cursor-pointer">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold">AI</div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold truncate text-white">Asistente Bot</h3>
                <span className="text-[10px] opacity-70 text-white">En línea</span>
              </div>
              <p className="text-sm truncate opacity-90 text-sky-100">Conversación activa</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/30">
           <span className="text-xs text-slate-500 truncate max-w-[150px]">{auth.currentUser?.email}</span>
           <button onClick={handleLogout} className="p-2 hover:bg-rose-500/10 text-rose-400 rounded-lg transition-all">
              <LogOut size={18} />
           </button>
        </div>
      </div>

      {/* --- ÁREA DE CHAT --- */}
      <div className="flex-1 flex flex-col relative bg-[#0f172a]">
        <div className="absolute inset-0 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] opacity-[0.03] pointer-events-none"></div>

        {/* Header Chat */}
        <div className="h-16 flex items-center justify-between px-6 bg-[#1e293b]/90 backdrop-blur-md border-b border-slate-800 z-30 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-sky-400 to-blue-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">
              AI
            </div>
            <div>
              <h2 className="font-bold text-white leading-none text-sm md:text-base">Asistente Bot</h2>
              <span className="text-xs text-sky-400">en línea</span>
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className={`p-2 rounded-full transition-colors ${showMenu ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
            >
              <MoreVertical size={20} />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  <button
                    onClick={() => { setShowMenu(false); setShowConfirm(true); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash size={16} />
                    Limpiar historial
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mensajes */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 relative z-10 custom-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.user === auth.currentUser?.email;
            return (
              <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`relative max-w-[85%] md:max-w-[70%] p-3 shadow-xl ${
                  isUser 
                    ? "bg-sky-600 text-white rounded-2xl rounded-tr-none" 
                    : "bg-slate-800 text-slate-100 rounded-2xl rounded-tl-none border border-slate-700"
                }`}>
                  <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 opacity-60">
                    <span className="text-[10px]">
                      {msg.createdAt?.toDate ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                    </span>
                    {isUser && <CheckCheck size={14} />}
                  </div>
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700">
                <Loader2 size={18} className="animate-spin text-sky-400" />
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 bg-[#1e293b]/90 backdrop-blur-md border-t border-slate-800 z-10">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-sky-400 transition-colors">
              <Paperclip size={22} />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Escribe un mensaje..."
                className="w-full bg-slate-900 border border-slate-700 py-3 px-4 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-all text-sm text-white"
              />
              <Smile size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer" />
            </div>
            <button 
              onClick={sendMessage}
              disabled={!text.trim() || loading}
              className={`p-3 rounded-xl transition-all ${
                text.trim() && !loading ? "bg-sky-500 text-white scale-105 shadow-lg shadow-sky-500/20" : "bg-slate-700 text-slate-500"
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setShowConfirm(false)}
          />

          <div className="relative w-full max-w-sm bg-[#1e293b] rounded-[2.5rem] p-8 shadow-2xl border border-slate-700 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowConfirm(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Trash className="w-8 h-8 text-rose-500" />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-white">¿Limpiar chat?</h2>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                Esto eliminará todos los mensajes para siempre. Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleClearChat}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-600/20 active:scale-[0.98] transition-all"
              >
                Eliminar todo
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl active:scale-[0.98] transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #255dacff; border-radius: 10px; }
      `}</style>
    </div>
  );
}