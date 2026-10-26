// Prueba de interacciones · Clase 19. Uso: node tools/interact19.mjs [carpeta-salida]
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const out = process.argv[2] || 'shots-interact19';
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

await page.goto('file://' + path.resolve('clase-19.html') + '#1');
await page.waitForTimeout(3000);

await page.keyboard.press('ArrowRight'); await page.waitForTimeout(1500);
ok((await page.evaluate(() => window.__deck.deck.index)) === 1, 'flecha → avanza (con persiana de transición)');
await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(1500);
ok((await page.evaluate(() => window.__deck.deck.index)) === 0, 'flecha ← vuelve');
await page.keyboard.press('n'); await page.waitForTimeout(600);
ok(await page.isVisible('#notes'), 'N abre las notas del docente'); await page.keyboard.press('n');
await page.keyboard.press('g'); await page.waitForTimeout(700);
ok(await page.isVisible('#menu'), 'G abre el índice'); await shot('menu'); await page.keyboard.press('Escape');

// 3 · anatomía + checklist
await go(2);
await page.click('.hot.h2'); await page.waitForTimeout(700);
ok((await text('#anatInfo')).includes('actualizada'), 'anatomía: el punto 2 explica la vigencia');
for (const f of [1, 2]) for (const k of ['inst', 'date', 'purp']) await page.click(`.gck[data-f="${f}"][data-k="${k}"]`);
await page.waitForTimeout(900);
ok(await page.evaluate(() => document.querySelector('.gate').classList.contains('open')), 'checklist: 6/6 abre el candado');
await shot('s03-open');

// 4 · preguntas
await go(3);
await page.click('#qList button[data-i="2"]'); await page.waitForTimeout(1800);
ok((await text('#qTag')) === 'consulta_3.txt', 'preguntas: consulta_3 en la consola');
ok((await text('#qIdea')).includes('Leer'), 'preguntas: la pista se escribe sola');
await shot('s04-q3');

// 5 · vocabulario
await go(4);
await page.click('.vc:nth-child(2)'); await page.fill('#vq', 'fuente'); await page.waitForTimeout(600);
ok((await page.locator('.vc.dim').count()) > 0 && (await page.locator('.vc.open').count()) > 0, 'vocabulario: el buscador filtra y abre');
await shot('s05-search');

// 6 · biblioteca 3D
await go(5, 3500);
const rightVerdict = { minsal: 'use', curric: 'use', oms: 'use', univ: 'care', noticia: 'care', blog: 'drop', social: 'drop', foro: 'drop' };
const ids = Object.keys(rightVerdict);
for (let i = 0; i < ids.length; i++) {
  await page.evaluate((k) => window.__deck.three.lib.select(k), i);
  await page.waitForTimeout(i === 0 ? 1400 : 250);
  if (i === 0) {
    for (const k of ['inst', 'date', 'purp']) await page.click(`.chk[data-k="${k}"]`);
    await page.waitForTimeout(300); await shot('s06-checks');
  }
  await page.click(`.dec[data-d="${rightVerdict[ids[i]]}"]`);
  if (i === 0) await page.waitForTimeout(500);
}
await page.waitForTimeout(800);
ok((await text('#libScore')).includes('8 / 8 · aciertos 8'), 'biblioteca: 8/8 fuentes auditadas, 8 aciertos');
await page.evaluate(() => window.__deck.three.lib.select(5)); await page.waitForTimeout(1500);
await shot('s06-done');

// 7 · búsqueda
await go(6);
for (const id of ['name', 'minsal', 'trans', 'prev']) await page.click(`.kc[data-id="${id}"]`);
await page.waitForTimeout(1500);
const prec = await page.evaluate(() => parseFloat(document.querySelector('#precBar').style.width));
const cnt = await text('#qCount');
ok(prec >= 66, `búsqueda: precisión ${prec}% con palabras clave oficiales`);
ok(parseInt(cnt.replace(/\./g, '')) < 12400000, `búsqueda: resultados bajan a ${cnt}`);
await shot('s07-query');

// 8 · síntesis
await go(7);
for (const i of [1, 2, 4]) await page.click(`.sent[data-i="${i}"]`);
await page.click('.sent[data-i="0"]');
await page.waitForTimeout(2800);
ok((await page.locator('.slot.full').count()) === 3, 'síntesis: 3 ideas centrales acopladas');
ok(await page.evaluate(() => document.querySelector('.sent[data-i="0"]').classList.contains('ctx')), 'síntesis: la oración de contexto se marca');
await page.click('#modePara'); await page.waitForTimeout(1400);
ok((await text('#gSimN')) === '24%', 'síntesis: parafrasear baja la similitud a 24%');
await shot('s08-done');

// 9 · agentes 3D
await go(8, 3500);
await page.click('.a-tabs button[data-m="both"]'); await page.waitForTimeout(1800);
const vis = await page.evaluate(() => [...document.querySelectorAll('.pin')].filter((p) => +p.style.opacity === 1).length);
ok(vis === 5, `agentes: comparar muestra ${vis}/5 puntos`);
await shot('s09-both');
await page.click('.a-tabs button[data-m="bacteria"]'); await page.waitForTimeout(1800);
await shot('s09-bacteria');

// 10 · roles
await go(9);
await page.click('#dealBtn'); await page.waitForTimeout(2200);
const seats = await page.evaluate(() => [...document.querySelectorAll('.role .seat')].map((s) => s.textContent).sort());
ok(seats.join() === 'Nº 1,Nº 2,Nº 3,Nº 4,Nº 5,Nº 6', 'roles: 6 puestos sorteados sin repetir');
await shot('s10-deal');

// 11 · ficha 3D
await go(10, 3200);
await page.click('#fDemo'); await page.waitForTimeout(9500);
ok((await text('#fCount')) === '9/9', 'ficha: el ejemplo completa 9/9 campos');
await shot('s11-complete');
await page.click('#fClear'); await page.waitForTimeout(1200);
ok((await text('#fCount')) === '0/9', 'ficha: limpiar vuelve a 0/9');
await page.fill('.fld[data-id="agente"] textarea', 'Bacteria llamada clamidia que se trata con antibióticos');
await page.click('.fld[data-id="agente"] .sc[data-s="F1"]'); await page.waitForTimeout(1800);
ok((await text('#fCount')) === '1/9', 'ficha: texto + fuente (F1) completa un campo');
await shot('s11-one');

// 12 · radar de calidad
await go(11);
for (let i = 0; i < 8; i++) await page.click(`.qci[data-i="${i}"]`);
await page.waitForTimeout(2200);
ok((await text('#verdict')).includes('8/8'), 'calidad: 8/8 → lista para entregar');
await shot('s12-done');

// 13 · duelo
await go(12);
const correct = [2, 1, 2];
for (let r = 0; r < 3; r++) {
  await page.click(`.opt[data-i="${correct[r]}"]`); await page.waitForTimeout(500);
  if (r === 0) await shot('s13-reveal');
  await page.click('#duelNext'); await page.waitForTimeout(900);
}
ok((await text('#duelFb')).includes('3 de 3'), 'duelo: 3 de 3 aciertos');
await shot('s13-end');

// 14 · ticket
await go(13);
await page.click('#bankSrc .word:nth-child(1)'); await page.click('#bankWhy .word:nth-child(1)'); await page.waitForTimeout(500);
ok((await text('#ticketFb')).includes('Listo'), 'ticket: frase completa con las opciones');
for (const i of [0, 1, 2, 3]) await page.click(`#selfList button[data-i="${i}"]`);
await page.waitForTimeout(600);
await shot('s14-done');

await page.keyboard.press('m'); await page.waitForTimeout(300);
ok(await page.evaluate(() => document.body.classList.contains('reduced')), 'M activa movimiento reducido');

console.log(errors.length ? 'CONSOLA:\n' + errors.join('\n') : 'sin errores de consola');
console.log(fails ? `${fails} comprobaciones fallaron` : 'todas las comprobaciones pasaron');
await browser.close();
process.exit(fails ? 1 : 0);
