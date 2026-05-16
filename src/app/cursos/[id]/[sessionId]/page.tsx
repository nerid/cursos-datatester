"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, ArrowLeft, ArrowRight, ExternalLink, Lightbulb, PlayCircle, Star, PenTool, Image as ImageIcon, MessageSquare, Copy, Check, HardDrive, Bot, Zap, Globe, Terminal, Cpu } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Quiz from "@/components/Quiz";
import InfoTooltip from "@/components/InfoTooltip";
import MeetingScheduler from "@/components/MeetingScheduler";

function CopyableBlock({ content, label = "Prompt", type = "code" }: { content: string, label?: string, type?: "code" | "text" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40 mt-3">
      <div className="flex justify-between items-center px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-hornette-primary)]">{label}</span>
        <button 
          onClick={handleCopy}
          className="text-[var(--color-hornette-muted)] hover:text-white transition-colors flex items-center gap-2 text-xs"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        {type === "code" ? (
          <pre className="font-mono text-sm text-gray-200 whitespace-pre-wrap">{content}</pre>
        ) : (
          <p className="text-sm text-gray-200">{content}</p>
        )}
      </div>
    </div>
  );
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  
  const userName = user?.email === "zyanya.solorzano@gmail.com" 
    ? "Vjejoslavovna" 
    : user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || "Estudiante";
  const sessionId = parseInt(params?.sessionId as string) || 1;

  const markSessionCompleted = async () => {
    if (!user) return;
    setIsMarkingCompleted(true);
    
    try {
      // Fetch current progress locally first
      const lsKey = `progress_${user.uid}_${params?.id}`;
      const lsData = localStorage.getItem(lsKey);
      let localSessions: number[] = lsData ? JSON.parse(lsData) : [];
      
      // Fetch current progress from DB
      const { data: currentProgress } = await supabase
        .from('user_progress')
        .select('completed_sessions')
        .eq('user_id', user.uid)
        .eq('course_id', params?.id)
        .maybeSingle();
        
      let updatedSessions = Array.from(new Set([...(currentProgress?.completed_sessions || []), ...localSessions]));
      if (!updatedSessions.includes(sessionId)) {
        updatedSessions.push(sessionId);
      }

      // Save locally as fallback IMMEDIATELY
      localStorage.setItem(lsKey, JSON.stringify(updatedSessions));

      // Save to Supabase
      const payload: any = {
        user_id: user.uid,
        course_id: params?.id,
        completed_sessions: updatedSessions,
        email: user.email,
        updated_at: new Date().toISOString()
      };
      
      // Intentar guardar en Supabase
      console.log("Intentando guardar progreso en Supabase...", payload);
      const { error: upsertError } = await supabase
        .from('user_progress')
        .upsert(payload, { onConflict: 'user_id,course_id' });

      if (upsertError) {
        console.warn("Error en Supabase (reintentando sin email):", upsertError);
        const retryPayload = { ...payload };
        delete retryPayload.email;
        const { error: retryError } = await supabase
          .from('user_progress')
          .upsert(retryPayload, { onConflict: 'user_id,course_id' });
        
        if (retryError) {
          console.error("Error crítico al guardar progreso:", retryError);
        } else {
          console.log("Progreso guardado exitosamente (reintento)");
        }
      } else {
        console.log("Progreso guardado exitosamente en Supabase");
      }
      
      setCurrentStep(steps.length);
    } catch (error) {
      console.error("Error saving progress", error);
      // Ensure local fallback advances UI even if DB fails
      const lsKey = `progress_${user.uid}_${params?.id}`;
      const lsData = localStorage.getItem(lsKey);
      let localSessions: number[] = lsData ? JSON.parse(lsData) : [];
      if (!localSessions.includes(sessionId)) {
        localSessions.push(sessionId);
      }
      localStorage.setItem(lsKey, JSON.stringify(localSessions));
      setCurrentStep(steps.length);
    } finally {
      setIsMarkingCompleted(false);
    }
  };

  const getSessionSteps = (sid: number) => {
    if (sid === 1) {
      return [
        {
          title: `🎯 Objetivo principal, ${userName}`,
          icon: <Star className="w-6 h-6 text-yellow-400" />,
          content: (
            <div className="space-y-3 text-lg">
              <p>Aprender a comunicarnos con la IA, <strong>quitarnos los miedos</strong> a la herramienta y entender que la <strong>iteración</strong><InfoTooltip content="El proceso de repetir y mejorar un prompt basándose en la respuesta que la IA te acaba de dar." /> es la clave para no tener resultados genéricos o acartonados.</p>
            </div>
          )
        },
        {
          title: "🔗 Herramientas y enlaces clave",
          icon: <ExternalLink className="w-6 h-6 text-blue-400" />,
          content: (
            <div className="space-y-4">
              <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer" className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/50 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <img src="https://www.gstatic.com/lamda/images/favicon_v1_150160cddff7f294ce30.svg" alt="Gemini" className="w-8 h-8" />
                  <div>
                    <h4 className="font-bold text-white">Google Gemini</h4>
                    <p className="text-sm text-[var(--color-hornette-muted)]">Necesitarás iniciar sesión con tu cuenta de Google.</p>
                  </div>
                </div>
              </a>

              <a href="https://file-converter.io/download.html" target="_blank" rel="noopener noreferrer" className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-green-400/50 hover:bg-white/10 transition-all">
                 <div className="flex items-start gap-3">
                  <DownloadIcon className="w-8 h-8 text-green-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-white">Extensión File converter (solo Windows)</h4>
                    <p className="text-sm text-[var(--color-hornette-muted)] mt-1">
                      Esta herramienta nos servirá para cambiar formatos de audio, PDF o imagen con un solo clic derecho directamente desde tu explorador de archivos. 
                      <strong className="text-white block mt-2">🛡️ 100% Segura y sin virus. Es una herramienta de código abierto muy reconocida en la comunidad técnica.</strong>
                    </p>
                  </div>
                </div>
              </a>

              <a href="https://drive.google.com/drive/u/0/folders/1KOhtpHKRqXm2sw-8dviNFuRssVFYBm3J" target="_blank" rel="noopener noreferrer" className="block p-4 rounded-xl bg-[var(--color-hornette-primary)]/10 border border-[var(--color-hornette-primary)]/30 hover:bg-[var(--color-hornette-primary)]/20 transition-all">
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-8 h-8 text-[var(--color-hornette-primary)]" />
                  <div>
                    <h4 className="font-bold text-white">Carpeta de Google Drive con recursos</h4>
                    <p className="text-sm text-[var(--color-hornette-muted)]">Material extra y documentos para seguir la sesión.</p>
                  </div>
                </div>
              </a>
            </div>
          )
        },
        {
          title: "🧠 Conceptos rápidos antes de empezar",
          icon: <Lightbulb className="w-6 h-6 text-orange-400" />,
          content: (
            <ul className="space-y-4 text-base">
              <li className="flex gap-3">
                <span className="text-[var(--color-hornette-primary)] font-bold">1.</span>
                <p><strong>No todos los modelos son iguales:</strong> hoy usaremos Gemini porque se integra perfecto con nuestros documentos de trabajo diario (Workspace), pero existen otros como ChatGPT, Claude o Copilot.<InfoTooltip content="Cada IA (modelo) tiene sus propias fortalezas. Gemini destaca en ecosistemas de Google, Claude en escritura creativa, y GPT en razonamiento lógico complejo." /></p>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--color-hornette-primary)] font-bold">2.</span>
                <p><strong>El detector de IA:</strong> si quieres evitar que tus textos parezcan hechos por una máquina de un solo vistazo, pídele siempre a Gemini que utilice nuestro formato de títulos al estilo <em>"sentence case"</em> (tipo oración), propio del español.</p>
              </li>
            </ul>
          )
        },
        {
          title: "💻 Ejercicio 1: El correo diplomático",
          icon: <MessageSquare className="w-6 h-6 text-indigo-400" />,
          content: (
            <div className="space-y-5">
              <p>Copia el siguiente prompt haciendo clic en "Copiar" y pégalo en Gemini:</p>
              <CopyableBlock 
                label="Prompt inicial" 
                content='Actúa como un asistente administrativo. Redacta un correo para un cliente que ha solicitado un descuento que no podemos otorgar. Explica que nuestros precios reflejan calidad en Guadalajara, pero ofrece una facilidad de pago' 
              />
              <div className="space-y-3 mt-6">
                <p className="font-bold text-[var(--color-hornette-primary)]">¡Iteremos, {userName}!</p>
                <ul className="list-disc pl-5 space-y-2 text-[var(--color-hornette-muted)]">
                  <li>Edita la instrucción o dile en el chat que cambie el tono.</li>
                  <li>Pídele que lo reescriba como un <strong>"poeta maldito"</strong> o con un tono <strong>"cómico y sarcástico"</strong>.</li>
                  <li>Pídele que lo haga de forma sintética para que <strong>no exceda las 50 palabras</strong>.</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          title: "🎤 Ejercicio 2: El asistente de agenda (dictado por voz)",
          icon: <PlayCircle className="w-6 h-6 text-red-400" />,
          content: (
            <div className="space-y-4">
              <p className="text-lg">Activa el ícono del <strong>micrófono</strong> en la barra de chat de Gemini.</p>
              <div className="p-4 bg-white/5 rounded-xl border-l-4 border-red-500">
                <p className="italic text-[var(--color-hornette-muted)]">"Dicta una lista totalmente desordenada: menciona frutas (huevo, cebolla, chile), modelos de celulares y los días de la semana."</p>
              </div>
              <p className="text-white">Pide por voz que ordene los elementos alfabéticamente en una tabla y que le agregue precios estimados del mercado actual.</p>
            </div>
          )
        },
        {
          title: "💎 Ejercicio 3: Creación de tu asistente 'Lira'",
          icon: <PenTool className="w-6 h-6 text-teal-400" />,
          content: (
            <div className="space-y-4">
              <p>A veces no sabemos cómo pedir las cosas. Para eso crearemos a <strong>"Lira"</strong>, un asistente que mejorará nuestros prompts.</p>
              <ol className="list-decimal pl-5 space-y-3 text-[var(--color-hornette-muted)]">
                <li>En Gemini, ve al menú izquierdo, selecciona <strong>Gems</strong> y haz clic en <strong>Nueva Gem</strong>.</li>
                <li>Nómbrala <strong>"Lira"</strong> y en las instrucciones copia y pega lo siguiente:</li>
              </ol>
              <CopyableBlock 
                label="Instrucciones del gem" 
                content="Actúa como un especialista a nivel máster de optimización de prompts para inteligencia artificial. Tu misión va a ser transformar cualquier indicación o cualquier entrada que te dé un usuario a una precisión muchísimo más fina. Tu metodología tiene cuatro dimensiones: 1. Deconstruir la información (intenciones, entidades, contexto). 2. Diagnosticar. 3. Desarrollar las técnicas basadas en los requerimientos con un enfoque preciso y mostrando ejemplos. 4. Arrojar las respuestas en un formato base evaluando la complejidad, y haciendo preguntas de opción múltiple al usuario para clarificar lo que necesita antes de generar el prompt final. No guardes las sesiones en la memoria." 
              />
              <div className="p-4 bg-teal-500/10 rounded-xl border border-teal-500/20 mt-4">
                <p className="text-teal-300 font-medium flex items-center gap-2">Pon a prueba a Lira <InfoTooltip content="Lira es un 'Agente' personalizado. Un agente es una versión de la IA configurada con instrucciones previas para cumplir un rol específico." />:</p>
                <p className="text-sm mt-1">Dile <em>"Quiero una tabla de finanzas personales semanal"</em>. Lira te hará preguntas. ¡Responde con números y usa el prompt maestro que te devuelva!</p>
              </div>
            </div>
          )
        },
        {
          title: "🎨 Ejercicio 4: Creación visual con Nano Banana",
          icon: <ImageIcon className="w-6 h-6 text-pink-400" />,
          content: (
            <div className="space-y-5">
              <p>En un nuevo chat, copia y pide:</p>
              <CopyableBlock 
                label="Prompt base" 
                content="Crea la imagen de un sujeto vestido con un uniforme de fútbol" 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex flex-col">
                  <h4 className="text-pink-400 font-bold mb-2">Iteración 1</h4>
                  <div className="w-full aspect-[9/16] bg-black/50 rounded-lg overflow-hidden mb-3 relative max-h-[300px]">
                    <img src="/images/iteracion_1.png" alt="Iteración 1" className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                  </div>
                  <CopyableBlock 
                    label="Evolución 1" 
                    content="Ponle una peluca divertida y que la imagen sea en formato vertical (9:16)." 
                  />
                </div>
                
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex flex-col">
                  <h4 className="text-pink-400 font-bold mb-2">Iteración 2</h4>
                  <div className="w-full aspect-[9/16] bg-black/50 rounded-lg overflow-hidden mb-3 relative max-h-[300px]">
                    <img src="/images/iteracion_2.png" alt="Iteración 2" className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                  </div>
                  <CopyableBlock 
                    label="Evolución 2" 
                    content="Haz que el sujeto esté tirando un penalti y que el fondo sea un boceto al carbón con iluminación emotiva." 
                  />
                </div>
              </div>
              <div className="p-4 bg-pink-500/10 rounded-xl border border-pink-500/20 mt-4">
                <p className="text-pink-300 font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 shrink-0" />
                  Nota importante:
                </p>
                <p className="text-sm mt-1">Si la IA pone al jugador "flotando en el aire", corrige tu prompt siendo más específico: "que el balón toque el suelo". La IA aprende de tus correcciones.</p>
              </div>
            </div>
          )
        }
      ];
    } else if (sid === 3) {
      return [
        {
          title: `🎨 Objetivo principal, ${userName}`,
          icon: <Star className="w-6 h-6 text-yellow-400" />,
          content: (
            <div className="space-y-3 text-lg">
              <p>Aprender a usar la IA como una herramienta para <strong>extender la creatividad</strong> y la comunicación visual, dominando la anatomía del prompt visual y el uso de <strong>Gems especializados</strong>.</p>
            </div>
          )
        },
        {
          title: "🚀 Introducción a la generación visual",
          icon: <ImageIcon className="w-6 h-6 text-pink-400" />,
          content: (
            <div className="space-y-4">
              <p>La IA no reemplaza al creativo, lo potencia. Exploraremos cómo transformar ideas en imágenes de alto impacto usando el motor <strong>Nano Banana</strong> de Google.</p>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="font-bold text-[var(--color-hornette-primary)] mb-2">Puntos clave:</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--color-hornette-muted)]">
                  <li>Uso de <strong>Gems</strong> para asistencia visual técnica.</li>
                  <li>Transformación de fuentes en resúmenes visuales y mapas conceptuales.</li>
                  <li>Dominio de la anatomía del prompt: Sujeto, Entorno, Iluminación y Cámara.</li>
                </ul>
              </div>
            </div>
          )
        },
        {
          title: "💎 Gem para imágenes: Tu asistente experto",
          icon: <PenTool className="w-6 h-6 text-teal-400" />,
          content: (
            <div className="space-y-4">
              <p>Crearemos un asistente especializado en fotografía y diseño para que nos ayude a redactar prompts técnicos.</p>
              <CopyableBlock 
                label="Instrucciones del gem visual" 
                content="Actúa como un director de arte y fotógrafo profesional. Tu misión es ayudar al usuario a crear prompts para generación de imágenes. Para cada petición, estructura tu respuesta en JSON incluyendo: Sujeto, Composición (lente, encuadre), Iluminación (tipo de luz, sombras), Estilo (fotorrealismo, ilustración, etc.) y Atmósfera. Sugiere siempre una relación de aspecto adecuada (1:1, 16:9, 9:16)." 
              />
              <p className="text-sm text-[var(--color-hornette-muted)] italic">Esto asegura que la IA no olvide detalles técnicos como el tipo de lente o la profundidad de campo.</p>
            </div>
          )
        },
        {
          title: "💻 Ejercicio: Imagen útil para tu trabajo",
          icon: <MessageSquare className="w-6 h-6 text-indigo-400" />,
          content: (
            <div className="space-y-6">
              <p>Elige un objetivo específico para tu labor diaria. Aquí tienes ejemplos de cómo estructurar prompts maestros:</p>
              
              <div className="space-y-8">
                {/* Ejemplo 1 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="p-4 bg-blue-500/10 border-b border-white/10">
                    <h4 className="font-bold text-blue-400">1. Educación: ciclo del agua</h4>
                  </div>
                  <div className="p-4 space-y-4">
                    <p className="text-sm text-gray-300"><strong>Objetivo:</strong> portada para unidad didáctica clara y profesional.</p>
                    <CopyableBlock 
                      label="Prompt sugerido" 
                      content="Infografía educativa 3D del ciclo del agua. Estilo diorama moderno, colores vibrantes, flechas sutiles indicando evaporación y precipitación. Iluminación suave de estudio, fondo neutro, alta resolución 4K." 
                    />
                  </div>
                </div>

                {/* Ejemplo 2 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="p-4 bg-green-500/10 border-b border-white/10">
                    <h4 className="font-bold text-green-400">2. Veterinaria: manejo sanitario</h4>
                  </div>
                  <div className="p-4 space-y-4">
                    <p className="text-sm text-gray-300"><strong>Objetivo:</strong> póster instructivo para granja.</p>
                    <CopyableBlock 
                      label="Prompt sugerido" 
                      content="Ilustración técnica estilo manual de seguridad. Granja porcina limpia y organizada. Enfoque en estaciones de desinfección. Estilo vectorial limpio, colores corporativos verde y blanco, sin texto (solo visuales claros)." 
                    />
                  </div>
                </div>

                {/* Ejemplo 3 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="p-4 bg-pink-500/10 border-b border-white/10">
                    <h4 className="font-bold text-pink-400">3. Arte: taller infantil</h4>
                  </div>
                  <div className="p-4 space-y-4">
                    <p className="text-sm text-gray-300"><strong>Objetivo:</strong> afiche promocional llamativo.</p>
                    <CopyableBlock 
                      label="Prompt sugerido" 
                      content="Afiche artístico para taller de pintura infantil. Manos de niños manchadas de pintura colorida sobre un lienzo blanco. Estilo fotográfico con colores saturados, alegría, profundidad de campo corta, 85mm lens." 
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 mt-4">
                <p className="text-indigo-300 font-medium">✨ Práctica libre:</p>
                <p className="text-sm mt-1">Genera tu propia imagen, descarga el resultado y analiza el prompt que usó la IA para llegar ahí. ¿Qué palabras clave marcaron la diferencia?</p>
              </div>
            </div>
          )
        }
      ];
    } else if (sid === 4) {
      return [
        {
          title: `🤖 Ecosistema de chatbots y agentes, ${userName}`,
          icon: <Star className="w-6 h-6 text-yellow-400" />,
          content: (
            <div className="space-y-3 text-lg">
              <p>Exploraremos los <strong>atajos maestros</strong> para dominar el prompt, analizaremos las diferencias entre los <strong>líderes mundiales</strong> y descubriremos la nueva frontera: los <strong>agentes autónomos</strong>.</p>
            </div>
          )
        },
        {
          title: "⌨️ Atajos y comandos rápidos",
          icon: <Terminal className="w-6 h-6 text-blue-400" />,
          content: (
            <div className="space-y-6">
              <p>Usa estas instrucciones cortas para modificar instantáneamente el comportamiento de la IA:</p>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h4 className="font-bold text-teal-400 mb-2">/humano</h4>
                  <p className="text-sm text-gray-300 mb-3">Humaniza y suaviza el registro de las respuestas para que no parezcan redactadas por una máquina.</p>
                  <CopyableBlock label="Comando" content="/humano Revisa este correo para que suene más empático y cercano." />
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h4 className="font-bold text-orange-400 mb-2">TL;DR</h4>
                  <p className="text-sm text-gray-300 mb-3">(Too Long; Didn't Read) Para obtener respuestas cortas, directas y resúmenes ejecutivos.</p>
                  <CopyableBlock label="Comando" content="TL;DR resume los 3 puntos clave de este informe." />
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h4 className="font-bold text-pink-400 mb-2">El5 / El10</h4>
                  <p className="text-sm text-gray-300 mb-3">Explícamelo como si tuviera 5 o 10 años. Ideal para conceptos técnicos o complejos.</p>
                  <CopyableBlock label="Comando" content="El5 ¿Qué es la computación cuántica?" />
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h4 className="font-bold text-indigo-400 mb-2">Listify</h4>
                  <p className="text-sm text-gray-300 mb-3">Obliga a la herramienta a que la respuesta se entregue siempre en formato de lista.</p>
                  <CopyableBlock label="Comando" content="Listify pasos para configurar un servidor." />
                </div>
              </div>
            </div>
          )
        },
        {
          title: "🌍 Líderes occidentales",
          icon: <Globe className="w-6 h-6 text-green-400" />,
          content: (
            <div className="space-y-4">
              <p>Comparativa de las herramientas más potentes en nuestra región:</p>
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-3">
                  <div className="font-bold text-white min-w-[100px]">ChatGPT:</div>
                  <p className="text-sm text-gray-300">El referente versátil. Destaca por su ecosistema de <strong>GPTs</strong> y facilidad de uso.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-3">
                  <div className="font-bold text-white min-w-[100px]">Claude:</div>
                  <p className="text-sm text-gray-300">El más natural y seguro. Ideal para procesar <strong>documentos extensos</strong> (PDFs de 500+ páginas).</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-3">
                  <div className="font-bold text-white min-w-[100px]">Copilot:</div>
                  <p className="text-sm text-gray-300">Integración total con <strong>Microsoft 365</strong>. Útil para trabajar sobre Word, Excel y PowerPoint.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-3">
                  <div className="font-bold text-white min-w-[100px]">Grok:</div>
                  <p className="text-sm text-gray-300">Audaz y sin filtros. Conectado en <strong>tiempo real</strong> a la red social X (Twitter).</p>
                </div>
              </div>
            </div>
          )
        },
        {
          title: "🏮 Potencias orientales",
          icon: <Zap className="w-6 h-6 text-red-400" />,
          content: (
            <div className="space-y-4">
              <p>Modelos emergentes con capacidades asombrosas (muchos gratuitos):</p>
              <div className="space-y-3">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-3">
                  <div className="font-bold text-white min-w-[100px]">DeepSeek:</div>
                  <p className="text-sm text-gray-300">Eficiencia extrema. Capaz de razonar como modelos mucho más costosos.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-3">
                  <div className="font-bold text-white min-w-[100px]">Qwen:</div>
                  <p className="text-sm text-gray-300">El gigante de Alibaba. Robusto para análisis de datos masivos y código.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-start gap-3">
                  <div className="font-bold text-white min-w-[100px]">Zhipu / Chat.z.ai:</div>
                  <p className="text-sm text-gray-300">Punteros en el ecosistema asiático con integración de video y búsqueda avanzada.</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                <p className="text-xs text-red-300 font-medium uppercase tracking-wider mb-2">Nota importante:</p>
                <p className="text-sm">Explora estos enlaces para conocer interfaces alternativas y modelos 'open weights'.</p>
              </div>
            </div>
          )
        },
        {
          title: "🦾 La nueva frontera: Agentes autónomos",
          icon: <Bot className="w-6 h-6 text-purple-400" />,
          content: (
            <div className="space-y-4">
              <p>Del "Chat" a la "Acción". Los agentes no solo hablan, sino que <strong>hacen</strong>.</p>
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-6 rounded-2xl border border-white/10">
                <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-400" /> Manus AI
                </h4>
                <p className="text-sm text-gray-200 mb-4">
                  Considerado el primer agente de propósito general. Puede navegar la web, editar código, investigar y completar tareas complejas sin intervención constante.
                </p>
                <ul className="space-y-2 text-xs text-gray-400">
                  <li className="flex items-center gap-2">✅ Planificación de objetivos</li>
                  <li className="flex items-center gap-2">✅ Ejecución de herramientas externas</li>
                  <li className="flex items-center gap-2">✅ Razonamiento de múltiples pasos</li>
                </ul>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 italic text-sm text-[var(--color-hornette-muted)]">
                "La era de los agentes marca el fin del prompt manual y el inicio de la automatización inteligente."
              </div>
            </div>
          )
        }
      ];
    } else {
      return [
        {
          title: `👋 Bienvenido a la sesión ${sid}, ${userName}`,
          icon: <Star className="w-6 h-6 text-[var(--color-hornette-primary)]" />,
          content: (
            <div className="space-y-4">
              <p className="text-lg">Esta sesión es un paso crucial en tu aprendizaje. A continuación, repasaremos los conceptos clave.</p>
            </div>
          )
        },
        {
          title: "🚧 Contenido en construcción",
          icon: <PenTool className="w-6 h-6 text-orange-400" />,
          content: (
            <div className="space-y-4">
              <p>El instructor proporcionará las instrucciones en la llamada de Meet. Aquí podrás copiar y pegar los prompts una vez que se actualice la plataforma.</p>
              <CopyableBlock label="Ejemplo de prompt" content={`Hola, soy ${userName}. Estoy listo para la sesión ${sid}.`} />
            </div>
          )
        }
      ];
    }
  };


  const steps = getSessionSteps(sessionId);

  return (
    <div className="min-h-screen bg-[var(--color-hornette-bg)] pb-24 relative">
      {/* Hero Background */}
      <div 
        className="absolute top-0 left-0 w-full h-[400px] opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url('/images/ai_session_hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)"
        }}
      />
      
      <nav className="border-b border-white/10 glass-effect sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href={`/cursos/${params?.id}`} className="text-[var(--color-hornette-muted)] hover:text-white transition-colors mr-6">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <div className="text-xs text-[var(--color-hornette-primary)] font-bold uppercase tracking-wider mb-1">Parte {sessionId}</div>
              <div className="text-xl font-bold">Guía de seguimiento 🚀</div>
            </div>
          </div>
          <div className="text-sm font-medium text-[var(--color-hornette-muted)]">
            Paso {currentStep + 1} de {steps.length}
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 w-full bg-white/10">
          <motion.div 
            className="h-full bg-[var(--color-hornette-primary)]"
            initial={{ width: 0 }}
            animate={{ width: `${(Math.min(currentStep, steps.length) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 relative z-10">
        <div className="space-y-8">
          <AnimatePresence>
            {steps.map((step, index) => {
              if (index > currentStep) return null;
              
              const isCurrent = index === currentStep;
              const isPast = index < currentStep;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                  className={`relative rounded-2xl p-6 md:p-8 transition-all duration-500 ${
                    isCurrent 
                      ? "glass-effect border border-[var(--color-hornette-primary)]/50 shadow-[0_10px_40px_rgba(255,204,0,0.1)]" 
                      : "bg-white/5 border border-white/5 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${isCurrent ? "bg-white/10" : "bg-black/30"}`}>
                      {step.icon}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h2 className={`text-2xl font-bold mb-4 ${isPast ? "text-[var(--color-hornette-muted)]" : "text-white"}`}>
                        {step.title}
                      </h2>
                      <div className={`transition-all duration-500 ${isPast ? "grayscale" : ""}`}>
                        {step.content}
                      </div>

                      {isCurrent && index < steps.length && (
                        <motion.div 
                          initial={{ opacity: 0, marginTop: 0 }}
                          animate={{ opacity: 1, marginTop: 32 }}
                          transition={{ delay: 0.5 }}
                        >
                          <button
                            onClick={() => {
                              if (index === steps.length - 1) {
                                if (sessionId <= 4) {
                                  setShowQuiz(true);
                                  setCurrentStep(prev => prev + 1);
                                } else {
                                  markSessionCompleted();
                                }
                              } else {
                                setCurrentStep(prev => prev + 1);
                              }
                            }}
                            disabled={isMarkingCompleted}
                            className="w-full md:w-auto px-8 py-4 rounded-xl bg-[var(--color-hornette-primary)] text-black font-bold tracking-wide hover:bg-[var(--color-hornette-primary-hover)] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,204,0,0.3)] hover:shadow-[0_0_30px_rgba(255,204,0,0.5)] transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-wait"
                          >
                            <CheckCircle className="w-5 h-5" />
                            {isMarkingCompleted 
                              ? "Guardando..." 
                              : index === steps.length - 1 
                                ? (sessionId <= 4 ? "Ir al test de evaluación" : "Finalizar sesión")
                                : "Listo, siguiente paso"}
                          </button>
                        </motion.div>
                      )}

                      {isPast && (
                        <div className="absolute top-6 right-6">
                          <CheckCircle className="w-8 h-8 text-[var(--color-hornette-primary)] opacity-50" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {currentStep === steps.length && showQuiz && !quizPassed && (
            <div className="pt-8 relative z-20">
              <Quiz 
                sessionId={sessionId}
                onSuccess={() => {
                  setQuizPassed(true);
                  markSessionCompleted();
                  if (sessionId === 4) {
                    setShowScheduler(true);
                  }
                }} 
              />
            </div>
          )}

          {showScheduler && (
            <MeetingScheduler 
              user={user} 
              onClose={() => {
                setShowScheduler(false);
                router.push(`/cursos/${params?.id}`);
              }} 
            />
          )}

          {((currentStep === steps.length && !showQuiz) || quizPassed) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto bg-[var(--color-hornette-primary)] rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,204,0,0.5)]">
                <Star className="w-12 h-12 text-black" />
              </div>
              <h2 className="text-4xl font-extrabold mb-4">¡Sesión {sessionId} completada! 🎉</h2>
              <p className="text-xl text-[var(--color-hornette-muted)] mb-8">Gran trabajo, {userName}. Has completado esta parte de tu entrenamiento.</p>
              <Link href={`/cursos/${params?.id}`}>
                <button className="px-8 py-4 rounded-xl bg-white/10 text-white font-bold tracking-wide hover:bg-white/20 transition-colors border border-white/20">
                  Volver a los highlights
                </button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

// Icono simple para la extensión
function DownloadIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
