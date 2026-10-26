// Prueba de interacciones · Clase 20. Uso: node tools/interact20.mjs [carpeta-salida]
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const out = process.argv[2] || 'shots-interact20';
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

await page.goto('file://' + path.resolve('clase-20.html') + '#1');
await page.waitForTimeout(3000);
await shot('s01');

await page.keyboard.press('ArrowRight'); await page.waitForTimeout(1800);
ok((await page.evaluate(() => window.__deck.deck.index)) === 1, 'flecha → avanza (iris de tinta)');
await shot('iris-after');
await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(1800);
ok((await page.evaluate(() => window.__deck.deck.index)) === 0, 'flecha ← vuelve');
await page.keyboard.press('n'); await page.waitForTimeout(600);
ok(await page.isVisible('#notes'), 'N abre las notas'); await page.keyboard.press('n');
await page.keyboard.press('g'); await page.waitForTimeout(700);
ok(await page.isVisible('#menu'), 'G abre el índice'); await shot('menu'); await page.keyboard.press('Escape');

// 3 · titular rápido
await go(2);
await page.click('.opt[data-i="0"]'); await page.waitForTimeout(300);
ok(!(await page.isDisabled('#revealBtn')), 'titular: elegir habilita «Revelar»');
await page.click('#revealBtn'); await page.waitForTimeout(1800);
ok((await text('#guessFb')).includes('Cuidado'), 'titular: la opción alarmista recibe advertencia');
ok(await page.isVisible('#ctxBox'), 'titular: aparece «misma forma, otro contexto»');
await page.click('#ctxTabs button[data-i="1"]'); await page.waitForTimeout(1200);
ok((await text('#ctxRead')).includes('esperar'), 'titular: cambia el contexto');
await shot('s03-reveal');

// 4 · preguntas
await go(3);
await page.click('.fcard[data-i="3"]'); await page.waitForTimeout(1800);
ok((await text('#npTag')).includes('PISTA 4'), 'preguntas: pista 4');
ok((await text('#npText')).includes('dibujo'), 'preguntas: la pista se escribe');
await shot('s04');

// 5 · vocabulario (emparejar)
await go(4);
const pairs = await page.evaluate(() => [...document.querySelectorAll('#mTerms .term')].map((t) => t.dataset.i));
await page.click('#mTerms .term[data-i="0"]'); await page.click('#mDefs .def[data-i="1"]'); await page.waitForTimeout(600);
ok((await text('#mScore')) === '0', 'vocabulario: un par incorrecto no suma');
for (const i of pairs) { await page.click(`#mTerms .term[data-i="${i}"]`); await page.click(`#mDefs .def[data-i="${i}"]`); }
await page.waitForTimeout(1500);
ok((await text('#mScore')) === '10', 'vocabulario: 10/10 pares');
await shot('s05-done');

// 6 · gráfico 3D F-V-D-I
await go(5, 3500);
for (const k of [1, 2, 3]) { await page.click(`#fvSteps button[data-i="${k}"]`); await page.waitForTimeout(1900); if (k === 2) await shot('s06-D'); }
await shot('s06-I');
ok((await page.locator('#fvSteps button.on').textContent()).startsWith('I'), 'F-V-D-I: llega al paso I');
ok(await page.evaluate(() => window.__deck.three.chart.step) === 3, 'F-V-D-I: la escena 3D está en el paso 3');
await page.click('#fvNext'); await page.waitForTimeout(800);
ok((await page.locator('#fvSteps button.on').textContent()).startsWith('F'), 'F-V-D-I: «volver a F» reinicia');

// 7 · describir vs inferir
await go(6);
const ans = ['describe', 'describe', 'infiere', 'infiere', 'describe', 'infiere'];
for (let i = 0; i < 6; i++) await page.click(`.st[data-i="${i}"] .btns button[data-a="${ans[i]}"]`);
await page.waitForTimeout(900);
ok((await text('#descScore')).includes('6 aciertos'), 'describir: 6 de 6');
await shot('s07-done');

// 8 · titulares
await go(7);
await page.click('.chip-opt[data-s="0"][data-o="0"]'); await page.click('.chip-opt[data-s="1"][data-o="0"]'); await page.click('.chip-opt[data-s="2"][data-o="0"]'); await page.click('.chip-opt[data-s="3"][data-o="2"]');
await page.waitForTimeout(900);
ok((await text('#frontStamp')) === 'SENSACIONALISTA', 'titular: combinación alarmista → SENSACIONALISTA');
await shot('s08-bad');
await page.click('.chip-opt[data-s="0"][data-o="1"]'); await page.click('.chip-opt[data-s="1"][data-o="2"]'); await page.click('.chip-opt[data-s="2"][data-o="1"]'); await page.click('.chip-opt[data-s="3"][data-o="3"]');
await page.waitForTimeout(1200);
ok((await text('#frontStamp')) === 'RESPONSABLE', 'titular: combinación precisa → RESPONSABLE');
await shot('s08-good');

// 9 · comparación justa 3D
await go(8, 3500);
await shot('s09-total');
await page.click('.mode-sw button[data-m="rate"]'); await page.waitForTimeout(2600);
ok((await text('.dc:nth-child(2) [data-big]')) === '8', 'comparación: por 1.000 → Sur = 8');
await shot('s09-rate');
await page.click('.fo[data-i="2"]'); await page.waitForTimeout(500);
ok((await text('#fairFb')).includes('No se sostiene'), 'comparación: «Norte más afectado» no se sostiene');

// 10 · laboratorio
await go(9);
for (const [k, o] of [['fuente', 0], ['poblacion', 0], ['variables', 0]]) { await page.click(`.fo2[data-k="${k}"][data-o="${o}"]`); await page.waitForTimeout(250); }
await page.click('#labChart .bar-r[data-i="2"]'); await page.waitForTimeout(300);
ok((await text('#labHint')).includes('no es'), 'laboratorio: barra equivocada para el máximo');
await page.click('#labChart .bar-r[data-i="5"]'); await page.waitForTimeout(600);
await page.click('#labChart .bar-r[data-i="2"]'); await page.waitForTimeout(600);
await page.click('.fo2[data-k="tendencia"][data-o="1"]'); await page.waitForTimeout(250);
await page.click('.fo2[data-k="comparacion"][data-o="1"]'); await page.waitForTimeout(900);
ok((await text('#labCount')) === '7/7', 'laboratorio: ficha A 7/7');
await shot('s10-A');
await page.click('#labTabs button[data-i="1"]'); await page.waitForTimeout(1200);
ok((await text('#labCount')) === '0/7', 'laboratorio: gráfico B empieza vacío');
await shot('s10-B');

// 11 · conclusiones
await go(10);
const order = await page.evaluate(() => [...document.querySelectorAll('#trayCards .cc')].map((c) => c.dataset.i));
const KEYS = ['ok', 'maybe', 'no', 'ok', 'maybe', 'no'];
await page.click(`.cc[data-i="${order[0]}"]`); await page.click(`.bin[data-k="${KEYS[order[0]] === 'ok' ? 'no' : 'ok'}"]`); await page.waitForTimeout(500);
ok((await text('#cScore')) === '0', 'conclusiones: zona equivocada no suma');
await shot('s11-wrong');
await page.waitForTimeout(2600);
for (const i of order) { await page.click(`.cc[data-i="${i}"]`); await page.click(`.bin[data-k="${KEYS[i]}"]`); await page.waitForTimeout(250); }
await page.waitForTimeout(900);
ok((await text('#cScore')) === '6', 'conclusiones: 6 de 6 (clic en tarjeta y zona)');
await shot('s11-done');
// arrastrar de verdad
await page.click('#cReset'); await page.waitForTimeout(500);
const c0 = page.locator('#trayCards .cc').first();
const idx0 = +(await c0.getAttribute('data-i'));
const b0 = await c0.boundingBox();
const bin = page.locator(`.bin[data-k="${KEYS[idx0]}"]`); const bb = await bin.boundingBox();
await page.mouse.move(b0.x + b0.width / 2, b0.y + b0.height / 2); await page.mouse.down();
await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 12 }); await page.mouse.up();
await page.waitForTimeout(1200);
ok((await text('#cScore')) === '1', 'conclusiones: arrastrar una tarjeta a su zona suma');

// 12 · titular de 15 palabras
await go(11);
await page.fill('#wText', '¡Alarma! Las consultas se disparan por culpa de los jóvenes');
await page.waitForTimeout(300);
ok((await page.getAttribute('#cA', 'class')).includes(' r') && (await page.getAttribute('#cC', 'class')).includes(' r'), 'redacción: alarma y causa inventada en rojo');
await shot('s12-bad');
await page.fill('#wText', 'Consultas preventivas aumentaron de 42 a 58 por cada 1.000 jóvenes entre 2018 y 2023');
await page.waitForTimeout(300);
const cls = await Promise.all(['#cP', '#cA', '#cC', '#cL'].map((s) => page.getAttribute(s, 'class')));
ok(cls.every((c) => c.includes(' g')), 'redacción: titular modelo → todo verde');
await page.click('#wModel'); await page.waitForTimeout(500);
await shot('s12-good');

// 13 · caza de palabras 3D
await go(12, 3500);
await shot('s13-start');
const toks = await page.evaluate(() => [...document.querySelectorAll('.wd')].map((w) => w.textContent));
for (const w of ['¡Alarma!', 'disparan', 'culpa']) await page.locator('.wd', { hasText: new RegExp('^' + w.replace('!', '\\!') + '$') }).click({ force: true });
await page.click('#hCheck'); await page.waitForTimeout(1200);
ok((await text('#hRes')).includes('Exacto'), 'palabras: titular 1 marcado correctamente');
await shot('s13-checked');
await page.click('#hTabs button[data-i="1"]'); await page.waitForTimeout(1500);
await page.click('#hCheck'); await page.waitForTimeout(700);
ok((await text('#hRes')).includes('Exacto'), 'palabras: titular responsable sin marcas es correcto');

// 14 · ticket
await go(13);
await page.click('#bankA .word[data-i="0"]'); await page.click('#bankB .word[data-i="0"]'); await page.waitForTimeout(500);
ok((await text('#ticketFb')).includes('Eso es'), 'ticket: respuesta correcta');
await page.click('#bankB .word[data-i="3"]'); await page.waitForTimeout(400);
ok((await text('#ticketFb')).includes('Revisemos'), 'ticket: «la causa segura» es advertida');
await page.click('#bankB .word[data-i="3"]');
for (const i of [0, 1, 2, 3]) await page.click(`#selfList button[data-i="${i}"]`);
await page.waitForTimeout(700);
await shot('s14-done');

await page.keyboard.press('m'); await page.waitForTimeout(300);
ok(await page.evaluate(() => document.body.classList.contains('reduced')), 'M activa movimiento reducido');

console.log(errors.length ? 'CONSOLA:\n' + errors.join('\n') : 'sin errores de consola');
console.log(fails ? `${fails} comprobaciones fallaron` : 'todas las comprobaciones pasaron');
await browser.close();
process.exit(fails ? 1 : 0);
