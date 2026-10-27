import { gsap } from 'gsap';
import { $, motion } from '../../src/util.js';
import { createDeck } from './deck.js';
import { initSlides } from './slides.js';
import { createBG } from './three/bg.js';
import { createERL } from './three/erl.js';
import { createNetwork } from './three/network.js';
import { createCard3D } from './three/card3d.js';
import { NET } from './data.js';

const three = { live: { erl: false, net: false, card: false }, bg: null, erl: null, net: null, card: null, onERLPick: null, onNetPick: null };

// Si no hay WebGL la presentación sigue funcionando (solo se pierden las escenas 3D).
function safe(label, fn, canvas) {
  try { return fn(); } catch (err) {
    console.warn(`[${label}] WebGL no disponible`, err);
    if (canvas?.parentElement) {
      const m = document.createElement('div');
      m.style.cssText = 'position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:40px;color:#5b5073;font-size:22px';
      m.textContent = 'La escena 3D no está disponible en este equipo. El resto de la actividad funciona igual.';
      canvas.parentElement.appendChild(m);
    }
    return null;
  }
}
const noop = () => {};
three.bg = safe('bg', () => createBG($('#bg')));
three.erl = safe('erl', () => createERL($('#erlCanvas'), $('#erlLabels'), (i) => three.onERLPick?.(i)), $('#erlCanvas')) || { frame: noop, resize: noop, setStep: noop };
three.net = safe('net', () => createNetwork($('#netCanvas'), $('#netLabels'), NET, (i) => three.onNetPick?.(i)), $('#netCanvas')) || { frame: noop, resize: noop, setAttached: noop, setStats: noop };
three.card = safe('card', () => createCard3D($('#cardCanvas')), $('#cardCanvas')) || { frame: noop, resize: noop, update: noop };

const deck = createDeck({ onChange: (n) => three.bg?.setMood(n) });
initSlides(deck, three);

// Un solo bucle de render (gsap.ticker): fondo siempre; escenas 3D solo si su diapositiva está visible.
gsap.ticker.add((_, deltaMs) => {
  const dt = Math.min(deltaMs / 1000, 0.05);
  three.bg?.update(dt);
  if (three.live.erl) three.erl.frame(dt);
  if (three.live.net) three.net.frame(dt);
  if (three.live.card) three.card.frame(dt);
});
gsap.ticker.lagSmoothing(0);

// Clic en el fondo: una onda de luz recorre la aurora
addEventListener('pointerdown', (e) => {
  if (e.target.closest('button,input,textarea,canvas:not(#bg),a,aside,nav,label,svg,.glass,[contenteditable]')) return;
  three.bg?.pulseAt(e.clientX, e.clientY);
});

const start = Math.max(0, Math.min(deck.N - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
deck.go(start);
addEventListener('hashchange', () => deck.go((parseInt(location.hash.slice(1), 10) || 1) - 1));
window.__deck = { deck, three, motion };
