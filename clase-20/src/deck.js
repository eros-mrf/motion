import { gsap } from 'gsap';
import { $, $$, clamp, toast, motion } from '../../src/util.js';
import { PHASES, NOTES } from './data.js';

const PHASE_COLOR = { intro: 'var(--mari)', activacion: 'var(--mari)', preguntas: 'var(--cobalt)', modelamiento: 'var(--jade)', actividad: 'var(--verm)', comun: 'var(--cobalt)', ticket: 'var(--mari)' };
const SPARK_H = [30, 24, 38, 28, 44, 34, 50, 40, 56, 44, 60, 48, 62, 54];
const ORIGINS = [[960, 560], [1760, 990], [160, 990], [960, 80], [1760, 90], [160, 90], [960, 1000]];

// Parte los textos de un título en palabras (<span class="w">), respetando <mark> internos.
function splitWords(el) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
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
  el.setAttribute('aria-label', el.textContent.trim());
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

  // ---- barra de navegación en forma de gráfico ----
  const spark = $('#spark');
  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.setAttribute('role', 'tab'); b.title = `${i + 1}. ${s.dataset.title}`; b.setAttribute('aria-label', `${i + 1}. ${s.dataset.title}`);
    b.style.setProperty('--sc', PHASE_COLOR[s.dataset.phase]); b.style.setProperty('--h', SPARK_H[i % SPARK_H.length] + 'px');
    b.addEventListener('click', () => go(i));
    spark.appendChild(b);
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
    $$('#spark button').forEach((b, i) => { b.classList.toggle('on', i === want); b.classList.toggle('seen', i !== want && visited.has(i)); b.setAttribute('aria-selected', i === want); });
    $$('#menuGrid button').forEach((b, i) => b.classList.toggle('on', i === want));
    $('#counter').textContent = `${String(want + 1).padStart(2, '0')} / ${N}`;
    $('.phase-name').textContent = ph.name; $('.phase-min').textContent = `${ph.min} min`;
    $('#phaseChip').style.setProperty('--phase', PHASE_COLOR[s.dataset.phase]);
    $('#notesBody').innerHTML = NOTES[want] || '';
    $('#notesPhase').textContent = `${want + 1}/${N} · ${ph.name}`;
    history.replaceState(null, '', `#${want + 1}`);
  }

  // ---- entrada: los títulos se "estampan" palabra a palabra y el resaltador barre las marcas ----
  function enterTL(slide) {
    const t = gsap.timeline();
    const quick = motion.reduced || fast;
    const title = $('.title[data-a="title"]', slide);
    const marks = $$('mark', slide), strike = $$('.strike', slide);
    if (title) splitWords(title);
    const words = title ? $$('.w', title) : [];
    const cover = $$('.cw', slide);
    if (quick) {
      gsap.set([...words, ...cover], { opacity: 1 });
      marks.forEach((m) => m.classList.add('on')); strike.forEach((m) => m.classList.add('on'));
    } else {
      if (words.length) t.fromTo(words, { scale: 1.9, rotate: -7, opacity: 0, y: -26 }, { scale: 1, rotate: 0, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(2.4)', stagger: 0.09, clearProps: 'transform' }, 0.05);
      if (cover.length) t.fromTo(cover, { scale: 1.6, rotate: -9, opacity: 0, y: -60 }, { scale: 1, rotate: 0, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(2.2)', stagger: 0.13, clearProps: 'transform' }, 0.1);
      t.add(() => { marks.forEach((m, i) => setTimeout(() => m.classList.add('on'), i * 200)); strike.forEach((m) => setTimeout(() => m.classList.add('on'), 700)); }, 0.55 + words.length * 0.05);
    }
    const els = $$('[data-a]', slide).filter((e) => !['title', 'word'].includes(e.dataset.a));
    const clean = { clearProps: 'transform,opacity,visibility' };
    if (quick) { t.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.25, ...clean }, 0); return t; }
    t.fromTo(els, { opacity: 0, y: 46, rotate: -1.6 }, { opacity: 1, y: 0, rotate: 0, duration: 0.7, ease: 'back.out(1.5)', stagger: 0.075, ...clean }, 0.25);
    return t;
  }

  function deactivate(i) {
    const s = slides[i];
    s.classList.remove('active');
    $$('mark,.strike', s).forEach((m) => m.classList.remove('on'));
    gsap.set($$('[data-a],.title .w,.cw', s), { clearProps: 'transform,opacity,visibility' });
  }

  const ir = $$('.ir');
  const irisSet = (r) => gsap.set(ir, { '--r': r + 'px' });
  irisSet(0);

  function go(n) {
    n = clamp(n, 0, N - 1);
    if (n === want) return;
    want = n;
    tl?.kill(); irisSet(0);
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
      const [ox, oy] = ORIGINS[n % ORIGINS.length];
      $('#iris').style.setProperty('--phase', PHASE_COLOR[slides[n].dataset.phase]);
      gsap.set(ir, { '--x': ox + 'px', '--y': oy + 'px' });
      tl = gsap.timeline()
        .to(ir[0], { '--r': '2500px', duration: 0.5, ease: 'power3.in' }, 0)
        .to(ir[1], { '--r': '2500px', duration: 0.5, ease: 'power3.in' }, 0.1)
        .add(begin)
        .to(ir[1], { '--r': '0px', duration: 0.55, ease: 'power3.out' }, '+=0.02')
        .to(ir[0], { '--r': '0px', duration: 0.55, ease: 'power3.out' }, '<0.1');
    } else begin();
  }

  const notes = $('#notes'), menu = $('#menu');
  function toggleNotes(force) {
    const show = force ?? notes.hidden;
    notes.hidden = !show;
    if (show) gsap.fromTo(notes, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'back.out(1.4)', clearProps: 'transform' });
  }
  function closeMenu() { menu.hidden = true; }
  function toggleMenu() { menu.hidden = !menu.hidden; if (!menu.hidden) gsap.fromTo('#menuGrid button', { y: 26, autoAlpha: 0, rotate: -2 }, { y: 0, autoAlpha: 1, rotate: 0, stagger: 0.03, duration: 0.5, ease: 'back.out(1.6)', clearProps: 'all' }); }
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

  // inclinación 3D de tarjetas (.tilt)
  stage.addEventListener('pointermove', (e) => {
    if (motion.reduced) return;
    const el = e.target.closest?.('.tilt'); if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(el, { rotationY: px * 8, rotationX: -py * 8, transformPerspective: 1000, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
  });
  stage.addEventListener('pointerout', (e) => {
    const el = e.target.closest?.('.tilt');
    if (el && !el.contains(e.relatedTarget)) gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.7, ease: 'elastic.out(1,.6)', overwrite: 'auto' });
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
  stage.addEventListener('touchstart', (e) => { sx = e.target.closest('canvas,input,textarea,.cc,[contenteditable]') ? null : e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 90) go(want + (dx < 0 ? 1 : -1)); sx = null; });

  return { go, slides, hooks, get index() { return want; }, N };
}
