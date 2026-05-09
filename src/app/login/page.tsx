"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ALLOWED_EMAILS = [
    "succy1971@gmail.com",
    "elizagovarjal@gmail.com",
    "alonbarba1@gmail.com",
    "pablo.quinn.cervantes@gmail.com",
    "imss2316@gmail.com",
    "jmiguel3184@gmail.com",
    "fcampos@esarq.edu.mx",
    "nerideliezer@gmail.com", // Añadido para que tú también puedas entrar como admin/pruebas
    "giulia@demo.com" // Usuario demo solicitado
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!ALLOWED_EMAILS.includes(email.trim().toLowerCase())) {
      setError("Acceso denegado. Tu correo no está autorizado.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user.email && !ALLOWED_EMAILS.includes(result.user.email)) {
        await auth.signOut();
        setError("Acceso denegado. Tu correo no está autorizado para acceder a estos cursos.");
      }
    } catch (err: any) {
      setError("Error al iniciar sesión con Google. Asegúrate de tener la Autenticación habilitada en Firebase.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-hornette-bg)] relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-hornette-primary)] opacity-[0.03] blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-hornette-primary)] opacity-[0.03] blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-2xl glass-effect hornette-shadow z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            DATA<span className="text-[var(--color-hornette-primary)]">TESTER</span>
          </h1>
          <p className="text-[var(--color-hornette-muted)] text-sm tracking-widest uppercase">
            Plataforma de Cursos
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <p className="text-center text-[var(--color-hornette-muted)] text-sm mb-4">
            Acceso restringido solo para alumnos inscritos.
          </p>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-hornette-muted)] mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--color-hornette-bg)] border border-white/10 text-white focus:outline-none focus:border-[var(--color-hornette-primary)] transition-colors"
              placeholder="tu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-hornette-muted)] mb-2">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--color-hornette-bg)] border border-white/10 text-white focus:outline-none focus:border-[var(--color-hornette-primary)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[var(--color-hornette-primary)] text-black font-bold tracking-wide hover:bg-[var(--color-hornette-primary-hover)] transition-colors mt-2"
          >
            INICIAR SESIÓN
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="w-1/5 border-b border-white/10"></span>
          <span className="text-xs text-[var(--color-hornette-muted)] uppercase tracking-wider">O ingresa con</span>
          <span className="w-1/5 border-b border-white/10"></span>
        </div>

        <div className="space-y-4 mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,204,0,0.05)]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 bg-white rounded-full p-0.5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            GOOGLE
          </button>
        </div>
      </motion.div>
    </div>
  );
}
