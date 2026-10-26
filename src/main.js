import { gsap } from 'gsap';
import { $, motion } from './util.js';
import { createDeck } from './deck.js';
import { initSlides } from './slides.js';
import { createBG } from './three/bg.js';
import { createRumorSim } from './three/rumor.js';
import { createShield } from './three/shield.js';

const three = { live: { sim: false, shield: false }, onSimStats: null, onShieldPick: null, sim: null, shield: null, bg: null };

// WebGL puede faltar (equipos antiguos / sin aceleración): la presentación sigue funcionando sin 3D.
function safe(label, fn, canvas) {
  try { return fn(); } catch (err) {
    console.warn(`[${label}] WebGL no disponible`, err);
    if (canvas?.parentElement) {
      const m = document.createElement('div');
      m.style.cssText = 'position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:40px;color:#a3abca;font-size:24px';
      m.textContent = 'La escena 3D no está disponible en este equipo. El resto de la actividad funciona igual.';
      canvas.parentElement.appendChild(m);
    }
    return null;
  }
}

three.bg = safe('bg', () => createBG($('#bg')));
const noop = () => {};
three.sim = safe('sim', () => createRumorSim($('#simCanvas'), (s) => three.onSimStats?.(s)), $('#simCanvas')) ||
  { frame: noop, resize: noop, reset: noop, launch: noop, evidence: noop, setVerify: noop, setMode: noop, hasActivity: true };
three.shield = safe('shield', () => createShield($('#shieldCanvas'), (i) => three.onShieldPick?.(i)), $('#shieldCanvas')) ||
  { frame: noop, resize: noop, select: noop, assemble: noop };

const deck = createDeck({
  onChange: (n) => three.bg?.setMood(n),
});
initSlides(deck, three);

// Un solo bucle de render (gsap.ticker): fondo siempre; escenas 3D solo si su diapositiva está visible.
gsap.ticker.add((_, deltaMs) => {
  const dt = Math.min(deltaMs / 1000, 0.05);
  three.bg?.update(dt);
  if (three.live.sim) three.sim.frame(dt);
  if (three.live.shield) three.shield.frame(dt);
});
gsap.ticker.lagSmoothing(0);

// Clic en el fondo: la red responde
addEventListener('pointerdown', (e) => {
  if (e.target.closest('button,input,textarea,canvas:not(#bg),a,aside,nav,label')) return;
  three.bg?.pulseAt(e.clientX, e.clientY);
});

const start = Math.max(0, Math.min(deck.N - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
deck.go(start);
addEventListener('hashchange', () => deck.go((parseInt(location.hash.slice(1), 10) || 1) - 1));

// ayuda mínima de pruebas / depuración
window.__deck = { deck, three, motion };
