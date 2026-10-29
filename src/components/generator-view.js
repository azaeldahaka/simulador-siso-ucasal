/**
 * Componente: Entrenador de Problemas Cuantitativos Dinámicos
 */
import { problemsGenerator } from "../data/problems-generator.js";
import { storage } from "../core/storage.js";

export function renderGeneratorView(container) {
  let currentProblem = problemsGenerator.generateFatProblem();
  let userInputValue = "";
  let verificationState = null; // null | { isCorrect: boolean, diff: number }

  function render() {
    container.innerHTML = `
      <div class="view-wrapper">
        <div class="generator-controls">
          <button class="chip ${currentProblem.category === 'FAT' ? 'active' : ''}" data-type="fat">⚡ FAT</button>
          <button class="chip ${currentProblem.category === 'Mapa de Bits' ? 'active' : ''}" data-type="bmp">💾 Mapas de Bits</button>
          <button class="chip ${currentProblem.category === 'Rendimiento de Disco' ? 'active' : ''}" data-type="disk">💿 Velocidad Disco</button>
          <button class="chip" data-type="rnd">🎲 Aleatorio</button>
        </div>

        <div class="quiz-card">
          <div class="header-meta-row">
            <span class="badge badge-unit">${currentProblem.category}</span>
            <span class="badge badge-source">Generador Cuantitativo</span>
          </div>

          <h2 class="question-title">${currentProblem.title}</h2>
          <p class="question-prompt whitespace-pre-line">${currentProblem.statement}</p>

          <div class="calculation-input-box">
            <label for="num-input" class="input-label">${currentProblem.targetField}:</label>
            <div class="input-with-addon">
              <input 
                type="number" 
                step="any" 
                id="num-input" 
                class="numeric-input" 
                placeholder="Ingresá tu resultado..."
                value="${userInputValue}"
              />
              <span class="input-addon">${currentProblem.unit}</span>
            </div>

            <div class="calc-actions">
              <button id="btn-check-calc" class="btn btn-primary">
                ✓ Comprobar Resultado
              </button>
              <button id="btn-new-problem" class="btn btn-secondary">
                🔄 Generar Otro
              </button>
            </div>
          </div>

          ${verificationState !== null ? `
            <div class="verification-box animate-fade-in ${verificationState.isCorrect ? 'pass' : 'fail'}">
              <div class="verif-header">
                <span class="verif-icon">${verificationState.isCorrect ? '🎉' : '❌'}</span>
                <div>
                  <h3>${verificationState.isCorrect ? '¡Cálculo Exacto!' : 'Resultado Incorrecto o Fuera de Margen'}</h3>
                  <p>Valor esperado: <strong>${currentProblem.expectedValue.toLocaleString('es-AR')} ${currentProblem.unit}</strong></p>
                </div>
              </div>

              <details class="model-answer-details" open>
                <summary><strong>Ver Deducción Analítica Paso a Paso</strong></summary>
                <div class="steps-list">
                  ${currentProblem.steps.map(step => `
                    <div class="step-item">
                      <span class="step-bullet">▸</span>
                      <p>${step}</p>
                    </div>
                  `).join("")}
                </div>
              </details>
            </div>
          ` : ""}
        </div>
      </div>
    `;

    // Listeners
    container.querySelectorAll(".generator-controls .chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        if (type === "fat") currentProblem = problemsGenerator.generateFatProblem();
        else if (type === "bmp") currentProblem = problemsGenerator.generateBitmapProblem();
        else if (type === "disk") currentProblem = problemsGenerator.generateDiskSpeedProblem();
        else currentProblem = problemsGenerator.generateRandom();

        userInputValue = "";
        verificationState = null;
        render();
      });
    });

    const input = container.querySelector("#num-input");
    if (input) {
      input.addEventListener("input", (e) => {
        userInputValue = e.target.value;
      });
    }

    const btnCheck = container.querySelector("#btn-check-calc");
    if (btnCheck) {
      btnCheck.addEventListener("click", () => {
        const val = parseFloat(userInputValue);
        if (isNaN(val)) {
          alert("Por favor ingresá un número válido.");
          return;
        }

        const exp = currentProblem.expectedValue;
        const tol = currentProblem.tolerance || 0.05;
        const diff = Math.abs(val - exp);
        const isCorrect = (diff / (exp || 1)) <= tol || diff < 0.1;

        verificationState = { isCorrect, diff };
        storage.recordProblemAnswer(isCorrect);
        render();
      });
    }

    const btnNew = container.querySelector("#btn-new-problem");
    if (btnNew) {
      btnNew.addEventListener("click", () => {
        currentProblem = problemsGenerator.generateRandom();
        userInputValue = "";
        verificationState = null;
        render();
      });
    }
  }

  render();
}
