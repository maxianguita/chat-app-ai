"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (["/", "/login", "/register"].includes(pathname)) {
    return null;
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#09090B]/60 backdrop-blur-md border-b border-zinc-900">
      
      {/* LOGO */}
      <Link href="/chat" className="opacity-80 transition-opacity hover:opacity-100">
        <Image
          src="/img/logo.png"
          alt="Nova AI"
          width={24} // Un tamaño más contenido y sutil suele verse más minimalista
          height={24}
          className="grayscale brightness-125" // Opcional: hace que el logo se adapte al look monocromático si tiene colores llamativos
        />
      </Link>

      {/* DERECHA */}
      <div className="flex items-center gap-6">
        {user && (
          <>
            {/* PERFIL */}
            <div className="hidden md:flex items-center gap-3">
              {/* Avatar minimalista plano, sin gradientes ruidosos */}
              <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 text-xs font-medium">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              
              <span className="text-xs text-zinc-400 font-light tracking-wide">
                {user.email?.split("@")[0]}
              </span>
            </div>

            {/* BOTÓN CERRAR SESIÓN */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-200"
            >
              <LogOut size={13} strokeWidth={1.5} />
              <span>Salir</span>
            </button>
          </>
        )}
      </div>

    </nav>
  );
}