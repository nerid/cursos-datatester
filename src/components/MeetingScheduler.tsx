"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Check, X, CalendarCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Appointment {
  date: string;
  time_slot: string;
}

interface MeetingSchedulerProps {
  user: any;
  onClose: () => void;
}

export default function MeetingScheduler({ user, onClose }: MeetingSchedulerProps) {
  const [step, setStep] = useState<"ask" | "schedule" | "confirm">("ask");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [existingAppointments, setExistingAppointments] = useState<Appointment[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dates = ["2026-05-19", "2026-05-20", "2026-05-21", "2026-05-22"];
  const slots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "06:00 PM - 07:00 PM",
    "07:00 PM - 08:00 PM"
  ];

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('date, time_slot');
      if (data) setExistingAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const isSlotBlocked = (date: string, slot: string) => {
    return existingAppointments.some(a => a.date === date && a.time_slot === slot);
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedSlot || !user) return;
    
    setIsSaving(true);
    setError(null);

    try {
      // Re-verify if slot is still available
      const { data: checkData } = await supabase
        .from('appointments')
        .select('*')
        .eq('date', selectedDate)
        .eq('time_slot', selectedSlot);
      
      if (checkData && checkData.length > 0) {
        setError("Este horario acaba de ser reservado. Por favor elige otro.");
        fetchAppointments();
        setIsSaving(false);
        return;
      }

      const { error: saveError } = await supabase
        .from('appointments')
        .insert({
          user_id: user.uid,
          user_email: user.email,
          date: selectedDate,
          time_slot: selectedSlot,
          created_at: new Date().toISOString()
        });

      if (saveError) throw saveError;
      
      setStep("confirm");
    } catch (err: any) {
      console.error("Error saving appointment:", err);
      setError("No se pudo agendar automáticamente por seguridad de la red. Por favor, envía un correo a zyanya.solorzano@gmail.com indicando el horario que elegiste para apartarlo manualmente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-xl bg-[var(--color-hornette-bg)] border border-white/10 rounded-3xl overflow-hidden hornette-shadow"
      >
        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === "ask" && (
              <motion.div 
                key="ask"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-[var(--color-hornette-primary)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CalendarCheck className="w-10 h-10 text-[var(--color-hornette-primary)]" />
                </div>
                <h2 className="text-3xl font-bold mb-4">¡Felicidades por terminar!</h2>
                <p className="text-[var(--color-hornette-muted)] mb-8 leading-relaxed">
                  Me gustaría tener una sesión 1:1 contigo de una hora por Google Meet para profundizar, resolver dudas o apoyarte con un proyecto incipiente. ¿Te gustaría agendarla?
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => setStep("schedule")}
                    className="flex-1 py-4 bg-[var(--color-hornette-primary)] text-black font-bold rounded-xl hover:bg-[var(--color-hornette-primary-hover)] transition-colors shadow-[0_0_20px_rgba(255,204,0,0.3)]"
                  >
                    Sí, agendar sesión
                  </button>
                  <button 
                    onClick={onClose}
                    className="flex-1 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                  >
                    No, estoy bien
                  </button>
                </div>
              </motion.div>
            )}

            {step === "schedule" && (
              <motion.div 
                key="schedule"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Elige tu horario</h2>
                  <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-bold text-[var(--color-hornette-muted)] uppercase tracking-widest mb-3 block">Fecha (Mayo)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {dates.map(date => {
                        const day = date.split('-')[2];
                        return (
                          <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`p-3 rounded-xl border transition-all ${
                              selectedDate === date 
                                ? "bg-[var(--color-hornette-primary)] text-black border-[var(--color-hornette-primary)]" 
                                : "bg-white/5 border-white/10 hover:border-white/30 text-white"
                            }`}
                          >
                            <span className="text-lg font-bold">{day}</span>
                            <span className="block text-xs opacity-70">Mayo</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[var(--color-hornette-muted)] uppercase tracking-widest mb-3 block">Horario disponible</label>
                    <div className="space-y-3">
                      {slots.map(slot => {
                        const blocked = selectedDate ? isSlotBlocked(selectedDate, slot) : false;
                        return (
                          <button
                            key={slot}
                            disabled={!selectedDate || blocked}
                            onClick={() => setSelectedSlot(slot)}
                            className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                              selectedSlot === slot 
                                ? "bg-[var(--color-hornette-primary)] text-black border-[var(--color-hornette-primary)] shadow-[0_0_15px_rgba(255,204,0,0.3)]" 
                                : blocked
                                  ? "bg-red-500/10 border-red-500/20 text-red-400 opacity-50 cursor-not-allowed"
                                  : !selectedDate
                                    ? "bg-white/5 border-white/5 text-white/30 cursor-not-allowed"
                                    : "bg-white/5 border-white/10 hover:border-white/30 text-white"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5" />
                              <span className="font-bold">{slot}</span>
                            </div>
                            {blocked && <span className="text-xs font-bold uppercase">Ocupado</span>}
                            {selectedSlot === slot && <Check className="w-5 h-5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
                      {error}
                    </div>
                  )}

                  <button
                    disabled={!selectedDate || !selectedSlot || isSaving}
                    onClick={handleSchedule}
                    className="w-full py-4 bg-[var(--color-hornette-primary)] text-black font-bold rounded-xl hover:bg-[var(--color-hornette-primary-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Agendando..." : "Confirmar reservación"}
                  </button>
                </div>
              </motion.div>
            )}

            {step === "confirm" && (
              <motion.div 
                key="confirm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold mb-4">¡Agendado con éxito!</h2>
                <p className="text-[var(--color-hornette-muted)] mb-8">
                  Tu sesión ha quedado reservada para el <strong>{selectedDate?.split('-')[2]} de mayo</strong> a las <strong>{selectedSlot}</strong>. Te enviaré el enlace de Meet por correo.
                </p>
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors border border-white/10"
                >
                  Entendido, volver al inicio
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
