import { gsap } from 'gsap';
import { $, motion } from '../../src/util.js';
import { createDeck } from './deck.js';
import { initSlides } from './slides.js';
import { createBG } from './three/bg.js';
import { createLibrary } from './three/library.js';
import { createAgents } from './three/agents.js';
import { createFicha } from './three/ficha.js';
import { SOURCES, FIELDS } from './data.js';

const three = { live: { lib: false, agents: false, ficha: false }, bg: null, lib: null, agents: null, ficha: null, onLibSelect: null, onPins: null };

// Si no hay WebGL la presentación sigue funcionando (solo se pierden las escenas 3D).
function safe(label, fn, canvas) {
  try { return fn(); } catch (err) {
    console.warn(`[${label}] WebGL no disponible`, err);
    if (canvas?.parentElement) {
      const m = document.createElement('div');
      m.style.cssText = 'position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:40px;color:#94b3a6;font-size:24px';
      m.textContent = 'La escena 3D no está disponible en este equipo. El resto de la actividad funciona igual.';
      canvas.parentElement.appendChild(m);
    }
    return null;
  }
}
const noop = () => {};
three.bg = safe('bg', () => createBG($('#bg')));
three.lib = safe('lib', () => createLibrary($('#libCanvas'), SOURCES, (s, i) => three.onLibSelect?.(s, i)), $('#libCanvas')) ||
  { frame: noop, resize: noop, select: noop, markDone: noop };
three.agents = safe('agents', () => createAgents($('#agentCanvas'), (l) => three.onPins?.(l)), $('#agentCanvas')) ||
  { frame: noop, resize: noop, setMode: noop, setPins: noop };
three.ficha = safe('ficha', () => createFicha($('#fichaCanvas'), FIELDS), $('#fichaCanvas')) ||
  { frame: noop, resize: noop, setStates: (s) => s.filter((x) => x.done).length };

const deck = createDeck({ onChange: (n) => { three.bg?.setMood(n); document.body.classList.toggle('content', n > 0); } });
initSlides(deck, three);

// Un solo bucle de render (gsap.ticker): fondo siempre; escenas 3D solo si su diapositiva está visible.
gsap.ticker.add((_, deltaMs) => {
  const dt = Math.min(deltaMs / 1000, 0.05);
  three.bg?.update(dt);
  if (three.live.lib) three.lib.frame(dt);
  if (three.live.agents) three.agents.frame(dt);
  if (three.live.ficha) three.ficha.frame(dt);
});
gsap.ticker.lagSmoothing(0);

// Clic en el fondo: onda de datos sobre el terreno
addEventListener('pointerdown', (e) => {
  if (e.target.closest('button,input,textarea,canvas:not(#bg),a,aside,nav,label,[contenteditable]')) return;
  three.bg?.pulseAt(e.clientX, e.clientY);
});

const start = Math.max(0, Math.min(deck.N - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
deck.go(start);
addEventListener('hashchange', () => deck.go((parseInt(location.hash.slice(1), 10) || 1) - 1));
window.__deck = { deck, three, motion };
