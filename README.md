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
