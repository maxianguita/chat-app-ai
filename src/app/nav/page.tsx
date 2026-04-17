"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  if (["/", "/login", "/register"].includes(pathname)) return null;

  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-black  border-b shadow-sm">

      <Link href="/" className="font-semibold text-sm text-white">
        Chat App
      </Link>

      {/* ACTIONS */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link
              href="/login"
              className="text-sm text-white hover:text-black transition"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <>
           <div className="hidden sm:flex items-center gap-3 text-sm">
           <span className="text-red-400/80 gap-1" >Bienvenido</span>
           <span className="font-semibold text-white">
            {user.email?.split("@")[0]}
            </span>
           </div>
            <button
              onClick={handleLogout}
              className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>

    </nav>
  );
}