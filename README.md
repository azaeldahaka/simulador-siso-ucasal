# 🛡️ Simulador 2do Parcial - Sistemas Operativos (UCASAL)

Aplicación Web Progresiva (**PWA**), mobile-first y **100% offline**, diseñada bajo el **Método ALCORE** y principios de recuperación activa (*Active Recall*) para preparar el segundo parcial de **Sistemas Operativos** (Cátedra: Prof. Ing. Fernando Lucas Rivera Bernsdorff, UCASAL).

---

## 🚀 Características Principales

1. **Modo Múltiple Choice con Radar Cazabobos:**
   - Banco de preguntas exhaustivas sobre **Unidad 4 (Sistemas de Archivos)** y **Unidad 5 (Entrada/Salida y Discos)**.
   - Detección de trampas clásicas de examen y justificación teórica basada en Tanenbaum.
2. **Laboratorio de Respuestas Escritas (Active Recall & Feynman):**
   - Preguntas de desarrollo de parciales reales (2024, 2025 Tema B, 2025 Recu, Final 2026).
   - **Motor de Evaluación Semántica Híbrido:**
     - *Modo Offline Nativo:* Analiza conceptos y palabras clave obligatorias, detecta omisiones y califica sobre 100 con retroalimentación inmediata.
     - *Modo IA (Opcional):* Integra la API de Gemini mediante API key personal para corrección socrática profunda.
3. **Entrenador Cuantitativo Dinámico:**
   - Generador aleatorio con parámetros variables para:
     - Capacidad máxima en particiones **FAT-12 / FAT-16 / FAT-32**.
     - Espacio y bloques requeridos en **Mapas de Bits**.
     - Velocidad efectiva de lectura en **Discos Magnéticos** (Seek time, rotación y transferencia).
   - Deducción analítica paso a paso en potencias de 2.
4. **Modo Simulacro Real de Examen Rivera:**
   - 5 preguntas combinadas (3 teóricas + 2 cálculos numéricos).
   - Cuenta regresiva de 60 minutos.
   - Calificación estricta sobre 100 puntos (**se aprueba con 60 puntos**, según reglamento de cátedra).
5. **Cheat-Sheet de Bolsillo:**
   - Fórmulas maestras de cálculo, tabla comparativa de asignaciones en disco y diagramas ASCII de las 4 capas de E/S y Nodos-I.
6. **PWA 100% Offline e Instalable:**
   - Funciona sin internet mediante Service Worker (`sw.js`).
   - Se puede instalar como App nativa en iOS y Android ("Agregar a pantalla de inicio").

---

## 📂 Arquitectura Modular

```
simulador-siso-ucasal/
├── index.html                    # Shell semántico ultraliviano
├── manifest.json                 # Web App Manifest PWA
├── sw.js                         # Service Worker con caché offline
├── assets/
│   ├── css/
│   │   ├── main.css              # Reset, variables y tipografía
│   │   ├── components.css        # Botones, chips, navbar, modales
│   │   └── modes.css             # Estilos específicos de cada modo
│   └── icons/
│       ├── icon.svg
│       ├── icon-192.png
│       └── icon-512.png
└── src/
    ├── main.js                   # Bootstrap y registro de Service Worker
    ├── app.js                    # Orquestador de vistas y modales
    ├── core/
    │   ├── state.js              # Store de estado reactivo
    │   ├── storage.js            # Persistencia en localStorage
    │   ├── timer.js              # Temporizador de examen
    │   └── evaluator.js          # Motor de evaluación semántica offline + IA
    ├── data/
    │   ├── questions-choice.js   # Banco múltiple choice con trampas
    │   ├── questions-open.js     # Preguntas de desarrollo y rúbricas
    │   ├── problems-generator.js # Generador dinámico de cálculos
    │   └── cheatsheet-data.js    # Fórmulas y diagramas
    └── components/
        ├── navbar.js
        ├── choice-view.js
        ├── open-view.js
        ├── generator-view.js
        ├── exam-view.js
        └── cheatsheet-view.js
```

---

## 🌐 Despliegue en GitHub Pages

Alojado en GitHub: `https://github.com/azaeldahaka/simulador-siso-ucasal`  
Acceso web directo: `https://azaeldahaka.github.io/simulador-siso-ucasal/`
