import { gsap } from 'gsap';
import { $, $$, clamp, toast, motion } from '../../src/util.js';
import { PHASES, NOTES } from './data.js';

const PHASE_COLOR = { intro: 'var(--sun)', activacion: 'var(--sun)', preguntas: 'var(--violet)', modelamiento: 'var(--mint)', actividad: 'var(--coral)', comun: 'var(--violet)', ticket: 'var(--sun)' };

// Parte los textos de un título en palabras (<span class="w">), respetando <em> internos.
function splitWords(el) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
  el.setAttribute('aria-label', el.textContent.trim());
  const walk = (node) => {
    [...node.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach((tk) => {
          if (!tk) return;
          if (/^\s+$/.test(tk)) frag.appendChild(document.createTextNode(' '));
          else { const s = document.createElement('span'); s.className = 'w'; s.textContent = tk; frag.appendChild(s); }
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1 && !c.classList.contains('w')) walk(c);
    });
  };
  walk(el);
  [...el.children].forEach((c) => c.setAttribute?.('aria-hidden', 'true'));
}

export function createDeck({ onChange }) {
  const stage = $('#stage');
  const slides = $$('#slides > .slide');
  const N = slides.length;
  const hooks = { enter: {}, leave: {} };
  let want = -1, shown = -1, tl = null;
  const visited = new Set();
  const fast = new URLSearchParams(location.search).has('fast');

  const fit = () => { stage.style.transform = `translate(-50%,-50%) scale(${Math.min(innerWidth / 1920, innerHeight / 1080)})`; };
  fit(); addEventListener('resize', fit);

  // ---- ruta de orbes ----
  const journey = $('#journey');
  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.setAttribute('role', 'tab'); b.title = `${i + 1}. ${s.dataset.title}`; b.setAttribute('aria-label', `${i + 1}. ${s.dataset.title}`);
    b.style.setProperty('--jc', PHASE_COLOR[s.dataset.phase]);
    b.addEventListener('click', () => go(i));
    journey.appendChild(b);
  });
  const menuGrid = $('#menuGrid');
  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.style.setProperty('--c', PHASE_COLOR[s.dataset.phase]);
    b.innerHTML = `<span class="mn">${String(i + 1).padStart(2, '0')} · ${PHASES[s.dataset.phase].name.toUpperCase()}</span><span class="mt">${s.dataset.title}</span>`;
    b.addEventListener('click', () => { closeMenu(); go(i); });
    menuGrid.appendChild(b);
  });
  function updateHUD() {
    const s = slides[want], ph = PHASES[s.dataset.phase];
    visited.add(want);
    $$('#journey button').forEach((b, i) => { b.classList.toggle('on', i === want); b.classList.toggle('seen', i !== want && visited.has(i)); b.setAttribute('aria-selected', i === want); });
    $('#jFill').style.width = `${want * 42}px`;
    $$('#menuGrid button').forEach((b, i) => b.classList.toggle('on', i === want));
    $('#counter').textContent = `${String(want + 1).padStart(2, '0')} / ${N}`;
    $('.phase-name').textContent = ph.name; $('.phase-min').textContent = `${ph.min} min`;
    $('#phaseChip').style.setProperty('--phase', PHASE_COLOR[s.dataset.phase]);
    $('#notesBody').innerHTML = NOTES[want] || '';
    $('#notesPhase').textContent = `${want + 1}/${N} · ${ph.name}`;
    history.replaceState(null, '', `#${want + 1}`);
  }

  // ---- entrada: las palabras "enfocan" (desenfoque → nitidez) y las tarjetas flotan hacia su sitio ----
  function enterTL(slide) {
    const t = gsap.timeline();
    const quick = motion.reduced || fast;
    const title = $('.title[data-a="title"]', slide);
    if (title) splitWords(title);
    const words = title ? $$('.w', title) : [];
    const lines = $$('.cl', slide);
    if (quick) gsap.set([...words, ...lines], { opacity: 1 });
    else {
      if (words.length) t.fromTo(words, { opacity: 0, y: 34, filter: 'blur(16px)', scale: 1.08 }, { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 1.0, ease: 'expo.out', stagger: 0.09, clearProps: 'filter,transform' }, 0.05);
      if (lines.length) t.fromTo(lines, { opacity: 0, y: 60, filter: 'blur(22px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.3, ease: 'expo.out', stagger: 0.16, clearProps: 'filter,transform' }, 0.1);
    }
    const els = $$('[data-a]', slide).filter((e) => !['title', 'line'].includes(e.dataset.a));
    const clean = { clearProps: 'transform,opacity,visibility,filter' };
    if (quick) { t.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.25, ...clean }, 0); return t; }
    t.fromTo(els, { opacity: 0, y: 50, scale: 0.97, filter: 'blur(10px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.95, ease: 'expo.out', stagger: 0.09, ...clean }, 0.25);
    return t;
  }

  function deactivate(i) {
    const s = slides[i];
    s.classList.remove('active');
    gsap.set($$('[data-a],.title .w,.cl', s), { clearProps: 'transform,opacity,visibility,filter' });
  }

  // ---- cortina de cristal: una banda esmerilada cruza la pantalla ----
  const pane = $('#pane');
  const band = { a: -70, b: -70 };
  const paint = () => { pane.style.clipPath = `polygon(${band.a}% 0, ${band.b}% 0, ${band.b - 22}% 100%, ${band.a - 22}% 100%)`; };
  paint();

  function go(n) {
    n = clamp(n, 0, N - 1);
    if (n === want) return;
    want = n;
    tl?.kill(); band.a = -70; band.b = -70; paint();
    slides.forEach((_, i) => { if (i !== shown && i !== n) deactivate(i); });
    updateHUD();
    onChange?.(n);
    const begin = () => {
      if (shown >= 0 && shown !== n) { hooks.leave[shown]?.(); deactivate(shown); }
      shown = n;
      slides[n].classList.add('active');
      hooks.enter[n]?.();
      enterTL(slides[n]);
    };
    if (shown >= 0 && shown !== n && !motion.reduced && !fast) {
      tl = gsap.timeline()
        .to(band, { b: 150, duration: 0.6, ease: 'power3.inOut', onUpdate: paint })
        .add(begin)
        .to(band, { a: 150, duration: 0.65, ease: 'power3.inOut', onUpdate: paint }, '+=0.03');
    } else begin();
  }

  const notes = $('#notes'), menu = $('#menu');
  function toggleNotes(force) {
    const show = force ?? notes.hidden;
    notes.hidden = !show;
    if (show) gsap.fromTo(notes, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', clearProps: 'transform' });
  }
  function closeMenu() { menu.hidden = true; }
  function toggleMenu() { menu.hidden = !menu.hidden; if (!menu.hidden) gsap.fromTo('#menuGrid button', { y: 26, autoAlpha: 0, filter: 'blur(8px)' }, { y: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.03, duration: 0.6, ease: 'expo.out', clearProps: 'all' }); }
  function toggleFs() { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); }
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  let manual = null;
  function setReduced(v, say = true) {
    motion.reduced = v; document.body.classList.toggle('reduced', v);
    $('#btnMotion').setAttribute('aria-pressed', String(v));
    if (say) toast(v ? 'Movimiento reducido: activado' : 'Movimiento completo: activado');
  }
  setReduced(mq.matches, false);
  mq.addEventListener?.('change', () => { if (manual === null) setReduced(mq.matches, false); });
  const toggleMotion = () => { manual = !motion.reduced; setReduced(manual); };

  let clock = { run: false, ms: 0, last: 0 };
  const fmt = (ms) => { const s = Math.floor(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
  const paintClock = () => { const c = $('#clock'); c.textContent = `${fmt(clock.ms)} / 90:00`; c.classList.toggle('run', clock.run); };
  setInterval(() => { if (clock.run) { const t = performance.now(); clock.ms += t - clock.last; clock.last = t; paintClock(); } }, 500);
  const toggleClock = () => { clock.run = !clock.run; clock.last = performance.now(); toast(clock.run ? 'Reloj de clase en marcha' : 'Reloj de clase en pausa'); paintClock(); };
  const resetClock = () => { clock = { run: false, ms: 0, last: 0 }; paintClock(); toast('Reloj reiniciado'); };

  // foco de luz que sigue el cursor en las tarjetas de cristal + inclinación 3D de .tilt
  stage.addEventListener('pointermove', (e) => {
    const g = e.target.closest?.('.glass');
    if (g) { const r = g.getBoundingClientRect(); const k = r.width / g.offsetWidth || 1; g.style.setProperty('--mx', (e.clientX - r.left) / k + 'px'); g.style.setProperty('--my', (e.clientY - r.top) / k + 'px'); }
    if (motion.reduced) return;
    const el = e.target.closest?.('.tilt'); if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotationY: px * 7, rotationX: -py * 7, transformPerspective: 1100, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
  });
  stage.addEventListener('pointerout', (e) => {
    const el = e.target.closest?.('.tilt');
    if (el && !el.contains(e.relatedTarget)) gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.8, ease: 'elastic.out(1,.6)', overwrite: 'auto' });
  });

  $('#btnPrev').onclick = () => go(want - 1);
  $('#btnNext').onclick = () => go(want + 1);
  $('#btnNotes').onclick = () => toggleNotes();
  $('#notesClose').onclick = () => toggleNotes(false);
  $('#btnMenu').onclick = toggleMenu;
  $('#btnFs').onclick = toggleFs;
  $('#btnMotion').onclick = toggleMotion;
  $('#phaseChip').onclick = toggleClock;
  menu.addEventListener('click', (e) => { if (e.target === menu) closeMenu(); });
  const handlers = { left: null, right: null }; // la diapositiva 5 y 8 pueden capturar ← →
  addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target;
    if (e.key === 'Escape') { closeMenu(); toggleNotes(false); return; }
    if (t.matches?.('input,textarea,select,[contenteditable]')) return;
    const onBtn = t.matches?.('button');
    if (e.key === 'ArrowLeft' && handlers.left?.()) { e.preventDefault(); return; }
    if (e.key === 'ArrowRight' && handlers.right?.()) { e.preventDefault(); return; }
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': go(want + 1); e.preventDefault(); break;
      case 'ArrowLeft': case 'PageUp': go(want - 1); e.preventDefault(); break;
      case ' ': case 'Enter': if (!onBtn) { go(want + 1); e.preventDefault(); } break;
      case 'Home': go(0); break;
      case 'End': go(N - 1); break;
      case 'n': case 'N': toggleNotes(); break;
      case 'g': case 'G': toggleMenu(); break;
      case 'f': case 'F': toggleFs(); break;
      case 'm': case 'M': toggleMotion(); break;
      case 't': toggleClock(); break;
      case 'T': resetClock(); break;
      default: break;
    }
  });
  let sx = null;
  stage.addEventListener('touchstart', (e) => { sx = e.target.closest('canvas,input,textarea,.scard,[contenteditable]') ? null : e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 90) go(want + (dx < 0 ? 1 : -1)); sx = null; });

  return { go, slides, hooks, handlers, get index() { return want; }, N };
}
