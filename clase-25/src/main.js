import { gsap } from 'gsap';
import { $, motion } from '../../src/util.js';
import { createDeck } from './deck.js';
import { initSlides } from './slides.js';
import { createBG } from './three/bg.js';
import { createLayers } from './three/layers.js';
import { createTable } from './three/table.js';
import { createRadar } from './three/radar.js';
import { safe } from '../../core/scene-kit.js';
import { LAYERS, SLIDES7, FORM_CRIT } from './data.js';

const three = { live: { lay: false, tb: false, rd: false }, bg: null, lay: null, tb: null, rd: null, onLayerPick: null, onCardPick: null };
const MOOD = { intro: '#ffe14d', activacion: '#ffe14d', preguntas: '#ff9ccb', modelamiento: '#6ff0c8', actividad: '#9fd3ff', comun: '#ff9ccb', ticket: '#ffe14d' };

const noop = () => {};
three.bg = safe('bg', () => createBG($('#bg')));
three.lay = safe('lay', () => createLayers($('#layCanvas'), $('#layLabels'), LAYERS, (i) => three.onLayerPick?.(i)), $('#layCanvas')) || { frame: noop, resize: noop, setStep: noop, assemble: noop, highlight: noop, reset: noop };
three.tb = safe('tb', () => createTable($('#tbCanvas'), SLIDES7, (i) => three.onCardPick?.(i)), $('#tbCanvas')) || { frame: noop, resize: noop, setStatus: noop, setSelected: noop };
three.rd = safe('rd', () => createRadar($('#rdCanvas'), $('#rdLabels'), FORM_CRIT), $('#rdCanvas')) || { frame: noop, resize: noop, setValues: noop, setGate: noop };

const deck = createDeck({ onChange: (n) => three.bg?.setMood(MOOD[deck.slides[n].dataset.phase]) });
initSlides(deck, three);

// Un solo bucle de render (gsap.ticker): fondo siempre; escenas 3D solo si su diapositiva está visible.
gsap.ticker.add((_, deltaMs) => {
  const dt = Math.min(deltaMs / 1000, 0.05);
  three.bg?.update(dt);
  if (three.live.lay) three.lay.frame(dt);
  if (three.live.tb) three.tb.frame(dt);
  if (three.live.rd) three.rd.frame(dt);
});
gsap.ticker.lagSmoothing(0);

// Clic en el fondo: una onda recorre el plano
addEventListener('pointerdown', (e) => {
  if (e.target.closest('button,input,textarea,select,canvas:not(#bg),a,aside,nav,label,svg,.paper,.paper-dark,[contenteditable]')) return;
  three.bg?.pulseAt(e.clientX, e.clientY);
});

const start = Math.max(0, Math.min(deck.N - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
deck.go(start);
addEventListener('hashchange', () => deck.go((parseInt(location.hash.slice(1), 10) || 1) - 1));
window.__deck = { deck, three, motion };
