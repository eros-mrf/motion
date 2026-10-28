// Prueba de interacciones · Clase 26. Uso: node tools/interact26.mjs [carpeta-salida]
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const out = process.argv[2] || 'shots-interact26';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, acceptDownloads: true });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
let fails = 0;
const ok = (c, msg) => { if (!c) { fails++; console.log('✗', msg); } else console.log('✓', msg); };
const go = async (n, ms = 1500) => { await page.evaluate((k) => window.__deck.deck.go(k), n); await page.waitForTimeout(ms); };
const shot = (n) => page.screenshot({ path: `${out}/${n}.png` });
const text = (sel) => page.textContent(sel);
const click = (sel) => page.locator(sel).first().click();
const clickText = (sel, t) => page.locator(sel, { hasText: t }).first().click();

await page.goto('file://' + path.resolve('clase-26.html') + '?fast#1');
await page.evaluate(() => localStorage.clear());
await page.reload(); await page.waitForTimeout(2200);

// navegación y HUD
await page.keyboard.press('ArrowRight'); await page.waitForTimeout(500);
ok((await page.evaluate(() => window.__deck.deck.index)) === 1, 'flecha → avanza');
await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(500);
ok((await page.evaluate(() => window.__deck.deck.index)) === 0, 'flecha ← vuelve');
await page.keyboard.press('n'); await page.waitForTimeout(500);
ok(await page.isVisible('#notes'), 'N abre las notas'); await page.keyboard.press('n');
await page.keyboard.press('g'); await page.waitForTimeout(700);
ok(await page.isVisible('#menu'), 'G abre el índice'); await shot('menu'); await page.keyboard.press('Escape');
ok((await page.evaluate(() => document.querySelectorAll('#slides > .slide').length)) === 14, '14 diapositivas');
ok((await page.evaluate(() => document.querySelectorAll('.title[data-a="title"] .ch').length)) > 20, 'el título 1 se parte en letras (tecleo)');

// 1 · portada
await page.hover('#cvThumbs .th:nth-child(4)'); await page.waitForTimeout(200);
ok((await text('#cvInfo')).includes('Diapositiva 4') && (await text('#cvInfo')).includes('Mito y evidencia'), 'portada: la miniatura 4 informa su contenido');

// 3 · información o rumor
await go(2);
await clickText('#tabs button', 'Blog'); await click('#tabOk'); await page.waitForTimeout(200);
ok((await text('#pgNote')).includes('No es una fuente institucional'), 'activación: el blog no se puede elegir como institucional');
await click('#tabNo'); await page.waitForTimeout(200);
ok(await page.evaluate(() => [...document.querySelectorAll('#tabs button')].find((b) => b.textContent.includes('Blog')).classList.contains('st-no')), 'activación: el blog queda descartado');
await clickText('#tabs button', 'Portal'); await click('#tabNo'); await page.waitForTimeout(200);
ok((await text('#pgNote')).includes('sí tiene institución'), 'activación: descartar una fuente buena avisa');
await click('#tabOk'); await clickText('#tabs button', 'Organismo'); await click('#tabOk'); await page.waitForTimeout(200);
ok(await page.evaluate(() => document.querySelector('#ck1').classList.contains('done')), 'activación: dos fuentes institucionales elegidas');
for (const t of ['Institución identificable', 'Fecha de actualización', 'Autoría o equipo']) await clickText('#whyList button', t);
await page.waitForTimeout(200);
ok(await page.evaluate(() => document.querySelector('#ck2').classList.contains('done')), 'activación: tres razones válidas');
await clickText('#whyList button', 'muchos «me gusta»'); await page.waitForTimeout(200);
ok(!(await page.evaluate(() => document.querySelector('#ck2').classList.contains('done'))) && (await text('#ckMsg')).includes('popularidad'), 'activación: la razón trampa se rechaza');
await clickText('#whyList button', 'muchos «me gusta»');
ok(await page.isDisabled('#ckGo'), 'activación: «Empezar a crear» bloqueado sin el chequeo de OA');
await page.check('#ckOA'); await page.waitForTimeout(200);
ok(await page.isEnabled('#ckGo'), 'activación: checklist completo habilita «Empezar a crear»');
await click('#ckGo'); await page.waitForTimeout(300);
ok((await text('#ckMsg')).includes('muestra tus dos fuentes'), 'activación: mensaje final');
await shot('s03-done');

// 4 · preguntas
await go(3);
await click('#qList li:nth-child(3) button'); await page.waitForTimeout(300);
ok((await page.evaluate(() => document.querySelectorAll('#qStrip .mini.on').length)) === 2, 'preguntas: la pregunta 3 se responde en 2 diapositivas del PPT');
await page.fill('#qAns', 'Un gráfico simple de fuente oficial.');
await click('#qList li:nth-child(1) button'); await click('#qList li:nth-child(3) button'); await page.waitForTimeout(200);
ok((await page.inputValue('#qAns')).includes('gráfico simple'), 'preguntas: la respuesta se guarda por pregunta');

// 5 · vocabulario
await go(4);
await clickText('#vDefs button', 'Origen identificable'); await clickText('#vBank button', 'Evidencia'); await page.waitForTimeout(200);
ok((await text('#vMsg')).startsWith('Pista'), 'vocabulario: error → pista');
await clickText('#vBank button', 'Fuente'); await page.waitForTimeout(200);
ok((await text('#vProg')).startsWith('1 /'), 'vocabulario: acierto cuenta');
const defs = { 'Datos y razonamientos': 'Evidencia', 'Acciones que se toman antes': 'Prevención', 'Decisiones informadas': 'Autocuidado', 'Explicar ideas de la ciencia': 'Comunicación científica', 'Representación visual': 'Gráfico', 'Representación simplificada': 'Modelo' };
for (const [d, t] of Object.entries(defs)) { await clickText('#vDefs button', d); await page.locator('#vBank button:not([disabled])', { hasText: new RegExp(`^${t}$`) }).first().click(); await page.waitForTimeout(80); }
ok((await text('#vProg')).startsWith('7 /'), 'vocabulario: 7 de 7');
await shot('s05-done');

// 6 · anatomía
await go(5);
await click('.hs[data-id="fuente"]'); await page.waitForTimeout(200);
ok((await text('#anText')).includes('Referencia simple'), 'anatomía: el marcador 5 explica la fuente');
ok((await text('#anMeter')).includes('Sí'), 'anatomía: versión clara con fuente');
await page.locator('#anSw + .knob').click(); await page.waitForTimeout(300);
ok(await page.evaluate(() => document.querySelector('#anSlide').classList.contains('bad')) && (await text('#anMeter')).includes('No'), 'anatomía: versión cargada sin fuente');
await shot('s06-bad');
await page.locator('#anSw + .knob').click(); await page.waitForTimeout(300);
ok(!(await page.evaluate(() => document.querySelector('#anSlide').classList.contains('bad'))), 'anatomía: vuelve a la versión clara');

// 7 · síntesis
await go(6);
await click('#syPara mark'); await page.waitForTimeout(100);
ok((await text('#syMarks')).includes('Marcadas: 1'), 'síntesis: subrayar una frase clave');
await clickText('#syCand button', 'Todos cambian'); await page.waitForTimeout(200);
ok((await text('#syFb')).includes('inexacta'), 'síntesis: la frase absoluta se rechaza');
await clickText('#syCand button', 'momentos distintos'); await page.waitForTimeout(200);
ok((await text('#syFb')).includes('Exacta'), 'síntesis: la frase prudente es correcta');
await page.fill('#syMine', 'La pubertad es un proceso de cambios físicos, hormonales y emocionales que ocurre en edades distintas');
ok((await text('#syChk')).includes('Copias'), 'síntesis: detecta copia literal');
await page.fill('#syMine', 'Todos cambian siempre igual.');
ok((await text('#syChk')).includes('absoluta'), 'síntesis: detecta palabra absoluta');
await page.fill('#syMine', 'Cada persona vive esos cambios en su momento y puede preguntar a profesionales de salud.');
ok((await page.locator('#syChk .sg3.g').count()) === 3, 'síntesis: frase propia con tres semáforos verdes');

// 8 · gráfico 3D
await go(7, 2200);
await page.locator('#chParts label').nth(0).click(); await page.waitForTimeout(150);
ok((await text('#chText')).includes('n = 40'), 'gráfico: título que concluye');
await page.evaluate(() => window.__deck.three.onBarPick(3)); await page.waitForTimeout(100);
ok((await text('#chText')).includes('No sirve como evidencia principal'), 'gráfico: la barra del blog se lee con cuidado');
for (const i of [1, 2, 3]) await page.locator('#chParts label').nth(i).click();
await page.waitForTimeout(300);
ok((await text('#chText')).includes('Gráfico completo'), 'gráfico: las cuatro partes activadas');
await shot('s08-done');

// 9 · referencia
await go(8);
await clickText('#rfFields .chips button', 'Un blog anónimo'); await page.waitForTimeout(100);
ok((await text('#rfMsg')).includes('identificable'), 'referencia: institución inválida avisa');
for (const t of ['Ministerio de Salud (ejemplo)', 'Cambios en la pubertad', '2024', 'sitio-oficial.ejemplo', 'noviembre de 2025']) await clickText('#rfFields .chips button', t);
await page.waitForTimeout(200);
ok((await text('#rfStat')).startsWith('5 /') && await page.isEnabled('#rfCopy'), 'referencia: 5 de 5 habilita copiar');
ok((await text('#rfFoot')).includes('Ministerio de Salud (ejemplo), 2024'), 'referencia: pie corto armado');

// 10 · tablero
await go(9);
await page.selectOption('#tbRows .b-row:nth-child(1) select', '1'); await page.waitForTimeout(100);
await click('#tbRows .b-row:nth-child(1) .st'); await page.waitForTimeout(150);
ok((await text('#tbRows .b-row:nth-child(1) .st')) === 'En curso', 'tablero: el estado avanza');
await click('#tbMinus'); await page.waitForTimeout(100);
ok((await text('#tbTeam')) === '3', 'tablero: grupo de 3');
ok(await page.evaluate(() => document.querySelectorAll('#tbNames input:not([hidden])').length === 3), 'tablero: tres nombres visibles');
await click('#tbRows .b-row:nth-child(5)'); await click('#tbMust li:nth-child(1)'); await page.waitForTimeout(100);
ok(await page.evaluate(() => document.querySelector('#tbMust li').classList.contains('done')), 'tablero: marcar un requisito');
ok((await text('#tbPct')).includes('%'), 'tablero: porcentaje de avance');
await shot('s10-done');

// 11 · balanza
await go(10, 2000);
await click('#blEv .ev:nth-child(4)'); await page.waitForTimeout(200);
ok((await text('#blMsg')).includes('huecos'), 'balanza: un bloque sin respaldo casi no pesa');
await click('#blEv .ev:nth-child(4)');
await click('#blEv .ev:nth-child(1)'); await click('#blEv .ev:nth-child(2)'); await page.waitForTimeout(300);
ok((await text('#blMsg')).includes('supera al mito'), 'balanza: dos fuentes oficiales superan al mito');
ok((await page.inputValue('#blDraft')).includes('Mito frecuente'), 'balanza: se compone el borrador de la diapositiva 4');
await click('#blEv .ev:nth-child(2)'); await page.waitForTimeout(200);
ok(!(await text('#blMsg')).includes('supera al mito'), 'balanza: con una sola fuente aún no alcanza');
await click('#blEv .ev:nth-child(2)'); await page.waitForTimeout(1500);
await shot('s11-done');

// 12 · autocuidado y ayuda
await go(11);
await clickText('#msOpts button', 'Si no te cuidas, vas a sufrir'); await page.waitForTimeout(150);
ok((await text('#msFb')).includes('asustando') || (await text('#msFb')).includes('Sigue'), 'mensajes: opción con miedo se rechaza');
const picks = ['Cuidarte incluye', 'Las ITS pueden afectar', 'Los métodos tienen distinta eficacia', 'Preguntar es parte', 'Busca en sitios institucionales'];
for (let i = 0; i < picks.length; i++) { await clickText('#msOpts button', picks[i]); await page.waitForTimeout(100); if (i < 4) await click('#msNext'); }
await page.waitForTimeout(200);
ok((await text('#msFb')).includes('cinco mensajes'), 'mensajes: los cinco reescritos');
await page.locator('#hpList .hp-row').nth(0).locator('button').nth(0).click();
await page.locator('#hpList .hp-row').nth(4).locator('button').nth(0).click(); await page.waitForTimeout(150);
ok((await text('#hpMsg')).length > 10 && await page.evaluate(() => document.querySelectorAll('#hpList .hp-row.bad').length === 1), 'ayuda: marcar «va» una opción que no va se señala');
await shot('s12-done');

// 13 · revisión entre grupos
await go(12, 2000);
await clickText('#rvTabs button', 'B'); await page.waitForTimeout(100);
await page.locator('#rvCrit .cr3').nth(1).locator('button').nth(0).click();
await click('#rvCrit .btn'); await page.waitForTimeout(200);
ok((await text('#rvFb')).includes('Clave orientativa'), 'revisión: compara con la clave orientativa');
await clickText('#rvTabs button', 'A'); await page.check('#rvHi'); await page.waitForTimeout(100);
ok((await page.locator('#rvSlide .abs').count()) >= 1, 'revisión: resalta afirmaciones absolutas');
await clickText('#pdList button', 'Diap. 5'); await page.waitForTimeout(100);
await shot('s13-done');

// 14 · ticket y aviso
await go(13);
ok((await text('#tkSum')).includes('diap. 5'), 'ticket: el resumen incluye las diapositivas pendientes');
await clickText('#tkFoci button', 'las fuentes oficiales'); await page.waitForTimeout(100);
ok((await text('#tkLine')).includes('las fuentes oficiales'), 'ticket: la frase se completa');
await page.locator('#tkSelf .tkr').nth(0).locator('button').nth(2).click(); await page.waitForTimeout(100);
ok((await text('#tkSum')).includes('1 de 4'), 'ticket: autoevaluación cuenta los logrados');
const [dl] = await Promise.all([page.waitForEvent('download'), click('#tkDl')]);
const body = fs.readFileSync(await dl.path(), 'utf8');
ok(body.includes('Antes de presentar necesitamos mejorar: las fuentes oficiales') && body.includes('Diap. 1'), 'ticket: el registro descargado trae foco y responsabilidades');
ok((await text('#tkNotice')).includes('taller completo'), 'aviso de la clase 27');
await shot('s14-done');

// movimiento reducido
await page.evaluate(() => document.activeElement?.blur()); await page.keyboard.press('m'); await go(5, 800);
ok(await page.evaluate(() => document.body.classList.contains('reduced')), 'M activa movimiento reducido');
await page.keyboard.press('m');

console.log(errors.length ? errors.join('\n') : 'sin errores de consola');
console.log(fails ? `${fails} comprobación(es) fallaron` : 'todas las comprobaciones pasaron');
await browser.close();
process.exit(fails ? 1 : 0);
