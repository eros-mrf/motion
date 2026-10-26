// Contenido pedagógico de la Clase 20 (Plan de Unidad 4 · Ciencias Naturales 7°).
// TODOS los datos numéricos son ILUSTRATIVOS (ficticios) y están pensados para enseñar a leer gráficos.
// En clase, el docente proyecta tablas y gráficos oficiales vigentes (MINSAL, INE, etc.) y evita datos que
// permitan identificar estudiantes o comunidades pequeñas.

export const PHASES = {
  intro:        { name: 'Inicio · ruta',       min: 10, color: 'var(--mari)' },
  activacion:   { name: 'Activación',          min: 10, color: 'var(--mari)' },
  preguntas:    { name: 'Preguntas iniciales', min: 10, color: 'var(--cobalt)' },
  modelamiento: { name: 'Modelamiento',        min: 15, color: 'var(--jade)' },
  actividad:    { name: 'Actividad central',   min: 35, color: 'var(--verm)' },
  comun:        { name: 'Puesta en común',     min: 10, color: 'var(--cobalt)' },
  ticket:       { name: 'Ticket y aviso',      min: 10, color: 'var(--mari)' },
};

export const NOTES = [
  '<b>Portada.</b> Anuncia el desafío: hoy un gráfico correcto puede llevar a una conclusión incorrecta. Aclara desde el inicio que <u>los datos poblacionales no sirven para diagnosticar a una persona</u>. Todos los datos de esta presentación son ilustrativos; tú proyectas los datos oficiales seleccionados.',
  '<b>Ruta (10 min con la activación).</b> Lee la meta y las 5 etapas. Recuerda el cuidado: usar datos públicos seleccionados por el docente y evitar información que permita identificar estudiantes o comunidades pequeñas. La barra inferior muestra los 90 minutos (tecla <kbd>T</kbd> inicia el reloj).',
  '<b>Titular rápido.</b> Muestra primero SOLO las barras y pide que cada estudiante elija qué creen que representa. Luego revela título, población y fuente. Lo importante: las mismas barras sirven para historias opuestas; el contexto es indispensable. Prueba el carrusel «misma forma, otro contexto».',
  '<b>Preguntas iniciales (10 min).</b> Cada tarjeta abre una pista. Idea fuerza: un gráfico puede ser correcto y la conclusión incorrecta. Anota las palabras que usan para describir; las usaremos en la rutina F-V-D-I.',
  '<b>Vocabulario.</b> Los 10 términos se emparejan con su definición: toca un término y luego su definición. Deja visible el glosario (DUA: representación). Pide un ejemplo con el gráfico de la clase.',
  '<b>Modelamiento 1/4 (15 min en total): rutina F-V-D-I.</b> Fuente, Variables, Descripción, Inferencia. Avanza paso a paso en el gráfico 3D. En <b>D</b> se describe solo lo visible («aumenta», «disminuye», «es mayor que»). En <b>I</b> aparecen explicaciones posibles que requerirían otra evidencia. Datos ilustrativos.',
  '<b>Modelamiento 2/4: describir antes de explicar.</b> Cada afirmación se clasifica como «lo veo en el gráfico» o «necesita más evidencia». Las palabras como <i>porque</i>, <i>debido a</i> o <i>gracias a</i> suelen anunciar una inferencia causal.',
  '<b>Modelamiento 3/4: titular sensacionalista vs. responsable.</b> Arma titulares con las piezas y observa el exagerómetro. Aprovecha para discutir: un aumento relativo (15 %) puede esconder una diferencia absoluta pequeña (18 casos) y viceversa. Los números son ilustrativos.',
  '<b>Modelamiento 4/4: comparar con justicia.</b> Más casos no es lo mismo que mayor frecuencia: depende del tamaño de la población. Alterna «casos totales» y «por cada 1.000 personas» en el modelo 3D. Distritos ficticios.',
  '<b>Actividad central 1/3 (35 min en total): laboratorio de lectura.</b> En parejas, con dos gráficos o tablas oficiales adaptados al nivel. Completan fuente, población, variables, dato máximo, dato mínimo, tendencia y comparación. Aquí hay dos gráficos de ejemplo; reemplázalos por los datos oficiales seleccionados.',
  '<b>Actividad central 2/3: tres conclusiones.</b> Clasifican cada conclusión en <i>respaldada / posible pero no demostrada / contradice los datos</i>. Se puede arrastrar la tarjeta a una zona o seleccionar la tarjeta y tocar la zona. Insiste: describir una tendencia no es explicar su causa.',
  '<b>Actividad central 3/3: titular de ≤ 15 palabras.</b> Redactan un titular que comunique el dato sin alarmismo. El semáforo es orientativo. Luego intercambian fichas y revisan si el titular coincide con la evidencia (lista de revisión).',
  '<b>Puesta en común (10 min).</b> Se comparan titulares: tocar las palabras que agregan opinión o causalidad no demostrada. Conecta con la clase 21: transformar evidencia en recomendaciones generales de autocuidado.',
  '<b>Ticket de salida (10 min).</b> «Antes de explicar por qué ocurre una tendencia, necesito ____. Un gráfico sí me permite describir ____.» Evaluación formativa: identifica fuente, población y variables; describe sin inventar causas; distingue descripción e inferencia; comunica con precisión. <b>Aviso:</b> clase 21, recomendaciones de autocuidado.',
];

// ---- Series de datos ILUSTRATIVOS ----
export const SERIES = {
  talleres: { labels: ['2018', '2019', '2020', '2021', '2022', '2023'], values: [18, 22, 27, 33, 41, 48] },
  consultas: { labels: ['2018', '2019', '2020', '2021', '2022', '2023'], values: [42, 47, 31, 38, 51, 58] },
  orienta: { labels: ['7°', '8°', '1° medio', '2° medio'], values: [38, 46, 55, 61] },
};

// ---- Slide 3 · gráfico sin título: «Titular rápido» ----
export const GUESS = [
  { id: 'inf', t: 'Cada año hay más infecciones.', alarm: true },
  { id: 'vac', t: 'Cada año hay más personas vacunadas.' },
  { id: 'tal', t: 'Cada año asisten más estudiantes a talleres de prevención.' },
  { id: 'no', t: 'Sin título, población ni fuente no puedo saberlo.', best: true },
];
export const REVEAL = {
  title: 'Asistencia a talleres de prevención en 12 liceos',
  unit: '% de estudiantes',
  pop: 'Estudiantes de 12 liceos participantes',
  src: 'Ministerio de Salud · ejemplo ilustrativo',
};
export const CONTEXTS = [
  { k: 'tal', title: 'Asistencia a talleres de prevención', unit: '% de estudiantes', read: 'Sube → más estudiantes participan. Probablemente sea una buena noticia.', mood: 'good' },
  { k: 'esp', title: 'Tiempo de espera para una hora de control', unit: 'días de espera', read: 'Sube → hay que esperar más. Es una mala noticia para quien necesita atención.', mood: 'bad' },
  { k: 'cas', title: 'Casos notificados en una comuna de 80.000 personas', unit: 'casos notificados', read: 'Sube → podría ser más casos o más búsqueda y testeo. ¡Falta información para interpretar!', mood: 'ask' },
];

// ---- Slide 4 · preguntas ----
export const QUESTIONS = [
  { q: '¿Qué información debemos leer antes de mirar las barras o líneas?',
    idea: 'Título, fuente, población y unidad (qué se mide y en quiénes). Sin ese contexto, la misma forma puede significar cosas opuestas.', c: 'mari' },
  { q: '¿Describir una tendencia es lo mismo que explicar su causa?',
    idea: 'No. Describir es decir lo que se ve («aumenta», «es mayor que»). Explicar la causa requiere otra evidencia que el gráfico por sí solo no entrega.', c: 'verm' },
  { q: '¿Qué significa población representada?',
    idea: 'Las personas o situaciones que el dato realmente incluye: por ejemplo, estudiantes de 12 liceos, no «todos los jóvenes del país».', c: 'cobalt' },
  { q: '¿Por qué un gráfico puede ser correcto y una conclusión sobre él ser incorrecta?',
    idea: 'Porque el dibujo puede mostrar bien los datos y aun así la conclusión agregar causas, generalizar a otra población o exagerar la magnitud.', c: 'jade' },
  { q: '¿Qué palabras ayudan a evitar exageraciones?',
    idea: 'Palabras precisas: «aumentó de 42 a 58», «en esta muestra», «podría», «falta evidencia». Se evitan «se dispara», «siempre», «por culpa de».', c: 'mari' },
];

// ---- Slide 5 · vocabulario (emparejar) ----
export const VOCAB = [
  { t: 'dato', d: 'Valor medido u observado de algo.' },
  { t: 'variable', d: 'Característica que se mide y puede cambiar.' },
  { t: 'población', d: 'Conjunto de personas que el dato representa.' },
  { t: 'frecuencia', d: 'Cuántas veces ocurre algo.' },
  { t: 'porcentaje', d: 'Cantidad expresada por cada 100.' },
  { t: 'tendencia', d: 'Dirección general del cambio en el tiempo.' },
  { t: 'comparación', d: 'Contrastar dos o más datos entre sí.' },
  { t: 'inferencia', d: 'Posible explicación que requiere más evidencia.' },
  { t: 'conclusión', d: 'Afirmación final que debe estar respaldada.' },
  { t: 'salud pública', d: 'Cuidado de la salud de toda una comunidad.' },
];

// ---- Slide 6 · F-V-D-I en 3D ----
export const FVDI = [
  { k: 'F', name: 'Fuente', c: 'mari', ask: '¿Quién publica el dato, qué mide y en quiénes?', say: 'Servicio de Salud (datos ilustrativos). Población: personas de 15 a 29 años de una región ficticia.' },
  { k: 'V', name: 'Variables', c: 'cobalt', ask: '¿Qué hay en cada eje y con qué unidad?', say: 'Eje horizontal: año. Eje vertical: consultas preventivas por cada 1.000 personas.' },
  { k: 'D', name: 'Descripción', c: 'jade', ask: '¿Qué muestra, solo lo visible?', say: 'El valor máximo es 58 (2023) y el mínimo, 31 (2020). En general aumenta, con una baja en 2020.' },
  { k: 'I', name: 'Inferencia', c: 'verm', ask: '¿Qué explicaciones posibles necesitarían otra evidencia?', say: '¿Por qué bajó en 2020? ¿Por qué sube después? El gráfico no responde: hay que buscar más evidencia.' },
];

// ---- Slide 7 · describir vs inferir ----
export const STATEMENTS = [
  { t: 'El valor de 2023 (58) es el más alto del período.', a: 'describe', why: 'Se lee directamente en la barra más alta.' },
  { t: 'Entre 2019 y 2020 el valor bajó de 47 a 31.', a: 'describe', why: 'Es una comparación entre dos barras visibles.' },
  { t: 'En 2020 bajó por la pandemia.', a: 'infiere', why: 'El gráfico muestra la baja, no su causa. Se necesita otra evidencia.' },
  { t: 'Los programas de prevención hicieron aumentar las consultas.', a: 'infiere', why: 'Es una relación causal: el gráfico no mide los programas.' },
  { t: '2022 es mayor que 2021.', a: 'describe', why: '51 es mayor que 38: está a la vista.' },
  { t: 'Ahora las personas se cuidan más.', a: 'infiere', why: 'Habla de conductas que el gráfico no mide: es una interpretación.' },
];
export const DESC_WORDS = ['aumenta', 'disminuye', 'es mayor que', 'es menor que', 'se mantiene'];
export const INF_WORDS = ['porque', 'debido a', 'gracias a', 'por culpa de', 'seguramente'];

// ---- Slide 8 · constructor de titulares ----
// a = alarma (0-2) · c = causa/culpa no demostrada (0/1) · p = precisión (0/1)
export const HEAD = {
  base: 'Casos notificados de una infección en un distrito ficticio: 120 en 2022 y 138 en 2023.',
  slots: [
    { k: 'subj', name: 'Quién', opts: [
      { t: 'Las ITS', a: 1, c: 0, p: 0, why: 'Demasiado general: el dato es de un distrito, no de «las ITS» en todo el país.' },
      { t: 'Los casos notificados en el distrito', a: 0, c: 0, p: 1, why: 'Dice exactamente qué se contó y dónde.' },
    ] },
    { k: 'verb', name: 'Qué pasó', opts: [
      { t: 'se disparan', a: 2, c: 0, p: 0, why: 'Palabra alarmista: no dice cuánto.' },
      { t: 'aumentaron 15 %', a: 0, c: 0, p: 1, why: 'Preciso, pero cuidado: 15 % son solo 18 casos más. Conviene mostrar también el número.' },
      { t: 'aumentaron de 120 a 138', a: 0, c: 0, p: 1, why: 'Preciso y verificable en la tabla.' },
    ] },
    { k: 'when', name: 'Cuándo', opts: [
      { t: 'este año', a: 0, c: 0, p: 0, why: 'Vago: ¿comparado con qué?' },
      { t: 'entre 2022 y 2023', a: 0, c: 0, p: 1, why: 'Indica el período comparado.' },
    ] },
    { k: 'end', name: 'Cierre', opts: [
      { t: '', label: '(sin cierre)', a: 0, c: 0, p: 0, why: 'Está bien terminar con el dato.' },
      { t: 'por culpa de los jóvenes', a: 1, c: 1, p: 0, why: 'Culpa y causa sin evidencia, además estigmatiza.' },
      { t: '¡alarma en todo el país!', a: 2, c: 0, p: 0, why: 'Alarmismo y generalización a otra población.' },
      { t: 'y falta información para explicar la causa', a: 0, c: 0, p: 1, why: 'Reconoce el límite de lo que muestran los datos.' },
    ] },
  ],
};

// ---- Slide 9 · comparación justa (distritos ficticios) ----
export const DISTRICTS = [
  { id: 'N', name: 'Distrito Norte', cases: 90, pop: 30000, per1000: 3, color: 'cobalt' },
  { id: 'S', name: 'Distrito Sur', cases: 40, pop: 5000, per1000: 8, color: 'verm' },
];
export const FAIR = [
  { id: 'N', t: 'El Norte tiene más casos.', ok: true, why: '90 es mayor que 40: es una descripción correcta de los casos totales.' },
  { id: 'S', t: 'El Sur tiene mayor frecuencia.', ok: true, why: 'Por cada 1.000 personas hay 8 en el Sur y 3 en el Norte: la frecuencia relativa es mayor.' },
  { id: 'X', t: 'El Norte está más afectado.', ok: false, why: 'No se sostiene: «más afectado» depende de la pregunta. Con casos totales, sí; con frecuencia, no.' },
];

// ---- Slide 10 · laboratorio de lectura ----
export const LAB = [
  {
    id: 'A', tab: 'Gráfico A', series: 'consultas', kind: 'bars',
    title: 'Consultas preventivas de salud sexual por cada 1.000 jóvenes',
    unit: 'consultas por 1.000 personas',
    fields: {
      fuente: { opts: ['Servicio de Salud (datos ilustrativos)', 'Una publicación en redes sociales', 'Un blog anónimo'], ok: 0 },
      poblacion: { opts: ['Personas de 15 a 29 años de una región ficticia', 'Todas las personas del país', 'Solo estudiantes de un liceo'], ok: 0 },
      variables: { opts: ['Año y consultas por cada 1.000 personas', 'Edad y número de colegios', 'Región y tipo de infección'], ok: 0 },
      tendencia: { opts: ['Aumenta siempre, sin ninguna baja', 'En general aumenta, con una baja en 2020', 'Disminuye en todo el período'], ok: 1 },
      comparacion: { opts: ['2018 es mayor que 2023', '2023 supera a 2018 en 16 consultas', '2020 y 2019 tienen el mismo valor'], ok: 1 },
    },
    max: 5, min: 2,
  },
  {
    id: 'B', tab: 'Gráfico B', series: 'orienta', kind: 'hbars',
    title: 'Estudiantes que saben dónde pedir orientación en salud',
    unit: '% de estudiantes',
    fields: {
      fuente: { opts: ['Encuesta escolar (datos ilustrativos)', 'Un rumor del patio', 'Un video viral'], ok: 0 },
      poblacion: { opts: ['Estudiantes de 12 liceos participantes (7° a 2° medio)', 'Todos los adolescentes del país', 'Los profesores de ciencias'], ok: 0 },
      variables: { opts: ['Nivel escolar y porcentaje de estudiantes', 'Nombre del estudiante y notas', 'Año y número de talleres'], ok: 0 },
      tendencia: { opts: ['Disminuye al subir de nivel', 'Aumenta al subir de nivel', 'Se mantiene igual en todos los niveles'], ok: 1 },
      comparacion: { opts: ['2° medio supera a 7° en 23 puntos porcentuales', '7° supera a 2° medio', '8° y 1° medio son iguales'], ok: 0 },
    },
    max: 3, min: 0,
  },
];
export const FIELD_NAMES = { fuente: 'Fuente', poblacion: 'Población', variables: 'Variables', max: 'Dato máximo', min: 'Dato mínimo', tendencia: 'Tendencia', comparacion: 'Comparación' };

// ---- Slide 11 · tres conclusiones ----
export const BINS = [
  { k: 'ok', name: 'Respaldada', sub: 'Los datos lo muestran', c: 'jade' },
  { k: 'maybe', name: 'Posible, no demostrada', sub: 'Necesita otra evidencia', c: 'mari' },
  { k: 'no', name: 'Contradice los datos', sub: 'El gráfico dice otra cosa', c: 'verm' },
];
export const CONCL = [
  { ds: 'A', t: 'En 2023 hubo más consultas por cada 1.000 personas que en 2018.', k: 'ok', why: '58 es mayor que 42: está en el gráfico.' },
  { ds: 'A', t: 'Las consultas bajaron en 2020 por la pandemia.', k: 'maybe', why: 'La baja se ve; la causa no. Es una explicación posible que requiere otra evidencia.' },
  { ds: 'A', t: 'Las consultas aumentan todos los años.', k: 'no', why: 'Bajaron entre 2019 y 2020 y entre 2019 y 2021: contradice los datos.' },
  { ds: 'B', t: 'A mayor nivel escolar, mayor porcentaje sabe dónde pedir orientación.', k: 'ok', why: '38 %, 46 %, 55 % y 61 %: aumenta con el nivel.' },
  { ds: 'B', t: 'En 2° medio saben más porque tienen más clases de ciencias.', k: 'maybe', why: 'El gráfico no mide clases de ciencias: es una causa posible, no demostrada.' },
  { ds: 'B', t: 'En 7° nadie sabe dónde pedir orientación.', k: 'no', why: 'Contradice los datos: el 38 % de 7° sí sabe.' },
];

// ---- Slide 12 · titular ≤ 15 palabras ----
export const HEADLINE = [
  { id: 'A', tab: 'Gráfico A',
    model: 'Consultas preventivas aumentaron de 42 a 58 por cada 1.000 jóvenes entre 2018 y 2023',
    need: [/\d/, /(aument|subi|crec|mayor|sup)/i],
    needLabel: 'incluye cifras y dice la dirección del cambio',
    data: 'Consultas por 1.000 personas de 15 a 29 años: 42 (2018) → 58 (2023), con baja a 31 en 2020.' },
  { id: 'B', tab: 'Gráfico B',
    model: 'En 12 liceos, el 61 % de 2° medio sabe dónde pedir orientación, frente al 38 % de 7°',
    need: [/\d/, /(sab|conoc|orient|frente|mayor|sup)/i],
    needLabel: 'incluye cifras y menciona la comparación',
    data: '% de estudiantes que sabe dónde pedir orientación: 7° 38 %, 8° 46 %, 1° medio 55 %, 2° medio 61 %.' },
];
// Palabras que suman alarma, opinión o causalidad no demostrada (heurística orientativa)
export const FLAGS = [
  { re: /\b(se dispara\w*|dispar\w+|explot\w+|explosi\w+|desplom\w+|alarm\w+|crisis|epidemia|catástrof\w+|preocupante\w*|grav\w+)\b|¡/i, kind: 'alarma', tip: 'palabra alarmista o de opinión' },
  { re: /\b(por culpa|culpa|gracias a|debido a|porque|a causa de|seguramente|obviamente|claramente|sin duda)\b/i, kind: 'causa', tip: 'sugiere una causa que el gráfico no demuestra' },
  { re: /\b(siempre|nunca|todos|nadie|toda la gente)\b/i, kind: 'absoluto', tip: 'absoluto: ¿lo respalda el dato?' },
];

// ---- Slide 13 · caza de palabras ----
export const HEADLINES = [
  { id: 1, text: '¡Alarma! Las consultas se disparan por culpa de los jóvenes', flag: ['¡Alarma!', 'disparan', 'culpa'], fix: 'Las consultas preventivas aumentaron de 42 a 58 entre 2018 y 2023.' },
  { id: 2, text: 'Las consultas preventivas aumentaron de 42 a 58 entre 2018 y 2023', flag: [], fix: 'Este titular ya es responsable: describe el dato, con cifras y período.' },
  { id: 3, text: 'Gracias a los talleres la gente se cuida mucho más', flag: ['Gracias', 'cuida', 'mucho'], fix: 'El 48 % de los estudiantes de 12 liceos asistió a talleres de prevención en 2023.' },
  { id: 4, text: 'Preocupante: en 2020 bajaron las consultas, seguramente por la pandemia', flag: ['Preocupante:', 'seguramente'], fix: 'En 2020 las consultas bajaron a 31 por cada 1.000 jóvenes; falta evidencia para explicar por qué.' },
];

// ---- Slide 14 · ticket ----
export const TICKET_A = ['conocer la fuente y la población', 'más evidencia que respalde la causa', 'leer el título y las unidades', 'comparar con otros datos y otra fuente'];
export const TICKET_B = ['qué dato es mayor o menor', 'cómo cambia el valor en el tiempo', 'la comparación entre dos datos visibles', 'la causa segura de la tendencia'];
export const TICKET_OK_A = [0, 1, 3];
export const TICKET_OK_B = [0, 1, 2];
export const SELF = [
  'Identifico fuente, población y variables.',
  'Describo datos sin inventar causas.',
  'Distingo descripción de inferencia.',
  'Comunico un resultado con precisión.',
];
