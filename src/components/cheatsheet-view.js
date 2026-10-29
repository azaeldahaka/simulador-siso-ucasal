/**
 * Componente: Cheat-Sheet de Bolsillo & Formulario Maestro Cuantitativo
 * Optimizado para pantallas anchas de PC y dispositivos móviles
 */
import { cheatSheetData } from "../data/cheatsheet-data.js";

export function renderCheatsheetView(container) {
  container.innerHTML = `
    <div class="view-wrapper cheatsheet-container">
      
      <!-- Encabezado de Sección -->
      <div class="cheatsheet-header">
        <h2 class="section-heading">⚡ Formulario Maestro Cuantitativo • Sistemas Operativos</h2>
        <p class="section-subtext">Fórmulas exactas, deducciones analíticas y estructuras de datos para el 2do parcial (Rivera).</p>
      </div>

      <!-- Cuadrícula Multicolumna de Fórmulas -->
      <div class="formulas-grid">
        ${cheatSheetData.formulas.map(f => `
          <div class="formula-card">
            <div class="formula-card-top">
              <h3 class="formula-title">${f.title}</h3>
              <span class="badge badge-unit">Examen</span>
            </div>
            <div class="formula-code-wrap">
              <code class="formula-code">${f.formula}</code>
            </div>
            <p class="formula-details">${f.details}</p>
            <div class="formula-example">
              <strong>Caso de aplicación:</strong> ${f.example}
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Tabla Comparativa de Asignación en Disco -->
      <div class="quiz-card cheatsheet-table-card">
        <div class="table-header-row">
          <h2 class="section-heading">📊 Comparativa: Métodos de Asignación en Disco (Tanenbaum Cap. 4)</h2>
          <span class="badge badge-source">Pregunta Clásica de Parcial</span>
        </div>
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
                  <td class="feature-col"><strong>${row.feature}</strong></td>
                  <td>${row.contigua}</td>
                  <td>${row.enlazada}</td>
                  <td>${row.fat}</td>
                  <td class="highlight-col">${row.inodo}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Diagramas de Arquitectura de Sistemas Operativos en Formato Terminal -->
      <div class="diagrams-grid">
        <div class="quiz-card terminal-card">
          <div class="terminal-bar">
            <div class="terminal-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <span class="terminal-title">bash • Capas de Software de E/S (Tanenbaum)</span>
          </div>
          <pre class="ascii-diagram">${cheatSheetData.layersDiagram}</pre>
        </div>

        <div class="quiz-card terminal-card">
          <div class="terminal-bar">
            <div class="terminal-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <span class="terminal-title">bash • Arquitectura del Nodo-I (Unix Inode)</span>
          </div>
          <pre class="ascii-diagram">${cheatSheetData.inodeDiagram}</pre>
        </div>
      </div>

    </div>
  `;
}
