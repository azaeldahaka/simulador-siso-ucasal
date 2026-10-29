/**
 * Componente: Cheat-Sheet de Bolsillo (Fórmulas, Tablas y Arquitectura)
 */
import { cheatSheetData } from "../data/cheatsheet-data.js";

export function renderCheatsheetView(container) {
  container.innerHTML = `
    <div class="view-wrapper">
      <div class="quiz-card">
        <h2 class="section-heading">⚡ Formulario Maestro Cuantitativo</h2>
        <div class="formulas-grid">
          ${cheatSheetData.formulas.map(f => `
            <div class="formula-card">
              <h3 class="formula-title">${f.title}</h3>
              <code class="formula-code">${f.formula}</code>
              <p class="formula-details">${f.details}</p>
              <div class="formula-example">
                <strong>Ejemplo de examen:</strong> ${f.example}
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="quiz-card">
        <h2 class="section-heading">📊 Comparativa: Métodos de Asignación en Disco</h2>
        <div class="table-responsive">
          <table class="cheat-table">
            <thead>
              <tr>
                <th>Característica</th>
                <th>Asig. Contigua</th>
                <th>Lista Enlazada</th>
                <th>FAT (MS-DOS)</th>
                <th>Nodos-I (Unix/Linux)</th>
              </tr>
            </thead>
            <tbody>
              ${cheatSheetData.comparisonTable.map(row => `
                <tr>
                  <td><strong>${row.feature}</strong></td>
                  <td>${row.contigua}</td>
                  <td>${row.enlazada}</td>
                  <td>${row.fat}</td>
                  <td>${row.inodo}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="quiz-card">
        <h2 class="section-heading">🧱 Las 4 Capas de Software de E/S (Tanenbaum)</h2>
        <pre class="ascii-diagram">${cheatSheetData.layersDiagram}</pre>
      </div>

      <div class="quiz-card">
        <h2 class="section-heading">🧬 Estructura del Nodo-I de Unix (Inodo)</h2>
        <pre class="ascii-diagram">${cheatSheetData.inodeDiagram}</pre>
      </div>
    </div>
  `;
}
