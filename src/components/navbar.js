/**
 * Componente: Barra de Navegación y Encabezado Adaptativo (Desktop Workspace + Mobile Bar)
 */
import { appState } from "../core/state.js";

export function renderNavbar(container) {
  const isAiConnected = Boolean(appState.settings.geminiApiKey && appState.settings.geminiApiKey.trim());
  const aiStatusLabel = isAiConnected ? "IA Activa" : "Modo Offline";
  const aiStatusClass = isAiConnected ? "status-ai-on" : "status-ai-off";

  container.innerHTML = `
    <header class="app-header">
      <div class="header-inner">
        <!-- Logo & Identidad de Cátedra -->
        <div class="header-brand">
          <div class="brand-badge">SISO</div>
          <div class="brand-text">
            <h1 class="brand-title">Simulador 2do Parcial</h1>
            <p class="brand-subtitle">UCASAL • Rivera • ALCORE Active Recall</p>
          </div>
        </div>

        <!-- Pestañas Desktop (Ocultas en móviles, visibles en pantallas >= 768px) -->
        <nav class="desktop-nav-tabs" aria-label="Navegación de Modos">
          <button class="desktop-tab-btn ${appState.currentMode === 'choice' ? 'active' : ''}" data-mode="choice" title="Atajo: Alt + 1">
            <span class="tab-icon">🎯</span>
            <span class="tab-text">Choice</span>
            <span class="desktop-kbd">1</span>
          </button>
          <button class="desktop-tab-btn ${appState.currentMode === 'open' ? 'active' : ''}" data-mode="open" title="Atajo: Alt + 2">
            <span class="tab-icon">✍️</span>
            <span class="tab-text">Desarrollo</span>
            <span class="desktop-kbd">2</span>
          </button>
          <button class="desktop-tab-btn ${appState.currentMode === 'generator' ? 'active' : ''}" data-mode="generator" title="Atajo: Alt + 3">
            <span class="tab-icon">🧮</span>
            <span class="tab-text">Cálculos</span>
            <span class="desktop-kbd">3</span>
          </button>
          <button class="desktop-tab-btn ${appState.currentMode === 'exam' ? 'active' : ''}" data-mode="exam" title="Atajo: Alt + 4">
            <span class="tab-icon">⏱️</span>
            <span class="tab-text">Simulacro</span>
            <span class="desktop-kbd">4</span>
          </button>
          <button class="desktop-tab-btn ${appState.currentMode === 'cheatsheet' ? 'active' : ''}" data-mode="cheatsheet" title="Atajo: Alt + 5">
            <span class="tab-icon">⚡</span>
            <span class="tab-text">Fórmulas</span>
            <span class="desktop-kbd">5</span>
          </button>
        </nav>

        <!-- Controles de Acción (IA Status Pill + Settings) -->
        <div class="header-actions">
          <button id="btn-quick-ai-status" class="ai-status-pill ${aiStatusClass}" title="Hacé clic para configurar o probar tu clave de IA Gemini">
            <span class="status-dot"></span>
            <span class="status-text">${aiStatusLabel}</span>
          </button>
          <button id="btn-settings" class="icon-btn" title="Configuración de IA y Estadísticas" aria-label="Configuración">
            ⚙️
          </button>
        </div>
      </div>
    </header>

    <!-- Barra de Navegación Inferior (Visible en móviles, oculta en pantallas >= 768px) -->
    <nav class="bottom-nav" aria-label="Navegación Móvil">
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

  // Listeners de pestañas tanto desktop como móviles
  container.querySelectorAll("[data-mode]").forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      appState.setMode(mode);
    });
  });

  const btnSettings = container.querySelector("#btn-settings");
  if (btnSettings) {
    btnSettings.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("open-settings-modal"));
    });
  }

  const btnAiPill = container.querySelector("#btn-quick-ai-status");
  if (btnAiPill) {
    btnAiPill.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("open-settings-modal"));
    });
  }
}
