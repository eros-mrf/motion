// Prueba de interacciones · Clase 25. Uso: node tools/interact25.mjs [carpeta-salida]
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const out = process.argv[2] || 'shots-interact25';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, acceptDownloads: true });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
let fails = 0;
const ok = (c, msg) => { if (!c) { fails++; console.log('✗', msg); } else console.log('✓', msg); };
const go = async (n, ms = 2600) => { await page.evaluate((k) => window.__deck.deck.go(k), n); await page.waitForTimeout(ms); };
const shot = (n) => page.screenshot({ path: `${out}/${n}.png` });
const text = (sel) => page.textContent(sel);
const click = (sel) => page.locator(sel).first().click();

await page.goto('file://' + path.resolve('clase-25.html') + '#1');
await page.evaluate(() => localStorage.clear());
await page.reload(); await page.waitForTimeout(3200);

await page.keyboard.press('ArrowRight'); await page.waitForTimeout(2200);
ok((await page.evaluate(() => window.__deck.deck.index)) === 1, 'flecha → avanza (mosaico de cuadrícula)');
await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(2200);
ok((await page.evaluate(() => window.__deck.deck.index)) === 0, 'flecha ← vuelve');
await page.keyboard.press('n'); await page.waitForTimeout(600);
ok(await page.isVisible('#notes'), 'N abre las notas'); await page.keyboard.press('n');
await page.keyboard.press('g'); await page.waitForTimeout(700);
ok(await page.isVisible('#menu'), 'G abre el índice'); await shot('menu'); await page.keyboard.press('Escape');

// 3 · productos
await go(2);
await click('#lensBtns button[data-k="evid"]'); await page.waitForTimeout(300);
ok(await page.evaluate(() => document.querySelector('#posterA').classList.contains('lens-evid')), 'lupa: resalta la evidencia en los dos productos');
ok((await text('#lensCap')).includes('gráfico simple'), 'lupa: explica lo que muestra el producto B');
await click('#voteA'); await page.waitForTimeout(300);
ok((await text('#voteFb')).includes('Mira otra vez'), 'votar A recibe pista');
ok(await page.evaluate(() => getComputedStyle(document.querySelector('#critBox')).pointerEvents) === 'none', 'criterios bloqueados hasta acertar');
await click('#voteB'); await page.waitForTimeout(900);
ok((await text('#voteFb')).includes('B enseña mejor'), 'votar B es correcto');
await page.click('.cchip[data-id="deco"]'); await page.click('.cchip[data-id="evid"]'); await page.click('.cchip[data-id="fuente"]'); await page.waitForTimeout(300);
ok((await text('#critFb')).includes('Cambia la marcada'), 'criterio trampa marcado en rojo');
await page.click('.cchip[data-id="deco"]'); await page.click('.cchip[data-id="claro"]'); await page.waitForTimeout(600);
ok((await text('#critFb')).includes('Tres criterios'), 'tres criterios válidos');
await shot('s03-done');

// 4 · preguntas
await go(3);
await page.click('.note[data-i="0"]'); await page.waitForTimeout(300);
ok(await page.isEnabled('#qAns'), 'preguntas: la nota habilita la respuesta');
await page.fill('#qAns', 'Que entiendan una idea central.'); await page.waitForTimeout(300);
ok((await text('#qCount')).startsWith('1 de 5'), 'preguntas: respuesta contada');
await page.click('.note[data-i="3"]'); await page.fill('#qAns', 'Se difunden mitos sin verificar.'); await page.waitForTimeout(300);
ok((await text('#qCount')).startsWith('2 de 5'), 'preguntas: segunda respuesta');
await shot('s04-done');

// 5 · vocabulario (arrastrar y tocar)
await go(4);
await page.click('.vchip[data-i="0"]'); await page.click('.vrow[data-i="1"] .vdef'); await page.waitForTimeout(500);
ok((await text('#vErr')) === '1', 'vocabulario: un error cuenta');
// arrastre real
const chipBox = await page.locator('.vchip[data-i="2"]').boundingBox();
const dropBox = await page.locator('.vrow[data-i="2"] .vdrop').boundingBox();
await page.mouse.move(chipBox.x + chipBox.width / 2, chipBox.y + chipBox.height / 2); await page.mouse.down();
await page.mouse.move(dropBox.x + dropBox.width / 2, dropBox.y + dropBox.height / 2, { steps: 12 }); await page.mouse.up(); await page.waitForTimeout(700);
ok((await text('#vOk')) === '1', 'vocabulario: arrastrar un término a su definición');
for (let i = 0; i < 8; i++) { if (i === 2) continue; await page.click(`.vchip[data-i="${i}"]`); await page.click(`.vrow[data-i="${i}"] .vdef`); await page.waitForTimeout(150); }
await page.waitForTimeout(700);
ok((await text('#vOk')) === '8', 'vocabulario: 8 de 8');
ok((await text('#vFb')).includes('completo'), 'vocabulario: mensaje final');
await shot('s05-done');

// 6 · capas
await go(5, 3500);
for (let i = 0; i < 5; i++) { await click('#layNext'); await page.waitForTimeout(1100); }
await page.waitForTimeout(2300);
ok((await page.locator('#layList li.done').count()) === 5, 'capas: 5 capas agregadas');
ok((await text('#layName')).includes('armada'), 'capas: la diapositiva se arma');
await shot('s06-done');

// 7 · rúbrica
await go(6);
ok((await text('#mineBox')).includes('Coinciden con'), 'rúbrica: compara con los criterios de la activación');
const MAP = [['síntomas', 'exactitud'], ['Al pie', 'fuentes'], ['gráfico de barras', 'visual'], ['recomendación general', 'autocuidado'], ['una sola idea', 'claridad'], ['cinco personas', 'participacion']];
await page.click('.rubc[data-id="claridad"]'); await page.waitForTimeout(400);
for (let k = 0; k < 6; k++) {
  const t = await text('#stText'); const id = MAP.find(([w]) => t.includes(w))[1];
  await page.click(`.rubc[data-id="${id}"]`); await page.waitForTimeout(1500);
}
ok((await text('#stNum')).includes('COMPLETAS'), 'rúbrica: seis frases clasificadas');
await shot('s07-done');

// 8 · tema y audiencia
await go(7);
await page.click('.tcard[data-id="8"]'); await page.click('.achip[data-i="0"]'); await page.waitForTimeout(300);
ok((await text('#guardFb')).includes('Confirma'), 'tema: pide confirmar el resguardo');
for (const c of await page.locator('.gck').all()) await c.check();
await page.waitForTimeout(500);
ok((await text('#guardFb')).includes('Tema fijado'), 'tema: tema fijado');
await shot('s08-done');

// 9 · ficha
await go(8);
await page.fill('#fQ', '¿Es malo?'); await page.waitForTimeout(300);
ok((await page.locator('.sm.r').count()) >= 1, 'ficha: semáforo marca una pregunta de sí/no');
await click('#fExample'); await page.waitForTimeout(700);
ok((await page.inputValue('#fQ')).includes('transmiten'), 'ficha: ejemplo del tema');
ok((await page.locator('.sm.g').count()) === 4, 'ficha: semáforo en verde');
ok((await text('#fPct')).includes('100'), 'ficha: 100 % completa');
await shot('s09-done');

// 10 · fuentes
await go(9);
for (const card of await page.locator('.scard').all()) { const cat = await card.getAttribute('data-cat'); await card.locator(`.yn button[data-c="${cat}"]`).click(); await page.waitForTimeout(80); }
ok((await text('#srcOk')) === '9', 'fuentes: 9 clasificadas');
await page.locator('.scard[data-cat="P"] .star').nth(0).click(); await page.locator('.scard[data-cat="P"] .star').nth(1).click(); await page.waitForTimeout(400);
ok((await text('#srcInst')) === '2', 'fuentes: dos institucionales previstas');
await page.locator('.scard[data-cat="P"] .star').nth(2).click({ force: true }); await page.waitForTimeout(200);
ok((await text('#srcInst')) === '2', 'fuentes: no permite una tercera');
await shot('s10-done');

// 11 · siete diapositivas
await go(10, 3500);
await page.fill('.srow:nth-child(1) input', 'hola'); await page.waitForTimeout(200);
ok((await page.locator('.srow.warn').count()) === 1, 'siete: oración inválida marcada con aviso');
for (const b of await page.locator('.srow button').all()) { await b.click(); await page.waitForTimeout(80); }
await page.waitForTimeout(900);
ok((await page.locator('.srow.ok').count()) === 7, 'siete: las 7 oraciones cumplen el criterio');
await shot('s11-done');

// 12 · roles
await go(11);
ok((await text('#roleFb')).includes('Faltan 6'), 'roles: faltan 6');
const rb = await page.locator('.rcell .rchip[data-id="inv"]').boundingBox();
const pb = await page.locator('.person[data-p="0"]').boundingBox();
await page.mouse.move(rb.x + rb.width / 2, rb.y + rb.height / 2); await page.mouse.down();
await page.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2, { steps: 12 }); await page.mouse.up(); await page.waitForTimeout(600);
ok((await page.locator('.person[data-p="0"] .rchip').count()) === 1, 'roles: arrastrar un rol a una persona');
const ROLES = ['inv', 'red', 'dis', 'fue', 'gra', 'exp'], ASSIGN = [0, 0, 1, 2, 3, 3];
for (let i = 1; i < 6; i++) { await page.click(`.rcell .rchip[data-id="${ROLES[i]}"]`); await page.click(`.person[data-p="${ASSIGN[i]}"] .got`); await page.waitForTimeout(250); }
ok((await text('#roleFb')).includes('bien distribuidos'), 'roles: bien distribuidos');
await shot('s12-ok');
await page.click('#teamMinus'); await page.waitForTimeout(400);
ok((await text('#roleFb')).includes('Faltan'), 'roles: al quitar un integrante vuelven sus roles');
await page.click('#teamPlus'); await page.waitForTimeout(300);
await page.click('.rcell .rchip[data-id="gra"]'); await page.click('.person[data-p="3"] .got'); await page.click('.rcell .rchip[data-id="exp"]'); await page.click('.person[data-p="3"] .got'); await page.waitForTimeout(400);
ok((await text('#roleFb')).includes('bien distribuidos'), 'roles: se restablece con 4 integrantes');

// 13 · pitch
await go(12, 3800);
ok((await text('#gate')).includes('Pasa a la fase de computación'), 'pitch: pasa a computación');
ok((await text('#pitchText')).includes('¿Cómo se transmiten'), 'pitch: guion con la pregunta central');
await click('#pStart'); await page.waitForTimeout(2300);
ok((await text('#pClock')) !== '00:30', 'pitch: corre el cronómetro de 30 s');
ok((await page.locator('.pw.on').count()) > 0, 'pitch: karaoke resalta palabras');
await click('#pPrec'); await page.waitForTimeout(500);
ok(!(await text('#precText')).includes('Pulsa el botón'), 'pitch: pregunta de precisión');
await shot('s13-done');

// 14 · ticket
await go(13);
ok((await text('#planSum')).includes('ITS'), 'plan: resumen con el tema');
await page.fill('#tA', 'las vías reales de transmisión de las ITS'); await page.fill('#tB', 'un esquema y fuentes institucionales como MINSAL'); await page.waitForTimeout(500);
ok((await text('#ticketFb')).includes('Ticket completo'), 'ticket completo');
const dl = page.waitForEvent('download');
await click('#planDl');
const d = await dl;
ok(d.suggestedFilename().includes('plan-maestro'), 'descarga del plan (.txt)');
for (const c of await page.locator('.s-end .check input').all()) await c.check();
await page.waitForTimeout(900);
await shot('s14-done');

// movimiento reducido
await page.evaluate(() => document.activeElement?.blur()); await page.keyboard.press('m'); await go(5, 1500);
ok(await page.evaluate(() => document.body.classList.contains('reduced')), 'M activa movimiento reducido');
await page.keyboard.press('m');

console.log(errors.length ? errors.join('\n') : 'sin errores de consola');
console.log(fails ? `${fails} comprobación(es) fallaron` : 'todas las comprobaciones pasaron');
await browser.close();
process.exit(fails ? 1 : 0);
