# Unidad 4 · Ciencias Naturales 7° — presentaciones interactivas

| Clase | Archivo | Estilo |
|---|---|---|
| 18 · Rumor, prejuicio o evidencia | [`index.html`](./index.html) | Laboratorio nocturno: ember / violeta / cian, Bricolage Grotesque |
| 19 · Computación: investigación documental de una ITS | [`clase-19.html`](./clase-19.html) | Retícula de datos: lima / rosa / azul / oro, Syne + IBM Plex Mono |
| 20 · Datos de salud pública: leer sin exagerar | [`clase-20.html`](./clase-20.html) | Periodismo de datos sobre papel: bermellón / cobalto / caléndula / jade, Fraunces + DM Sans |

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
