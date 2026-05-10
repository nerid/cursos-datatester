"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, ArrowLeft, Download, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

const sessions = [
  { id: 1, title: "Introducción a la IA y Conceptos Básicos", duration: "45 min", badge: "Pionero", emoji: "🌱" },
  { id: 2, title: "Herramientas de IA Generativa", duration: "60 min", badge: "Explorador", emoji: "🧭" },
  { id: 3, title: "Prompt Engineering Efectivo", duration: "50 min", badge: "Arquitecto", emoji: "🏗️" },
  { id: 4, title: "Casos de Uso en el Trabajo Diario", duration: "40 min", badge: "Maestro", emoji: "👑" },
];

export default function CoursePage() {
  const params = useParams();
  const { user } = useAuth();
  const [completedSessions, setCompletedSessions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && params?.id === "ai-basico") {
      fetchProgress();
    }
  }, [user, params]);

  const fetchProgress = async () => {
    if (!user) return;
    try {
      const lsKey = `progress_${user.uid}_${params?.id}`;
      const lsData = localStorage.getItem(lsKey);
      let localSessions: number[] = lsData ? JSON.parse(lsData) : [];

      const { data, error } = await supabase
        .from('user_progress')
        .select('completed_sessions')
        .eq('user_id', user.uid)
        .eq('course_id', params?.id)
        .maybeSingle();
      
      if (data && !error && data.completed_sessions) {
        const merged = Array.from(new Set([...data.completed_sessions, ...localSessions]));
        setCompletedSessions(merged);
        if (merged.length > data.completed_sessions.length) {
          const payload: any = { user_id: user.uid, course_id: params?.id, completed_sessions: merged, email: user.email };
          const { error: upsertError } = await supabase.from('user_progress').upsert(payload);
          if (upsertError && upsertError.code === 'PGRST204') {
            delete payload.email;
            await supabase.from('user_progress').upsert(payload);
          }
        }
      } else {
        setCompletedSessions(localSessions);
        if (localSessions.length > 0) {
          const payload: any = { user_id: user.uid, course_id: params?.id, completed_sessions: localSessions, email: user.email };
          const { error: upsertError } = await supabase.from('user_progress').upsert(payload);
          if (upsertError && upsertError.code === 'PGRST204') {
            delete payload.email;
            await supabase.from('user_progress').upsert(payload);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching progress", error);
      const lsKey = `progress_${user.uid}_${params?.id}`;
      const lsData = localStorage.getItem(lsKey);
      if (lsData) setCompletedSessions(JSON.parse(lsData));
    } finally {
      setLoading(false);
    }
  };

  if (params?.id !== "ai-basico") {
    return <div className="p-12 text-center text-white">Curso no encontrado o próximamente.</div>;
  }

  const progressPercentage = (completedSessions.length / sessions.length) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Premium Hero Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/images/ai_session_hero.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]" />
      </div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-hornette-primary)]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <nav className="border-b border-white/10 glass-effect sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
          <Link href="/dashboard" className="text-[var(--color-hornette-muted)] hover:text-white transition-colors mr-6 bg-white/5 p-2 rounded-full hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Módulo: AI Básico
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] mb-10 relative overflow-hidden"
        >
          {/* Subtle gradient border top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-hornette-primary)] via-orange-400 to-pink-500 opacity-80" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-[var(--color-hornette-primary)]/10 border border-[var(--color-hornette-primary)]/20 rounded-full text-[var(--color-hornette-primary)] text-xs font-bold tracking-widest mb-4">
                CURSO EN CURSO
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-lg">
                Fundamentos de inteligencia artificial
              </h1>
              <p className="text-lg text-[var(--color-hornette-muted)] max-w-xl leading-relaxed">
                Domina las bases y comienza a usar la IA como una extensión de tu propia inteligencia.
              </p>
            </div>
            
            {/* Progress Circle & Bar */}
            <div className="w-full md:w-64 bg-white/5 p-5 rounded-2xl border border-white/10">
              <div className="flex justify-between text-sm mb-3 font-semibold text-white">
                <span>Tu progreso</span>
                <span className="text-[var(--color-hornette-primary)]">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--color-hornette-primary)] to-yellow-300 shadow-[0_0_15px_rgba(255,204,0,0.6)] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-xs text-[var(--color-hornette-muted)] mt-3 text-center">
                {completedSessions.length} de {sessions.length} sesiones completadas
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {sessions.map((session, index) => {
              const isCompleted = completedSessions.includes(session.id);
              const isUnlocked = session.id === 1 || completedSessions.includes(session.id - 1);
              
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                  className={`relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl border transition-all duration-300 group ${
                    isCompleted 
                      ? "bg-gradient-to-r from-[var(--color-hornette-primary)]/10 to-transparent border-[var(--color-hornette-primary)]/30 hover:border-[var(--color-hornette-primary)]/50" 
                      : !isUnlocked
                        ? "bg-black/60 border-white/5 opacity-50"
                        : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-5 mb-4 sm:mb-0 relative z-10">
                    <div className="flex-shrink-0 relative">
                      {isCompleted ? (
                        <div className="bg-[var(--color-hornette-primary)]/20 p-3 rounded-full flex items-center justify-center w-14 h-14">
                          <span className="text-2xl drop-shadow-[0_0_10px_rgba(255,204,0,0.8)]">{session.emoji}</span>
                        </div>
                      ) : !isUnlocked ? (
                        <div className="bg-white/5 p-3 rounded-full flex items-center justify-center w-14 h-14">
                          <Lock className="w-8 h-8 text-[var(--color-hornette-muted)]" />
                        </div>
                      ) : (
                        <div className="bg-white/10 p-3 rounded-full group-hover:bg-white/20 transition-colors flex items-center justify-center w-14 h-14">
                          <Circle className="w-8 h-8 text-white/50" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? "text-[var(--color-hornette-primary)]" : "text-gray-400"}`}>
                          Sesión {session.id}
                        </span>

                        {isCompleted && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md border border-[var(--color-hornette-primary)] text-[var(--color-hornette-primary)]">
                            {session.badge}
                          </span>
                        )}
                      </div>
                      <h3 className={`font-bold text-xl mt-1 ${isCompleted ? "text-white" : !isUnlocked ? "text-gray-500" : "text-gray-100"}`}>
                        {session.title}
                      </h3>
                    </div>
                  </div>

                  <div className="relative z-10 w-full sm:w-auto">
                    {isUnlocked ? (
                      <Link href={`/cursos/${params?.id}/${session.id}`}>
                        <button className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold tracking-widest transition-all duration-300 transform group-hover:scale-105 ${
                          isCompleted 
                            ? "bg-transparent border border-[var(--color-hornette-primary)] text-[var(--color-hornette-primary)] hover:bg-[var(--color-hornette-primary)] hover:text-black hover:shadow-[0_0_20px_rgba(255,204,0,0.4)]"
                            : "bg-white text-black hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        }`}>
                          {isCompleted ? "REPASAR" : "COMENZAR"}
                        </button>
                      </Link>
                    ) : (
                      <button disabled className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white/5 text-[var(--color-hornette-muted)] text-sm font-bold tracking-widest cursor-not-allowed border border-white/5">
                        BLOQUEADO
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>


      </main>
    </div>
  );
}
