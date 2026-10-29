# AGENTS.md · Presentaciones interactivas de la Unidad 4 (Ciencias Naturales 7°)

Este repo contiene una presentación HTML por clase (14 diapositivas, español) con motion graphics y 3 escenas Three.js ligadas al contenido más un fondo. Cada clase se entrega como **un solo HTML autocontenido que funciona sin internet** (JS, CSS y fuentes incrustados por `build.mjs`).
Hechas: 18 (`index.html`), 19, 20, 21, 22, 25, 26, 27. **Pendientes: 23, 24, 28, 29.** El texto pedagógico de las pendientes está en `docs/plan-unidad4-extracto.md` (buscar `## Clase NN`). No necesitas el docx original.

> Este archivo es la versión para Codex de `CLAUDE.md` (misma información, más una receta paso a paso). Si cambian, `CLAUDE.md` manda en reglas de contenido.

## Presupuesto de contexto (importante)
- **Una sesión por clase.** Con este archivo, el README y `docs/plan-unidad4-extracto.md` basta.
- **No leas** `*.html` generados, `shots*/`, `node_modules/`, `package-lock.json` ni clases anteriores «para tomar contexto». Usa `rg` y lecturas con rango de líneas solo para algo concreto.
- **Plantilla de partida: `clase-27/src/`** (usa `core/`, es la más reciente y tiene el patrón completo de escenas, estado compartido y pruebas). Copia la carpeta a `clase-NN/` y reescribe contenido, estilos y escenas; no mezcles identidad visual ni datos de otra clase.
- Para ediciones pequeñas edita (parches), no reescribas archivos enteros. Archivos nuevos sí se escriben completos.
- Verifica barato: `tools/interact<NN>.mjs` (comprobaciones por consola) + **un** montaje 2×2 de 4 diapositivas. No captures las 14 una por una.

## Estructura
```
core/deck-base.js   motor común: escala 1920×1080, regla/índice, notas, reloj (T), movimiento reducido (M), teclado/táctil
core/scene-kit.js   makeStage (cámara+luces+OrbitControls), makePicker (clic en 3D), projector (etiquetas DOM), safe (sin WebGL)
core/base.css       estructura y comportamiento del HUD/notas/índice/aviso; tematizable con variables CSS
src/util.js         $, $$, clamp, rng, motion.reduced, toast, confetti (compartido por todas)
clase-NN/src/       data.js · template.html · styles.css · deck.js · slides.js · main.js · three/*.js
build.mjs           node build.mjs [18|19|20|21|22|25|26|27|all] → HTML único (esbuild IIFE + CSS + fuentes base64)
tools/              verify.mjs (capturas; DECK=archivo.html) · interact<NN>.mjs (pruebas con Playwright)
```
- `clase-NN/src/deck.js` solo aporta lo propio: `effects = { enter(slide, tl, quick), transition:{out,in,reset}, step, clear }` y llama a `createDeck` de `core/deck-base.js`. El motor común espera en el HTML: `#stage`, `#slides > .slide[data-title][data-phase]`, HUD (`#phaseChip`, `#clock`, `#journey`, `#counter`, `#btnPrev/#btnNext/#btnMenu/#btnNotes/#btnMotion/#btnFs`), `#notes`, `#notesBody`, `#menu`, `#menuGrid`, `#shortcuts`, `#pane`, `#confetti`, `#bg`. **Copia esos bloques del `template.html` de la clase 27 sin renombrarlos.**
- El tema son variables en `:root` de `styles.css` (`--bg --txt --accent --accent-ink --hud-bg --hud-hover --menu-bg --notes-accent --paper --ink …`; ver cabecera de `core/base.css`).
- Escenas: `three/*.js` con `makeStage/makePicker/projector`; `import * as THREE from 'three'` en cada archivo (no re-exportar el namespace: rompe el tree-shaking). Un solo bucle de render (`gsap.ticker`) en `main.js`; cada escena 3D solo se dibuja si su diapositiva está visible (`three.live.*` con `deck.hooks.enter/leave[n]`). Todo dentro de `safe()` para que, sin WebGL, la clase siga funcionando.
- Registrar la clase nueva en `build.mjs` (`core: true`, fuentes en `fonts()` con `@fontsource*` ya instaladas) y en `package.json` (`build:NN`, `interact:NN`).

## Receta para una clase nueva
1. Leer `## Clase NN` en `docs/plan-unidad4-extracto.md` (título, OA/OAH, meta, vocabulario, ruta, inicio, preguntas, modelamiento, actividad central, recursos/cuidado, puesta en común, ticket, DUA, aviso de la próxima clase). **No inventes contenido que el plan no pida.**
2. Repartir 14 diapositivas por momentos (suman 90 min): ruta/inicio · activación · preguntas iniciales (+ vocabulario) · modelamiento (2–4) · actividad central (3–5) · puesta en común · ticket + aviso. Cada fase del HUD (`PHASES` en `data.js`) lleva sus minutos y color.
3. **Identidad visual nueva** (paleta, tipografías, efecto de títulos, transición, fondo Three.js). Ver «Identidades usadas».
4. Escribir `data.js` (contenido, `NOTES` del docente de las 14 diapositivas, textos), `template.html`, `styles.css`, `slides.js` (una función `initX` por diapositiva), `three/*.js` (3 escenas **ligadas al contenido** + fondo) y `main.js`.
5. `node build.mjs NN` → `clase-NN.html`. Comprobar consola limpia.
6. Escribir `tools/interact<NN>.mjs` (clics, escritura, descargas, retroalimentación de cada actividad; ver `tools/interact27.mjs`). Debe terminar con «todas las comprobaciones pasaron».
7. Revisar desbordes (el escenario mide 1920×1080 y el HUD ocupa ~70 px abajo; contenido útil hasta y≈968) y un montaje 2×2 de las diapositivas más densas.
8. README (tabla de la clase), `package.json`, `CLAUDE.md`/`AGENTS.md` (línea «Hechas» e identidad usada), commit, push a la rama de la sesión. Sin PR salvo que lo pidan.

## Cuidado pedagógico (obligatorio)
Casos, mensajes, datos, páginas y productos **ficticios** y marcados «ilustrativo»; sin relatos íntimos, fotos clínicas explícitas ni redes sociales como evidencia principal; temas dentro de OA 1–3 y nivel 7° (13–14 años). Las ideas son paráfrasis de orientación general: el docente proyecta las fuentes oficiales vigentes (Currículum Nacional, MINSAL/DIPRECE, OMS). No escribir teléfonos ni canales de ayuda «de memoria». Semáforos, revisores, balanzas y claves son **orientativos** (la revisión humana prevalece). **No incluir preguntas reales de las pruebas.** Avisar de todo esto en el resumen final.

## Notas específicas de las clases pendientes
- **23 · Prueba N°2 (evaluación individual):** la presentación solo apoya la logística; **no contiene ítems de la prueba ni modela contenido** (el plan: «se explican únicamente las instrucciones y criterios de respuesta»). Ideas: tiempos visibles (10 / 60–65 / 10 / 5 min) con cronómetro grande, instrucciones, estrategias para leer evidencia (dato vs inferencia), checklist de revisión final, percepción anónima de dificultad y ticket. Ambiente calmado y de bajo estímulo (animaciones suaves, `prefers-reduced-motion` respetado por defecto).
- **24 · Retroalimentación diferenciada:** el plan usa resultados reales agregados. Usa datos **ficticios** en un único objeto editable (`RESULTADOS` en `data.js`, comentado) para que el docente pueda reemplazarlos por los agregados reales; sin nombres. Patrones de error → estaciones diferenciadas → corregir dos respuestas propias (ejemplos ficticios) → meta para el proyecto final.
- **28 · Feria de autocuidado informado:** apoyo al docente y a la audiencia: orden de presentación, cronómetro por grupo, hoja de escucha de la audiencia (3 criterios), rúbrica breve del plan (exactitud, fuentes, autocuidado y respeto, evidencia visual, comunicación), pregunta de comprensión a integrantes distintos y respuesta responsable a preguntas difíciles («con la evidencia que revisamos podemos afirmar…; para una situación personal corresponde consultar…»).
- **29 · Cierre integral individual:** metacognición y transferencia; «mapa individual de autocuidado informado» sin relatos personales; dónde buscar ayuda (sin números de memoria); cierre de la unidad.

## Identidades usadas (no repetir)
18 azul marino/cian/brasa · 19 negro/verde lima CRT · 20 papel crema neobrutalista · 21 pastel amanecer + vidrio · 22 vino oscuro + ámbar (tablero de andén) · 25 azul cobalto plano de proyecto + marcador amarillo · 26 verde pizarra + ventanas de papel + coral (títulos que se teclean) · 27 amarillo de rotulador + hojas 3D + marcas de corrección (títulos que se «editan»).
Fuentes ya incrustables (`@fontsource*`): Bricolage Grotesque, DM Sans, DM Mono, Fraunces, Inter, Instrument Serif, JetBrains Mono, Manrope, Plus Jakarta Sans, IBM Plex Mono, Space Mono, Syne.
Ideas aún sin usar: 23 gris azulado sobrio/papel de examen (calma) · 24 mapa de rutas/estaciones en tonos terracota · 28 feria/carpa con guirnaldas y colores festivos (magenta, turquesa, naranja) · 29 cielo nocturno índigo con constelaciones/trayectos.
**Legibilidad primero:** contraste alto, texto ≥ 18 px en escenario (etiquetas decorativas ≥ 14 px), sin desbordes.

## Errores ya cometidos (evitar)
- `\b` no funciona con letras acentuadas al final (`conocerá`): usar `(?![a-záéíóúñ])`.
- `gsap.to(array, {0: x})` trata el array como lista de objetivos: usar un objeto.
- Draggable: marcar `dragging` en `onDragStart` (no en `onPress`) o se pierden los clics; en móvil las fichas arrastrables llevan la clase `no-swipe`.
- Elementos con `display` propio ignoran `[hidden]` si no se fuerza (`core/base.css` ya lo hace).
- Textos en canvas 2D (texturas) se redibujan en `document.fonts.ready`.
- `localStorage` siempre dentro de `try/catch` (prefijo `cNN:`).
- En GLSL no nombrar variables como funciones nativas (`dot`, `mix`…).
- Si `gsap` interpola `transform` que ya existe en CSS (p. ej. `translateX(-101%)`), fijar `x:0` además de `xPercent`, o se suman.
- Tras cambiar CSS de contenido, comprobar desbordes en las diapositivas más densas contra el HUD inferior.

## Comandos
```bash
npm install                      # una vez (si falta Playwright: npm i --no-save playwright && npx playwright install chromium)
node build.mjs NN                # → clase-NN.html
node tools/interact<NN>.mjs      # pruebas de interacción (Chromium con --use-angle=swiftshader --enable-unsafe-swiftshader)
DECK=clase-NN.html node tools/verify.mjs shotsNN 1920 1080   # capturas (usar con moderación)
```
Si Playwright no resuelve el módulo, usar `NODE_PATH=<ruta global de node_modules>`. Sin `gh`: no se necesita.
