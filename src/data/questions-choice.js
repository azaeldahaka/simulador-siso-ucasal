/**
 * Banco de Preguntas Múltiple Choice con Trampas Conceptuales (Cazabobos)
 * Sistemas Operativos (SISO) - 2do Parcial - UCASAL
 * Cátedra: Prof. Ing. Fernando Lucas Rivera Bernsdorff
 * 
 * ESPECIFICACIÓN DE CALIDAD PEDAGÓGICA (SPEC-002):
 * 1. Simetría de longitud: Las 4 opciones poseen una extensión homogénea (sin pistas visuales).
 * 2. Cero auto-explicación: Las opciones son aserciones técnicas directas sin justificaciones incrustadas.
 * 3. Distractores plausibles: Reflejan confusiones y trampas clásicas de la cátedra Rivera.
 */

export const choiceQuestions = [
  // =========================================================================
  // UNIDAD 4: SISTEMAS DE ARCHIVOS
  // =========================================================================

  {
    id: "mc-01",
    unit: 4,
    category: "Conceptos de Archivo",
    question: "¿Cuál es la diferencia fundamental entre un archivo regular ASCII y uno Binario a nivel de sistema operativo?",
    options: [
      "El archivo ASCII se compone de líneas con caracteres delimitadores; el binario contiene secuencias de bytes arbitrarias.",
      "El archivo ASCII es interpretado semánticamente por el kernel; el binario es tratado como secuencia de bytes plana.",
      "El archivo ASCII exige asignación contigua en disco; el binario emplea exclusivamente asignación por lista enlazada.",
      "El archivo ASCII almacena sus metadatos en la cabecera; el binario almacena sus permisos dentro del superbloque."
    ],
    correct: 0,
    trap: "Cuidado: el sistema operativo moderno (Unix/Windows) trata a ambos como secuencias de bytes y NO interpreta su significado semántico.",
    explanation: "Los archivos ASCII están estructurados en líneas legibles separadas por caracteres de control (LF o CRLF). Los binarios poseen estructuras internas propietarias (ej. ejecutables ELF, imágenes) que solo la aplicación usuaria interpreta, no el kernel."
  },
  {
    id: "mc-02",
    unit: 4,
    category: "Asignación Contigua",
    question: "¿Cuál es la desventaja crítica de la asignación contigua de bloques en sistemas de archivos de lectura y escritura?",
    options: [
      "Genera fragmentación externa en el disco e impide el crecimiento dinámico de los archivos sin reubicación.",
      "Requiere cargar la tabla completa de punteros de todos los sectores en memoria RAM antes de iniciar la lectura.",
      "Inhabilita por completo la posibilidad de realizar lecturas secuenciales a máxima velocidad del controlador.",
      "Desperdicia cuatro bytes al final de cada sector para enlazar con la dirección física del siguiente bloque."
    ],
    correct: 0,
    trap: "No confundir fragmentación externa (huecos libres dispersos no contiguos) con fragmentación interna (espacio sobrante en el último bloque asignado).",
    explanation: "A medida que se crean y borran archivos de tamaño dispar, el espacio libre se fragmenta en huecos dispersos (fragmentación externa). Si un archivo necesita crecer y el siguiente bloque contiguo está ocupado, debe copiarse entero a otra región del disco."
  },
  {
    id: "mc-03",
    unit: 4,
    category: "Lista Enlazada Simple",
    question: "En la asignación por lista enlazada simple con punteros dentro de cada bloque, ¿cuál es un inconveniente estructural directo?",
    options: [
      "El tamaño útil de datos en cada bloque deja de coincidir con una potencia de dos exacta para transferencias.",
      "El sistema de archivos queda restringido a una capacidad física total que no puede superar los 32 megabytes.",
      "Se produce una severa fragmentación externa en disco que exige desfragmentar antes de crear nuevos ficheros.",
      "Obliga a que toda la estructura de punteros de la partición resida fija en la memoria RAM principal."
    ],
    correct: 0,
    trap: "La estructura que debe residir fija en memoria RAM es la tabla FAT, no la lista enlazada con punteros embebidos en disco.",
    explanation: "Si el bloque mide 1024 bytes y se reservan 4 bytes para el puntero al siguiente bloque, quedan 1020 bytes útiles. Esto rompe la alineación óptima de memoria basada en potencias de dos (512, 1024, 2048, 4096 bytes) requerida por el hardware."
  },
  {
    id: "mc-04",
    unit: 4,
    category: "FAT",
    question: "En una partición administrada con FAT-16 donde el tamaño de cluster es de 2 KB, ¿cuál es el tamaño máximo de partición direccionable?",
    options: [
      "128 Megabytes.",
      "256 Megabytes.",
      "2 Gigabytes.",
      "4 Gigabytes."
    ],
    correct: 0,
    trap: "No confundir el límite comercial máximo de FAT-16 (2 GB con clusters de 32 KB) con el cálculo para un cluster específico de 2 KB.",
    explanation: "Con 16 bits de dirección existen 2^16 = 65.536 entradas posibles. Multiplicando 65.536 clusters por 2 KB por cluster se obtiene 131.072 KB = 128 MB."
  },
  {
    id: "mc-05",
    unit: 4,
    category: "FAT",
    question: "¿Cuál es el principal cuello de botella de escalabilidad de la arquitectura FAT al aplicarse en discos de gran capacidad?",
    options: [
      "La tabla FAT completa debe residir permanentemente en memoria RAM para permitir accesos a velocidad aceptable.",
      "Inhabilita el direccionamiento de archivos con nombres que utilicen caracteres pertenecientes al estándar Unicode.",
      "Impide realizar operaciones de acceso secuencial directo sin antes reiniciar el subsistema de entrada y salida.",
      "Provoca que los bloques defectuosos del medio magnético no puedan ser marcados ni aislados por el sistema operativo."
    ],
    correct: 0,
    trap: "La FAT no almacena punteros de forma distribuida en cada inodo; centraliza la tabla de todo el disco, la cual debe estar en memoria para no buscar punteros en disco continuamente.",
    explanation: "En FAT, la tabla de asignación contiene una entrada por cada bloque del volumen. Al escalar a cientos de gigabytes, almacenar millones de entradas en memoria RAM consume una cantidad inaceptable de memoria física del sistema."
  },
  {
    id: "mc-06",
    unit: 4,
    category: "Nodos-I",
    question: "¿Cómo optimiza el esquema de Nodos-I (Unix/Linux) el consumo de memoria principal frente a la arquitectura FAT?",
    options: [
      "Carga en memoria RAM únicamente los nodos-i correspondientes a los archivos que se encuentran abiertos.",
      "Comprime los bloques de punteros mediante algoritmos sin pérdida antes de enviarlos a la memoria caché del kernel.",
      "Almacena las referencias de bloques de datos directamente en los registros internos del microprocesador.",
      "Elimina la capa de bloques del sistema de archivos y mapea las páginas de memoria física sobre el almacenamiento."
    ],
    correct: 0,
    trap: "No se carga toda la tabla de inodos del disco a la RAM; solo se colocan en memoria aquellos inodos vinculados a procesos en ejecución que abrieron el archivo.",
    explanation: "Cada archivo tiene su propio nodo-i independiente. Si en un disco hay 500.000 archivos pero solo 15 abiertos por procesos del sistema, solo se ocupará memoria RAM para alojar esos 15 inodos, logrando una eficiencia de memoria muy superior a FAT."
  },
  {
    id: "mc-07",
    unit: 4,
    category: "Nodos-I",
    question: "¿Qué consecuencia directa tiene el hecho de que la cantidad total de nodos-i se fije durante el formateo (`mkfs`)?",
    options: [
      "Se puede agotar la tabla de inodos y bloquear la creación de archivos aun cuando reste abundante espacio libre en bytes.",
      "El tamaño físico de los bloques de datos de la partición debe reconfigurarse dinámicamente con cada reinicio del equipo.",
      "Queda inhabilitada la posibilidad de utilizar bloques de punteros indirectos dobles o triples en archivos de gran tamaño.",
      "Los archivos de tipo binario ejecutable pierden los permisos de ejecución asociados a su máscara octal de protección."
    ],
    correct: 0,
    trap: "Muchos alumnos asumen que un disco solo se llena al acabarse los gigabytes. En Unix, si se agotan los inodos libres (por millones de archivos enanos), el disco queda lleno (ENOSPC) con gigabytes vacíos.",
    explanation: "Cada archivo nuevo exige un nodo-i disponible. Si un sistema genera millones de archivos diminutos (como colas de correo o logs de 10 bytes), se terminarán los inodos libres antes que los bloques de datos, impidiendo crear nuevos ficheros."
  },
  {
    id: "mc-08",
    unit: 4,
    category: "Nodos-I",
    question: "En un sistema con nodos-i de 10 punteros directos, ¿cómo accede el kernel al bloque número 35 de un archivo de 50 bloques?",
    options: [
      "Utiliza el puntero indirecto simple para leer un bloque intermedio de índices que contiene la dirección buscada.",
      "Encadena un segundo nodo-i auxiliar al inodo principal a través de un puntero físico de extensión de cabecera.",
      "Recorre secuencialmente los primeros diez bloques de datos leyendo el puntero de enlace grabado al final de cada uno.",
      "Reubica automáticamente los cincuenta bloques para que queden almacenados de forma contigua en el cilindro cero."
    ],
    correct: 0,
    trap: "El nodo-i no se encadena con otro nodo-i. Utiliza niveles de indirección hacia bloques de índices de disco.",
    explanation: "Los punteros directos 0 a 9 direccionan los primeros 10 bloques (0 a 9). Los bloques a partir del índice 10 se resuelven mediante el puntero indirecto simple, el cual apunta a un bloque de disco dedicado a contener direcciones de bloques de datos."
  },
  {
    id: "mc-09",
    unit: 4,
    category: "Mapas de Bits",
    question: "En un volumen administrado con mapa de bits donde los bloques miden 4 KB, ¿cuántos bloques del disco se registran en UN bloque de mapa?",
    options: [
      "32.768 bloques.",
      "16.384 bloques.",
      "65.536 bloques.",
      "4.096 bloques."
    ],
    correct: 0,
    trap: "Recordar multiplicar los bytes del bloque por 8, ya que cada byte del mapa alberga 8 bits (y cada bit representa el estado de 1 bloque del disco).",
    explanation: "Un bloque de mapa de 4 KB equivale a 4.096 Bytes. Como cada byte posee 8 bits: 4.096 B * 8 bits/B = 32.768 bits. Cada bit mapea el estado libre/ocupado de un bloque de disco, registrando exactamente 32.768 bloques."
  },
  {
    id: "mc-10",
    unit: 4,
    category: "VFS",
    question: "¿Cuál es la función principal del Sistema de Archivos Virtual (VFS) dentro de la arquitectura del kernel de Linux?",
    options: [
      "Proporcionar una interfaz POSIX estándar que desacopla las llamadas de usuario de las implementaciones concretas.",
      "Implementar un mecanismo de respaldo automático en memoria volátil de las particiones con formato ext4 o NTFS.",
      "Comprimir en tiempo real los bloques de almacenamiento secundario para duplicar la capacidad del medio físico.",
      "Reemplazar a los manejadores de interrupciones de hardware en la atención directa de los controladores de disco."
    ],
    correct: 0,
    trap: "VFS no es un sistema de archivos persistente grabado en el disco físico; es una capa de abstracción lógica en memoria del kernel.",
    explanation: "El VFS define estructuras comunes (inode, file, dentry, superblock) y tablas de punteros a funciones para que llamadas como open(), read() y write() operen de manera idéntica e intercambiable sobre ext4, FAT, NFS o ISO-9660."
  },
  {
    id: "mc-11",
    unit: 4,
    category: "Bitácora (Journaling)",
    question: "¿Por qué los sistemas de archivos con bitácora (Journaling) presentan una penalidad intrínseca en el rendimiento de escritura?",
    options: [
      "Imponen una sobrecarga de doble escritura al grabar primero en el registro circular y luego en su ubicación definitiva.",
      "Desactivan de manera forzosa el uso de la memoria intermedia de bloques (buffer cache) del sistema operativo.",
      "Obligan al controlador a formatear el almacenamiento mecánico utilizando sectores con cantidad impar de bytes.",
      "Inhabilitan la creación de estructuras de directorios jerárquicos con más de tres niveles de profundidad relativa."
    ],
    correct: 0,
    trap: "El journaling acelera enormemente la RECUPERACIÓN tras un corte eléctrico (evitando un fsck de horas), pero DEGRADA la velocidad de escritura normal debido a la doble escritura.",
    explanation: "Para garantizar consistencia atómica y tolerancia a fallos, los metadatos (y opcionalmente los datos) deben registrarse primero en el journal y posteriormente volcarse a los bloques definitivos, consumiendo el doble de operaciones de E/S."
  },
  {
    id: "mc-12",
    unit: 4,
    category: "Directorios y Rutas",
    question: "Al resolver una ruta absoluta en sistemas Unix como '/etc/passwd', ¿cuál es el primer nodo-i que consulta el kernel?",
    options: [
      "El nodo-i número 2, reservado por convención histórica como punto de montaje del directorio raíz '/'.",
      "El nodo-i número 0, reservado permanentemente para identificar el registro maestro de arranque (MBR).",
      "El nodo-i número 1, dedicado al almacenamiento de la lista de sectores con fallas físicas del disco.",
      "El nodo-i correspondiente al identificador numérico de usuario (UID) que ejecutó la llamada al sistema."
    ],
    correct: 0,
    trap: "No es el inodo 0 ni el 1. En Unix clásico y ext2/ext3/ext4, el directorio raíz '/' está siempre asignado rígidamente al inodo 2.",
    explanation: "El kernel tiene fijado por estándar que el inodo 2 representa la raíz del sistema de archivos. A partir de los bloques de datos de ese inodo lee las entradas de directorio para localizar el inodo de 'etc', y recursivamente el de 'passwd'."
  },

  // =========================================================================
  // UNIDAD 5: ENTRADA / SALIDA Y DISCOS
  // =========================================================================

  {
    id: "mc-13",
    unit: 5,
    category: "Hardware E/S",
    question: "¿Cuál es la característica distintiva de un dispositivo de bloques frente a un dispositivo de caracteres?",
    options: [
      "Permite transferir datos en unidades de tamaño fijo con direccionamiento independiente de cada bloque mediante seek.",
      "Transfiere exclusivamente flujos continuos de caracteres sin permitir almacenar información de forma persistente.",
      "Requiere conectarse obligatoriamente a través de puertos serie sin intermediación de un controlador electrónico.",
      "Opera exclusivamente cuando la unidad central de procesamiento se encuentra ejecutando en modo usuario desprotegido."
    ],
    correct: 0,
    trap: "Los discos y memorias son de bloques (acceso aleatorio por sector). Los teclados, módems e impresoras son de caracteres (flujo secuencial sin posicionamiento).",
    explanation: "Un dispositivo de bloques almacena información en sectores de tamaño fijo (ej. 512 B o 4 KB) direccionables individualmente, permitiendo lecturas y escrituras aleatorias en cualquier orden. Los de caracteres manejan secuencias de bytes no indexables."
  },
  {
    id: "mc-14",
    unit: 5,
    category: "Memory-Mapped I/O",
    question: "¿Qué anomalía se produce si la CPU aplica almacenamiento en memoria caché sobre los registros de un dispositivo con E/S mapeada en memoria?",
    options: [
      "La CPU consultará valores estáticos retenidos en la caché ignorando los cambios de estado en el periférico.",
      "El controlador DMA incrementará de manera descontrolada el voltaje de los motores mecánicos del disco.",
      "Se producirá una interrupción no enmascarable que forzará al microprocesador a deshabilitar la memoria virtual.",
      "Los sectores del medio magnético se sobrescribirán con secuencias continuas de ceros de forma irreversible."
    ],
    correct: 0,
    trap: "La caché de CPU optimiza el acceso a RAM ordinaria, pero si cachea una dirección vinculada a un registro de hardware que cambia por acción externa, el procesador leerá un dato viejo desactualizado.",
    explanation: "Los registros de los controladores de E/S reflejan estados volátiles del hardware (ej. buffer con dato entrante). Si la CPU cachea esa dirección de memoria, las siguientes lecturas retornarán el valor de la caché sin interrogar al bus, quedando atrapada en un bucle infinito."
  },
  {
    id: "mc-15",
    unit: 5,
    category: "Vector de Interrupciones",
    question: "¿Qué estructura aloja el Vector de Interrupciones en el subsistema de entrada y salida del procesador?",
    options: [
      "Una tabla en memoria con las direcciones de inicio de las rutinas de servicio de interrupción (ISR).",
      "Una cola de prioridad que almacena el código binario de los controladores de dispositivos de almacenamiento.",
      "Un registro interno del microprocesador que cuenta la cantidad total de señales de reloj de cada ciclo de bus.",
      "Un búfer intermedio ubicado en el controlador DMA para retener paquetes de red descartados por saturación."
    ],
    correct: 0,
    trap: "El vector de interrupciones no contiene el código de los drivers; contiene únicamente PUNTEROS a memoria (direcciones de salto de las ISR).",
    explanation: "Al activarse una interrupción, el controlador de interrupciones entrega al bus un número entero de IRQ. La CPU utiliza ese número como índice dentro del Vector de Interrupciones para cargar en el contador de programa (PC) la dirección de la ISR correspondiente."
  },
  {
    id: "mc-16",
    unit: 5,
    category: "DMA",
    question: "¿En qué se diferencia el modo 'Robo de Ciclos' del 'Modo Ráfaga' en las operaciones de un controlador DMA?",
    options: [
      "En robo de ciclos el DMA intercala transferencias de palabras aisladas; en ráfaga monopoliza el bus por un bloque entero.",
      "En robo de ciclos el DMA desactiva los registros de la CPU; en ráfaga exige que la CPU transfiera cada byte manualmente.",
      "En robo de ciclos el DMA opera sólo con memoria virtual; en ráfaga interactúa exclusivamente con memoria caché L1.",
      "En robo de ciclos el DMA transfiere a mayor velocidad de reloj que el límite teórico soportado por el bus del sistema."
    ],
    correct: 0,
    trap: "Robo de ciclos es granular (palabra por palabra sin frenar mucho a la CPU). Modo ráfaga es masivo y rápido pero acapara el bus impidiendo a la CPU usar la memoria.",
    explanation: "En Cycle Stealing el controlador DMA solicita el bus por un único ciclo, transfiere una palabra y lo libera, minimizando la detención del procesador. En Burst Mode toma el control ininterrumpido del bus hasta vaciar o llenar el buffer del dispositivo."
  },
  {
    id: "mc-17",
    unit: 5,
    category: "Capas de Software E/S",
    question: "Según el modelo de cuatro capas de software de E/S de Tanenbaum, ¿en qué nivel se gestionan el bufferizado, el cacheo y los nombres uniformes?",
    options: [
      "En la capa de software de E/S independiente del dispositivo (Nivel 3).",
      "En la capa de manejadores de interrupciones o rutinas ISR (Nivel 1).",
      "En la capa de controladores de dispositivos o device drivers (Nivel 2).",
      "En la capa de librerías del subsistema en espacio de usuario (Nivel 4)."
    ],
    correct: 0,
    trap: "Los device drivers (nivel 2) son dependientes del hardware específico. El bufferizado del kernel, la asignación de nombres (/dev/...) y el cacheo residen en la capa independiente del dispositivo.",
    explanation: "La capa independiente del dispositivo unifica la interfaz para el resto del kernel: mapea nombres lógicos a drivers, provee mecanismos de seguridad y cuotas, administra los pools de buffers en RAM y unifica los tamaños de bloque lógicos."
  },
  {
    id: "mc-18",
    unit: 5,
    category: "Capas de Software E/S",
    question: "¿Cuál es la tarea fundamental que ejecuta un Manejador de Interrupciones (Nivel 1) tras activarse la señal física de un periférico?",
    options: [
      "Salvar el contexto mínimo, atender el evento del controlador y desbloquear al driver que esperaba la operación.",
      "Determinar qué algoritmo de planificación de cilindros de disco debe ejecutarse en la siguiente llamada de lectura.",
      "Ejecutar la conversión de código ASCII a binario de los datos que acaban de recibirse por el puerto serie del equipo.",
      "Formatear las estructuras del superbloque del sistema de archivos para registrar los nuevos bloques transferidos."
    ],
    correct: 0,
    trap: "El manejador de interrupciones ejecuta solo el trabajo crítico e inmediato de muy bajo nivel: acknowledge al hardware y wake-up del driver.",
    explanation: "Su responsabilidad es ocultar la naturaleza asíncrona de las interrupciones: preserva los registros de la CPU, envía el acuse de recibo al PIC/APIC y notifica mediante un semáforo o condición al driver que estaba bloqueado esperando el fin de la E/S."
  },
  {
    id: "mc-19",
    unit: 5,
    category: "Discos Magnéticos",
    question: "En el tiempo total de acceso a un sector de disco magnético, ¿cuál de los componentes mecánicos depende estrictamente de las RPM del plato?",
    options: [
      "La latencia rotacional, que representa el tiempo que tarda el sector en ubicarse debajo del cabezal.",
      "El tiempo de búsqueda (seek time), que representa el desplazamiento radial del brazo portacabezales.",
      "El retardo de conmutación electrónica del multiplexor del controlador entre pistas de la misma cara.",
      "El tiempo de transferencia del búfer interno del disco hacia la memoria principal mediante el bus SATA."
    ],
    correct: 0,
    trap: "El Seek time depende del movimiento del brazo mecánico. La latencia rotacional depende exclusivamente del giro angular del plato (a mayores RPM, menor latencia).",
    explanation: "La latencia rotacional es el lapso mecánico necesario para que el plato gire hasta colocar el sector pedido bajo el cabezal de lectura. En promedio equivale al tiempo de media vuelta ($1 / (2 \\times \\text{RPS})$), dependiendo 100% de la velocidad angular (RPM)."
  },
  {
    id: "mc-20",
    unit: 5,
    category: "Algoritmos de Disco",
    question: "¿Por qué el algoritmo de planificación de disco SSTF (Shortest Seek Time First) puede provocar inanición (starvation) de solicitudes?",
    options: [
      "Porque las solicitudes en cilindros lejanos no se atienden si continúan arribando peticiones cercanas al cabezal.",
      "Porque invierte el sentido de giro del eje mecánico del disco cada vez que detecta solicitudes de pistas adyacentes.",
      "Porque descarta de la cola de planificación aquellas solicitudes que superan un tiempo de espera de cinco segundos.",
      "Porque limita la lectura exclusivamente a pistas identificadas con números pares dentro de cada plato magnético."
    ],
    correct: 0,
    trap: "SSTF minimiza el seek time inmediato eligiendo la petición más cercana a la posición actual, pero margina indefinidamente a las solicitudes distantes si el cabezal se queda en una zona de alto tráfico.",
    explanation: "Al priorizar siempre la distancia más corta desde la posición actual, un flujo constante de solicitudes en cilindros contiguos mantendrá al cabezal en esa región, provocando que peticiones en cilindros opuestos sufran inanición permanente."
  },

  // =========================================================================
  // NUEVAS PREGUNTAS DE PARCIAL (SPEC-002: mc-21 a mc-30)
  // =========================================================================

  {
    id: "mc-21",
    unit: 4,
    category: "Enlaces (Links)",
    question: "En Unix, si se crea un enlace duro (Hard Link) a un archivo y posteriormente se elimina el archivo original con `rm`, ¿qué sucede?",
    options: [
      "El inodo y los bloques se conservan intactos; solo se decrementa en uno el contador de referencias del nodo-i.",
      "El archivo queda corrupto debido a que el enlace duro apunta a una dirección de directorio que ya no existe en disco.",
      "El kernel elimina inmediatamente los bloques de datos y el enlace duro queda apuntando a un nodo-i inexistente.",
      "El enlace duro se convierte de forma automática en un enlace simbólico que almacena la ruta absoluta previa."
    ],
    correct: 0,
    trap: "Los hard links comparten el MISMO nodo-i. El archivo solo se libera cuando el contador de enlaces (`link count`) llega exactamente a cero.",
    explanation: "Un hard link es una entrada de directorio adicional que apunta al mismo número de inodo. Al ejecutar `rm`, se desvincula esa entrada y se decrementa el campo `i_nlink`. Mientras haya al menos un enlace apuntando al inodo, los datos permanecen completamente accesibles."
  },
  {
    id: "mc-22",
    unit: 4,
    category: "Estructura de Directorios",
    question: "¿Qué información almacena exactamente una entrada de directorio (dentry) clásica en el sistema de archivos de Unix?",
    options: [
      "Únicamente el nombre asignado al archivo y su número de nodo-i correspondiente en la partición.",
      "El nombre del archivo, su tamaño en bytes y la máscara octal de permisos de lectura y escritura.",
      "La ruta absoluta completa del fichero junto con la lista de direcciones físicas de sus primeros diez bloques.",
      "Los sellos de tiempo de último acceso junto con el identificador del usuario propietario del recurso."
    ],
    correct: 0,
    trap: "¡Cuidado! El tamaño, los permisos, las fechas y los punteros a bloques residen en el NODO-I, NUNCA en la entrada del directorio.",
    explanation: "En Unix clásico, un directorio es una tabla muy compacta: cada fila contiene únicamente el número de inodo (ej. 2 o 4 bytes) y el nombre del archivo. Todos los atributos de seguridad, tamaño y ubicación se consultan leyendo el inodo correspondiente."
  },
  {
    id: "mc-23",
    unit: 4,
    category: "Superbloque",
    question: "¿Por qué el formateador del sistema de archivos (`mkfs`) almacena copias redundantes del Superbloque a lo largo del volumen?",
    options: [
      "Porque si se corrompe el superbloque principal, el sistema de archivos queda inmontable e inaccesible.",
      "Porque cada bloque de datos del disco exige tener adyacente una copia de los parámetros de geometría física.",
      "Porque permite balancear la carga de lectura de archivos entre los distintos núcleos de procesamiento del microprocesador.",
      "Porque los sistemas operativos modernos no permiten el uso de estructuras de particionado con esquemas GPT."
    ],
    correct: 0,
    trap: "El superbloque almacena los parámetros críticos del sistema de archivos (tamaño de bloque, número mágico, inodos totales). Sin él, el kernel no sabe cómo interpretar la partición.",
    explanation: "El superbloque es el punto único de fallo: define el tamaño de bloque, total de inodos y punteros a mapas de bits. Para evitar que un sector defectuoso destruya todo el sistema de archivos, sistemas como ext4 guardan copias de respaldo en los grupos de bloques 0, 1, 3, 5, 7 para restauración vía `e2fsck`."
  },
  {
    id: "mc-24",
    unit: 4,
    category: "Consistencia y fsck",
    question: "Durante un chequeo de consistencia con `fsck`, ¿qué acción toma el verificador si detecta un inodo ocupado no referenciado por ningún directorio?",
    options: [
      "Reconecta el inodo huérfano dentro del directorio especial '/lost+found' para permitir su recuperación.",
      "Sobrescribe inmediatamente los bloques de datos con ceros lógicos para evitar accesos no autorizados.",
      "Duplica el nodo-i en todas las particiones montadas del sistema hasta que un proceso de usuario lo reclame.",
      "Detiene la ejecución del kernel y fuerza el formateo completo de la partición de almacenamiento secundario."
    ],
    correct: 0,
    trap: "Un inodo huérfano tiene `i_nlink > 0` pero ningún directorio apunta a él (por un corte antes de escribir la entrada de directorio). No se borra: se salva en `/lost+found`.",
    explanation: "Si el sistema cayó tras reservar el inodo pero antes de enlazarlo al directorio padre, `fsck` detecta la discrepancia en el árbol de directorios. Como los datos pueden ser valiosos, crea una entrada ficticia nombrada con el número de inodo dentro del directorio `/lost+found`."
  },
  {
    id: "mc-25",
    unit: 4,
    category: "Capacidad de Inodos",
    question: "En un sistema con nodos-i cuyos bloques miden 4 KB y los punteros ocupan 4 bytes, ¿cuántos bytes puede direccionar el puntero indirecto simple?",
    options: [
      "4 Megabytes.",
      "1 Megabyte.",
      "16 Megabytes.",
      "4 Gigabytes."
    ],
    correct: 0,
    trap: "No multiplicar el tamaño del bloque por sí mismo. Se calcula: (Tamaño de Bloque / Tamaño de Puntero) * Tamaño de Bloque.",
    explanation: "En un bloque de 4 KB (4.096 B), un puntero de 4 B permite guardar $4096 / 4 = 1024$ direcciones de bloques de datos. Multiplicando 1.024 bloques por 4 KB por bloque se obtienen exactamente 4.096 KB = 4 MB de datos direccionables."
  },
  {
    id: "mc-26",
    unit: 5,
    category: "Algoritmos de Disco",
    question: "¿Cuál es la ventaja de diseño del algoritmo de planificación C-SCAN (SCAN Circular) sobre el algoritmo SCAN convencional?",
    options: [
      "Ofrece un tiempo de espera más uniforme para todos los cilindros al retornar al inicio sin atender peticiones.",
      "Elimina por completo el componente de latencia rotacional durante las operaciones continuas de lectura.",
      "Garantiza que el brazo del disco magnético nunca deba moverse más allá de la mitad de los cilindros del plato.",
      "Permite atender de manera prioritaria a los procesos que ejecutan con mayor prioridad en el planificador de la CPU."
    ],
    correct: 0,
    trap: "SCAN normal barre hacia adelante y hacia atrás, lo que favorece el doble a los cilindros centrales. C-SCAN barre en un solo sentido, logrando un tiempo de espera equitativo para cualquier cilindro.",
    explanation: "En SCAN tradicional, cuando el cabezal llega a un extremo e invierte la marcha, los cilindros cercanos a ese extremo tienen pocas solicitudes acumuladas, mientras que el extremo opuesto esperó el doble. C-SCAN barre siempre en un solo sentido y regresa al inicio de un salto, logrando varianza de espera homogénea."
  },
  {
    id: "mc-27",
    unit: 5,
    category: "Discos de Estado Sólido (SSD)",
    question: "¿Por qué los sistemas operativos desactivan los algoritmos de reordenamiento de cilindros (como SSTF o SCAN) en unidades SSD?",
    options: [
      "Porque los SSD carecen de partes mecánicas y su tiempo de acceso a cualquier bloque es prácticamente uniforme.",
      "Porque los algoritmos de ordenamiento de pistas provocan sobrecalentamiento en las celdas de memoria Flash NAND.",
      "Porque las unidades SSD se conectan exclusivamente mediante puertos serie asíncronos que no soportan colas de comandos.",
      "Porque el sistema operativo delega la gestión de memoria virtual directamente a la controladora externa del bus PCIe."
    ],
    correct: 0,
    trap: "Los algoritmos de elevador (SCAN, SSTF) existen para minimizar el movimiento físico del brazo lector en un plato giratorio. En memorias de estado sólido no hay brazo ni cilindros.",
    explanation: "En un SSD no existe tiempo de búsqueda mecánico (seek time) ni latencia rotacional. Ordenar las peticiones por dirección LBA consume ciclos de CPU innecesarios y no aporta ventajas mecánicas, por lo que los núcleos modernos configuran planificadores como `none` o `noop` (FIFO simple)."
  },
  {
    id: "mc-28",
    unit: 5,
    category: "Hardware E/S",
    question: "¿En qué circunstancia de alta exigencia el sondeo programado (Polling) resulta más eficiente que el esquema dirigido por interrupciones?",
    options: [
      "Cuando los datos arriban a una tasa sumamente veloz y constante donde las interrupciones saturarían a la CPU.",
      "Cuando el dispositivo de entrada y salida se encuentra en estado inactivo durante largos períodos de tiempo.",
      "Cuando la memoria principal del computador carece de espacio suficiente para alojar el vector de interrupciones.",
      "Cuando se requiere que la CPU permanezca en modos de bajo consumo de energía mientras espera la transferencia."
    ],
    correct: 0,
    trap: "Las interrupciones son ideales para eventos esporádicos (como pulsar una tecla). Pero si entran 10 millones de paquetes por segundo (redes 100 GbE), el overhead de salvar registros y cambiar de contexto colapsa la CPU; el polling continuo es mucho más rápido.",
    explanation: "Cada interrupción implica salvar registros, cambiar a modo kernel, saltar a la ISR, atender el hardware y retornar. Si un dispositivo transfiere a velocidades extremas continuas (ej. placas de red de alta velocidad o tarjetas de adquisición), el costo de atender millones de interrupciones es mayor que chequear en bucle directo (polling)."
  },
  {
    id: "mc-29",
    unit: 5,
    category: "RAID",
    question: "¿Cuál es la penalidad operativa de escritura que introduce un arreglo de discos con arquitectura RAID 5?",
    options: [
      "Exige ejecutar dos lecturas y dos escrituras para actualizar el bloque de datos y recalcular el bloque de paridad.",
      "Obliga a duplicar cada sector grabado consumiendo exactamente el cincuenta por ciento de la capacidad instalada.",
      "Inhabilita la posibilidad de atender operaciones de lectura paralelas en cilindros independientes del conjunto.",
      "Requiere que todos los discos miembros del volumen pertenezcan a la misma partida de fabricación del fabricante."
    ],
    correct: 0,
    trap: "No confundir RAID 1 (espejo: 50% de capacidad útil, 2 escrituras directas) con RAID 5 (paridad distribuida: se lee dato viejo + paridad vieja, se calcula XOR, y se escribe dato nuevo + paridad nueva -> 4 operaciones).",
    explanation: "En RAID 5, modificar un bloque individual exige leer el dato viejo y la paridad vieja, calcular la nueva paridad mediante operación XOR y finalmente escribir el nuevo dato y la nueva paridad. Este ciclo ('small write penalty') impone 2 lecturas y 2 escrituras de disco por cada escritura lógica."
  },
  {
    id: "mc-30",
    unit: 5,
    category: "Device Drivers",
    question: "¿Por qué los controladores de dispositivos (Device Drivers) deben diseñarse bajo una arquitectura reentrante en el kernel?",
    options: [
      "Porque múltiples procesos pueden invocar llamadas al mismo driver antes de que este finalice peticiones previas.",
      "Porque deben reiniciarse de manera obligatoria cada vez que el microprocesador cambia de modo usuario a núcleo.",
      "Porque no tienen autorización para almacenar variables locales dentro de la memoria física de la máquina virtual.",
      "Porque el controlador de interrupciones APIC exige que todos los módulos ejecutables residan en memoria de solo lectura."
    ],
    correct: 0,
    trap: "Reentrante no significa que se 'reinicie'. Significa que varias instancias concurrentes de ejecución pueden atravesar el mismo código sin pisar variables compartidas.",
    explanation: "En sistemas operativos multitarea y multiprocesador simétrico (SMP), varios procesos pueden invocar la llamada al sistema read() o write() sobre el mismo dispositivo simultáneamente. El driver debe ser reentrante (evitar variables globales estáticas desprotegidas y usar mecanismos de sincronización) para operar concurrentemente sin corrupción de estado."
  }
];
