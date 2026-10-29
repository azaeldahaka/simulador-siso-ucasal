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
  let isDetecting = false;
  let testResult = null; // null | { success: boolean, message: string }
  let detectedModelsList = null;

  function renderModalContent() {
    const currentModel = appState.settings.geminiModel || "gemini-3.8-flash";

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
                  <li>Pegá la clave abajo y hacé clic en <strong>"Probar Conexión"</strong>. El sistema autodetectará el modelo activo más rápido.</li>
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

            <!-- Selector de Modelo con Autodetección Dinámica -->
            <div class="setting-item">
              <div class="model-label-row">
                <label for="gemini-model" class="setting-label">Modelo de Inteligencia Artificial:</label>
                <button id="btn-detect-models" class="btn-text-link" title="Consultar a Google qué modelos están activos para tu cuenta">
                  ${isDetecting ? 'Detectando...' : '🔍 Detectar modelos de mi cuenta'}
                </button>
              </div>

              <select id="gemini-model" class="setting-input clean-select">
                ${detectedModelsList && detectedModelsList.length > 0 ? `
                  ${detectedModelsList.map(m => `
                    <option value="${m}" ${m === currentModel ? 'selected' : ''}>
                      ${m} ${m.includes('flash') ? '⚡ (Recomendado)' : m.includes('pro') ? '🧠 (Pro)' : ''}
                    </option>
                  `).join("")}
                ` : `
                  <option value="gemini-3.8-flash" ${currentModel === 'gemini-3.8-flash' ? 'selected' : ''}>
                    gemini-3.8-flash (Recomendado Oficial Google 2026 • Ultrarrápido)
                  </option>
                  <option value="gemini-3.5-flash-lite" ${currentModel === 'gemini-3.5-flash-lite' ? 'selected' : ''}>
                    gemini-3.5-flash-lite (Ligero y ágil)
                  </option>
                  <option value="gemini-3.8-pro" ${currentModel === 'gemini-3.8-pro' ? 'selected' : ''}>
                    gemini-3.8-pro (Razonamiento profundo para respuestas de examen)
                  </option>
                  <option value="gemini-2.5-flash" ${currentModel === 'gemini-2.5-flash' ? 'selected' : ''}>
                    gemini-2.5-flash (Generación previa)
                  </option>
                `}
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
            <button id="btn-purge-cache" class="btn btn-secondary btn-sm" title="Fuerza la recarga limpia de todos los scripts y estilos">
              🔄 Limpiar Caché y Recargar
            </button>
            <div style="flex: 1"></div>
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
    const btnDetect = container.querySelector("#btn-detect-models");
    const btnPurge = container.querySelector("#btn-purge-cache");
    const inputKey = container.querySelector("#gemini-key");
    const selectModel = container.querySelector("#gemini-model");
    const btnToggleVis = container.querySelector("#btn-toggle-key-visibility");

    const close = () => { container.innerHTML = ""; };

    if (btnPurge) {
      btnPurge.addEventListener("click", async () => {
        if (confirm("¿Vaciar caché del navegador y recargar la última versión desde el servidor?")) {
          if ("caches" in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
          }
          window.location.reload();
        }
      });
    }

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

    // Botón de detección explícita de modelos
    if (btnDetect) {
      btnDetect.addEventListener("click", async () => {
        const key = inputKey.value.trim();
        if (!key) {
          alert("Pegá primero tu API Key arriba para consultar los modelos habilitados.");
          return;
        }

        isDetecting = true;
        renderModalContent();

        const models = await evaluator.listAvailableModels(key);
        isDetecting = false;

        if (models && models.length > 0) {
          detectedModelsList = models;
          const best = evaluator.pickBestModel(models);
          appState.updateSettings({ geminiApiKey: key, geminiModel: best });
          testResult = {
            success: true,
            message: `¡Se detectaron ${models.length} modelos activos en tu cuenta de Google! Se seleccionó automáticamente "${best}".`
          };
        } else {
          testResult = {
            success: false,
            message: "No se pudieron obtener modelos. Verificá que la API Key sea válida y tenga conexión."
          };
        }

        renderModalContent();
      });
    }

    // Botón de Test de Conexión
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

        // Si se autoconmutó a un modelo activo porque el anterior no existía
        if (res.suggestedModel) {
          appState.updateSettings({ geminiApiKey: key, geminiModel: res.suggestedModel });
          if (res.availableModels && res.availableModels.length > 0) {
            detectedModelsList = res.availableModels;
          }
        }

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
