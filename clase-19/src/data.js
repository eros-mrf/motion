// Contenido pedagógico de la Clase 19 (Plan de Unidad 4 · Ciencias Naturales 7°).
// Los resultados de búsqueda, páginas y mensajes son SIMULADOS (ilustrativos). Las "evidencias" son
// paráfrasis de recomendaciones sanitarias generales; el docente proyecta la fuente oficial vigente.

export const PHASES = {
  intro:        { name: 'Inicio · ruta',       min: 10, color: 'var(--gold)' },
  activacion:   { name: 'Activación',          min: 10, color: 'var(--gold)' },
  preguntas:    { name: 'Preguntas iniciales', min: 10, color: 'var(--blue)' },
  modelamiento: { name: 'Modelamiento',        min: 15, color: 'var(--lime)' },
  actividad:    { name: 'Actividad central',   min: 35, color: 'var(--pink)' },
  comun:        { name: 'Puesta en común',     min: 10, color: 'var(--blue)' },
  ticket:       { name: 'Ticket y aviso',      min: 10, color: 'var(--gold)' },
};

export const NOTES = [
  '<b>Portada.</b> Esta es la clase en sala de computación: se investiga <u>una</u> ITS asignada a cada grupo con fuentes oficiales. Anuncia el producto: una <b>ficha científica digital con referencias</b>. Cuida que nadie busque síntomas propios ni de otras personas.',
  '<b>Ruta (10 min con la activación).</b> Las cinco etapas de la ruta son también la lista de tareas del grupo. Recuerda los acuerdos: casos y fuentes, nunca experiencias personales; imágenes no explícitas; consultas personales se derivan en privado según protocolo.',
  '<b>Activación: «dos fuentes antes de escribir».</b> Cada grupo debe mostrarte tres datos de cada fuente: institución, fecha o vigencia y propósito de la página. Usa la anatomía de la página para modelar dónde buscarlos (encabezado, «actualizado el…», «quiénes somos»).',
  '<b>Preguntas iniciales (10 min).</b> Tócalas una por una; cada una abre una pista. Idea fuerza: el OA 3 pide agente, transmisión, síntomas generales, consecuencias/secuelas y prevención; lo demás es ruido. Anota las respuestas del curso como criterios de la clase.',
  '<b>Vocabulario.</b> Deja visible el glosario (DUA: representación). El buscador filtra los términos; pide que usen uno en una frase propia.',
  '<b>Modelamiento 1/4 (15 min en total): auditar fuentes.</b> Gira la biblioteca 3D y pide al grupo que decida: usar / usar con cuidado / descartar. Las páginas son tipos de fuente simulados. Prioridad: Currículum Nacional, MINSAL/DIPRECE y organismos sanitarios reconocidos. Evitar foros y redes sociales como fuente principal.',
  '<b>Modelamiento 2/4: búsqueda acotada.</b> No se trata de reunir la mayor cantidad de texto. Muestra cómo cada palabra clave reduce millones de resultados a unos pocos útiles, y por qué «cura rápida» o «foro» empeoran la búsqueda. Resultados simulados.',
  '<b>Modelamiento 3/4: de un párrafo a tres ideas.</b> Se modela la ficha de síntesis: subrayar ideas centrales, parafrasear y registrar la fuente. Contrasta copiar vs. parafrasear con el medidor. Resultado esperado: tres ideas propias, exactas y con referencia.',
  '<b>Modelamiento 4/4: agente, virus o bacteria.</b> Modelo esquemático no a escala (OAH i). Las bacterias son células completas y tratables con antibióticos; los virus necesitan células para reproducirse y no responden a antibióticos. También existen otros agentes (hongos, parásitos), pero hoy se trabaja virus y bacterias.',
  '<b>Actividad central 1/3 (35 min en total): roles.</b> Coordinador, investigador 1, investigador 2, sintetizador, encargado de fuentes y revisor científico. Sortea o asigna; con grupos de menos de 6, un estudiante toma dos roles complementarios (p. ej., investigador + fuentes).',
  '<b>Actividad central 2/3: ficha científica digital.</b> Siete campos + afirmación frecuente con corrección + imagen o ícono no explícito con procedencia. Cada dato se rotula con su fuente (F1/F2). Usa «Cargar ejemplo del docente» para modelar el flujo completo antes de que trabajen solos.',
  '<b>Actividad central 3/3: control de calidad.</b> Otro integrante, que no redactó, revisa si la ficha responde al OA 3 con los 8 criterios. No se entrega hasta alcanzar al menos 7 de 8. Refuerza: no copiar párrafos completos.',
  '<b>Puesta en común (10 min).</b> Dos grupos muestran cómo parafrasearon sin perder exactitud. El duelo de paráfrasis sirve de ejemplo del curso. Cada equipo entrega la ficha o la guarda en la carpeta definida.',
  '<b>Ticket de salida (10 min).</b> «La fuente más útil de nuestro grupo fue ____ porque ____». Evaluación formativa: usa ≥ 2 fuentes pertinentes, selecciona información del OA 3, parafrasea y registra referencias, distribuye responsabilidades y revisa la calidad. <b>Aviso:</b> clase 20, datos de salud pública (tablas y gráficos oficiales).',
];

// ---- Slide 3 · anatomía de una fuente ----
export const ANATOMY = [
  { id: 'inst', n: 1, name: 'Institución', q: '¿Quién publica?', tip: 'Busca el nombre y logo en el encabezado y en «Quiénes somos». Prioriza ministerios, organismos sanitarios y el Currículum Nacional.' },
  { id: 'date', n: 2, name: 'Fecha o vigencia', q: '¿Está actualizada?', tip: 'Busca «Actualizado el…» o la fecha de publicación. La información de salud cambia: una página sin fecha no sirve de respaldo.' },
  { id: 'purp', n: 3, name: 'Propósito', q: '¿Para qué existe la página?', tip: 'Informar y educar no es lo mismo que vender productos o captar clics. Si hay publicidad o promesas milagrosas, desconfía.' },
];

// ---- Slide 4 · preguntas ----
export const QUESTIONS = [
  { q: '¿Qué pregunta queremos responder sobre nuestra ITS?',
    idea: 'Una buena pregunta de investigación es acotada: «¿Cómo se transmite, qué síntomas generales puede tener, qué consecuencias y cómo se previene?». Se formula antes de buscar.' },
  { q: '¿Qué información exige exactamente el OA 3?',
    idea: 'Características de la ITS: mecanismos de transmisión, medidas de prevención, síntomas generales, consecuencias y posibles secuelas. Más datos no significa mejor ficha.' },
  { q: '¿Cómo evitaremos copiar párrafos completos?',
    idea: 'Leer, cerrar la pestaña, escribir con palabras propias y volver a comparar. Si la frase suena igual al original, hay que reformularla y citar la fuente.' },
  { q: '¿Qué hacemos si dos fuentes presentan distinta profundidad o terminología?',
    idea: 'Se comparan: se usa el término más preciso, se explica la diferencia con palabras sencillas y se deja constancia de ambas referencias. Si se contradicen, se consulta al docente.' },
  { q: '¿Cómo registraremos la procedencia de cada dato?',
    idea: 'Cada dato lleva una etiqueta (F1, F2) que remite a la lista de referencias: institución, título, fecha y dirección. Lo que no tiene origen, no entra a la ficha.' },
];

// ---- Slide 5 · vocabulario ----
export const VOCAB = [
  { t: 'investigación documental', d: 'Búsqueda, lectura y análisis de documentos y fuentes para responder una pregunta, sin hacer experimentos.', c: 'blue', ex: 'Reunir y comparar dos fuentes oficiales.' },
  { t: 'fuente oficial', d: 'Documento o sitio publicado por una institución responsable, como un ministerio u organismo sanitario reconocido.', c: 'lime', ex: 'Currículum Nacional, MINSAL, OMS.' },
  { t: 'síntesis', d: 'Resumen que reúne las ideas centrales con palabras propias, sin perder exactitud.', c: 'gold', ex: 'Tres ideas centrales de un párrafo.' },
  { t: 'agente', d: 'Organismo que causa la infección, por ejemplo un virus o una bacteria.', c: 'pink', ex: 'Virus o bacteria.' },
  { t: 'transmisión', d: 'Forma en que el agente pasa de una persona a otra o de una situación de exposición a una persona.', c: 'blue', ex: 'Contacto sexual sin protección; sangre; de madre a hijo/a.' },
  { t: 'prevención', d: 'Medidas que reducen la probabilidad de adquirir o transmitir una infección.', c: 'lime', ex: 'Información confiable, barrera, vacunación, consulta.' },
  { t: 'síntoma general', d: 'Señal amplia que puede aparecer o no y que no basta para diagnosticar.', c: 'gold', ex: 'Molestias poco específicas o ausencia de síntomas.' },
  { t: 'consecuencia', d: 'Efecto que puede tener una infección en la salud si no se atiende a tiempo; incluye posibles secuelas.', c: 'pink', ex: 'Complicaciones si no hay tratamiento.' },
  { t: 'referencia', d: 'Dato que permite encontrar la fuente: institución, título, fecha y dirección web.', c: 'blue', ex: 'MINSAL. Título. 2024. Dirección web.' },
];

// ---- Slide 6 · biblioteca 3D de fuentes (tipos simulados) ----
// inst / date / purp: ¿se identifica claramente? · verdict: use | care | drop
export const SOURCES = [
  { id: 'minsal', title: 'Ministerio de Salud', sub: 'Guía educativa sobre ITS', host: 'sitio ministerial (.cl)', kind: 'Oficial', color: '#b8ff3c', inst: true, date: true, purp: true, verdict: 'use',
    why: 'Institución pública responsable, con fecha de actualización y propósito educativo. Es fuente prioritaria.' },
  { id: 'curric', title: 'Currículum Nacional', sub: 'Recursos del programa de estudio', host: 'plataforma Mineduc (.cl)', kind: 'Oficial educativa', color: '#b8ff3c', inst: true, date: true, purp: true, verdict: 'use',
    why: 'Plataforma oficial del Mineduc, alineada con el OA de la unidad. Úsala para verificar lo que pide el OA 3.' },
  { id: 'oms', title: 'Organización Mundial de la Salud', sub: 'Hoja informativa para el público', host: 'organismo sanitario internacional', kind: 'Organismo sanitario', color: '#b8ff3c', inst: true, date: true, purp: true, verdict: 'use',
    why: 'Organismo sanitario reconocido, con fecha y referencias. Puede estar en inglés: usa la versión en español.' },
  { id: 'univ', title: 'Hospital universitario', sub: 'Guía para pacientes', host: 'sitio académico/clínico', kind: 'Institucional', color: '#ffcf3d', inst: true, date: false, purp: true, verdict: 'care',
    why: 'Institución real y propósito educativo, pero sin fecha visible: confirma vigencia con otra fuente oficial.' },
  { id: 'noticia', title: 'Medio de prensa', sub: 'Reportaje sobre un brote', host: 'sitio de noticias', kind: 'Prensa', color: '#ffcf3d', inst: true, date: true, purp: false, verdict: 'care',
    why: 'Tiene autor y fecha, pero su propósito es informar sobre un hecho, no explicar la infección. Complementa; no reemplaza.' },
  { id: 'blog', title: 'Blog de bienestar', sub: '«Cura natural en 3 días»', host: 'blog con anuncios', kind: 'Comercial', color: '#ff4d94', inst: false, date: false, purp: false, verdict: 'drop',
    why: 'Sin institución, sin fecha y con propósito de venta. Promete resultados milagrosos: descártalo.' },
  { id: 'social', title: 'Publicación en red social', sub: 'Captura reenviada', host: 'red social', kind: 'Red social', color: '#ff4d94', inst: false, date: false, purp: false, verdict: 'drop',
    why: 'Autoría incierta y sin respaldo. Las redes sociales no son fuente principal; solo sirven como ejemplo de afirmación a verificar.' },
  { id: 'foro', title: 'Foro anónimo', sub: 'Hilo de comentarios', host: 'foro', kind: 'Foro', color: '#ff4d94', inst: false, date: false, purp: false, verdict: 'drop',
    why: 'Opiniones anónimas, sin verificación. No se usa como fuente en una investigación documental.' },
];
export const VERDICTS = {
  use: { label: 'Usar', cls: 'lime' }, care: { label: 'Usar con cuidado', cls: 'gold' }, drop: { label: 'Descartar', cls: 'pink' },
};

// ---- Slide 7 · constructor de búsqueda (resultados simulados) ----
export const QUERY_CHIPS = [
  { id: 'name', label: 'nombre de la ITS', good: true, cut: 0.02 },
  { id: 'trans', label: 'transmisión', good: true, cut: 0.35 },
  { id: 'prev', label: 'prevención', good: true, cut: 0.4 },
  { id: 'minsal', label: 'MINSAL', good: true, cut: 0.15 },
  { id: 'oms', label: 'OMS', good: true, cut: 0.25 },
  { id: 'foro', label: 'foro', good: false, cut: 4 },
  { id: 'cura', label: 'cura rápida', good: false, cut: 3 },
];
export const RESULTS = [
  { t: 'Infecciones de transmisión sexual: qué son y cómo prevenirlas', h: 'Ministerio de Salud', tag: 'oficial', need: ['minsal'] },
  { t: 'Hoja informativa para el público sobre ITS', h: 'Organización Mundial de la Salud', tag: 'oficial', need: ['oms'] },
  { t: 'Programa de Ciencias Naturales 7°: Unidad 4', h: 'Currículum Nacional (Mineduc)', tag: 'oficial', need: ['prev'] },
  { t: 'Guía para pacientes: infecciones y consulta', h: 'Hospital universitario', tag: 'cuidado', need: ['trans'] },
  { t: '«Cura natural en 3 días»: el secreto que no te cuentan', h: 'Blog con anuncios', tag: 'descartar', need: ['cura'] },
  { t: 'Hilo: «¿alguien tiene esto?» (anónimo)', h: 'Foro anónimo', tag: 'descartar', need: ['foro'] },
  { t: 'Todo sobre las ITS (sin autor ni fecha)', h: 'Sitio genérico', tag: 'descartar', need: [] },
];

// ---- Slide 8 · síntesis: de un párrafo a tres ideas ----
export const PARAGRAPH = [
  { s: 'Las infecciones de transmisión sexual (ITS) son causadas por virus, bacterias y, en algunos casos, otros organismos.', key: false },
  { s: 'Se transmiten principalmente por contacto sexual sin protección, y algunas también por vía sanguínea o de madre a hijo/a durante el embarazo, el parto o la lactancia.', key: 'trans' },
  { s: 'Muchas personas no presentan síntomas, o estos son poco específicos, por lo que la ausencia de molestias no permite descartar una infección.', key: 'sint' },
  { s: 'Las ITS de origen bacteriano tienen tratamiento con antibióticos indicados por un profesional de la salud.', key: false },
  { s: 'La información confiable, el uso correcto de medidas de barrera, la vacunación cuando existe y la consulta oportuna ayudan a prevenirlas.', key: 'prev' },
];
export const IDEAS = {
  trans: { name: 'Transmisión', para: 'Pasan de una persona a otra sobre todo por contacto sexual sin protección; algunas también por sangre o de madre a hijo/a.', ref: 'F1' },
  sint: { name: 'Síntomas generales', para: 'Pueden no notarse o ser poco claros, así que sentirse bien no demuestra que no haya infección.', ref: 'F1' },
  prev: { name: 'Prevención', para: 'Se combinan información confiable, protección de barrera, vacunas cuando existen y atención de salud a tiempo.', ref: 'F2' },
};
export const COPY_DEMO = {
  copy: { label: 'Copiar y pegar', text: 'Se transmiten principalmente por contacto sexual sin protección, y algunas también por vía sanguínea o de madre a hijo/a durante el embarazo, el parto o la lactancia.', sim: 96, acc: 100 },
  para: { label: 'Parafrasear', text: IDEAS.trans.para, sim: 24, acc: 100 },
};

// ---- Slide 9 · agentes 3D ----
export const AGENTS = {
  virus: {
    name: 'Virus', color: '#4d8dff',
    facts: ['No es una célula: es material genético dentro de una cubierta de proteínas.', 'Necesita entrar a células de otro organismo para reproducirse.', 'No responde a antibióticos; algunas infecciones virales se controlan con tratamiento específico y seguimiento.'],
    pins: [{ id: 'v1', label: 'Proteínas de superficie', at: [1.15, 0.8, 0.4] }, { id: 'v2', label: 'Material genético', at: [0, 0, 0] }],
    ex: 'Ejemplos de ITS virales: VIH, VPH, herpes.',
  },
  bacteria: {
    name: 'Bacteria', color: '#b8ff3c',
    facts: ['Es una célula completa y viva, con su propia maquinaria.', 'Se reproduce por sí sola.', 'Las infecciones bacterianas suelen tratarse con antibióticos indicados por un profesional de la salud.'],
    pins: [{ id: 'b1', label: 'Pared celular', at: [0.0, 0.95, 0.3] }, { id: 'b2', label: 'Material genético', at: [0.1, 0.1, 0.0] }, { id: 'b3', label: 'Flagelos', at: [-1.9, -0.2, 0] }],
    ex: 'Ejemplos de ITS bacterianas: sífilis, gonorrea, clamidia.',
  },
};

// ---- Slide 10 · roles ----
export const ROLES = [
  { id: 'coord', name: 'Coordinador/a', icon: '◈', c: 'gold', does: 'Organiza el tiempo, reparte tareas y cuida que todas y todos participen.', tool: 'Lista de tareas y reloj de la clase.' },
  { id: 'inv1', name: 'Investigador/a 1', icon: '⌕', c: 'blue', does: 'Busca y lee la fuente 1: agente, transmisión y síntomas generales.', tool: 'Palabras clave acotadas.' },
  { id: 'inv2', name: 'Investigador/a 2', icon: '⌕', c: 'blue', does: 'Busca y lee la fuente 2: consecuencias, secuelas, prevención y orientación.', tool: 'Palabras clave acotadas.' },
  { id: 'sint', name: 'Sintetizador/a', icon: '✎', c: 'lime', does: 'Parafrasea las ideas centrales y redacta la ficha con palabras propias.', tool: 'Plantilla de ficha.' },
  { id: 'fuentes', name: 'Encargado/a de fuentes', icon: '❡', c: 'pink', does: 'Valida cada fuente (institución, fecha, propósito) y registra las referencias.', tool: 'Etiquetas F1, F2.' },
  { id: 'rev', name: 'Revisor/a científico/a', icon: '✓', c: 'lime', does: 'No redactó: revisa exactitud, respeto y que la ficha responda al OA 3.', tool: 'Los 8 criterios de calidad.' },
];

// ---- Slide 11 · ficha científica ----
export const FIELDS = [
  { id: 'agente', short: 'Agente', name: 'Agente', icon: '◉', hint: 'Virus o bacteria (y nombre del agente).', src: true },
  { id: 'transm', short: 'Transmisión', name: 'Mecanismo de transmisión', icon: '⇄', hint: '¿Cómo pasa de una persona a otra?', src: true },
  { id: 'sint', short: 'Síntomas', name: 'Síntomas generales', icon: '≈', hint: 'Sin diagnosticar: puede haber o no síntomas.', src: true },
  { id: 'conse', short: 'Consecuencias', name: 'Consecuencias o secuelas', icon: '△', hint: 'Qué puede pasar si no se atiende a tiempo.', src: true },
  { id: 'prev', short: 'Prevención', name: 'Medidas de prevención', icon: '⬡', hint: 'Qué medidas reducen el riesgo.', src: true },
  { id: 'orient', short: 'Orientación', name: 'Dónde buscar orientación', icon: '✚', hint: 'Red de salud, adulto responsable, línea sanitaria.', src: true },
  { id: 'fuentes', short: 'Fuentes', name: 'Fuentes (mínimo 2)', icon: '❡', hint: 'Institución. Título. Fecha. Dirección.', src: false },
  { id: 'mito', short: 'Mito y corrección', name: 'Afirmación frecuente + corrección', icon: '✕', hint: 'Una frase que circula y su corrección con evidencia.', src: true },
  { id: 'img', short: 'Imagen', name: 'Imagen o ícono con procedencia', icon: '▣', hint: 'No explícito. Indica de dónde proviene.', src: false },
];
// Ejemplo del docente (genérico, paráfrasis; confirmar con la fuente oficial vigente).
export const FICHA_DEMO = {
  agente: { t: 'Bacteria (Chlamydia trachomatis). Es una célula completa, por eso se trata con antibióticos.', s: ['F1'] },
  transm: { t: 'Se transmite por contacto sexual sin protección y, de madre a hijo/a, durante el parto.', s: ['F1', 'F2'] },
  sint: { t: 'Muchas personas no notan síntomas; si aparecen, son poco específicos y no sirven para diagnosticar.', s: ['F1'] },
  conse: { t: 'Sin tratamiento puede causar complicaciones en el aparato reproductor y afectar la fertilidad.', s: ['F2'] },
  prev: { t: 'Información confiable, uso correcto de preservativo y consulta o testeo oportuno cuando corresponde.', s: ['F1', 'F2'] },
  orient: { t: 'Centro de salud de la red pública, adulto responsable y la línea Salud Responde del Ministerio de Salud.', s: ['F2'] },
  fuentes: { t: 'F1 Ministerio de Salud. Guía educativa sobre ITS. 2024. F2 Organización Mundial de la Salud. Hoja informativa. 2024.', s: [] },
  mito: { t: 'Mito: «sin síntomas no hay infección». Corrección: muchas ITS pueden no dar síntomas perceptibles.', s: ['F1'] },
  img: { t: 'Ícono esquemático de una célula bacteriana, elaborado por el grupo (sin imágenes clínicas).', s: [] },
};

// ---- Slide 12 · control de calidad (radar) ----
export const QC = [
  { id: 'q1', name: 'Agente', full: 'Identifica el agente (virus o bacteria)' },
  { id: 'q2', name: 'Transmisión', full: 'Explica el mecanismo de transmisión' },
  { id: 'q3', name: 'Síntomas', full: 'Describe síntomas generales sin diagnosticar' },
  { id: 'q4', name: 'Consecuencias', full: 'Menciona consecuencias o secuelas' },
  { id: 'q5', name: 'Prevención', full: 'Indica medidas de prevención' },
  { id: 'q6', name: 'Orientación', full: 'Dice dónde buscar ayuda confiable' },
  { id: 'q7', name: '2 fuentes', full: 'Cita al menos dos fuentes oficiales' },
  { id: 'q8', name: 'Paráfrasis', full: 'Usa palabras propias (no copia párrafos)' },
];

// ---- Slide 13 · duelo de paráfrasis ----
export const DUEL = [
  { src: 'Muchas infecciones de transmisión sexual pueden no producir síntomas, por lo que una persona puede tenerlas sin saberlo.',
    opts: [
      { t: 'Muchas infecciones de transmisión sexual pueden no producir síntomas, por lo que una persona puede tenerlas sin saberlo.', ok: false, why: 'Es una copia literal: falta reformular con palabras propias y citar la fuente.', sim: 100, acc: 100 },
      { t: 'Todas las ITS dan síntomas evidentes enseguida.', ok: false, why: 'Cambia el sentido: contradice la fuente. Parafrasear no es inventar.', sim: 12, acc: 5 },
      { t: 'Es posible tener una ITS sin notar señales, porque varias no provocan síntomas perceptibles.', ok: true, why: 'Conserva el significado con palabras propias. Falta solo la etiqueta de la fuente (F1).', sim: 28, acc: 100 },
    ] },
  { src: 'Las infecciones bacterianas de transmisión sexual se tratan con antibióticos indicados por un profesional de la salud.',
    opts: [
      { t: 'Cualquier ITS se cura sola si se toman remedios caseros.', ok: false, why: 'Es una afirmación falsa y peligrosa. No viene de la fuente.', sim: 8, acc: 0 },
      { t: 'Las ITS causadas por bacterias tienen tratamiento con antibióticos, que debe indicar un profesional de la salud.', ok: true, why: 'Mantiene el dato exacto y cambia la estructura de la frase.', sim: 31, acc: 100 },
      { t: 'Las infecciones bacterianas de transmisión sexual se tratan con antibióticos indicados por un profesional de la salud.', ok: false, why: 'Copia literal: reformula y registra la referencia.', sim: 100, acc: 100 },
    ] },
  { src: 'El uso correcto del preservativo reduce el riesgo de transmisión de varias ITS, pero no todas las medidas protegen por igual frente a todas las infecciones.',
    opts: [
      { t: 'El preservativo protege al 100 % de todas las ITS, sin excepciones.', ok: false, why: 'Exagera: los absolutos no están respaldados por la fuente.', sim: 20, acc: 10 },
      { t: 'El uso correcto del preservativo reduce el riesgo de transmisión de varias ITS, pero no todas las medidas protegen por igual frente a todas las infecciones.', ok: false, why: 'Copia literal de la fuente.', sim: 100, acc: 100 },
      { t: 'Usar bien el preservativo disminuye el riesgo de muchas ITS, aunque la protección varía según la infección.', ok: true, why: 'Conserva el matiz («varía según la infección») con palabras propias.', sim: 30, acc: 100 },
    ] },
];

// ---- Slide 14 · ticket ----
export const TICKET_SOURCES = ['el sitio del Ministerio de Salud', 'el Currículum Nacional', 'la hoja informativa de la OMS', 'la guía de un hospital universitario'];
export const TICKET_REASONS = ['tenía institución, fecha y propósito claros', 'explicaba con palabras sencillas el mecanismo de transmisión', 'permitía contrastar datos con la otra fuente', 'indicaba dónde buscar ayuda sanitaria'];
export const SELF = [
  'Usé al menos dos fuentes pertinentes.',
  'Seleccioné información que responde al OA 3.',
  'Parafraseé y registré las referencias.',
  'Cumplí mi rol y revisamos la calidad.',
];
