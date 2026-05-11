"use client";

import { motion } from "framer-motion";
import { BookOpen, Lock, PlayCircle, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const courses = [
    {
      id: "ai-basico",
      title: "AI básico",
      description: "Elementos básicos y prácticos de la inteligencia artificial.",
      status: "active",
      icon: <BookOpen className="w-8 h-8 text-black" />,
      sessions: 4
    },
    {
      id: "ai-intermedio",
      title: "AI intermedio",
      description: "Modelos de lenguaje, automatización avanzada y fine-tuning.",
      status: "upcoming",
      icon: <Lock className="w-8 h-8 text-[var(--color-hornette-muted)]" />,
      sessions: 0
    },
    {
      id: "ai-avanzado",
      title: "AI avanzado",
      description: "Creación de agentes autónomos y arquitecturas complejas.",
      status: "upcoming",
      icon: <Lock className="w-8 h-8 text-[var(--color-hornette-muted)]" />,
      sessions: 0
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-hornette-bg)]">
      <nav className="border-b border-white/10 glass-effect sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-extrabold tracking-tight">
            DATA<span className="text-[var(--color-hornette-primary)]">TESTER</span>
          </div>
          <div className="flex items-center gap-6">
            {user?.email === "nerideliezer@gmail.com" && (
              <Link 
                href="/admin"
                className="flex items-center gap-2 text-sm font-bold text-[var(--color-hornette-primary)] hover:text-white transition-colors bg-[var(--color-hornette-primary)]/10 px-4 py-2 rounded-lg"
              >
                Panel de administración
              </Link>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-[var(--color-hornette-muted)] hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Mis highlights</h1>
          <p className="text-[var(--color-hornette-muted)] text-lg">
            Repasa los puntos clave y el material de apoyo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-6 border ${
                course.status === "active" 
                  ? "bg-[var(--color-hornette-card)] border-white/10 hornette-shadow hover:border-[var(--color-hornette-primary)] transition-colors" 
                  : "bg-white/5 border-white/5 opacity-70"
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  course.status === "active" ? "bg-[var(--color-hornette-primary)]" : "bg-white/10"
                }`}>
                  {course.icon}
                </div>
                
                {/* Tech Pattern Animation */}
                <div className="flex-1 h-14 rounded-xl bg-white/5 border border-white/5 overflow-hidden relative">
                  {course.status === "active" ? (
                    <>
                      <motion.div 
                        animate={{ 
                          x: ["-100%", "200%"] 
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 2.5,
                          ease: "linear"
                        }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[var(--color-hornette-primary)]/20 to-transparent skew-x-12"
                      />
                      <div className="absolute inset-0 flex items-center justify-around opacity-40">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div 
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                            className="w-1.5 h-1.5 rounded-full bg-[var(--color-hornette-primary)]" 
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-around opacity-10">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
              <p className="text-[var(--color-hornette-muted)] text-sm mb-8 min-h-[40px]">
                {course.description}
              </p>
              
              {course.status === "active" ? (
                <Link 
                  href={`/cursos/${course.id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-[var(--color-hornette-primary)] hover:text-black transition-colors"
                >
                  <PlayCircle className="w-5 h-5" />
                  Ver contenido
                </Link>
              ) : (
                <button 
                  disabled
                  className="w-full py-3 rounded-lg bg-white/5 text-[var(--color-hornette-muted)] font-medium uppercase tracking-wider text-sm cursor-not-allowed"
                >
                  Próximamente
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
