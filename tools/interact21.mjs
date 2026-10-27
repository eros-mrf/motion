// Prueba de interacciones · Clase 21. Uso: node tools/interact21.mjs [carpeta-salida]
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const out = process.argv[2] || 'shots-interact21';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errors = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
let fails = 0;
const ok = (c, msg) => { if (!c) { fails++; console.log('✗', msg); } else console.log('✓', msg); };
const go = async (n, ms = 2600) => { await page.evaluate((k) => window.__deck.deck.go(k), n); await page.waitForTimeout(ms); };
const shot = (n) => page.screenshot({ path: `${out}/${n}.png` });
const text = (sel) => page.textContent(sel);

await page.goto('file://' + path.resolve('clase-21.html') + '#1');
await page.waitForTimeout(3000);

await page.keyboard.press('ArrowRight'); await page.waitForTimeout(2000);
ok((await page.evaluate(() => window.__deck.deck.index)) === 1, 'flecha → avanza (cortina de cristal)');
await shot('after-pane');
await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(2000);
ok((await page.evaluate(() => window.__deck.deck.index)) === 0, 'flecha ← vuelve');
await page.keyboard.press('n'); await page.waitForTimeout(600);
ok(await page.isVisible('#notes'), 'N abre las notas'); await page.keyboard.press('n');
await page.keyboard.press('g'); await page.waitForTimeout(700);
ok(await page.isVisible('#menu'), 'G abre el índice'); await shot('menu'); await page.keyboard.press('Escape');

// 3 · dos mensajes
await go(2);
await page.click('.msgcard[data-m="abs"]'); await page.click('#msgAnalyze'); await page.waitForTimeout(1500);
ok((await text('#twoFb')).includes('Veamos'), 'dos mensajes: elegir A recibe corrección');
ok((await page.locator('.bubble mark').count()) === 6, 'dos mensajes: 6 frases marcadas');
await shot('s03');
await page.click('.msgcard[data-m="pru"]'); await page.click('#msgAnalyze'); await page.waitForTimeout(900);
ok((await text('#twoFb')).includes('¡Bien!'), 'dos mensajes: elegir B es correcto');

// 4 · burbujas
await go(3);
await page.click('.orb[data-i="2"]'); await page.waitForTimeout(1800);
ok((await text('#qTag')).includes('PREGUNTA 3'), 'burbujas: pregunta 3');
ok((await text('#qIdea')).includes('absoluto'), 'burbujas: la idea se escribe');

// 5 · mazo
await go(4);
await page.click('.dcard:nth-child(1)'); await page.waitForTimeout(1000);
await page.click('#dReview'); await page.waitForTimeout(1200);
ok((await text('#dKnown')) === '0', 'mazo: «Repasar» no suma');
for (let k = 0; k < 8; k++) { await page.click('#dKnow'); await page.waitForTimeout(950); }
ok((await text('#dKnown')) === '8', 'mazo: 8 de 8 aprendidas');
await shot('s05-done');

// 6 · E-R-L 3D
await go(5, 3500);
await shot('s06-E');
await page.click('#erlNext'); await page.waitForTimeout(2200);
await shot('s06-R');
await page.click('#erlNext'); await page.waitForTimeout(3000);
ok(await page.evaluate(() => window.__deck.three.erl.step) === 2, 'E-R-L: la escena 3D está en el paso L');
ok((await text('#erlFinalTxt')).includes('no reemplaza'), 'E-R-L: el mensaje final reúne las tres piezas');
await shot('s06-L');
await page.click('#erlSteps button[data-i="0"]'); await page.waitForTimeout(800);
ok((await page.locator('#erlSteps button.on').textContent()).startsWith('E'), 'E-R-L: volver a E');

// 7 · balanza
await go(6);
await page.click('#evPicks .pk[data-i="0"]'); await page.click('#wdPicks .pk[data-i="3"]'); await page.waitForTimeout(1500);
ok((await text('#balVerdict')).includes('Sobre-afirma'), 'balanza: absoluto con evidencia débil sobre-afirma');
await shot('s07-over');
await page.click('#evPicks .pk[data-i="1"]'); await page.click('#wdPicks .pk[data-i="1"]'); await page.waitForTimeout(1500);
ok((await text('#balVerdict')).includes('Ajustado'), 'balanza: evidencia moderada + «puede reducir» queda ajustado');
await shot('s07-ok');

// 8 · deslizar
await go(7);
const ans = ['decide', 'informa', 'decide', 'informa', 'decide', 'informa'];
// la primera con arrastre real
const card = page.locator('.scard').first(); const bb = await card.boundingBox();
await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.mouse.down();
await page.mouse.move(bb.x - 320, bb.y + bb.height / 2, { steps: 12 }); await page.mouse.up();
await page.waitForTimeout(1400);
ok((await text('#swScore')).startsWith('1 / 6 · 1'), 'deslizar: arrastrar a la izquierda acierta «decide por otro»');
for (let k = 1; k < 6; k++) { await page.click(ans[k] === 'informa' ? '#swR' : '#swL'); await page.waitForTimeout(1100); }
ok((await text('.scard p')).includes('6 de 6'), 'deslizar: 6 de 6');
await shot('s08-done');

// 9 · red 3D
await go(8, 3500);
await shot('s09-start');
for (const i of [0, 1, 2, 3]) { await page.click(`.ni[data-i="${i}"]`); await page.waitForTimeout(400); }
await page.waitForTimeout(1500);
ok((await text('#nSolidN')).startsWith('100'), 'red: 4 evidencias pertinentes → solidez 100 %');
await page.click('.ni[data-i="4"]'); await page.click('.ni[data-i="6"]'); await page.waitForTimeout(1800);
ok((await text('#nNoiseN')).startsWith('50'), 'red: 2 rumores → ruido 50 %');
await shot('s09-noise');

// 10 · taller
await go(9);
await page.click('#srcSents .ss[data-i="2"]'); await page.waitForTimeout(300);
ok((await page.locator('#srcSents .ss.done.irr').count()) === 1, 'taller: una frase irrelevante se tacha');
for (const i of [0, 1, 3]) { await page.click(`#srcSents .ss[data-i="${i}"]`); await page.waitForTimeout(300); }
await page.waitForTimeout(800);
ok(await page.isEnabled('#toWrite'), 'taller: con la evidencia pertinente se habilita «Redactar»');
ok(!(await page.isHidden('#caseKey')), 'taller: aparece la idea clave');
await shot('s10');
await page.click('#caseTabs button[data-i="1"]'); await page.waitForTimeout(1200);
await shot('s10-B');
await page.click('#caseTabs button[data-i="0"]'); await page.waitForTimeout(600);
await page.click('#toWrite'); await page.waitForTimeout(2800);
ok((await page.evaluate(() => window.__deck.deck.index)) === 10, 'taller: «Redactar» lleva al redactor');
ok((await page.locator('.evc').count()) === 3, 'redactor: llegan las 3 evidencias elegidas');

// 11 · redactor
await page.fill('#fE', 'Según el Ministerio de Salud, muchas ITS pueden no dar síntomas perceptibles.');
await page.fill('#fR', 'Consultar y realizar controles cuando corresponde ayuda a cuidar la salud, aunque te sientas bien.');
await page.fill('#fL', 'Es información general y no reemplaza la orientación de un profesional.');
await page.waitForTimeout(900);
const cls = await page.$$eval('#crits .cr', (els) => els.map((e) => e.className));
ok(cls.every((c) => c.includes(' g')), 'redactor: mensaje modelo → 4 criterios en verde');
await shot('s11-good');
await page.fill('#fR', 'Todos deben hacerse el examen siempre, esa gente irresponsable nunca se cuida.');
await page.waitForTimeout(600);
const cls2 = await page.$$eval('#crits .cr', (els) => els.map((e) => e.className));
ok(cls2[0].includes(' r') && cls2[2].includes(' r'), 'redactor: absoluto y estigma → rojo');
await page.click('#wModel'); await page.waitForTimeout(500);
await shot('s11-bad');
await page.fill('#fR', ''); await page.click('.starters[data-s="R"] .st >> nth=0'); await page.waitForTimeout(300);
ok((await page.inputValue('#fR')).startsWith('Conversar'), 'redactor: las frases iniciales se insertan');

// 12 · galería
await go(11);
await page.click('.gc[data-i="1"]'); await page.click('.gcr[data-k="correcto"]'); await page.click('.gstem[data-k="mejora"]');
await page.fill('#gText', 'Podría mejorar si dijera que no todas las ITS se curan con antibióticos.');
await page.waitForTimeout(300);
await page.click('#gPost'); await page.waitForTimeout(1200);
ok((await text('#gNote')).includes('Buena elección'), 'galería: el criterio coincide con el más débil');
for (const [i, k] of [[0, 'verificable'], [2, 'respetuoso'], [3, 'verificable']]) {
  await page.click(`.gc[data-i="${i}"]`); await page.click(`.gcr[data-k="${k}"]`); await page.click('.gstem[data-k="ok"]');
  await page.fill('#gText', 'Me ayudó que el mensaje sea claro y respetuoso con las personas.'); await page.click('#gPost'); await page.waitForTimeout(500);
}
ok((await text('#gScore')) === '4', 'galería: 4 comentarios');
await shot('s12-done');

// 13 · puesta en común
await go(12);
await page.click('#shTabs button[data-i="2"]'); await page.waitForTimeout(900);
for (const [s, o] of [[0, 0], [1, 0], [2, 0], [3, 0]]) { await page.click(`#shMain .opts button[data-s="${s}"][data-o="${o}"]`); await page.waitForTimeout(300); }
await page.waitForTimeout(1200);
ok((await page.locator('.shc.on').count()) === 4, 'puesta en común: mensaje mejorado cumple los 4 criterios');
await shot('s13-improved');

// 14 · ticket
await go(13);
await page.click('#bankA .word[data-i="0"]'); await page.click('#bankB .word[data-i="1"]'); await page.waitForTimeout(500);
ok((await text('#ticketFb')).includes('Eso es'), 'ticket: respuesta correcta');
await page.click('#bankB .word[data-i="2"]'); await page.waitForTimeout(300);
ok((await text('#ticketFb')).includes('Revisemos'), 'ticket: opción no válida advertida');
await page.click('#bankB .word[data-i="2"]');
for (const i of [0, 1, 2, 3]) await page.click(`#selfList button[data-i="${i}"]`);
await page.waitForTimeout(700);
await shot('s14-done');
await page.keyboard.press('m'); await page.waitForTimeout(300);
ok(await page.evaluate(() => document.body.classList.contains('reduced')), 'M activa movimiento reducido');

console.log(errors.length ? 'CONSOLA:\n' + errors.join('\n') : 'sin errores de consola');
console.log(fails ? `${fails} comprobaciones fallaron` : 'todas las comprobaciones pasaron');
await browser.close();
process.exit(fails ? 1 : 0);
