// Contenido pedagógico de la Clase 18 (Plan de Unidad 4 · Ciencias Naturales 7°).
// Todos los mensajes son FICTICIOS. Las "evidencias" son paráfrasis de recomendaciones sanitarias
// generales (MINSAL / OMS); el docente proyecta la fuente oficial vigente durante la clase.

export const PHASES = {
  intro:        { name: 'Inicio · ruta',        min: 10, color: 'var(--amber)' },
  activacion:   { name: 'Activación',           min: 10, color: 'var(--amber)' },
  preguntas:    { name: 'Preguntas iniciales',  min: 10, color: 'var(--violet)' },
  modelamiento: { name: 'Modelamiento',         min: 15, color: 'var(--cyan)' },
  actividad:    { name: 'Actividad central',    min: 35, color: 'var(--ember)' },
  comun:        { name: 'Puesta en común',      min: 10, color: 'var(--violet)' },
  ticket:       { name: 'Ticket y aviso',       min: 10, color: 'var(--amber)' },
};

export const NOTES = [
  '<b>Portada.</b> Presenta el título y pregunta qué diferencia hay entre repetir algo, suponer algo y poder comprobarlo. Esta clase conecta OA 3 (ITS) con OA 1 (respeto, responsabilidad y convivencia). Recuerda que el fondo reacciona al toque: sirve para captar atención en 1–2 minutos.',
  '<b>Ruta (10 min con la activación).</b> Lee la meta y los tres acuerdos de cuidado. Reitera: no se piden relatos personales; las dudas personales se derivan en privado según protocolo del establecimiento. La barra inferior muestra los 90 minutos (tecla <kbd>T</kbd> inicia el reloj).',
  '<b>Inicio.</b> Cada estudiante marca individualmente <i>evidencia / rumor / necesito verificar</i> y explica <u>solo el criterio</u>. Claves sugeridas: M1 verificar (sin fuente), M2 rumor (exagerado), M3 rumor con prejuicio (estigma), M4 evidencia (cita institución). Si hay desacuerdo, volver al criterio, no a la opinión.',
  '<b>Preguntas iniciales (10 min).</b> Recorre las 5 preguntas; cada una abre una idea para la conversación. Corregir la idea, no a la persona. Anota en la pizarra las palabras que surjan para usarlas en la secuencia A–E–R.',
  '<b>Vocabulario.</b> Deja visible el vocabulario durante toda la clase (DUA: representación). Pide que las y los estudiantes expliquen un término con sus palabras usando un ejemplo ficticio.',
  '<b>Modelamiento 1/4 (15 min en total).</b> Modelo simplificado (OAH i): no representa personas reales. Prueba 0 %, 45 % y 80 % de verificación y pide predecir antes de lanzar. Lo que se observa: cuando más personas verifican, la evidencia circula y el rumor se detiene antes. Haz clic en un punto para iniciar allí.',
  '<b>Modelamiento 2/4.</b> El estigma tiene un costo sanitario: quien teme ser juzgado evita preguntar o consultar. Compara los dos caminos. Mensaje central: buscar ayuda sanitaria es autocuidado, no culpa. Cuidado: no pedir antecedentes personales.',
  '<b>Modelamiento 3/4.</b> El curso toca las palabras o frases que lo hacen dudar. Se completan 7 señales. Aclara que una sola no prueba falsedad; varias juntas indican que hay que verificar. Cierra con la pregunta: ¿qué parte requiere fuente?',
  '<b>Modelamiento 4/4: secuencia A–E–R.</b> Afirmación → Evidencia → Reformulación. Modela el ejemplo completo y cuenta las palabras de la reformulación (≤ 40). Después los grupos repiten el proceso solos. La evidencia mostrada es paráfrasis; proyecta la fuente oficial real (MINSAL / OMS).',
  '<b>Actividad central 1/3 (35 min en total).</b> Cada grupo recibe tres mensajes y una selección breve de fuentes oficiales. Completan: afirmación principal, posible prejuicio, evidencia encontrada y nivel de confiabilidad. Roles rotativos: lector, sintetizador, registrador, verificador. Sin imágenes clínicas ni comentarios reales de estudiantes.',
  '<b>Actividad central 2/3.</b> Reescriben cada mensaje como publicación educativa de máximo 40 palabras y la revisan con tres criterios: exactitud, respeto y claridad. El semáforo es orientativo: la revisión humana del verificador manda. La campaña MINSAL «Conocimiento y Diálogo» puede servir de referencia de comunicación basada en información y derechos.',
  '<b>Actividad central 3/3.</b> Intercambian mensajes entre grupos: subrayan una palabra o frase que podría estigmatizar y proponen mejora con argumento. «Grupo de riesgo» → hablar de situaciones de exposición; «portador» → persona con la infección.',
  '<b>Puesta en común (10 min).</b> Construyan el protocolo de aula: <i>antes de compartir información sensible: verificar, contextualizar y cuidar el lenguaje</i>. Cada grupo comparte su mensaje reescrito y el criterio que más usó. Deja el protocolo visible en la sala.',
  '<b>Ticket de salida (10 min).</b> «Una comunicación responsable sobre salud debe ser ____, ____ y ____». Evaluación formativa: distingue evidencia de rumor, detecta lenguaje estigmatizante, verifica con fuente pertinente y reformula con claridad y respeto. <b>Aviso:</b> la próxima clase es en sala de computación (reservar sala; lista de fuentes oficiales y ficha digital).',
];

// ---- Slide 3 · cuatro mensajes ----
export const MSGS = [
  {
    id: 'A', from: 'Reenviado muchas veces · sin autor',
    text: 'Dicen que hay una nueva ITS en todos los colegios, pero nadie sabe cuál. Cuídense mucho.',
    key: 'verificar', tag: 'Sin fuente',
    why: 'No tiene fuente ni autor: no sabemos quién lo dice ni en qué datos se basa. Antes de creerlo o compartirlo, hay que verificar.',
  },
  {
    id: 'B', from: 'Cadena · mayúsculas y urgencia',
    text: '¡URGENTE! Una sola vez y quedas infectado de por vida. NO existe forma de prevenir. ¡Reenvía a todos YA!',
    key: 'rumor', tag: 'Exagerado',
    why: 'Usa absolutos («una sola vez», «de por vida», «no existe») y urgencia. Las ITS tienen medidas de prevención y muchas se tratan o se controlan.',
  },
  {
    id: 'C', from: 'Publicación ficticia · sin fuente',
    text: 'Las ITS les pasan a personas sucias e irresponsables. Si te pasa, es tu culpa.',
    key: 'rumor', tag: 'Estigmatizante',
    why: 'Culpa y etiqueta a las personas. Una infección depende de cómo se transmite el agente y de la exposición, no del «tipo de persona».',
  },
  {
    id: 'D', from: 'Publicación ficticia · cita a una institución',
    text: 'Según el Ministerio de Salud, las ITS se transmiten principalmente por contacto sexual sin protección y algunas pueden no dar síntomas. Informarse y consultar en la red de salud permite prevenir y tratar a tiempo.',
    key: 'evidencia', tag: 'Respaldado',
    why: 'Cita una institución sanitaria, usa lenguaje general y no culpa a nadie. Aun así, se contrasta con la fuente oficial vigente.',
  },
];

export const CHOICES = [
  { id: 'evidencia', label: 'Evidencia', cls: 'evid' },
  { id: 'rumor', label: 'Rumor', cls: 'rumor' },
  { id: 'verificar', label: 'Necesito verificar', cls: 'amber' },
];

// ---- Slide 4 · preguntas iniciales ----
export const QUESTIONS = [
  { q: '¿Cómo reconocemos que un mensaje usa estigma?',
    idea: 'Busca etiquetas, culpa o burla hacia personas o grupos: «esa gente», «sucios», «se lo buscó». Un hecho describe un agente o un mecanismo; un estigma juzga a una persona.' },
  { q: '¿Qué daño puede producir una información falsa sobre ITS?',
    idea: 'Miedo injustificado, discriminación, decisiones erradas de prevención y personas que evitan consultar por vergüenza. Informar mal también es un riesgo para la salud.' },
  { q: '¿Por qué una afirmación muy segura puede ser incorrecta si no tiene fuente?',
    idea: 'La seguridad del tono no es evidencia. Sin fuente no podemos revisar de dónde sale el dato, a qué población se refiere ni si sigue vigente.' },
  { q: '¿Cómo se corrige una idea errónea sin humillar a quien la cree?',
    idea: 'Se corrige la idea, no a la persona: «hay información más completa…», con la fuente a la vista y sin burla. Así se mantiene la confianza para seguir preguntando.' },
  { q: '¿Qué elementos debería incluir una comunicación científica responsable?',
    idea: 'Una afirmación clara, evidencia con fuente, los límites de lo que no sabemos, lenguaje respetuoso y una ruta de ayuda confiable.' },
];

// ---- Slide 5 · vocabulario ----
export const VOCAB = [
  { t: 'evidencia', d: 'Información observable o medible, con una fuente que podemos revisar, que respalda una afirmación.', c: 'evid' },
  { t: 'prejuicio', d: 'Juicio previo sobre personas o grupos, formado sin evidencia suficiente.', c: 'prej' },
  { t: 'estigma', d: 'Marca negativa que se pone a una persona o grupo y que lleva a rechazo, burla o discriminación.', c: 'rumor' },
  { t: 'desinformación', d: 'Información falsa, incompleta o engañosa que circula, con intención o sin ella.', c: 'rumor' },
  { t: 'verificación', d: 'Contrastar una afirmación con fuentes confiables antes de creerla o compartirla.', c: 'evid' },
  { t: 'derechos', d: 'Garantías de toda persona: recibir atención de salud, privacidad y trato digno.', c: 'amber' },
  { t: 'lenguaje respetuoso', d: 'Palabras que describen hechos sin culpar, burlar ni etiquetar a las personas.', c: 'prej' },
  { t: 'comunicación científica', d: 'Explicar con claridad lo que muestra la evidencia, citando la fuente y reconociendo sus límites.', c: 'evid' },
];

// ---- Slide 6 · lectura dinámica de la simulación ----
export const SIM_READS = {
  wait: 'Elige cuántas personas verifican y lanza un rumor. Observa qué pasa con la evidencia.',
  low: 'Casi nadie verifica: el rumor recorre la red y la evidencia llega tarde o no llega.',
  mid: 'Algunas personas verifican: el rumor avanza más lento y a veces se detiene, pero puede alcanzar a una parte importante de la red.',
  high: 'Muchas personas verifican antes de compartir: la evidencia circula y el rumor se frena pronto.',
  contained: 'El rumor quedó contenido. Verificar antes de compartir protege a toda la red.',
};

// ---- Slide 7 · estigma vs evidencia ----
export const PATHS = {
  A: {
    msg: 'Cuando se culpa o se etiqueta, las personas temen ser juzgadas y evitan preguntar o consultar: la atención llega tarde y la salud de todas y todos se ve afectada.',
    steps: ['Etiqueta o burla', 'Miedo a ser juzgado/a', 'Se evita preguntar o consultar', 'Atención tardía', 'Más riesgo para la salud'],
  },
  B: {
    msg: 'Cuando se informa con fuente y respeto, preguntar es seguro: se consulta a tiempo, se previene mejor y se cuida la salud de todas y todos. Pedir ayuda es autocuidado.',
    steps: ['Dato con fuente', 'Confianza y respeto', 'Se pregunta y se consulta', 'Atención oportuna', 'Prevención y bienestar'],
  },
};

// ---- Slide 8 · detector de señales ----
export const SIGNALS = [
  { k: 'alarma', name: 'Alarma y urgencia', hint: 'Mayúsculas y alarma buscan que reacciones antes de pensar.' },
  { k: 'fuente', name: 'Fuente ausente o indirecta', hint: '«Mi primo dice»: no hay institución ni dato que podamos revisar.' },
  { k: 'general', name: 'Generalización', hint: '«Todos los que…»: casi nunca describe bien a una población completa.' },
  { k: 'autoridad', name: 'Falsa autoridad', hint: 'Afirma «hecho comprobado» sin mostrar la comprobación.' },
  { k: 'exagera', name: 'Exageración absoluta', hint: '«No existe cura ni prevención»: los absolutos suelen ser falsos.' },
  { k: 'estigma', name: 'Estigma / etiqueta', hint: '«Esa gente»: juzga a un grupo en vez de explicar un mecanismo.' },
  { k: 'presion', name: 'Presión por compartir', hint: 'Pide reenviar de inmediato: impide verificar.' },
];
export const CHAIN = [
  { t: '¡', k: null }, { t: 'ATENCIÓN', k: 'alarma' }, { t: '! ', k: null },
  { t: 'Mi primo dice', k: 'fuente' }, { t: ' que ', k: null },
  { t: 'todos los que', k: 'general' }, { t: ' van a esa fiesta se contagian. ', k: null },
  { t: 'Es un hecho comprobado', k: 'autoridad' }, { t: ', ', k: null },
  { t: 'no existe cura ni prevención', k: 'exagera' }, { t: '. ', k: null },
  { t: 'Esa gente es peligrosa', k: 'estigma' }, { t: ', evítenla. ', k: null },
  { t: 'Reenvía antes de que lo borren', k: 'presion' }, { t: '.', k: null },
];

// ---- Slide 9 · A-E-R ----
export const AER_STEPS = [
  { id: 'aerA', note: 'A' }, { id: 'aerE', note: 'E' }, { id: 'aerR', note: 'R' },
];

// ---- Slide 10/11 · laboratorio de verificación ----
export const LAB = [
  {
    id: 'M1', title: 'Mensaje 1',
    text: 'Cuidado: el VIH se pega por abrazar, compartir vasos o usar el mismo baño. Mejor no acercarse a nadie con VIH.',
    claim: 'El VIH se transmite por abrazos, vasos compartidos o baños.',
    prej: 'Miedo a la cercanía y rechazo a personas con VIH («mejor no acercarse»).',
    evid: 'Fuentes sanitarias indican que el VIH no se transmite por abrazos, saludos, vasos ni baños compartidos. Se transmite por sangre, relaciones sexuales sin protección y de madre a hijo/a durante embarazo, parto o lactancia.',
    reliab: 0.12, reliabTxt: 'Baja',
    sources: [
      { n: 'Ministerio de Salud de Chile', d: 'minsal.cl', badge: 'Oficial', ok: true },
      { n: 'Organización Mundial de la Salud', d: 'who.int', badge: 'Organismo sanitario', ok: true },
      { n: 'Foro de chat anónimo', d: 'no verificable', badge: 'No usar como fuente', ok: false },
    ],
    model: 'El VIH no se transmite por abrazos, vasos ni baños compartidos. Se transmite por sangre, relaciones sexuales sin protección y de madre a hijo/a. Convivir con personas con VIH es seguro: informarse evita el miedo y la discriminación.',
    kw: [/no se transmite|no se pega|no se contagia/i, /abraz|vaso|ba[ñn]o|convivi/i],
    kwLabel: 'explica qué NO transmite el VIH',
  },
  {
    id: 'M2', title: 'Mensaje 2',
    text: 'Si no tienes síntomas, no necesitas hacerte ningún control, porque no puedes tener una ITS.',
    claim: 'Sin síntomas no hay ITS.',
    prej: 'No hay etiqueta explícita, pero sí una certeza absoluta sin respaldo que puede llevar a no consultar.',
    evid: 'Fuentes sanitarias señalan que muchas ITS pueden no producir síntomas perceptibles. Por eso la información confiable, la prevención y la consulta o testeo cuando corresponde son parte del autocuidado. Los síntomas por sí solos no permiten diagnosticar.',
    reliab: 0.15, reliabTxt: 'Baja',
    sources: [
      { n: 'Ministerio de Salud de Chile', d: 'minsal.cl', badge: 'Oficial', ok: true },
      { n: 'Currículum Nacional (Mineduc)', d: 'curriculumnacional.mineduc.cl', badge: 'Oficial', ok: true },
      { n: 'Captura de red social', d: 'sin autoría', badge: 'No usar como fuente', ok: false },
    ],
    model: 'Muchas ITS pueden no dar síntomas, por lo que su ausencia no permite descartarlas. Consultar en la red de salud cuando corresponde es parte del autocuidado y no una señal de culpa.',
    kw: [/s[ií]ntoma/i, /no (dar|producir|present|permit|se puede|descart)|pueden no|sin s[ií]ntoma|ausencia/i],
    kwLabel: 'aclara que puede haber ITS sin síntomas',
  },
  {
    id: 'M3', title: 'Mensaje 3',
    text: 'Quien tiene una ITS ya no puede tener una vida normal. Hay que alejarse de esas personas.',
    claim: 'Una ITS arruina la vida y obliga a alejarse de las personas.',
    prej: 'Etiqueta y exclusión de personas («esas personas»).',
    evid: 'Fuentes sanitarias indican que muchas ITS bacterianas (como sífilis, gonorrea o clamidia) se tratan con antibióticos y que las virales (como VIH o herpes) pueden controlarse con tratamiento y seguimiento. La atención oportuna mejora el pronóstico; la discriminación dificulta consultar y vulnera derechos.',
    reliab: 0.1, reliabTxt: 'Baja',
    sources: [
      { n: 'Organización Mundial de la Salud', d: 'who.int', badge: 'Organismo sanitario', ok: true },
      { n: 'Ministerio de Salud de Chile', d: 'minsal.cl', badge: 'Oficial', ok: true },
      { n: 'Blog de opinión', d: 'sin referencias', badge: 'No usar como fuente', ok: false },
    ],
    model: 'Muchas ITS se tratan o se controlan con atención de salud oportuna. Las personas con una ITS merecen respeto, privacidad y apoyo, no rechazo: el estigma dificulta consultar a tiempo.',
    kw: [/trata|control|atenci[oó]n|tratamiento/i, /respeto|apoyo|privacidad|derechos|no.*rechazo/i],
    kwLabel: 'menciona tratamiento o atención oportuna',
  },
];

// Heurística de lenguaje estigmatizante (orientativa; la revisión humana prevalece).
export const STIGMA_TERMS = [
  { re: /\bsucios?\b|\bsucias?\b/i, tip: '«sucio/a» es un juicio, no un dato.' },
  { re: /\birresponsables?\b/i, tip: 'Evita adjetivos morales; describe el mecanismo.' },
  { re: /\bculpa(ble|bles)?\b/i, tip: 'Evita culpar; si usas «culpa» que sea para negarla.', soft: true },
  { re: /\bcastigo\b|\bse lo busc[oó]\b/i, tip: 'El castigo no es un concepto sanitario.' },
  { re: /\besa gente\b|\besas personas\b|\bese tipo de\b/i, tip: 'Evita referirte a «esa gente»: usa «las personas».' },
  { re: /\bcontagiad[oa]s?\b|\binfectad[oa]s?\b/i, tip: 'Mejor: «persona con una ITS / con la infección».' },
  { re: /\bport(ador|adora)(es|as)?\b/i, tip: 'Mejor: «persona con la infección».' },
  { re: /\bgrupos? de riesgo\b/i, tip: 'Mejor: «situaciones de exposición».' },
  { re: /\bpromiscu\w*/i, tip: 'Es un juicio moral: describe el hecho sin juzgar.' },
  { re: /\bpeligros[oa]s?\b/i, tip: 'Evita etiquetar a personas como peligrosas.' },
  { re: /\benfermos? de sida\b|\bsidos[oa]s?\b/i, tip: 'Mejor: «persona que vive con VIH».' },
  { re: /\balejarse|\bevitenla\b|\bevítenla\b/i, tip: 'Evita proponer aislar a personas.' },
];

// ---- Slide 12 · pares de palabras ----
export const SWAPS = [
  { bad: 'Es un contagiado', good: 'Persona con una ITS', why: 'La infección no define a la persona.' },
  { bad: 'Enfermo de sida', good: 'Persona que vive con VIH', why: 'Describe la condición, no la identidad.' },
  { bad: 'Grupo de riesgo', good: 'Situaciones de exposición', why: 'El riesgo está en la exposición, no en quién eres.' },
  { bad: 'Se lo buscó', good: 'Atención de salud para todas las personas', why: 'La culpa no es un dato científico.' },
  { bad: 'Hay que alejarse de esa gente', good: 'Se puede convivir con respeto', why: 'Conocer el mecanismo de transmisión informa; la exclusión no.' },
  { bad: 'Portador', good: 'Persona con la infección', why: '«Portador» suena a amenaza; el trato digno no.' },
];

// ---- Slide 13 · protocolo ----
export const PROTO = [
  { k: 'verificar', color: '#ffc247', cls: 'amber', name: 'Verificar', q: ['¿Quién lo dice?', '¿Qué fuente oficial lo respalda?', '¿Está vigente?'] },
  { k: 'contextualizar', color: '#2ee6c5', cls: 'evid', name: 'Contextualizar', q: ['¿A qué población o situación se refiere?', '¿Qué no sabemos todavía?', '¿Es un dato o una inferencia?'] },
  { k: 'lenguaje', color: '#a07bff', cls: 'prej', name: 'Cuidar el lenguaje', q: ['¿Culpa, etiqueta o asusta sin necesidad?', '¿Es exacto, respetuoso y claro?', '¿Indica dónde buscar ayuda?'] },
];

// ---- Slide 14 · ticket ----
export const BANK = [
  { w: 'exacta', good: true, c: 'amber' }, { w: 'respetuosa', good: true, c: 'prej' },
  { w: 'clara', good: true, c: 'evid' }, { w: 'verificable', good: true, c: 'evid' },
  { w: 'basada en evidencia', good: true, c: 'evid' }, { w: 'sin estigma', good: true, c: 'prej' },
  { w: 'con fuente', good: true, c: 'amber' },
  { w: 'viral', good: false }, { w: 'alarmante', good: false }, { w: 'absoluta', good: false },
];
export const SELF = [
  'Distingo evidencia de rumor.',
  'Detecto lenguaje estigmatizante.',
  'Verifico con una fuente pertinente.',
  'Reformulo con claridad y respeto.',
];
