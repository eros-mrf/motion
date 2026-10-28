import { gsap } from 'gsap';
import { $, motion } from '../../src/util.js';
import { createDeck } from './deck.js';
import { initSlides } from './slides.js';
import { createBG } from './three/bg.js';
import { createChart } from './three/chart.js';
import { createBalance } from './three/balance.js';
import { createStool } from './three/stool.js';
import { safe } from '../../core/scene-kit.js';
import { CHART, CRIT3 } from './data.js';

const three = { live: { ch: false, bl: false, st: false }, bg: null, ch: null, bl: null, st: null, onBarPick: null };
const MOOD = { intro: '#ff7059', activacion: '#f5c451', preguntas: '#b9a8ff', modelamiento: '#7be0c0', actividad: '#8fd0ff', comun: '#ff7059', ticket: '#f5c451' };

const noop = () => {};
three.bg = safe('bg', () => createBG($('#bg')));
three.ch = safe('ch', () => createChart($('#chCanvas'), $('#chLabels'), CHART, (i) => three.onBarPick?.(i)), $('#chCanvas')) || { frame: noop, resize: noop, setParts: noop, select: noop, grow: noop };
three.bl = safe('bl', () => createBalance($('#blCanvas'), $('#blLabels')), $('#blCanvas')) || { frame: noop, resize: noop, setBlocks: noop, setTilt: noop, setLabels: noop, setWon: noop };
three.st = safe('st', () => createStool($('#stCanvas'), $('#stLabels'), CRIT3), $('#stCanvas')) || { frame: noop, resize: noop, setLevels: noop };

const deck = createDeck({ onChange: (n) => three.bg?.setMood(MOOD[deck.slides[n].dataset.phase]) });
initSlides(deck, three);

// Un solo bucle de render (gsap.ticker): fondo siempre; escenas 3D solo si su diapositiva está visible.
gsap.ticker.add((_, deltaMs) => {
  const dt = Math.min(deltaMs / 1000, 0.05);
  three.bg?.update(dt);
  if (three.live.ch) three.ch.frame(dt);
  if (three.live.bl) three.bl.frame(dt);
  if (three.live.st) three.st.frame(dt);
});
gsap.ticker.lagSmoothing(0);

// Clic en el fondo: una onda recorre los puntos
addEventListener('pointerdown', (e) => {
  if (e.target.closest('button,input,textarea,select,canvas:not(#bg),a,aside,nav,label,svg,.win,.win-dark,.notice,[contenteditable],ol,ul,.ev')) return;
  three.bg?.pulseAt(e.clientX, e.clientY);
});

const start = Math.max(0, Math.min(deck.N - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
deck.go(start);
addEventListener('hashchange', () => deck.go((parseInt(location.hash.slice(1), 10) || 1) - 1));
window.__deck = { deck, three, motion };
