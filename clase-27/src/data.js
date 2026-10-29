// Contenido pedagógico de la Clase 27 (Plan de Unidad 4 · Ciencias Naturales 7°) — Taller editorial y ensayo científico.
// Todos los borradores, comentarios, grupos y ejemplos son FICTICIOS (ilustrativos). Las referencias a instituciones
// (Currículum Nacional, MINSAL/DIPRECE, OMS) son orientativas: el docente proyecta los sitios oficiales vigentes.
// Semáforos, revisores y claves son ORIENTATIVOS: la revisión humana (y el punto de control docente) prevalece. Sin preguntas reales de pruebas.

export const PHASES = {
  intro:        { name: 'Inicio · ruta',       min: 5,  color: 'var(--ink)' },
  activacion:   { name: 'Semáforo y meta',     min: 10, color: 'var(--rd)' },
  preguntas:    { name: 'Preguntas iniciales', min: 10, color: 'var(--bl)' },
  modelamiento: { name: 'Modelamiento',        min: 10, color: 'var(--gr)' },
  actividad:    { name: 'Actividad central',   min: 40, color: 'var(--vi)' },
  comun:        { name: 'Puesta en común',     min: 10, color: 'var(--rd)' },
  ticket:       { name: 'Ticket y aviso',      min: 5,  color: 'var(--ink)' },
};

export const NOTES = [
  '<b>Portada.</b> Hoy es un <u>taller editorial</u>: se termina, se revisa y se ensaya el PPT científico antes de la feria. Los siete pliegos de la portada son las siete diapositivas del proyecto; cada marca de corrección es una pregunta de revisión. Cuidado: todo lo que verás (borradores, comentarios, grupos) es <b>ilustrativo</b>; las fuentes oficiales vigentes (Currículum Nacional, MINSAL/DIPRECE, organismos sanitarios) las proyecta el docente. Atajos: <kbd>N</kbd> notas · <kbd>G</kbd> índice · <kbd>T</kbd> reloj · <kbd>M</kbd> movimiento reducido.',
  '<b>Ruta (5 min).</b> Meta: finalizar y mejorar el PPT verificando exactitud, calidad de fuentes, claridad visual, lenguaje respetuoso y preparación oral. Cinco pasos: revisar cuánto falta, repartir pendientes, terminar y verificar, aplicar la revisión 3C y ensayar. Resguardos: usar las fuentes institucionales ya trabajadas y <b>no compartir experiencias personales ni ejemplos identificables de compañeros</b>.',
  '<b>Semáforo de avance y meta (10 min).</b> Cada grupo marca el estado de sus siete diapositivas: completa, faltan uno o dos elementos o falta contenido importante (también se puede tocar un bloque de la torre 3D). El semáforo grupal es <u>orientativo</u>: verde si las siete están completas, rojo si falta contenido importante en alguna. Luego escriben <b>una meta concreta</b> para la sesión y reparten los pendientes con tareas <u>distintas</u> (que no todos hagan lo mismo). Define el número de integrantes y sus nombres (o «Integrante N»; sin datos personales).',
  '<b>Preguntas iniciales (10 min).</b> Cinco preguntas de autocontrol. Cada respuesta «no» o «no lo sé» genera un pendiente concreto en la lista; esa lista se retoma en el bloque de finalización (diapositiva 9). Pide que respondan mirando su PPT, no de memoria.',
  '<b>Vocabulario (parte de las preguntas iniciales).</b> Ocho términos del plan: revisión, exactitud, fuente, edición, retroalimentación, ensayo, claridad y evidencia. Completan ocho frases eligiendo entre tres opciones; cada acierto muestra cómo se usa el término en el taller.',
  '<b>Modelamiento 1/3: control científico final (10 min en total).</b> El docente modela cómo revisar una diapositiva borrador (ficticia) con cinco controles: <b>afirmación, fuente, fecha, coherencia con los OA y lenguaje</b>. Cada fragmento subrayado se clasifica con el control que corresponde; al acertar se muestra un cambio sugerido. Recuerda que un solo error importante basta para no pasar al ensayo.',
  '<b>Modelamiento 2/3: técnica 3C (Correcto · Claro · Cambiar).</b> Seis comentarios ficticios se clasifican en las tres cajas 3D. Después se elige <u>una sola mejora prioritaria</u> entre las de «Cambiar». Insiste en que la revisión cruzada registra lo que está bien (Correcto), lo que se entiende (Claro) y una única mejora que se pueda hacer hoy (Cambiar).',
  '<b>Modelamiento 3/3: retroalimentación útil.</b> Una retroalimentación útil es específica (dice dónde y qué) y realizable (se puede hacer antes de la feria). Se comparan cuatro comentarios vagos con reescrituras; luego cada estudiante escribe el suyo y el revisor orientativo comprueba «dónde», «qué» y «para qué». La revisión humana prevalece.',
  '<b>Actividad central 1/4 · bloque de finalización (40 min en total).</b> Tablero de 12 tareas (información, gráfico o modelo, fuentes y diseño) más los pendientes que salieron de las preguntas iniciales. Cada tarea avanza por tres estados: por hacer, en curso y lista. Mientras trabajan, circula con la pregunta: «¿cómo lo comprobarías?».',
  '<b>Actividad central 2/4 · punto de control docente.</b> <u>No se aprueba para ensayo</u> si faltan fuentes, existen errores científicos importantes o aparece lenguaje estigmatizante. El grupo se autochequea con nueve preguntas; el sello «aprobado para ensayo» lo confirma el docente con la pauta, no la pantalla.',
  '<b>Actividad central 3/4 · revisión cruzada y copia final.</b> Otro grupo registra una frase en «Correcto», una en «Claro» y <b>una sola mejora prioritaria</b> en «Cambiar»; el revisor orientativo comprueba que sea específica y realizable. Luego el equipo incorpora la mejora y guarda una copia final con nombre estandarizado (el formato propuesto es solo un ejemplo: usa el que indique el docente).',
  '<b>Actividad central 4/4 · ensayo de 3 a 4 minutos.</b> Cada integrante habla; un integrante controla el tiempo, el volumen, el orden y la lectura excesiva. El anillo 3D muestra cuánto habló cada persona y marca la zona de 3 a 4 minutos. Usa «Demo ×10» solo para mostrar el funcionamiento al curso.',
  '<b>Puesta en común (10 min).</b> Cada grupo informa su estado final (listo, casi listo o requiere corrección importante), se registra el orden de presentación y el rol de cada integrante. Las sugerencias de orden son orientativas: la decisión es del docente.',
  '<b>Ticket de salida (5 min).</b> «La mejora más importante que incorporamos fue ____. Durante el ensayo debemos recordar ____.» Autoevaluación con los cuatro criterios del plan. Descarga el registro en un archivo de texto. <b>Avisa:</b> la próxima clase (28) es la Feria de Autocuidado Informado; el PPT debe estar listo y cada integrante debe conocer su parte.',
];

// ---- las siete diapositivas del PPT (plan de la clase 26) ----
export const SLIDES7 = [
  { n: 1, t: 'Título y pregunta' }, { n: 2, t: 'Conceptos clave' }, { n: 3, t: 'Modelo o proceso' }, { n: 4, t: 'Mito y evidencia' },
  { n: 5, t: 'Dato, tabla o gráfico' }, { n: 6, t: 'Autocuidado y respeto' }, { n: 7, t: 'Ayuda y fuentes' },
];

// ---- Diapositiva 3 · semáforo y meta ----
export const AVANCE = [
  { t: 'Completa', s: 'Completa', c: 'gr', hint: 'Las siete diapositivas completas = verde.' },
  { t: 'Faltan 1–2 elementos', s: 'Faltan 1–2', c: 'yl', hint: 'Faltan uno o dos elementos = amarillo.' },
  { t: 'Falta contenido importante', s: 'Falta lo importante', c: 'rd', hint: 'Falta contenido importante = rojo.' },
];
export const TAREAS = ['Completar información', 'Hacer o ajustar el gráfico', 'Verificar fuentes', 'Ajustar el diseño', 'Preparar el ensayo'];
export const META_VERBS = /(?<![a-záéíóúñ])(terminar|completar|verificar|revisar|agregar|reducir|corregir|citar|ajustar|ensayar|reemplazar|incluir|ordenar|cambiar|escribir|cerrar|tener|dejar)(?![a-záéíóúñ])/i;
export const META_EXAMPLES = ['Terminar las diapositivas 4 y 5 y citar la fuente de cada gráfico antes del ensayo.', 'Reducir la diapositiva 6 a una idea y completar la lista de fuentes de la diapositiva 7.'];

// ---- Diapositiva 4 · preguntas iniciales (autocontrol) ----
export const CHECKQ = [
  { q: '¿Qué parte del PPT todavía no responde la pregunta central?', opts: ['Todas la responden', 'Alguna no la responde', 'No lo sé'], task: 'Releer la pregunta central y anotar, en cada diapositiva, cómo ayuda a responderla.' },
  { q: '¿Hay afirmaciones que no tienen fuente?', opts: ['Todas tienen fuente', 'Hay afirmaciones sin fuente', 'No lo sé'], task: 'Buscar una fuente institucional para cada afirmación o eliminarla.' },
  { q: '¿Alguna diapositiva tiene demasiado texto?', opts: ['Ninguna', 'Alguna sí', 'No lo sé'], task: 'Dejar una idea por diapositiva (referencia: unas 40 palabras) y pasar el detalle a la exposición oral.' },
  { q: '¿Nuestro gráfico o modelo realmente ayuda a comprender?', opts: ['Sí, ayuda', 'Aún no ayuda', 'No lo sé'], task: 'Revisar título, unidad y año del gráfico; probarlo con otro grupo: ¿se entiende en 10 segundos?' },
  { q: '¿Todos los integrantes pueden explicar su parte sin leerla completa?', opts: ['Sí, todos', 'Aún no todos', 'No lo sé'], task: 'Practicar la parte oral con tres palabras clave, sin leer la diapositiva completa.' },
];

// ---- Diapositiva 5 · vocabulario (8 términos del plan) ----
export const VOCAB = [
  { t: 'exactitud', s: 'Si una frase dice lo mismo que la fuente, sin errores ni exageraciones, tiene ____.', alt: ['edición', 'ensayo'], use: 'Se revisa afirmación por afirmación en el control científico.' },
  { t: 'retroalimentación', s: 'Un comentario específico que ayuda a mejorar un trabajo es una ____.', alt: ['evidencia', 'revisión'], use: 'La técnica 3C la organiza en Correcto, Claro y Cambiar.' },
  { t: 'ensayo', s: 'Practicar la exposición completa, con tiempo, antes de la feria es un ____.', alt: ['edición', 'fuente'], use: 'Dura de 3 a 4 minutos y todos participan.' },
  { t: 'revisión', s: 'Comprobar con atención que todo esté correcto antes de entregar es una ____.', alt: ['claridad', 'evidencia'], use: 'Primero la hace el grupo y luego otro grupo.' },
  { t: 'edición', s: 'Mejorar una diapositiva cortando, ordenando y corrigiendo se llama ____.', alt: ['fuente', 'exactitud'], use: 'Hoy se edita para dejar una idea por diapositiva.' },
  { t: 'claridad', s: 'Que se entienda de un vistazo, con poco texto y buen contraste, es ____.', alt: ['evidencia', 'retroalimentación'], use: 'Se mide con la pregunta: ¿se entiende en 10 segundos?' },
  { t: 'evidencia', s: 'Los datos verificables que respaldan una idea son la ____.', alt: ['edición', 'revisión'], use: 'Gráfico, modelo o dato de una fuente confiable.' },
  { t: 'fuente', s: 'El origen identificable y verificable de una información es la ____.', alt: ['revisión', 'ensayo'], use: 'Se cita al pie y se lista en la diapositiva 7.' },
];

// ---- Diapositiva 6 · control científico final (borrador FICTICIO) ----
export const CONTROLES = [
  { id: 'afirmacion', t: 'Afirmación', q: '¿Es exacta y no exagera?' },
  { id: 'fuente', t: 'Fuente', q: '¿Se puede comprobar?' },
  { id: 'fecha', t: 'Fecha', q: '¿Está actualizada?' },
  { id: 'oa', t: 'Coherencia con OA', q: '¿Está dentro de OA 1–3?' },
  { id: 'lenguaje', t: 'Lenguaje', q: '¿Es respetuoso?' },
];
export const BORRADOR = [
  { id: 'b1', txt: 'Todas las personas sienten los cambios de la pubertad al mismo tiempo.', ctl: 'afirmacion', fix: 'Cambiar por «las personas viven los cambios en momentos distintos», como indica la fuente.' },
  { id: 'b2', txt: 'Fuente: un blog de salud sin autoría.', ctl: 'fuente', fix: 'Reemplazar por una fuente institucional con nombre de la institución y año.' },
  { id: 'b3', txt: 'Datos publicados en 2009.', ctl: 'fecha', fix: 'Buscar la versión vigente de la fuente oficial o indicar por qué se usa un dato antiguo.' },
  { id: 'b4', txt: 'Además, así funciona la fotosíntesis en las plantas.', ctl: 'oa', fix: 'Quitar: es un tema de otra unidad y no responde la pregunta central.' },
  { id: 'b5', txt: 'Quienes no se cuidan son irresponsables.', ctl: 'lenguaje', fix: 'Cambiar por un mensaje sobre medidas y dónde consultar, sin juzgar a las personas.' },
];

// ---- Diapositiva 7 · técnica 3C (comentarios FICTICIOS) ----
export const C3 = [
  { id: 'Correcto', c: 'gr', q: 'Lo que está exacto y respaldado' },
  { id: 'Claro', c: 'bl', q: 'Lo que se entiende de un vistazo' },
  { id: 'Cambiar', c: 'rd', q: 'Lo que conviene mejorar (una prioritaria)' },
];
export const C3_NOTES = [
  { t: 'La fuente es institucional y tiene año.', bin: 0 },
  { t: 'Explica que la edad de inicio varía, igual que la fuente.', bin: 0 },
  { t: 'El gráfico tiene título y unidad: se entiende en pocos segundos.', bin: 1 },
  { t: 'Cada diapositiva tiene una sola idea y poco texto.', bin: 1 },
  { t: 'En la diap. 5 dice «todos» sin datos: cambiar por «en este caso ficticio se observa…».', bin: 2, best: true },
  { t: 'La diap. 6 tiene 90 palabras: dejar una frase y pasar el resto a la exposición.', bin: 2 },
];
export const C3_PRIORITY = 'La mejor prioridad es la que corrige un error de exactitud: una afirmación absoluta sin datos pesa más que el largo de una diapositiva.';

// ---- Diapositiva 8 · retroalimentación útil ----
export const VAGUE = [
  { v: 'Está muy feo el diseño.', o: [
    { t: 'Podría ser más bonito.', k: 0, fb: 'Vaga: no dice dónde ni qué cambiar.' },
    { t: 'Cambia todo el diseño, empezando de cero.', k: 1, fb: 'Específica pero no realizable antes de la feria.' },
    { t: 'En la diap. 4 deja una sola idea y sube el contraste del título para que se lea desde el fondo.', k: 2, fb: 'Dice dónde, qué y para qué, y se puede hacer hoy.' } ] },
  { v: 'Faltan cosas.', o: [
    { t: 'Faltan muchas cosas importantes.', k: 0, fb: 'Vaga: ¿qué cosas?, ¿dónde?' },
    { t: 'Agrega todas las fuentes que existan sobre el tema.', k: 1, fb: 'No es realizable: no hay tiempo ni criterio.' },
    { t: 'En la diap. 7 agrega la referencia del gráfico (institución y año) para poder comprobarlo.', k: 2, fb: 'Concreta y realizable.' } ] },
  { v: 'El gráfico no se entiende.', o: [
    { t: 'No me gusta el gráfico.', k: 0, fb: 'Es una opinión: no orienta la mejora.' },
    { t: 'Hazlo de nuevo con otros datos.', k: 1, fb: 'Cambia el contenido completo: no es realizable ni necesario.' },
    { t: 'En la diap. 5 agrega título y unidad al gráfico porque, sin ellos, no se sabe qué se mide.', k: 2, fb: 'Específica, realizable y explica el motivo.' } ] },
  { v: 'Hay un error científico.', o: [
    { t: 'Está mal lo que dice.', k: 0, fb: 'Vaga: no indica cuál es el error.' },
    { t: 'Revisa toda la ciencia del PPT.', k: 1, fb: 'Demasiado amplia para una sola sesión.' },
    { t: 'En la diap. 3 cambia «todas las personas» por «las personas», ya que la fuente indica que varía.', k: 2, fb: 'Señala dónde, qué cambiar y respalda con la fuente.' } ] },
];
export const FB_VERBS = /(?<![a-záéíóúñ])(cambia|agrega|quita|reduce|reemplaza|ordena|cita|escribe|sube|baja|divide|revisa|corrige|completa|deja|incluye|añade|elimina|ajusta|pon)(?![a-záéíóúñ])/i;

// ---- Diapositiva 9 · tablero de tareas ----
export const ST_TASK = ['Por hacer', 'En curso', 'Lista'];
export const CATS = [
  { id: 'info', t: 'Información', c: 'bl', items: ['Las 7 diapositivas tienen su contenido', 'La pregunta central se responde con los OA', 'Una idea y pocas palabras por diapositiva'] },
  { id: 'graf', t: 'Gráfico o modelo', c: 'gr', items: ['Título, unidad y año del gráfico o modelo', 'Apoya una conclusión prudente', 'Marcado «ilustrativo» si los datos son de ejemplo'] },
  { id: 'fuen', t: 'Fuentes', c: 'rd', items: ['Dos o más fuentes institucionales', 'Referencia corta al pie de cada diapositiva', 'Lista de fuentes en la diapositiva 7'] },
  { id: 'dise', t: 'Diseño y lenguaje', c: 'vi', items: ['Buen contraste y letra legible desde el fondo', 'Sin imágenes clínicas explícitas ni sensacionalistas', 'Lenguaje respetuoso, sin afirmaciones absolutas'] },
];

// ---- Diapositiva 10 · punto de control docente ----
export const GATES = [
  { id: 'g1', t: 'Fuentes', c: 'bl', items: ['Cada afirmación importante tiene fuente', 'Hay al menos dos fuentes institucionales', 'Las fechas de las fuentes son visibles'] },
  { id: 'g2', t: 'Exactitud científica', c: 'gr', items: ['Sin afirmaciones absolutas ni inexactas', 'Los conceptos están dentro de los OA 1–3', 'El gráfico o modelo no se interpreta de más'] },
  { id: 'g3', t: 'Lenguaje respetuoso', c: 'rd', items: ['Sin lenguaje estigmatizante', 'Sin ejemplos identificables de compañeros', 'Mensajes sin miedo ni vergüenza'] },
];

// ---- Diapositiva 11 · revisión cruzada y copia final ----
export const TEMAS = ['Pubertad', 'CicloMenstrual', 'Fecundacion', 'MetodosYResponsabilidad', 'ITS', 'FuentesYMitos'];
export const NAME_RE = /^[A-Za-z0-9_]+_G[1-9]_vFinal\.pptx$/;

// ---- Diapositiva 12 · ensayo ----
export const CONTROL_ENSAYO = ['Controlé el tiempo (3 a 4 minutos)', 'Controlé el volumen de voz', 'Controlé el orden de las partes', 'Avisé si alguien leía la diapositiva completa'];
export const MEMBER_COLORS = ['#e5311f', '#2a4bff', '#12a150', '#7a3cff', '#ff8a00', '#00a3b8'];

// ---- Diapositiva 13 · estado final y orden ----
export const ESTADOS = ['Listo', 'Casi listo', 'Requiere corrección importante'];
export const ROLES = ['Presenta una parte', 'Controla el tiempo', 'Responde preguntas', 'Apoya con el material'];

// ---- Diapositiva 14 · ticket ----
export const MEJORAS = ['una afirmación corregida', 'una fuente institucional agregada', 'menos texto en una diapositiva', 'el título y la unidad del gráfico', 'un mensaje más respetuoso', 'la copia final guardada'];
export const RECORDAR = ['hablar con calma y sin leer', 'cuidar el tiempo (3 a 4 minutos)', 'mirar a la audiencia', 'decir de qué fuente sale cada dato', 'usar palabras respetuosas', 'repartir la palabra'];
export const SELF = [
  { id: 'f1', t: 'Finaliza las siete diapositivas', c: 'bl' },
  { id: 'f2', t: 'Corrige errores científicos', c: 'gr' },
  { id: 'f3', t: 'Integra retroalimentación', c: 'rd' },
  { id: 'f4', t: 'Demuestra preparación oral y participación distribuida', c: 'vi' },
];
export const NEXT_NOTICE = 'La próxima clase realizaremos la Feria de Autocuidado Informado. El PPT debe estar listo y cada integrante debe conocer su parte.';
