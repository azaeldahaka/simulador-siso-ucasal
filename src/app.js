/**
 * Orquestador Principal de Vistas y Modales
 */
import { appState } from "./core/state.js";
import { renderNavbar } from "./components/navbar.js";
import { renderChoiceView } from "./components/choice-view.js";
import { renderOpenView } from "./components/open-view.js";
import { renderGeneratorView } from "./components/generator-view.js";
import { renderExamView } from "./components/exam-view.js";
import { renderCheatsheetView } from "./components/cheatsheet-view.js";

export function initApp() {
  const navContainer = document.getElementById("nav-container");
  const contentContainer = document.getElementById("app-content");
  const modalContainer = document.getElementById("modal-container");

  function renderCurrentView() {
    contentContainer.innerHTML = "";
    window.scrollTo({ top: 0, behavior: "smooth" });

    switch (appState.currentMode) {
      case "choice":
        renderChoiceView(contentContainer);
        break;
      case "open":
        renderOpenView(contentContainer);
        break;
      case "generator":
        renderGeneratorView(contentContainer);
        break;
      case "exam":
        renderExamView(contentContainer);
        break;
      case "cheatsheet":
        renderCheatsheetView(contentContainer);
        break;
      default:
        renderChoiceView(contentContainer);
    }
  }

  // Render inicial
  renderNavbar(navContainer);
  renderCurrentView();

  // Suscribirse a cambios de modo
  appState.subscribe((event, data) => {
    if (event === "mode-change") {
      renderNavbar(navContainer);
      renderCurrentView();
    }
  });

  // Modal de Configuración
  window.addEventListener("open-settings-modal", () => {
    renderSettingsModal(modalContainer);
  });
}

function renderSettingsModal(container) {
  container.innerHTML = `
    <div class="modal-backdrop animate-fade-in">
      <div class="modal-card">
        <div class="modal-header">
          <h2>⚙️ Ajustes del Simulador</h2>
          <button id="btn-close-modal" class="icon-btn">✕</button>
        </div>

        <div class="modal-body">
          <div class="setting-item">
            <label for="gemini-key" class="setting-label">API Key de Gemini (Opcional):</label>
            <p class="setting-hint">
              Permite corrección socrática profunda por IA de tus respuestas de desarrollo. Si la dejás vacía o estás offline, el simulador utiliza su motor semántico local sin conexión.
            </p>
            <input 
              type="password" 
              id="gemini-key" 
              class="setting-input" 
              placeholder="AIzaSy..." 
              value="${appState.settings.geminiApiKey || ''}"
            />
          </div>

          <div class="stats-summary-card">
            <h3>📈 Tus Estadísticas de Práctica:</h3>
            <div class="stats-grid">
              <div class="stat-box">
                <span class="stat-num">${appState.stats.choiceTotal}</span>
                <span class="stat-lbl">Choice Respondidas</span>
              </div>
              <div class="stat-box">
                <span class="stat-num">${appState.stats.openTotal}</span>
                <span class="stat-lbl">Desarrollos Escritos</span>
              </div>
              <div class="stat-box">
                <span class="stat-num">${appState.stats.openAverageScore}%</span>
                <span class="stat-lbl">Promedio Desarrollo</span>
              </div>
              <div class="stat-box">
                <span class="stat-num">${appState.stats.problemsTotal}</span>
                <span class="stat-lbl">Cálculos Resueltos</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button id="btn-save-settings" class="btn btn-primary">
            Guardar Ajustes
          </button>
        </div>
      </div>
    </div>
  `;

  const btnClose = container.querySelector("#btn-close-modal");
  const backdrop = container.querySelector(".modal-backdrop");
  const btnSave = container.querySelector("#btn-save-settings");
  const inputKey = container.querySelector("#gemini-key");

  const close = () => { container.innerHTML = ""; };

  btnClose.addEventListener("click", close);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });

  btnSave.addEventListener("click", () => {
    const key = inputKey.value.trim();
    appState.updateSettings({ geminiApiKey: key });
    alert("¡Ajustes guardados correctamente!");
    close();
  });
}
