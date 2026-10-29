# SPEC-001: Actualización de Modelo a Gemini 3.8-Flash e Invalidación de Caché en PWA

- **ID de Especificación:** SPEC-001
- **Fecha:** 2026-10-29
- **Autor:** Facundo & Antigravity
- **Estado:** IMPLEMENTACIÓN Y VERIFICACIÓN
- **Alcance:** `simulador-siso-ucasal`

---

## 1. Análisis de Causa Raíz (Root Cause Analysis)

### 1.1. Incidencia de Modelo de IA (Google Gemini API)
- **Mensaje de Error Oficial de la API:**
  > `Error de API: This model models/gemini-2.0-flash is no longer available. Please update your code to use models/gemini-3.8-flash for the latest features and improvements. We recommend you to use the Interactions API (https://ai.google.dev/gemini-api/docs/get-started).`
- **Diagnóstico:** En el ecosistema de la API de Google (octubre 2026), los modelos anteriores (`gemini-1.5-flash` y `gemini-2.0-flash`) fueron formalmente retirados. El modelo activo de producción para procesamiento de texto rápido y cuota gratuita es **`gemini-3.8-flash`** (junto con `gemini-3.5-flash-lite` y `gemini-3.8-pro`).
- **Defecto Previo:** Se mantuvieron cadenas de texto hardcodeadas con modelos obsoletos (`gemini-1.5-flash` y `gemini-2.0-flash`).

### 1.2. Incidencia de Caché del Service Worker (PWA Stale Trap)
- **Síntoma Reportado:** *"Nunca salió el botón de Detectar modelos o el conectar IA, solo el de Probar conexión, además que solo salían los modelos viejos."*
- **Diagnóstico:** El archivo `sw.js` utilizaba una estrategia pura **Cache-First** para todos los recursos:
  ```javascript
  // sw.js (defectuoso)
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
  ```
  Al ingresar al sitio, el navegador entregaba los archivos `.js` y `.css` viejos almacenados en la caché del navegador, ignorando las actualizaciones recién subidas a GitHub Pages hasta que el usuario cerrara todas las pestañas o borrara manualmente los datos en DevTools.

---

## 2. Requerimientos y Criterios de Aceptación (SDD Acceptance Criteria)

### AC-1: Migración Integral a `gemini-3.8-flash`
- El modelo predeterminado de todo el sistema debe ser **`gemini-3.8-flash`**.
- La lista de modelos seleccionables en UI debe contemplar la generación activa:
  - `gemini-3.8-flash` (Estándar de Producción Google 2026 - Rápido y Gratuito)
  - `gemini-3.5-flash-lite` (Ultra ligero y baja latencia)
  - `gemini-3.8-pro` (Razonamiento profundo para cátedra)
- Si una llamada de prueba o evaluación recibe un error de modelo retirado, debe consultar automáticamente `ModelService.ListModels` y autoconmutar al mejor modelo disponible.

### AC-2: Estrategia de Caché Network-First para Código Fuente
- Los archivos de lógica y estilos (`.html`, `.js`, `.css`) deben usar una estrategia **Network-First con Fallback a Caché**:
  - Si hay conexión a internet: se descarga siempre la versión más reciente del servidor y se actualiza la caché en segundo plano.
  - Si no hay conexión (offline): se sirve inmediatamente la copia en caché.
- Los recursos estáticos pesados (iconos `.png`, `.svg`) pueden usar Cache-First.

### AC-3: Cache-Busting Explícito en `index.html`
- Las etiquetas `<link rel="stylesheet">` y `<script>` en `index.html` deben incluir parámetros de versión (`?v=3.8.0`) para forzar al navegador a invalidar cualquier caché residual del navegador HTTP.

### AC-4: Auto-Activación Inmediata de Nuevos Service Workers
- El Service Worker debe ejecutar `self.skipWaiting()` en la instalación y `self.clients.claim()` en la activación.
- El cliente principal (`src/main.js`) debe escuchar el evento `controllerchange` para recargar automáticamente si un nuevo Service Worker toma el control.

---

## 3. Plan de Cambios por Archivo

| Archivo | Cambio Especificado |
| :--- | :--- |
| `index.html` | Inyectar `?v=3.8.0` a scripts y stylesheets. |
| `sw.js` | Modificar `fetch` handler: Network-First para scripts/css/html; Cache-First para media. Bumping a `siso-simulador-v3.8`. |
| `src/core/evaluator.js` | Cambiar modelo por defecto a `gemini-3.8-flash`. Actualizar lista de preferencia: `gemini-3.8-flash`, `gemini-3.5-flash-lite`, `gemini-3.8-pro`. |
| `src/core/storage.js` | Default `geminiModel: "gemini-3.8-flash"`. Migración automática si el storage guardó un modelo viejo (`1.5` o `2.0`). |
| `src/app.js` | Actualizar el `<select>` con `gemini-3.8-flash` como primera opción. Asegurar renderizado visible de los botones. |
| `src/components/open-view.js` | Actualizar etiqueta predeterminada a `gemini-3.8-flash`. |

---

## 4. Plan de Verificación
1. **Verificación Estática:** Ejecución de `node --check` en cada archivo modificado.
2. **Prueba de Red:** Confirmación de respuesta 200 en GitHub Pages con las cabeceras actualizadas.
3. **Validación de API:** Comprobar que el endpoint apunta estrictamente a `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent`.
