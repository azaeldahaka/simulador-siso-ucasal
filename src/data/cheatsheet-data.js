/**
 * Datos y Fórmulas del Cheat-Sheet de Bolsillo
 * Sistemas Operativos (SISO) - 2do Parcial - UCASAL
 */

export const cheatSheetData = {
  formulas: [
    {
      title: "Capacidad Máxima FAT",
      formula: "Capacidad_Max = (2 ^ bits) * Tamaño_Bloque",
      details: "FAT-12: 2^12 = 4.096 bloques | FAT-16: 2^16 = 65.536 bloques | FAT-32: 2^28 = 268.435.456 bloques.",
      example: "FAT-16 con bloques de 2 KB -> 65.536 * 2 KB = 131.072 KB = 128 MB."
    },
    {
      title: "Mapas de Bits (Capacidad por Bloque)",
      formula: "Bloques_Registrados_Por_Bloque = Tamaño_Bloque_Bytes * 8 bits/Byte",
      details: "Cada bloque de disco se representa con 1 bit (0=libre, 1=ocupado).",
      example: "Bloque de 2 KB = 2.048 B * 8 = 16.384 bloques registrados en 1 bloque de mapa."
    },
    {
      title: "Mapas de Bits (Bloques de Mapa Requeridos)",
      formula: "Bloques_Mapa = ceil( Total_Bloques_Disco / Bloques_Registrados_Por_Bloque )",
      details: "Total_Bloques_Disco = Capacidad_Disco / Tamaño_Bloque.",
      example: "Disco 256 GB, bloques 2 KB -> 134.217.728 / 16.384 = 8.192 bloques de mapa (16 MB)."
    },
    {
      title: "Tiempo Total de Acceso a Disco",
      formula: "T_total = T_seek + (T_rotacion / 2) + T_trans",
      details: "T_trans = T_rotacion * (Tamaño_Bloque / Capacidad_Pista). Latencia media = T_rot / 2.",
      example: "T_rot=6.66ms, Seek=4ms, Pista=1MB, Bloque=512KB -> T_trans=3.33ms, T_rot=3.33ms -> T_total=10.66ms."
    },
    {
      title: "Velocidad Efectiva de Lectura de Disco",
      formula: "V_efectiva = Tamaño_Bloque / T_total",
      details: "Considera tiempo mecánico completo de acceso aleatorio.",
      example: "512 KB / 10.66 ms = 0.5 MB / 0.01066 s = 46.90 MB/s."
    }
  ],

  layersDiagram: `
+--------------------------------------------------------------------+
| 4. Software de E/S de Espacio de Usuario                           |
|    - Funciones de biblioteca (printf, fread, fwrite).              |
|    - Demonios de spooling (impresión lpd, cola de correo).         |
+--------------------------------------------------------------------+
                                  | Llamadas al sistema (open, read, write)
                                  v
+--------------------------------------------------------------------+
| 3. Software de E/S Independiente del Dispositivo                   |
|    - Nomenclatura uniforme (/dev/...).                             |
|    - Protección de dispositivos y permisos.                        |
|    - Buffering (almacenamiento intermedio en memoria del kernel).   |
|    - Tamaño de bloque uniforme y reporte uniforme de errores.      |
+--------------------------------------------------------------------+
                                  | Funciones estándar del driver
                                  v
+--------------------------------------------------------------------+
| 2. Manejadores de Dispositivos (Device Drivers)                    |
|    - Código específico y dependiente del modelo exacto de hardware.|
|    - Escribe comandos en los registros del controlador.            |
|    - Se bloquea esperando la finalización de la operación.         |
+--------------------------------------------------------------------+
                                  | Configura hardware / Despertar
                                  v
+--------------------------------------------------------------------+
| 1. Manejadores de Interrupciones (Interrupt Handlers)              |
|    - Nivel más bajo de software. Se dispara con la IRQ física.     |
|    - Salva registros de CPU, limpia la interrupción en el PIC.     |
|    - Despierta al Device Driver correspondiente (semáforo/signal). |
+--------------------------------------------------------------------+
                                  |
                                  v
+--------------------------------------------------------------------+
| Hardware: Periféricos Físicos y Controladores Electrónicos         |
+--------------------------------------------------------------------+
`,

  inodeDiagram: `
+-------------------------------------------------------+
| NODO-I DEL ARCHIVO                                    |
| [Atributos: Tamaño, Permisos, UID, GID, Timestamps]   |
+-------------------------------------------------------+
| Puntero Directo 0  -------------------------------------> [ Bloque Datos 0 ]
| Puntero Directo 1  -------------------------------------> [ Bloque Datos 1 ]
| ...                                                   |   ...
| Puntero Directo 9  -------------------------------------> [ Bloque Datos 9 ]
+-------------------------------------------------------+
| Puntero Indirecto Simple -----------------------------+
+-------------------------------------------------------+
| Puntero Indirecto Doble  -----------------------------+
+-------------------------------------------------------+
| Puntero Indirecto Triple -----------------------------+
+-------------------------------------------------------+
                              |
                              v
             +----------------------------------+
             | BLOQUE DE ÍNDICES INDIRECTO      |
             +----------------------------------+
             | Entrada 0  -------------------------> [ Bloque Datos 10 ]
             | Entrada 1  -------------------------> [ Bloque Datos 11 ]
             | ...                              |   ...
             | Entrada N  -------------------------> [ Bloque Datos N+10 ]
             +----------------------------------+
`,

  comparisonTable: [
    {
      feature: "Estructura de Punteros",
      contigua: "Solo inicio y longitud",
      enlazada: "Puntero dentro del bloque",
      fat: "Tabla indexada en memoria RAM",
      inodo: "Inodo individual con punteros directos/indirectos"
    },
    {
      feature: "Acceso Aleatorio",
      contigua: "Ultrarrápido (O(1))",
      enlazada: "Pésimo (O(N) lecturas de disco)",
      fat: "Rápido (O(N) pero en RAM)",
      inodo: "Muy rápido (O(1) para bloques directos)"
    },
    {
      feature: "Uso de Memoria RAM",
      contigua: "Mínimo",
      enlazada: "Mínimo",
      fat: "Crítico (toda la tabla en RAM)",
      inodo: "Óptimo (solo inodos de archivos abiertos)"
    },
    {
      feature: "Problema Principal",
      contigua: "Fragmentación externa grave",
      enlazada: "Pérdida de potencia de 2",
      fat: "No escala a discos grandes",
      inodo: "Agotamiento de inodos si se crean archivos enanos"
    }
  ]
};
