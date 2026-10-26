import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { $, $$, clamp, toast, motion } from '../../src/util.js';
import { PHASES, NOTES } from './data.js';

gsap.registerPlugin(ScrambleTextPlugin);

const PHASE_COLOR = { intro: 'var(--gold)', activacion: 'var(--gold)', preguntas: 'var(--blue)', modelamiento: 'var(--lime)', actividad: 'var(--pink)', comun: 'var(--blue)', ticket: 'var(--gold)' };
const GLYPHS = '01▮▯#%&<>/ABCDEF';

export function scramble(el, text, { duration = 1.1, chars = GLYPHS } = {}) {
  if (motion.reduced) { el.textContent = text; return gsap.timeline(); }
  el.textContent = '';
  return gsap.to(el, { duration, scrambleText: { text, chars, speed: 0.75, revealDelay: 0.12 }, onComplete: () => { el.textContent = text; } });
}

export function createDeck({ onChange }) {
  const stage = $('#stage');
  const slides = $$('#slides > .slide');
  const N = slides.length;
  const hooks = { enter: {}, leave: {} };
  let want = -1, shown = -1, tl = null;
  const visited = new Set();
  const fast = new URLSearchParams(location.search).has('fast');

  // escala 16:9 con letterbox
  const fit = () => { stage.style.transform = `translate(-50%,-50%) scale(${Math.min(innerWidth / 1920, innerHeight / 1080)})`; };
  fit(); addEventListener('resize', fit);

  // persiana
  const shutter = $('#shutter');
  const BL = 9;
  for (let i = 0; i < BL; i++) { const b = document.createElement('div'); b.className = 'blade'; shutter.appendChild(b); }
  const blades = $$('.blade', shutter);

  // HUD
  const segs = $('#segs');
  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.setAttribute('role', 'tab'); b.title = `${i + 1}. ${s.dataset.title}`; b.setAttribute('aria-label', `${i + 1}. ${s.dataset.title}`);
    b.style.setProperty('--sc', PHASE_COLOR[s.dataset.phase]);
    b.addEventListener('click', () => go(i));
    segs.appendChild(b);
  });
  const menuGrid = $('#menuGrid');
  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.style.setProperty('--c', PHASE_COLOR[s.dataset.phase]);
    b.innerHTML = `<span class="mn">${String(i + 1).padStart(2, '0')} // ${PHASES[s.dataset.phase].name.toUpperCase()}</span><span class="mt">${s.dataset.title}</span>`;
    b.addEventListener('click', () => { closeMenu(); go(i); });
    menuGrid.appendChild(b);
  });
  function updateHUD() {
    const s = slides[want], ph = PHASES[s.dataset.phase];
    visited.add(want);
    $$('#segs button').forEach((b, i) => { b.classList.toggle('on', i === want); b.classList.toggle('seen', i !== want && visited.has(i)); b.setAttribute('aria-selected', i === want); });
    $$('#menuGrid button').forEach((b, i) => b.classList.toggle('on', i === want));
    $('#counter').textContent = `${String(want + 1).padStart(2, '0')} / ${N}`;
    $('.phase-name').textContent = ph.name; $('.phase-min').textContent = `${ph.min} min`;
    $('#phaseChip').style.setProperty('--phase', PHASE_COLOR[s.dataset.phase]);
    $('#notesBody').innerHTML = NOTES[want] || '';
    $('#notesPhase').textContent = `${want + 1}/${N} // ${ph.name}`;
    history.replaceState(null, '', `#${want + 1}`);
  }

  // ---- animaciones de entrada: "descifrar" el título + barrido de tarjetas ----
  function enterTL(slide) {
    const t = gsap.timeline();
    const quick = motion.reduced || fast;
    const title = $('.title[data-a="title"]', slide);
    if (title) {
      if (!title.dataset.full) { title.dataset.full = title.textContent.trim(); title.setAttribute('aria-label', title.dataset.full); }
      if (quick) title.textContent = title.dataset.full;
      else t.add(scramble(title, title.dataset.full, { duration: 1.0 }), 0.05);
    }
    // portada: cada línea se descifra con retardo
    const lines = $$('.scr', slide);
    lines.forEach((el, i) => {
      if (quick) { el.textContent = el.dataset.text; return; }
      t.fromTo(el.parentElement, { x: -90, opacity: 0, skewX: -14 }, { x: 0, opacity: 1, skewX: 0, duration: 0.9, ease: 'expo.out', clearProps: 'transform,opacity' }, 0.1 + i * 0.16);
      t.add(scramble(el, el.dataset.text, { duration: 1.1, chars: i === 1 ? '▮▯0123456789' : GLYPHS }), 0.1 + i * 0.16);
    });
    const els = $$('[data-a]', slide).filter((e) => e.dataset.a !== 'title' && e.dataset.a !== 'line');
    const clean = { clearProps: 'transform,opacity,clipPath,visibility' };
    if (quick) { t.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.25, ...clean }, 0); return t; }
    t.fromTo(els, { opacity: 0, x: -36, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, x: 0, clipPath: 'inset(0 -2% 0 0)', duration: 0.85, ease: 'expo.out', stagger: 0.08, ...clean }, 0.25);
    return t;
  }

  function deactivate(i) {
    const s = slides[i];
    s.classList.remove('active');
    $$('.scr', s).forEach((e) => { e.textContent = e.dataset.text; });
    $$('.title[data-full]', s).forEach((e) => { e.textContent = e.dataset.full; });
    gsap.set($$('[data-a],.scr', s).concat($$('.scr', s).map((e) => e.parentElement)), { clearProps: 'transform,opacity,clipPath,visibility' });
  }

  function go(n) {
    n = clamp(n, 0, N - 1);
    if (n === want) return;
    want = n;
    tl?.kill();
    gsap.set(blades, { scaleY: 0 });
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
        .set(blades, { transformOrigin: 'top' })
        .to(blades, { scaleY: 1, duration: 0.3, ease: 'power3.in', stagger: { each: 0.03, from: 'edges' } })
        .add(begin)
        .set(blades, { transformOrigin: 'bottom' })
        .to(blades, { scaleY: 0, duration: 0.45, ease: 'power3.out', stagger: { each: 0.03, from: 'center' } }, '+=0.02');
    } else begin();
  }

  // ---- notas, índice, pantalla completa, movimiento ----
  const notes = $('#notes'), menu = $('#menu');
  function toggleNotes(force) {
    const show = force ?? notes.hidden;
    notes.hidden = !show;
    if (show) gsap.fromTo(notes, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'power3.out', clearProps: 'transform' });
  }
  function closeMenu() { menu.hidden = true; }
  function toggleMenu() { menu.hidden = !menu.hidden; if (!menu.hidden) gsap.fromTo('#menuGrid button', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.03, duration: 0.45, ease: 'power3.out', clearProps: 'all' }); }
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

  // ---- reloj de clase ----
  let clock = { run: false, ms: 0, last: 0 };
  const fmt = (ms) => { const s = Math.floor(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
  const paintClock = () => { const c = $('#clock'); c.textContent = `${fmt(clock.ms)} / 90:00`; c.classList.toggle('run', clock.run); };
  setInterval(() => { if (clock.run) { const t = performance.now(); clock.ms += t - clock.last; clock.last = t; paintClock(); } }, 500);
  const toggleClock = () => { clock.run = !clock.run; clock.last = performance.now(); toast(clock.run ? 'Reloj de clase en marcha' : 'Reloj de clase en pausa'); paintClock(); };
  const resetClock = () => { clock = { run: false, ms: 0, last: 0 }; paintClock(); toast('Reloj reiniciado'); };

  // ---- inclinación 3D de tarjetas (.tilt) ----
  stage.addEventListener('pointermove', (e) => {
    if (motion.reduced) return;
    const el = e.target.closest?.('.tilt');
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotationY: px * 9, rotationX: -py * 9, transformPerspective: 1000, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
  });
  stage.addEventListener('pointerout', (e) => {
    const el = e.target.closest?.('.tilt');
    if (el && !el.contains(e.relatedTarget)) gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.7, ease: 'elastic.out(1,.6)', overwrite: 'auto' });
  });

  // ---- eventos ----
  $('#btnPrev').onclick = () => go(want - 1);
  $('#btnNext').onclick = () => go(want + 1);
  $('#btnNotes').onclick = () => toggleNotes();
  $('#notesClose').onclick = () => toggleNotes(false);
  $('#btnMenu').onclick = toggleMenu;
  $('#btnFs').onclick = toggleFs;
  $('#btnMotion').onclick = toggleMotion;
  $('#phaseChip').onclick = toggleClock;
  menu.addEventListener('click', (e) => { if (e.target === menu) closeMenu(); });
  addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target;
    if (e.key === 'Escape') { closeMenu(); toggleNotes(false); return; }
    if (t.matches?.('input,textarea,select,[contenteditable]')) return;
    const onBtn = t.matches?.('button');
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
  stage.addEventListener('touchstart', (e) => { sx = e.target.closest('canvas,input,textarea,.q-list,[contenteditable]') ? null : e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 90) go(want + (dx < 0 ? 1 : -1)); sx = null; });

  return { go, slides, hooks, get index() { return want; }, N };
}
