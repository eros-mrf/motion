// Prueba de interacciones · Clase 27. Uso: node tools/interact27.mjs [carpeta-salida]
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const out = process.argv[2] || 'shots-interact27';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, acceptDownloads: true });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
let fails = 0;
const ok = (c, msg) => { if (!c) { fails++; console.log('✗', msg); } else console.log('✓', msg); };
const go = async (n, ms = 1300) => { await page.evaluate((k) => window.__deck.deck.go(k), n); await page.waitForTimeout(ms); };
const shot = (n) => page.screenshot({ path: `${out}/${n}.png` });
const text = (sel) => page.textContent(sel);
const click = (sel) => page.locator(sel).first().click();
const clickText = (sel, t) => page.locator(sel, { hasText: t }).first().click();
const hasClass = (sel, c) => page.evaluate(([s, k]) => document.querySelector(s).classList.contains(k), [sel, c]);

await page.goto('file://' + path.resolve('clase-27.html') + '?fast#1');
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
ok((await page.evaluate(() => document.querySelectorAll('.title[data-a="title"] .ch').length)) > 20, 'el título 1 se parte en letras (borrador que se edita)');

// 1 · portada
await page.hover('#cvFan .pl:nth-child(5)'); await page.waitForTimeout(200);
ok((await text('#cvInfo')).includes('Diap. 5') && (await text('#cvInfo')).includes('gráfico'), 'portada: el pliego 5 informa su pregunta de revisión');

// 2 · ruta
await go(1);
await click('#routeSteps li:nth-child(1) button'); await page.waitForTimeout(150);
ok(await page.evaluate(() => document.querySelector('#routeSteps li button').classList.contains('done')), 'ruta: se marca un paso');

// 3 · semáforo y meta
await go(2, 1800);
ok((await text('#semTxt')).startsWith('Amarillo'), 'semáforo: parte en amarillo');
await page.locator('#semRows .sr').nth(0).locator('.sb.s2').click(); await page.waitForTimeout(150);
ok((await text('#semTxt')).startsWith('Rojo'), 'semáforo: una diapositiva sin contenido importante → rojo');
for (let i = 0; i < 7; i++) await page.locator('#semRows .sr').nth(i).locator('.sb.s0').click();
await page.waitForTimeout(150);
ok((await text('#semTxt')).startsWith('Verde'), 'semáforo: todas completas → verde');
await page.evaluate(() => window.__deck.three.onTowerPick(2)); await page.waitForTimeout(150);
ok((await text('#semTxt')).startsWith('Amarillo'), 'semáforo: tocar un bloque 3D cambia su estado');
await page.evaluate(() => window.__deck.three.onTowerPick(2)); await page.evaluate(() => window.__deck.three.onTowerPick(2)); // vuelve a verde
for (const i of [0, 1, 3]) await page.locator('#semRows .sr').nth(i).locator('.sb.s1').click();
for (const i of [0, 1, 3]) await page.locator('#semRows .sr').nth(i).locator('select').nth(1).selectOption('0');
await page.waitForTimeout(150);
ok((await text('#semTxt')).includes('misma tarea'), 'reparto: avisa si todos tienen la misma tarea');
await page.locator('#semRows .sr').nth(1).locator('select').nth(1).selectOption('2'); await page.waitForTimeout(150);
ok((await text('#semTxt')).includes('equilibrado') || (await text('#semTxt')).includes('sola persona'), 'reparto: tareas distintas');
await page.fill('#metaTxt', 'Terminar las diapositivas 4 y 5 antes del ensayo.'); await page.waitForTimeout(100);
ok((await page.locator('#metaChk .sg3.g').count()) === 3, 'meta: tres comprobaciones verdes');
await page.fill('#metaTxt', 'mejorar todo'); await page.waitForTimeout(100);
ok((await page.locator('#metaChk .sg3.y').count()) >= 1, 'meta: una meta vaga se señala');
await page.fill('#metaTxt', 'Terminar las diapositivas 4 y 5 antes del ensayo.');
await click('#teamMinus'); await page.waitForTimeout(100);
ok((await text('#teamN')) === '3', 'integrantes: grupo de 3');
await shot('s03-done');

// 4 · preguntas
await go(3);
await page.locator('#qList .qr').nth(1).locator('.opt').nth(1).click(); await page.waitForTimeout(150);
ok((await text('#qTodo')).includes('fuente institucional') && (await text('#qCount')).includes('1 pendiente'), 'preguntas: «hay afirmaciones sin fuente» crea un pendiente');
await click('#qTodo li'); await page.waitForTimeout(100);
ok(await hasClass('#qTodo li', 'done'), 'preguntas: el pendiente se puede marcar');

// 5 · vocabulario
await go(4);
const VOC = { 'Los datos verificables': 'evidencia', 'Si una frase dice lo mismo': 'exactitud', 'El origen identificable': 'fuente', 'Que se entienda de un vistazo': 'claridad', 'Un comentario específico': 'retroalimentación', 'Practicar la exposición': 'ensayo', 'Comprobar con atención': 'revisión', 'Mejorar una diapositiva cortando': 'edición' };
const bad = await page.evaluate(() => { const c = document.querySelector('.vc'); const o = [...c.querySelectorAll('.opt')]; return o.length; });
ok(bad === 3, 'vocabulario: tres opciones por frase');
for (const [s, t] of Object.entries(VOC)) {
  const card = page.locator('.vc', { hasText: s }).first();
  await card.locator('.opt').filter({ hasText: new RegExp(`^${t}$`) }).click(); await page.waitForTimeout(60);
}
ok((await text('#vProg')).startsWith('8 /'), 'vocabulario: 8 de 8');

// 6 · control científico
await go(5);
await clickText('#ctlFrags button', 'blog'); await clickText('#ctlBtns button', 'Fecha'); await page.waitForTimeout(150);
ok((await text('#ctlFb')).includes('pregunta'), 'control: un control equivocado orienta');
await clickText('#ctlBtns button', 'Fuente'); await page.waitForTimeout(150);
ok((await text('#ctlFb')).includes('institucional'), 'control: el control correcto da el cambio sugerido');
const CT = [['Todas las personas', 'Afirmación'], ['Datos publicados', 'Fecha'], ['fotosíntesis', 'Coherencia'], ['irresponsables', 'Lenguaje']];
for (const [f, c] of CT) { await clickText('#ctlFrags button', f); await clickText('#ctlBtns button', c); await page.waitForTimeout(80); }
ok(await page.isVisible('#ctlStamp'), 'control: sello «revisado» con los cinco controles');
await shot('s06-done');

// 7 · 3C
await go(6, 1800);
await clickText('#c3Notes button', 'La fuente es institucional'); await clickText('#c3Btns button', 'Claro'); await page.waitForTimeout(150);
ok((await text('#c3Fb')).includes('Revisa'), '3C: una caja equivocada orienta');
const SORT = [['La fuente es institucional', 'Correcto'], ['Explica que la edad', 'Correcto'], ['El gráfico tiene título', 'Claro'], ['Cada diapositiva tiene', 'Claro'], ['En la diap. 5', 'Cambiar'], ['La diap. 6', 'Cambiar']];
for (const [n, b] of SORT) { await clickText('#c3Notes button', n); await clickText('#c3Btns button', b); await page.waitForTimeout(100); }
ok((await text('#c3Step')).startsWith('2.'), '3C: seis comentarios clasificados → elegir la prioritaria');
await clickText('#c3Notes button', 'La diap. 6'); await page.waitForTimeout(100);
ok((await text('#c3Fb')).includes('pesa más'), '3C: la mejora menos importante se discute');
await clickText('#c3Notes button', 'En la diap. 5'); await page.waitForTimeout(150);
ok(await page.evaluate(() => !!document.querySelector('#c3Notes button.star')) && (await text('#c3Fb')).includes('exactitud'), '3C: una sola mejora prioritaria (estrella)');
await page.waitForTimeout(1200); await shot('s07-done');

// 8 · retroalimentación útil
await go(7);
for (let i = 0; i < 4; i++) { await page.locator('#fbOpts .opt', { hasText: /En la diap\./ }).first().click(); await page.waitForTimeout(100); if (i < 3) await click('#fbNext'); }
ok((await text('#fbRes')).includes('cuatro reescrituras'), 'retroalimentación: cuatro reescrituras útiles');
await page.fill('#fbMine', 'En la diap. 3 agrega el título del esquema para que se entienda.'); await page.waitForTimeout(100);
ok((await page.locator('#fbChk .sg3.g').count()) === 4, 'retroalimentación: dónde, qué y para qué verdes');
await page.fill('#fbMine', 'Está confuso y feo'); await page.waitForTimeout(100);
ok((await page.locator('#fbChk .sg3.y').count()) >= 3, 'retroalimentación: un comentario vago se señala');

// 9 · bloque de finalización
await go(8);
await page.locator('#bdCats .st').first().click(); await page.locator('#bdCats .st').first().click(); await page.waitForTimeout(100);
ok((await text('#bdCats .st')) === 'Lista', 'tablero: una tarea llega a «Lista»');
ok((await text('#bdPct')) === '8%', 'tablero: avance 1/12 tareas listas');
ok((await text('#bdExtra')).includes('fuente institucional'), 'tablero: trae los pendientes de las preguntas');

// 10 · punto de control
await go(9);
ok((await text('#gStamp')) === 'PENDIENTE' && await page.isDisabled('#gAsk'), 'control docente: pendiente sin el autochequeo');
for (let i = 0; i < 9; i++) await page.locator('#gateGrid .todo li').nth(i).click();
await page.waitForTimeout(150);
ok((await text('#gStamp')) === 'LISTO PARA EL DOCENTE' && await page.isEnabled('#gAsk'), 'control docente: nueve controles → listo para el docente');
await click('#gAsk'); await page.waitForTimeout(150);
ok((await text('#gStamp')) === 'EN REVISIÓN DOCENTE', 'control docente: pide revisión (la aprobación es del docente)');
await shot('s10-done');

// 11 · revisión cruzada
await go(10);
await page.fill('#crOk', 'La fuente es institucional y tiene año.'); await page.fill('#crClear', 'El gráfico tiene título y unidad.');
await page.locator('#crChg input').first().fill('En la diap. 5 cambia «todos» por «en este caso ficticio se observa» para no exagerar.'); await page.waitForTimeout(100);
ok((await page.locator('#crChk .sg3.g').count()) === 5, 'revisión cruzada: correcto, claro y una mejora específica y realizable');
await page.locator('#crChg .row button').nth(1).click(); await page.waitForTimeout(100);
ok((await page.locator('#crChk .sg3.y').count()) >= 1, 'revisión cruzada: solo cuenta la mejora marcada como prioritaria');
await page.selectOption('#nmTema', 'ITS'); await page.selectOption('#nmGrupo', '3'); await page.waitForTimeout(100);
ok((await text('#nmOut')) === 'AutocuidadoInformado_ITS_G3_vFinal.pptx' && (await text('#nmFb')).includes('válido'), 'copia final: nombre estandarizado válido');

// 12 · ensayo
await go(11, 1800);
await page.check('#reDemo'); await click('#reGo'); await page.waitForTimeout(1200);
await clickText('#reSpk button', 'Integrante 2'); await page.waitForTimeout(900);
ok((await text('#reTime')) !== '00:00', 'ensayo: el cronómetro avanza');
await clickText('#reSpk button', 'Integrante 3'); await page.waitForTimeout(500); await shot('s12-run');
await click('#reEnd'); await page.waitForTimeout(300);
ok((await text('#reRes')).includes('faltó tiempo') && (await text('#reRes')).includes('Duración'), 'ensayo: el balance avisa que faltó tiempo');
await click('#reCtl li'); await page.waitForTimeout(100);
ok(await hasClass('#reCtl li', 'done'), 'ensayo: quien controla registra');

// 13 · estado final y orden
await go(12);
await page.locator('#orRows .or-row').nth(0).locator('select').selectOption('2'); await page.waitForTimeout(100);
ok((await text('#orSum')).includes('1 con corrección importante'), 'orden: estado «requiere corrección importante»');
await page.locator('#orRows .or-row').nth(1).locator('.mv button').first().click(); await page.waitForTimeout(100);
ok((await text('#orRows .or-row:first-child b')) === 'Grupo 2', 'orden: subir un grupo cambia el orden');
ok(await page.evaluate(() => document.querySelectorAll('#roRows .ro').length === 3), 'roles: un rol por integrante (grupo de 3)');
await page.locator('#roRows .ro').nth(0).locator('select').selectOption('1'); await page.locator('#roRows .ro').nth(1).locator('select').selectOption('1'); await page.waitForTimeout(100);
ok((await text('#roMsg')).includes('Solo una persona'), 'roles: solo una persona controla el tiempo');
await shot('s13-done');

// 14 · ticket y aviso
await go(13);
await clickText('#tkAc button', 'una afirmación corregida'); await clickText('#tkBc button', 'cuidar el tiempo'); await page.waitForTimeout(100);
ok((await text('#tkA')).includes('afirmación corregida') && (await text('#tkB')).includes('tiempo'), 'ticket: las dos frases se completan');
await page.locator('#tkSelf .tkr').nth(0).locator('button').nth(2).click(); await page.waitForTimeout(100);
ok((await text('#tkSum')).includes('1 de 4') && (await text('#tkSum')).includes('9 controles'), 'ticket: resumen con tablero, control y autoevaluación');
const [dl] = await Promise.all([page.waitForEvent('download'), click('#tkDl')]);
const body = fs.readFileSync(await dl.path(), 'utf8');
ok(body.includes('una afirmación corregida') && body.includes('Roles en la feria') && body.includes('Terminar las diapositivas'), 'ticket: el registro trae mejora, roles y meta');
ok((await text('#tkNotice')).includes('Feria de Autocuidado Informado'), 'aviso de la clase 28 (feria)');
await shot('s14-done');

// movimiento reducido
await page.evaluate(() => document.activeElement?.blur()); await page.keyboard.press('m'); await go(5, 800);
ok(await page.evaluate(() => document.body.classList.contains('reduced')), 'M activa movimiento reducido');
await page.keyboard.press('m');

console.log(errors.length ? errors.join('\n') : 'sin errores de consola');
console.log(fails ? `${fails} comprobación(es) fallaron` : 'todas las comprobaciones pasaron');
await browser.close();
process.exit(fails ? 1 : 0);
