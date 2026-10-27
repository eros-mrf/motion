# Prompt · Presentaciones interactivas con motion graphics (8° básico)

Adjunta el Plan de Unidad (.docx/.pdf) y reemplaza lo que está entre [corchetes].

---

Te adjunto el **Plan de Unidad de Ciencias Naturales de 8° básico**. Analízalo completo (propósito, OA, habilidades OAH, actitudes, acuerdos de cuidado, estructura de la clase, progresión, calendario y cada clase) y construye la **Clase [N°]** como una **presentación web interactiva con motion graphics cinematográficos y animaciones Three.js**. No quiero un documento con instrucciones ni imágenes estáticas: quiero una presentación funcional que se proyecte en sala.

## 1. Cómo leer el plan
- Toma **todo el contenido de la clase desde el plan**: título, OA y OAH, meta, vocabulario clave, ruta de clase, actividad de inicio, preguntas iniciales, modelamiento docente, actividad central, recursos y resguardos, puesta en común, ticket de salida, evaluación formativa, adecuaciones DUA y aviso de la próxima clase. No inventes contenido que el plan no pida.
- Respeta la **estructura de tiempos** del plan (ej. 10-10-15-35-10-10 en 90 min) y reparte las diapositivas en esas fases.
- Adapta el lenguaje, los ejemplos y la complejidad a **estudiantes de 13–14 años**.
- Si la unidad toca temas sensibles, aplica los acuerdos de cuidado del plan: casos y datos ficticios, nada de relatos personales, sin imágenes explícitas ni que identifiquen estudiantes.
- **Todo dato numérico, caso, página web o mensaje que invente debe estar rotulado como ilustrativo/ficticio.** No fabriques estadísticas, citas ni URLs reales: remite a las fuentes oficiales que el plan indique y deja una nota para que el docente proyecte el dato vigente.

## 2. Herramientas y skills
Consulta https://github.com/iart-ai/motion-skills e instala en `.claude/skills` los packs pertinentes (webgl-animation-skills, web-animation-skills, explainer-video-skills), usando al menos: threejs-animation, shader-glsl, particle-system, gsap-web, accessible-animation, 60fps-animation, svg-animation, micro-interaction, page-transition-animation, diagram-animation. Úsalas de verdad en la implementación.

Stack: JavaScript sin framework, **Three.js + GSAP** empaquetados con **esbuild**; fuentes incrustadas en base64. **Entregable: un único HTML autocontenido que funcione sin internet**, más el código fuente (`clase-NN/src/…`), el script de build y un README. Reutiliza el build y las utilidades del repositorio si ya existen.

## 3. Estructura obligatoria (igual en todas las clases)
- **14 diapositivas** (o las que el plan requiera), escenario 16:9 de 1920×1080 que escala a cualquier pantalla.
- Recorrido: portada → ruta de clase y acuerdos de cuidado → activación → preguntas iniciales → vocabulario → **modelamiento (varias diapositivas)** → **actividad central (varias diapositivas)** → puesta en común → ticket de salida, autoevaluación y aviso de la próxima clase.
- **HUD:** barra de progreso por fase, chip de fase con minutos, reloj de clase de 90 min, contador, índice, notas del docente, movimiento reducido y pantalla completa.
- **Atajos:** `→ ← espacio` navegar · `N` notas · `G` índice · `T` reloj (`Shift+T` reinicia) · `M` movimiento reducido · `F` pantalla completa. Hash `#N` para saltar a una diapositiva y deslizar en táctil.
- **Notas del docente por diapositiva** (qué decir, qué cuidar, cómo usar la actividad).
- **Accesibilidad:** respetar `prefers-reduced-motion` por niveles (no apagar todo), foco visible, botones reales, `aria-live` en los resultados, aviso de rotación en pantallas verticales.
- Si falta WebGL, la presentación sigue funcionando sin las escenas 3D. Un solo bucle de render; las escenas 3D solo se renderizan cuando su diapositiva está visible; fuentes cargadas antes de medir diseños; guardar en `localStorage` el trabajo escrito (con try/catch).

## 4. Interactividad y Three.js
- Cada diapositiva de actividad debe **funcionar**: clasificar, emparejar, arrastrar, completar fichas, constructores, simuladores, editores con semáforo orientativo, ticket de salida interactivo, etc., con **retroalimentación inmediata** que explique el porqué.
- **Mínimo 3 escenas Three.js relacionadas con el contenido de la clase** (además del fondo): modelos, simulaciones o visualizaciones que expliquen el concepto científico (no decoración vacía). Deben ser interactivas (girar, tocar, controles) y llamativas.
- Los modelos científicos deben ser **correctos y declararse esquemáticos** cuando no están a escala.

## 5. Identidad visual propia por clase
Cada clase debe verse **distinta** y a la vez igual de llamativa y profesional: paleta, tipografías, tipo de fondo 3D, transición entre diapositivas y efectos de texto propios.
Ya usados en este proyecto (no repetir): noche cian/ember con efecto glitch y desenfoque · negro verdoso lima/rosa con descifrado de texto y persiana · papel crema neobrutalista con iris de tinta y títulos estampados.
Propón una identidad nueva coherente con el tema de la clase (por ejemplo, microscopio/laboratorio, cartografía/geología, aurora/espacio, circuitos/energía, océano/ecología…), y menciónala brevemente antes de construir.

## 6. Verificación (obligatoria antes de entregar)
1. Compila y abre el HTML con Playwright en 1600×900 y 1920×1080.
2. Recorre las 14 diapositivas, toma capturas y **revisa cada una**: textos cortados, solapes, desbordes, elementos tapados o detrás del canvas, 3D vacío o mal encuadrado.
3. Escribe y ejecuta una **prueba de interacciones** que haga clic/escriba en cada actividad y compruebe el resultado (incluida una acción de arrastrar si la hay).
4. Cero errores o advertencias de consola.
5. Corrige todo lo detectado y vuelve a ejecutar.
No declares terminado sin haber visto las capturas.

## 7. Entrega
- Commit y push en la rama asignada (sin abrir PR salvo que lo pida). Actualiza el README con la tabla de diapositivas.
- Envíame el HTML final.
- Termina con un resumen breve: estilo elegido, escenas 3D, lo que verificaste y las **advertencias pedagógicas** (datos ilustrativos, fuentes que debo proyectar, límites de cada herramienta).

Trabaja de a **una clase por vez**. Cuando termines la Clase [N°], espera mi confirmación antes de seguir con la siguiente.
