/**
 * Banco de Preguntas Abiertas de Desarrollo (Active Recall & Examen)
 * Sistemas Operativos (SISO) - 2do Parcial - UCASAL
 * Incluye todos los modelos reales (2024, 2025 Tema B, 2025 Recu, Final 2026) y arquetipos de cátedra.
 */

export const openQuestions = [
  {
    id: "open-01",
    unit: 4,
    source: "2do Parcial 2024 (P1)",
    title: "Tipos de Archivos Regulares y Diferencias",
    prompt: "¿Qué tipos de archivos regulares existen? ¿Cuál es la diferencia de esos dos tipos de archivos? Dé dos ejemplos reales de cada uno de los tipos de archivos regulares.",
    requiredKeywords: [
      "ascii",
      "binario",
      "texto",
      "lineas",
      "estructura",
      "ejemplos"
    ],
    sampleAnswer: "Existen dos tipos de archivos regulares: ASCII (texto plano) y Binarios.\n\nDiferencia: Los archivos ASCII son secuencias de líneas de texto legibles, delimitadas por caracteres de salto de línea (\\n o \\r\\n). Son transportables y editables con cualquier editor de texto sin formato. Los archivos binarios son secuencias de bytes con una estructura interna rígida y especializada (headers, código compilado, compresión); no son legibles como texto plano y requieren programas específicos para su interpretación.\n\nEjemplos reales:\n- ASCII: 1) Código fuente en C (main.c), 2) Archivo de configuración (/etc/fstab o config.txt).\n- Binario: 1) Ejecutables compilados (/bin/ls o programa.exe), 2) Imágenes comprimidas (foto.png o documento.pdf).",
    criterioExamen: "El profesor Rivera exige nombrar explícitamente ASCII y Binario, explicar la estructura interna vs líneas de texto plano, y dar 2 ejemplos reales precisos de cada categoría."
  },
  {
    id: "open-02",
    unit: 4,
    source: "2do Parcial 2024 (P2) / Recu 2025",
    title: "Nodos-I: Definición, Uso, Desventajas y Estructura",
    prompt: "¿Qué son los nodos-i? ¿Para qué se utilizan? ¿En qué sistemas operativos se utilizan? Indique si tienen alguna desventaja y explíquela. Grafique o describa la estructura de un archivo de 50 bloques con inodos de 10 punteros.",
    requiredKeywords: [
      "metadatos",
      "atributos",
      "punteros",
      "unix",
      "linux",
      "desventaja",
      "indirecto"
    ],
    sampleAnswer: "Definición y utilidad: Un nodo-i (index-node) es una estructura de datos de tamaño fijo que almacena los atributos y metadatos de un archivo (permisos, dueño, tamaño, timestamps) y los punteros directos e indirectos a sus bloques de datos en disco. Se utiliza para desacoplar el archivo de su nombre y permitir acceso rápido a los bloques sin cargar toda la tabla del disco en RAM (solo se carga el inodo del archivo abierto).\n\nSistemas operativos: Familia UNIX, Linux, BSD, macOS (sistemas ext2/3/4, UFS).\n\nDesventajas:\n1. Agotamiento de inodos: La cantidad de inodos se fija al formatear (mkfs). Si se crean millones de archivos pequeños, se agotan los inodos antes que el espacio físico (error 'No space left on device').\n2. Sobrecarga en archivos diminutos: Un archivo de 1 byte consume un inodo completo (128-256 bytes).\n3. Lecturas adicionales: Archivos colosales requieren recorrer punteros indirectos dobles/triples agregando seeks.\n\nEstructura de 50 bloques (inodo con 10 punteros directos):\n- Punteros directos 0 al 9: apuntan a los bloques de datos 0 al 9.\n- Puntero indirecto simple: apunta a un bloque intermedio de índices que almacena los punteros hacia los 40 bloques restantes (bloques 10 al 49).",
    criterioExamen: "Imprescindible detallar que la cantidad de inodos es estática (definida en mkfs) y explicar el direccionamiento de los 50 bloques usando los 10 directos más el indirecto simple."
  },
  {
    id: "open-03",
    unit: 4,
    source: "2do Parcial 2024 (P3)",
    title: "Sistemas de Archivos Virtuales (VFS)",
    prompt: "¿Para qué se utilizan los Sistemas de Archivos Virtuales? Dé un ejemplo de sistemas de archivos real que lo utilicen.",
    requiredKeywords: [
      "vfs",
      "abstraccion",
      "posix",
      "interfaz",
      "linux",
      "ext4"
    ],
    sampleAnswer: "El Sistema de Archivos Virtual (VFS) es una capa de abstracción en el kernel que proporciona una interfaz y llamadas al sistema uniformes y universales (POSIX: open, read, write, close) para los programas de usuario, ocultando las diferencias estructurales de los distintos sistemas de archivos montados concurrentemente.\n\nEl kernel de Linux utiliza VFS para permitir que comandos como 'cp' interactúen de forma totalmente transparente y homogénea entre una partición nativa ext4, un pendrive formateado en FAT32, un disco de red NFS o el sistema virtual /proc.",
    criterioExamen: "Rivera busca que expliques la abstracción que desacopla la API de usuario de las implementaciones heterogéneas, dando el ejemplo concreto de Linux con ext4, FAT o NFS."
  },
  {
    id: "open-04",
    unit: 4,
    source: "2do Parcial 2025 Tema B (P1)",
    title: "Problemas de Listas Enlazadas y Solución en Unix/Linux",
    prompt: "¿Cómo se soluciona en Linux y Unix los problemas de asignar bloques con listas enlazadas? ¿Cuáles son dichos problemas? Explique brevemente la técnica utilizada por Linux y Unix.",
    requiredKeywords: [
      "acceso aleatorio",
      "potencia de dos",
      "punteros",
      "nodos-i",
      "directos"
    ],
    sampleAnswer: "Problemas de la lista enlazada simple:\n1. Acceso aleatorio extremadamente lento: Para leer el bloque K se deben leer secuencialmente los K-1 bloques previos en disco (complejidad O(N)).\n2. Tamaño útil de bloque no es potencia de dos: Si el bloque mide 1024 bytes y se reservan 4 para el puntero al siguiente bloque, quedan 1020 bytes útiles, degradando las transferencias en memoria.\n\nSolución en Linux/Unix (Nodos-I):\nEliminan los punteros de los bloques de datos y centralizan los metadatos y punteros en el nodo-i del archivo. Los bloques de datos vuelven a ser potencias de dos exactas (100% datos). El acceso aleatorio a los primeros bloques es O(1) directo a través de los punteros del inodo. Además, no se consume la memoria RAM cargando toda la tabla como en la FAT: solo reside en RAM el inodo de los archivos abiertos.",
    criterioExamen: "Resaltar los dos problemas clave (lentitud de acceso aleatorio y pérdida de potencia de dos en datos útiles) y contrastar la solución de inodos contra listas y FAT."
  },
  {
    id: "open-05",
    unit: 4,
    source: "2do Parcial 2025 Tema B (P3)",
    title: "Resolución de Rutas Paso a Paso con Nodos-I",
    prompt: "Si se administran los bloques de archivos por medio de nodos-i. ¿Cuáles son los pasos para leer el archivo '/users/pages.app/parcialSO.pages'? Considere la búsqueda de nodos-i y bloques de toda la ruta. Invente números para ejemplificar.",
    requiredKeywords: [
      "raiz",
      "inodo",
      "bloque",
      "users",
      "pages.app",
      "parcialso.pages"
    ],
    sampleAnswer: "Pasos paso a paso:\n1. Acceso a Raíz (/): El kernel lee el nodo-i de la raíz (Inodo 2 fijo por convención). Lee su bloque de datos (ej. Bloque 100) que contiene los pares 'nombre | nro inodo'.\n2. Búsqueda de 'users': Escanea el bloque 100 hasta hallar 'users' y obtiene su Inodo (ej. Inodo 35).\n3. Lectura de 'users': Lee el Inodo 35. Accede a su bloque de datos (ej. Bloque 210) y busca la entrada 'pages.app', obteniendo su Inodo (ej. Inodo 82).\n4. Lectura de 'pages.app': Lee el Inodo 82. Accede a su bloque de datos (ej. Bloque 430) y busca la entrada 'parcialSO.pages', obteniendo su Inodo (ej. Inodo 120).\n5. Lectura del archivo final: Carga el Inodo 120 en RAM, verifica permisos del usuario y accede a los datos a través de sus punteros directos (ej. Bloques 700 y 701) para enviarlos al buffer del proceso.",
    criterioExamen: "Debe quedar claro el patrón alternado: Inodo -> Bloque de directorio -> Nombre -> Siguiente Inodo -> Siguiente Bloque... hasta llegar a los bloques de datos del archivo."
  },
  {
    id: "open-06",
    unit: 4,
    source: "2do Recu 2025 (P3)",
    title: "Sistemas de Archivos por Bitácora (Journaling)",
    prompt: "¿Qué es el sistema de bitácora? ¿Por qué no es eficiente usarla? Dé una desventaja técnica.",
    requiredKeywords: [
      "bitacora",
      "journal",
      "consistencia",
      "transaccion",
      "doble escritura",
      "overhead"
    ],
    sampleAnswer: "Definición: Un sistema de archivos por bitácora (Journaling, ej: ext3/ext4, NTFS) registra todas las modificaciones planeadas sobre metadatos y datos como transacciones atómicas en un log circular (journal) antes de aplicarlas definitivamente a las estructuras reales del disco. Su meta es garantizar la consistencia inmediata ante caídas imprevistas de energía, evitando un fsck de horas al reiniciar.\n\nPor qué no es eficiente / Desventaja:\nProduce una sobrecarga de doble escritura (overhead de I/O): la misma información debe escribirse dos veces en disco (primero en el journal y luego en su ubicación final), reduciendo el ancho de banda efectivo de escritura del almacenamiento. Además, añade latencia por las operaciones constantes de sincronización (flush) de transacciones.",
    criterioExamen: "Explicar el concepto de transacción previa y remarcar con claridad el costo de la doble escritura."
  },
  {
    id: "open-07",
    unit: 4,
    source: "2do Recu 2025 (P5) / Final 2026",
    title: "Representación Abstracta de un Archivo",
    prompt: "¿Cómo se puede representar de forma abstracta un archivo? Explique las 3 formas y dé ejemplos.",
    requiredKeywords: [
      "bytes",
      "registros",
      "arbol",
      "clave",
      "unix"
    ],
    sampleAnswer: "Según Tanenbaum existen 3 formas abstractas de estructurar un archivo:\n1. Secuencia de bytes no estructurada (Estándar moderno en Unix, Linux y Windows): El archivo es una secuencia plana de N bytes. El SO no interpreta el formato; la estructura la define el programa de usuario. Ejemplos: ejecutables ELF, imágenes PNG, scripts.\n2. Secuencia de registros de longitud fija: El archivo se compone de registros secuenciales de tamaño fijo. Las lecturas y escrituras operan por registro completo. Ejemplos: archivos de tarjetas perforadas en mainframes y sistemas CP/M.\n3. Árbol de registros con claves: Registros de longitud variable ordenados jerárquicamente en un árbol por un campo clave en posición fija, permitiendo búsquedas rápidas. Ejemplos: sistemas de procesamiento comercial y bases de datos clásicas (ISAM).",
    criterioExamen: "Mencionar obligatoriamente: 1) Bytes no estructurados, 2) Secuencia de registros fijos, 3) Árbol de registros indexados por clave."
  },
  {
    id: "open-08",
    unit: 5,
    source: "2do Parcial 2024 (P5)",
    title: "Vector de Interrupciones e Intervalos de Memoria",
    prompt: "Explique para qué se utilizan y cómo funcionan el vector de interrupciones y el/los intervalo/s de memoria asociados a un dispositivo de Entrada/Salida.",
    requiredKeywords: [
      "vector de interrupciones",
      "irq",
      "isr",
      "memoria",
      "controlador",
      "registros"
    ],
    sampleAnswer: "Vector de Interrupciones:\nEs una tabla fija en memoria física baja que almacena las direcciones de inicio de las Rutinas de Servicio de Interrupción (ISR) de los controladores. Cuando el hardware termina una operación, activa la línea IRQ. El chip controlador de interrupciones coloca el número de interrupción en el bus. La CPU suspende la tarea actual, guarda PC y PSW en la pila, consulta la tabla con ese índice numérico y transfiere la ejecución a la dirección de la ISR correspondiente.\n\nIntervalos de Memoria Asociados:\nCorresponden a los rangos de direcciones físicas asignados a los registros de control, estado y buffers de la controladora del dispositivo bajo el esquema de E/S Mapeada en Memoria (Memory-Mapped I/O). Permiten que la CPU se comunique con el hardware leyendo y escribiendo con instrucciones normales de memoria (mov, load, store) sin necesidad de instrucciones especiales de E/S.",
    criterioExamen: "Diferenciar con claridad el vector de interrupciones (punteros a ISRs) de los rangos de memoria mapeada del controlador (registros de hardware)."
  },
  {
    id: "open-09",
    unit: 5,
    source: "2do Parcial 2025 Tema B (P4)",
    title: "Los 4 Niveles de Software de E/S (Tanenbaum)",
    prompt: "Explique en un gráfico o esquema jerárquico los niveles de software de E/S y la comunicación entre los mismos según Tanenbaum.",
    requiredKeywords: [
      "manejador de interrupciones",
      "driver",
      "controlador de dispositivo",
      "independiente del dispositivo",
      "espacio de usuario",
      "buffering"
    ],
    sampleAnswer: "De arriba hacia abajo (nivel 4 al nivel 1):\n\n4. Software de E/S de Espacio de Usuario:\n- Bibliotecas estándar (stdio: printf, fread, fwrite).\n- Procesos de spooling (cola de impresión lpd).\n(Comunica con el nivel inferior mediante llamadas al sistema: open, read, write).\n\n3. Software de E/S Independiente del Dispositivo:\n- Nombres uniformes de dispositivos (/dev/...). Protecciones y permisos.\n- Gestión de buffers (buffering y caché), tamaño de bloques uniforme y reporte uniforme de errores.\n(Comunica con el nivel inferior invocando las funciones estándar del driver).\n\n2. Manejadores de Dispositivos (Device Drivers):\n- Código dependiente del hardware específico. Configura registros de la controladora y se bloquea esperando la respuesta del hardware.\n\n1. Manejadores de Interrupciones (Interrupt Handlers):\n- Nivel más bajo de software. Atiende la señal física IRQ, salva registros, limpia la interrupción y desbloquea (despierta) al Device Driver correspondiente.\n\nAbajo de todo: Hardware físico y controladores electrónicos.",
    criterioExamen: "Rivera evalúa que el esquema tenga exactamente los 4 niveles ordenados y que se entienda qué hace cada nivel (ej. buffering está en el independiente, desbloqueo en el manejador de interrupciones)."
  },
  {
    id: "open-10",
    unit: 5,
    source: "2do Recu 2025 (P1) / Arquetipo",
    title: "Acceso Directo a Memoria (DMA)",
    prompt: "¿Qué es Acceso Directo a Memoria (DMA) y ejemplificar? Explique la diferencia entre Robo de Ciclos y Modo Ráfaga.",
    requiredKeywords: [
      "dma",
      "controlador",
      "cpu",
      "bus",
      "robo de ciclos",
      "modo rafaga"
    ],
    sampleAnswer: "Definición: DMA es un procesador especializado (controlador) que transfiere bloques completos de datos directamente entre el controlador de un dispositivo y la memoria RAM a través del bus del sistema, liberando a la CPU de intervenir byte a byte (evitando la espera activa de E/S programada).\n\nEjemplo: La lectura de un archivo de 500 MB desde un disco o la recepción masiva de tramas de red a 10 Gbps.\n\nModos de funcionamiento:\n- Robo de Ciclos (Cycle Stealing): El DMA toma el bus del sistema solo por un ciclo de reloj, transfiere una palabra y lo libera. Si la CPU no usa el bus en ese ciclo, el robo es completamente transparente y no frena al procesador.\n- Modo Ráfaga (Burst Mode): El DMA toma control exclusivo del bus y transfiere el bloque completo de datos de manera continua. Es más veloz para transferencias masivas, pero bloquea el acceso de la CPU a la memoria mientras dura la ráfaga.",
    criterioExamen: "Explicar el alivio a la CPU, el ciclo de interrupción única al final y diferenciar con claridad robo de ciclos vs ráfaga."
  }
];
