/**
 * Estado Central de la Aplicación (Reactive State Store)
 */
import { storage } from "./storage.js";

class AppState {
  constructor() {
    this.currentMode = "choice"; // 'choice' | 'open' | 'generator' | 'exam' | 'cheatsheet'
    this.settings = storage.getSettings();
    this.stats = storage.getStats();
    this.listeners = [];
  }

  setMode(newMode) {
    if (this.currentMode === newMode) return;
    this.currentMode = newMode;
    this.notify("mode-change", newMode);
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    storage.saveSettings(this.settings);
    this.notify("settings-change", this.settings);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(event, data) {
    this.listeners.forEach(fn => fn(event, data));
  }
}

export const appState = new AppState();
