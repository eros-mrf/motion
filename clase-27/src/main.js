import { gsap } from 'gsap';
import { $, motion } from '../../src/util.js';
import { createDeck } from './deck.js';
import { initSlides } from './slides.js';
import { createBG } from './three/bg.js';
import { createTower } from './three/tower.js';
import { createBins } from './three/bins.js';
import { createRing } from './three/ring.js';
import { safe } from '../../core/scene-kit.js';
import { SLIDES7, C3 } from './data.js';

const three = { live: { tw: false, bi: false, rg: false }, bg: null, tw: null, bi: null, rg: null, onTowerPick: null };
const MOOD = { intro: '#15120f', activacion: '#e5311f', preguntas: '#2a4bff', modelamiento: '#12a150', actividad: '#7a3cff', comun: '#e5311f', ticket: '#15120f' };

const noop = () => {};
three.bg = safe('bg', () => createBG($('#bg')));
three.tw = safe('tw', () => createTower($('#twCanvas'), $('#twLabels'), SLIDES7, (i) => three.onTowerPick?.(i)), $('#twCanvas')) || { frame: noop, resize: noop, setStates: noop, setOverall: noop };
three.bi = safe('bi', () => createBins($('#biCanvas'), $('#biLabels'), C3), $('#biCanvas')) || { frame: noop, resize: noop, addCard: () => 0, setPriority: noop, reset: noop };
three.rg = safe('rg', () => createRing($('#rgCanvas'), $('#rgLabels')), $('#rgCanvas')) || { frame: noop, resize: noop, setSegments: noop, setTime: noop };

const deck = createDeck({ onChange: (n) => three.bg?.setMood(MOOD[deck.slides[n].dataset.phase]) });
initSlides(deck, three);

// Un solo bucle de render (gsap.ticker): fondo siempre; escenas 3D solo si su diapositiva está visible.
gsap.ticker.add((_, deltaMs) => {
  const dt = Math.min(deltaMs / 1000, 0.05);
  three.bg?.update(dt);
  if (three.live.tw) three.tw.frame(dt);
  if (three.live.bi) three.bi.frame(dt);
  if (three.live.rg) three.rg.frame(dt);
});
gsap.ticker.lagSmoothing(0);

// Clic en el fondo: las hojas se agitan
addEventListener('pointerdown', (e) => {
  if (e.target.closest('button,input,textarea,select,canvas:not(#bg),a,aside,nav,label,svg,.sheet,.panel-dark,.notice,[contenteditable],.qr,.vc,.stamp,.timeline')) return;
  three.bg?.pulseAt(e.clientX, e.clientY);
});

const start = Math.max(0, Math.min(deck.N - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
deck.go(start);
addEventListener('hashchange', () => deck.go((parseInt(location.hash.slice(1), 10) || 1) - 1));
window.__deck = { deck, three, motion };
