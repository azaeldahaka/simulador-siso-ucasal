/**
 * Componente Barra de Navegación y Encabezado
 */
import { appState } from "../core/state.js";

export function renderNavbar(container) {
  container.innerHTML = `
    <header class="app-header">
      <div class="header-inner">
        <div class="header-brand">
          <div class="brand-badge">SISO</div>
          <div class="brand-text">
            <h1 class="brand-title">Simulador 2do Parcial</h1>
            <p class="brand-subtitle">UCASAL • Rivera • ALCORE Active Recall</p>
          </div>
        </div>
        <button id="btn-settings" class="icon-btn" title="Configuración" aria-label="Configuración">
          ⚙️
        </button>
      </div>
    </header>

    <nav class="bottom-nav">
      <button class="nav-item ${appState.currentMode === 'choice' ? 'active' : ''}" data-mode="choice">
        <span class="nav-icon">🎯</span>
        <span class="nav-label">Choice</span>
      </button>
      <button class="nav-item ${appState.currentMode === 'open' ? 'active' : ''}" data-mode="open">
        <span class="nav-icon">✍️</span>
        <span class="nav-label">Desarrollo</span>
      </button>
      <button class="nav-item ${appState.currentMode === 'generator' ? 'active' : ''}" data-mode="generator">
        <span class="nav-icon">🧮</span>
        <span class="nav-label">Cálculos</span>
      </button>
      <button class="nav-item ${appState.currentMode === 'exam' ? 'active' : ''}" data-mode="exam">
        <span class="nav-icon">⏱️</span>
        <span class="nav-label">Simulacro</span>
      </button>
      <button class="nav-item ${appState.currentMode === 'cheatsheet' ? 'active' : ''}" data-mode="cheatsheet">
        <span class="nav-icon">⚡</span>
        <span class="nav-label">Fórmulas</span>
      </button>
    </nav>
  `;

  // Event Listeners
  container.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      appState.setMode(mode);
    });
  });

  const btnSettings = container.querySelector("#btn-settings");
  btnSettings.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("open-settings-modal"));
  });
}
