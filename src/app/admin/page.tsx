"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Trophy, AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";

interface UserProgress {
  user_id: string;
  email?: string;
  completed_sessions: number[];
  updated_at: string;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [progressData, setProgressData] = useState<UserProgress[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user || user.email !== "nerideliezer@gmail.com") {
        router.push("/dashboard");
      } else {
        loadData();
      }
    }
  }, [user, loading, router]);

  const loadData = async () => {
    setFetching(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('user_progress')
        .select('*')
        .order('updated_at', { ascending: false });

      if (sbError) throw sbError;
      setProgressData(data || []);
    } catch (err: any) {
      setError(err.message || "Error al cargar datos");
    } finally {
      setFetching(false);
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--color-hornette-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Comprobar si falta la columna email
  const missingEmailColumn = progressData.length > 0 && !('email' in progressData[0]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden text-white">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-hornette-primary)]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <nav className="border-b border-white/10 glass-effect sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-[var(--color-hornette-muted)] hover:text-white transition-colors mr-6 bg-white/5 p-2 rounded-full hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 flex items-center gap-2">
              <Users className="w-6 h-6 text-[var(--color-hornette-primary)]" />
              Panel de Administración
            </div>
          </div>
          <button 
            onClick={loadData}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        {missingEmailColumn && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8 flex items-start gap-4"
          >
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
            <div>
              <h3 className="text-red-400 font-bold text-lg mb-2">Acción requerida en Supabase</h3>
              <p className="text-red-300/80 text-sm mb-4">
                Actualmente Supabase no está guardando los correos de los usuarios (columna <code className="bg-black/30 px-1 py-0.5 rounded text-white">email</code> no existe en la tabla <code className="bg-black/30 px-1 py-0.5 rounded text-white">user_progress</code>). Por lo tanto, sólo verás los IDs temporales.
              </p>
              <p className="text-white/80 text-sm bg-black/50 p-4 rounded-lg font-mono border border-white/10">
                Ve a tu proyecto en Supabase &gt; SQL Editor &gt; New Query y ejecuta esto:<br/>
                <span className="text-[var(--color-hornette-primary)]">ALTER TABLE user_progress ADD COLUMN email TEXT;</span>
              </p>
            </div>
          </motion.div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hornette-shadow">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
            <h2 className="text-xl font-bold">Progreso de Alumnos</h2>
            <span className="bg-[var(--color-hornette-primary)] text-black font-bold px-3 py-1 rounded-full text-sm">
              {progressData.length} inscritos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 font-semibold text-[var(--color-hornette-muted)] text-sm">Usuario / Correo</th>
                  <th className="p-4 font-semibold text-[var(--color-hornette-muted)] text-sm">Sesiones Completadas</th>
                  <th className="p-4 font-semibold text-[var(--color-hornette-muted)] text-sm">Progreso Global</th>
                  <th className="p-4 font-semibold text-[var(--color-hornette-muted)] text-sm">Última Actividad</th>
                </tr>
              </thead>
              <tbody>
                {progressData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      Aún no hay alumnos con progreso registrado.
                    </td>
                  </tr>
                ) : (
                  progressData.map((row, i) => {
                    const progressNum = Math.round((row.completed_sessions.length / 4) * 100);
                    return (
                      <motion.tr 
                        key={row.user_id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          {row.email ? (
                            <div className="font-medium text-white">{row.email}</div>
                          ) : (
                            <div className="font-mono text-xs text-gray-500 bg-black/40 px-2 py-1 rounded inline-block">
                              {row.user_id}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map(s => (
                              <div 
                                key={s} 
                                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                                  row.completed_sessions.includes(s) 
                                    ? "bg-[var(--color-hornette-primary)] text-black" 
                                    : "bg-white/10 text-white/30"
                                }`}
                              >
                                {s}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[var(--color-hornette-primary)] transition-all duration-1000"
                                style={{ width: `${progressNum}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold">{progressNum}%</span>
                            {progressNum === 100 && <Trophy className="w-4 h-4 text-[var(--color-hornette-primary)]" />}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-[var(--color-hornette-muted)]">
                          {new Date(row.updated_at).toLocaleDateString("es-MX", { 
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
