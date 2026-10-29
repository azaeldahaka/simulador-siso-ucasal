/**
 * Componente: Modo Simulacro de Examen Parcial Rivera (5 Preguntas - 60 Minutos)
 */
import { openQuestions } from "../data/questions-open.js";
import { problemsGenerator } from "../data/problems-generator.js";
import { ExamTimer } from "../core/timer.js";
import { evaluator } from "../core/evaluator.js";
import { storage } from "../core/storage.js";

export function renderExamView(container) {
  let examState = "idle"; // 'idle' | 'running' | 'finished'
  let timer = null;
  let examQuestions = []; // [ { type: 'open'|'calc', data, userAnswer, result } ]
  let examScore = 0;
  let remainingTimeStr = "60:00";

  function startExam() {
    // Seleccionar 3 preguntas abiertas y 2 problemas cuantitativos
    const shuffledOpen = [...openQuestions].sort(() => 0.5 - Math.random());
    const selectedOpen = shuffledOpen.slice(0, 3).map(q => ({
      type: "open",
      data: q,
      userAnswer: "",
      score: 0
    }));

    const selectedCalc = [
      {
        type: "calc",
        data: Math.random() > 0.5 ? problemsGenerator.generateFatProblem() : problemsGenerator.generateBitmapProblem(),
        userAnswer: "",
        score: 0
      },
      {
        type: "calc",
        data: problemsGenerator.generateDiskSpeedProblem(),
        userAnswer: "",
        score: 0
      }
    ];

    examQuestions = [...selectedOpen, ...selectedCalc];
    examState = "running";

    timer = new ExamTimer(60, (timeStr) => {
      remainingTimeStr = timeStr;
      const timerEl = container.querySelector("#exam-timer-display");
      if (timerEl) timerEl.textContent = timeStr;
    }, () => {
      finishExam();
    });

    timer.start();
    render();
  }

  function finishExam() {
    if (timer) timer.stop();

    let totalPoints = 0;
    const maxPointsPerQuestion = 20; // 5 preguntas * 20 pts = 100 pts

    examQuestions.forEach(item => {
      if (item.type === "open") {
        const evalRes = evaluator.evaluateOffline(item.userAnswer, item.data);
        item.result = evalRes;
        item.score = Math.round((evalRes.score / 100) * maxPointsPerQuestion);
        totalPoints += item.score;
      } else if (item.type === "calc") {
        const val = parseFloat(item.userAnswer);
        const exp = item.data.expectedValue;
        const tol = item.data.tolerance || 0.05;
        const diff = Math.abs(val - exp);
        const isCorrect = !isNaN(val) && ((diff / (exp || 1)) <= tol || diff < 0.1);
        item.result = { isCorrect, expected: exp, diff };
        item.score = isCorrect ? maxPointsPerQuestion : 0;
        totalPoints += item.score;
      }
    });

    examScore = totalPoints;
    examState = "finished";

    storage.saveExamResult({
      score: examScore,
      questions: examQuestions
    });

    render();
  }

  function render() {
    if (examState === "idle") {
      container.innerHTML = `
        <div class="view-wrapper">
          <div class="exam-intro-card">
            <span class="exam-badge">Simulador Oficial de Cátedra</span>
            <h2 class="exam-title">Simulacro 2do Parcial de Sistemas Operativos</h2>
            <p class="exam-desc">
              Este simulador replica las condiciones reales del examen del Prof. Fernando Rivera:
            </p>
            <ul class="exam-rules-list">
              <li>⏱️ <strong>Duración:</strong> 60 minutos con cuenta regresiva.</li>
              <li>📝 <strong>Estructura:</strong> 5 preguntas (3 teóricas de desarrollo y 2 cálculos numéricos).</li>
              <li>🎯 <strong>Calificación:</strong> Escala 0 a 100 puntos. <strong>Se aprueba estrictamente con 60 puntos</strong> (rendimiento igual o superior al 60%).</li>
              <li>🛡️ <strong>Sin relecturas:</strong> Escribí tus respuestas desde memoria para validar la retención activa.</li>
            </ul>

            <button id="btn-start-exam" class="btn btn-primary btn-large">
              🚀 Iniciar Examen Ahora
            </button>
          </div>
        </div>
      `;

      const btnStart = container.querySelector("#btn-start-exam");
      if (btnStart) btnStart.addEventListener("click", startExam);
      return;
    }

    if (examState === "running") {
      container.innerHTML = `
        <div class="view-wrapper">
          <div class="exam-sticky-bar">
            <span>Simulacro en curso</span>
            <div class="timer-chip">
              <span class="timer-icon">⏳</span>
              <span id="exam-timer-display">${remainingTimeStr}</span>
            </div>
            <button id="btn-finish-exam" class="btn btn-primary btn-sm">
              Terminar y Calificar
            </button>
          </div>

          <div class="exam-questions-list">
            ${examQuestions.map((item, idx) => `
              <div class="quiz-card exam-q-card">
                <div class="header-meta-row">
                  <span class="badge badge-unit">Pregunta ${idx + 1} (${item.type === 'open' ? 'Teoría' : 'Cálculo'})</span>
                  <span class="badge badge-source">20 Puntos</span>
                </div>

                <h3 class="question-title">${item.type === 'open' ? item.data.title : item.data.title}</h3>
                <p class="question-prompt whitespace-pre-line">${item.type === 'open' ? item.data.prompt : item.data.statement}</p>

                ${item.type === 'open' ? `
                  <textarea 
                    class="open-textarea exam-input" 
                    rows="5" 
                    placeholder="Desarrollá tu respuesta técnica..."
                    data-idx="${idx}"
                  >${item.userAnswer}</textarea>
                ` : `
                  <div class="input-with-addon">
                    <input 
                      type="number" 
                      step="any" 
                      class="numeric-input exam-input" 
                      placeholder="Resultado numérico (${item.data.unit})..." 
                      value="${item.userAnswer}"
                      data-idx="${idx}"
                    />
                    <span class="input-addon">${item.data.unit}</span>
                  </div>
                `}
              </div>
            `).join("")}
          </div>
        </div>
      `;

      // Inputs listeners
      container.querySelectorAll(".exam-input").forEach(input => {
        input.addEventListener("input", (e) => {
          const idx = parseInt(e.target.dataset.idx, 10);
          examQuestions[idx].userAnswer = e.target.value;
        });
      });

      const btnFinish = container.querySelector("#btn-finish-exam");
      if (btnFinish) {
        btnFinish.addEventListener("click", () => {
          if (confirm("¿Estás seguro de que querés entregar el examen y ver la calificación?")) {
            finishExam();
          }
        });
      }
      return;
    }

    if (examState === "finished") {
      const isPass = examScore >= 60;
      container.innerHTML = `
        <div class="view-wrapper">
          <div class="exam-result-banner ${isPass ? 'pass' : 'fail'}">
            <span class="result-icon">${isPass ? '🎓' : '⚠️'}</span>
            <h2>${isPass ? '¡PARCIAL APROBADO!' : 'PARCIAL DESAPROBADO (A RECUPERATORIO)'}</h2>
            <div class="score-display">
              <span class="score-num">${examScore}</span>
              <span class="score-den">/100</span>
            </div>
            <p class="result-msg">
              ${isPass 
                ? 'Superaste el 60% requerido por el reglamento de cátedra de Rivera. ¡Excelente dominio técnico!'
                : 'No alcanzaste el 60% de rendimiento mínimo. Revisá los puntos flojos y repetí el simulacro.'}
            </p>
            <button id="btn-retry-exam" class="btn btn-primary">
              🔄 Intentar Nuevo Simulacro
            </button>
          </div>

          <div class="exam-review-list">
            <h3>Desglose Pregunta por Pregunta:</h3>
            ${examQuestions.map((item, idx) => `
              <div class="quiz-card review-card ${item.score > 10 ? 'pass' : 'fail'}">
                <div class="header-meta-row">
                  <span class="badge badge-unit">Pregunta ${idx + 1}</span>
                  <span class="badge ${item.score >= 12 ? 'badge-success' : 'badge-error'}">${item.score} / 20 pts</span>
                </div>
                <h4 class="question-title">${item.type === 'open' ? item.data.title : item.data.title}</h4>
                <p class="user-written-quote"><em>Tu respuesta:</em> "${item.userAnswer || 'Sin responder'}"</p>
                
                <details class="model-answer-details" open>
                  <summary><strong>Ver Respuesta de Cátedra</strong></summary>
                  <div class="model-answer-content">
                    <pre class="model-pre">${item.type === 'open' ? item.data.sampleAnswer : item.data.steps.join('\n')}</pre>
                  </div>
                </details>
              </div>
            `).join("")}
          </div>
        </div>
      `;

      const btnRetry = container.querySelector("#btn-retry-exam");
      if (btnRetry) {
        btnRetry.addEventListener("click", () => {
          examState = "idle";
          render();
        });
      }
    }
  }

  render();
}
