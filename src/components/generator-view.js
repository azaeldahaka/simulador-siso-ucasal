/**
 * Componente: Entrenador de Problemas Cuantitativos Dinámicos
 * Con Layout Adaptativo para PC y Resolución Paso a Paso
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
        <!-- Selector de Categoría Cuantitativa -->
        <div class="generator-controls-bar">
          <div class="generator-controls">
            <button class="chip ${currentProblem.category === 'FAT' ? 'active' : ''}" data-type="fat">⚡ FAT (Tamaño de Tabla)</button>
            <button class="chip ${currentProblem.category === 'Mapa de Bits' ? 'active' : ''}" data-type="bmp">💾 Mapas de Bits</button>
            <button class="chip ${currentProblem.category === 'Rendimiento de Disco' ? 'active' : ''}" data-type="disk">💿 Velocidad de Disco</button>
            <button class="chip" data-type="rnd">🎲 Aleatorio</button>
          </div>
        </div>

        <div class="generator-layout-grid">
          <!-- Columna 1: Enunciado del Problema e Input -->
          <div class="quiz-card generator-main-card">
            <div class="header-meta-row">
              <span class="badge badge-unit">${currentProblem.category}</span>
              <span class="badge badge-source">Generador Numérico Dinámico</span>
            </div>

            <h2 class="question-title">${currentProblem.title}</h2>
            <div class="problem-statement-box">
              <p class="question-prompt whitespace-pre-line">${currentProblem.statement}</p>
            </div>

            <div class="calculation-input-box">
              <label for="num-input" class="input-label">Calculá y escribí el valor de <strong>${currentProblem.targetField}</strong>:</label>
              <div class="input-with-addon">
                <input 
                  type="number" 
                  step="any" 
                  id="num-input" 
                  class="numeric-input" 
                  placeholder="Ej: 32"
                  value="${userInputValue}"
                  autofocus
                />
                <span class="input-addon">${currentProblem.unit}</span>
              </div>

              <div class="calc-actions">
                <button id="btn-check-calc" class="btn btn-primary btn-calc">
                  ✓ Comprobar Resultado
                </button>
                <button id="btn-new-problem" class="btn btn-secondary btn-calc">
                  🔄 Generar Nuevo Ejercicio
                </button>
              </div>
            </div>
          </div>

          <!-- Columna 2: Deducción Analítica Paso a Paso -->
          <div class="quiz-card generator-solution-card">
            ${verificationState !== null ? `
              <div class="verification-box animate-fade-in ${verificationState.isCorrect ? 'pass' : 'fail'}">
                <div class="verif-header">
                  <span class="verif-icon">${verificationState.isCorrect ? '🎉' : '❌'}</span>
                  <div>
                    <h3 class="verif-title">${verificationState.isCorrect ? '¡Cálculo Exacto!' : 'Resultado Fuera de Margen'}</h3>
                    <p class="verif-sub">Valor de cátedra esperado: <strong>${currentProblem.expectedValue.toLocaleString('es-AR')} ${currentProblem.unit}</strong></p>
                  </div>
                </div>

                <div class="analytical-steps-box">
                  <h4 class="steps-heading">Deducción Analítica Paso a Paso:</h4>
                  <div class="steps-list">
                    ${currentProblem.steps.map((step, sIdx) => `
                      <div class="step-item">
                        <span class="step-badge">${sIdx + 1}</span>
                        <p class="step-text">${step}</p>
                      </div>
                    `).join("")}
                  </div>
                </div>
              </div>
            ` : `
              <div class="generator-hint-panel">
                <div class="hint-icon">💡</div>
                <h3>Entrenamiento de Fórmulas de Examen</h3>
                <p>
                  Los parámetros numéricos (tamaño de disco, bloques, RPM, sectores) cambian en cada intento. Resolvé en papel o calculadora y verificá tu precisión.
                </p>
                <div class="formula-tip-pill">
                  <span>Presioná <code>Enter</code> para verificar tu número</span>
                </div>
              </div>
            `}
          </div>
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

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const btnCheck = container.querySelector("#btn-check-calc");
          if (btnCheck) btnCheck.click();
        }
      });
    }

    const btnCheck = container.querySelector("#btn-check-calc");
    if (btnCheck) {
      btnCheck.addEventListener("click", () => {
        const val = parseFloat(userInputValue);
        if (isNaN(val)) {
          alert("Por favor ingresá un valor numérico válido.");
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
