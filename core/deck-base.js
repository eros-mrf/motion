// Motor común de presentaciones: escalado del escenario, regla de diapositivas, índice, notas, reloj,
// movimiento reducido, teclado y táctil. Lo propio de cada clase (transición y efecto de títulos) entra por `effects`.
//
//   createDeck({ phases, notes, onChange, effects })
//   effects.enter(slide, tl, quick)  → agrega a `tl` la entrada de la diapositiva (obligatorio)
//   effects.clear                    → selector extra a limpiar al salir (opcional)
//   effects.step(want)               → se llama al cambiar de diapositiva (p. ej. mover un pin) (opcional)
//   effects.transition               → { out(tl), in(tl), reset() } (opcional; sin él, corte directo)
import { gsap } from 'gsap';
import { $, $$, clamp, toast, motion } from '../src/util.js';

export function createDeck({ phases, notes: NOTES, onChange, effects }) {
  const stage = $('#stage');
  const slides = $$('#slides > .slide');
  const N = slides.length;
  const hooks = { enter: {}, leave: {} };
  const color = (s) => phases[s.dataset.phase].color;
  let want = -1, shown = -1, tl = null;
  const visited = new Set();
  const fast = new URLSearchParams(location.search).has('fast');

  const fit = () => { stage.style.transform = `translate(-50%,-50%) scale(${Math.min(innerWidth / 1920, innerHeight / 1080)})`; };
  fit(); addEventListener('resize', fit);

  // ---- regla de diapositivas e índice ----
  const journey = $('#journey'), menuGrid = $('#menuGrid');
  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.setAttribute('role', 'tab'); b.title = `${i + 1}. ${s.dataset.title}`; b.setAttribute('aria-label', b.title);
    b.style.setProperty('--jc', color(s));
    b.addEventListener('click', () => go(i));
    journey.appendChild(b);
    const m = document.createElement('button');
    m.style.setProperty('--c', color(s));
    m.innerHTML = `<span class="mn">${String(i + 1).padStart(2, '0')} · ${phases[s.dataset.phase].name.toUpperCase()}</span><span class="mt">${s.dataset.title}</span>`;
    m.addEventListener('click', () => { closeMenu(); go(i); });
    menuGrid.appendChild(m);
  });
  function updateHUD() {
    const s = slides[want], ph = phases[s.dataset.phase];
    visited.add(want);
    $$('#journey button').forEach((b, i) => { b.classList.toggle('on', i === want); b.classList.toggle('seen', i !== want && visited.has(i)); b.setAttribute('aria-selected', i === want); });
    $$('#menuGrid button').forEach((b, i) => b.classList.toggle('on', i === want));
    $('#counter').textContent = `${String(want + 1).padStart(2, '0')} / ${N}`;
    $('.phase-name').textContent = ph.name; $('.phase-min').textContent = `${ph.min} min`;
    $('#phaseChip').style.setProperty('--phase', color(s));
    $('#notesBody').innerHTML = NOTES[want] || '';
    $('#notesPhase').textContent = `${want + 1}/${N} · ${ph.name}`;
    history.replaceState(null, '', `#${want + 1}`);
    effects.step?.(want);
  }

  function deactivate(i) {
    const s = slides[i];
    s.classList.remove('active');
    gsap.set($$(`[data-a]${effects.clear ? ',' + effects.clear : ''}`, s), { clearProps: 'transform,opacity,visibility,clipPath,filter' });
  }

  function go(n) {
    n = clamp(n, 0, N - 1);
    if (n === want) return;
    want = n;
    tl?.kill(); effects.transition?.reset();
    slides.forEach((_, i) => { if (i !== shown && i !== n) deactivate(i); });
    updateHUD();
    onChange?.(n);
    const begin = () => {
      if (shown >= 0 && shown !== n) { hooks.leave[shown]?.(); deactivate(shown); }
      shown = n;
      slides[n].classList.add('active');
      hooks.enter[n]?.();
      const t = gsap.timeline();
      effects.enter(slides[n], t, motion.reduced || fast);
    };
    if (effects.transition && shown >= 0 && shown !== n && !motion.reduced && !fast) {
      tl = gsap.timeline(); effects.transition.out(tl); tl.add(begin); effects.transition.in(tl);
    } else begin();
  }

  // ---- notas, índice, pantalla completa ----
  const notes = $('#notes'), menu = $('#menu');
  function toggleNotes(force) {
    const show = force ?? notes.hidden;
    notes.hidden = !show;
    if (show) gsap.fromTo(notes, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', clearProps: 'transform' });
  }
  function closeMenu() { menu.hidden = true; }
  function toggleMenu() { menu.hidden = !menu.hidden; if (!menu.hidden) gsap.fromTo('#menuGrid button', { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.03, duration: 0.6, ease: 'expo.out', clearProps: 'all' }); }
  function toggleFs() { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); }

  // ---- movimiento reducido (sistema + botón/M) ----
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

  // ---- reloj de clase (T inicia/pausa, Shift+T reinicia) ----
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
  stage.addEventListener('touchstart', (e) => { sx = e.target.closest('canvas,input,textarea,select,[draggable],.no-swipe,[contenteditable]') ? null : e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 90) go(want + (dx < 0 ? 1 : -1)); sx = null; });

  return { go, slides, hooks, get index() { return want; }, N };
}
