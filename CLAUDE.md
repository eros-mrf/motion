# Presentaciones interactivas · Unidad 4 Ciencias Naturales 7° (Sexualidad y autocuidado)

Una presentación HTML por clase (14 diapositivas, español), con motion graphics y 3 escenas Three.js ligadas al contenido más un fondo. Cada clase se entrega como **un solo HTML autocontenido que funciona sin internet** (JS, CSS y fuentes incrustados por `build.mjs`).
Hechas: 18 (`index.html`), 19, 20, 21, 22, 25. Pendientes según el plan: 23 (prueba), 24, 26–29. Los textos pedagógicos salen del plan docx que adjunta el usuario (`python-docx` → texto plano en el scratchpad; buscar `Clase NN:`).

## Reglas de ahorro de contexto (lee esto primero)
- **Una sesión nueva por clase.** Con este archivo y el README basta; no arrastres el historial de clases anteriores.
- **No leas** `*.html` generados, `shots*/`, `node_modules/`, `package-lock.json` ni clases anteriores «para tomar contexto». Para una clase nueva parte de `clase-25/src/` (es la que usa `core/`) y, si necesitas algo concreto de otra, usa `Grep` y `Read` con `offset/limit`.
- **Edita, no reescribas.** Usa `Edit` (o `edits` en Artifact) sobre `slides.js`, `styles.css`, `template.html`; un `Write` completo solo para archivos nuevos.
- **Verifica barato:** `tools/interact<NN>.mjs` (comprobaciones por consola) + un único montaje `montage` de 4–6 diapositivas con `verify`. No captures diapositiva por diapositiva.
- Al terminar: README (tabla de la clase), `package.json` (scripts), commit, push a la rama de la sesión y `SendUserFile` del HTML. Sin PR salvo que lo pidan.

## Estructura
```
core/deck-base.js   motor común: escala 1920×1080, regla/índice, notas, reloj (T), movimiento reducido (M), teclado/táctil
core/scene-kit.js   makeStage (cámara+luces+OrbitControls), makePicker (clic en 3D), projector (etiquetas DOM), safe (sin WebGL)
core/base.css       estructura y comportamiento del HUD/notas/índice/aviso, tematizable con variables CSS
src/util.js         $, $$, clamp, rng, motion.reduced, toast, confetti (compartido por todas)
clase-NN/src/       data.js · template.html · styles.css · deck.js · slides.js · main.js · three/*.js
build.mjs           node build.mjs [18|19|20|21|22|25|all] → HTML único (esbuild IIFE + CSS + fuentes base64)
tools/              verify.mjs (capturas; DECK=archivo.html) · interact<NN>.mjs (pruebas con Playwright)
```
- Clases 18–22 son **anteriores a `core/`** y llevan su propio `deck.js`/CSS (no tocarlas salvo pedido). Las clases nuevas usan `core/`: en `build.mjs` poner `core: true` y fuentes en `fonts()`.
- `clase-NN/src/deck.js` solo aporta lo propio: `effects = { enter(slide, tl, quick), transition:{out,in,reset}, step, clear }` y llama a `createDeck` de `core/deck-base.js`.
- El tema se define con variables en `:root` de `styles.css` (`--bg --txt --accent --hud-bg --paper --ink …`, ver cabecera de `core/base.css`); el resto del CSS es de la clase.
- Escenas: `three/*.js` usan `makeStage/makePicker/projector`; importar `* as THREE from 'three'` en cada archivo (no re-exportar el namespace: rompe el tree-shaking y suma ~160 KB).

## Cada clase tiene identidad propia, misma estructura
Misma estructura: HUD (fase, reloj, regla, índice, notas, movimiento reducido), 14 diapositivas por momentos (ruta, activación, preguntas, modelamiento, actividad central, puesta en común, ticket + aviso), actividades interactivas con retroalimentación, 3 escenas 3D + fondo, atajos de teclado, `prefers-reduced-motion`.
Distinta identidad (no repetir): 18 azul marino/cian/brasa · 19 negro/verde lima CRT · 20 papel crema neobrutalista · 21 pastel amanecer + vidrio · 22 vino oscuro + ámbar (tablero de andén) · 25 azul cobalto plano de proyecto + marcador amarillo. Elegir paleta, tipografías (`@fontsource*` ya instaladas), efecto de títulos y transición nuevos. **Legibilidad primero:** contraste alto, texto ≥ 18 px en escenario, sin desbordes (el escenario mide 1920×1080 y el HUD ocupa ~70 px abajo).

## Cuidado pedagógico (obligatorio)
Casos, mensajes, datos y productos **ficticios** y marcados «ilustrativo»; sin relatos íntimos, fotos clínicas explícitas ni redes sociales como evidencia principal; temas dentro de OA 1–3 y nivel 7°. Las ideas son paráfrasis de orientación general: el docente proyecta las fuentes oficiales vigentes (Currículum Nacional, MINSAL/DIPRECE, OMS). Semáforos y heurísticas son **orientativos**. No incluir preguntas reales de las pruebas. Avisar de esto en el resumen final.

## Errores ya cometidos (evitar)
- `\b` no funciona con letras acentuadas al final (`conocerá`): usar `(?![a-záéíóúñ])`.
- `gsap.to(array, {0: x})` trata el array como lista de objetivos: usar un objeto.
- Draggable: marcar `dragging` en `onDragStart` (no en `onPress`) o se pierden los clics; en móvil las fichas arrastrables llevan la clase `no-swipe`.
- Elementos con `display` propio ignoran `[hidden]` si no se fuerza (`core/base.css` ya lo hace).
- Textos en canvas 2D (texturas) se redibujan en `document.fonts.ready`.
- Tras cambiar CSS de contenido, comprobar desbordes en las diapositivas más densas contra el HUD inferior.
- `localStorage` siempre dentro de `try/catch` (prefijo `cNN:`).

## Comandos
`node build.mjs <NN>` · `NODE_PATH=/opt/node22/lib/node_modules node tools/interact<NN>.mjs` · `DECK=clase-NN.html NODE_PATH=… node tools/verify.mjs shotsNN 1920 1080`. Chromium con `--use-angle=swiftshader --enable-unsafe-swiftshader`. Sin `gh`: usar las herramientas MCP de GitHub solo si hace falta.
