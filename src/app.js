/**
 * Orquestador Principal de Vistas, Modales y Atajos Globales de Teclado
 */
import { appState } from "./core/state.js";
import { renderNavbar } from "./components/navbar.js";
import { renderChoiceView } from "./components/choice-view.js";
import { renderOpenView } from "./components/open-view.js";
import { renderGeneratorView } from "./components/generator-view.js";
import { renderExamView } from "./components/exam-view.js";
import { renderCheatsheetView } from "./components/cheatsheet-view.js";
import { evaluator } from "./core/evaluator.js";

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

  // Suscribirse a cambios de modo y settings
  appState.subscribe((event, data) => {
    if (event === "mode-change" || event === "settings-change") {
      renderNavbar(navContainer);
      if (event === "mode-change") {
        renderCurrentView();
      }
    }
  });

  // Modal de Configuración
  window.addEventListener("open-settings-modal", () => {
    renderSettingsModal(modalContainer);
  });

  // Atajos globales de navegación por teclado en PC (Alt + 1 a Alt + 5)
  window.addEventListener("keydown", (e) => {
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      if (e.key === "1") { e.preventDefault(); appState.setMode("choice"); }
      else if (e.key === "2") { e.preventDefault(); appState.setMode("open"); }
      else if (e.key === "3") { e.preventDefault(); appState.setMode("generator"); }
      else if (e.key === "4") { e.preventDefault(); appState.setMode("exam"); }
      else if (e.key === "5") { e.preventDefault(); appState.setMode("cheatsheet"); }
    }
  });
}

function renderSettingsModal(container) {
  let isTesting = false;
  let testResult = null; // null | { success: boolean, message: string }

  function renderModalContent() {
    container.innerHTML = `
      <div class="modal-backdrop animate-fade-in">
        <div class="modal-card">
          <div class="modal-header">
            <div class="modal-header-title">
              <h2>⚙️ Configuración del Asistente IA</h2>
              <p class="modal-header-sub">Conectá Google Gemini para corrección socrática o usá el motor offline</p>
            </div>
            <button id="btn-close-modal" class="icon-btn" aria-label="Cerrar">✕</button>
          </div>

          <div class="modal-body">
            <!-- Guía Rápida para Obtener la API Key Gratis -->
            <div class="ai-guide-banner">
              <div class="ai-guide-icon">✨</div>
              <div class="ai-guide-text">
                <strong>¿Cómo conectar Gemini gratis en 3 pasos?</strong>
                <ol>
                  <li>Abrí <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">Google AI Studio (aistudio.google.com)</a> con tu cuenta Google.</li>
                  <li>Hacé clic en el botón azul <strong>"Get API key"</strong> y luego en <strong>"Create API key"</strong>.</li>
                  <li>Pegá la clave abajo y probala. Es 100% gratuita y se guarda solo en tu navegador (privacidad total).</li>
                </ol>
              </div>
            </div>

            <!-- Campo de Entrada de API Key -->
            <div class="setting-item">
              <label for="gemini-key" class="setting-label">API Key de Google Gemini:</label>
              <div class="input-with-action">
                <input 
                  type="password" 
                  id="gemini-key" 
                  class="setting-input" 
                  placeholder="AIzaSy..." 
                  value="${appState.settings.geminiApiKey || ''}"
                  autocomplete="off"
                />
                <button id="btn-toggle-key-visibility" class="btn btn-secondary btn-icon-addon" title="Ver / Ocultar clave">
                  👁️
                </button>
              </div>
            </div>

            <!-- Selector de Modelo -->
            <div class="setting-item">
              <label for="gemini-model" class="setting-label">Modelo de Inteligencia Artificial:</label>
              <select id="gemini-model" class="setting-input clean-select">
                <option value="gemini-1.5-flash" ${appState.settings.geminiModel === 'gemini-1.5-flash' ? 'selected' : ''}>
                  gemini-1.5-flash (Recomendado • Rápido y cuota gratis generosa)
                </option>
                <option value="gemini-2.0-flash" ${appState.settings.geminiModel === 'gemini-2.0-flash' ? 'selected' : ''}>
                  gemini-2.0-flash (Última generación de baja latencia)
                </option>
                <option value="gemini-1.5-pro" ${appState.settings.geminiModel === 'gemini-1.5-pro' ? 'selected' : ''}>
                  gemini-1.5-pro (Razonamiento profundo para respuestas complejas)
                </option>
              </select>
            </div>

            <!-- Botón para Probar Conexión en Tiempo Real -->
            <div class="setting-test-row">
              <button id="btn-test-ai" class="btn btn-secondary btn-test-conn" ${isTesting ? 'disabled' : ''}>
                ${isTesting ? '🧪 Probando conexión con Google...' : '🧪 Probar Conexión Ahora'}
              </button>
            </div>

            <!-- Resultado del Test -->
            ${testResult ? `
              <div class="test-result-alert ${testResult.success ? 'alert-success' : 'alert-error'} animate-fade-in">
                <span>${testResult.success ? '✅' : '❌'}</span>
                <p>${testResult.message}</p>
              </div>
            ` : ""}

            <!-- Estadísticas Locales de Estudio -->
            <div class="stats-summary-card">
              <h3>📈 Tus Estadísticas de Estudio Acumuladas:</h3>
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
            <button id="btn-cancel-settings" class="btn btn-secondary">
              Cancelar
            </button>
            <button id="btn-save-settings" class="btn btn-primary">
              💾 Guardar Ajustes
            </button>
          </div>
        </div>
      </div>
    `;

    // Listeners
    const btnClose = container.querySelector("#btn-close-modal");
    const btnCancel = container.querySelector("#btn-cancel-settings");
    const backdrop = container.querySelector(".modal-backdrop");
    const btnSave = container.querySelector("#btn-save-settings");
    const btnTest = container.querySelector("#btn-test-ai");
    const inputKey = container.querySelector("#gemini-key");
    const selectModel = container.querySelector("#gemini-model");
    const btnToggleVis = container.querySelector("#btn-toggle-key-visibility");

    const close = () => { container.innerHTML = ""; };

    if (btnClose) btnClose.addEventListener("click", close);
    if (btnCancel) btnCancel.addEventListener("click", close);
    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) close();
      });
    }

    if (btnToggleVis && inputKey) {
      btnToggleVis.addEventListener("click", () => {
        if (inputKey.type === "password") {
          inputKey.type = "text";
          btnToggleVis.textContent = "🙈";
        } else {
          inputKey.type = "password";
          btnToggleVis.textContent = "👁️";
        }
      });
    }

    if (btnTest) {
      btnTest.addEventListener("click", async () => {
        const key = inputKey.value.trim();
        const model = selectModel.value;

        if (!key) {
          testResult = {
            success: false,
            message: "Por favor pegá primero tu API Key de Gemini para poder probarla."
          };
          renderModalContent();
          return;
        }

        isTesting = true;
        testResult = null;
        renderModalContent();

        const res = await evaluator.testConnection(key, model);
        isTesting = false;
        testResult = res;
        renderModalContent();
      });
    }

    if (btnSave) {
      btnSave.addEventListener("click", () => {
        const key = inputKey.value.trim();
        const model = selectModel.value;
        appState.updateSettings({
          geminiApiKey: key,
          geminiModel: model
        });
        close();
      });
    }
  }

  renderModalContent();
}
