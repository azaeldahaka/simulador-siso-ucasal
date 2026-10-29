/**
 * Banco de Preguntas Múltiple Choice con Trampas Conceptuales (Cazabobos)
 * Sistemas Operativos (SISO) - 2do Parcial - UCASAL
 * Cátedra: Prof. Ing. Fernando Lucas Rivera Bernsdorff
 */

export const choiceQuestions = [
  // --- UNIDAD 4: SISTEMAS DE ARCHIVOS ---
  {
    id: "mc-01",
    unit: 4,
    category: "Conceptos de Archivo",
    question: "¿Cuál es la diferencia fundamental entre un archivo regular ASCII y uno Binario a nivel de sistema operativo?",
    options: [
      "El archivo ASCII usa compresión nativa del kernel, mientras que el binario almacena texto sin comprimir.",
      "El archivo ASCII es una secuencia de líneas delimitadas por caracteres de salto de línea legibles directamente; el binario tiene una estructura interna rígida y especializada que requiere software específico.",
      "Los archivos binarios solo pueden residir en memoria RAM, mientras que los ASCII se graban en disco secundario.",
      "El sistema operativo interpreta el significado semántico del archivo ASCII, pero ignora los archivos binarios."
    ],
    correct: 1,
    trap: "Cuidado: el sistema operativo moderno (Unix/Windows) ve a ambos como secuencias de bytes y NO interpreta su significado semántico.",
    explanation: "Los archivos regulares ASCII están formados por líneas de texto terminadas en LF o CRLF legibles por cualquier editor estándar. Los binarios tienen una estructura interna de bytes fija (cabeceras, secciones ELF/PE, compresión) que solo interpreta la aplicación que los creó."
  },
  {
    id: "mc-02",
    unit: 4,
    category: "Asignación Contigua",
    question: "¿Cuál es el principal inconveniente de la asignación contigua de bloques en sistemas de archivos de propósito general?",
    options: [
      "Incapacidad de realizar lecturas secuenciales rápidas.",
      "Excesivo consumo de memoria RAM para almacenar la tabla de punteros.",
      "Fragmentación externa severa y la dificultad de permitir que los archivos crezcan dinámicamente sin reubicación.",
      "Obliga a que cada bloque de datos contenga un puntero de 4 bytes hacia el siguiente bloque."
    ],
    correct: 2,
    trap: "No confundir fragmentación externa (huecos entre archivos en asignación contigua) con fragmentación interna (espacio desperdiciado en el último bloque).",
    explanation: "La asignación contigua sufre de fragmentación externa a medida que se borran y crean archivos de diferentes tamaños, dejando huecos libres donde a veces no cabe un archivo nuevo. Además, si un archivo crece, debe reubicarse."
  },
  {
    id: "mc-03",
    unit: 4,
    category: "Lista Enlazada Simple",
    question: "En la asignación por lista enlazada simple sin índice (punteros dentro del bloque de datos), ¿cuál es un efecto secundario negativo directo?",
    options: [
      "El tamaño útil de datos en cada bloque deja de ser una potencia de dos exacta.",
      "El sistema de archivos no puede superar los 16 MB de capacidad teórica.",
      "Se requiere cargar toda la lista enlazada en la memoria RAM antes de poder abrir cualquier archivo.",
      "Se produce fragmentación externa severa en el disco magnético."
    ],
    correct: 0,
    trap: "Pensar que la lista simple usa RAM. La que reside en RAM es la FAT, no la lista simple con punteros en disco.",
    explanation: "Si el bloque mide 1024 bytes y los últimos 4 bytes se usan para la dirección del siguiente bloque, quedan 1020 bytes útiles. Esto rompe las transferencias óptimas de memoria basadas en potencias de 2 (512, 1024, 2048, 4096)."
  },
  {
    id: "mc-04",
    unit: 4,
    category: "FAT",
    question: "En una partición administrada con FAT-16 donde el tamaño de bloque es de 2 KB, ¿cuál es el tamaño máximo teórico de la partición?",
    options: [
      "64 MB",
      "128 MB",
      "2 GB",
      "4 GB"
    ],
    correct: 1,
    trap: "No confundir el límite histórico estándar de FAT-16 (2 GB con clusters de 32 KB) con el cálculo para un bloque específico de 2 KB.",
    explanation: "Con 16 bits hay 2^16 = 65.536 entradas. Si cada bloque mide 2 KB: 65.536 * 2 KB = 131.072 KB = 128 MB."
  },
  {
    id: "mc-05",
    unit: 4,
    category: "FAT",
    question: "¿Cuál es la desventaja crítica de la arquitectura FAT frente a los Nodos-I al escalar a discos de gran tamaño?",
    options: [
      "FAT no permite nombres largos de archivos bajo ninguna circunstancia.",
      "Toda la tabla FAT debe residir de forma permanente en la memoria principal (RAM) para operar eficientemente.",
      "FAT requiere que el disco sea de sólo lectura como los CD-ROMs.",
      "FAT no permite el acceso secuencial de bytes."
    ],
    correct: 1,
    trap: "La FAT no guarda punteros en el inodo, guarda todos los punteros del disco entero en una sola tabla que debe residir en RAM.",
    explanation: "A medida que los discos crecieron a decenas o cientos de gigabytes, una tabla FAT con millones de entradas consumiría una porción inaceptable de la memoria RAM del sistema."
  },
  {
    id: "mc-06",
    unit: 4,
    category: "Nodos-I",
    question: "¿Cómo soluciona el esquema de Nodos-I (Unix/Linux) el problema de consumo de memoria de la FAT?",
    options: [
      "Comprime los datos del usuario usando gzip en tiempo real antes de escribirlos.",
      "Solo carga en memoria RAM el nodo-i de aquellos archivos que están actualmente abiertos por algún proceso.",
      "Guarda las tablas de asignación en los registros internos del microprocesador.",
      "Elimina los bloques de disco y usa paginación virtual directa."
    ],
    correct: 1,
    trap: "No se carga toda la tabla de inodos del disco a RAM, solo los inodos de archivos abiertos.",
    explanation: "El nodo-i almacena los atributos y punteros de UN archivo individual. Si hay un millón de archivos pero solo 10 abiertos, únicamente se cargan en RAM esos 10 nodos-i, ahorrando enormes cantidades de memoria."
  },
  {
    id: "mc-07",
    unit: 4,
    category: "Nodos-I",
    question: "¿Qué consecuencia directa tiene el hecho de que la cantidad de nodos-i se defina de forma fija durante el formateo (`mkfs`)?",
    options: [
      "El tamaño de los bloques de datos debe ser obligatoriamente variable.",
      "Si se crean millones de archivos sumamente pequeños, se pueden agotar los nodos-i antes de llenar el espacio en disco, arrojando 'No space left on device'.",
      "No es posible utilizar punteros indirectos dobles o triples.",
      "Los archivos regulares binarios no pueden ser ejecutados."
    ],
    correct: 1,
    trap: "Muchos asumen que el disco solo se llena cuando se acaban los gigabytes. En Unix, si se acaban los inodos libres, el disco queda inutilizable aunque tenga el 90% libre.",
    explanation: "Cada archivo requiere un nodo-i. Si la tabla de inodos se agota por crear infinidad de archivos de pocos bytes, el kernel no puede crear ni un archivo más, arrojando error de espacio insuficiente con gigabytes libres."
  },
  {
    id: "mc-08",
    unit: 4,
    category: "Nodos-I",
    question: "Un archivo de 50 bloques se almacena en un sistema con nodos-i de 10 punteros directos. ¿Cómo se direccionan los 40 bloques restantes?",
    options: [
      "Mediante un segundo nodo-i encadenado al primero por un puntero doble.",
      "Mediante el puntero indirecto simple, el cual apunta a un bloque intermedio de índices que almacena las direcciones de los 40 bloques.",
      "No se pueden direccionar; el archivo queda truncado a 10 bloques.",
      "Se asignan de forma contigua en los bloques adyacentes al nodo-i."
    ],
    correct: 1,
    trap: "El inodo no se encadena con otro inodo: utiliza punteros a bloques de direcciones (indirección simple/doble/triple).",
    explanation: "Los primeros 10 bloques (0 a 9) van en los punteros directos del inodo. Los bloques 10 a 49 se direccionan usando el puntero indirecto simple hacia un bloque de índices de disco."
  },
  {
    id: "mc-09",
    unit: 4,
    category: "Mapas de Bits",
    question: "Si se tiene un disco de 512 GB con bloques de 8 KB administrados mediante mapa de bits, ¿cuántos bloques del disco se pueden registrar en UN solo bloque de mapa?",
    options: [
      "8.192 bloques",
      "16.384 bloques",
      "65.536 bloques",
      "131.072 bloques"
    ],
    correct: 2,
    trap: "Recordar multiplicar los bytes por 8 (porque 1 byte = 8 bits, y cada bloque de disco se representa con 1 bit).",
    explanation: "Un bloque de mapa de bits mide 8 KB = 8.192 Bytes. Como cada bit representa un bloque de disco: 8.192 Bytes * 8 bits/Byte = 65.536 bits = 65.536 bloques de disco registrados."
  },
  {
    id: "mc-10",
    unit: 4,
    category: "VFS",
    question: "¿Cuál es el propósito central del Sistema de Archivos Virtual (VFS) en el kernel de Linux?",
    options: [
      "Permitir la compresión automática de archivos en memorias Flash.",
      "Proveer una capa de abstracción con una interfaz uniforme (POSIX: open, read, write) que desacopla el software de usuario de las implementaciones particulares de cada sistema de archivos.",
      "Crear una copia de seguridad en memoria volátil de todo el disco rígido.",
      "Reemplazar a los manejadores de interrupciones de los dispositivos de red."
    ],
    correct: 1,
    trap: "VFS no es un sistema de archivos en disco (como ext4 o NTFS); es una capa interna del kernel en memoria RAM.",
    explanation: "VFS define estructuras comunes (superblock, inode, dentry, file) y tablas de funciones para que llamadas como read() funcionen idénticamente sobre ext4, NTFS, FAT32 o NFS de red."
  },
  {
    id: "mc-11",
    unit: 4,
    category: "Bitácora (Journaling)",
    question: "¿Por qué Tanenbaum y la cátedra señalan que los sistemas de archivos por bitácora (journaling) introducen una desventaja de rendimiento/eficiencia?",
    options: [
      "Porque obligan a formatear el disco con sectores de tamaño impar.",
      "Porque provocan una sobrecarga de doble escritura: las operaciones deben registrarse primero en el log y luego aplicarse en su ubicación definitiva en disco.",
      "Porque anulan el uso de la memoria caché de disco del sistema operativo.",
      "Porque impiden el uso de directorios jerárquicos."
    ],
    correct: 1,
    trap: "El journaling mejora la confiabilidad y velocidad de RECUPERACIÓN tras un corte, pero EMPEORA el rendimiento continuo de escritura por la doble escritura.",
    explanation: "Para garantizar consistencia atómica sin ejecutar fsck durante horas tras un fallo, el sistema escribe los metadatos/datos primero en el log circular y luego en los inodos/bloques reales, consumiendo el doble de ancho de banda de E/S."
  },
  {
    id: "mc-12",
    unit: 4,
    category: "Directorios y Rutas",
    question: "Al resolver la ruta '/users/pages.app/parcialSO.pages' en Unix, ¿cuál es el primer nodo-i que lee el sistema operativo?",
    options: [
      "El nodo-i 0, reservado para el cargador de arranque MBR.",
      "El nodo-i 1, correspondiente a los bloques defectuosos.",
      "El nodo-i 2, que por convención histórica fija corresponde siempre al directorio raíz '/'.",
      "El nodo-i del usuario que inició la sesión actual en el sistema."
    ],
    correct: 2,
    trap: "No es el inodo 0 ni 1. En los sistemas de archivos Unix clásicos y ext2/3/4, el directorio raíz '/' es siempre el inodo 2.",
    explanation: "El kernel de Unix tiene cableado por convención que el inodo 2 representa la raíz '/'. A partir de sus bloques de datos busca el nombre del primer subdirectorio ('users')."
  },

  // --- UNIDAD 5: ENTRADA / SALIDA ---
  {
    id: "mc-13",
    unit: 5,
    category: "Hardware E/S",
    question: "¿Cuál es la distinción fundamental entre un dispositivo de bloques y uno de caracteres?",
    options: [
      "Los de bloques se comunican solo por puertos serie; los de caracteres usan fibra óptica.",
      "Los de bloques almacenan información en unidades de tamaño fijo direccionables individualmente (permiten lseek); los de caracteres envían/reciben flujos de bytes sin bloques ni direccionamiento.",
      "Los de bloques no utilizan controladores electrónicos; los de caracteres sí.",
      "Los de caracteres solo funcionan cuando la CPU está en modo núcleo (kernel mode)."
    ],
    correct: 1,
    trap: "El ratón y teclado son de caracteres (flujo de eventos). Los discos y pendrives son de bloques (acceso aleatorio por sector).",
    explanation: "Un dispositivo de bloque (disco HDD, SSD) permite leer cualquier bloque independientemente. Uno de carácter (teclado, terminal, impresora) genera o consume un stream secuencial sin capacidad de posicionamiento aleatorio."
  },
  {
    id: "mc-14",
    unit: 5,
    category: "Memory-Mapped I/O",
    question: "¿Qué peligro crítico surge si el procesador intenta almacenar en memoria caché las lecturas a un dispositivo con E/S mapeada en memoria?",
    options: [
      "El controlador DMA se descalibra y destruye los datos mecánicos del disco.",
      "La CPU leerá el valor estático retenido en la caché en lugar de consultar el registro del hardware, ignorando cambios dinámicos del estado del periférico.",
      "Se produce un cortocircuito eléctrico entre el bus de direcciones y el bus de control.",
      "El vector de interrupciones se traslada automáticamente a la memoria virtual."
    ],
    correct: 1,
    trap: "La caché sirve para RAM normal, pero si cacheas un registro de hardware que cambia solo (ej. bit 'dato listo'), la CPU se queda en un bucle infinito.",
    explanation: "Los registros de los controladores cambian por acción del hardware externo. Si la CPU cachea esa dirección de memoria, las lecturas sucesivas devolverán el dato viejo de la caché sin acceder al bus. Por eso, la MMU debe marcar esas páginas como no cacheables."
  },
  {
    id: "mc-15",
    unit: 5,
    category: "Vector de Interrupciones",
    question: "¿Qué función cumple el Vector de Interrupciones en el manejo de E/S?",
    options: [
      "Contiene los códigos binarios de los controladores de dispositivos listos para ser flasheados.",
      "Es una tabla en memoria fija que asocia cada número de interrupción con la dirección de memoria de su Rutina de Servicio de Interrupción (ISR).",
      "Almacena temporalmente los paquetes de red descartados por falta de buffer.",
      "Define la velocidad máxima en RPM a la que puede girar el cabezal del disco magnético."
    ],
    correct: 1,
    trap: "El vector de interrupciones no guarda código ejecutable, guarda PUNTEROS (direcciones de memoria de inicio de los manejadores).",
    explanation: "Cuando el controlador de interrupciones coloca el número de IRQ en el bus, la CPU indexa el vector de interrupciones para saltar a ejecutar la rutina (ISR) correspondiente a ese periférico."
  },
  {
    id: "mc-16",
    unit: 5,
    category: "DMA",
    question: "¿Cuál es la diferencia operativa entre el modo 'Robo de Ciclos' (Cycle Stealing) y el 'Modo Ráfaga' (Burst Mode) en un controlador DMA?",
    options: [
      "En robo de ciclos el DMA apaga la CPU; en modo ráfaga aumenta el voltaje del disco.",
      "En robo de ciclos el DMA toma el bus por un único ciclo transfiriendo una palabra sin bloquear a la CPU; en modo ráfaga monopoliza el bus transfiriendo todo el bloque continuo.",
      "El robo de ciclos solo funciona con memorias DDR5, mientras que el modo ráfaga es exclusivo de discos flexibles.",
      "En modo ráfaga la CPU debe copiar cada byte de forma manual."
    ],
    correct: 1,
    trap: "Robo de ciclos es discreto (palabra por palabra). Ráfaga es masivo y continuo, pero bloquea el bus para la CPU.",
    explanation: "En Cycle Stealing el DMA intercala transferencias de palabras individuales aprovechando ciclos donde la CPU no usa el bus. En Burst Mode toma el bus completo para transferir ráfagas de datos a máxima velocidad."
  },
  {
    id: "mc-17",
    unit: 5,
    category: "Capas de Software E/S",
    question: "Según el modelo de 4 capas de software de E/S de Tanenbaum, ¿en qué nivel se gestionan el bufferizado (buffering), el cacheo y la asignación de nombres uniformes (/dev/...)?",
    options: [
      "Manejadores de interrupciones (Nivel 1).",
      "Controladores de dispositivos o Device Drivers (Nivel 2).",
      "Software de E/S independiente del dispositivo (Nivel 3).",
      "Software de E/S de espacio de usuario (Nivel 4)."
    ],
    correct: 2,
    trap: "Los drivers (nivel 2) son dependientes del hardware específico. El buffering y los nombres uniformes se hacen ARRIBA, en la capa independiente del dispositivo.",
    explanation: "La capa independiente del dispositivo (Device-independent I/O software) unifica las interfaces: nombres lógicos de archivos especiales, seguridad, tamaño uniforme de bloques, caché y bufferizado en memoria del kernel."
  },
  {
    id: "mc-18",
    unit: 5,
    category: "Capas de Software E/S",
    question: "¿Cuál es la responsabilidad principal del Manejador de Interrupciones (Nivel 1) tras la recepción de una señal IRQ de un disco?",
    options: [
      "Formatear las particiones del disco en ext4.",
      "Atender la interrupción física, salvar el contexto mínimo, limpiar el registro del controlador y despertar (desbloquear) al Device Driver que estaba esperando.",
      "Llamar a la función printf() en el espacio de usuario.",
      "Calcular el algoritmo SCAN para mover el brazo del disco."
    ],
    correct: 1,
    trap: "El manejador de interrupciones hace la tarea mínima e inmediata de bajo nivel: limpia la IRQ y desbloquea al driver mediante una señal o semáforo.",
    explanation: "Su función es ocultar el mecanismo físico de interrupciones al resto del sistema operativo: salva registros, notifica al PIC, y mediante semáforo o condición despierta al driver que estaba bloqueado."
  },
  {
    id: "mc-19",
    unit: 5,
    category: "Discos Magnéticos",
    question: "En el cálculo del tiempo total de acceso a un bloque de disco magnético, ¿cuál de los tres componentes mecánicos depende EXCLUSIVAMENTE de la velocidad de giro (RPM) del plato?",
    options: [
      "Tiempo de Búsqueda (Seek Time).",
      "Latencia Rotacional (Rotational Latency).",
      "Tiempo de procesamiento de interrupción de la CPU.",
      "Tiempo de compilación del driver."
    ],
    correct: 1,
    trap: "El Seek time depende del movimiento radial del brazo del cabezal. La latencia rotacional depende de cuánto tarda el plato en girar hasta que el sector llega bajo la cabeza.",
    explanation: "La latencia rotacional es el tiempo que tarda el sector deseado en ubicarse debajo del cabezal por giro mecánico del plato (promedio: media vuelta). A mayor RPM, menor latencia rotacional."
  },
  {
    id: "mc-20",
    unit: 5,
    category: "Algoritmos de Disco",
    question: "¿Por qué el algoritmo de planificación de disco SSTF (Shortest Seek Time First) puede provocar inanición (starvation)?",
    options: [
      "Porque invierte el sentido de giro de los motores eléctricos del disco continuamente.",
      "Porque si siguen llegando solicitudes cercanas a la posición actual del cabezal, las solicitudes ubicadas en los cilindros extremos lejanos jamás serán atendidas.",
      "Porque borra automáticamente las peticiones que tardan más de 5 segundos.",
      "Porque solo permite leer bloques impares."
    ],
    correct: 1,
    trap: "SSTF es óptimo localmente para minimizar movimiento inmediato, pero discrimina totalmente a los cilindros distantes si el centro tiene tráfico constante.",
    explanation: "SSTF siempre atiende la solicitud más cercana a su posición actual. Si una ráfaga continua de peticiones ocurre en un sector cercano, las peticiones lejanas se quedan esperando indefinidamente (inanición). SCAN soluciona esto barriendo de punta a punta."
  }
];
