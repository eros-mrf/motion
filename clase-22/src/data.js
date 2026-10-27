// Contenido pedagógico de la Clase 22 (Plan de Unidad 4 · Ciencias Naturales 7°) — repaso estructurado OA 3.
// Todos los casos, preguntas y datos son FICTICIOS y de práctica: NO son preguntas de la Prueba N°2.
// Las ideas son paráfrasis de orientación sanitaria general; el docente proyecta la fuente oficial vigente
// (Currículum Nacional, MINSAL u organismos sanitarios reconocidos). Los datos "ilustrativos" no son estadísticas reales.

export const PHASES = {
  intro:        { name: 'Inicio · ruta',         min: 5,  color: 'var(--amber)' },
  recupera:     { name: 'Recuperación',          min: 10, color: 'var(--amber)' },
  preguntas:    { name: 'Preguntas iniciales',   min: 5,  color: 'var(--lilac)' },
  modelamiento: { name: 'Modelamiento',          min: 15, color: 'var(--teal)' },
  estaciones:   { name: 'Actividad · estaciones',min: 25, color: 'var(--sky)' },
  ensayo:       { name: 'Mini ensayo',           min: 15, color: 'var(--rose)' },
  correccion:   { name: 'Corrección razonada',   min: 10, color: 'var(--teal)' },
  cierre:       { name: 'Cierre y aviso',        min: 5,  color: 'var(--amber)' },
};

export const NOTES = [
  '<b>Portada.</b> Hoy no se aprende contenido nuevo: se <b>recupera, organiza y aplica</b> lo trabajado sobre ITS, prevención, fuentes y datos. Anuncia el cuidado de la clase: todo el material es de práctica y ficticio; <u>no contiene preguntas reales de la prueba</u>. Toca el fondo: una onda recorre el mapa.',
  '<b>Ruta (5 min).</b> Lee la meta y las 5 etapas del plan: recuperamos sin apuntes, rotamos por estaciones, mini ensayo individual, corrección razonada y plan de estudio. Recuerda que la próxima clase es la <b>Prueba de Conocimientos N°2</b> (OA 3). Acuerdos: no se comparten vivencias personales; las dudas privadas se derivan a un adulto o profesional.',
  '<b>Recuperación sin apuntes (10 min).</b> Pasos: 1) 4 minutos escribiendo un mapa rápido con las cuatro ramas, sin mirar el cuaderno. 2) «Comparar»: marca con tu color qué conceptos tenías y agrega con otro color lo olvidado. El modelo 3D se ilumina con cada marca. El objetivo no es la nota, sino <u>ver qué rama necesita más estudio</u> (recuperación espaciada).',
  '<b>Preguntas iniciales (5 min).</b> Cinco preguntas del plan, una por fila del tablero. Que respondan oralmente en parejas y luego abre la idea de apoyo. Idea fuerza: una buena respuesta de prevención se <b>justifica con un concepto o evidencia</b>, y una alternativa con absolutos («siempre», «nunca», «todos») merece sospecha.',
  '<b>Vocabulario clave.</b> Empareja cada término con su definición: elige un término y luego su definición. Los errores se cuentan, pero no penalizan. Deja visible la lista (DUA: representación). Los nueve términos son los del plan: transmisión, prevención, síntoma, consecuencia, fuente, dato, evidencia, mito y recomendación.',
  '<b>Modelamiento 1/3: selección con distractores plausibles.</b> Se modela el <u>procedimiento</u>, no una respuesta de la prueba real. Cuatro pasos: leer la orden, tachar absolutos, contrastar con el concepto, justificar. Pulsa cada alternativa para ver por qué un distractor «suena bien» pero falla.',
  '<b>Modelamiento 2/3: interpretar una fuente o gráfico.</b> Datos ilustrativos (no estadísticas reales). Rutina: título y unidad → comparar valores → concluir <u>solo lo que el gráfico permite</u>. Cuidado con confundir «más consultas» con «más casos», o «en esta muestra» con «siempre».',
  '<b>Modelamiento 3/3: desarrollo corto con evidencia.</b> Arma la respuesta con tres piezas: afirmación, evidencia o concepto («la evidencia o concepto que lo demuestra es…») y límite o lenguaje prudente. La rúbrica se enciende con cada criterio logrado. Discute por qué las piezas débiles no alcanzan.',
  '<b>Estaciones (25 min en total).</b> Cuatro estaciones con rotación de ~6 minutos: 1) Mecanismos de transmisión y mitos, 2) Comparación de ITS y síntomas generales, 3) Medidas de prevención y búsqueda de ayuda, 4) Lectura de fuente o gráfico. El modelo 3D muestra dónde está cada grupo (A–D); «Rotar» avanza un puesto. Puedes proyectar el reloj de estación.',
  '<b>Estaciones 1 y 2.</b> E1: clasificar seis afirmaciones como hecho o mito, con la razón. E2: ubicar características en ITS bacterianas, virales o ambas. Aclara que se trata de <b>características generales</b>: el diagnóstico y el tratamiento los indica siempre un profesional de salud.',
  '<b>Estaciones 3 y 4.</b> E3: caso ficticio de búsqueda de ayuda (hacer / evitar). E4: lectura de un gráfico de líneas ilustrativo y elección de la conclusión adecuada. Refuerza: una tendencia no prueba una causa, y consultar es una medida de autocuidado.',
  '<b>Mini ensayo individual (15 min).</b> Ocho preguntas nuevas (selección con cuatro alternativas, orden de alternativas barajado). Después de elegir, se completa la frase «la evidencia o concepto que lo demuestra es…». El reloj corre solo desde «Comenzar». Al entregar, se calcula el puntaje (2 puntos por pregunta: respuesta + justificación). Es <u>formativo</u>, sin calificación.',
  '<b>Corrección razonada (10 min).</b> Cada respuesta se acompaña de la evidencia o concepto que la demuestra. Las torres 3D muestran los contenidos con más errores: modo «Mi ensayo» (individual) o modo «Curso», donde tú registras los errores observados con + y −. Los tres más altos reciben un último refuerzo breve.',
  '<b>Cierre (5 min).</b> Tarjeta de estudio: dos contenidos prioritarios y una estrategia. Ticket de salida: «Para la prueba debo asegurarme de diferenciar ____ de ____.» Avisa: <b>la próxima clase corresponde a la Prueba de Conocimientos N°2 sobre OA 3</b>. Evaluación formativa: recupera sin apoyo, aplica a casos, interpreta evidencia y planifica su estudio.',
];

// ---- Slide 3 · mapa rápido (4 ramas, 16 conceptos clave) ----
export const BRANCHES = [
  { id: 'trans', name: 'Transmisión', c: 'amber', ph: 'Vías por las que pasa una ITS',
    leaves: ['Vía sexual sin protección', 'Contacto con sangre contaminada', 'De madre a hijo/a', 'El contacto cotidiano no transmite'] },
  { id: 'prev', name: 'Prevención', c: 'lilac', ph: 'Cómo reducir el riesgo',
    leaves: ['Preservativo bien usado', 'Vacunas disponibles', 'No compartir agujas', 'Consulta y examen oportuno'] },
  { id: 'sint', name: 'Síntomas y consecuencias', c: 'teal', ph: 'Qué puede pasar y qué hacer',
    leaves: ['Pueden no dar síntomas', 'Señales generales: molestia, flujo, llagas', 'Sin tratar: complicaciones', 'No automedicarse'] },
  { id: 'fuen', name: 'Fuentes y evidencia', c: 'sky', ph: 'Cómo saber si algo es confiable',
    leaves: ['Fuente oficial verificable', 'Dato ≠ opinión', 'Leer título, unidad y escala', 'Desconfiar de absolutos'] },
];

// ---- Slide 4 · preguntas iniciales (del plan) ----
export const QUESTIONS = [
  { q: '¿Qué contenido recuerdo con mayor facilidad?', c: 'amber',
    idea: 'Tu rama fuerte es una ancla: úsala para conectar lo que cuesta más. Explica en voz alta ese contenido a otra persona: si puedes enseñarlo, lo recuerdas.' },
  { q: '¿Qué confusión apareció en la clínica de datos o fuentes?', c: 'sky',
    idea: 'Confusiones frecuentes: tomar una opinión como dato, concluir causas desde una tendencia, olvidar la unidad del gráfico, o creer que una fuente es confiable solo porque es popular.' },
  { q: '¿Qué pregunta requiere leer evidencia y no solo memorizar?', c: 'teal',
    idea: 'Las que incluyen un texto, tabla o gráfico y piden una conclusión, una comparación o una justificación. La respuesta está en la fuente, no solo en la memoria.' },
  { q: '¿Cómo puedo justificar una respuesta de prevención?', c: 'lilac',
    idea: 'Nombra la medida, di qué vía de transmisión interrumpe y aclara su alcance. Ejemplo de estructura: «La medida es…, porque…, aunque…».' },
  { q: '¿Qué haré si una alternativa contiene una afirmación demasiado absoluta?', c: 'rose',
    idea: 'Me detengo y la reviso: «siempre», «nunca», «todos» y «solo» casi nunca se justifican en ciencia. Busco una excepción; si existe, la alternativa se descarta.' },
];

// ---- Slide 5 · vocabulario (emparejar) ----
export const VOCAB = [
  { t: 'Transmisión', d: 'Paso de un agente infeccioso de una persona a otra por una vía específica.' },
  { t: 'Prevención', d: 'Medidas que reducen la probabilidad de contraer o transmitir una infección.' },
  { t: 'Síntoma', d: 'Señal o molestia que percibe la persona; algunas ITS no producen ninguno.' },
  { t: 'Consecuencia', d: 'Efecto posterior sobre la salud cuando una infección no se detecta o no se trata.' },
  { t: 'Fuente', d: 'Origen de una información, que debe poder identificarse y verificarse.' },
  { t: 'Dato', d: 'Valor o hecho registrado que se puede medir, contar o comprobar.' },
  { t: 'Evidencia', d: 'Datos y razonamientos verificables que respaldan una afirmación.' },
  { t: 'Mito', d: 'Creencia extendida que no tiene respaldo científico.' },
  { t: 'Recomendación', d: 'Orientación general basada en evidencia, con su alcance y límites.' },
];

// ---- Slide 6 · modelamiento 1: selección con distractores plausibles ----
export const MODEL_SEL = {
  stem: 'Una cuenta ficticia afirma: «Si no hay síntomas, no hay ITS ni riesgo de transmitirla». ¿Qué alternativa corrige mejor esa afirmación?',
  order: 'corrige mejor',
  alts: [
    { id: 'A', t: 'Las ITS siempre producen síntomas visibles el mismo día del contagio.', ok: false, why: 'Contiene «siempre» y es falsa: los síntomas pueden tardar o no aparecer.', tag: 'absoluto' },
    { id: 'B', t: 'Algunas ITS pueden no dar síntomas y aun así transmitirse; por eso corresponde consultar y hacerse los exámenes indicados.', ok: true, why: 'Es prudente, correcta y orienta a la acción: reconoce el límite de los síntomas.', tag: 'concepto' },
    { id: 'C', t: 'Solo las ITS más graves pueden transmitirse cuando no hay síntomas.', ok: false, why: 'Suena técnica, pero «solo» la vuelve falsa: la gravedad no determina si hay síntomas.', tag: 'plausible' },
    { id: 'D', t: 'Si no hay síntomas, basta con comprar un remedio en la farmacia sin consultar.', ok: false, why: 'Propone automedicarse: no corrige el error y puede ser perjudicial.', tag: 'riesgo' },
  ],
  steps: [
    { n: 1, t: 'Leo la orden', d: 'Subrayo qué me piden: «corrige mejor».' },
    { n: 2, t: 'Tacho absolutos', d: '«Siempre», «solo» y «basta» activan la alerta.' },
    { n: 3, t: 'Contrasto con el concepto', d: '¿Qué sé sobre síntomas y transmisión?' },
    { n: 4, t: 'Justifico', d: '«La evidencia o concepto que lo demuestra es…»' },
  ],
  concept: 'Algunas ITS pueden no producir síntomas y transmitirse igual; solo el examen indicado por un profesional permite saber.',
};

// ---- Slide 7 · modelamiento 2: gráfico ----
export const MODEL_CHART = {
  title: 'Mensajes sobre ITS que citan una fuente, según canal',
  unit: '% de mensajes revisados (muestra ilustrativa)',
  src: 'Fuente: dataset ficticio de práctica · n = 40 mensajes por canal',
  bars: [
    { l: 'Cadena reenviada', v: 8 }, { l: 'Redes sociales', v: 24 }, { l: 'Video sin referencias', v: 15 }, { l: 'Sitio institucional', v: 92 },
  ],
  steps: [
    { n: 1, t: 'Título y unidad', d: '¿Qué mide el gráfico? % de mensajes que citan una fuente, en una muestra ilustrativa.' },
    { n: 2, t: 'Comparo valores', d: 'El sitio institucional (92) supera ampliamente a los otros tres canales.' },
    { n: 3, t: 'Concluyo sin exagerar', d: 'Solo puedo afirmar lo que muestran los datos de esta muestra.' },
  ],
  options: [
    { t: 'Todos los sitios institucionales son siempre correctos.', ok: false, why: 'Generaliza: el gráfico mide si citan fuente, no si siempre aciertan.' },
    { t: 'En esta muestra, los mensajes de sitios institucionales citan una fuente mucho más que las cadenas reenviadas.', ok: true, why: 'Compara valores del gráfico y acota la conclusión a la muestra.' },
    { t: 'Las redes sociales siempre difunden mentiras.', ok: false, why: 'Un absoluto que el gráfico no respalda: solo mide citas de fuente.' },
  ],
};

// ---- Slide 8 · modelamiento 3: desarrollo corto ----
export const MODEL_DEV = {
  prompt: 'Un video ficticio recomienda tratar una molestia genital con una receta casera. Explica qué conviene hacer y por qué.',
  slots: [
    { id: 'claim', label: 'Afirmo que…', rub: 'Afirmación clara',
      opts: [
        { t: 'conviene consultar en un centro de salud y no automedicarse con lo que dice un video.', q: 2 },
        { t: 'si la receta es natural, no puede hacer daño, así que no hace falta consultar.', q: 0 },
        { t: 'es mejor esperar a que pase solo.', q: 1 },
      ] },
    { id: 'ev', label: 'La evidencia o concepto que lo demuestra es…', rub: 'Evidencia o concepto',
      opts: [
        { t: 'que algunas ITS no producen síntomas claros y solo un profesional puede evaluar, diagnosticar e indicar el tratamiento adecuado.', q: 2 },
        { t: 'que el video tiene muchas visitas.', q: 0 },
        { t: 'que una amiga hizo lo mismo.', q: 0 },
      ] },
    { id: 'lim', label: 'Reconozco el límite:', rub: 'Límite o lenguaje prudente',
      opts: [
        { t: 'esta es una orientación general: cada caso lo evalúa un profesional de salud.', q: 2 },
        { t: 'esto funciona siempre y para todas las personas.', q: 0 },
        { t: 'no hay que preguntar nada a nadie.', q: 0 },
      ] },
  ],
};

// ---- Slide 9 · estaciones ----
export const STATIONS = [
  { n: 1, name: 'Transmisión y mitos', c: 'amber', task: 'Clasifica afirmaciones como hecho o mito y explica por qué.', out: 'Seis afirmaciones clasificadas con su razón.' },
  { n: 2, name: 'Comparar ITS y síntomas', c: 'teal', task: 'Ubica características en ITS bacterianas, virales o ambas.', out: 'Tabla comparativa con aciertos justificados.' },
  { n: 3, name: 'Prevención y ayuda', c: 'lilac', task: 'Decide qué hacer y qué evitar frente a un caso ficticio.', out: 'Plan de acción con tres decisiones justificadas.' },
  { n: 4, name: 'Leer fuente o gráfico', c: 'sky', task: 'Lee un gráfico y elige la conclusión que los datos permiten.', out: 'Una conclusión acotada y su justificación.' },
];
export const GROUPS = ['A', 'B', 'C', 'D'];

// ---- Slide 10 · estación 1 (hecho / mito) ----
export const E1 = [
  { s: 'Saludar con un abrazo o compartir un vaso transmite una ITS.', fact: false, why: 'Las ITS se transmiten por vías específicas (sexual, sangre, de madre a hijo/a), no por el contacto cotidiano.' },
  { s: 'Compartir agujas u objetos cortopunzantes contaminados puede transmitir algunas infecciones.', fact: true, why: 'El contacto con sangre contaminada es una vía de transmisión reconocida.' },
  { s: 'Una persona que se ve sana no puede tener una ITS.', fact: false, why: 'Algunas ITS no producen síntomas visibles; la apariencia no sirve para saberlo.' },
  { s: 'Algunas ITS pueden pasar de madre a hijo/a durante el embarazo o el parto.', fact: true, why: 'Es una vía reconocida; por eso importa el control de salud oportuno.' },
  { s: 'La píldora anticonceptiva protege contra las ITS.', fact: false, why: 'Previene el embarazo, pero no actúa como barrera frente a las ITS.' },
  { s: 'El riesgo depende de la exposición a una vía de transmisión, no de «qué tipo de persona» es alguien.', fact: true, why: 'Etiquetar a las personas es un prejuicio; lo que importa es la exposición y las medidas de cuidado.' },
];

// ---- Slide 10 · estación 2 (bacterias / virus / ambas) ----
export const E2 = [
  { s: 'Pueden tratarse con antibióticos indicados por un profesional.', a: 'bac', why: 'Los antibióticos actúan sobre bacterias, siempre con indicación profesional.' },
  { s: 'Para algunas existe vacuna disponible.', a: 'vir', why: 'Hay vacunas para algunas infecciones virales, como las del plan nacional de inmunización.' },
  { s: 'Pueden no producir síntomas durante un tiempo.', a: 'amb', why: 'Tanto algunas bacterianas como virales pueden pasar sin síntomas.' },
  { s: 'Algunas no se curan, pero se controlan con seguimiento y tratamiento.', a: 'vir', why: 'Varias infecciones virales se manejan de forma crónica con control médico.' },
  { s: 'El diagnóstico requiere evaluación y exámenes indicados por un profesional.', a: 'amb', why: 'Ni los síntomas ni la apariencia bastan para diagnosticar.' },
];

// ---- Slide 11 · estación 3 (hacer / evitar) ----
export const E3 = {
  case: 'Mateo (ficticio) siente ardor al orinar desde hace dos días y no se atreve a preguntar. ¿Qué es lo más adecuado?',
  items: [
    { s: 'Hablar con un adulto de confianza y consultar en un centro de salud.', do: true, why: 'Una evaluación profesional es la vía segura para saber qué ocurre.' },
    { s: 'Tomar los remedios que recomendó un video de redes.', do: false, why: 'Automedicarse puede ocultar el problema o empeorarlo.' },
    { s: 'Buscar información en fuentes oficiales mientras tanto.', do: true, why: 'Complementa la consulta; no la reemplaza.' },
    { s: 'Esperar a ver si se pasa solo.', do: false, why: 'Retrasa la atención y, si hay una infección, puede tener consecuencias.' },
    { s: 'Contar el caso a todo el curso para pedir consejos.', do: false, why: 'Se debe cuidar la privacidad: los consejos se piden a quien corresponde.' },
    { s: 'Seguir las medidas de prevención y pedir orientación sobre exámenes.', do: true, why: 'La prevención y el control oportuno forman parte del autocuidado.' },
  ],
};

// ---- Slide 11 · estación 4 (gráfico de líneas ilustrativo) ----
export const E4 = {
  title: 'Consultas por molestias genitales en un centro de salud ficticio',
  unit: 'Consultas por año (datos ilustrativos)',
  src: 'Fuente: dataset ficticio de práctica',
  pts: [[2019, 120], [2020, 80], [2021, 110], [2022, 160], [2023, 210], [2024, 260]],
  options: [
    { t: 'Aumentaron las consultas en el centro; no basta este gráfico para afirmar que aumentaron las infecciones.', ok: true, why: 'Describe la tendencia sin inferir una causa: puede haber más acceso, más difusión o más controles.' },
    { t: 'Las ITS aumentaron porque la gente es irresponsable.', ok: false, why: 'Atribuye una causa y juzga a las personas sin evidencia.' },
    { t: 'Las consultas siempre suben cada año.', ok: false, why: 'El gráfico muestra una baja en 2020; «siempre» no se sostiene.' },
  ],
};

// ---- Slide 12 · mini ensayo (8 preguntas nuevas) ----
// topic: T transmisión · P prevención · S síntomas/consecuencias · F fuentes/evidencia
export const CONTENTS = ['Vías de transmisión', 'Mitos sobre riesgo', 'Barreras de protección', 'Búsqueda de ayuda', 'Síntomas', 'Consecuencias', 'Fuentes confiables', 'Leer un gráfico'];
export const ESSAY = [
  { topic: 'T', ci: 0, q: '¿Cuál de las siguientes situaciones NO es una vía de transmisión de las ITS?',
    alts: [['Compartir agujas u objetos cortopunzantes contaminados.', false], ['Relaciones sexuales sin protección con una persona que tiene una ITS.', false], ['Compartir un vaso o saludar con un abrazo.', true], ['De madre a hijo/a durante el embarazo o el parto, en algunas ITS.', false]],
    j: [['Las ITS se transmiten por vías específicas; el contacto cotidiano no es una de ellas.', true], ['Todo contacto físico entre personas transmite ITS.', false], ['Las ITS solo se transmiten por la sangre.', false]],
    exp: 'La evidencia: las vías reconocidas son sexual sin protección, sangre contaminada y de madre a hijo/a; el contacto cotidiano no transmite.' },
  { topic: 'T', ci: 1, q: 'Alguien dice: «Solo se contagian quienes son “de cierto tipo de persona”». ¿Qué respuesta es más adecuada?',
    alts: [['Es correcto: el tipo de persona determina el contagio.', false], ['Es un mito: el riesgo depende de la exposición a una vía de transmisión, no de etiquetas.', true], ['Es correcto: nadie más puede contagiarse.', false], ['Es un mito: nadie puede contagiarse si es cuidadoso.', false]],
    j: [['El riesgo se explica por la exposición y las medidas de cuidado, no por prejuicios.', true], ['Las etiquetas sobre las personas sirven para predecir la salud.', false], ['Si una persona se ve sana, no tiene riesgo.', false]],
    exp: 'La evidencia: el riesgo depende de la exposición y de las medidas de prevención; etiquetar personas es un prejuicio sin respaldo.' },
  { topic: 'P', ci: 2, q: '¿Qué medida reduce el riesgo de transmisión sexual de varias ITS?',
    alts: [['Lavarse con agua después de una relación sexual.', false], ['Usar correctamente el preservativo.', true], ['Tomar píldora anticonceptiva.', false], ['Elegir una pareja que “se vea sana”.', false]],
    j: [['El preservativo actúa como barrera física y reduce el contacto con fluidos, aunque no elimina todo el riesgo.', true], ['Cualquier método anticonceptivo previene las ITS.', false], ['La apariencia de una persona permite saber si está sana.', false]],
    exp: 'El concepto: barrera física con uso correcto. La píldora previene embarazo, no ITS, y la apariencia no informa sobre infecciones.' },
  { topic: 'P', ci: 3, q: 'Una estudiante ficticia nota una molestia y siente vergüenza de preguntar. ¿Cuál es la mejor orientación general?',
    alts: [['Esperar a que desaparezca.', false], ['Seguir el tratamiento de un video de redes.', false], ['Hablar con un adulto de confianza y consultar en un centro de salud.', true], ['Pedir medicamentos a una amiga.', false]],
    j: [['Solo un profesional puede evaluar y orientar según cada caso.', true], ['Los videos de redes siempre dan buenos consejos.', false], ['Las molestias siempre se quitan solas.', false]],
    exp: 'El concepto: la evaluación profesional es segura; automedicarse o esperar puede ocultar o agravar un problema.' },
  { topic: 'S', ci: 4, q: '¿Cuál afirmación sobre los síntomas de las ITS es más acertada?',
    alts: [['Todas las ITS dan síntomas visibles inmediatamente.', false], ['Algunas ITS pueden no dar síntomas, por eso el diagnóstico requiere evaluación profesional.', true], ['Si no hay síntomas, nunca existe riesgo de transmitir.', false], ['Los síntomas siempre indican cuál ITS es.', false]],
    j: [['Hay infecciones que pueden estar presentes sin producir señales.', true], ['Los síntomas aparecen siempre al día siguiente.', false], ['El aspecto de una persona basta para diagnosticar.', false]],
    exp: 'La evidencia: algunas ITS son asintomáticas; por eso importan la consulta y los exámenes.' },
  { topic: 'S', ci: 5, q: 'Una ITS que no se detecta ni se trata puede…',
    alts: [['Desaparecer siempre sola.', false], ['No tener ninguna consecuencia porque es “leve”.', false], ['Provocar complicaciones de salud y seguir transmitiéndose a otras personas.', true], ['Afectar solo a quien la tiene, sin posibilidad de contagio.', false]],
    j: [['Sin tratamiento oportuno, algunas infecciones se complican y siguen circulando.', true], ['Las infecciones leves nunca se transmiten.', false], ['El tiempo siempre las elimina.', false]],
    exp: 'El concepto: detección y tratamiento oportunos evitan complicaciones y cortan la cadena de transmisión.' },
  { topic: 'F', ci: 6, q: '¿Cuál de estas fuentes es más confiable para informarse sobre ITS?',
    alts: [['Una cadena reenviada por mensajería.', false], ['Un comentario con muchos “me gusta”.', false], ['Un video sin referencias.', false], ['La página de un organismo oficial de salud.', true]],
    j: [['Una fuente confiable es verificable y está respaldada por instituciones o personas expertas.', true], ['Es confiable la que más se comparte.', false], ['Es confiable la que suena más segura.', false]],
    exp: 'El criterio: una fuente es confiable si se puede identificar y verificar; la popularidad no es evidencia.' },
  { topic: 'F', ci: 7, q: 'Un gráfico ilustrativo muestra que el 72 % de los mensajes del sitio A cita una fuente, frente al 12 % del sitio B. ¿Qué conclusión es adecuada?',
    alts: [['El sitio A siempre dice la verdad.', false], ['En esta muestra, el sitio A cita fuentes con más frecuencia que el sitio B.', true], ['El sitio B solo dice mentiras.', false], ['Los gráficos no sirven para sacar conclusiones.', false]],
    j: [['La conclusión se apoya en los valores del gráfico y se limita a la muestra.', true], ['Un porcentaje alto garantiza que todo es verdadero.', false], ['Un porcentaje bajo prueba que se miente.', false]],
    exp: 'El procedimiento: comparar valores y concluir solo lo que los datos permiten («en esta muestra…»).' },
];

// ---- Slide 14 · tarjeta de estudio y ticket ----
export const STRATEGIES = [
  'Releer mi mapa y cubrirlo para recuperar de memoria',
  'Explicar el contenido en voz alta a otra persona',
  'Inventar preguntas con cuatro alternativas y justificarlas',
  'Leer un gráfico y escribir una conclusión acotada',
  'Repasar el vocabulario con tarjetas',
];
export const DIFF_TERMS = ['transmisión', 'prevención', 'síntoma', 'consecuencia', 'fuente', 'dato', 'evidencia', 'mito', 'hecho', 'opinión', 'recomendación', 'rumor'];
// pares que contrastan conceptualmente (cualquier orden)
export const DIFF_OK = [
  ['mito', 'hecho'], ['dato', 'opinión'], ['evidencia', 'rumor'], ['síntoma', 'consecuencia'], ['transmisión', 'prevención'],
  ['fuente', 'rumor'], ['recomendación', 'opinión'], ['evidencia', 'opinión'], ['mito', 'evidencia'], ['dato', 'recomendación'],
];
export const DIFF_HINT = {
  'dato|opinión': 'Un dato se puede comprobar; una opinión expresa una postura.',
  'evidencia|rumor': 'La evidencia es verificable; el rumor circula sin respaldo.',
  'hecho|mito': 'Un hecho tiene respaldo; un mito es una creencia sin sustento científico.',
  'síntoma|consecuencia': 'El síntoma es una señal presente; la consecuencia es un efecto posterior.',
  'prevención|transmisión': 'La transmisión es cómo pasa; la prevención es cómo se reduce el riesgo.',
};
