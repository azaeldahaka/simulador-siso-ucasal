/**
 * Cronómetro y Temporizador para el Modo Examen y Blurting
 */

export class ExamTimer {
  constructor(durationMinutes, onTick, onFinish) {
    this.totalSeconds = durationMinutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.onTick = onTick;
    this.onFinish = onFinish;
    this.intervalId = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.remainingSeconds -= 1;
      if (this.onTick) this.onTick(this.formatTime(), this.remainingSeconds);

      if (this.remainingSeconds <= 0) {
        this.stop();
        if (this.onFinish) this.onFinish();
      }
    }, 1000);
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  reset() {
    this.stop();
    this.remainingSeconds = this.totalSeconds;
    if (this.onTick) this.onTick(this.formatTime(), this.remainingSeconds);
  }

  formatTime() {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
}
