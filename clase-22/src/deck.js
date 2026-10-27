import { gsap } from 'gsap';
import { $, $$, clamp, toast, motion } from '../../src/util.js';
import { PHASES, NOTES } from './data.js';

const PHASE_COLOR = Object.fromEntries(Object.entries(PHASES).map(([k, v]) => [k, v.color]));

// Parte un título en palabras y letras (cada letra "voltea" como en un tablero de andén), respetando <em> internos.
function splitChars(el) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
  el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  const walk = (node) => {
    [...node.childNodes].forEach((c) => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach((tk) => {
          if (!tk) return;
          if (/^\s+$/.test(tk)) frag.appendChild(document.createTextNode(' '));
          else {
            const w = document.createElement('span'); w.className = 'w';
            [...tk].forEach((ch) => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; w.appendChild(s); });
            frag.appendChild(w);
          }
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

  // ---- ruta de andenes ----
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
    $('#train').style.transform = `translateX(${want * 42}px)`;
    $$('#menuGrid button').forEach((b, i) => b.classList.toggle('on', i === want));
    $('#counter').textContent = `${String(want + 1).padStart(2, '0')} / ${N}`;
    $('.phase-name').textContent = ph.name; $('.phase-min').textContent = `${ph.min} min`;
    $('#phaseChip').style.setProperty('--phase', PHASE_COLOR[s.dataset.phase]);
    $('#notesBody').innerHTML = NOTES[want] || '';
    $('#notesPhase').textContent = `${want + 1}/${N} · ${ph.name}`;
    history.replaceState(null, '', `#${want + 1}`);
  }

  // ---- entrada: las letras del título voltean como un tablero; los paneles se revelan con un barrido ----
  function enterTL(slide) {
    const t = gsap.timeline();
    const quick = motion.reduced || fast;
    const title = $('.title[data-a="title"]', slide);
    if (title) splitChars(title);
    const chars = title ? $$('.ch', title) : [];
    if (quick) gsap.set(chars, { opacity: 1 });
    else if (chars.length) t.fromTo(chars, { opacity: 0, rotationX: -95, y: 14 }, { opacity: 1, rotationX: 0, y: 0, duration: 0.55, ease: 'back.out(1.5)', stagger: { each: 0.016, from: 'start' }, clearProps: 'transform,opacity' }, 0.05);
    const els = $$('[data-a]', slide).filter((e) => e.dataset.a !== 'title');
    const clean = { clearProps: 'transform,opacity,visibility,clipPath' };
    if (quick) { t.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.25, ...clean }, 0); return t; }
    t.fromTo(els, { opacity: 0, y: 34, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power3.out', stagger: 0.08, ...clean }, 0.2);
    return t;
  }

  function deactivate(i) {
    const s = slides[i];
    s.classList.remove('active');
    gsap.set($$('[data-a],.title .ch', s), { clearProps: 'transform,opacity,visibility,clipPath' });
  }

  // ---- barrido de radar: una aguja ámbar gira, cubre la pantalla y la descubre ----
  const pane = $('#pane'), hand = $('#paneHand');
  const sw = { a: 0, b: 0, on: 0 };
  const paint = () => {
    pane.style.setProperty('--a', `${sw.a}deg`); pane.style.setProperty('--b', `${sw.b}deg`);
    const ang = (sw.b > 0 ? sw.b : sw.a) - 90;
    hand.style.transform = `rotate(${ang}deg)`; hand.style.opacity = sw.on;
  };
  const resetSweep = () => { sw.a = 0; sw.b = 0; sw.on = 0; paint(); };
  resetSweep();

  function go(n) {
    n = clamp(n, 0, N - 1);
    if (n === want) return;
    want = n;
    tl?.kill(); resetSweep();
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
        .set(sw, { on: 1 })
        .to(sw, { a: 360, duration: 0.5, ease: 'power2.in', onUpdate: paint })
        .add(begin)
        .to(sw, { b: 360, duration: 0.55, ease: 'power2.out', onUpdate: paint })
        .add(resetSweep);
    } else begin();
  }

  const notes = $('#notes'), menu = $('#menu');
  function toggleNotes(force) {
    const show = force ?? notes.hidden;
    notes.hidden = !show;
    if (show) gsap.fromTo(notes, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', clearProps: 'transform' });
  }
  function closeMenu() { menu.hidden = true; }
  function toggleMenu() { menu.hidden = !menu.hidden; if (!menu.hidden) gsap.fromTo('#menuGrid button', { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.03, duration: 0.6, ease: 'expo.out', clearProps: 'all' }); }
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
  stage.addEventListener('touchstart', (e) => { sx = e.target.closest('canvas,input,textarea,select,[contenteditable]') ? null : e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 90) go(want + (dx < 0 ? 1 : -1)); sx = null; });

  return { go, slides, hooks, get index() { return want; }, N };
}
