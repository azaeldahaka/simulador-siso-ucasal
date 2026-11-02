/**
 * Componente: Modo Múltiple Choice con Radar Cazabobos,
 * Aleatorización Genuina (Fisher-Yates) de Preguntas y Opciones, y Atajos de Teclado.
 */
import { choiceQuestions } from "../data/questions-choice.js";
import { storage } from "../core/storage.js";

// Algoritmo de barajado Fisher-Yates para arreglos
function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function renderChoiceView(container) {
  let activeFilter = "all"; // 'all' | 'u4' | 'u5'
  let currentIndex = 0;
  let filteredQuestions = [];
  let answeredState = {}; // { questionId: { selectedOption, isCorrect } }

  // Cache para que las opciones de una misma pregunta permanezcan estables al navegar hacia atrás/adelante
  // { questionId: { shuffledOptions: string[], correctIndex: number } }
  let questionStateCache = {};

  // Inicializa o re-baraja las preguntas y sus opciones según el filtro activo
  function initAndShuffle(keepFilter = true) {
    let pool = [];
    if (activeFilter === "u4") {
      pool = choiceQuestions.filter(q => q.unit === 4);
    } else if (activeFilter === "u5") {
      pool = choiceQuestions.filter(q => q.unit === 5);
    } else {
      pool = [...choiceQuestions];
    }

    // Barajado Fisher-Yates de las preguntas
    filteredQuestions = shuffleArray(pool);
    currentIndex = 0;
    answeredState = {};
    questionStateCache = {};

    // Pre-barajar las opciones de cada pregunta para asegurar distribución aleatoria de la respuesta correcta
    filteredQuestions.forEach(q => {
      const originalCorrectText = q.options[q.correct];
      const shuffled = shuffleArray(q.options);
      const newCorrectIndex = shuffled.indexOf(originalCorrectText);
      questionStateCache[q.id] = {
        shuffledOptions: shuffled,
        correctIndex: newCorrectIndex
      };
    });

    render();
  }

  function handleSelectOption(optIndex) {
    const q = filteredQuestions[currentIndex];
    if (answeredState[q.id] !== undefined) return; // Ya respondida

    const qState = questionStateCache[q.id];
    const isCorrect = optIndex === qState.correctIndex;
    answeredState[q.id] = { selectedOption: optIndex, isCorrect };
    storage.recordChoiceAnswer(isCorrect);
    render();
  }

  function handleNext() {
    if (currentIndex < filteredQuestions.length - 1) {
      currentIndex++;
      render();
    } else {
      // Al terminar la lista, re-barajar automáticamente para un nuevo intento
      initAndShuffle();
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      currentIndex--;
      render();
    }
  }

  function render() {
    const q = filteredQuestions[currentIndex];
    if (!q) return;

    const isAnswered = answeredState[q.id] !== undefined;
    const answerData = answeredState[q.id];
    const qState = questionStateCache[q.id];
    const displayOptions = qState.shuffledOptions;
    const correctIndex = qState.correctIndex;

    container.innerHTML = `
      <div class="view-wrapper">
        <!-- Barra de Filtros, Progreso y Re-barajado -->
        <div class="choice-topbar">
          <div class="filter-bar">
            <button class="chip ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">Todas (${choiceQuestions.length})</button>
            <button class="chip ${activeFilter === 'u4' ? 'active' : ''}" data-filter="u4">U4: Archivos</button>
            <button class="chip ${activeFilter === 'u5' ? 'active' : ''}" data-filter="u5">U5: E/S & Discos</button>
          </div>

          <div class="topbar-actions-row">
            <div class="progress-indicator">
              <span class="progress-text">Pregunta <strong>${currentIndex + 1}</strong> de ${filteredQuestions.length}</span>
              <span class="badge badge-unit">Unidad ${q.unit} • ${q.category}</span>
            </div>
            <button id="btn-shuffle-questions" class="btn btn-secondary btn-sm" title="Re-barajar aleatoriamente preguntas y opciones">
              🔀 Re-barajar
            </button>
          </div>
        </div>

        <!-- Tarjeta Principal de Pregunta -->
        <div class="quiz-card choice-main-card">
          <div class="question-header-row">
            <h2 class="question-title">${q.question}</h2>
            <span class="badge badge-source">${q.source || 'Cátedra Rivera'}</span>
          </div>

          <!-- Opciones Aleatorizadas con Atajos A, B, C, D o 1, 2, 3, 4 -->
          <div class="options-grid">
            ${displayOptions.map((opt, i) => {
              let btnClass = "choice-option";
              if (isAnswered) {
                if (i === correctIndex) {
                  btnClass += " correct";
                } else if (i === answerData.selectedOption) {
                  btnClass += " incorrect";
                } else {
                  btnClass += " dimmed";
                }
              }
              const letter = String.fromCharCode(65 + i);
              return `
                <button class="${btnClass}" data-idx="${i}" ${isAnswered ? 'disabled' : ''} title="Atajo: ${letter} o ${i + 1}">
                  <span class="option-prefix">${letter}</span>
                  <span class="option-text">${opt}</span>
                  <span class="kbd-shortcut-hint">[${i + 1}]</span>
                </button>
              `;
            }).join("")}
          </div>

          <!-- Explicación y Radar Cazabobos cuando se responde -->
          ${isAnswered ? `
            <div class="explanation-box animate-fade-in">
              <div class="trap-alert">
                <span class="trap-icon">⚠️</span>
                <div class="trap-content">
                  <strong>Radar Cazabobos de Rivera:</strong>
                  <p>${q.trap}</p>
                </div>
              </div>
              <div class="explanation-text">
                <strong>Fundamento Teórico:</strong>
                <p>${q.explanation}</p>
              </div>
            </div>
          ` : ""}

          <!-- Footer con controles de navegación -->
          <div class="card-footer">
            <button id="btn-prev" class="btn btn-secondary" ${currentIndex === 0 ? 'disabled' : ''}>
              ← Anterior
            </button>
            <div class="choice-nav-tip">
              <span class="desktop-tip">Presioná <code>1</code> a <code>4</code> para responder • <code>Enter</code> o <code>→</code> para avanzar</span>
            </div>
            <button id="btn-next" class="btn btn-primary" ${!isAnswered ? 'disabled' : ''}>
              ${currentIndex === filteredQuestions.length - 1 ? 'Finalizar y Re-barajar' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Listeners de Opciones
    container.querySelectorAll(".choice-option").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        handleSelectOption(idx);
      });
    });

    // Listeners de Filtros
    container.querySelectorAll(".filter-bar .chip").forEach(c => {
      c.addEventListener("click", () => {
        activeFilter = c.dataset.filter;
        initAndShuffle();
      });
    });

    // Botón de Re-barajado Manual
    const btnShuffle = container.querySelector("#btn-shuffle-questions");
    if (btnShuffle) {
      btnShuffle.addEventListener("click", () => {
        initAndShuffle();
      });
    }

    // Botones de Siguiente y Anterior
    const btnNext = container.querySelector("#btn-next");
    if (btnNext) btnNext.addEventListener("click", handleNext);

    const btnPrev = container.querySelector("#btn-prev");
    if (btnPrev) btnPrev.addEventListener("click", handlePrev);
  }

  // Listener Global de Teclado para Choice
  function keyHandler(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") {
      return;
    }

    const key = e.key.toUpperCase();
    const q = filteredQuestions[currentIndex];
    if (!q) return;

    const isAnswered = answeredState[q.id] !== undefined;

    if (!isAnswered) {
      if (key === "1" || key === "A") handleSelectOption(0);
      else if (key === "2" || key === "B") handleSelectOption(1);
      else if (key === "3" || key === "C") handleSelectOption(2);
      else if (key === "4" || key === "D") handleSelectOption(3);
    } else {
      if (key === "ENTER" || key === "ARROWFORWARD" || key === "ARROWRIGHT") {
        handleNext();
      }
    }

    if (key === "ARROWLEFT") {
      handlePrev();
    }
  }

  window.addEventListener("keydown", keyHandler);

  // Inicialización con barajado inicial
  initAndShuffle();
}
