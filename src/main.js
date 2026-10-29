/**
 * Entry Point de la Aplicación PWA
 * Con detección de actualizaciones de Service Worker y auto-recarga
 */
import { initApp } from "./app.js";

document.addEventListener("DOMContentLoaded", () => {
  initApp();

  // Registro del Service Worker con Auto-Actualización
  if ("serviceWorker" in navigator) {
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        console.log("[PWA] Nueva versión activada. Recargando para aplicar cambios...");
        window.location.reload();
      }
    });

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registrado en:", reg.scope);
          // Verificar inmediatamente si hay una versión más nueva en el servidor
          reg.update();
        })
        .catch((err) => {
          console.warn("[PWA] Falló el registro del Service Worker:", err);
        });
    });
  }
});
