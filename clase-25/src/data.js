// Contenido pedagógico de la Clase 25 (Plan de Unidad 4 · Ciencias Naturales 7°) — Proyecto final «Autocuidado informado».
// Todos los productos, ejemplos y casos son FICTICIOS. Las referencias a instituciones (Currículum Nacional, MINSAL,
// DIPRECE, OMS) son orientativas: el docente proyecta los sitios oficiales vigentes. Las heurísticas de la pregunta
// central y de las fuentes son ORIENTATIVAS: la revisión final la hace el docente.

export const PHASES = {
  intro:        { name: 'Inicio · ruta',        min: 10, color: 'var(--hi)' },
  activacion:   { name: 'Activación',           min: 10, color: 'var(--hi)' },
  preguntas:    { name: 'Preguntas iniciales',  min: 10, color: 'var(--pink)' },
  modelamiento: { name: 'Modelamiento',         min: 15, color: 'var(--mint)' },
  actividad:    { name: 'Actividad central',    min: 35, color: 'var(--sky)' },
  comun:        { name: 'Puesta en común',      min: 10, color: 'var(--pink)' },
  ticket:       { name: 'Ticket y aviso',       min: 10, color: 'var(--hi)' },
};

export const NOTES = [
  '<b>Portada.</b> Hoy empieza el proyecto integrador <b>«Autocuidado informado: del mito a la evidencia»</b>. La clase no produce el PPT: produce el <u>plan maestro</u> (pregunta central, evidencia, fuentes, roles y pitch). Recuerda el cuidado: casos ficticios, sin relatos íntimos ni fotos clínicas explícitas.',
  '<b>Ruta (10 min con la activación).</b> Lee la meta y las 5 etapas del plan. Subraya los resguardos: temas dentro de los OA 1–3 y del nivel de 7°; no se usan redes sociales como evidencia principal; consultas personales se derivan en privado a un adulto o profesional según protocolo.',
  '<b>Activación: dos productos ficticios.</b> Que cada estudiante observe ambos productos con los botones de lupa (evidencia, fuente, mensaje, decoración) y elija cuál enseña mejor. Luego construyen <u>tres criterios propios antes de conocer la rúbrica</u>. Dos de las ocho opciones son trampas («mucha decoración», «muchos colores»). Se retoman en la diapositiva 7.',
  '<b>Preguntas iniciales (10 min).</b> Cinco notas adhesivas: abre una, discute en parejas y escribe una respuesta breve (se guarda en este equipo). Idea fuerza: antes de diseñar hay que decidir qué quiere que comprenda la audiencia. Estas ideas alimentan la ficha de la diapositiva 9.',
  '<b>Vocabulario clave.</b> Arrastra cada término hasta su definición (también puedes tocar el término y luego la definición). Los ocho términos son los del plan: audiencia, propósito, pregunta central, evidencia, mensaje, fuente, autocuidado y comunicación científica. Deja visible el glosario (DUA: representación).',
  '<b>Modelamiento 1/2: una diapositiva en cinco capas.</b> Secuencia del plan: propósito → idea científica → evidencia → fuente → mensaje de autocuidado. El modelo 3D se arma capa por capa con un ejemplo ficticio sobre transmisión de ITS. Insiste: cada diapositiva debe poder planificarse con estas cinco capas.',
  '<b>Modelamiento 2/2: estructura del PPT y rúbrica.</b> Siete diapositivas y seis criterios: exactitud, fuentes, evidencia visual, autocuidado/responsabilidad, claridad y participación. Clasifica seis frases según el criterio que demuestran y compara con los criterios que el curso construyó en la diapositiva 3. La rúbrica oficial es la que tú entregues.',
  '<b>Actividad central 1/5: tema y audiencia (35 min en total).</b> Cada grupo elige un tema dentro de los OA 1–3 evitando duplicar en exceso, y una audiencia escolar. Revisa el chequeo de resguardo: ningún tema pide relatos personales ni imágenes clínicas explícitas. Si hay duplicados, propone otra audiencia o enfoque.',
  '<b>Actividad central 2/5: ficha de planificación.</b> Pregunta central, tres ideas científicas, mito o duda frecuente, evidencia o gráfico y mensaje de autocuidado. El semáforo de la pregunta central es <u>orientativo</u> (formato, extensión, pregunta de sí/no y relación con el tema). «Ver ejemplo» ofrece un modelo para cada tema (DUA: ejemplos de productos).',
  '<b>Actividad central 3/5: fuentes.</b> Clasifica nueve fuentes: principal, apoyo con cuidado o no usar. Cada grupo debe dejar <b>dos fuentes institucionales</b> previstas: serán revisadas en el checklist «¿Información o rumor?» de la clase 26. Proyecta los sitios oficiales vigentes (Currículum Nacional, MINSAL/DIPRECE, OMS).',
  '<b>Actividad central 4/5: siete diapositivas.</b> Una oración objetivo por diapositiva («Al terminar, la audiencia podrá…»). El modelo 3D muestra el guion como una mesa de siete láminas; se enciende cada una cuando la oración cumple el criterio. Verifica que cada oración tenga un verbo observable y una idea única.',
  '<b>Actividad central 5/5: roles.</b> Seis roles (investigación, redacción, diseño, fuentes, gráfico, exposición) para 3–6 integrantes. Arrastra cada rol a una persona; nadie queda sin rol y nadie acumula más de dos. Usa «Integrante 1…» o iniciales: no se requieren datos personales. Todos exponen una parte (criterio de participación).',
  '<b>Puesta en común: pitch de 30 segundos.</b> El guion se arma solo con la ficha. Cronometra 30 s y haz una <u>pregunta de precisión</u> basada en el criterio más débil. En el radar 3D se ven cinco criterios formativos; pasan a computación solo los proyectos con pregunta central y al menos dos fuentes institucionales claras.',
  '<b>Ticket de salida (10 min).</b> «Nuestro proyecto enseñará ____ y lo respaldaremos con ____.» Se completa con elementos de la ficha. Descarga el plan maestro en un archivo de texto. <b>Avisa:</b> la próxima clase es en la sala de computación para construir el PPT; deben traer su planificación.',
];

// ---- Slide 3 · dos productos ficticios ----
export const PRODUCTS = {
  A: { name: 'Producto A', tag: 'Muy decorado', spots: {
    evid: 'No muestra ningún dato ni gráfico: solo una frase general.',
    fuente: 'No cita ninguna fuente: no se puede comprobar.',
    msg: 'El mensaje es vago («cuídate siempre»): no dice qué hacer ni dónde consultar.',
    deco: 'Muchos colores, estrellas y letras de distintos tipos: distraen de la idea.',
  } },
  B: { name: 'Producto B', tag: 'Breve y respaldado', spots: {
    evid: 'Un gráfico simple con título y unidad apoya la idea central.',
    fuente: 'Nombra una institución de salud y se puede verificar.',
    msg: 'El mensaje es concreto: indica una medida y dónde consultar.',
    deco: 'Pocos elementos, buen contraste y una sola idea: se entiende de un vistazo.',
  } },
};
export const CRITERIA_POOL = [
  { id: 'evid', t: 'Evidencia verificable', good: true, rub: 'exactitud' },
  { id: 'fuente', t: 'Fuente citada', good: true, rub: 'fuentes' },
  { id: 'visual', t: 'Gráfico o apoyo visual pertinente', good: true, rub: 'visual' },
  { id: 'cuidado', t: 'Mensaje de cuidado y responsabilidad', good: true, rub: 'autocuidado' },
  { id: 'claro', t: 'Idea clara y breve', good: true, rub: 'claridad' },
  { id: 'part', t: 'Participación de todo el grupo', good: true, rub: 'participacion' },
  { id: 'deco', t: 'Mucha decoración y animaciones', good: false, why: 'La decoración no enseña por sí sola; puede distraer de la evidencia.' },
  { id: 'color', t: 'Muchos colores y fotos', good: false, why: 'Más colores o fotos no mejoran la explicación; importan la evidencia y la claridad.' },
];

// ---- Slide 4 · preguntas ----
export const QUESTIONS = [
  { q: '¿Qué queremos que la audiencia comprenda al terminar nuestra presentación?', c: 'hi',
    idea: 'Una sola idea central, escrita como oración objetivo: «Al terminar, la audiencia podrá explicar…». Si no cabe en una oración, el proyecto es demasiado amplio.' },
  { q: '¿Qué contenido de los OA es imprescindible?', c: 'mint',
    idea: 'Lo que, si falta, cambia el sentido: el concepto científico central y una medida de autocuidado. Todo debe quedar dentro de los OA 1–3 y del nivel de 7° básico.' },
  { q: '¿Qué evidencia visual puede mejorar la explicación?', c: 'sky',
    idea: 'Gráficos, esquemas, líneas de tiempo o tablas simples con título, unidad y fuente. No se usan fotografías clínicas explícitas.' },
  { q: '¿Qué riesgo existe si usamos información sin verificar?', c: 'pink',
    idea: 'Difundir mitos, estigmatizar o dar falsa seguridad. Por eso se usan fuentes institucionales y se contrastan al menos dos.' },
  { q: '¿Cómo distribuiremos roles para que todos participen?', c: 'lilac',
    idea: 'Roles según fortalezas: investigación, redacción, diseño, fuentes, gráfico y exposición. Todos hablan una parte en la exposición.' },
];

// ---- Slide 5 · vocabulario ----
export const VOCAB = [
  { t: 'Audiencia', d: 'Personas a quienes va dirigida la comunicación; define el lenguaje y los ejemplos.' },
  { t: 'Propósito', d: 'Lo que se quiere lograr con la comunicación: qué debe comprender o hacer la audiencia.' },
  { t: 'Pregunta central', d: 'Pregunta que organiza el proyecto y que se puede responder con evidencia.' },
  { t: 'Evidencia', d: 'Datos y razonamientos verificables que respaldan una idea.' },
  { t: 'Mensaje', d: 'Idea final que la audiencia debe recordar, expresada de forma clara y breve.' },
  { t: 'Fuente', d: 'Origen identificable y verificable de una información.' },
  { t: 'Autocuidado', d: 'Decisiones informadas para cuidar la salud propia y la de otras personas.' },
  { t: 'Comunicación científica', d: 'Explicar ideas científicas con evidencia, fuentes y lenguaje adecuado a la audiencia.' },
];

// ---- Slide 6 · una diapositiva en cinco capas (ejemplo ficticio) ----
export const LAYERS = [
  { id: 'prop', name: 'Propósito', c: 'hi', short: 'Distinguir vías reales de mitos', text: 'Que la audiencia distinga las vías reales de transmisión de las ITS de los mitos más comunes.' },
  { id: 'idea', name: 'Idea científica', c: 'mint', short: 'Tres vías reconocidas', text: 'Las ITS se transmiten por vía sexual sin protección, por contacto con sangre contaminada y de madre a hijo/a. El contacto cotidiano no las transmite.' },
  { id: 'evid', name: 'Evidencia', c: 'sky', short: 'Esquema de 3 vías', text: 'Esquema simple con las tres vías y una tarjeta «abrazo / vaso compartido» marcada como no transmisión (ilustrativo).' },
  { id: 'fuente', name: 'Fuente', c: 'pink', short: 'Institución de salud', text: 'Sitio oficial de una institución de salud (por ejemplo MINSAL/DIPRECE): nombre, sección y fecha de consulta. El docente proyecta el sitio vigente.' },
  { id: 'msg', name: 'Mensaje de autocuidado', c: 'lilac', short: 'Consultar y prevenir', text: 'Ante dudas, consulta en un centro de salud; usa medidas de prevención y no te automediques.' },
];

// ---- Slide 7 · rúbrica ----
export const RUBRIC = [
  { id: 'exactitud', name: 'Exactitud', c: 'mint', d: 'Los conceptos científicos son correctos y están dentro de los OA 1–3.' },
  { id: 'fuentes', name: 'Fuentes', c: 'hi', d: 'Cada idea importante nombra una fuente confiable y verificable.' },
  { id: 'visual', name: 'Evidencia visual', c: 'sky', d: 'Gráficos o esquemas con título, unidad y fuente que apoyan la explicación.' },
  { id: 'autocuidado', name: 'Autocuidado y responsabilidad', c: 'pink', d: 'Cierra con una recomendación general respetuosa y dice dónde buscar ayuda.' },
  { id: 'claridad', name: 'Claridad', c: 'lilac', d: 'Una idea por diapositiva, frases breves y lenguaje adecuado a la audiencia.' },
  { id: 'participacion', name: 'Participación', c: 'coral', d: 'Todas las personas aportan en la preparación y en la exposición.' },
];
export const RUBRIC_STATEMENTS = [
  { s: 'La diapositiva explica correctamente que algunas ITS pueden no producir síntomas.', a: 'exactitud' },
  { s: 'Al pie de cada diapositiva se nombra la institución y la sección consultada.', a: 'fuentes' },
  { s: 'Un gráfico de barras con título, unidad y fuente apoya la idea principal.', a: 'visual' },
  { s: 'Termina con una recomendación general y dice dónde consultar en un centro de salud.', a: 'autocuidado' },
  { s: 'Cada diapositiva tiene una sola idea y frases cortas.', a: 'claridad' },
  { s: 'Las cinco personas del grupo explican una parte durante la exposición.', a: 'participacion' },
];

// ---- Slide 8 · temas y audiencias (todos dentro de los OA 1–3) ----
export const TOPICS = [
  { id: 1, name: 'Pubertad: cambios físicos y emocionales', oa: 'OA 1', kw: /pubertad|cambio|adolesc|hormon/i,
    ex: { q: '¿Qué cambios ocurren en la pubertad y cómo podemos cuidarnos y apoyarnos?', ideas: ['La pubertad es una etapa de cambios físicos y emocionales que ocurren en momentos distintos en cada persona.', 'Las hormonas regulan muchos de estos cambios.', 'Hablar con adultos de confianza, descansar y cuidar la higiene favorece el bienestar.'], myth: '«Si mi cuerpo cambia antes o después que el de otros, algo anda mal».', ev: 'Línea de tiempo con rangos típicos de edad (ilustrativa).', msg: 'Cada cuerpo tiene su ritmo: cuidarse y preguntar a un adulto o profesional si hay dudas.' } },
  { id: 2, name: 'Dimensiones de la sexualidad', oa: 'OA 1', kw: /dimensi|afect|biol|social|sexualidad|integral/i,
    ex: { q: '¿Qué dimensiones forman parte de la sexualidad y por qué importa el respeto?', ideas: ['La sexualidad integra dimensiones biológicas, afectivas, psicológicas y sociales.', 'No se reduce a la reproducción.', 'El respeto mutuo y la responsabilidad individual forman parte de ella.'], myth: '«La sexualidad es solo reproducción».', ev: 'Esquema de las cuatro dimensiones.', msg: 'Respetar a las demás personas y buscar orientación confiable.' } },
  { id: 3, name: 'Respeto, límites y responsabilidad', oa: 'OA 1', kw: /respeto|l[ií]mite|responsab|relaci/i,
    ex: { q: '¿Cómo se expresan el respeto y los límites en las relaciones entre personas?', ideas: ['Respetar implica reconocer los límites propios y los de otras personas.', 'Los acuerdos se construyen con comunicación respetuosa.', 'Existen adultos y servicios a quienes pedir ayuda.'], myth: '«Presionar a otra persona es normal en una relación».', ev: 'Semáforo de situaciones respetuosas (casos ficticios).', msg: 'Expresar límites con respeto y buscar ayuda adulta cuando algo incomoda.' } },
  { id: 4, name: 'Ciclo menstrual y su variabilidad', oa: 'OA 2', kw: /ciclo|menstru|ovulaci|variab|f[eé]rtil/i,
    ex: { q: '¿Cómo funciona el ciclo menstrual y por qué no es igual en todas las personas?', ideas: ['El ciclo menstrual incluye menstruación, ovulación y días fértiles.', 'Su duración y regularidad varían entre personas y a lo largo del tiempo.', 'Registrar el ciclo y consultar ante dudas ayuda a comprenderlo.'], myth: '«El ciclo siempre dura exactamente 28 días».', ev: 'Gráfico de ciclos ficticios que muestra variabilidad.', msg: 'Conocer el propio ciclo y consultar a un profesional si hay preocupación.' } },
  { id: 5, name: 'Fecundación: de las gametas a un nuevo individuo', oa: 'OA 2', kw: /fecundaci|gameta|espermatozoide|ovocito|implantaci|individuo/i,
    ex: { q: '¿Cómo se forma un nuevo individuo a partir de las gametas?', ideas: ['La fecundación es la unión de un espermatozoide con un ovocito.', 'El cigoto se divide y luego se implanta en el útero.', 'Fecundación e implantación son procesos distintos.'], myth: '«Fecundación e implantación son lo mismo».', ev: 'Línea de tiempo del proceso.', msg: 'Una información precisa permite decisiones informadas.' } },
  { id: 6, name: 'Métodos de control de la natalidad', oa: 'OA 2', kw: /m[eé]todo|natalidad|anticoncep|eficacia/i,
    ex: { q: '¿Qué métodos de control de la natalidad existen y cómo verificar su información?', ideas: ['Hay distintos métodos con diferente eficacia y forma de uso correcto.', 'Solo algunos protegen además frente a las ITS.', 'La elección informada se apoya en fuentes oficiales y orientación profesional.'], myth: '«Cualquier método protege de las ITS».', ev: 'Matriz comparativa de métodos.', msg: 'Consultar en un centro de salud para decidir con información confiable.' } },
  { id: 7, name: 'Paternidad y maternidad responsables', oa: 'OA 2', kw: /paternidad|maternidad|responsab|proyecto de vida|cuidado/i,
    ex: { q: '¿Qué implican la paternidad y la maternidad responsables en un proyecto de vida?', ideas: ['Implican decisiones informadas y cuidado de otra persona.', 'Se relacionan con el proyecto de vida y con el apoyo de la comunidad.', 'La corresponsabilidad reparte el cuidado entre las personas adultas.'], myth: '«El cuidado de un hijo o hija es tarea de una sola persona».', ev: 'Mapa de responsabilidades (caso ficticio).', msg: 'Decidir con información y apoyo.' } },
  { id: 8, name: 'ITS: transmisión y mitos', oa: 'OA 3', kw: /\bits\b|infecci|transmis|mito|contagi/i,
    ex: { q: '¿Cómo se transmiten realmente las ITS y qué mitos conviene descartar?', ideas: ['Las ITS se transmiten por vía sexual sin protección, por sangre contaminada y de madre a hijo/a.', 'El contacto cotidiano no transmite ITS.', 'Algunas ITS pueden no dar síntomas.'], myth: '«Un abrazo o compartir un vaso transmite ITS».', ev: 'Esquema de las vías de transmisión.', msg: 'Informarse en fuentes oficiales y consultar en un centro de salud ante dudas.' } },
  { id: 9, name: 'ITS: síntomas, prevención y ayuda', oa: 'OA 3', kw: /\bits\b|infecci|s[ií]ntoma|prevenci|ayuda|consult/i,
    ex: { q: '¿Cómo podemos prevenir las ITS y dónde buscar ayuda si hay dudas?', ideas: ['El uso correcto del preservativo reduce el riesgo de varias ITS.', 'Existen vacunas disponibles para algunas infecciones.', 'Ante una molestia se consulta a un profesional y no se automedica.'], myth: '«Si no hay síntomas, no hay riesgo».', ev: 'Escudo de medidas de prevención con sus límites.', msg: 'Prevenir, consultar y no automedicarse.' } },
  { id: 10, name: 'Datos de salud: leer sin exagerar', oa: 'OA 3', kw: /dato|gr[aá]fic|evidenc|fuente|tendencia/i,
    ex: { q: '¿Cómo leer datos y gráficos de salud sin exagerar sus conclusiones?', ideas: ['Un dato se lee junto con su título, su unidad y su fuente.', 'Una tendencia no prueba por sí sola una causa.', 'Se concluye solo lo que los datos permiten.'], myth: '«Si un gráfico sube, la causa es la que yo imagino».', ev: 'Gráfico de líneas ilustrativo con título, unidad y fuente.', msg: 'Leer con calma y verificar la fuente antes de compartir.' } },
];
export const AUDIENCES = ['Estudiantes de 6° básico', 'Estudiantes de 8° básico', 'Otros cursos de 7° básico', 'Familias en la feria escolar', 'Comunidad escolar completa'];

// ---- Slide 10 · fuentes ----
// cat: P principal · A apoyo con cuidado · N no usar como evidencia
export const SOURCES = [
  { id: 'minsal', t: 'Sitio oficial del Ministerio de Salud (MINSAL)', cat: 'P', inst: true, why: 'Institución sanitaria oficial: verificable y con responsables identificados.' },
  { id: 'curr', t: 'Currículum Nacional (Mineduc)', cat: 'P', inst: true, why: 'Define los OA de la unidad: base oficial para el alcance del proyecto.' },
  { id: 'oms', t: 'Organización Mundial de la Salud (OMS)', cat: 'P', inst: true, why: 'Organismo sanitario reconocido, con documentación pública verificable.' },
  { id: 'diprece', t: 'Material educativo de salud de un servicio público (p. ej., DIPRECE)', cat: 'P', inst: true, why: 'Material institucional preparado por profesionales de salud.' },
  { id: 'texto', t: 'Texto escolar de Ciencias Naturales', cat: 'A', inst: false, why: 'Útil para conceptos básicos, pero se contrasta con una fuente institucional.' },
  { id: 'divul', t: 'Artículo de divulgación con autor y referencias', cat: 'A', inst: false, why: 'Puede orientar, pero se verifica en la fuente original antes de citarlo.' },
  { id: 'influ', t: 'Cuenta de redes sociales con muchos seguidores', cat: 'N', inst: false, why: 'La popularidad no es evidencia; no puede ser la evidencia principal.' },
  { id: 'cadena', t: 'Cadena reenviada por mensajería', cat: 'N', inst: false, why: 'Sin autor ni referencias: no se puede verificar.' },
  { id: 'blog', t: 'Blog anónimo sin referencias', cat: 'N', inst: false, why: 'Sin responsable identificable ni respaldo comprobable.' },
];
export const SRC_CAT = { P: 'Evidencia principal', A: 'Apoyo con cuidado', N: 'No usar como evidencia' };

// ---- Slide 11 · siete diapositivas ----
export const SLIDES7 = [
  { n: 1, t: 'Portada', hint: 'Pregunta central y audiencia', ex: 'Al terminar, la audiencia conocerá la pregunta central y por qué importa.' },
  { n: 2, t: 'Audiencia y propósito', hint: 'A quién y para qué', ex: 'Al terminar, la audiencia sabrá qué aprenderá y para qué le sirve.' },
  { n: 3, t: 'Idea científica 1', hint: 'Primera idea con su fuente', ex: 'Al terminar, la audiencia podrá explicar la primera idea científica.' },
  { n: 4, t: 'Idea científica 2', hint: 'Segunda idea con su fuente', ex: 'Al terminar, la audiencia podrá explicar la segunda idea científica.' },
  { n: 5, t: 'Idea 3 + evidencia', hint: 'Tercera idea y gráfico o esquema', ex: 'Al terminar, la audiencia podrá interpretar el gráfico que respalda la idea.' },
  { n: 6, t: 'Mito frente a evidencia', hint: 'Mito o duda frecuente corregidos', ex: 'Al terminar, la audiencia podrá distinguir el mito de la evidencia.' },
  { n: 7, t: 'Mensaje y fuentes', hint: 'Autocuidado y referencias', ex: 'Al terminar, la audiencia recordará una medida de autocuidado y dónde consultar.' },
];
export const OBJ_VERBS = /(?<![a-záéíóúñ])(podr[aá]n?|sabr[aá]n?|comprender[aá]n?|explicar|distinguir|identificar|reconocer|interpretar|conocer[aá]n?|recordar[aá]n?|describir|comparar|elegir|decidir|relacionar|aprender[aá]n?)(?![a-záéíóúñ])/i;

// ---- Slide 12 · roles ----
export const ROLES = [
  { id: 'inv', t: 'Investigación', d: 'Busca y contrasta información en fuentes institucionales.', c: 'mint' },
  { id: 'red', t: 'Redacción', d: 'Escribe frases breves, claras y sin absolutos.', c: 'hi' },
  { id: 'dis', t: 'Diseño', d: 'Organiza cada diapositiva con una sola idea y buen contraste.', c: 'pink' },
  { id: 'fue', t: 'Fuentes', d: 'Registra y verifica cada referencia.', c: 'sky' },
  { id: 'gra', t: 'Gráfico', d: 'Construye el gráfico o esquema con título, unidad y fuente.', c: 'lilac' },
  { id: 'exp', t: 'Exposición', d: 'Prepara y coordina la presentación oral de todo el grupo.', c: 'coral' },
];

// ---- Slide 13 · criterios formativos y preguntas de precisión ----
export const FORM_CRIT = [
  { id: 'q', t: 'Pregunta central clara', prec: '¿Qué parte de la pregunta central se responderá con evidencia, y cuál no?' },
  { id: 'oa', t: 'Alineación con los OA', prec: '¿Con qué OA se relaciona y qué contenido de 7° queda fuera del proyecto?' },
  { id: 'src', t: 'Fuentes previstas', prec: '¿Cuáles son las dos fuentes institucionales y qué sección usarán de cada una?' },
  { id: 'vis', t: 'Apoyo visual pertinente', prec: '¿Qué muestra exactamente el gráfico o esquema y cuál es su título y su unidad?' },
  { id: 'rol', t: 'Roles distribuidos', prec: '¿Qué dirá cada integrante durante la exposición?' },
];
export const NEXT_NOTICE = 'La próxima clase trabajaremos en computación construyendo el PPT científico. Deben traer su planificación.';
