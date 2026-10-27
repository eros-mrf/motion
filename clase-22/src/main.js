import { gsap } from 'gsap';
import { $, motion } from '../../src/util.js';
import { createDeck } from './deck.js';
import { initSlides } from './slides.js';
import { createBG } from './three/bg.js';
import { createMindmap } from './three/mindmap.js';
import { createStations } from './three/stations.js';
import { createTowers } from './three/towers.js';
import { BRANCHES, STATIONS } from './data.js';

const three = { live: { map: false, st: false, tw: false }, bg: null, map: null, st: null, tw: null, onLeafPick: null, onStationPick: null };
const MOOD = { intro: '#ffc233', recupera: '#ffc233', preguntas: '#b69cff', modelamiento: '#2fd6b5', estaciones: '#62b0ff', ensayo: '#ff6b8a', correccion: '#2fd6b5', cierre: '#ffc233' };

// Si no hay WebGL la presentación sigue funcionando (solo se pierden las escenas 3D).
function safe(label, fn, canvas) {
  try { return fn(); } catch (err) {
    console.warn(`[${label}] WebGL no disponible`, err);
    if (canvas?.parentElement) {
      const m = document.createElement('div');
      m.style.cssText = 'position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:40px;color:#d6c9be;font-size:22px';
      m.textContent = 'La escena 3D no está disponible en este equipo. El resto de la actividad funciona igual.';
      canvas.parentElement.appendChild(m);
    }
    return null;
  }
}
const noop = () => {};
three.bg = safe('bg', () => createBG($('#bg')));
three.map = safe('map', () => createMindmap($('#mapCanvas'), $('#mapLabels'), BRANCHES, (i) => three.onLeafPick?.(i)), $('#mapCanvas')) || { frame: noop, resize: noop, setLeaf: noop, reset: noop };
three.st = safe('st', () => createStations($('#stCanvas'), $('#stLabels'), STATIONS, (i) => three.onStationPick?.(i)), $('#stCanvas')) || { frame: noop, resize: noop, select: noop, setRound: noop };
three.tw = safe('tw', () => createTowers($('#twCanvas'), $('#twLabels'), 8), $('#twCanvas')) || { frame: noop, resize: noop, setValues: noop, setTop: noop };

const deck = createDeck({ onChange: (n) => three.bg?.setMood(MOOD[deck.slides[n].dataset.phase]) });
initSlides(deck, three);

// Un solo bucle de render (gsap.ticker): fondo siempre; escenas 3D solo si su diapositiva está visible.
gsap.ticker.add((_, deltaMs) => {
  const dt = Math.min(deltaMs / 1000, 0.05);
  three.bg?.update(dt);
  if (three.live.map) three.map.frame(dt);
  if (three.live.st) three.st.frame(dt);
  if (three.live.tw) three.tw.frame(dt);
});
gsap.ticker.lagSmoothing(0);

// Clic en el fondo: una onda de luz recorre el mapa de curvas
addEventListener('pointerdown', (e) => {
  if (e.target.closest('button,input,textarea,select,canvas:not(#bg),a,aside,nav,label,svg,.panel,[contenteditable]')) return;
  three.bg?.pulseAt(e.clientX, e.clientY);
});

const start = Math.max(0, Math.min(deck.N - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
deck.go(start);
addEventListener('hashchange', () => deck.go((parseInt(location.hash.slice(1), 10) || 1) - 1));
window.__deck = { deck, three, motion };
