// Verificación visual: abre index.html, recorre las diapositivas, captura consola y pantallas.
// Uso: node tools/verify.mjs [carpeta-salida] [ancho] [alto]
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const out = process.argv[2] || 'shots';
const W = +process.argv[3] || 1600, H = +process.argv[4] || 900;
fs.mkdirSync(out, { recursive: true });
const file = 'file://' + path.resolve('index.html');

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const errors = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));

await page.goto(file + '#1');
await page.waitForTimeout(3000);
const N = await page.evaluate(() => window.__deck.deck.N);
for (let i = 0; i < N; i++) {
  await page.evaluate((k) => window.__deck.deck.go(k), i);
  await page.waitForTimeout(i === 5 || i === 12 ? 4200 : 2800);
  await page.screenshot({ path: `${out}/s${String(i + 1).padStart(2, '0')}.png` });
}
console.log('slides:', N);
console.log(errors.length ? errors.join('\n') : 'sin errores de consola');
await browser.close();
