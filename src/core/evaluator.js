/**
 * Motor de Evaluación Semántica de Respuestas Escritas (Híbrido Offline + IA Opcional)
 * Con soporte para Gemini 3.8-Flash (Estándar Oficial Google 2026) y autodetección dinámica.
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
  "inodo": ["inodo", "nodo i", "nodo-i", "i-node", "inode", "index node", "nodos i", "tabla de inodos"],
  "nodos-i": ["inodo", "inodos", "nodo i", "nodos-i", "nodo-i", "i-node", "inode", "index node", "nodos i"],
  "ascii": ["ascii", "texto plano", "plain text", "caracteres legibles", "caracter", "lineas"],
  "binario": ["binario", "binarios", "ejecutable", "compilado", "bytes no legibles", "formato interno"],
  "dma": ["dma", "acceso directo a memoria", "direct memory access", "controlador dma"],
  "vfs": ["vfs", "sistema de archivos virtual", "virtual file system", "capa de abstraccion", "interfaz generica"],
  "bitacora": ["bitacora", "journal", "journaling", "registro circular", "log", "transacciones"],
  "irq": ["irq", "linea de interrupcion", "peticion de interrupcion", "interrupcion fisica"],
  "isr": ["isr", "rutina de servicio", "manejador de interrupcion", "interrupt handler", "servicio de interrupcion"],
  "driver": ["driver", "manejador de dispositivo", "device driver", "controlador de dispositivo"],
  "buffering": ["buffering", "buffer", "bufferizado", "almacenamiento intermedio", "cache", "cacheo"],
  "doble escritura": ["doble escritura", "escribe dos veces", "escribir dos veces", "double write", "overhead de escritura"],
  "robo de ciclos": ["robo de ciclos", "cycle stealing", "ciclo a ciclo", "ciclo de reloj"],
  "modo rafaga": ["modo rafaga", "burst mode", "bloque continuo", "rafaga de datos"],
  "fragmentacion externa": ["fragmentacion externa", "huecos dispersos", "espacio contiguo no contiguo", "hueco libre"],
  "tiempo de busqueda": ["seek time", "tiempo de busqueda", "posicionar brazo", "mover cabezal"],
  "latencia rotacional": ["latencia rotacional", "rotational latency", "rotacion de plato", "giro del disco"]
};

export const evaluator = {
  /**
   * Consulta a la API de Google los modelos disponibles y activos para la API Key
   */
  async listAvailableModels(apiKey) {
    if (!apiKey || !apiKey.trim()) return [];
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey.trim()}`);
      if (!res.ok) return [];
      const data = await res.json();
      const models = (data.models || [])
        .filter(m => (m.supportedGenerationMethods || []).includes("generateContent"))
        .map(m => m.name.replace(/^models\//, ""));
      return models;
    } catch (e) {
      console.warn("No se pudo listar modelos:", e);
      return [];
    }
  },

  /**
   * Determina el mejor modelo activo de la lista (prioriza generación 3.8 / 3.5 Flash)
   */
  pickBestModel(modelsList) {
    if (!modelsList || modelsList.length === 0) return "gemini-3.8-flash";
    const preferred = [
      "gemini-3.8-flash",
      "gemini-3.5-flash-lite",
      "gemini-3.8-pro",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.5-pro"
    ];
    for (const pref of preferred) {
      if (modelsList.includes(pref)) return pref;
    }
    const anyFlash = modelsList.find(m => m.toLowerCase().includes("flash"));
    if (anyFlash) return anyFlash;
    return modelsList[0];
  },

  /**
   * Prueba de conexión con Google Gemini con autodetección si el modelo solicitado fue retirado
   */
  async testConnection(apiKey, model = "gemini-3.8-flash") {
    if (!apiKey || !apiKey.trim()) {
      return { success: false, message: "No se proporcionó ninguna API Key." };
    }

    let targetModel = (model || "").trim();
    // Normalizar si venía con modelo deprecado en caché local
    if (!targetModel || targetModel.includes("1.5") || targetModel.includes("2.0")) {
      targetModel = "gemini-3.8-flash";
    }

    try {
      let response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Responde únicamente la palabra CONECTADO." }] }],
            generationConfig: { maxOutputTokens: 10, temperature: 0.1 }
          })
        }
      );

      // Si el modelo específico falló (404, 400 no longer available, deprecated)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData?.error?.message || `HTTP ${response.status}`;

        const isModelDeprecated = 
          errMsg.includes("no longer available") ||
          errMsg.includes("not found") ||
          errMsg.includes("not supported") ||
          errMsg.includes("update your code") ||
          response.status === 404;

        if (isModelDeprecated) {
          console.log(`Modelo ${targetModel} no disponible (${errMsg}). Conmutando a gemini-3.8-flash...`);
          
          // Reintento directo prioritario con gemini-3.8-flash
          const fallbackModel = "gemini-3.8-flash";
          const retryRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${fallbackModel}:generateContent?key=${apiKey.trim()}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: "Responde únicamente la palabra CONECTADO." }] }],
                generationConfig: { maxOutputTokens: 10, temperature: 0.1 }
              })
            }
          );

          if (retryRes.ok) {
            const retryData = await retryRes.json();
            const reply = retryData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "OK";
            const availableModels = await this.listAvailableModels(apiKey);
            return {
              success: true,
              message: `¡Conexión Exitosa con ${fallbackModel}! (Se actualizó automáticamente el modelo obsoleto "${targetModel}").`,
              autoSwitched: true,
              suggestedModel: fallbackModel,
              availableModels: availableModels.length > 0 ? availableModels : [fallbackModel, "gemini-3.5-flash-lite", "gemini-3.8-pro"]
            };
          }

          // Si gemini-3.8-flash fallara, consultar la lista completa activa de la cuenta
          const availableModels = await this.listAvailableModels(apiKey);
          if (availableModels.length > 0) {
            const best = this.pickBestModel(availableModels);
            const dynamicRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${best}:generateContent?key=${apiKey.trim()}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: "Responde únicamente la palabra CONECTADO." }] }],
                  generationConfig: { maxOutputTokens: 10, temperature: 0.1 }
                })
              }
            );

            if (dynamicRes.ok) {
              return {
                success: true,
                message: `¡Conexión Exitosa con ${best}! Modelo detectado activamente en tu cuenta.`,
                autoSwitched: true,
                suggestedModel: best,
                availableModels
              };
            }
          }
        }

        return { success: false, message: `Error de API: ${errMsg}` };
      }

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "OK";
      const availableModels = await this.listAvailableModels(apiKey);

      return {
        success: true,
        message: `¡Conexión exitosa! El modelo ${targetModel} respondió: "${reply}".`,
        autoSwitched: false,
        suggestedModel: targetModel,
        availableModels: availableModels.length > 0 ? availableModels : [targetModel]
      };
    } catch (err) {
      return {
        success: false,
        message: `Fallo de red: ${err.message}. Verificá tu conexión a internet.`
      };
    }
  },

  /**
   * Evaluación Heurística Offline
   */
  evaluateOffline(userAnswer, question) {
    const normAnswer = normalizeText(userAnswer);
    const wordsCount = normAnswer.split(/\s+/).filter(Boolean).length;

    if (wordsCount < 5) {
      return {
        score: 0,
        feedback: "Respuesta demasiado breve. Se requiere una explicación desarrollada para justificar en un parcial universitario de ingeniería.",
        puntosFuertes: [],
        puntosMejora: ["Desarrollar los conceptos con oraciones completas y argumentos técnicos."],
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

    // Penalización si es muy telegráfica
    if (wordsCount < 20 && score > 60) {
      score = Math.max(50, score - 20);
    }

    let feedback = "";
    const puntosFuertes = [];
    const puntosMejora = [];

    if (score >= 85) {
      feedback = "¡Excelente respuesta de cátedra! Cubriste con solidez los conceptos y justificaciones técnicas exigidas por el profesor Fernando Rivera.";
      puntosFuertes.push("Demostró dominio preciso del vocabulario técnico de la unidad.");
      puntosFuertes.push("Justificó el funcionamiento del mecanismo en vez de limitarse a definirlo.");
    } else if (score >= 60) {
      feedback = "Respuesta aprobada (alcanza el umbral de 60%). No obstante, faltan precisiones y sinónimos técnicos clave para asegurar una nota sobresaliente.";
      puntosFuertes.push("Identificó la idea principal de la consigna.");
      puntosMejora.push(`Faltó profundizar en: ${missing.slice(0, 2).join(", ") || 'detalles de bajo nivel'}.`);
    } else {
      feedback = "Respuesta insuficiente para el estándar de cátedra. Omitiste fundamentos nucleares que el docente descuenta de manera estricta.";
      puntosMejora.push(`Conceptos críticos omitidos: ${missing.join(", ")}.`);
      puntosMejora.push("Revisá la respuesta modelo oficial para estructurar la justificación.");
    }

    return {
      score,
      feedback,
      puntosFuertes,
      puntosMejora,
      matchedKeywords: matched,
      missingKeywords: missing,
      sampleAnswer: question.sampleAnswer,
      criterio: question.criterioExamen,
      isAi: false
    };
  },

  /**
   * Evaluación Asistida por IA con Auto-Recuperación de Modelo a 3.8-Flash
   */
  async evaluateWithAi(userAnswer, question, apiKey, model = "gemini-3.8-flash") {
    if (!apiKey) {
      return this.evaluateOffline(userAnswer, question);
    }

    let activeModel = (model || "").trim();
    if (!activeModel || activeModel.includes("1.5") || activeModel.includes("2.0")) {
      activeModel = "gemini-3.8-flash";
    }

    const promptText = `Actúa como el profesor Fernando Rivera de la materia Sistemas Operativos (UCASAL - Universidad Católica de Salta).
Evalúa con criterio riguroso de examen parcial de ingeniería la respuesta dada por un estudiante.

CONSIGNA DEL EXAMEN:
${question.prompt}

RESPUESTA DEL ESTUDIANTE:
${userAnswer}

RESPUESTA MODELO DE LA CÁTEDRA:
${question.sampleAnswer}

CRITERIO DE CORRECCIÓN EXIGIDO:
${question.criterioExamen}

CONCEPTOS OBLIGATORIOS:
${question.requiredKeywords.join(", ")}

Devuelve tu evaluación estrictamente en formato JSON válido con las siguientes claves (sin texto antes ni después, sin etiquetas markdown):
{
  "score": <número entero entre 0 y 100>,
  "feedback": "<análisis riguroso en 2 o 3 párrafos de qué está correcto, qué conceptos faltaron y la justificación pedagógica>",
  "puntosFuertes": ["aspecto destacado 1", "aspecto destacado 2"],
  "puntosMejora": ["omisión o error conceptual 1", "omisión 2"]
}`;

    async function sendRequest(mod) {
      return fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${mod}:generateContent?key=${apiKey.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 1000 }
          })
        }
      );
    }

    try {
      let response = await sendRequest(activeModel);

      // Si el modelo seleccionado falló por estar deprecado
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData?.error?.message || "";
        const isDeprecated = 
          errMsg.includes("no longer available") ||
          errMsg.includes("not found") ||
          errMsg.includes("not supported") ||
          errMsg.includes("update your code") ||
          response.status === 404;

        if (isDeprecated) {
          console.warn(`Modelo ${activeModel} deprecado en la API. Conmutando a gemini-3.8-flash...`);
          activeModel = "gemini-3.8-flash";
          response = await sendRequest(activeModel);
        }
      }

      if (!response.ok) {
        throw new Error(`API Error HTTP ${response.status}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const cleanJson = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      const offlineResult = this.evaluateOffline(userAnswer, question);

      return {
        score: typeof parsed.score === "number" ? Math.min(100, Math.max(0, parsed.score)) : offlineResult.score,
        feedback: parsed.feedback || offlineResult.feedback,
        puntosFuertes: Array.isArray(parsed.puntosFuertes) ? parsed.puntosFuertes : offlineResult.puntosFuertes,
        puntosMejora: Array.isArray(parsed.puntosMejora) ? parsed.puntosMejora : offlineResult.puntosMejora,
        matchedKeywords: offlineResult.matchedKeywords,
        missingKeywords: offlineResult.missingKeywords,
        sampleAnswer: question.sampleAnswer,
        criterio: question.criterioExamen,
        isAi: true,
        modelUsed: activeModel
      };
    } catch (err) {
      console.warn("Fallo evaluación con IA, usando motor heurístico offline:", err);
      const fallback = this.evaluateOffline(userAnswer, question);
      fallback.feedback += " (Nota: Evaluado con motor heurístico local offline debido a fallas temporales con el servicio de IA).";
      return fallback;
    }
  }
};
