// Prueba de interacciones: hace clic/escribe en cada actividad y comprueba el resultado.
// Uso: node tools/interact.mjs [carpeta-salida]
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const out = process.argv[2] || 'shots-interact';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errors = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
let fails = 0;
const ok = (c, msg) => { if (!c) { fails++; console.log('✗', msg); } else console.log('✓', msg); };
const go = async (n, ms = 2200) => { await page.evaluate((k) => window.__deck.deck.go(k), n); await page.waitForTimeout(ms); };
const shot = (n) => page.screenshot({ path: `${out}/${n}.png` });

await page.goto('file://' + path.resolve(process.env.DECK || 'index.html') + '#1');
await page.waitForTimeout(2500);

// teclado: avanzar y retroceder
await page.keyboard.press('ArrowRight'); await page.waitForTimeout(900);
ok((await page.evaluate(() => window.__deck.deck.index)) === 1, 'flecha → avanza a la diapositiva 2');
await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(900);
ok((await page.evaluate(() => window.__deck.deck.index)) === 0, 'flecha ← vuelve a la 1');
await page.keyboard.press('n'); await page.waitForTimeout(600);
ok(await page.isVisible('#notes'), 'tecla N abre las notas del docente');
await shot('notes'); await page.keyboard.press('n');
await page.keyboard.press('g'); await page.waitForTimeout(700);
ok(await page.isVisible('#menu'), 'tecla G abre el índice'); await shot('menu'); await page.keyboard.press('Escape');

// 3 · mensajes
await go(2);
const picks = [['A', 'verificar'], ['B', 'rumor'], ['C', 'evidencia'], ['D', 'evidencia']];
for (const [id, c] of picks) await page.click(`.msg[data-id="${id}"] .pick[data-c="${c}"]`);
await page.waitForTimeout(900);
ok((await page.locator('.msg.ok').count()) === 3, 'mensajes: 3 de 4 coinciden con la clave (C elegido mal a propósito)');
ok((await page.locator('.msg.no').count()) === 1, 'mensajes: 1 marcado para revisar el criterio');
await shot('s03-done');

// 4 · preguntas
await go(3);
await page.click('#qList button[data-i="2"]'); await page.waitForTimeout(900);
ok((await page.textContent('#qTitle')).includes('muy segura'), 'preguntas: la pregunta 3 se muestra');
await shot('s04-q3');

// 5 · vocabulario
await go(4);
await page.click('.vcard:nth-child(3)'); await page.click('.vcard:nth-child(7)'); await page.waitForTimeout(1100);
ok((await page.locator('.vcard.flip').count()) === 2, 'vocabulario: 2 tarjetas voltean');
await shot('s05-flip');

// 6 · simulación
await go(5, 1500);
await page.evaluate(() => window.__deck.three.sim.reset());
await page.fill('#verify', '10').catch(() => {});
await page.evaluate(() => { const v = document.querySelector('#verify'); v.value = 10; v.dispatchEvent(new Event('input', { bubbles: true })); });
await page.click('#simLaunch');
await page.waitForTimeout(7000);
const r10 = await page.textContent('#stRumor');
await shot('s06-low-verify');
await page.evaluate(() => { const v = document.querySelector('#verify'); v.value = 90; v.dispatchEvent(new Event('input', { bubbles: true })); });
await page.click('#simReset'); await page.click('#simLaunch');
await page.waitForTimeout(5000);
const r90 = await page.textContent('#stRumor');
console.log('   alcance con 10 % verificación:', r10, '· con 90 %:', r90);
ok(parseInt(r10) > parseInt(r90), 'simulación: más verificación → menor alcance del rumor');
await page.click('#modeEvid');
await page.click('#simCanvas', { position: { x: 400, y: 300 } });
await page.waitForTimeout(800);
await shot('s06-evidence');

// 7 · estigma
await go(6, 4500);
await shot('s07-A');
await page.click('#pathB'); await page.waitForTimeout(4500);
ok((await page.textContent('#pathMsg')).includes('Pedir ayuda es autocuidado'), 'estigma: camino de la evidencia');
await shot('s07-B');

// 8 · detector
await go(7);
await page.click('.sig[data-k="fuente"]'); await page.click('.sig[data-k="estigma"]'); await page.waitForTimeout(500);
ok((await page.textContent('#sigCount')).startsWith('2'), 'detector: 2 señales encontradas');
await page.click('#detectAll'); await page.waitForTimeout(2200);
ok((await page.textContent('#sigCount')).startsWith('7'), 'detector: 7/7 con “Mostrar todas”');
await shot('s08-done');

// 9 · A-E-R
await go(8, 2500);
await page.click('.aer-steps button[data-step="2"]'); await page.waitForTimeout(3800);
ok((await page.locator('.aer-card.live').count()) === 3, 'A-E-R: tres tarjetas activas en el paso R');
await shot('s09-R');

// 10 · laboratorio (mensaje 3 = texto más largo)
await go(9);
await page.click('#labTabs button[data-i="2"]'); await page.waitForTimeout(500);
await page.click('.lab-foot .btn'); await page.waitForTimeout(2600);
ok((await page.locator('.field.open').count()) === 4, 'laboratorio: 4 campos revelados');
await shot('s10-M3-open');
const overflow = await page.evaluate(() => { const g = document.querySelector('.lab-grid').getBoundingClientRect(); const f = document.querySelector('#labForm').getBoundingClientRect(); return f.bottom <= g.bottom + 2; });
ok(overflow, 'laboratorio: el formulario cabe en la grilla');

// 11 · reescritura
await go(10);
await page.click('#wTabs button[data-i="0"]');
await page.fill('#wText', 'Ese contagiado es peligroso y hay que alejarse.');
await page.waitForTimeout(400);
ok((await page.getAttribute('#critR', 'class')).includes('r'), 'reescritura: detecta lenguaje estigmatizante (semáforo rojo)');
await shot('s11-bad');
await page.fill('#wText', 'El VIH no se transmite por abrazos, vasos ni baños compartidos. Se transmite por sangre, relaciones sexuales sin protección y de madre a hijo/a. Informarse evita el miedo y la discriminación.');
await page.waitForTimeout(400);
ok((await page.getAttribute('#critR', 'class')).includes('g') && (await page.getAttribute('#critE', 'class')).includes('g') && (await page.getAttribute('#critC', 'class')).includes('g'), 'reescritura: semáforo verde con una buena publicación');
await page.click('#wModel'); await page.waitForTimeout(500);
await shot('s11-good');
await page.fill('#wText', Array(45).fill('palabra').join(' '));
ok((await page.getAttribute('#critC', 'class')).includes('r'), 'reescritura: más de 40 palabras → rojo');

// 12 · palabras
await go(11);
await page.click('.swap[data-i="1"]'); await page.waitForTimeout(700);
await page.click('#swapAll'); await page.waitForTimeout(2200);
ok((await page.locator('.swap.fixed').count()) === 6, 'palabras: las 6 se corrigen');
await shot('s12-done');

// 13 · escudo
await go(12, 4500);
await page.click('.pcard[data-i="1"]'); await page.waitForTimeout(1200);
ok((await page.locator('.pcard.on').count()) === 1, 'escudo: se selecciona un criterio');
await shot('s13-sel');
// clic sobre el anillo 3D
const box = await page.locator('#shieldCanvas').boundingBox();
await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);

// 14 · ticket
await go(13);
await page.click('.word:has-text("exacta")'); await page.click('.word:has-text("respetuosa")'); await page.click('.word:has-text("viral")');
await page.waitForTimeout(500);
ok((await page.textContent('#ticketFb')).includes('Revisemos'), 'ticket: advierte sobre una palabra no válida');
await shot('s14-warn');
await page.click('.blank[data-i="2"]'); await page.click('.word:has-text("clara")'); await page.waitForTimeout(700);
ok((await page.textContent('#ticketFb')).includes('Muy bien'), 'ticket: respuesta correcta');
for (const i of [0, 1, 2, 3]) await page.click(`#selfList button[data-i="${i}"]`);
await page.waitForTimeout(500);
await shot('s14-done');

// movimiento reducido
await page.keyboard.press('m'); await page.waitForTimeout(300);
ok(await page.evaluate(() => document.body.classList.contains('reduced')), 'tecla M activa movimiento reducido');

console.log(errors.length ? 'CONSOLA:\n' + errors.join('\n') : 'sin errores de consola');
console.log(fails ? `${fails} comprobaciones fallaron` : 'todas las comprobaciones pasaron');
await browser.close();
process.exit(fails ? 1 : 0);
