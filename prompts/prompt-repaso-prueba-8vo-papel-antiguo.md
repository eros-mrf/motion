# Prompt · Repaso animado de la prueba de Ciencias 8° básico (papel antiguo, trazo de lápiz)

Adjunta: (1) la prueba de ciencias de 8° (PDF, Word o fotos), (2) la pauta con las respuestas correctas, y (3) opcionalmente el Plan de Unidad (para citar OA y habilidades).

---

Te adjunto la **prueba de Ciencias Naturales de 8° básico** y su **pauta de respuestas**. Quiero que construyas una **presentación web interactiva de repaso** para que las y los estudiantes entiendan cada pregunta, por qué la respuesta correcta es correcta y por qué las otras no lo son. Debe ser una presentación funcional, con animaciones, que se proyecte en sala; no un documento ni imágenes estáticas.

## 1. Contenido: a partir de la prueba
- Analiza **todas** las preguntas: contenido, OA o habilidad que evalúan, tipo (conocimiento, aplicación, interpretación de gráficos/tablas/esquemas) y errores frecuentes. Si adjunté el plan, vincula cada pregunta con su OA.
- **Parafrasea cada pregunta**: mismo concepto, misma dificultad y misma respuesta correcta, pero con otro enunciado, otro contexto o ejemplo y datos cambiados (cifras, nombres, situaciones). No copies el texto original.
- **Desordena las alternativas**: cambia el orden y reparte la letra correcta de forma que no coincida con la de la prueba original ni quede siempre en la misma posición. Mantén 4 alternativas plausibles (los distractores deben corresponder a errores conceptuales reales, no a respuestas absurdas).
- Si la pregunta usa un gráfico, tabla, esquema o imagen, **redibújalo tú** en SVG con datos nuevos coherentes (no copies imágenes de la prueba).
- **Usa la pauta para la respuesta correcta.** Verifica la exactitud científica de cada explicación; si una pregunta de la prueba tiene una respuesta dudosa, ambigua o con error, dímelo en el resumen final en lugar de ocultarlo.
- No inventes contenido fuera de lo que evalúa la prueba. Todo dato o caso nuevo debe ser claramente un ejemplo para el repaso.

## 2. Cómo se analiza cada pregunta (flujo por diapositiva)
Cada pregunta tiene un recorrido por pasos (con `→` o clic avanza al paso siguiente; al terminar, pasa a la próxima pregunta):
1. **La pregunta:** enunciado parafraseado y 4 alternativas barajadas. Las y los estudiantes eligen (o el docente revela); queda registrada la elección.
2. **¿Qué nos pide?** Subrayado a lápiz de las palabras clave y de los datos importantes.
3. **Animación explicativa:** un esquema o dibujo que se va **trazando como a lápiz** y muestra el concepto (ver sección 3). Debe poder entenderse sin leer mucho texto.
4. **Respuesta correcta y por qué.** La alternativa correcta se marca (círculo a lápiz), con el razonamiento en pasos cortos.
5. **Por qué las otras no:** cada distractor se tacha con trazo de lápiz y una frase breve explica el error conceptual que representa.
6. **Para recordar:** una regla de una línea y, si corresponde, un error frecuente («cuidado con…»).
Incluye **retroalimentación inmediata** cuando eligen una alternativa y un contador de aciertos (sin ranking ni exposición individual).

## 3. Estilo visual: papel antiguo y tinta/lápiz
- **Papel envejecido:** fondo beige/crema con fibras y grano, manchas suaves, bordes ligeramente quemados o rasgados, viñeta cálida y una leve sombra de plegado; la «hoja» puede cambiar con un efecto de pasar página o plegarse.
- **Paleta mínima:** beige/sepia, tinta marrón oscuro y grafito. Como máximo **un solo acento** (rojo óxido o rojo lápiz de corrección) para lo importante. Nada de colores saturados.
- **Tipografía:** serifa antigua para títulos (por ejemplo IM Fell, Cormorant o similar), manuscrita legible para anotaciones (por ejemplo Caveat) y máquina de escribir para etiquetas (por ejemplo Special Elite o Courier Prime), incrustadas en el HTML. Tamaños grandes, legibles desde el fondo de la sala.
- **Efecto lápiz/tinta real:** trazos que se dibujan solos (stroke-dashoffset / DrawSVG de GSAP), con temblor de mano y grosor irregular (filtro SVG con turbulencia y desplazamiento o rough.js), textura de grafito, rayado cruzado para sombras, subrayados y círculos «a mano», tachados y flechas. Las letras de las anotaciones pueden «escribirse» solas. Los esquemas deben parecer bocetos de cuaderno o de lámina científica antigua.
- **Animación con propósito:** cada animación explica algo (un proceso que ocurre paso a paso, una comparación, un gráfico que se construye, un esquema que se rotula). Evita efectos decorativos que distraigan.
- **Three.js (opcional y sutil):** úsalo solo cuando una pregunta lo amerite (por ejemplo un modelo 3D simple) y renderizado como **boceto** (líneas de grafito, sombreado por rayado). El resto puede ser SVG + GSAP. Todo debe verse coherente con el papel.

## 4. Estructura de la presentación
- Portada (título del repaso, curso, unidad) → cómo funciona este repaso → **mapa de contenidos** de la prueba (qué temas y OA se evalúan) → **una sección por pregunta** (con los pasos anteriores) → **resumen final**: temas que más cuesta recordar, lista de «ideas clave» por unidad/OA y errores frecuentes → cierre con consejos de estudio.
- Agrupa las preguntas por contenido u OA con separadores breves de sección si ayuda a ordenar.
- Escenario 16:9 de 1920×1080 que escala a cualquier pantalla.

## 5. Funciones obligatorias
- **HUD:** progreso (por pregunta), contador, índice para saltar a cualquier pregunta, notas del docente, reducción de movimiento y pantalla completa.
- **Atajos:** `→ ← espacio` navegar (paso a paso dentro de cada pregunta) · `N` notas · `G` índice · `M` movimiento reducido · `F` pantalla completa · hash `#N` y deslizar en táctil.
- **Notas del docente** por pregunta: qué OA evalúa, error típico, cómo explicarlo en 1 minuto.
- Modo **«ver explicación completa»** (muestra todos los pasos de golpe) y modo **«autoestudio»** (cada estudiante responde y ve el resultado).
- Respeta `prefers-reduced-motion` por niveles (no apagar todo: mantener el dibujo con fundido), foco visible, botones reales, `aria-live` en los resultados, aviso de rotación en pantallas verticales. Guarda el avance en `localStorage` con try/catch.
- Debe funcionar sin internet.

## 6. Herramientas
Consulta https://github.com/iart-ai/motion-skills e instala en `.claude/skills` los skills pertinentes (al menos svg-animation, gsap-web, diagram-animation, accessible-animation, 60fps-animation, micro-interaction, page-transition-animation, y threejs-animation/shader-glsl si usas 3D). Úsalos de verdad.
JavaScript sin framework, GSAP (DrawSVG y SplitText ya son gratuitos) y, si hace falta, Three.js, empaquetado con esbuild; fuentes en base64. **Entregable: un único HTML autocontenido**, más el código fuente, el script de build y un README. Reutiliza el build del repositorio si ya existe.

## 7. Verificación obligatoria antes de entregar
1. Compila y abre con Playwright en 1600×900 y 1920×1080.
2. Recorre **cada pregunta paso a paso**, captura y revisa: textos cortados, trazos desalineados, solapes, tachados fuera de lugar, animaciones que no terminan, contraste del texto sobre el papel.
3. Prueba de interacciones: elegir alternativas correctas e incorrectas, avanzar pasos, índice, atajos, modo explicación completa.
4. Comprueba que **la letra correcta de cada pregunta parafraseada coincide con el razonamiento mostrado** y que ninguna alternativa se repite ni queda ambigua.
5. Cero errores o advertencias de consola. Corrige y vuelve a ejecutar. No declares terminado sin haber visto las capturas.

## 8. Entrega
- Commit y push en la rama asignada (sin PR salvo que lo pida) y envíame el HTML.
- Resumen final breve: cuántas preguntas, cómo agrupaste los temas, qué estilo de animación usaste por tipo de pregunta, y **advertencias**: preguntas de la prueba con respuesta dudosa o ambigua, preguntas con imágenes que redibujaste y cualquier suposición que hice.
