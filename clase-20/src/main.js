import { gsap } from 'gsap';
import { $, motion } from '../../src/util.js';
import { createDeck } from './deck.js';
import { initSlides } from './slides.js';
import { createBG } from './three/bg.js';
import { createChart3D } from './three/chart3d.js';
import { createFair } from './three/fair.js';
import { createWords } from './three/words.js';
import { SERIES, DISTRICTS } from './data.js';

const three = { live: { chart: false, fair: false, words: false }, bg: null, chart: null, fair: null, words: null, onBar: null };

// Si no hay WebGL la presentación sigue funcionando (solo se pierden las escenas 3D).
function safe(label, fn, canvas) {
  try { return fn(); } catch (err) {
    console.warn(`[${label}] WebGL no disponible`, err);
    if (canvas?.parentElement) {
      const m = document.createElement('div');
      m.style.cssText = 'position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:40px;color:#4a423a;font-size:24px';
      m.textContent = 'La escena 3D no está disponible en este equipo. El resto de la actividad funciona igual.';
      canvas.parentElement.appendChild(m);
    }
    return null;
  }
}
const noop = () => {};
three.bg = safe('bg', () => createBG($('#bg')));
three.chart = safe('chart', () => createChart3D($('#chartCanvas'), $('#chartLabels'), SERIES.consultas, (i, l, v) => three.onBar?.(i, l, v)), $('#chartCanvas')) ||
  { frame: noop, resize: noop, setStep: noop, grow: noop };
three.fair = safe('fair', () => createFair($('#fairCanvas'), $('#fairLabels'), DISTRICTS), $('#fairCanvas')) ||
  { frame: noop, resize: noop, setMode: noop };
three.words = safe('words', () => createWords($('#wordsCanvas'), $('#wordLabels'), () => {}), $('#wordsCanvas')) ||
  { frame: noop, resize: noop, layout: noop, setWords: (w) => { const box = $('#wordLabels'); box.innerHTML = ''; return w.map((t) => { const b = document.createElement('button'); b.className = 'wd'; b.style.position = 'static'; b.style.transform = 'none'; b.style.margin = '8px'; b.textContent = t; b.addEventListener('click', () => b.classList.toggle('on')); box.appendChild(b); return b; }); } };

const deck = createDeck({ onChange: (n) => { three.bg?.setMood(n); document.body.classList.toggle('content', n > 0); } });
initSlides(deck, three);

// Un solo bucle de render (gsap.ticker): fondo siempre; escenas 3D solo si su diapositiva está visible.
gsap.ticker.add((_, deltaMs) => {
  const dt = Math.min(deltaMs / 1000, 0.05);
  three.bg?.update(dt);
  if (three.live.chart) three.chart.frame(dt);
  if (three.live.fair) three.fair.frame(dt);
  if (three.live.words) three.words.frame(dt);
});
gsap.ticker.lagSmoothing(0);

// Clic en el fondo: una ola recorre las barras
addEventListener('pointerdown', (e) => {
  if (e.target.closest('button,input,textarea,canvas:not(#bg),a,aside,nav,label,svg,[contenteditable]')) return;
  three.bg?.pulseAt(e.clientX, e.clientY);
});

const start = Math.max(0, Math.min(deck.N - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
deck.go(start);
addEventListener('hashchange', () => deck.go((parseInt(location.hash.slice(1), 10) || 1) - 1));
window.__deck = { deck, three, motion };
