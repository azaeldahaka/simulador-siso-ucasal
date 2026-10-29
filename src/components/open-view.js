/**
 * Componente: Laboratorio de Respuestas Escritas (Active Recall & Feynman)
 * Con Espacio de Trabajo Dividido en 2 Columnas para PC y Evaluador Inteligente Gemini + Heurístico Local
 */
import { openQuestions } from "../data/questions-open.js";
import { evaluator } from "../core/evaluator.js";
import { appState } from "../core/state.js";
import { storage } from "../core/storage.js";

export function renderOpenView(container) {
  let currentIndex = 0;
  let userAnswers = {}; // { id: text }
  let evaluationResults = {}; // { id: resultObject }
  let isEvaluating = false;

  function render() {
    const q = openQuestions[currentIndex];
    const savedText = userAnswers[q.id] || "";
    const evalResult = evaluationResults[q.id];
    const hasAiKey = Boolean(appState.settings.geminiApiKey && appState.settings.geminiApiKey.trim());
    const aiModel = appState.settings.geminiModel || "gemini-1.5-flash";

    container.innerHTML = `
      <div class="view-wrapper open-workspace-container">
        <!-- Barra de Progreso y Metadatos Superior -->
        <div class="workspace-topbar">
          <div class="topbar-left">
            <span class="badge badge-unit">Unidad ${q.unit}</span>
            <span class="badge badge-source">${q.source}</span>
            <span class="topbar-counter">Pregunta <strong>${currentIndex + 1}</strong> de ${openQuestions.length}</span>
          </div>

          <!-- Selector de Modo de Corrección (IA vs Local) -->
          <div class="ai-evaluator-badge ${hasAiKey ? 'badge-ai-active' : 'badge-ai-offline'}">
            <span class="ai-indicator-dot"></span>
            <span class="ai-mode-text">
              ${hasAiKey ? `IA Activa (${aiModel})` : 'Motor Heurístico Local'}
            </span>
            <button id="btn-open-ai-settings" class="btn-text-action" title="Configurar o probar la clave de IA">
              ${hasAiKey ? '⚙️ Ajustes' : '✨ Conectar IA'}
            </button>
          </div>
        </div>

        <!-- Layout Dividido en 2 Columnas para Desktop (Stack vertical en móviles) -->
        <div class="open-layout-split">
          
          <!-- COLUMNA IZQUIERDA: Enunciado y Editor de Redacción -->
          <div class="open-col-editor">
            <div class="quiz-card editor-card">
              <h2 class="question-title">${q.title}</h2>
              <p class="question-prompt">${q.prompt}</p>

              <div class="editor-input-area">
                <div class="editor-header-bar">
                  <label for="answer-text" class="input-label">Tu desarrollo técnico (Active Recall):</label>
                  <span class="editor-tip-kbd">Atajo: <code>Ctrl + Enter</code> para evaluar</span>
                </div>

                <textarea 
                  id="answer-text" 
                  class="open-textarea" 
                  rows="9" 
                  placeholder="Redactá tu respuesta con tus propias palabras, explicando las causas técnicas, estructuras de datos, por qué se produce y ejemplos de ingeniería..."
                  ${isEvaluating ? 'disabled' : ''}
                >${savedText}</textarea>

                <div class="textarea-footer">
                  <div class="counter-group">
                    <span id="word-count" class="word-counter">${savedText.trim() ? savedText.trim().split(/\s+/).length : 0} palabras</span>
                    <span class="char-counter" id="char-count">(${savedText.length} caracteres)</span>
                  </div>

                  <button id="btn-evaluate" class="btn btn-primary btn-eval-action" ${isEvaluating ? 'disabled' : ''}>
                    ${isEvaluating ? `
                      <span class="spinner-dot"></span> Evaluando...
                    ` : `
                      🔍 Evaluar Respuesta
                    `}
                  </button>
                </div>
              </div>

              <!-- Navegación entre preguntas -->
              <div class="card-footer workspace-footer">
                <button id="btn-prev-open" class="btn btn-secondary" ${currentIndex === 0 ? 'disabled' : ''}>
                  ← Anterior
                </button>
                <div class="quick-jump-select">
                  <select id="jump-question-select" class="clean-select" aria-label="Saltar a pregunta">
                    ${openQuestions.map((oq, idx) => `
                      <option value="${idx}" ${idx === currentIndex ? 'selected' : ''}>
                        ${idx + 1}. ${oq.title.substring(0, 38)}...
                      </option>
                    `).join("")}
                  </select>
                </div>
                <button id="btn-next-open" class="btn btn-secondary" ${currentIndex === openQuestions.length - 1 ? 'disabled' : ''}>
                  Siguiente →
                </button>
              </div>
            </div>
          </div>

          <!-- COLUMNA DERECHA: Inspector de Evaluación y Rúbrica Rivera -->
          <div class="open-col-inspector">
            ${isEvaluating ? `
              <div class="quiz-card evaluating-skeleton-card animate-fade-in">
                <div class="eval-loading-state">
                  <div class="pulse-icon">🤖</div>
                  <h3>El Docente Virtual de SISO está evaluando tu respuesta...</h3>
                  <p class="loading-desc">
                    ${hasAiKey ? 'Consultando a Gemini 1.5 con la rúbrica oficial de la cátedra Rivera...' : 'Analizando términos técnicos, sinónimos de ingeniería y grado de justificación...'}
                  </p>
                  <div class="loading-progress-bar">
                    <div class="loading-progress-fill"></div>
                  </div>
                </div>
              </div>
            ` : evalResult ? `
              <!-- Resultado de Evaluación Generado -->
              <div class="quiz-card eval-result-card animate-fade-in">
                <div class="eval-header">
                  <div class="score-circle ${evalResult.score >= 60 ? 'pass' : 'fail'}">
                    <span class="score-val">${evalResult.score}</span>
                    <span class="score-max">/100</span>
                  </div>
                  <div class="eval-title-wrap">
                    <div class="result-badge-row">
                      <span class="badge ${evalResult.score >= 85 ? 'badge-success' : evalResult.score >= 60 ? 'badge-unit' : 'badge-error'}">
                        ${evalResult.score >= 85 ? 'Sobresaliente' : evalResult.score >= 60 ? 'Aprobado (≥60%)' : 'Insuficiente (<60%)'}
                      </span>
                      <span class="badge badge-source">${evalResult.isAi ? `IA: ${evalResult.modelUsed || 'Gemini'}` : 'Motor Local'}</span>
                    </div>
                    <p class="eval-feedback">${evalResult.feedback}</p>
                  </div>
                </div>

                ${(evalResult.puntosFuertes && evalResult.puntosFuertes.length > 0) || (evalResult.puntosMejora && evalResult.puntosMejora.length > 0) ? `
                  <div class="eval-bullets-section">
                    ${evalResult.puntosFuertes && evalResult.puntosFuertes.length > 0 ? `
                      <div class="bullet-box strengths">
                        <h4>✓ Aspectos Destacados:</h4>
                        <ul>
                          ${evalResult.puntosFuertes.map(p => `<li>${p}</li>`).join("")}
                        </ul>
                      </div>
                    ` : ""}

                    ${evalResult.puntosMejora && evalResult.puntosMejora.length > 0 ? `
                      <div class="bullet-box improvements">
                        <h4>⚠️ Ajustes Exigidos por Cátedra:</h4>
                        <ul>
                          ${evalResult.puntosMejora.map(m => `<li>${m}</li>`).join("")}
                        </ul>
                      </div>
                    ` : ""}
                  </div>
                ` : ""}

                <div class="keywords-analysis">
                  <h4>Auditoría Terminológica de Conceptos:</h4>
                  <div class="chips-grid">
                    ${evalResult.matchedKeywords.map(kw => `
                      <span class="chip chip-success" title="Detectado en tu texto">✓ ${kw}</span>
                    `).join("")}
                    ${evalResult.missingKeywords.map(kw => `
                      <span class="chip chip-error" title="No se detectó este concepto obligatorio">✗ ${kw}</span>
                    `).join("")}
                  </div>
                </div>

                <details class="model-answer-details" open>
                  <summary><strong>Ver Respuesta Modelo Oficial de Cátedra</strong></summary>
                  <div class="model-answer-content">
                    <pre class="model-pre">${evalResult.sampleAnswer}</pre>
                  </div>
                </details>
              </div>
            ` : `
              <!-- Panel de Rúbrica y Criterio Rivera (Estado Inicial / Espera) -->
              <div class="quiz-card rubric-guideline-card animate-fade-in">
                <div class="rubric-header">
                  <span class="rubric-icon">📋</span>
                  <div>
                    <h3 class="rubric-title">Rúbrica de Examen • Cátedra Rivera</h3>
                    <p class="rubric-subtitle">Criterios de corrección de Sistemas Operativos</p>
                  </div>
                </div>

                <div class="rubric-body">
                  <div class="rubric-item">
                    <span class="rubric-tag">Criterio Específico:</span>
                    <p class="rubric-text">${q.criterioExamen}</p>
                  </div>

                  <div class="rubric-item">
                    <span class="rubric-tag">Conceptos Clave a Justificar:</span>
                    <div class="keywords-preview">
                      ${q.requiredKeywords.map(kw => `
                        <span class="keyword-pill-dim">${kw}</span>
                      `).join("")}
                    </div>
                  </div>

                  <div class="rubric-item method-box">
                    <span class="rubric-tag">🧠 Método ALCORE (Fase R: Retención):</span>
                    <p class="rubric-text small">
                      Escribí tu respuesta sin mirar apuntes. La ingeniería de memoria a largo plazo se activa cuando forzás al cerebro a recuperar el concepto desde cero.
                    </p>
                  </div>
                </div>
              </div>
            `}
          </div>

        </div>
      </div>
    `;

    // Listeners
    const textarea = container.querySelector("#answer-text");
    const wordCounter = container.querySelector("#word-count");
    const charCounter = container.querySelector("#char-count");

    if (textarea) {
      textarea.addEventListener("input", (e) => {
        const text = e.target.value;
        userAnswers[q.id] = text;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        if (wordCounter) wordCounter.textContent = `${words} palabras`;
        if (charCounter) charCounter.textContent = `(${text.length} caracteres)`;
      });

      // Atajo de teclado: Ctrl + Enter o Cmd + Enter para evaluar
      textarea.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          const btnEval = container.querySelector("#btn-evaluate");
          if (btnEval && !btnEval.disabled) {
            btnEval.click();
          }
        }
      });
    }

    const btnEval = container.querySelector("#btn-evaluate");
    if (btnEval) {
      btnEval.addEventListener("click", async () => {
        const text = textarea ? textarea.value.trim() : "";
        if (!text) {
          alert("Escribí tu respuesta antes de solicitar la evaluación.");
          if (textarea) textarea.focus();
          return;
        }

        isEvaluating = true;
        render();

        const apiKey = appState.settings.geminiApiKey;
        const model = appState.settings.geminiModel || "gemini-1.5-flash";
        let result;

        if (apiKey) {
          result = await evaluator.evaluateWithAi(text, q, apiKey, model);
        } else {
          result = evaluator.evaluateOffline(text, q);
        }

        evaluationResults[q.id] = result;
        storage.recordOpenScore(result.score);
        isEvaluating = false;
        render();
      });
    }

    const btnNext = container.querySelector("#btn-next-open");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        if (currentIndex < openQuestions.length - 1) {
          currentIndex++;
          render();
        }
      });
    }

    const btnPrev = container.querySelector("#btn-prev-open");
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          render();
        }
      });
    }

    const jumpSelect = container.querySelector("#jump-question-select");
    if (jumpSelect) {
      jumpSelect.addEventListener("change", (e) => {
        currentIndex = parseInt(e.target.value, 10);
        render();
      });
    }

    const btnAiSettings = container.querySelector("#btn-open-ai-settings");
    if (btnAiSettings) {
      btnAiSettings.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("open-settings-modal"));
      });
    }
  }

  render();
}
