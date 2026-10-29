/**
 * Entry Point de la Aplicación PWA
 */
import { initApp } from "./app.js";

document.addEventListener("DOMContentLoaded", () => {
  initApp();

  // Registro del Service Worker para funcionalidad 100% Offline
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => {
          console.log("Service Worker registrado con éxito:", reg.scope);
        })
        .catch((err) => {
          console.warn("Fallo el registro del Service Worker:", err);
        });
    });
  }
});
