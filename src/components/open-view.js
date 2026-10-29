/**
 * Componente: Laboratorio de Respuestas Escritas (Active Recall & Feynman)
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

    container.innerHTML = `
      <div class="view-wrapper">
        <div class="header-meta-row">
          <span class="badge badge-source">${q.source}</span>
          <span class="badge badge-unit">Unidad ${q.unit}</span>
        </div>

        <div class="quiz-card">
          <h2 class="question-title">${q.title}</h2>
          <p class="question-prompt">${q.prompt}</p>

          <div class="input-section">
            <label for="answer-text" class="input-label">Escribí tu respuesta con tus propias palabras (Active Recall):</label>
            <textarea 
              id="answer-text" 
              class="open-textarea" 
              rows="6" 
              placeholder="Desarrollá los conceptos técnicos, justificaciones y ejemplos como si estuvieras rindiendo en la hoja de examen..."
              ${isEvaluating ? 'disabled' : ''}
            >${savedText}</textarea>

            <div class="textarea-footer">
              <span id="word-count" class="word-counter">${savedText.trim() ? savedText.trim().split(/\s+/).length : 0} palabras</span>
              <button id="btn-evaluate" class="btn btn-primary" ${isEvaluating ? 'disabled' : ''}>
                ${isEvaluating ? 'Evaluando...' : '🔍 Evaluar Respuesta'}
              </button>
            </div>
          </div>

          ${evalResult ? `
            <div class="eval-result-card animate-fade-in">
              <div class="eval-header">
                <div class="score-circle ${evalResult.score >= 60 ? 'pass' : 'fail'}">
                  <span class="score-val">${evalResult.score}</span>
                  <span class="score-max">/100</span>
                </div>
                <div class="eval-title-wrap">
                  <h3>${evalResult.score >= 60 ? 'Aprobado con Criterio de Cátedra' : 'Insuficiente / Requiere Refuerzo'}</h3>
                  <p class="eval-feedback">${evalResult.feedback}</p>
                </div>
              </div>

              <div class="keywords-analysis">
                <h4>Auditoría de Conceptos Obligatorios:</h4>
                <div class="chips-grid">
                  ${evalResult.matchedKeywords.map(kw => `
                    <span class="chip chip-success">✓ ${kw}</span>
                  `).join("")}
                  ${evalResult.missingKeywords.map(kw => `
                    <span class="chip chip-error">✗ ${kw}</span>
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
          ` : ""}

          <div class="card-footer">
            <button id="btn-prev-open" class="btn btn-secondary" ${currentIndex === 0 ? 'disabled' : ''}>
              ← Anterior
            </button>
            <span class="counter-text">${currentIndex + 1} de ${openQuestions.length}</span>
            <button id="btn-next-open" class="btn btn-secondary" ${currentIndex === openQuestions.length - 1 ? 'disabled' : ''}>
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    `;

    // Listeners
    const textarea = container.querySelector("#answer-text");
    const wordCounter = container.querySelector("#word-count");

    if (textarea) {
      textarea.addEventListener("input", (e) => {
        const text = e.target.value;
        userAnswers[q.id] = text;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        if (wordCounter) wordCounter.textContent = `${words} palabras`;
      });
    }

    const btnEval = container.querySelector("#btn-evaluate");
    if (btnEval) {
      btnEval.addEventListener("click", async () => {
        const text = textarea.value.trim();
        if (!text) {
          alert("Escribí tu respuesta antes de solicitar la evaluación.");
          return;
        }

        isEvaluating = true;
        render();

        const apiKey = appState.settings.geminiApiKey;
        let result;
        if (apiKey) {
          result = await evaluator.evaluateWithAi(text, q, apiKey);
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
  }

  render();
}
