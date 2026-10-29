/**
 * Motor de Evaluación Semántica de Respuestas Escritas (Híbrido Offline + IA Opcional)
 * Evalúa con precisión el Active Recall del estudiante contrastando contra la rúbrica de Rivera.
 */

// Normalizador de texto para español
function normalizeText(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Mapa de sinónimos técnicos para el evaluador offline
const SYNONYMS = {
  "inodo": ["inodo", "nodo i", "nodo-i", "i-node", "inode", "index node", "nodos i"],
  "nodos-i": ["inodo", "inodos", "nodo i", "nodos-i", "nodo-i", "i-node", "inode", "index node", "nodos i"],
  "ascii": ["ascii", "texto plano", "plain text", "caracteres legibles", "caracter"],
  "binario": ["binario", "binarios", "ejecutable", "compilado", "bytes no legibles"],
  "dma": ["dma", "acceso directo a memoria", "direct memory access", "controlador dma"],
  "vfs": ["vfs", "sistema de archivos virtual", "virtual file system", "capa de abstraccion"],
  "bitacora": ["bitacora", "journal", "journaling", "registro circular", "log"],
  "irq": ["irq", "linea de interrupcion", "peticion de interrupcion", "interrupcion fisica"],
  "isr": ["isr", "rutina de servicio", "manejador de interrupcion", "interrupt handler", "servicio de interrupcion"],
  "driver": ["driver", "manejador de dispositivo", "device driver", "controlador de dispositivo"],
  "buffering": ["buffering", "buffer", "bufferizado", "almacenamiento intermedio", "cache", "cacheo"],
  "doble escritura": ["doble escritura", "escribe dos veces", "escribir dos veces", "double write", "overhead de escritura"],
  "robo de ciclos": ["robo de ciclos", "cycle stealing", "ciclo a ciclo", "ciclo de reloj"],
  "modo rafaga": ["modo rafaga", "burst mode", "bloque continuo", "rafaga de datos"]
};

export const evaluator = {
  /**
   * Evaluación Heurística Offline
   * Analiza keywords, sinónimos, longitud y elaboración semántica.
   */
  evaluateOffline(userAnswer, question) {
    const normAnswer = normalizeText(userAnswer);
    const wordsCount = normAnswer.split(/\s+/).filter(Boolean).length;

    if (wordsCount < 5) {
      return {
        score: 0,
        feedback: "Respuesta demasiado breve. Se requiere una explicación desarrollada para justificar en un parcial universitario.",
        matchedKeywords: [],
        missingKeywords: question.requiredKeywords,
        sampleAnswer: question.sampleAnswer,
        criterio: question.criterioExamen,
        isAi: false
      };
    }

    const matched = [];
    const missing = [];

    question.requiredKeywords.forEach(kw => {
      const normKw = normalizeText(kw);
      const synList = SYNONYMS[normKw] || [normKw];

      const found = synList.some(syn => {
        const cleanSyn = normalizeText(syn);
        // Búsqueda de palabra completa o subfrase
        return normAnswer.includes(cleanSyn);
      });

      if (found) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const keywordRatio = matched.length / question.requiredKeywords.length;
    let score = Math.round(keywordRatio * 100);

    // Penalización por respuesta telegráfica (ej: solo listó palabras sueltas)
    if (wordsCount < 20 && score > 60) {
      score = Math.max(50, score - 20);
    }

    let feedback = "";
    if (score >= 85) {
      feedback = "¡Excelente respuesta de cátedra! Cubriste los conceptos y justificaciones técnicas exigidas por el profesor Rivera.";
    } else if (score >= 60) {
      feedback = "Respuesta aprobada (cumple el mínimo de 60%). Sin embargo, faltan precisiones técnicas para asegurar un 100%.";
    } else {
      feedback = "Respuesta incompleta o insuficiente. Te faltaron argumentos nucleares que la cátedra descuenta estrictamente.";
    }

    return {
      score,
      feedback,
      matchedKeywords: matched,
      missingKeywords: missing,
      sampleAnswer: question.sampleAnswer,
      criterio: question.criterioExamen,
      isAi: false
    };
  },

  /**
   * Evaluación Asistida por IA (Gemini API) con Fallback Automático a Offline
   */
  async evaluateWithAi(userAnswer, question, apiKey) {
    if (!apiKey) {
      return this.evaluateOffline(userAnswer, question);
    }

    const promptText = `Actúa como el profesor Fernando Rivera de la materia Sistemas Operativos (UCASAL).
Evalúa con criterio de examen parcial la siguiente respuesta de un alumno de ingeniería.

PREGUNTA DEL PARCIAL:
${question.prompt}

RESPUESTA DEL ALUMNO:
${userAnswer}

RESPUESTA MODELO DE LA CÁTEDRA:
${question.sampleAnswer}

CRITERIO DE CORRECCIÓN:
${question.criterioExamen}

Devuelve tu evaluación estrictamente en formato JSON con la siguiente estructura (sin bloques markdown extras):
{
  "score": <número entero entre 0 y 100>,
  "feedback": "<análisis riguroso en 2 o 3 párrafos de qué está bien, qué faltó y qué calificación obtendría>",
  "puntosFuertes": ["punto 1", "punto 2"],
  "puntosMejora": ["omisión 1", "omisión 2"]
}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 800 }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error HTTP ${response.status}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const cleanJson = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      const offlineResult = this.evaluateOffline(userAnswer, question);

      return {
        score: typeof parsed.score === "number" ? parsed.score : offlineResult.score,
        feedback: parsed.feedback || offlineResult.feedback,
        puntosFuertes: parsed.puntosFuertes || [],
        puntosMejora: parsed.puntosMejora || [],
        matchedKeywords: offlineResult.matchedKeywords,
        missingKeywords: offlineResult.missingKeywords,
        sampleAnswer: question.sampleAnswer,
        criterio: question.criterioExamen,
        isAi: true
      };
    } catch (err) {
      console.warn("Fallo evaluación con IA, usando motor offline:", err);
      const fallback = this.evaluateOffline(userAnswer, question);
      fallback.feedback += " (Evaluado con motor heurístico local offline).";
      return fallback;
    }
  }
};
