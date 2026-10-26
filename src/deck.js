import { gsap } from 'gsap';
import { $, $$, clamp, splitTitle, toast, motion } from './util.js';
import { PHASES, NOTES } from './data.js';

const PHASE_COLOR = { intro: 'var(--amber)', activacion: 'var(--amber)', preguntas: 'var(--violet)', modelamiento: 'var(--cyan)', actividad: 'var(--ember)', comun: 'var(--violet)', ticket: 'var(--amber)' };

export function createDeck({ onChange }) {
  const stage = $('#stage');
  const slides = $$('#slides > .slide');
  const N = slides.length;
  const hooks = { enter: {}, leave: {} };
  let want = -1, shown = -1, tlOut = null, tlIn = null;
  const fast = new URLSearchParams(location.search).has('fast');

  // ---- escala 16:9 con letterbox ----
  const fit = () => {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = `translate(-50%,-50%) scale(${s})`;
  };
  fit(); addEventListener('resize', fit);

  // ---- HUD ----
  const dots = $('#dots');
  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `${i + 1}. ${s.dataset.title}`);
    b.title = `${i + 1}. ${s.dataset.title}`;
    b.style.setProperty('--dc', PHASE_COLOR[s.dataset.phase]);
    b.addEventListener('click', () => go(i));
    dots.appendChild(b);
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
    const s = slides[want];
    const ph = PHASES[s.dataset.phase];
    $$('#dots button').forEach((b, i) => { b.classList.toggle('on', i === want); b.setAttribute('aria-selected', i === want); });
    $$('#menuGrid button').forEach((b, i) => b.classList.toggle('on', i === want));
    $('#counter').textContent = `${String(want + 1).padStart(2, '0')} / ${N}`;
    gsap.to('#progressBar', { width: `${((want + 1) / N) * 100}%`, duration: motion.reduced ? 0.01 : 0.7, ease: 'power3.out' });
    $('.phase-name').textContent = ph.name;
    $('.phase-min').textContent = `${ph.min} min`;
    $('#phaseChip').style.setProperty('--phase', PHASE_COLOR[s.dataset.phase]);
    $('#notesBody').innerHTML = NOTES[want] || '';
    $('#notesPhase').textContent = `${want + 1}/${N} · ${ph.name}`;
    history.replaceState(null, '', `#${want + 1}`);
  }

  // ---- animaciones de entrada ----
  function enterTL(slide) {
    const tl = gsap.timeline();
    const dur = motion.reduced || fast ? 0.01 : 1;
    const title = $('.title[data-a="title"]', slide);
    if (title) {
      const chars = splitTitle(title);
      if (motion.reduced) tl.fromTo(chars, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.002 }, 0);
      else tl.fromTo(chars, { yPercent: 118, rotate: 5, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: 0.95 * dur, ease: 'expo.out', stagger: 0.014 }, 0.05);
    }
    const els = $$('[data-a]', slide).filter((e) => e.dataset.a !== 'title');
    const words = els.filter((e) => e.dataset.a === 'word');
    const routes = els.filter((e) => e.dataset.a === 'route');
    const rest = els.filter((e) => e.dataset.a !== 'word' && e.dataset.a !== 'route');
    const clean = { clearProps: 'transform,opacity,visibility,filter' };
    if (words.length) tl.fromTo(words, { autoAlpha: 0, x: -140, skewX: -12, filter: 'blur(14px)' }, { autoAlpha: 1, x: 0, skewX: 0, filter: 'blur(0px)', duration: 1.1 * dur, ease: 'expo.out', stagger: 0.16, ...clean }, 0.1);
    if (routes.length) tl.fromTo(routes, { autoAlpha: 0, x: 90 }, { autoAlpha: 1, x: 0, duration: 0.8 * dur, ease: 'power3.out', stagger: 0.12, ...clean }, 0.35);
    if (rest.length) {
      if (motion.reduced) tl.fromTo(rest, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ...clean }, 0.1);
      else tl.fromTo(rest, { autoAlpha: 0, y: 38, filter: 'blur(10px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out', stagger: 0.085, ...clean }, 0.2);
    }
    return tl;
  }

  function deactivate(i) {
    const s = slides[i];
    s.classList.remove('active');
    gsap.set(s, { clearProps: 'opacity,transform,visibility' });
    gsap.set($$('[data-a],.ch', s), { clearProps: 'transform,opacity,visibility,filter' });
  }

  function go(n) {
    n = clamp(n, 0, N - 1);
    if (n === want) return;
    const dir = n > want ? 1 : -1;
    want = n;
    tlOut?.kill(); tlIn?.kill();
    slides.forEach((_, i) => { if (i !== shown && i !== n) deactivate(i); });
    updateHUD();
    onChange?.(n, dir);
    const begin = () => {
      if (shown >= 0 && shown !== n) { hooks.leave[shown]?.(); deactivate(shown); }
      shown = n;
      slides[n].classList.add('active');
      hooks.enter[n]?.();
      tlIn = enterTL(slides[n]);
    };
    const out = shown >= 0 && shown !== n ? slides[shown] : null;
    if (out && !motion.reduced && !fast) tlOut = gsap.to(out, { opacity: 0, x: -50 * dir, scale: 0.985, duration: 0.3, ease: 'power2.in', onComplete: begin });
    else begin();
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
    motion.reduced = v;
    document.body.classList.toggle('reduced', v);
    $('#btnMotion').setAttribute('aria-pressed', String(v));
    if (say) toast(v ? 'Movimiento reducido: activado' : 'Movimiento completo: activado');
  }
  setReduced(mq.matches, false);
  mq.addEventListener?.('change', () => { if (manual === null) setReduced(mq.matches, false); });
  const toggleMotion = () => { manual = !motion.reduced; setReduced(manual); };

  // ---- reloj de clase (T) ----
  let clock = { run: false, ms: 0, last: 0 };
  function fmt(ms) { const s = Math.floor(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }
  function paintClock() { const c = $('#clock'); c.textContent = `${fmt(clock.ms)} / 90:00`; c.classList.toggle('run', clock.run); }
  setInterval(() => { if (clock.run) { const t = performance.now(); clock.ms += t - clock.last; clock.last = t; paintClock(); } }, 500);
  function toggleClock() { clock.run = !clock.run; clock.last = performance.now(); toast(clock.run ? 'Reloj de clase en marcha' : 'Reloj de clase en pausa'); paintClock(); }
  function resetClock() { clock = { run: false, ms: 0, last: 0 }; paintClock(); toast('Reloj reiniciado'); }

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
    const typing = t.matches?.('input,textarea,select,[contenteditable]');
    if (e.key === 'Escape') { closeMenu(); toggleNotes(false); return; }
    if (typing) return;
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

  // swipe táctil
  let sx = null;
  stage.addEventListener('touchstart', (e) => { sx = e.target.closest('canvas,input,textarea,.q-list') ? null : e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 90) go(want + (dx < 0 ? 1 : -1));
    sx = null;
  });

  return { go, slides, hooks, get index() { return want; }, toggleClock, resetClock, N, toggleNotes };
}
