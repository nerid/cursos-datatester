"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, ArrowLeft, Download, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

const sessions = [
  { id: 1, title: "Introducción a la IA y Conceptos Básicos", duration: "45 min" },
  { id: 2, title: "Herramientas de IA Generativa", duration: "60 min" },
  { id: 3, title: "Prompt Engineering Efectivo", duration: "50 min" },
  { id: 4, title: "Casos de Uso en el Trabajo Diario", duration: "40 min" },
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
      const { data, error } = await supabase
        .from('user_progress')
        .select('completed_sessions')
        .eq('user_id', user.uid)
        .eq('course_id', params?.id)
        .single();
      
      if (data && !error) {
        setCompletedSessions(data.completed_sessions || []);
      }
    } catch (error) {
      console.error("Error fetching progress", error);
    } finally {
      setLoading(false);
    }
  };

  // El toggle manual fue deshabilitado para forzar que terminen la sesión con el test
  // const toggleSession = async (sessionId: number) => { ... }

  if (params?.id !== "ai-basico") {
    return <div className="p-12 text-center text-white">Curso no encontrado o próximamente.</div>;
  }

  const progressPercentage = (completedSessions.length / sessions.length) * 100;

  return (
    <div className="min-h-screen bg-[var(--color-hornette-bg)]">
      <nav className="border-b border-white/10 glass-effect sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
          <Link href="/dashboard" className="text-[var(--color-hornette-muted)] hover:text-white transition-colors mr-6">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="text-xl font-bold">AI Básico</div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-[var(--color-hornette-card)] rounded-2xl p-8 border border-white/10 hornette-shadow mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Fundamentos de Inteligencia Artificial</h1>
              <p className="text-[var(--color-hornette-muted)]">Domina las bases y comienza a usar la IA a tu favor.</p>
            </div>
            <div className="w-full md:w-48">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>Progreso</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[var(--color-hornette-primary)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {sessions.map((session, index) => {
              const isCompleted = completedSessions.includes(session.id);
              const isUnlocked = session.id === 1 || completedSessions.includes(session.id - 1);
              
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl border transition-all ${
                    isCompleted 
                      ? "bg-[var(--color-hornette-primary)]/10 border-[var(--color-hornette-primary)]/30" 
                      : !isUnlocked
                        ? "bg-black/40 border-white/5 opacity-50"
                        : "bg-white/5 border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="w-7 h-7 text-[var(--color-hornette-primary)] drop-shadow-[0_0_8px_rgba(255,204,0,0.5)]" />
                      ) : !isUnlocked ? (
                        <Lock className="w-7 h-7 text-[var(--color-hornette-muted)]" />
                      ) : (
                        <Circle className="w-7 h-7 text-[var(--color-hornette-muted)]" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg ${isCompleted ? "text-white" : "text-gray-200"}`}>
                        Sesión {session.id}: {session.title}
                      </h3>
                      <p className="text-sm text-[var(--color-hornette-muted)] mt-1">{session.duration}</p>
                    </div>
                  </div>
                  {isUnlocked ? (
                    <Link href={`/cursos/${params?.id}/${session.id}`}>
                      <button className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white/10 hover:bg-[var(--color-hornette-primary)] hover:text-black text-white text-sm font-bold tracking-wider transition-all">
                        {isCompleted ? "REPASAR" : "COMENZAR"}
                      </button>
                    </Link>
                  ) : (
                    <button disabled className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white/5 text-[var(--color-hornette-muted)] text-sm font-bold tracking-wider cursor-not-allowed">
                      BLOQUEADO
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {completedSessions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[var(--color-hornette-card)] to-[#1f1f1f] rounded-2xl p-8 border border-white/10 hornette-shadow"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-[var(--color-hornette-primary)]" />
              Materiales Extra Desbloqueados
            </h2>
            <p className="text-[var(--color-hornette-muted)] mb-6 text-sm">
              Por haber avanzado en tu curso, has desbloqueado los siguientes recursos exclusivos.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
                <span className="text-sm font-medium">Guía de Prompts.pdf</span>
                <Download className="w-4 h-4 text-[var(--color-hornette-muted)]" />
              </div>
              {completedSessions.length >= 4 && (
                <div className="p-4 rounded-lg bg-[var(--color-hornette-primary)]/10 border border-[var(--color-hornette-primary)]/30 flex items-center justify-between hover:bg-[var(--color-hornette-primary)]/20 transition-colors cursor-pointer text-[var(--color-hornette-primary)]">
                  <span className="text-sm font-medium text-white">Certificado Básico.pdf</span>
                  <Download className="w-4 h-4" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
