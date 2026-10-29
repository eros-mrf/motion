# Prompt para Codex · una clase nueva de la Unidad 4 (7° básico)

Pega esto en una sesión nueva de Codex con el repo abierto (reemplaza [NN]). Codex lee `AGENTS.md` solo; el prompt le dice qué hacer con él.

---

Trabajas en el repo `motion` (presentaciones interactivas HTML de la Unidad 4 de Ciencias Naturales 7° básico). Haz la **Clase [NN]**.

Antes de escribir código lee, en este orden y **nada más**: `AGENTS.md`, el apartado `## Clase [NN]` de `docs/plan-unidad4-extracto.md` (y la rúbrica/OA de ese mismo archivo si la clase los usa) y la fila de tu clase en `README.md`. No leas HTML generados, `node_modules`, `shots*` ni otras clases salvo con `rg`/rangos de líneas para algo concreto. Para partir copia `clase-27/src/` a `clase-[NN]/src/` y reescribe contenido, estilos, escenas y efectos.

Entrega, siguiendo la receta de `AGENTS.md`:
1. Una presentación **autocontenida que funcione sin internet** (`clase-[NN].html`, generada con `node build.mjs [NN]`) de **14 diapositivas** repartidas por los momentos y minutos del plan, con todo el contenido pedagógico salido del plan (no inventes lo que el plan no pida), notas del docente en las 14, atajos de teclado, movimiento reducido y HUD como las demás.
2. **Identidad visual nueva** (paleta, tipografías ya instaladas, efecto de títulos, transición y fondo Three.js distintos de las clases ya hechas; ver «Identidades usadas»), con contraste alto y texto ≥ 18 px en el escenario sin desbordes.
3. **3 escenas Three.js ligadas al contenido** (no decorativas) + un fondo; con `safe()` para que sin WebGL todo siga funcionando.
4. Actividades interactivas con retroalimentación (acierto/error con pista, no solo mostrar la respuesta), estado guardado en `localStorage` con prefijo `c[NN]:` dentro de `try/catch`, y un resumen/ticket descargable como en las clases 26 y 27.
5. `tools/interact[NN].mjs` que ejercite cada actividad y termine con «todas las comprobaciones pasaron», más `package.json` (`build:[NN]`, `interact:[NN]`), `build.mjs`, fila de la tabla en `README.md` y la línea «Hechas»/identidad en `AGENTS.md` y `CLAUDE.md`.

Cuidado pedagógico (obligatorio): casos, mensajes, datos y productos **ficticios y marcados «ilustrativo»**; sin relatos íntimos, fotos clínicas explícitas ni redes sociales como evidencia principal; temas dentro de OA 1–3 y nivel 7°; ideas como paráfrasis de orientación general (el docente proyecta las fuentes oficiales vigentes); sin teléfonos ni canales de ayuda escritos de memoria; semáforos y revisores **orientativos**; **ninguna pregunta real de pruebas**.

Verificación barata: consola sin errores, `node tools/interact[NN].mjs` en verde, revisión de desbordes (contenido útil hasta y≈968 en 1920×1080) y **un solo** montaje 2×2 de las 4 diapositivas más densas; no captures las 14 una por una.

Al terminar: commit en la rama de la sesión (sin PR salvo que lo pida), y un resumen final breve con (a) qué hay en cada diapositiva, (b) la identidad elegida, (c) qué verificaste y qué no, y (d) los avisos de cuidado pedagógico.

Notas de esta clase: [pega aquí la nota de tu clase desde `AGENTS.md` → «Notas específicas», o escribe «ninguna»].
