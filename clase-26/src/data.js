// Contenido pedagógico de la Clase 26 (Plan de Unidad 4 · Ciencias Naturales 7°) — Computación: PPT «Autocuidado informado».
// Todos los casos, páginas, mensajes, gráficos y evidencias son FICTICIOS (ilustrativos). Las referencias a instituciones
// (Currículum Nacional, MINSAL/DIPRECE, OMS) son orientativas: el docente proyecta los sitios oficiales vigentes.
// Semáforos, balanza y banquito son ORIENTATIVOS: la revisión humana prevalece. Sin preguntas reales de pruebas.

export const PHASES = {
  intro:        { name: 'Inicio · ruta',       min: 5,  color: 'var(--co)' },
  activacion:   { name: 'Activación',          min: 5,  color: 'var(--sun)' },
  preguntas:    { name: 'Preguntas iniciales', min: 10, color: 'var(--lila)' },
  modelamiento: { name: 'Modelamiento',        min: 15, color: 'var(--mint)' },
  actividad:    { name: 'Actividad central',   min: 35, color: 'var(--sky)' },
  comun:        { name: 'Puesta en común',     min: 10, color: 'var(--co)' },
  ticket:       { name: 'Ticket y aviso',      min: 10, color: 'var(--sun)' },
};

export const NOTES = [
  '<b>Portada.</b> Hoy se <u>construye</u> el PPT científico del proyecto «Autocuidado informado: del mito a la evidencia». Muestra la ventana del editor: siete miniaturas = las siete diapositivas que pide el plan. Recuerda el cuidado: todo lo que verás es <b>ilustrativo</b>; las fuentes oficiales vigentes las proyecta el docente (Currículum Nacional, MINSAL/DIPRECE, otros organismos sanitarios reconocidos). Atajos: <kbd>N</kbd> notas · <kbd>G</kbd> índice · <kbd>T</kbd> reloj · <kbd>M</kbd> movimiento reducido.',
  '<b>Ruta (5 min).</b> Meta: elaborar un PPT científico de autocuidado que comunique información correcta, respetuosa y respaldada por fuentes oficiales. Recorre los cinco pasos y la barra de tiempos (haz clic en un tramo). Resguardos: sala de computación; evitar imágenes clínicas explícitas o material sensacionalista; sin relatos íntimos ni redes sociales como evidencia principal. <b>Antes de crear</b>, cada grupo muestra dos fuentes institucionales.',
  '<b>Activación: checklist «¿Información o rumor?» (5 min).</b> Seis pestañas ficticias. Cada grupo decide cuáles sirven, elige <u>dos fuentes institucionales</u> y marca por qué son confiables (institución, fecha, autoría, datos verificables, propósito). Además confirma que su pregunta central puede responderse con los OA 1–3. Cuando el checklist está completo se habilita «Empezar a crear». En la sala, repite el ejercicio con las fuentes reales del grupo y <u>muéstraselas al docente</u> antes de abrir el programa de presentaciones.',
  '<b>Preguntas iniciales (10 min).</b> Cinco preguntas del plan. Al abrir una, la tira de miniaturas muestra <u>en qué diapositivas del PPT</u> se responde. Pide una respuesta breve por grupo (se guarda en este equipo). Idea fuerza: antes de diseñar hay que decidir la idea principal; el miedo, la vergüenza y el estigma se evitan con lenguaje informativo y fuentes citadas.',
  '<b>Vocabulario (parte de las preguntas iniciales).</b> Siete términos del plan: evidencia, fuente, prevención, autocuidado, comunicación científica, gráfico y modelo. Elige una definición y luego el término; si se equivoca, la pista orienta sin dar la respuesta. Al acertar aparece cómo se usa el término <u>en el PPT</u>.',
  '<b>Modelamiento 1/4: anatomía de una diapositiva (15 min en total).</b> El docente modela una diapositiva breve: título, idea central, apoyo visual no explícito, evidencia y fuente. Usa el interruptor para comparar con una versión cargada de texto (ejemplo ilustrativo sobre pubertad). Criterio práctico: una idea por diapositiva y, como referencia, unas 40 palabras o menos; esquemas, tablas o gráficos antes que párrafos.',
  '<b>Modelamiento 2/4: de un párrafo a una frase de síntesis.</b> Se lee un párrafo ficticio «de una fuente», se eligen las ideas clave y se compara cuatro frases: copia literal, absoluta, estigmatizante y la prudente. Luego cada estudiante escribe la suya y el revisor orientativo avisa si copia, si usa palabras absolutas o si se pasa de largo. La revisión humana prevalece.',
  '<b>Modelamiento 3/4: leer y diseñar un gráfico (3D).</b> Datos <u>ficticios</u>: tipos de fuente de un borrador de curso. Gira el modelo, toca una barra y activa las partes del gráfico (título que concluye, ejes con unidad, fuente y año, marca «ilustrativo»). Conclusión prudente: «en este caso ficticio se observa…», no afirmaciones universales.',
  '<b>Modelamiento 4/4: citar de manera simple.</b> Se arma una referencia a partir de un documento ficticio: institución, título, año, enlace y fecha de consulta. Si se elige una fuente sin autoría o sin fecha, se explica por qué no sirve. Regla: referencia corta al pie de cada diapositiva y lista completa en la diapositiva 7.',
  '<b>Actividad central 1/3: las siete diapositivas (35 min en total).</b> Tablero del PPT: qué debe incluir cada diapositiva, responsable y estado. Cada integrante prepara una parte breve de la exposición y registra su responsabilidad (usa «Integrante 1…» o iniciales; sin datos personales). Verifica que nadie quede sin parte.',
  '<b>Actividad central 2/3: mito y evidencia (diapositiva 4).</b> La balanza 3D pesa el mito frente a la evidencia: las fuentes oficiales pesan más; las que carecen de respaldo quedan huecas y casi no pesan. Es una <u>metáfora orientativa</u>: no se «gana» sumando cantidad, sino fuentes confiables. Al final se compone un borrador de la diapositiva 4 que el grupo adapta con sus palabras.',
  '<b>Actividad central 3/3: autocuidado sin miedo y dónde buscar ayuda (diapositivas 6 y 7).</b> Cinco mensajes ficticios para reescribir: se evita el miedo, la vergüenza, el estigma y las afirmaciones absolutas. Después, qué debe incluir la diapositiva de ayuda e información. Los canales de ayuda vigentes (centro de salud, línea oficial) los proyecta el docente: no se usan números de memoria.',
  '<b>Puesta en común: revisión entre grupos (10 min).</b> Tres criterios: exactitud, respeto y claridad. En el banquito 3D, si una pata es corta, cojea: se corrige primero la más débil. Compara con la clave <u>orientativa</u> de tres diapositivas ficticias. Registra qué diapositivas quedan pendientes (se guarda en este equipo) y corrige las afirmaciones absolutas o no respaldadas.',
  '<b>Ticket de salida (10 min).</b> «Antes de presentar necesitamos mejorar ____.» Elige un foco y complétalo; la autoevaluación usa los cuatro criterios formativos del plan. Descarga el registro en un archivo de texto. <b>Avisa:</b> la próxima clase (27) será un taller completo para terminar, revisar y ensayar la presentación; traer el archivo guardado.',
];

// ---- Diapositiva 1 · las siete diapositivas del PPT (plan) ----
export const SLIDES7 = [
  { n: 1, t: 'Título y pregunta', c: 'co', must: ['Título claro', 'Pregunta central del proyecto', 'Integrantes (nombres o iniciales)'], tip: 'Una sola pregunta que se pueda responder con evidencia.' },
  { n: 2, t: 'Conceptos clave', c: 'sun', must: ['2 a 4 conceptos científicos de los OA 1–3', 'Definición breve con palabras propias', 'Un esquema o ícono neutro por concepto'], tip: 'Pocas palabras por concepto; el detalle va en la exposición oral.' },
  { n: 3, t: 'Modelo o proceso', c: 'mint', must: ['Modelo, proceso o clasificación según el tema', 'Apoyo visual no explícito', 'Título que diga la idea'], tip: 'Un modelo es una representación: no es una herramienta de diagnóstico personal.' },
  { n: 4, t: 'Mito y evidencia', c: 'lila', must: ['Un mito o duda frecuente', 'Evidencia que lo corrige', 'Fuente citada al pie'], tip: 'Corrige la idea, no a las personas: nada de burla ni estigma.' },
  { n: 5, t: 'Dato, tabla o gráfico', c: 'sky', must: ['Dato, tabla o gráfico de fuente confiable (si corresponde)', 'Título, unidad y año', 'Una conclusión prudente'], tip: 'Si los datos son de ejemplo, escribe «ilustrativo».' },
  { n: 6, t: 'Autocuidado y respeto', c: 'co', must: ['Medidas de autocuidado, respeto o prevención', 'Lenguaje sin miedo, vergüenza ni estigma', 'Sin afirmaciones absolutas'], tip: 'Mensajes concretos: qué hacer y dónde consultar.' },
  { n: 7, t: 'Ayuda y fuentes', c: 'sun', must: ['Dónde buscar ayuda o información', 'Fuentes consultadas (referencias simples)', 'Al menos dos fuentes institucionales'], tip: 'La lista completa va aquí; al pie de cada diapositiva basta la referencia corta.' },
];

// ---- Diapositiva 3 · «¿Información o rumor?»: pestañas ficticias ----
export const TABS = [
  { id: 'min', name: 'Portal de salud', url: 'portal-ministerio.ejemplo', inst: true, own: 'Ministerio de Salud (ejemplo)', date: 'Actualizada: 2024', aim: 'Informar a la población', cites: 'Cita normativas y datos con enlace', headline: 'Pubertad: qué cambia y cómo cuidarse', sees: ['Institución identificable', 'Fecha visible', 'Propósito: informar', 'Datos verificables'] },
  { id: 'oms', name: 'Organismo', url: 'organismo-salud.ejemplo', inst: true, own: 'Organismo sanitario internacional (ejemplo)', date: 'Actualizada: 2023', aim: 'Orientar con evidencia', cites: 'Cita estudios revisados por especialistas', headline: 'Preguntas frecuentes sobre salud sexual y reproductiva', sees: ['Institución identificable', 'Fecha visible', 'Propósito: orientar', 'Datos verificables'] },
  { id: 'uni', name: 'Universidad', url: 'portal-universidad.ejemplo', inst: true, own: 'Facultad de una universidad (ejemplo)', date: 'Actualizada: 2024', aim: 'Educar con apoyo de especialistas', cites: 'Nombra autoría y equipo revisor', headline: 'Guía breve de prevención para estudiantes', sees: ['Institución identificable', 'Autoría y equipo revisor', 'Fecha visible', 'Propósito: educar'] },
  { id: 'blog', name: 'Blog anónimo', url: 'sinfiltro-blog.ejemplo', inst: false, own: 'Autoría anónima', date: 'Sin fecha', aim: 'Captar visitas', cites: 'No cita datos', headline: '¡Lo que NUNCA te cuentan sobre tu cuerpo!', sees: ['Sin autoría', 'Sin fecha', 'Titular alarmista', 'Sin datos verificables'], why: 'No hay autoría, fecha ni datos: se puede leer con cuidado, pero no sirve como fuente.' },
  { id: 'chain', name: 'Cadena', url: 'mensaje-reenviado.ejemplo', inst: false, own: 'Desconocida', date: 'Sin fecha', aim: 'Que se comparta rápido', cites: 'Dice «lo dijo un doctor» sin nombre', headline: '«Compártelo con 10 personas o te arrepentirás»', sees: ['Presiona a compartir', 'Sin fuente identificable', 'Genera miedo', 'No se puede comprobar'], why: 'Presiona, asusta y no se puede comprobar: es un rumor.' },
  { id: 'vid', name: 'Video', url: 'video-red-social.ejemplo', inst: false, own: 'Cuenta de una persona influyente', date: 'Sin fecha', aim: 'Opinión y alcance', cites: 'Opina sin mostrar evidencia', headline: '«Mi opinión sobre lo que deberías hacer»', sees: ['Es una opinión personal', 'Sin evidencia', 'No es evidencia principal', 'Puede estigmatizar'], why: 'Una opinión en redes no es evidencia principal; sirve, a lo más, para analizar cómo circula un mensaje.' },
];
export const WHY = [
  { id: 'inst', t: 'Institución identificable', ok: true },
  { id: 'date', t: 'Fecha de actualización', ok: true },
  { id: 'auth', t: 'Autoría o equipo responsable', ok: true },
  { id: 'data', t: 'Datos que se pueden verificar', ok: true },
  { id: 'aim', t: 'Propósito: informar o educar', ok: true },
  { id: 'many', t: 'Tiene muchos «me gusta»', ok: false, why: 'La popularidad no demuestra que algo sea correcto.' },
];

// ---- Diapositiva 4 · preguntas iniciales (cada una indica en qué diapositivas del PPT se responde) ----
export const QUESTIONS = [
  { q: '¿Cuál es la idea principal que queremos enseñar?', on: [1, 2], c: 'co',
    idea: 'Una sola idea, dicha en una oración: «Queremos que la audiencia pueda explicar…». Si necesita dos párrafos, el tema es demasiado amplio.' },
  { q: '¿Qué OA estamos comunicando?', on: [2, 3], c: 'sun',
    idea: 'OA 1, 2 o 3 según el tema. Nombra el concepto central y verifica que esté al nivel de 7° básico, sin salirse de la unidad.' },
  { q: '¿Qué dato, modelo o gráfico apoya nuestra explicación?', on: [3, 5], c: 'mint',
    idea: 'Un esquema, tabla o gráfico simple con título, unidad, año y fuente. Evita imágenes clínicas explícitas: un ícono neutro enseña igual.' },
  { q: '¿Cómo evitamos mensajes de miedo, vergüenza o estigma?', on: [4, 6], c: 'lila',
    idea: 'Hablamos de ideas y de medidas, no de personas «buenas» o «malas». Reemplazamos «si no te cuidas…» por qué hacer y dónde consultar.' },
  { q: '¿Cómo citaremos nuestras fuentes?', on: [7], c: 'sky',
    idea: 'Referencia corta al pie de cada diapositiva (institución y año) y lista completa en la diapositiva 7. Al menos dos fuentes institucionales.' },
];

// ---- Diapositiva 5 · vocabulario (7 términos del plan) ----
export const VOCAB = [
  { t: 'Evidencia', d: 'Datos y razonamientos verificables que respaldan una idea.', use: 'Diapositivas 4 y 5: el dato o gráfico que corrige un mito.' },
  { t: 'Fuente', d: 'Origen identificable y verificable de una información.', use: 'Diapositiva 7 y pie de cada lámina: institución y año.' },
  { t: 'Prevención', d: 'Acciones que se toman antes para disminuir un riesgo para la salud.', use: 'Diapositiva 6: medidas concretas, sin miedo.' },
  { t: 'Autocuidado', d: 'Decisiones informadas y responsables que cuidan la propia salud y la de otras personas.', use: 'Diapositivas 6 y 7: qué hacer y dónde consultar.' },
  { t: 'Comunicación científica', d: 'Explicar ideas de la ciencia a una audiencia con claridad, respeto y respaldo de fuentes.', use: 'Todo el PPT y la exposición oral.' },
  { t: 'Gráfico', d: 'Representación visual de datos con título, ejes, unidades y fuente.', use: 'Diapositiva 5: apoya una conclusión prudente.' },
  { t: 'Modelo', d: 'Representación simplificada que ayuda a comprender un proceso; no es una copia exacta de la realidad.', use: 'Diapositiva 3: esquema, proceso o clasificación.' },
];
export const VOCAB_HINT = {
  Evidencia: 'Pista: se puede comprobar con datos.',
  Fuente: 'Pista: responde «¿de dónde viene?».',
  Prevención: 'Pista: ocurre antes de que haya un problema.',
  Autocuidado: 'Pista: incluye informarse y pedir ayuda cuando corresponde.',
  'Comunicación científica': 'Pista: ciencia + audiencia + respeto.',
  Gráfico: 'Pista: tiene título, ejes y unidades.',
  Modelo: 'Pista: simplifica para comprender, pero no es la realidad completa.',
};

// ---- Diapositiva 6 · anatomía de una diapositiva (ejemplo ilustrativo: pubertad) ----
export const ANATOMY = [
  { id: 'titulo', n: 1, t: 'Título', short: 'Dice la idea', text: 'Un título que ya enseña: «La pubertad empieza en edades distintas» comunica más que «Pubertad».' },
  { id: 'idea', n: 2, t: 'Idea central', short: 'Una sola idea', text: 'Una oración corta con palabras propias. Si hay más de una idea, se divide en otra diapositiva.' },
  { id: 'visual', n: 3, t: 'Apoyo visual no explícito', short: 'Esquema, no foto', text: 'Línea de tiempo, tabla o esquema neutro. No se usan fotografías clínicas ni imágenes sensacionalistas.' },
  { id: 'evidencia', n: 4, t: 'Evidencia', short: 'Dato que respalda', text: 'Un dato o enunciado verificable que apoya la idea; si es de ejemplo, se rotula «ilustrativo».' },
  { id: 'fuente', n: 5, t: 'Fuente', short: 'Institución y año', text: 'Referencia simple al pie: quién lo dice y cuándo. La lista completa va en la diapositiva 7.' },
];
export const ANATOMY_BAD = [
  'Mucho texto: parece un apunte pegado, no una diapositiva.',
  'Varias ideas juntas: la audiencia no sabe cuál recordar.',
  'Sin fuente: no se puede comprobar.',
  'Decoración que distrae y poco contraste.',
];

// ---- Diapositiva 7 · frase de síntesis ----
export const PARAGRAPH =
  'La pubertad es un proceso de cambios físicos, hormonales y emocionales que ocurre en edades distintas según cada persona. No existe una edad única ni un orden idéntico de los cambios, y cualquier duda puede conversarse con una persona adulta de confianza o con profesionales de salud.';
export const KEYWORDS = ['proceso', 'cambios', 'edades distintas', 'cada persona', 'duda', 'profesionales de salud'];
export const SYNTH = [
  { t: 'La pubertad es un proceso de cambios físicos, hormonales y emocionales que ocurre en edades distintas según cada persona.', tag: 'Copia literal', ok: false, fb: 'Copia casi palabra por palabra: la síntesis debe decir lo mismo con palabras propias y más corto.' },
  { t: 'Todos cambian a la misma edad y quien no lo hace tiene un problema.', tag: 'Absoluta y estigmatizante', ok: false, fb: 'Es inexacta («todos», «misma edad») y estigmatiza. La fuente dice justo lo contrario: las edades varían.' },
  { t: 'La pubertad llega en momentos distintos para cada persona; si hay dudas, se pueden consultar con un adulto de confianza o con profesionales de salud.', tag: 'Síntesis prudente', ok: true, fb: 'Exacta (variabilidad), respetuosa (sin juicio) y clara (una idea y dónde consultar).' },
  { t: 'Es mejor no preguntar por estos cambios para evitar vergüenza.', tag: 'Fomenta la vergüenza', ok: false, fb: 'Contradice la fuente: preguntar es parte del autocuidado y no debe causar vergüenza.' },
];
export const ABSOLUTES = /(?<![a-záéíóúñ])(todos|todas|nadie|nunca|siempre|jamás|100\s?%|cien por ciento|imposible|seguro|garantizado|sin riesgo|todo el mundo|cualquiera)(?![a-záéíóúñ])/gi;

// ---- Diapositiva 8 · gráfico 3D (datos FICTICIOS) ----
export const CHART = {
  title: 'Tipos de fuente usados en un borrador de curso (n = 40 fuentes)',
  conclusion: 'En este caso ficticio, 27 de 40 fuentes son institucionales o universitarias; 7 de 40 aún no sirven como evidencia principal.',
  unit: 'N.° de fuentes',
  source: 'Datos ilustrativos creados para la clase, 2025',
  bars: [
    { t: 'Ministerio / organismo', short: 'Ministerio', v: 18, c: 'mint', ok: true },
    { t: 'Universidad', v: 9, c: 'sky', ok: true },
    { t: 'Prensa', v: 6, c: 'sun', ok: null },
    { t: 'Blog', v: 4, c: 'co', ok: false },
    { t: 'Red social', v: 3, c: 'co', ok: false },
  ],
  parts: [
    { id: 'title', t: 'Título que concluye', why: 'El título dice qué se ve: tipo de fuente y cantidad (n = 40).' },
    { id: 'axes', t: 'Ejes con unidad', why: 'Sin unidad no se sabe qué se mide: aquí, número de fuentes.' },
    { id: 'src', t: 'Fuente y año', why: 'Dónde salen los datos y cuándo: aquí, datos ilustrativos 2025.' },
    { id: 'ill', t: 'Marca «ilustrativo»', why: 'Los datos son de ejemplo: así nadie los toma como estadística real.' },
  ],
  say: (b) => `${b.t}: ${b.v} de 40 fuentes (${Math.round((b.v / 40) * 100)} %). ${b.ok === true ? 'Sirve como evidencia principal.' : b.ok === false ? 'No sirve como evidencia principal: se reemplaza por una fuente institucional.' : 'Se usa con cuidado: se contrasta con una fuente institucional.'}`,
};

// ---- Diapositiva 9 · referencia simple (documento FICTICIO) ----
export const REF = {
  doc: 'Guía ilustrativa «Cambios en la pubertad: preguntas frecuentes»',
  fields: [
    { id: 'inst', t: 'Institución', opts: ['Ministerio de Salud (ejemplo)', 'Un blog anónimo', 'Mi compañero de curso'], ok: 0, bad: 'Una referencia necesita una institución u autoría identificable.' },
    { id: 'title', t: 'Título', opts: ['Cambios en la pubertad: preguntas frecuentes', 'Lo que nadie te dice', 'Sin título'], ok: 0, bad: 'El título debe ser el del documento consultado, no un titular alarmista.' },
    { id: 'year', t: 'Año', opts: ['2024', 'Sin fecha', 'Hace poco'], ok: 0, bad: 'Se necesita el año (o la fecha) para saber qué tan actual es.' },
    { id: 'url', t: 'Enlace', opts: ['sitio-oficial.ejemplo/pubertad', 'Lo vi en un video', 'Búscalo en internet'], ok: 0, bad: 'El enlace permite comprobar la información.' },
    { id: 'seen', t: 'Fecha de consulta', opts: ['Consultado: noviembre de 2025', 'Consultado: ayer en el celular', 'No anoté'], ok: 0, bad: 'Anota cuándo lo revisaste: las páginas pueden cambiar.' },
  ],
};

// ---- Diapositiva 10 · tablero de las siete diapositivas ----
export const STATES = ['Por hacer', 'En curso', 'Lista'];

// ---- Diapositiva 11 · balanza mito–evidencia (todo ILUSTRATIVO) ----
export const MYTHS = [
  { id: 'm1', myth: 'Todas las personas empiezan la pubertad a la misma edad.', fix: 'La edad de inicio de la pubertad varía entre personas; no existe una edad única.',
    ev: [
      { t: 'Ficha de un ministerio de salud (ejemplo): la pubertad empieza en edades distintas.', src: 'Ministerio de Salud (ejemplo), 2024', kind: 'o' },
      { t: 'Material de una universidad (ejemplo): los cambios no siguen el mismo orden ni el mismo ritmo.', src: 'Facultad de Medicina (ejemplo), 2023', kind: 'o' },
      { t: 'Nota de prensa que resume una guía sanitaria, con enlace.', src: 'Medio de prensa (ejemplo), 2024', kind: 'c' },
      { t: 'Cadena: «mi prima dice que a los 12 todas cambian».', src: 'Mensaje reenviado, sin fecha', kind: 'r' },
      { t: 'Opinión en un foro anónimo.', src: 'Foro, sin autoría', kind: 'r' },
    ] },
  { id: 'm2', myth: 'El ciclo menstrual dura siempre exactamente 28 días.', fix: 'La duración del ciclo puede variar entre personas y entre ciclos; el «28» es un valor de ejemplo de los modelos.',
    ev: [
      { t: 'Guía de un organismo sanitario (ejemplo): la duración del ciclo varía.', src: 'Organismo sanitario (ejemplo), 2023', kind: 'o' },
      { t: 'Material del ministerio (ejemplo): los modelos usan ciclos «tipo» solo para explicar.', src: 'Ministerio de Salud (ejemplo), 2024', kind: 'o' },
      { t: 'Artículo de prensa sin enlace a la guía original.', src: 'Medio de prensa (ejemplo), 2022', kind: 'c' },
      { t: 'Video viral: «el cuerpo es un reloj exacto».', src: 'Cuenta influyente, sin fecha', kind: 'r' },
      { t: 'Comentario en una red social.', src: 'Red social, sin autoría', kind: 'r' },
    ] },
  { id: 'm3', myth: 'Si alguien tiene una ITS, siempre se nota.', fix: 'Muchas ITS pueden no tener síntomas visibles; por eso importan la prevención y el control con profesionales de salud.',
    ev: [
      { t: 'Ficha de un ministerio de salud (ejemplo): varias ITS pueden no dar síntomas.', src: 'Ministerio de Salud (ejemplo), 2024', kind: 'o' },
      { t: 'Organismo sanitario internacional (ejemplo): la prevención y el control periódico son parte del cuidado.', src: 'Organismo sanitario (ejemplo), 2023', kind: 'o' },
      { t: 'Blog con fecha que cita una guía sanitaria.', src: 'Blog con referencias, 2022', kind: 'c' },
      { t: 'Cadena: «se ve a simple vista».', src: 'Mensaje reenviado, sin fecha', kind: 'r' },
      { t: 'Opinión en un grupo de mensajería.', src: 'Mensajería, sin autoría', kind: 'r' },
    ] },
  { id: 'm4', myth: 'Preguntar por salud sexual da vergüenza y es mejor no hacerlo.', fix: 'Preguntar y pedir orientación es parte del autocuidado; hay adultos de confianza y servicios de salud que ayudan.',
    ev: [
      { t: 'Orientación de un ministerio de salud (ejemplo): consultar es parte del autocuidado.', src: 'Ministerio de Salud (ejemplo), 2024', kind: 'o' },
      { t: 'Currículum Nacional (ejemplo): se promueve la información y la responsabilidad.', src: 'Currículum Nacional (ejemplo), 2023', kind: 'o' },
      { t: 'Artículo de un medio que entrevista a profesionales de salud.', src: 'Medio de prensa (ejemplo), 2024', kind: 'c' },
      { t: 'Meme: «mejor ni preguntes».', src: 'Red social, sin autoría', kind: 'r' },
      { t: 'Opinión en un chat.', src: 'Chat, sin autoría', kind: 'r' },
    ] },
];
export const WEIGHT = { o: 3, c: 1.5, r: 0.3 };
export const MYTH_WEIGHT = 5.5;
export const KIND = { o: 'Fuente oficial', c: 'Apoyo con cuidado', r: 'Sin respaldo' };

// ---- Diapositiva 12 · mensajes de autocuidado sin miedo ni estigma (todos ficticios) ----
export const MSGS = [
  { bad: 'Si no te cuidas, te vas a arrepentir toda la vida.', flag: 'Miedo', opts: [
    { t: 'Si no te cuidas, vas a sufrir mucho.', ok: false, fb: 'Sigue asustando: no dice qué hacer ni dónde consultar.' },
    { t: 'Cuidarte incluye informarte en fuentes oficiales y consultar tus dudas con un adulto de confianza o un centro de salud.', ok: true, fb: 'Informa, dice qué hacer y dónde consultar, sin amenazar.' },
    { t: 'Nunca pasa nada si estás atento.', ok: false, fb: '«Nunca» es absoluto y da falsa seguridad.' },
  ] },
  { bad: 'Quienes tienen una ITS son irresponsables.', flag: 'Estigma', opts: [
    { t: 'Las ITS pueden afectar a cualquier persona; conocer cómo se previenen y consultar a profesionales ayuda a cuidar la salud.', ok: true, fb: 'Habla de ideas y medidas, no de personas «buenas» o «malas».' },
    { t: 'Solo les pasa a quienes no se cuidan.', ok: false, fb: 'Sigue culpando a las personas: es estigma.' },
    { t: 'Mejor alejarse de quien tenga una.', ok: false, fb: 'Promueve la exclusión; no es una medida de prevención.' },
  ] },
  { bad: 'Todos los métodos funcionan siempre al 100 %.', flag: 'Afirmación absoluta', opts: [
    { t: 'Los métodos tienen distinta eficacia y se deben usar correctamente; un profesional de salud puede orientar cuál conviene.', ok: true, fb: 'Es exacta y prudente: evita «todos», «siempre» y «100 %».' },
    { t: 'Casi todos los métodos son iguales de seguros.', ok: false, fb: 'Sigue generalizando sin respaldo.' },
    { t: 'Ningún método sirve, mejor no usar nada.', ok: false, fb: 'Es falso y riesgoso: otro absoluto.' },
  ] },
  { bad: '¡Qué vergüenza preguntar! Mejor no digas nada.', flag: 'Vergüenza', opts: [
    { t: 'Preguntar es parte del autocuidado: puedes consultar a un adulto de confianza o a un centro de salud.', ok: true, fb: 'Normaliza preguntar y señala dónde ir.' },
    { t: 'Pregunta solo si nadie se entera.', ok: false, fb: 'Mantiene la idea de que preguntar es algo oculto.' },
    { t: 'Si dudas, quédate callado y espera.', ok: false, fb: 'No ayuda a obtener información confiable.' },
  ] },
  { bad: 'Averigua en internet y listo.', flag: 'Sin fuente', opts: [
    { t: 'Busca en sitios institucionales (ministerio, organismos sanitarios) y contrasta al menos dos fuentes.', ok: true, fb: 'Dice dónde buscar y cómo comprobar.' },
    { t: 'Lee lo primero que salga en el buscador.', ok: false, fb: 'El primer resultado no garantiza una fuente confiable.' },
    { t: 'Pregunta en redes sociales qué opinan.', ok: false, fb: 'Las opiniones en redes no son evidencia principal.' },
  ] },
];
export const HELP = [
  { t: 'Una persona adulta de confianza', ok: true },
  { t: 'Profesionales de un centro de salud', ok: true },
  { t: 'Sitios oficiales (ministerio de salud, organismos sanitarios reconocidos)', ok: true },
  { t: 'Línea oficial de orientación vigente (la proyecta el docente)', ok: true },
  { t: 'Comentarios de desconocidos en redes sociales', ok: false, why: 'No son evidencia principal ni ayuda profesional.' },
  { t: 'Un número de teléfono anotado «de memoria»', ok: false, why: 'Se verifica en la fuente oficial vigente antes de publicarlo.' },
];

// ---- Diapositiva 13 · banquito de tres patas: revisión entre grupos (diapositivas FICTICIAS) ----
export const CRIT3 = [
  { id: 'ex', t: 'Exactitud', c: 'sky', q: '¿Lo que dice es correcto y está respaldado?' },
  { id: 're', t: 'Respeto', c: 'co', q: '¿Evita miedo, vergüenza y estigma?' },
  { id: 'cl', t: 'Claridad', c: 'mint', q: '¿Se entiende de un vistazo?' },
];
export const LEVELS = ['Falta', 'En camino', 'Logrado'];
export const REVIEW = [
  { id: 'A', title: 'Diapositiva A · ilustrativa', body: 'Pubertad: <b>todos</b> cambian a los 12 años. Si no pasa, <b>algo anda mal</b> y es mejor <b>no contarlo</b>. <i>(sin fuente)</i>', key: [0, 0, 2],
    fb: ['Dice «todos» y una edad única sin fuente: exactitud falta.', 'Culpa y fomenta ocultar: el respeto falta.', 'Es corta y se lee bien: la claridad está lograda.'] },
  { id: 'B', title: 'Diapositiva B · ilustrativa', body: 'Gráfico: «Fuentes del borrador». 5 barras sin título ni unidad ni año; texto al pie de 9 puntos. Mensaje: «Informarse es parte del autocuidado».', key: [1, 2, 0],
    fb: ['El mensaje es correcto pero faltan título, unidad y año: está en camino.', 'El lenguaje es respetuoso: logrado.', 'Sin título ni unidad ni tamaño legible: falta claridad.'] },
  { id: 'C', title: 'Diapositiva C · ilustrativa', body: 'Título: «La pubertad llega en momentos distintos». Esquema de línea de tiempo neutro. «Si tienes dudas, consulta a un adulto de confianza o un centro de salud». Fuente: Ministerio de Salud (ejemplo), 2024.', key: [2, 2, 2],
    fb: ['Respaldada y prudente: logrado.', 'Sin juicios y con dónde consultar: logrado.', 'Una idea, un esquema, fuente al pie: logrado.'] },
];

// ---- Diapositiva 14 · ticket y autoevaluación ----
export const FOCI = ['la exactitud de los conceptos', 'las fuentes oficiales y sus citas', 'el gráfico o modelo', 'el lenguaje respetuoso', 'la claridad (menos texto)', 'el ensayo y los tiempos'];
export const SELF = [
  { id: 'f1', t: 'Usa fuentes oficiales', c: 'sky' },
  { id: 'f2', t: 'Comunica conceptos correctos', c: 'mint' },
  { id: 'f3', t: 'Incluye evidencia, modelo o gráfico pertinente', c: 'sun' },
  { id: 'f4', t: 'Mantiene lenguaje respetuoso y no estigmatizante', c: 'co' },
];
export const NEXT_NOTICE = 'La próxima clase tendremos un taller completo para terminar, revisar y ensayar la presentación.';
