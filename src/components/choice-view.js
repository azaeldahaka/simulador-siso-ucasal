/**
 * Componente: Modo Múltiple Choice con Radar Cazabobos y Atajos de Teclado
 */
import { choiceQuestions } from "../data/questions-choice.js";
import { storage } from "../core/storage.js";

export function renderChoiceView(container) {
  let activeFilter = "all"; // 'all' | 'u4' | 'u5'
  let currentIndex = 0;
  let filteredQuestions = [...choiceQuestions];
  let answeredState = {}; // { questionId: { selectedOption, isCorrect } }

  function filterQuestions() {
    if (activeFilter === "u4") {
      filteredQuestions = choiceQuestions.filter(q => q.unit === 4);
    } else if (activeFilter === "u5") {
      filteredQuestions = choiceQuestions.filter(q => q.unit === 5);
    } else {
      filteredQuestions = [...choiceQuestions];
    }
    currentIndex = 0;
    render();
  }

  function handleSelectOption(optIndex) {
    const q = filteredQuestions[currentIndex];
    if (answeredState[q.id] !== undefined) return; // Ya respondida

    const isCorrect = optIndex === q.correct;
    answeredState[q.id] = { selectedOption: optIndex, isCorrect };
    storage.recordChoiceAnswer(isCorrect);
    render();
  }

  function handleNext() {
    if (currentIndex < filteredQuestions.length - 1) {
      currentIndex++;
      render();
    } else {
      // Reiniciar
      currentIndex = 0;
      render();
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
    const isAnswered = answeredState[q.id] !== undefined;
    const answerData = answeredState[q.id];

    container.innerHTML = `
      <div class="view-wrapper">
        <!-- Barra de Filtros y Progreso Superior -->
        <div class="choice-topbar">
          <div class="filter-bar">
            <button class="chip ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">Todas (${choiceQuestions.length})</button>
            <button class="chip ${activeFilter === 'u4' ? 'active' : ''}" data-filter="u4">U4: Archivos</button>
            <button class="chip ${activeFilter === 'u5' ? 'active' : ''}" data-filter="u5">U5: E/S & Discos</button>
          </div>

          <div class="progress-indicator">
            <span class="progress-text">Pregunta <strong>${currentIndex + 1}</strong> de ${filteredQuestions.length}</span>
            <span class="badge badge-unit">Unidad ${q.unit} • ${q.category}</span>
          </div>
        </div>

        <!-- Tarjeta Principal de Pregunta -->
        <div class="quiz-card choice-main-card">
          <div class="question-header-row">
            <h2 class="question-title">${q.question}</h2>
            <span class="badge badge-source">${q.source}</span>
          </div>

          <!-- Opciones con atajos A, B, C, D o 1, 2, 3, 4 -->
          <div class="options-grid">
            ${q.options.map((opt, i) => {
              let btnClass = "choice-option";
              if (isAnswered) {
                if (i === q.correct) {
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
              ${currentIndex === filteredQuestions.length - 1 ? 'Reiniciar Lista' : 'Siguiente →'}
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
        filterQuestions();
      });
    });

    // Botones de Siguiente y Anterior
    const btnNext = container.querySelector("#btn-next");
    if (btnNext) btnNext.addEventListener("click", handleNext);

    const btnPrev = container.querySelector("#btn-prev");
    if (btnPrev) btnPrev.addEventListener("click", handlePrev);
  }

  // Listener Global de Teclado para Choice
  function keyHandler(e) {
    // Si el usuario está escribiendo en un input o textarea de otra vista, no interceptar
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") {
      return;
    }

    const key = e.key.toUpperCase();
    const q = filteredQuestions[currentIndex];
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

  // Registrar listener y desmontarlo si cambia de modo
  window.addEventListener("keydown", keyHandler);
  const unsubscribe = () => window.removeEventListener("keydown", keyHandler);

  render();
}
