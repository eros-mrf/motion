// Prueba de interacciones · Clase 22. Uso: node tools/interact22.mjs [carpeta-salida]
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const out = process.argv[2] || 'shots-interact22';
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
const click = (sel) => page.locator(sel).first().click();

await page.goto('file://' + path.resolve('clase-22.html') + '#1');
await page.waitForTimeout(3000);

await page.keyboard.press('ArrowRight'); await page.waitForTimeout(2200);
ok((await page.evaluate(() => window.__deck.deck.index)) === 1, 'flecha → avanza (barrido de radar)');
await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(2200);
ok((await page.evaluate(() => window.__deck.deck.index)) === 0, 'flecha ← vuelve');
await page.keyboard.press('n'); await page.waitForTimeout(600);
ok(await page.isVisible('#notes'), 'N abre las notas'); await page.keyboard.press('n');
await page.keyboard.press('g'); await page.waitForTimeout(700);
ok(await page.isVisible('#menu'), 'G abre el índice'); await shot('menu'); await page.keyboard.press('Escape');

// 3 · mapa rápido
await go(2, 3500);
await click('#mapStart'); await page.waitForTimeout(1300);
ok((await text('#mapClock')) !== '04:00', 'mapa: el reloj corre');
await page.fill('#ta0', 'vía sexual, sangre, madre a hijo');
await click('#mapCompare'); await page.waitForTimeout(900);
ok(await page.isVisible('#mapCmp'), 'mapa: aparece la comparación');
for (const i of [0, 1, 2, 4]) await page.click(`.cchip[data-i="${i}"]`);
ok((await text('#mapPct')).startsWith('4 de 16'), 'mapa: 4 de 16 recuperados');
await click('#mapAdd'); await page.waitForTimeout(900);
ok((await text('#mapFb')).includes('Agregaste 12'), 'mapa: los 12 olvidados quedan en ámbar');
await page.waitForTimeout(1200); await shot('s03-done');

// 4 · preguntas
await go(3);
await page.click('.qrow[data-i="3"]'); await page.waitForTimeout(1800);
ok((await text('#qIdea')).includes('Nombra la medida'), 'preguntas: la idea de apoyo se escribe');
await page.click('.qrow[data-i="4"]'); await page.waitForTimeout(300);
ok((await text('#qCount')).startsWith('2 de 5'), 'preguntas: contador de abiertas');

// 5 · vocabulario
await go(4);
await page.click('#vTerms .vb[data-i="0"]'); await page.click('#vDefs .vb[data-i="1"]'); await page.waitForTimeout(500);
ok((await text('#vErr')) === '1', 'vocabulario: un error cuenta');
for (let i = 0; i < 9; i++) { await page.click(`#vTerms .vb[data-i="${i}"]`); await page.click(`#vDefs .vb[data-i="${i}"]`); await page.waitForTimeout(150); }
await page.waitForTimeout(800);
ok((await text('#vOk')) === '9', 'vocabulario: 9 de 9 unidos');
ok((await text('#vFb')).includes('completo'), 'vocabulario: mensaje final');
await shot('s05-done');

// 6 · selección
await go(5);
await page.click('.alt[data-id="C"]'); await page.waitForTimeout(300);
ok((await text('#selWhy')).includes('solo'), 'selección: explica por qué C falla');
for (let i = 0; i < 4; i++) { await page.click('#selNext'); await page.waitForTimeout(400); }
ok((await page.locator('.alt.ok').count()) === 1 && (await page.locator('.alt.bad').count()) === 3, 'selección: B correcta y 3 distractores marcados');
await page.waitForTimeout(1500);
ok((await text('#selConceptT')).includes('pueden no producir síntomas'), 'selección: concepto revelado');
await shot('s06-done');

// 7 · gráfico
await go(6, 3000);
ok(await page.locator('#chOpts .opt:disabled').count() === 3, 'gráfico: opciones bloqueadas hasta completar pasos');
for (let i = 0; i < 3; i++) { await page.click('#chNext'); await page.waitForTimeout(300); }
await page.click('#chOpts .opt[data-ok="0"]'); await page.waitForTimeout(300);
ok((await text('#chWhy')).includes('Todavía no'), 'gráfico: conclusión errónea recibe pista');
await page.click('#chOpts .opt[data-ok="1"]'); await page.waitForTimeout(500);
ok((await text('#chWhy')).includes('adecuada'), 'gráfico: conclusión adecuada');
await shot('s07-done');

// 8 · desarrollo corto
await go(7);
await page.click('.so button[data-slot="claim"][data-q="0"]'); await page.click('.so button[data-slot="ev"][data-q="2"]'); await page.click('.so button[data-slot="lim"][data-q="2"]');
await page.waitForTimeout(300);
ok((await text('#devFb')).includes('Mejora'), 'desarrollo: pista para la pieza débil');
await page.click('.so button[data-slot="claim"][data-q="2"]'); await page.waitForTimeout(500);
ok((await text('#devFb')).includes('completa'), 'desarrollo: respuesta completa');
ok((await page.locator('.rub.ok').count()) === 3, 'desarrollo: 3 criterios de la rúbrica');
await shot('s08-done');

// 9 · estaciones
await go(8, 3800);
await shot('s09');
await page.click('#stCard .tabs button[data-i="2"]'); await page.waitForTimeout(1500);
ok((await text('#stCard h3')).includes('Prevención'), 'estaciones: seleccionar el andén 3');
await click('#stStart'); await page.waitForTimeout(1300);
ok((await text('#stClock')) !== '06:00', 'estaciones: corre el reloj de estación');
await click('#stRotate'); await page.waitForTimeout(1800);
ok((await text('#stGroups')).includes('Andén 2'), 'estaciones: los grupos rotan');
await shot('s09-rot');
// clic en el 3D
await page.mouse.click(520, 480); await page.waitForTimeout(800);

// 10 · estaciones 1 y 2
await go(9);
await page.locator('.e1c').nth(0).locator('button[data-v="0"]').click(); await page.waitForTimeout(300);
ok((await text('#e12Score')).startsWith('1 /'), 'E1: «mito» correcto suma');
await page.locator('.e1c').nth(1).locator('button[data-v="0"]').click(); await page.waitForTimeout(300);
ok((await text('#e12Score')).startsWith('1 /'), 'E1: «mito» incorrecto no suma');
ok((await page.locator('.e1c .yn button.ok').count()) === 2, 'E1: se muestra la respuesta correcta');
await page.click('.s-e12 .tabs button[data-t="1"]'); await page.waitForTimeout(700);
ok(await page.isVisible('#e2'), 'E2: pestaña de comparación');
await page.locator('.e2r').nth(0).locator('button[data-k="bac"]').click(); await page.waitForTimeout(300);
ok((await text('#e12Score')).startsWith('2 /'), 'E2: bacterias correcto suma');
await shot('s10-e2');

// 11 · estaciones 3 y 4
await go(10);
await page.locator('.e3r').nth(0).locator('button[data-v="1"]').click(); await page.waitForTimeout(300);
ok((await text('#e34Score')).startsWith('1 /'), 'E3: «hacer» correcto suma');
await page.click('.s-e34 .tabs button[data-t="1"]'); await page.waitForTimeout(2200);
await page.click('#e4Opts .opt[data-ok="1"]'); await page.waitForTimeout(500);
ok((await text('#e34Score')).startsWith('2 /'), 'E4: conclusión adecuada suma');
await shot('s11-e4');

// 12 · mini ensayo
await go(11);
await click('#esStart'); await page.waitForTimeout(1300);
ok((await text('#esClock')) !== '15:00', 'ensayo: corre el reloj');
for (let i = 0; i < 8; i++) {
  await page.click('#esAlts .alt[data-ok="1"]'); await page.waitForTimeout(200);
  ok(await page.isVisible('#esJust'), `ensayo ${i + 1}: aparece la justificación`);
  await page.click(i === 7 ? '#esJOpts .opt[data-ok="0"]' : '#esJOpts .opt[data-ok="1"]');
  if (i === 3) await shot('s12-q4');
  if (i < 7) await click('#esNext');
}
await page.waitForTimeout(300);
await click('#esDone'); await page.waitForTimeout(1500);
ok((await text('#esScore')) === '15', 'ensayo: 15 de 16 puntos (una justificación errónea)');
await shot('s12-result');
await click('#esGoCorr'); await page.waitForTimeout(3800);

// 13 · corrección
ok((await page.evaluate(() => window.__deck.deck.index)) === 12, 'ensayo → corrección');
ok((await page.locator('.crow').count()) === 8, 'corrección: 8 contenidos');
ok((await text('#refuerzo')).includes('Leer un gráfico'), 'corrección: el contenido con error aparece en el refuerzo');
await page.click('.crow[data-i="7"]'); await page.waitForTimeout(400);
ok((await text('#corrExp')).includes('La evidencia o concepto que lo demuestra es'), 'corrección: explica con evidencia');
await page.click('.s-corr .tabs button[data-m="class"]'); await page.waitForTimeout(500);
for (let k = 0; k < 5; k++) await page.click('.crow[data-i="2"] [data-d="1"]');
for (let k = 0; k < 3; k++) await page.click('.crow[data-i="4"] [data-d="1"]');
await page.click('.crow[data-i="6"] [data-d="1"]'); await page.waitForTimeout(1800);
ok((await text('#refuerzo')).includes('Barreras de protección'), 'corrección: modo curso → top 3');
await shot('s13-class');
await click('#corrDemo'); await page.waitForTimeout(1800);
ok((await text('#refuerzo')).includes('EJEMPLO'), 'corrección: datos de ejemplo');

// 14 · cierre
await go(13);
ok((await page.locator('.pchip.on').count()) === 2, 'cierre: prioridades sugeridas por los errores');
await page.click('.strat >> nth=1'); await page.waitForTimeout(300);
ok((await text('#studySum')).includes('Mi plan'), 'cierre: plan de estudio armado');
await page.selectOption('#dA', 'dato'); await page.selectOption('#dB', 'opinión'); await page.waitForTimeout(500);
ok((await text('#ticketFb')).includes('Buen contraste'), 'cierre: ticket con buen contraste');
for (const c of await page.locator('.ck input').all()) await c.check();
await page.waitForTimeout(800);
await shot('s14-done');

// movimiento reducido
await page.evaluate(() => document.activeElement?.blur()); await page.keyboard.press('m'); await go(5, 1500);
ok(await page.evaluate(() => document.body.classList.contains('reduced')), 'M activa movimiento reducido');
await page.keyboard.press('m');

console.log(errors.length ? errors.join('\n') : 'sin errores de consola');
console.log(fails ? `${fails} comprobación(es) fallaron` : 'todas las comprobaciones pasaron');
await browser.close();
process.exit(fails ? 1 : 0);
