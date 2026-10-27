// Contenido pedagógico de la Clase 21 (Plan de Unidad 4 · Ciencias Naturales 7°).
// Todos los mensajes, casos, comentarios y ejemplos son FICTICIOS. Las "evidencias" son paráfrasis de
// recomendaciones sanitarias generales; el docente proyecta la fuente oficial vigente (Currículum Nacional,
// MINSAL/DIPRECE u organismos sanitarios reconocidos). Los datos "ilustrativos" no son estadísticas reales.

export const PHASES = {
  intro:        { name: 'Inicio · ruta',       min: 10, color: 'var(--sun)' },
  activacion:   { name: 'Activación',          min: 10, color: 'var(--sun)' },
  preguntas:    { name: 'Preguntas iniciales', min: 10, color: 'var(--violet)' },
  modelamiento: { name: 'Modelamiento',        min: 15, color: 'var(--mint)' },
  actividad:    { name: 'Actividad central',   min: 35, color: 'var(--coral)' },
  comun:        { name: 'Puesta en común',     min: 10, color: 'var(--violet)' },
  ticket:       { name: 'Ticket y aviso',      min: 10, color: 'var(--sun)' },
};

export const NOTES = [
  '<b>Portada.</b> Presenta la idea fuerza: informar no es decidir por otra persona. Hoy se construyen <b>recomendaciones generales de autocuidado</b> justificadas con evidencia. Recuerda el cuidado: casos ficticios, nada de consejos personales ni diagnósticos.',
  '<b>Ruta (10 min con la activación).</b> Lee la meta y las 5 etapas. Aclara que una recomendación general <u>no reemplaza</u> la orientación de un profesional; las consultas personales se derivan en privado según el protocolo del establecimiento. La barra inferior muestra los 90 minutos (tecla <kbd>T</kbd> inicia el reloj).',
  '<b>Inicio: dos mensajes ficticios.</b> Que cada estudiante elija cuál comunica mejor la ciencia y explique solo el criterio. Luego revela el análisis de palabras: absolutos («siempre», «todas», «no necesitas nada más») vs. lenguaje prudente («puede reducir el riesgo», «no protege igual», «consulta»).',
  '<b>Preguntas iniciales (10 min).</b> Toca cada burbuja: abre una idea para la conversación. Idea fuerza: informar entrega evidencia y opciones; decidir por otra persona impone. Anota las palabras que surjan para la estructura E-R-L.',
  '<b>Vocabulario.</b> Mazo de repaso: «Lo sé» envía la tarjeta a la pila de aprendidas; «Repasar» la devuelve al final del mazo. Deja visible el glosario (DUA: representación).',
  '<b>Modelamiento 1/4 (15 min en total): E-R-L.</b> Evidencia → Recomendación → Límite o alcance. Avanza capa por capa en el modelo 3D: cada pieza se acopla a la anterior. Ejemplo completo con mensaje final. La información es general y no reemplaza a un profesional.',
  '<b>Modelamiento 2/4: el lenguaje no puede pasar a la evidencia.</b> Elige la fuerza de la evidencia y luego el verbo del mensaje: la balanza muestra si el mensaje promete de más (sobre-afirma), está ajustado o es demasiado tímido. Un absoluto casi nunca se justifica.',
  '<b>Modelamiento 3/4: informar vs. decidir por otra persona.</b> Arrastra cada tarjeta a la izquierda (decide por otra persona) o a la derecha (informa); también hay botones y flechas. Pide que reformulen en voz alta las que «deciden por otro».',
  '<b>Modelamiento 4/4: conecta evidencia y mensaje.</b> En el modelo 3D se acoplan solo las evidencias pertinentes: aumentan la solidez del mensaje; los rumores y anécdotas agregan ruido. Datos ilustrativos.',
  '<b>Actividad central 1/3 (35 min en total): taller.</b> Cada grupo elige uno de tres casos ficticios de desinformación (DUA: elección entre casos), lee una fuente oficial breve y un dato, y extrae la evidencia relevante. Reemplaza el texto por la fuente oficial vigente que proyectarás.',
  '<b>Actividad central 2/3: redacta en E-R-L (máx. 3 líneas).</b> Evidencia, Recomendación y Límite en la plantilla. El semáforo de cuatro criterios (correcto, útil, respetuoso, verificable) es orientativo: la revisión del grupo y del docente prevalece. La tarjeta 3D se actualiza mientras escriben.',
  '<b>Actividad central 3/3: galería.</b> Cada grupo comenta un mensaje usando <u>un solo criterio</u> y una frase inicial. No se identifican autores. Después se compara con el criterio que el docente considera más débil.',
  '<b>Puesta en común (10 min).</b> Se leen dos ejemplos fuertes y uno por mejorar; el curso propone ajustes sin identificar autores. Recuerda que estas habilidades se evaluarán en la Prueba N°2 y se usarán en el proyecto final.',
  '<b>Ticket de salida (10 min).</b> «Una recomendación científica necesita evidencia porque ____ y debe reconocer sus límites porque ____.» Evaluación formativa: transforma evidencia en recomendación, evita absolutismos, incluye respaldo pertinente y mantiene lenguaje de autocuidado y respeto. <b>Aviso:</b> clase 22, repaso estructurado para la Prueba N°2.',
];

// ---- Slide 3 · dos mensajes ----
export const MSG_ABS = {
  from: 'Cadena reenviada · ficticia',
  text: '¡Dato clave! El preservativo evita SIEMPRE todas las ITS. Si lo usas, no necesitas nada más.',
  marks: [
    { w: 'SIEMPRE', why: 'Absoluto: casi nunca lo justifica la evidencia.' },
    { w: 'todas', why: 'Generaliza: no todas las medidas protegen igual frente a todas las infecciones.' },
    { w: 'no necesitas nada más', why: 'Promete de más y desalienta otras medidas y la consulta.' },
  ],
};
export const MSG_PRU = {
  from: 'Publicación educativa · ficticia',
  text: 'El uso correcto del preservativo puede reducir el riesgo de transmisión de varias ITS, aunque no protege igual frente a todas. Si tienes dudas, consulta en tu centro de salud.',
  marks: [
    { w: 'puede reducir el riesgo', why: 'Lenguaje prudente: describe un efecto sin prometer certeza absoluta.' },
    { w: 'no protege igual frente a todas', why: 'Reconoce el límite: la protección varía según la infección.' },
    { w: 'consulta en tu centro de salud', why: 'Indica dónde buscar orientación: informa, no reemplaza al profesional.' },
  ],
};

// ---- Slide 4 · preguntas ----
export const QUESTIONS = [
  { q: '¿Qué diferencia existe entre informar y decidir por otra persona?', c: 'violet',
    idea: 'Informar es entregar evidencia y opciones para que cada persona decida con información. Decidir por otra persona es imponer lo que «debe» hacer.' },
  { q: '¿Qué evidencia debería respaldar una recomendación?', c: 'mint',
    idea: 'Datos o mecanismos verificables de una fuente confiable (institución sanitaria, gráfico oficial) y pertinentes al mensaje y a la población a la que se dirige.' },
  { q: '¿Por qué debemos evitar «siempre» o «nunca» si la evidencia no los justifica?', c: 'coral',
    idea: 'Porque la evidencia casi nunca es absoluta: hay excepciones, límites y grados. Un absoluto sin respaldo puede ser falso y dar una falsa seguridad.' },
  { q: '¿Cómo se incorpora una fuente sin llenar el mensaje de tecnicismos?', c: 'sun',
    idea: 'Citándola de forma breve («según el Ministerio de Salud…») y traduciendo el dato a palabras sencillas, sin jerga innecesaria.' },
  { q: '¿Cuándo una recomendación general debe incluir «consulta a un profesional»?', c: 'violet',
    idea: 'Cuando el tema toca la salud personal: síntomas, diagnóstico, tratamiento o decisiones médicas. La información general no reemplaza la orientación individual.' },
];

// ---- Slide 5 · vocabulario (mazo de repaso) ----
export const VOCAB = [
  { t: 'recomendación', d: 'Mensaje que sugiere una acción y se apoya en evidencia.', ex: 'Consultar a tiempo cuando corresponde ayuda a cuidar la salud.', c: 'coral' },
  { t: 'evidencia', d: 'Datos, mecanismos o resultados verificables que respaldan una afirmación.', ex: 'Una hoja informativa oficial con fecha y fuente.', c: 'mint' },
  { t: 'autocuidado', d: 'Acciones que una persona realiza para cuidar su salud y bienestar.', ex: 'Informarse bien, prevenir y pedir orientación.', c: 'violet' },
  { t: 'alcance', d: 'A quiénes y en qué situaciones se aplica una recomendación.', ex: 'Una guía general no cubre todos los casos personales.', c: 'sun' },
  { t: 'límite', d: 'Aquello que una recomendación no puede garantizar.', ex: '«Esta medida no reemplaza la consulta a un profesional.»', c: 'coral' },
  { t: 'fuente', d: 'Origen de la información: quién la publica y dónde.', ex: 'Ministerio de Salud, OMS, Currículum Nacional.', c: 'mint' },
  { t: 'comunicación', d: 'Forma de transmitir un mensaje para que se entienda y no dañe.', ex: 'Frases claras, breves y sin culpar a nadie.', c: 'violet' },
  { t: 'respeto', d: 'Trato digno que evita culpar, etiquetar o burlarse.', ex: 'Decir «las personas» y no «esa gente».', c: 'sun' },
];

// ---- Slide 6 · E-R-L ----
export const ERL = [
  { k: 'E', name: 'Evidencia', c: 'violet', ask: '¿Qué dato o mecanismo confiable sustenta el mensaje?', text: 'Según el Ministerio de Salud, muchas ITS pueden no dar síntomas perceptibles.' },
  { k: 'R', name: 'Recomendación', c: 'mint', ask: '¿Qué acción de autocuidado se sugiere, en lenguaje prudente?', text: 'Conversar con un profesional de salud y realizarse controles cuando corresponde ayuda a cuidar tu salud, aunque te sientas bien.' },
  { k: 'L', name: 'Límite o alcance', c: 'coral', ask: '¿Qué no puede garantizar y cuándo se necesita orientación?', text: 'Esta información es general y no reemplaza la orientación de un profesional; ante una duda personal, consulta en tu centro de salud.' },
];

// ---- Slide 7 · balanza evidencia / lenguaje ----
export const EVID_LEVELS = [
  { id: 0, name: 'Evidencia débil', text: 'Un solo dato aislado o un comentario sin fuente.' },
  { id: 1, name: 'Evidencia moderada', text: 'Una fuente oficial lo indica, para ciertas condiciones.' },
  { id: 2, name: 'Evidencia fuerte', text: 'Varias fuentes sanitarias coinciden y explican el mecanismo.' },
];
export const WORDINGS = [
  { id: 0, t: 'podría estar relacionado con…', tag: 'muy cauteloso' },
  { id: 1, t: 'puede reducir el riesgo cuando…', tag: 'prudente' },
  { id: 2, t: 'reduce de forma importante el riesgo…', tag: 'firme' },
  { id: 3, t: 'evita siempre…', tag: 'absoluto' },
];

// ---- Slide 8 · informar vs decidir ----
export const SWIPE = [
  { t: 'Debes dejar de hacerlo hoy mismo, no hay otra opción.', a: 'decide', why: 'Impone una decisión y no entrega opciones ni evidencia.' },
  { t: 'Estas son las opciones que existen y lo que dice la evidencia sobre cada una.', a: 'informa', why: 'Entrega información y opciones para que cada persona decida.' },
  { t: 'Si fueras inteligente harías lo que te digo.', a: 'decide', why: 'Presiona y juzga a la persona en vez de informar.' },
  { t: 'Algunas personas eligen esta medida porque puede reducir el riesgo; cada persona decide con esta información.', a: 'informa', why: 'Presenta la evidencia con prudencia y respeta la decisión.' },
  { t: 'Todos tienen que hacerlo, sin excepciones.', a: 'decide', why: 'Absoluto e imposición: no reconoce excepciones ni decisiones personales.' },
  { t: 'Esta información es general; si tienes dudas personales, consulta a un profesional de la salud.', a: 'informa', why: 'Informa y explicita el límite, derivando la duda personal.' },
];

// ---- Slide 9 · red de evidencia ----
export const NET_MSG = 'Hacerse controles de salud cuando corresponde ayuda a detectar a tiempo infecciones que pueden no dar síntomas.';
export const NET = [
  { id: 1, rel: true, w: 30, short: 'Hoja oficial', t: 'Hoja informativa de una institución sanitaria: muchas ITS pueden no dar síntomas.' },
  { id: 2, rel: true, w: 25, short: 'Mecanismo', t: 'Explicación del mecanismo: algunas infecciones siguen presentes sin molestias.' },
  { id: 3, rel: true, w: 25, short: 'Dato oficial', t: 'Dato oficial (ilustrativo) sobre consultas preventivas y detección a tiempo.' },
  { id: 4, rel: true, w: 20, short: 'Guía de salud', t: 'Orientación del Ministerio de Salud sobre cuándo consultar.' },
  { id: 5, rel: false, short: 'Comentario', t: 'Comentario viral: «a mí nunca me pasó nada».' },
  { id: 6, rel: false, short: 'Influencer', t: 'Un influencer dice que los controles son innecesarios.' },
  { id: 7, rel: false, short: 'Anécdota', t: 'Anécdota: «el amigo de un amigo se curó solo».' },
  { id: 8, rel: false, short: 'Titular', t: 'Titular sensacionalista sin fuente.' },
];

// ---- Slide 10 · taller: casos ficticios ----
export const CASES = [
  {
    id: 'A', tab: 'Caso A',
    viral: 'Las ITS solo se contagian en fiestas. Si no vas a fiestas, estás 100 % a salvo.',
    src: 'Paráfrasis de una hoja informativa sanitaria',
    sents: [
      { t: 'Las ITS se transmiten por mecanismos específicos, como el contacto sexual sin protección; algunas también por sangre o de madre a hijo/a.', rel: true },
      { t: 'Cualquier persona expuesta puede adquirir una ITS; no depende del lugar donde ocurra la exposición.', rel: true },
      { t: 'El Ministerio de Salud tiene oficinas en Santiago.', rel: false },
      { t: 'Muchas ITS pueden no producir síntomas perceptibles.', rel: true },
      { t: 'Esta hoja se actualiza cada cierto tiempo.', rel: false },
    ],
    data: { kind: 'icons', title: 'Ficha de datos · mecanismos de transmisión', items: ['Contacto sexual sin protección', 'Sangre', 'De madre a hijo/a (embarazo, parto, lactancia)'] },
    keyIdea: 'La transmisión depende del mecanismo, no del lugar ni del «tipo de persona».',
  },
  {
    id: 'B', tab: 'Caso B',
    viral: 'Si no tienes síntomas, no necesitas consultar nunca.',
    src: 'Paráfrasis de una hoja informativa sanitaria',
    sents: [
      { t: 'Muchas ITS pueden no producir síntomas perceptibles.', rel: true },
      { t: 'La consulta o el testeo cuando corresponde forma parte del autocuidado.', rel: true },
      { t: 'Los síntomas por sí solos no permiten diagnosticar una infección.', rel: true },
      { t: 'Las horas de consulta se agendan en el centro de salud.', rel: false },
      { t: 'Una persona puede sentirse bien y aun así necesitar atención.', rel: true },
    ],
    data: { kind: 'dots', title: 'Dato ilustrativo para la clase', caption: 'En un ejemplo de 10 personas con una infección, 6 no notaron síntomas.', n: 10, on: 6 },
    keyIdea: 'Sentirse bien no descarta una infección: por eso importan la información y la consulta oportuna.',
  },
  {
    id: 'C', tab: 'Caso C',
    viral: 'Un solo método previene todo; con eso basta.',
    src: 'Paráfrasis de una hoja informativa sanitaria',
    sents: [
      { t: 'No todas las medidas protegen por igual frente a todas las infecciones.', rel: true },
      { t: 'El uso correcto de medidas de barrera reduce el riesgo de varias ITS.', rel: true },
      { t: 'Existen campañas educativas en distintos medios.', rel: false },
      { t: 'La información confiable, la vacunación (cuando existe) y la consulta oportuna se complementan.', rel: true },
      { t: 'Ninguna medida aislada es una garantía absoluta.', rel: true },
    ],
    data: { kind: 'table', title: 'Ficha de datos · medidas y su función', rows: [['Barrera', 'Reduce el riesgo de varias ITS'], ['Vacunación', 'Para infecciones en que existe vacuna'], ['Consulta oportuna', 'Detecta y trata a tiempo']] },
    keyIdea: 'Las medidas se complementan; ninguna es una garantía absoluta por sí sola.',
  },
];

// ---- Slide 11 · redactor E-R-L ----
export const STARTERS = {
  E: ['Según el Ministerio de Salud, ', 'Los datos oficiales indican que ', 'Las fuentes sanitarias señalan que '],
  R: ['Conversar con un profesional y ', 'Informarse en fuentes confiables ', 'Realizar controles cuando corresponde '],
  L: ['Esta información es general y no reemplaza ', 'Si tienes una duda personal, consulta ', 'No garantiza el mismo resultado en todas las personas; '],
};
export const CRIT = {
  absolutos: /\b(siempre|nunca|todos|todas|nadie|jam[aá]s|100 ?%|garantiza(?:do)?|sin excepci[oó]n|evita todo|cura|infalible)\b/i,
  limite: /(no reemplaza|no sustituye|consulta|profesional|duda|general|no garantiza|no puede|límite|depende)/i,
  accion: /(puede|ayuda|conviene|consult|inform|usa|usar|realiz|convers|pregunt|busca|cuida|vacun|control)/i,
  fuente: /(seg[uú]n|fuente|minsal|ministerio|oms|organizaci[oó]n mundial|datos oficiales|estudio|instituci[oó]n|sanitari|hoja informativa|curr[ií]culum)/i,
  impone: /\b(debes|tienes que|tiene que|tienen que|deben|obligatorio|es obligatorio|hay que)\b/i,
  estigma: /\b(sucios?|sucias?|irresponsables?|culpa|castigo|esa gente|promiscu\w*|contagiad[oa]s?|portador\w*|grupos? de riesgo)\b/i,
};

// ---- Slide 12 · galería ----
export const GALLERY = [
  { id: 'G1', t: 'Según el Ministerio de Salud, muchas ITS pueden no dar síntomas. Consultar y realizar controles cuando corresponde ayuda a cuidar la salud. Esta información es general y no reemplaza a un profesional.', weak: null, note: 'Mensaje sólido: cita fuente, es prudente y reconoce su límite.' },
  { id: 'G2', t: 'Todas las ITS se curan con antibióticos, así que no hay de qué preocuparse.', weak: 'correcto', note: 'Es absoluto y falso: algunas infecciones no se curan con antibióticos. El criterio más débil es «correcto».' },
  { id: 'G3', t: 'Quienes tienen una ITS son irresponsables; si te cuidas, nunca te pasa.', weak: 'respetuoso', note: 'Culpa y etiqueta a las personas, además de usar «nunca». El criterio más débil es «respetuoso».' },
  { id: 'G4', t: 'Hay que cuidarse mucho para estar bien.', weak: 'verificable', note: 'Es vago: no cita fuente ni dato. El criterio más débil es «verificable».' },
];
export const CRITERIA = [
  { k: 'correcto', name: 'Correcto', hint: 'Dice lo que la evidencia permite y reconoce límites.' },
  { k: 'util', name: 'Útil', hint: 'Sugiere una acción clara de autocuidado.' },
  { k: 'respetuoso', name: 'Respetuoso', hint: 'No culpa, no etiqueta ni impone.' },
  { k: 'verificable', name: 'Verificable', hint: 'Cita una fuente o dato que se puede revisar.' },
];
export const FB_STEMS = [
  { k: 'ok', t: 'Me ayudó que…' },
  { k: 'mejora', t: 'Podría mejorar si…' },
];

// ---- Slide 13 · mejorar un mensaje ----
export const IMPROVE = {
  weak: 'Todos deben hacerse el examen siempre, porque así nunca se enferman.',
  strong: [
    { t: 'Según la OMS, la vacunación existe para algunas infecciones y puede prevenirlas. Conversar con un profesional ayuda a saber si corresponde en cada caso; esta información es general.', note: 'Cita fuente, es prudente y reconoce su límite.' },
    { t: 'Según los datos oficiales, muchas ITS pueden no dar síntomas. Informarse y consultar a tiempo ayuda a cuidar la salud; esto no reemplaza la orientación de un profesional.', note: 'Evidencia → recomendación → límite, en tres líneas.' },
  ],
  slots: [
    { name: 'Fuente', opts: [
      { t: 'Según el Ministerio de Salud, ', ok: true, why: 'Cita una fuente verificable.' },
      { t: 'Un amigo me contó que ', ok: false, why: 'Una anécdota no es evidencia.' },
      { t: '', label: '(sin fuente)', ok: false, why: 'Sin fuente no se puede verificar.' },
    ] },
    { name: 'Recomendación', opts: [
      { t: 'hacerse controles cuando corresponde puede ayudar', ok: true, why: 'Prudente y accionable.' },
      { t: 'todos deben hacerse el examen siempre', ok: false, why: 'Absoluto e impone.' },
      { t: 'siempre hay que hacerse exámenes', ok: false, why: 'Absoluto: «siempre» no está respaldado.' },
    ] },
    { name: 'Razón', opts: [
      { t: ', porque ayuda a detectar a tiempo infecciones que pueden no dar síntomas', ok: true, why: 'Explica con evidencia, sin prometer.' },
      { t: ', porque así nunca se enferman', ok: false, why: 'Promete de más.' },
      { t: ', porque lo dicen en redes', ok: false, why: 'Las redes no son una fuente confiable.' },
    ] },
    { name: 'Límite', opts: [
      { t: '. Esta información es general y no reemplaza la orientación de un profesional.', ok: true, why: 'Reconoce el límite y deriva.' },
      { t: '. No hay excepciones.', ok: false, why: 'Un absoluto no es un límite.' },
      { t: '.', label: '(sin límite)', ok: false, why: 'Falta reconocer lo que no se puede garantizar.' },
    ] },
  ],
};

// ---- Slide 14 · ticket ----
export const TICKET_A = [
  { t: 'permite que el mensaje se pueda verificar y no sea solo una opinión', ok: true },
  { t: 'así se ve más segura, aunque no tenga fuente', ok: false },
  { t: 'respalda lo que se afirma con datos o mecanismos confiables', ok: true },
  { t: 'convence a más personas, sin importar si es exacta', ok: false },
];
export const TICKET_B = [
  { t: 'la evidencia casi nunca es absoluta y hay excepciones', ok: true },
  { t: 'la información general no reemplaza la orientación de un profesional', ok: true },
  { t: 'así nadie puede cuestionar el mensaje', ok: false },
  { t: 'evita falsas seguridades y cuida a las personas', ok: true },
];
export const SELF = [
  'Transformo evidencia en una recomendación.',
  'Evito absolutismos («siempre», «nunca»).',
  'Incluyo una fuente o respaldo pertinente.',
  'Uso lenguaje de autocuidado y respeto.',
];
