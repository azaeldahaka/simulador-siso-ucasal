# SPEC-002: Refactorización Pedagógica del Banco Choice y Motor de Aleatorización Fisher-Yates

- **ID de Especificación:** SPEC-002
- **Fecha:** 2026-11-01
- **Autor:** Facundo Flores & Antigravity (Pair Programming)
- **Estado:** IMPLEMENTADO Y VERIFICADO
- **Alcance:** `simulador-siso-ucasal` (Módulo Multiple Choice)

---

## 1. Problema y Causa Raíz (Root Cause Analysis)

1. **Sesgo de Longitud ("Length Cueing"):**
   - En la versión anterior de `questions-choice.js`, la opción correcta era significativamente más larga (150-210 caracteres) que los distractores (50-70 caracteres).
   - Esto permitía que el usuario acertara por simple descarte visual de longitud sin recuperar activamente el conocimiento técnico.
2. **Auto-justificación Prematura:**
   - La opción correcta contenía explicaciones explícitas ("porque...", "lo que significa que..."), entregando el por qué antes de que el estudiante lo dedujera.
3. **Falta de Aleatorización Dinámica:**
   - Las preguntas se presentaban siempre en el orden estático del arreglo (`mc-01`, `mc-02`...).
   - Las opciones de cada pregunta tenían una posición fija, cayendo la respuesta correcta casi siempre en la misma letra (B o C).

---

## 2. Criterios de Aceptación (Acceptance Criteria)

- **AC-1 (Simetría de Opciones):** Las 4 opciones de cada una de las preguntas deben tener una extensión simétrica con variaciones mínimas de longitud.
- **AC-2 (Cero Explicación en Opción):** La opción correcta debe ser una afirmación técnica directa y concisa. Los fundamentos, causas y detalles pedagógicos se trasladan exclusivamente a los campos `explanation` y `trap`.
- **AC-3 (Expansión del Banco a 30 Preguntas):** Incorporar 10 nuevas preguntas de alta exigencia (`mc-21` a `mc-30`) basadas en los temas de parcial de Rivera (Hard links vs Soft links, dentry Unix, Superbloque y redundancia, `fsck` e inodos huérfanos, indirección de 4 KB, C-SCAN vs SCAN, planificación en SSD, Polling vs Interrupciones, RAID 1 vs RAID 5, reentrancia en Device Drivers).
- **AC-4 (Aleatorización Fisher-Yates):**
  - Las preguntas deben barajarse al azar al entrar al modo o cambiar de filtro de unidad.
  - Las 4 opciones deben barajarse al azar en cada intento, mapeando dinámicamente el índice correcto para que A, B, C y D tengan exactamente 25% de probabilidad matemática.
  - La UI debe incluir un botón `🔀 Re-barajar` accesible en la barra superior.

---

## 3. Verificación
- Verificación de sintaxis de todos los módulos con `node --check`.
- Inspección manual de la longitud de opciones y correcta ejecución de Fisher-Yates.
- Despliegue en producción sobre GitHub Pages bajo la versión `v3.9.0`.
