# Unidad 4 · Ciencias Naturales 7° — presentaciones interactivas

| Clase | Archivo | Estilo |
|---|---|---|
| 18 · Rumor, prejuicio o evidencia | [`index.html`](./index.html) | Laboratorio nocturno: ember / violeta / cian, Bricolage Grotesque |
| 19 · Computación: investigación documental de una ITS | [`clase-19.html`](./clase-19.html) | Retícula de datos: lima / rosa / azul / oro, Syne + IBM Plex Mono |
| 20 · Datos de salud pública: leer sin exagerar | [`clase-20.html`](./clase-20.html) | Periodismo de datos sobre papel: bermellón / cobalto / caléndula / jade, Fraunces + DM Sans |
| 21 · De la evidencia a una recomendación de autocuidado | [`clase-21.html`](./clase-21.html) | Amanecer y cristal: aurora pastel (shader), esferas de vidrio, Instrument Serif + Plus Jakarta Sans |

Cada archivo es autocontenido (JS, CSS y fuentes incrustados): se abre con doble clic, sin internet.

---

# Clase 18 · Rumor, prejuicio o evidencia: comunicar sin estigma

Presentación interactiva (14 diapositivas) para la **Clase 18 de la Unidad 4** de Ciencias Naturales 7° básico
(OA 3 y OA 1 · OAH e, j, k, m), construida a partir del *Plan de Unidad 4* y con motion graphics + Three.js.

**Entregable:** [`index.html`](./index.html) — un solo archivo, sin internet ni instalación (JS, CSS y fuentes incrustados). Basta abrirlo en el navegador.

## Diapositivas (90 min)
| # | Momento | Contenido interactivo |
|---|---|---|
| 1 | Portada | Red 3D de fondo que responde al toque |
| 2 | Ruta + acuerdos de cuidado | Meta, 5 pasos, barra de los 90 min |
| 3 | Activación | 4 mensajes ficticios: evidencia / rumor / necesito verificar, con clave y criterio |
| 4 | Preguntas iniciales | Las 5 preguntas del plan con idea para la conversación |
| 5 | Vocabulario | 8 tarjetas que voltean |
| 6 | Modelamiento | **Three.js:** simulación 3D de cómo viaja un rumor (slider de % que verifica) |
| 7 | Modelamiento | Camino del estigma vs. camino de la evidencia |
| 8 | Modelamiento | Detector de 7 señales de alerta |
| 9 | Modelamiento | Secuencia A–E–R (Afirmación, Evidencia, Reformulación) |
| 10 | Actividad central | Laboratorio de verificación (3 mensajes, 4 campos, fuentes, medidor de confiabilidad) |
| 11 | Actividad central | Editor de ≤ 40 palabras con semáforo de exactitud / respeto / claridad |
| 12 | Actividad central | Intercambio: palabras que estigmatizan → palabras que cuidan |
| 13 | Puesta en común | **Three.js:** escudo 3D del protocolo Verificar · Contextualizar · Cuidar el lenguaje |
| 14 | Ticket + aviso | Ticket de salida, autoevaluación y aviso de la Clase 19 (computación) |

## Atajos
`→ ← espacio` navegar · `N` notas del docente · `G` índice · `T` reloj de clase (`Shift+T` reinicia) · `M` movimiento reducido · `F` pantalla completa · clic en el fondo: la red responde.
Se respeta `prefers-reduced-motion`.

## Notas de cuidado
Todos los mensajes son **ficticios**. Las evidencias son paráfrasis de recomendaciones sanitarias generales (MINSAL / OMS): el docente debe proyectar la fuente oficial vigente. El semáforo del editor es orientativo; la revisión humana prevalece.

## Desarrollo
```bash
npm install
npm run build      # genera index.html
npm run verify     # capturas de las 14 diapositivas + errores de consola (Playwright)
npm run interact   # prueba clics y escritura en cada actividad
```
Skills de motion usadas (instaladas en `.claude/skills`, de [iart-ai/motion-skills](https://github.com/iart-ai/motion-skills)):
threejs-animation, shader-glsl, particle-system, gsap-web, accessible-animation, 60fps-animation, svg-animation, micro-interaction, page-transition-animation, explainer-video, diagram-animation.

---

# Clase 19 · Computación: investigación documental de una ITS

OA 3 · OAH b, e, f, g, h, k, l. Meta: investigación documental colaborativa con fuentes oficiales y una **ficha científica digital con referencias**.
Los resultados de búsqueda, páginas y mensajes son **simulados**; las evidencias son paráfrasis generales (MINSAL / OMS) y el docente debe proyectar la fuente oficial vigente.

| # | Momento | Contenido interactivo |
|---|---|---|
| 1 | Portada | Terreno 3D de datos con sol rayado; el buscador escribe solo; clic = onda de datos |
| 2 | Ruta | Meta, cuidados, tubería de 5 etapas y barra de 90 min |
| 3 | Activación | Anatomía de una página (institución, fecha, propósito) + checklist «dos fuentes» que abre un candado |
| 4 | Preguntas | Consola de 5 consultas con pistas que se escriben solas |
| 5 | Vocabulario | 9 términos con buscador que filtra |
| 6 | Modelamiento | **Three.js:** biblioteca 3D de 8 fuentes: auditar y decidir usar / con cuidado / descartar |
| 7 | Modelamiento | Constructor de búsqueda: palabras clave, resultados y precisión (simulados) |
| 8 | Modelamiento | De un párrafo a 3 ideas propias + medidor copiar vs. parafrasear |
| 9 | Modelamiento | **Three.js:** virus y bacteria esquemáticos (no a escala), con puntos interactivos |
| 10 | Actividad central | 6 roles que se sortean (animación de cartas) |
| 11 | Actividad central | **Three.js:** ficha holográfica; cada campo completado se acopla a la tarjeta (9 campos, guarda en el navegador) |
| 12 | Actividad central | Radar de 8 criterios de calidad |
| 13 | Puesta en común | Duelo de paráfrasis (3 rondas) |
| 14 | Ticket + aviso | Frase del ticket, autoevaluación y aviso de la clase 20 |

Atajos idénticos a la Clase 18. Pruebas: `DECK=clase-19.html npm run verify` y `node tools/interact19.mjs`.

---

# Clase 20 · Datos de salud pública: leer sin exagerar

OA 3 · OAH h, j, k, l. Meta: interpretar tablas y gráficos de salud pública vinculados a ITS, distinguiendo datos observables de inferencias y de conclusiones que la evidencia no permite sostener.
**Todos los datos son ILUSTRATIVOS (ficticios)**; el docente proyecta tablas y gráficos oficiales vigentes y evita datos que identifiquen estudiantes o comunidades pequeñas. Los datos poblacionales no diagnostican a una persona.

Estilo propio: periodismo de datos sobre papel crema, bordes de tinta con sombra dura, **transición de iris de tinta**, títulos que se **estampan** con resaltador, barra de navegación en forma de gráfico y fondo 3D «skyline de datos».

| # | Momento | Contenido interactivo |
|---|---|---|
| 1 | Portada | Skyline 3D de barras que ondula; clic = ola; «exagerar» tachado |
| 2 | Ruta | Meta, cuidados, 5 etapas y barra de 90 min |
| 3 | Activación | «Titular rápido»: gráfico sin contexto, revelado y «misma forma, otro contexto» |
| 4 | Preguntas | Abanico de 5 tarjetas con notas adhesivas |
| 5 | Vocabulario | Emparejar 10 términos con su definición (líneas que se dibujan) |
| 6 | Modelamiento | **Three.js:** gráfico de barras 3D con la rutina F-V-D-I paso a paso |
| 7 | Modelamiento | Describir vs. inferir: 6 afirmaciones sobre el gráfico |
| 8 | Modelamiento | Constructor de titulares con exagerómetro y sello «responsable / sensacionalista» |
| 9 | Modelamiento | **Three.js:** casos totales vs. por cada 1.000 personas (columnas que se vuelven pictograma) |
| 10 | Actividad central | Laboratorio: ficha de lectura de 7 campos sobre dos gráficos |
| 11 | Actividad central | Clasificar 6 conclusiones arrastrando (o tocando) a 3 zonas |
| 12 | Actividad central | Titular ≤ 15 palabras con semáforo y portada en vivo |
| 13 | Puesta en común | **Three.js:** caza de palabras que suman opinión, flotando en 3D |
| 14 | Ticket + aviso | Ticket de salida, autoevaluación y aviso de la clase 21 |

Pruebas: `DECK=clase-20.html npm run verify` y `npm run interact:20`.

---

# Clase 21 · De la evidencia a una recomendación de autocuidado

OA 3 (integrando OA 1) · OAH e, j, l, m. Meta: construir recomendaciones generales de autocuidado justificadas con evidencia (estructura **E-R-L**: Evidencia → Recomendación → Límite), diferenciando información científica de consejo personal y usando lenguaje respetuoso.
Todos los mensajes y casos son **ficticios**; los datos «ilustrativos» no son estadísticas reales; el docente proyecta la fuente oficial vigente. Una recomendación general no reemplaza a un profesional.

Estilo propio: **amanecer y cristal** — aurora pastel con shader GLSL y esferas de vidrio flotantes, tarjetas de cristal esmerilado con foco que sigue el cursor, **cortina de cristal** como transición, palabras que «enfocan» al entrar y ruta de orbes como navegación.

| # | Momento | Contenido interactivo |
|---|---|---|
| 1 | Portada | Aurora 3D; chips E · R · L |
| 2 | Ruta | Meta, acuerdos de cuidado, 5 etapas y barra de 90 min |
| 3 | Activación | Dos mensajes ficticios (absoluto vs. prudente), análisis de palabras y medidor de certeza |
| 4 | Preguntas | Cinco burbujas de cristal que abren cada idea |
| 5 | Vocabulario | Mazo de repaso: voltear, «Lo sé» / «Repasar», pila de aprendidas |
| 6 | Modelamiento | **Three.js:** tres láminas de cristal E-R-L que se apilan y compactan |
| 7 | Modelamiento | Balanza: la fuerza del lenguaje no puede superar la de la evidencia |
| 8 | Modelamiento | Deslizar tarjetas: ¿informa o decide por otra persona? (arrastrar, botones o A/D) |
| 9 | Modelamiento | **Three.js:** núcleo del mensaje donde se acoplan evidencias (solidez) y ruido (grietas) |
| 10 | Actividad central | Taller: 3 casos ficticios, fuente oficial breve, ficha de datos y bandeja de evidencia |
| 11 | Actividad central | Redactor E-R-L (≤ 45 palabras) con 4 criterios y **tarjeta de autocuidado 3D** en vivo |
| 12 | Actividad central | Galería: comentar un mensaje con un solo criterio (notas adhesivas) |
| 13 | Puesta en común | Dos mensajes fuertes y uno por mejorar (reescritura por piezas) |
| 14 | Ticket + aviso | Ticket de salida, autoevaluación y aviso de la clase 22 (Prueba N°2) |

Pruebas: `DECK=clase-21.html npm run verify` y `npm run interact:21`.

---

# Clase 22 · Repaso estructurado OA 3: transmisión, prevención y evidencia

OA 3 · OAH e, h, j, k, m. Meta: recuperar, organizar y aplicar lo aprendido sobre ITS (transmisión, prevención, síntomas generales, consecuencias, fuentes y análisis de datos) antes de la Prueba de Conocimientos N°2 (clase 23).
Todo el material es **de práctica y ficticio**: no contiene preguntas de la prueba. Los datos «ilustrativos» no son estadísticas reales; el docente proyecta la fuente oficial vigente. Las ideas son paráfrasis de orientación general y no reemplazan a un profesional de salud.

Estilo propio: **tablero de andén** — vino oscuro con ámbar de señalética (alto contraste), mapa de curvas de nivel con shader, letras de título que «voltean» como un tablero, barrido de radar entre diapositivas, ruta inferior como línea de tren.

| # | Momento | Contenido interactivo |
|---|---|---|
| 1 | Portada | Título con letras volteando; tablero de los 4 andenes |
| 2 | Ruta | Meta, acuerdos y 8 tramos de 90 min |
| 3 | Recuperación | Mapa rápido de 4 min (4 ramas) + comparación con la lista; **Three.js:** mapa conceptual 3D que se ilumina |
| 4 | Preguntas | Tablero con las 5 preguntas del plan y su idea de apoyo |
| 5 | Vocabulario | Emparejar 9 términos y definiciones con líneas que se dibujan |
| 6 | Modelamiento 1 | Selección con distractores: 4 pasos, absolutos tachados y etiquetas |
| 7 | Modelamiento 2 | Gráfico de barras animado y 3 pasos para concluir sin exagerar |
| 8 | Modelamiento 3 | Desarrollo corto: afirmación + evidencia + límite, con rúbrica |
| 9 | Estaciones | **Three.js:** carrusel de 4 andenes con grupos A–D que rotan; reloj de estación |
| 10 | Estaciones 1 y 2 | Hecho o mito (6) y bacterias / virus / ambas (5), con razón |
| 11 | Estaciones 3 y 4 | Caso ficticio hacer / evitar y gráfico de líneas con conclusión |
| 12 | Mini ensayo | 8 preguntas nuevas (alternativas barajadas) + «la evidencia o concepto que lo demuestra es…», reloj de 15 min |
| 13 | Corrección | Explicación por contenido; **Three.js:** torres de errores (mi ensayo / curso) y refuerzo de los 3 mayores |
| 14 | Cierre | Tarjeta de estudio, ticket «diferenciar ___ de ___», autoevaluación y aviso de la Prueba N°2 |

Pruebas: `DECK=clase-22.html npm run verify` y `npm run interact:22`.

---

# Clase 25 · Proyecto final: ¿qué necesita saber nuestra comunidad?

OA 1–3 · OAH b, e, g, l, m. Meta: planificar una comunicación científica de autocuidado para una audiencia escolar (pregunta central, contenidos, evidencia, fuentes, roles y mensaje). Es la primera clase del proyecto «Autocuidado informado»; la 26 es en computación (PPT) y la 28 la feria.
Todo el material es **ficticio**; los resguardos del plan se aplican en la propia actividad (sin relatos íntimos, sin fotos clínicas explícitas, sin redes sociales como evidencia principal, temas solo dentro de los OA 1–3). Los semáforos de la pregunta central y la clasificación de fuentes son **orientativos**; la revisión final la hace el docente, que proyecta los sitios oficiales vigentes.

Estilo propio: **plano de proyecto** — azul cobalto con cuadrícula técnica (shader), hojas de papel blanco, marcador amarillo que subraya las palabras clave, mira con coordenadas que sigue al cursor, transición de mosaico 16 × 9 y regla de diapositivas con pin.

| # | Momento | Contenido interactivo |
|---|---|---|
| 1 | Portada | Siete diapositivas que se dibujan con cotas |
| 2 | Ruta | Meta, resguardos (✕ / ✓), 5 etapas y 90 min |
| 3 | Activación | Dos productos ficticios con lupa, votación y elección de 3 criterios (con 2 trampas) |
| 4 | Preguntas | Cinco notas adhesivas con idea de apoyo y respuesta escrita |
| 5 | Vocabulario | Arrastrar 8 términos a sus definiciones |
| 6 | Modelamiento 1 | **Three.js:** una diapositiva en cinco capas que se arma |
| 7 | Modelamiento 2 | Estructura del PPT y rúbrica: clasificar 6 frases; compara con tus criterios |
| 8 | Actividad 1 | Tema (10 opciones, OA 1–3), audiencia y chequeo de resguardo |
| 9 | Actividad 2 | Ficha con semáforo de la pregunta central y ejemplo por tema |
| 10 | Actividad 3 | Clasificar 9 fuentes y elegir 2 institucionales |
| 11 | Actividad 4 | **Three.js:** mesa de 7 láminas con una oración objetivo por diapositiva |
| 12 | Actividad 5 | Roles (arrastrar) para 3–6 integrantes |
| 13 | Puesta en común | Guion de pitch automático con cronómetro de 30 s; **Three.js:** radar 3D de 5 criterios y pase a computación |
| 14 | Ticket + aviso | Ticket «enseñará ___ / respaldaremos con ___», plan maestro descargable y aviso de la clase 26 |

Pruebas: `DECK=clase-25.html npm run verify` y `npm run interact:25`.

---

# Clase 26 · Computación: PPT «Autocuidado informado»

OA 1–3 · OAH e, f, g, h, l. Meta: elaborar un PPT científico de autocuidado que comunique información correcta, respetuosa y respaldada por fuentes oficiales. Identidad: **pizarra verde de sala de computación** (verde petróleo, ventanas de papel con barra de título y coral), Instrument Serif + DM Sans + DM Mono; títulos que se «teclean» con cursor y la frase destacada queda como texto seleccionado; transición de persiana; fondo de puntos de semitono con ventanas fantasma.
Todas las páginas, mensajes, gráficos y evidencias son **ficticios (ilustrativos)**; las ideas son paráfrasis de orientación general y el docente proyecta las fuentes oficiales vigentes (Currículum Nacional, MINSAL/DIPRECE, organismos sanitarios). Semáforos, balanza y banquito son **orientativos**.

| # | Momento | Contenido interactivo |
|---|---|---|
| 1 | Portada | Ventana de editor con las siete diapositivas del PPT (miniaturas que informan su contenido) |
| 2 | Ruta | Meta, cuidados (✓ / ✕), 5 pasos del plan y barra de 90 min |
| 3 | Activación | Navegador con 6 pestañas ficticias: elegir 2 fuentes institucionales, razones de confiabilidad (con trampa) y checklist «¿Información o rumor?» que habilita «Empezar a crear» |
| 4 | Preguntas | Las 5 preguntas del plan; cada una marca en qué diapositivas del PPT se responde + respuesta guardada |
| 5 | Vocabulario | 7 términos del plan: definición → término, con pista y «uso en el PPT» |
| 6 | Modelamiento 1 | Anatomía de una diapositiva (5 partes con marcadores) frente a una versión cargada de texto, con medidores de palabras / ideas / fuente |
| 7 | Modelamiento 2 | De un párrafo a una frase de síntesis: subrayar, comparar 4 frases y revisor orientativo (copia, absolutos/estigma, largo) |
| 8 | Modelamiento 3 | **Three.js:** gráfico de barras 3D (datos ficticios); se activan título, ejes con unidad, fuente y «ilustrativo» |
| 9 | Modelamiento 4 | Armar una referencia simple campo por campo (con opciones inválidas) y pie corto de diapositiva |
| 10 | Actividad 1 | Tablero de las 7 diapositivas: requisitos, responsable por integrante (3–6) y estado; avance en anillo |
| 11 | Actividad 2 | **Three.js:** balanza mito–evidencia (4 mitos, fuentes oficiales / con cuidado / sin respaldo) y borrador de la diapositiva 4 |
| 12 | Actividad 3 | Reescribir 5 mensajes (miedo, estigma, absoluto, vergüenza, sin fuente) y decidir qué va en «dónde buscar ayuda» |
| 13 | Puesta en común | **Three.js:** banquito de tres patas (exactitud, respeto, claridad) con 3 diapositivas ficticias, clave orientativa, resaltado de absolutos y registro de pendientes |
| 14 | Ticket + aviso | Ticket «Antes de presentar necesitamos mejorar ___», autoevaluación con los 4 criterios del plan, registro descargable y aviso de la clase 27 |

Pruebas: `DECK=clase-26.html npm run verify` y `npm run interact:26`.

---

## Código compartido

`core/` reúne el motor común (navegación, HUD, notas, reloj, movimiento reducido), el kit de escenas Three.js y el CSS base. Las clases nuevas (desde la 25) lo usan; las anteriores siguen autónomas. Ver `CLAUDE.md`.
