/**
 * Generador Dinámico de Problemas Cuantitativos de Parcial (SISO - UCASAL)
 * Genera ejercicios numéricos con números aleatorios y desarrollo analítico paso a paso.
 */

// Helper para seleccionar aleatoriamente de un array
function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const problemsGenerator = {
  /**
   * Genera problema de capacidad máxima en sistemas FAT
   */
  generateFatProblem() {
    const fatTypes = [
      { name: "FAT-12", bits: 12, entries: 4096 },
      { name: "FAT-16", bits: 16, entries: 65536 },
      { name: "FAT-32", bits: 28, entries: 268435456 } // 28 bits efectivos
    ];
    const blockSizes = [
      { label: "1 KB", bytes: 1024, kb: 1 },
      { label: "2 KB", bytes: 2048, kb: 2 },
      { label: "4 KB", bytes: 4096, kb: 4 },
      { label: "8 KB", bytes: 8192, kb: 8 },
      { label: "16 KB", bytes: 16384, kb: 16 },
      { label: "32 KB", bytes: 32768, kb: 32 }
    ];

    const fat = sample(fatTypes);
    const block = sample(blockSizes);

    const totalKB = fat.entries * block.kb;
    let capacityLabel = "";
    let capacityValueMB = totalKB / 1024;

    if (totalKB >= 1024 * 1024) {
      capacityLabel = `${(totalKB / (1024 * 1024)).toFixed(0)} GB`;
    } else {
      capacityLabel = `${capacityValueMB.toFixed(0)} MB`;
    }

    return {
      id: `fat-${Date.now()}`,
      category: "FAT",
      title: `Capacidad Máxima en ${fat.name}`,
      statement: `En un sistema ${fat.name} con bloques de asignación (clusters) de ${block.label}, ¿cuál es el tamaño máximo teórico de disco o partición que se puede administrar? Justifique con potencias de 2.`,
      targetField: "Capacidad Máxima en MB",
      expectedValue: capacityValueMB,
      unit: "MB",
      tolerance: 0.05,
      steps: [
        `Paso 1: Identificar número de entradas direccionables. En ${fat.name}, el ancho de entrada es de ${fat.bits} bits. Cantidad de entradas = 2^${fat.bits} = ${fat.entries.toLocaleString('es-AR')} bloques.`,
        `Paso 2: Multiplicar por el tamaño de bloque. Capacidad máxima = ${fat.entries.toLocaleString('es-AR')} bloques * ${block.label} = ${totalKB.toLocaleString('es-AR')} KB.`,
        `Paso 3: Conversión de unidades. Capacidad = ${totalKB.toLocaleString('es-AR')} KB / 1024 = ${capacityLabel}.`,
        `Justificación: El límite no lo define el medio físico sino el ancho de la entrada en la FAT. Al disponer solo de ${fat.bits} bits, no es posible numerar más de 2^${fat.bits} bloques independientes.`
      ]
    };
  },

  /**
   * Genera problema de administración con Mapas de Bits
   */
  generateBitmapProblem() {
    const diskSizes = [
      { label: "128 GB", gb: 128 },
      { label: "256 GB", gb: 256 },
      { label: "512 GB", gb: 512 },
      { label: "1 TB", gb: 1024 }
    ];
    const blockSizes = [
      { label: "2 KB", kb: 2, bytes: 2048 },
      { label: "4 KB", kb: 4, bytes: 4096 },
      { label: "8 KB", kb: 8, bytes: 8192 }
    ];

    const disk = sample(diskSizes);
    const block = sample(blockSizes);

    // 1 bit por bloque de disco
    const bitsPerBitmapBlock = block.bytes * 8;
    const totalBlocksDisk = (disk.gb * 1024 * 1024) / block.kb;
    const bitmapBlocksNeeded = Math.ceil(totalBlocksDisk / bitsPerBitmapBlock);
    const bitmapSpaceMB = (bitmapBlocksNeeded * block.kb) / 1024;

    return {
      id: `bmp-${Date.now()}`,
      category: "Mapa de Bits",
      title: `Mapa de Bits: Disco de ${disk.label} con bloques de ${block.label}`,
      statement: `Se tiene un disco de ${disk.label} con bloques de ${block.label} y se administra el espacio libre/ocupado con mapas de bits.\n1) ¿De cuántos bloques de disco se lleva registro en UN solo bloque de mapa?\n2) ¿Cuántos bloques de mapa se necesitan para registrar todo el disco?`,
      targetField: "Bloques de mapa de bits necesarios",
      expectedValue: bitmapBlocksNeeded,
      unit: "bloques",
      tolerance: 0.01,
      extraInfo: `En 1 bloque entran ${bitsPerBitmapBlock.toLocaleString('es-AR')} bloques de disco.`,
      steps: [
        `Paso 1: Capacidad de registro por bloque de mapa. Tamaño de 1 bloque = ${block.bytes.toLocaleString('es-AR')} Bytes. Como cada bloque de disco se representa con 1 bit (0=libre, 1=ocupado): Bits por bloque = ${block.bytes} Bytes * 8 bits/Byte = ${bitsPerBitmapBlock.toLocaleString('es-AR')} bits (registra ${bitsPerBitmapBlock.toLocaleString('es-AR')} bloques).`,
        `Paso 2: Calcular el total de bloques del disco. Capacidad = ${disk.label} = ${disk.gb} * 1024 * 1024 KB = ${(disk.gb * 1024 * 1024).toLocaleString('es-AR')} KB. Total de bloques = ${(disk.gb * 1024 * 1024).toLocaleString('es-AR')} / ${block.kb} = ${totalBlocksDisk.toLocaleString('es-AR')} bloques.`,
        `Paso 3: Bloques de mapa de bits necesarios. Bloques de mapa = ${totalBlocksDisk.toLocaleString('es-AR')} / ${bitsPerBitmapBlock.toLocaleString('es-AR')} = ${bitmapBlocksNeeded.toLocaleString('es-AR')} bloques de mapa.`,
        `Espacio total consumido por el mapa de bits: ${bitmapBlocksNeeded.toLocaleString('es-AR')} * ${block.kb} KB = ${bitmapSpaceMB.toFixed(2)} MB.`
      ]
    };
  },

  /**
   * Genera problema de Tiempos y Velocidad de Lectura en Disco Magnético
   */
  generateDiskSpeedProblem() {
    const rpmOptions = [
      { rpm: 9000, rotMs: 6.66 },
      { rpm: 7200, rotMs: 8.33 },
      { rpm: 10000, rotMs: 6.00 },
      { rpm: 15000, rotMs: 4.00 }
    ];
    const seekOptions = [3.5, 4.0, 4.5, 5.0, 6.0];
    const trackSizes = [
      { label: "1 MB", kb: 1024 },
      { label: "2 MB", kb: 2048 }
    ];
    const blockSizes = [
      { label: "256 KB", kb: 256 },
      { label: "512 KB", kb: 512 },
      { label: "1024 KB", kb: 1024 }
    ];

    const disk = sample(rpmOptions);
    const seek = sample(seekOptions);
    const track = sample(trackSizes);
    const block = sample(blockSizes);

    // Cálculos
    const fraction = block.kb / track.kb;
    const tTrans = disk.rotMs * fraction;
    const tRot = disk.rotMs / 2; // promedio media rotación
    const tTotal = seek + tRot + tTrans;
    const speedMBS = (block.kb / 1024) / (tTotal / 1000);

    return {
      id: `disk-${Date.now()}`,
      category: "Rendimiento de Disco",
      title: `Velocidad de Lectura: Disco ${disk.rpm} RPM`,
      statement: `Si el tiempo de rotación completa de un disco es de ${disk.rotMs} ms (aprox. ${disk.rpm} RPM), el tiempo de búsqueda promedio es de ${seek} ms, y la pista es de ${track.label}. ¿Cuál es la velocidad efectiva de lectura en MB/s si los bloques son de ${block.label}? Justifique considerando tiempo de acceso aleatorio.`,
      targetField: "Velocidad Efectiva (MB/s)",
      expectedValue: Number(speedMBS.toFixed(2)),
      unit: "MB/s",
      tolerance: 0.08,
      steps: [
        `Paso 1: Fracción de pista y Tiempo de Transferencia (T_trans). El bloque de ${block.label} ocupa ${block.kb} KB / ${track.kb} KB = ${fraction.toFixed(2)} de la pista. T_trans = ${disk.rotMs} ms * ${fraction.toFixed(2)} = ${tTrans.toFixed(2)} ms.`,
        `Paso 2: Latencia Rotacional Promedio (T_rot). En promedio el inicio del bloque tarda media rotación en llegar bajo la cabeza: T_rot = ${disk.rotMs} ms / 2 = ${tRot.toFixed(2)} ms.`,
        `Paso 3: Tiempo Total de Acceso Aleatorio (T_total). T_total = T_seek + T_rot + T_trans = ${seek} ms + ${tRot.toFixed(2)} ms + ${tTrans.toFixed(2)} ms = ${tTotal.toFixed(2)} ms (${(tTotal / 1000).toFixed(5)} s).`,
        `Paso 4: Velocidad Efectiva de Lectura. V = Datos / T_total = ${(block.kb / 1024).toFixed(2)} MB / ${(tTotal / 1000).toFixed(5)} s = ${speedMBS.toFixed(2)} MB/s.`,
        `Nota de cátedra: Si el cabezal ya estuviera posicionado en el bloque (tasa de transferencia interna de la pista sin seek ni latencia): Tasa de Pista = ${track.label} / ${disk.rotMs} ms = ${(1000 / disk.rotMs).toFixed(2)} MB/s.`
      ]
    };
  },

  /**
   * Genera un problema aleatorio de cualquiera de los tipos
   */
  generateRandom() {
    const generators = [
      () => this.generateFatProblem(),
      () => this.generateBitmapProblem(),
      () => this.generateDiskSpeedProblem()
    ];
    return sample(generators)();
  }
};
