/**
 * Gestor de Persistencia en LocalStorage (Offline First)
 * Guarda estadísticas de práctica, respuestas guardadas y configuración de API.
 */

const KEYS = {
  SETTINGS: "siso_settings",
  STATS: "siso_stats",
  EXAM_HISTORY: "siso_exam_history",
  OPEN_DRAFTS: "siso_open_drafts"
};

export const storage = {
  getSettings() {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      const defaults = {
        geminiApiKey: "",
        geminiModel: "gemini-2.5-flash",
        soundEnabled: true,
        darkMode: true
      };
      return data ? { ...defaults, ...JSON.parse(data) } : defaults;
    } catch {
      return {
        geminiApiKey: "",
        geminiModel: "gemini-2.5-flash",
        soundEnabled: true,
        darkMode: true
      };
    }
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error("Error guardando settings:", e);
    }
  },

  getStats() {
    try {
      const data = localStorage.getItem(KEYS.STATS);
      return data ? JSON.parse(data) : {
        choiceTotal: 0,
        choiceCorrect: 0,
        openTotal: 0,
        openAverageScore: 0,
        problemsTotal: 0,
        problemsCorrect: 0,
        streakDays: 1
      };
    } catch {
      return { choiceTotal: 0, choiceCorrect: 0, openTotal: 0, openAverageScore: 0, problemsTotal: 0, problemsCorrect: 0, streakDays: 1 };
    }
  },

  saveStats(stats) {
    try {
      localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.error("Error guardando stats:", e);
    }
  },

  recordChoiceAnswer(isCorrect) {
    const stats = this.getStats();
    stats.choiceTotal += 1;
    if (isCorrect) stats.choiceCorrect += 1;
    this.saveStats(stats);
  },

  recordProblemAnswer(isCorrect) {
    const stats = this.getStats();
    stats.problemsTotal += 1;
    if (isCorrect) stats.problemsCorrect += 1;
    this.saveStats(stats);
  },

  recordOpenScore(scorePercent) {
    const stats = this.getStats();
    const prevTotal = stats.openTotal;
    const prevAvg = stats.openAverageScore || 0;
    stats.openTotal += 1;
    stats.openAverageScore = Math.round(((prevAvg * prevTotal) + scorePercent) / stats.openTotal);
    this.saveStats(stats);
  },

  getExamHistory() {
    try {
      const data = localStorage.getItem(KEYS.EXAM_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveExamResult(result) {
    try {
      const history = this.getExamHistory();
      history.unshift({
        date: new Date().toISOString(),
        score: result.score,
        passed: result.score >= 60,
        details: result
      });
      localStorage.setItem(KEYS.EXAM_HISTORY, JSON.stringify(history.slice(0, 20)));
    } catch (e) {
      console.error("Error guardando examen:", e);
    }
  }
};
