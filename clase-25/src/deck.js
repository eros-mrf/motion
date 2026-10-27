import { gsap } from 'gsap';
import { $, $$, clamp, toast, motion } from '../../src/util.js';
import { PHASES, NOTES } from './data.js';

const PHASE_COLOR = Object.fromEntries(Object.entries(PHASES).map(([k, v]) => [k, v.color]));
const PITCH = 32; // separación horizontal de las marcas de la regla

// Parte un título en palabras con máscara (<span class="w"><span class="wi">…</span></span>), respetando <em> internos.
function splitWords(el) {
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
          else { const w = document.createElement('span'); w.className = 'w'; const wi = document.createElement('span'); wi.className = 'wi'; wi.textContent = tk; w.appendChild(wi); frag.appendChild(w); }
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

  // ---- regla de diapositivas ----
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
    $('#pin').style.transform = `translateX(${want * PITCH}px)`;
    $$('#menuGrid button').forEach((b, i) => b.classList.toggle('on', i === want));
    $('#counter').textContent = `${String(want + 1).padStart(2, '0')} / ${N}`;
    $('.phase-name').textContent = ph.name; $('.phase-min').textContent = `${ph.min} min`;
    $('#phaseChip').style.setProperty('--phase', PHASE_COLOR[s.dataset.phase]);
    $('#notesBody').innerHTML = NOTES[want] || '';
    $('#notesPhase').textContent = `${want + 1}/${N} · ${ph.name}`;
    history.replaceState(null, '', `#${want + 1}`);
  }

  // ---- entrada: las palabras suben dentro de su máscara y el marcador amarillo subraya lo importante ----
  function enterTL(slide) {
    const t = gsap.timeline();
    const quick = motion.reduced || fast;
    const title = $('.title[data-a="title"]', slide);
    if (title) splitWords(title);
    const words = title ? $$('.wi', title) : [];
    const ems = title ? $$('em', title) : [];
    if (quick) { gsap.set(words, { yPercent: 0 }); gsap.set(ems, { '--k': 1 }); }
    else {
      if (words.length) t.fromTo(words, { yPercent: 115 }, { yPercent: 0, duration: 0.75, ease: 'expo.out', stagger: 0.06, clearProps: 'transform' }, 0.05);
      if (ems.length) t.fromTo(ems, { '--k': 0 }, { '--k': 1, duration: 0.7, ease: 'power3.inOut', stagger: 0.12 }, 0.55);
    }
    const els = $$('[data-a]', slide).filter((e) => e.dataset.a !== 'title');
    const clean = { clearProps: 'transform,opacity,visibility,clipPath' };
    if (quick) { t.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.25, ...clean }, 0); return t; }
    t.fromTo(els, { opacity: 0, y: 40, rotation: 0.6, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, rotation: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.out', stagger: 0.09, ...clean }, 0.2);
    return t;
  }

  function deactivate(i) {
    const s = slides[i];
    s.classList.remove('active');
    gsap.set($$('[data-a],.title .wi', s), { clearProps: 'transform,opacity,visibility,clipPath' });
  }

  // ---- transición: mosaico de cuadrícula (16 × 9) que se enciende y se apaga ----
  const pane = $('#pane');
  const tiles = Array.from({ length: 144 }, () => pane.appendChild(document.createElement('i')));
  const hidePane = () => gsap.set(tiles, { scale: 0 });

  function go(n) {
    n = clamp(n, 0, N - 1);
    if (n === want) return;
    want = n;
    tl?.kill(); hidePane();
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
        .to(tiles, { scale: 1.02, duration: 0.28, ease: 'power2.out', stagger: { grid: [9, 16], from: 'start', amount: 0.42 } })
        .add(begin)
        .to(tiles, { scale: 0, duration: 0.28, ease: 'power2.in', stagger: { grid: [9, 16], from: 'end', amount: 0.42 } }, '+=0.02');
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

  // mira del plano: líneas finas y coordenadas siguen al cursor
  const cross = $('#cross'), crossTxt = $('#crossTxt');
  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' || motion.reduced) { cross.classList.remove('on'); return; }
    cross.classList.add('on');
    cross.style.setProperty('--cx', e.clientX + 'px'); cross.style.setProperty('--cy', e.clientY + 'px');
    const k = Math.min(innerWidth / 1920, innerHeight / 1080);
    const ox = (innerWidth - 1920 * k) / 2, oy = (innerHeight - 1080 * k) / 2;
    crossTxt.textContent = `x ${String(Math.round((e.clientX - ox) / k)).padStart(4, '0')} · y ${String(Math.round((e.clientY - oy) / k)).padStart(4, '0')}`;
  });
  document.documentElement.addEventListener('pointerleave', () => cross.classList.remove('on'));

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
  stage.addEventListener('touchstart', (e) => { sx = e.target.closest('canvas,input,textarea,select,.vchip,.rchip,[contenteditable]') ? null : e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 90) go(want + (dx < 0 ? 1 : -1)); sx = null; });

  return { go, slides, hooks, get index() { return want; }, N };
}
