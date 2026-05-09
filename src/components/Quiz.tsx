import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, RefreshCw, AlertTriangle, Circle } from 'lucide-react';

const session1Questions = [
  {
    q: "¿Cuál es la definición fundamental de la Inteligencia Artificial más simplificada?",
    options: [
      "Un sistema informático capaz de realizar tareas que normalmente requieren inteligencia humana.",
      "Un robot físico que reemplaza a los humanos en fábricas.",
      "Un programa diseñado exclusivamente para realizar cálculos matemáticos complejos.",
      "Una base de datos que almacena información de internet sin procesarla."
    ],
    correctAnswer: "Un sistema informático capaz de realizar tareas que normalmente requieren inteligencia humana.",
    explanation: "La IA busca simular la capacidad de análisis y resolución de problemas del cerebro humano."
  },
  {
    q: "Dentro de la analogía presentada, ¿qué representan los Modelos de Lenguaje Grande (LLM)?",
    options: [
      "Son como un 'cerebro' o motor de razonamiento entrenado con vastas cantidades de texto.",
      "Son los servidores físicos donde se guarda la información de Google.",
      "Son programas que solo traducen idiomas de forma literal.",
      "Son las interfaces gráficas que usamos para comunicarnos con internet."
    ],
    correctAnswer: "Son como un 'cerebro' o motor de razonamiento entrenado con vastas cantidades de texto.",
    explanation: "Los LLMs (como GPT-4 o Gemini) actúan como el núcleo de procesamiento de lenguaje y conocimiento."
  },
  {
    q: "¿Qué significa LLM?",
    options: [
      "Large Language Model (Modelo de Lenguaje Grande).",
      "Limited Logic Machine (Máquina Lógica Limitada).",
      "Local Language Maker (Creador de Lenguaje Local).",
      "Linear Learning Method (Método de Aprendizaje Lineal)."
    ],
    correctAnswer: "Large Language Model (Modelo de Lenguaje Grande).",
    explanation: "Son modelos matemáticos gigantes entrenados para predecir la siguiente palabra basándose en un contexto masivo de datos."
  },
  {
    q: "¿Qué distingue a la IA Generativa de otras ramas de la inteligencia artificial?",
    options: [
      "Su capacidad para crear contenido nuevo (texto, imágenes, audio) en lugar de solo analizar o clasificar datos.",
      "Su velocidad para realizar cálculos matemáticos.",
      "Que solo puede funcionar si está conectada permanentemente a internet.",
      "Su incapacidad para entender el contexto humano."
    ],
    correctAnswer: "Su capacidad para crear contenido nuevo (texto, imágenes, audio) en lugar de solo analizar o clasificar datos.",
    explanation: "Mientras la IA tradicional clasifica o predice (ej. detectar spam), la generativa crea contenido original."
  },
  {
    q: "En el contexto de la interacción con la IA, ¿qué es un prompt?",
    options: [
      "La instrucción, pregunta o texto inicial que le damos a la IA para que genere una respuesta.",
      "Un código de programación complejo que debes instalar antes de usar la IA.",
      "El servidor de respuesta rápida de Google.",
      "El límite de tiempo que tienes para hacer una pregunta."
    ],
    correctAnswer: "La instrucción, pregunta o texto inicial que le damos a la IA para que genere una respuesta.",
    explanation: "El prompt es tu forma de comunicarte y dirigir el trabajo de la inteligencia artificial."
  },
  {
    q: "¿Cuál es el objetivo principal de la Ingeniería de prompts?",
    options: [
      "Diseñar y optimizar instrucciones para obtener los resultados más precisos y útiles de la IA.",
      "Programar directamente el código fuente de los modelos de inteligencia artificial.",
      "Aumentar la velocidad de conexión a internet para que la IA responda más rápido.",
      "Restringir el uso de la IA a usuarios sin experiencia."
    ],
    correctAnswer: "Diseñar y optimizar instrucciones para obtener los resultados más precisos y útiles de la IA.",
    explanation: "Es el arte de estructurar tu petición para que la IA entienda exactamente qué necesitas y cómo lo necesitas."
  },
  {
    q: "¿Por qué es fundamental el proceso de 'anonimización' en el uso de la IA?",
    options: [
      "Para proteger la privacidad y evitar compartir información confidencial o datos personales con modelos de IA.",
      "Para que las respuestas de la IA sean anónimas y no sepamos de qué empresa proviene.",
      "Para esconder nuestra identidad en internet y evitar que nos rastreen al navegar.",
      "Para reducir el costo del uso de los tokens en las plataformas gratuitas."
    ],
    correctAnswer: "Para proteger la privacidad y evitar compartir información confidencial o datos personales con modelos de IA.",
    explanation: "Las IA públicas pueden usar los datos ingresados para entrenarse, por lo que nunca deben recibir datos sensibles reales."
  },
  {
    q: "Si una institución educativa desea anticipar qué alumnos están en riesgo de abandono escolar basándose en datos históricos, ¿qué tipo de IA debería emplear?",
    options: [
      "IA Predictiva / Analítica.",
      "IA Generativa.",
      "IA de Visión Computacional.",
      "IA de Procesamiento de Lenguaje Natural."
    ],
    correctAnswer: "IA Predictiva / Analítica.",
    explanation: "La IA predictiva analiza patrones pasados para predecir eventos futuros, ideal para este escenario."
  },
  {
    q: "¿Cuál es la característica principal de la IA Agéntica?",
    options: [
      "Tiene la capacidad de planificar, usar herramientas y ejecutar acciones de forma autónoma para lograr un objetivo.",
      "Solamente sirve para responder preguntas preprogramadas como un chatbot de soporte técnico.",
      "Se especializa únicamente en generar imágenes hiperrealistas.",
      "No requiere de ningún tipo de prompt para empezar a funcionar."
    ],
    correctAnswer: "Tiene la capacidad de planificar, usar herramientas y ejecutar acciones de forma autónoma para lograr un objetivo.",
    explanation: "Un agente no solo responde, sino que toma decisiones y ejecuta pasos para resolver un problema complejo."
  },
  {
    q: "En la 'fórmula del prompt maestro', ¿para qué sirve definir un 'Rol'?",
    options: [
      "Para darle a la IA un contexto de actuación, experto o tono específico desde el cual debe responder.",
      "Para identificar qué empleado de nuestra empresa está haciendo la pregunta.",
      "Para definir la longitud exacta en palabras que tendrá la respuesta.",
      "Para asignar permisos de administrador a la IA dentro de nuestro sistema."
    ],
    correctAnswer: "Para darle a la IA un contexto de actuación, experto o tono específico desde el cual debe responder.",
    explanation: "Decirle 'Actúa como un profesor experto' cambia radicalmente el enfoque y calidad de su respuesta."
  },
  {
    q: "¿Qué información se proporciona en la sección de 'Contexto' de un prompt efectivo?",
    options: [
      "Los antecedentes, la situación actual o los datos específicos necesarios para que la IA entienda el problema.",
      "Solamente los enlaces de Wikipedia relacionados al tema.",
      "El tono emocional y el idioma de salida de la respuesta.",
      "El límite de tokens que la IA tiene permitido gastar."
    ],
    correctAnswer: "Los antecedentes, la situación actual o los datos específicos necesarios para que la IA entienda el problema.",
    explanation: "El contexto evita respuestas genéricas al darle a la IA la información de fondo necesaria."
  },
  {
    q: "Dentro de la fórmula del prompt, ¿qué define la 'Tarea'?",
    options: [
      "La acción específica y clara que quieres que la IA realice.",
      "El problema filosófico de lo que quieres que resuelva.",
      "La historia de la IA desde sus inicios hasta ahora.",
      "El tiempo exacto en milisegundos que le tomará responder."
    ],
    correctAnswer: "La acción específica y clara que quieres que la IA realice.",
    explanation: "Es el núcleo de la instrucción (ej. 'Resume este artículo', 'Escribe un correo')."
  },
  {
    q: "¿Por qué es importante especificar el 'Formato' en la fórmula del prompt maestro?",
    options: [
      "Para asegurar que la salida generada se entregue en la estructura deseada (ej. tabla, lista, código).",
      "Para que la IA sepa en qué tamaño de pantalla estamos leyendo.",
      "Para definir el formato de archivo (como .doc o .pdf) que obligatoriamente descargaremos.",
      "Para decidir el color de fondo del chat en el que trabajaremos."
    ],
    correctAnswer: "Para asegurar que la salida generada se entregue en la estructura deseada (ej. tabla, lista, código).",
    explanation: "Ahorra tiempo al evitar tener que reformatear la información obtenida."
  },
  {
    q: "¿Qué representa la 'Iteración' en el proceso de diálogo con una IA?",
    options: [
      "El proceso de refinar y mejorar continuamente el prompt basado en las respuestas obtenidas.",
      "La cantidad máxima de preguntas que podemos hacer al día.",
      "El reinicio forzoso del sistema cuando la IA se confunde.",
      "El acto de copiar y pegar exactamente el mismo prompt a tres IA diferentes."
    ],
    correctAnswer: "El proceso de refinar y mejorar continuamente el prompt basado en las respuestas obtenidas.",
    explanation: "Rara vez el primer prompt es perfecto; iterar es clave para llegar al resultado ideal."
  },
  {
    q: "En el contexto de modelos como Gemini, ¿qué son los 'tokens'?",
    options: [
      "Son los fragmentos básicos de palabras o caracteres que la IA usa para procesar y generar texto.",
      "Son las monedas virtuales necesarias para pagar suscripciones Premium.",
      "Son las contraseñas que usamos para entrar al sistema de forma segura.",
      "Son los errores de procesamiento que ocurren cuando la conexión falla."
    ],
    correctAnswer: "Son los fragmentos básicos de palabras o caracteres que la IA usa para procesar y generar texto.",
    explanation: "La IA no lee palabras enteras, lee tokens (1 token suele ser aprox. 4 caracteres en inglés)."
  },
  {
    q: "¿Cuál es una ventaja de utilizar un 'Agente' de IA en lugar de un chat convencional?",
    options: [
      "El agente puede desglosar tareas complejas y usar herramientas externas (como buscar en web o correr código).",
      "El agente nunca se equivoca en ninguna circunstancia.",
      "El agente no consume internet para funcionar.",
      "El agente solo puede hablar un idioma, lo que evita errores de traducción."
    ],
    correctAnswer: "El agente puede desglosar tareas complejas y usar herramientas externas (como buscar en web o correr código).",
    explanation: "Un agente tiene 'manos' para ejecutar, mientras que el chat convencional solo tiene 'voz'."
  },
  {
    q: "¿Qué recomendación ética se enfatiza al manejar datos de pacientes o alumnos en la IA?",
    options: [
      "Nunca introducir nombres reales, identificadores o datos sensibles (cumplir con la anonimización).",
      "Introducir siempre todos sus datos médicos y personales para mayor precisión.",
      "Usar sus correos electrónicos para que la IA les envíe los resultados directamente.",
      "Compartir la cuenta de IA con los estudiantes para que ellos pongan su información."
    ],
    correctAnswer: "Nunca introducir nombres reales, identificadores o datos sensibles (cumplir con la anonimización).",
    explanation: "Es una regla de oro para evitar brechas de seguridad y confidencialidad."
  },
  {
    q: "¿Qué significa que la IA generativa 'democratiza' la creación de contenido profesional?",
    options: [
      "Permite a personas sin habilidades técnicas avanzadas producir contenido (código, arte, textos) de alta calidad.",
      "Hace que todas las IA sean desarrolladas obligatoriamente por el gobierno.",
      "Obliga a todas las empresas a regalar su software de IA.",
      "Permite que la IA vote en las elecciones presidenciales."
    ],
    correctAnswer: "Permite a personas sin habilidades técnicas avanzadas producir contenido (código, arte, textos) de alta calidad.",
    explanation: "Reduce las barreras de entrada para crear materiales que antes requerían años de estudio técnico."
  }
];

const session2Questions = [
  {
    q: "¿Cuál es la función principal que diferencia a NotebookLM de un chatbot de inteligencia artificial convencional?",
    options: ["Basa sus respuestas únicamente en los documentos proporcionados por el usuario.", "Tiene una voz hiperrealista para leerte las respuestas.", "Genera imágenes a partir de texto.", "Requiere conocimientos avanzados de programación para ser utilizado."],
    correctAnswer: "Basa sus respuestas únicamente en los documentos proporcionados por el usuario.",
    explanation: "A diferencia de ChatGPT que usa toda la internet, NotebookLM funciona exclusivamente como un experto en los documentos que le subes."
  },
  {
    q: "De acuerdo con el material, ¿cuál es el límite máximo de tamaño permitido para un solo archivo cargado en NotebookLM?",
    options: ["100 MB o 500,000 palabras por documento.", "No hay límite.", "50 MB.", "10 MB."],
    correctAnswer: "100 MB o 500,000 palabras por documento.",
    explanation: "NotebookLM permite fuentes grandes, de hasta 500k palabras por archivo o 100MB si es PDF."
  },
  {
    q: "En el panel de Studio, ¿qué herramienta permite visualizar la estructura de los temas de un cuaderno mediante cejillas expandibles?",
    options: ["La guía de estudio (Tabla de contenidos).", "El índice de contenidos.", "El diagrama de red.", "El generador de resúmenes automáticos."],
    correctAnswer: "La guía de estudio (Tabla de contenidos).",
    explanation: "La guía de estudio organiza y estructura la información principal permitiendo abrir o cerrar temas."
  },
  {
    q: "¿Qué indica el uso de números pequeños (índices) en las respuestas del chat de NotebookLM?",
    options: ["Son las citas directas o referencias exactas al documento de origen donde encontró la información.", "Indican el tiempo que tardó en generar la respuesta.", "Es una calificación del 1 al 10 sobre qué tan buena es su respuesta.", "Son los números de página obligatorios."],
    correctAnswer: "Son las citas directas o referencias exactas al documento de origen donde encontró la información.",
    explanation: "Estos marcadores son hipervínculos a la parte exacta del documento que sirvió como fuente de la información."
  },
  {
    q: "¿Cuál es la ventaja ética de utilizar una 'IA basada en fuentes' como NotebookLM en el ámbito profesional?",
    options: ["No se inventa la información (reduce alucinaciones) y los datos no se usan para entrenar al modelo público de Google.", "Es completamente gratuita de por vida.", "Permite plagiar artículos sin ser detectado.", "No requiere permisos especiales para usar datos confidenciales públicos."],
    correctAnswer: "No se inventa la información (reduce alucinaciones) y los datos no se usan para entrenar al modelo público de Google.",
    explanation: "Al limitarse a las fuentes, minimiza las alucinaciones. Además, ofrece privacidad porque tus documentos no alimentan la base de datos general."
  },
  {
    q: "¿Qué funcionalidad permite a NotebookLM organizar automáticamente más de 50 fuentes en categorías como 'nutrición' o 'sueño'?",
    options: ["Las etiquetas o tags inteligentes.", "Las carpetas del sistema.", "La búsqueda avanzada con regex.", "Los resúmenes diarios en el correo."],
    correctAnswer: "Las etiquetas o tags inteligentes.",
    explanation: "Las fuentes se pueden etiquetar para seleccionarlas o filtrarlas de forma más ágil en el chat."
  },
  {
    q: "Al crear una 'Guía de estudio' en el panel Studio, ¿cuál de estos elementos se genera automáticamente para validar la comprensión?",
    options: ["Preguntas frecuentes, cuestionarios de opción múltiple y glosarios.", "Un video explicativo en YouTube.", "Un podcast con voces generadas por IA.", "Un certificado oficial de Google."],
    correctAnswer: "Preguntas frecuentes, cuestionarios de opción múltiple y glosarios.",
    explanation: "La Guía de Estudio (Study Guide) puede producir material de apoyo educativo basado en las notas."
  },
  {
    q: "¿cuál es el límite máximo de fuentes que se pueden incluir en un solo cuaderno?",
    options: ["50 fuentes.", "10 fuentes.", "100 fuentes.", "No hay límite de fuentes."],
    correctAnswer: "50 fuentes.",
    explanation: "Actualmente NotebookLM permite subir un máximo de 50 fuentes por cada cuaderno."
  },
  {
    q: "¿Cuál de las siguientes es una fuente de información 'no textual' que NotebookLM puede procesar?",
    options: ["Archivos de audio (MP3/WAV) o videos de YouTube (mediante URL).", "Imágenes JPEG de vacaciones.", "Documentos en formato ZIP.", "Archivos ejecutables (.exe)."],
    correctAnswer: "Archivos de audio (MP3/WAV) o videos de YouTube (mediante URL).",
    explanation: "NotebookLM es multimodal y puede analizar el audio y los transcripciones de un video o archivo de audio."
  },
  {
    q: "Para un docente, ¿cuál es la utilidad primordial de transformar un texto denso en una 'Guía de estudio' en NotebookLM?",
    options: ["Extraer las ideas principales, generar preguntas de repaso y crear un resumen estructurado para los alumnos.", "Crear una presentación en PowerPoint.", "Para evitar leer el texto completo antes de la clase.", "Para traducirlo automáticamente a 50 idiomas diferentes."],
    correctAnswer: "Extraer las ideas principales, generar preguntas de repaso y crear un resumen estructurado para los alumnos.",
    explanation: "Facilita la labor docente al procesar lecturas pesadas y convertirlas en material didáctico."
  },
  {
    q: "Si un usuario sube un audio en formato OGG a NotebookLM, ¿qué ocurre con esa fuente?",
    options: ["NotebookLM no lo admite directamente, por eso se recomienda usar un conversor local para pasarlo a MP3 o subirlo a YouTube primero.", "NotebookLM lo transcribe instantáneamente.", "El archivo corrompe el cuaderno.", "Se borra a las 24 horas por políticas de privacidad."],
    correctAnswer: "NotebookLM no lo admite directamente, por eso se recomienda usar un conversor local para pasarlo a MP3 o subirlo a YouTube primero.",
    explanation: "El formato OGG a veces requiere conversión a formatos admitidos nativamente como MP3/WAV o enlazarse desde YouTube."
  },
  {
    q: "¿Por qué se afirma que NotebookLM es más 'seguro' que un chat convencional como la versión gratuita de ChatGPT(y otros)?",
    options: ["Porque no utiliza tus documentos privados o datos de las fuentes para entrenar otros modelos de IA de Google.", "Porque requiere huella dactilar para abrir cada documento.", "Porque cuenta con antivirus integrado.", "Porque sus servidores no están conectados a internet."],
    correctAnswer: "Porque no utiliza tus documentos privados o datos de las fuentes para entrenar otros modelos de IA de Google.",
    explanation: "Tus datos se mantienen en tu entorno de Drive y Google asegura no utilizarlos para el entrenamiento general de sus modelos públicos."
  }
];

const questionBanks: Record<number, any[]> = {
  1: session1Questions,
  2: session2Questions,
  3: [],
  4: []
};

// Helper to shuffle array
function shuffleArray(array: any[]) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

interface QuizProps {
  sessionId: number;
  onSuccess: () => void;
}

export default function Quiz({ sessionId, onSuccess }: QuizProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    startQuiz();
  }, [sessionId]);

  const startQuiz = () => {
    const bank = questionBanks[sessionId] || [];
    if (bank.length === 0) {
      setFinished(true); // Auto-pass if no quiz available
      onSuccess();
      return;
    }
    // Select up to 10 random questions
    const limit = Math.min(10, bank.length);
    const shuffled = shuffleArray(bank).slice(0, limit);
    // Shuffle options for each question
    const prepped = shuffled.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    setQuestions(prepped);
    setCurrentIdx(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setFinished(false);
  };

  const handleSelect = (option: string) => {
    if (showExplanation) return;
    setSelectedAnswer(option);
  };

  const handleCheck = () => {
    if (!selectedAnswer) return;
    const isCorrect = selectedAnswer === questions[currentIdx].correctAnswer;
    if (isCorrect) setScore(prev => prev + 1);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  if (questions.length === 0) return <div>Cargando test...</div>;

  if (finished) {
    const passed = score >= 8;
    return (
      <div className="glass-effect rounded-2xl p-8 text-center max-w-2xl mx-auto border border-white/10">
        <h2 className="text-3xl font-bold mb-6">Resultados del Test</h2>
        <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-4xl font-bold mb-6"
             style={{ background: passed ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: passed ? '#4ade80' : '#f87171' }}>
          {score} / 10
        </div>
        {passed ? (
          <div className="space-y-6">
            <p className="text-xl text-green-400 font-medium">¡Felicidades! Has aprobado la sesión.</p>
            <p className="text-[var(--color-hornette-muted)]">Demostraste dominar los fundamentos de la Inteligencia Artificial.</p>
            <button 
              onClick={onSuccess}
              className="px-8 py-4 rounded-xl bg-[var(--color-hornette-primary)] text-black font-bold hover:bg-[var(--color-hornette-primary-hover)] transition-colors w-full"
            >
              FINALIZAR Y DESBLOQUEAR SESIÓN 2
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-left">
              <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-1" />
              <div>
                <p className="text-red-400 font-bold">No has alcanzado el mínimo requerido (8/10).</p>
                <p className="text-sm text-red-300/80 mt-1">Es fundamental dominar estos conceptos para avanzar con seguridad. Debes realizar el test de nuevo.</p>
              </div>
            </div>
            <button 
              onClick={startQuiz}
              className="px-8 py-4 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> REPETIR EL TEST
            </button>
          </div>
        )}
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="glass-effect rounded-2xl p-6 md:p-8 max-w-3xl mx-auto border border-[var(--color-hornette-primary)]/30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[var(--color-hornette-primary)] font-bold uppercase tracking-widest text-xs">Evaluación de Conocimientos</h3>
        <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full font-mono">Pregunta {currentIdx + 1}/10</span>
      </div>

      <h2 className="text-2xl font-bold mb-8">{currentQ.q}</h2>

      <div className="space-y-3 mb-8">
        {currentQ.options.map((opt: string, i: number) => {
          let style = "bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer";
          let icon = <Circle className="w-5 h-5 text-[var(--color-hornette-muted)]" />;
          
          if (showExplanation) {
            if (opt === currentQ.correctAnswer) {
              style = "bg-green-500/10 border-green-500/50";
              icon = <CheckCircle className="w-5 h-5 text-green-400" />;
            } else if (opt === selectedAnswer && !isCorrect) {
              style = "bg-red-500/10 border-red-500/50";
              icon = <XCircle className="w-5 h-5 text-red-400" />;
            } else {
              style = "bg-white/5 border-white/5 opacity-50 cursor-not-allowed";
            }
          } else if (selectedAnswer === opt) {
            style = "bg-[var(--color-hornette-primary)]/20 border-[var(--color-hornette-primary)]/50";
            icon = <CheckCircle className="w-5 h-5 text-[var(--color-hornette-primary)]" />;
          }

          return (
            <div 
              key={i} 
              onClick={() => handleSelect(opt)}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${style}`}
            >
              <div className="shrink-0">{icon}</div>
              <p className="text-sm md:text-base">{opt}</p>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`rounded-xl p-5 mb-6 text-sm ${isCorrect ? "bg-green-500/10 text-green-200" : "bg-red-500/10 text-red-200"}`}
          >
            <p className="font-bold mb-1">{isCorrect ? "¡Correcto!" : "Incorrecto."}</p>
            <p>{currentQ.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        {!showExplanation ? (
          <button
            disabled={!selectedAnswer}
            onClick={handleCheck}
            className="px-6 py-3 rounded-xl bg-[var(--color-hornette-primary)] text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-hornette-primary-hover)] transition-colors"
          >
            COMPROBAR
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            {currentIdx === questions.length - 1 ? "VER RESULTADOS" : "SIGUIENTE"} <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
