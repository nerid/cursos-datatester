"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { FolderOpen, X, FileText, Download, ExternalLink, HardDrive, Chrome } from "lucide-react";

export default function ResourcesDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const sessionId = parseInt(params?.sessionId as string) || 1;

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-[var(--color-hornette-primary)] text-black p-4 rounded-l-2xl shadow-[-5px_0_20px_rgba(255,204,0,0.3)] hover:shadow-[-5px_0_30px_rgba(255,204,0,0.5)] z-40 flex flex-col items-center gap-2 hover:bg-[var(--color-hornette-primary-hover)] transition-all group"
      >
        <FolderOpen className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-bold uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          Recursos Extra
        </span>
      </motion.button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            {/* Drawer Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-[#121212] border-l border-white/10 shadow-[-10px_0_40px_rgba(0,0,0,0.5)] z-50 flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-6 h-6 text-[var(--color-hornette-primary)]" />
                  <h2 className="text-xl font-bold">Kit de Recursos</h2>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-[var(--color-hornette-muted)] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* Notion Prompts */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-hornette-muted)] mb-3">Casos de Uso</h3>
                  <a 
                    href="https://www.notion.so/nerids/Casos-curso-2-358c1e4d80ee80f18ec6dde45adb5d58?source=copy_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[var(--color-hornette-primary)]/50 transition-all group"
                  >
                    <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                        Prompts Avanzados <ExternalLink className="w-3 h-3 text-[var(--color-hornette-muted)]" />
                      </h4>
                      <p className="text-sm text-[var(--color-hornette-muted)]">Diferentes casos de uso reales en Notion para aplicar lo aprendido.</p>
                    </div>
                  </a>
                </div>

                {/* Google Drive */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-hornette-muted)] mb-3">Archivos del Curso</h3>
                  <a 
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[var(--color-hornette-primary)]/50 transition-all group"
                  >
                    <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                      <HardDrive className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                        Carpeta de Google Drive <ExternalLink className="w-3 h-3 text-[var(--color-hornette-muted)]" />
                      </h4>
                      <p className="text-sm text-[var(--color-hornette-muted)]">Materiales, presentaciones y plantillas oficiales.</p>
                    </div>
                  </a>
                </div>

                {/* Software */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-hornette-muted)] mb-3">Software Recomendado</h3>
                  <a 
                    href="https://file-converter.io/download.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl border border-[var(--color-hornette-primary)]/20 bg-[var(--color-hornette-primary)]/5 hover:bg-[var(--color-hornette-primary)]/10 transition-all group"
                  >
                    <div className="p-2 bg-[var(--color-hornette-primary)]/10 rounded-lg group-hover:bg-[var(--color-hornette-primary)]/20 transition-colors">
                      <Download className="w-6 h-6 text-[var(--color-hornette-primary)]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--color-hornette-primary)] mb-1 flex items-center gap-2">
                        File Converter <ExternalLink className="w-3 h-3 opacity-70" />
                      </h4>
                      <p className="text-sm text-[var(--color-hornette-muted)]">Extensión segura para Windows. Cambia formatos con clic derecho.</p>
                    </div>
                  </a>
                </div>

                {/* Session 2 Resources */}
                {sessionId >= 2 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-hornette-muted)] mb-3">Recursos Sesión 2</h3>
                    <a 
                      href="https://chromewebstore.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all group"
                    >
                      <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                        <Chrome className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-red-400 mb-1 flex items-center gap-2">
                          Extensión de YouTube <ExternalLink className="w-3 h-3 opacity-70" />
                        </h4>
                        <p className="text-sm text-[var(--color-hornette-muted)]">Extensión de Chrome para importar videos largos directamente a tu cuaderno.</p>
                      </div>
                    </a>
                  </div>
                )}

              </div>
              
              <div className="p-6 border-t border-white/10 bg-black/20">
                <p className="text-xs text-center text-[var(--color-hornette-muted)]">
                  Estos recursos se actualizarán conforme avances en las sesiones.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
