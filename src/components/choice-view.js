/**
 * Componente: Modo Múltiple Choice con Radar Cazabobos
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

  function render() {
    const q = filteredQuestions[currentIndex];
    const isAnswered = answeredState[q.id] !== undefined;
    const answerData = answeredState[q.id];

    container.innerHTML = `
      <div class="view-wrapper">
        <div class="filter-bar">
          <button class="chip ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">Todas (${choiceQuestions.length})</button>
          <button class="chip ${activeFilter === 'u4' ? 'active' : ''}" data-filter="u4">U4: Archivos</button>
          <button class="chip ${activeFilter === 'u5' ? 'active' : ''}" data-filter="u5">U5: E/S & Discos</button>
        </div>

        <div class="progress-indicator">
          <span>Pregunta ${currentIndex + 1} de ${filteredQuestions.length}</span>
          <span class="badge badge-unit">Unidad ${q.unit} • ${q.category}</span>
        </div>

        <div class="quiz-card">
          <h2 class="question-title">${q.question}</h2>

          <div class="options-list">
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
              return `
                <button class="${btnClass}" data-idx="${i}" ${isAnswered ? 'disabled' : ''}>
                  <span class="option-prefix">${String.fromCharCode(65 + i)}</span>
                  <span class="option-text">${opt}</span>
                </button>
              `;
            }).join("")}
          </div>

          ${isAnswered ? `
            <div class="explanation-box animate-fade-in">
              <div class="trap-alert">
                <span class="trap-icon">⚠️</span>
                <div>
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

          <div class="card-footer">
            <button id="btn-prev" class="btn btn-secondary" ${currentIndex === 0 ? 'disabled' : ''}>
              ← Anterior
            </button>
            <button id="btn-next" class="btn btn-primary" ${!isAnswered ? 'disabled' : ''}>
              ${currentIndex === filteredQuestions.length - 1 ? 'Reiniciar' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>
    `;

    // Listeners
    container.querySelectorAll(".chip").forEach(c => {
      c.addEventListener("click", () => {
        activeFilter = c.dataset.filter;
        filterQuestions();
      });
    });

    container.querySelectorAll(".choice-option").forEach(btn => {
      btn.addEventListener("click", () => {
        const selected = parseInt(btn.dataset.idx, 10);
        const isCorrect = selected === q.correct;
        answeredState[q.id] = { selectedOption: selected, isCorrect };
        storage.recordChoiceAnswer(isCorrect);
        render();
      });
    });

    const btnNext = container.querySelector("#btn-next");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        if (currentIndex < filteredQuestions.length - 1) {
          currentIndex++;
          render();
        } else {
          currentIndex = 0;
          render();
        }
      });
    }

    const btnPrev = container.querySelector("#btn-prev");
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
