import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { $, $$, toast, confetti as confettiRaw, motion, rng } from '../../src/util.js';
import * as D from './data.js';

gsap.registerPlugin(Draggable);

const PAL = ['#ff4a1c', '#2447ff', '#ffb300', '#0fa37f', '#15120f'];
const confetti = (x, y, n) => confettiRaw(x, y, n, PAL);
const CV = { verm: 'var(--verm)', cobalt: 'var(--cobalt)', mari: 'var(--mari)', jade: 'var(--jade)' };
const store = {
  get(k, d = '') { try { return localStorage.getItem('c20:' + k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('c20:' + k, v); } catch { /* sin almacenamiento */ } },
};
const dur = (d) => (motion.reduced ? 0.01 : d);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const wordsOf = (t) => t.trim().split(/\s+/).filter(Boolean).length;
const NS = 'http://www.w3.org/2000/svg';
function srect(el) {
  const s = $('#stage').getBoundingClientRect(), r = el.getBoundingClientRect(), k = s.width / 1920;
  return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
}
const stagePoint = (el) => { const r = srect(el); return [r.x + r.w / 2, r.y + r.h / 2]; };
function typeInto(el, text, d = 1) {
  if (motion.reduced) { el.textContent = text; return null; }
  const o = { n: 0 };
  el.textContent = '';
  return gsap.to(o, { n: text.length, duration: Math.min(1.6, text.length * 0.016) * d, ease: 'none', onUpdate: () => { el.textContent = text.slice(0, Math.round(o.n)); } });
}
function countUp(el, to, suffix = '', d = 0.9) {
  const o = { v: 0 };
  gsap.to(o, { v: to, duration: dur(d), ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v) + suffix; } });
}
const svgEl = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); parent?.appendChild(e); return e; };

// Gráfico de barras en SVG (vertical u horizontal). Devuelve los grupos de cada barra.
function drawBars(svg, { labels, values, vmax, W, H, horizontal = false, axes = true, vals = true, color = 'var(--cobalt)', grow = true }) {
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const n = values.length;
  const L = horizontal ? 130 : 54, B = horizontal ? 26 : 46, T = 26, Rr = horizontal ? 70 : 14;
  const pw = W - L - Rr, ph = H - T - B;
  const ticks = [];
  if (axes) {
    const step = vmax <= 60 ? 10 : 20;
    for (let v = 0; v <= vmax; v += step) ticks.push(v);
  }
  const extras = [];
  ticks.forEach((v) => {
    if (horizontal) { const x = L + (v / vmax) * pw; extras.push(svgEl('line', { x1: x, y1: T, x2: x, y2: T + ph, stroke: 'rgba(21,18,15,.14)', 'stroke-width': 2 }, svg)); extras.push(svgEl('text', { x, y: H - 4, 'text-anchor': 'middle', class: 'axl' }, svg)).textContent = v; }
    else { const y = T + ph - (v / vmax) * ph; extras.push(svgEl('line', { x1: L, y1: y, x2: L + pw, y2: y, stroke: 'rgba(21,18,15,.14)', 'stroke-width': 2 }, svg)); extras.push(svgEl('text', { x: L - 10, y: y + 5, 'text-anchor': 'end', class: 'axl' }, svg)).textContent = v; }
  });
  svgEl('line', horizontal ? { x1: L, y1: T, x2: L, y2: T + ph, stroke: '#15120f', 'stroke-width': 4 } : { x1: L, y1: T + ph, x2: L + pw, y2: T + ph, stroke: '#15120f', 'stroke-width': 4 }, svg);
  const groups = values.map((v, i) => {
    const g = svgEl('g', { class: 'bar-r', 'data-i': i, tabindex: 0, role: 'button', 'aria-label': `${labels[i]}: ${v}` }, svg);
    if (horizontal) {
      const bh = (ph / n) * 0.62, y = T + (ph / n) * i + ((ph / n) - bh) / 2, w = (v / vmax) * pw;
      svgEl('rect', { class: 'b', x: L, y, width: w, height: bh, rx: 6 }, g);
      if (vals) svgEl('text', { x: L + w + 10, y: y + bh / 2 + 8, class: 'vtx' }, g).textContent = v + ' %';
      svgEl('text', { x: L - 12, y: y + bh / 2 + 6, 'text-anchor': 'end', class: 'xl' }, g).textContent = labels[i];
    } else {
      const bw = (pw / n) * 0.62, x = L + (pw / n) * i + ((pw / n) - bw) / 2, h = (v / vmax) * ph;
      svgEl('rect', { class: 'b', x, y: T + ph - h, width: bw, height: h, rx: 6 }, g);
      if (vals) svgEl('text', { x: x + bw / 2, y: T + ph - h - 10, 'text-anchor': 'middle', class: 'vtx' }, g).textContent = v;
      if (axes) svgEl('text', { x: x + bw / 2, y: H - 14, 'text-anchor': 'middle', class: 'xl' }, g).textContent = labels[i];
    }
    return g;
  });
  if (grow && !motion.reduced) {
    gsap.fromTo($$('rect.b', svg), horizontal ? { scaleX: 0 } : { scaleY: 0 }, { ...(horizontal ? { scaleX: 1 } : { scaleY: 1 }), duration: 0.9, ease: 'elastic.out(1,.65)', stagger: 0.07, clearProps: 'transform' });
  }
  return { groups, extras };
}

export function initSlides(deck, three) {
  initRoute(deck);
  initGuess();
  initQuestions();
  initVocab();
  initFVDI(deck, three);
  initDesc();
  initHead();
  initFair(deck, three);
  initLab();
  initConcl();
  initWrite();
  initWords(deck, three);
  initTicket();
}

/* ---------- 2 · ruta ---------- */
function initRoute(deck) {
  deck.hooks.enter[1] = () => {
    gsap.fromTo('.steps li', { y: 60, rotate: (i) => (i % 2 ? 3 : -3), opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: dur(0.7), stagger: 0.1, ease: 'back.out(1.8)', delay: 0.5, clearProps: 'transform,opacity' });
    gsap.fromTo('.sn', { scale: 0, rotate: -180 }, { scale: 1, rotate: 0, duration: dur(0.7), stagger: 0.1, ease: 'back.out(2.2)', delay: 0.85, clearProps: 'transform' });
    gsap.fromTo('.timeline .seg', { scaleY: 0, transformOrigin: 'bottom' }, { scaleY: 1, duration: dur(0.6), stagger: 0.07, ease: 'back.out(1.6)', delay: 1.1, clearProps: 'transform' });
  };
}

/* ---------- 3 · titular rápido ---------- */
function initGuess() {
  const S = D.SERIES.talleres;
  const svg = $('#gchart'), card = $('#gcard');
  let revealed = false, picked = null, ctx = 0;
  const draw = (rev, grow) => drawBars(svg, { labels: S.labels, values: S.values, vmax: 60, W: 640, H: 340, axes: rev, vals: rev, grow });
  const opts = $('#guessOpts');
  opts.innerHTML = D.GUESS.map((g, i) => `<button class="opt" data-i="${i}"><i>${'ABCD'[i]}</i>${g.t}</button>`).join('');
  const fb = $('#guessFb');
  const setFb = (h) => { fb.innerHTML = h; gsap.fromTo(fb, { y: 10, opacity: 0.4 }, { y: 0, opacity: 1, duration: dur(0.4), clearProps: 'transform,opacity' }); };
  draw(false, false);
  opts.addEventListener('click', (e) => {
    const b = e.target.closest('.opt'); if (!b) return;
    picked = +b.dataset.i;
    $$('.opt', opts).forEach((x) => x.classList.toggle('sel', x === b));
    $('#revealBtn').disabled = false;
    setFb(D.GUESS[picked].best ? '<b>Prudente.</b> Sin título, población ni fuente es imposible saber qué mide. Revelemos el contexto.' : `Elegiste «${esc(D.GUESS[picked].t)}». Ahora revelemos el contexto y comparemos.`);
  });
  function showCtx(i) {
    ctx = i;
    const c = D.CONTEXTS[i];
    $$('#ctxTabs button').forEach((b, k) => b.classList.toggle('on', k === i));
    typeInto($('#gcTitle'), c.title, 0.7);
    $('#gcStamp').textContent = c.mood === 'good' ? '+' : c.mood === 'bad' ? '−' : '?';
    $('#gcStamp').style.background = c.mood === 'good' ? 'var(--jade)' : c.mood === 'bad' ? 'var(--verm)' : 'var(--mari)';
    $('#ctxRead').textContent = c.read;
    $('#gcPop').textContent = i === 0 ? D.REVEAL.pop : i === 1 ? 'Personas que piden hora en un centro de salud' : 'Comuna de 80.000 personas';
    $('#gcSrc').textContent = D.REVEAL.src;
  }
  $('#revealBtn').onclick = () => {
    if (revealed) return;
    revealed = true; $('#revealBtn').disabled = true;
    card.classList.add('revealed');
    draw(true, false);
    gsap.fromTo([...$$('.axl', svg), ...$$('.vtx', svg), ...$$('.xl', svg)], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: dur(0.5), stagger: 0.02, clearProps: 'transform' });
    gsap.fromTo('#gcStamp', { scale: 2.4, rotate: -30, opacity: 0 }, { scale: 1, rotate: 8, opacity: 1, duration: dur(0.6), ease: 'back.out(2)' });
    $('#ctxBox').hidden = false;
    $('#ctxTabs').innerHTML = D.CONTEXTS.map((c, i) => `<button class="${i === 0 ? 'on' : ''}" data-i="${i}">${['Talleres', 'Espera', 'Casos'][i]}</button>`).join('');
    gsap.fromTo('#ctxBox', { y: 30, opacity: 0, rotate: -2 }, { y: 0, opacity: 1, rotate: 0, duration: dur(0.6), ease: 'back.out(1.6)', clearProps: 'transform,opacity' });
    showCtx(0);
    const g = D.GUESS[picked ?? 3];
    setFb(g.best ? '<b>¡Exacto!</b> Es un gráfico de asistencia a talleres de prevención. Las mismas barras podrían significar cosas muy distintas.' : g.alarm ? '<b>Cuidado:</b> sin contexto parecía que había más infecciones, ¡pero mide asistencia a talleres! Un titular alarmista nace de leer sin contexto.' : '<b>Casi.</b> Podías suponerlo, pero sin contexto era solo una apuesta. Aquí sí es asistencia a talleres de prevención.');
  };
  $('#ctxTabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) showCtx(+b.dataset.i); });
  $('#guessReset').onclick = () => {
    revealed = false; picked = null; card.classList.remove('revealed');
    $$('.opt', opts).forEach((x) => x.classList.remove('sel'));
    $('#revealBtn').disabled = true; $('#ctxBox').hidden = true;
    $('#gcTitle').textContent = 'GRÁFICO SIN TÍTULO'; $('#gcStamp').textContent = '¿?'; $('#gcStamp').style.background = '';
    $('#gcPop').textContent = '—'; $('#gcSrc').textContent = '—';
    fb.textContent = 'Elige un titular para el gráfico.';
    draw(false, true);
  };
}

/* ---------- 4 · preguntas: abanico de tarjetas ---------- */
function initQuestions() {
  const fan = $('#fan');
  fan.innerHTML = D.QUESTIONS.map((q, i) => `<button class="fcard" role="listitem" data-i="${i}" style="--cc:${CV[q.c]};${q.c === 'cobalt' ? 'color:#fff' : ''}"><span class="fn">${i + 1}</span>${q.q}</button>`).join('');
  const cards = $$('.fcard', fan);
  let cur = -1, tw;
  const place = () => cards.forEach((c, i) => {
    const sel = i === cur;
    gsap.to(c, { x: sel ? 70 : (i % 2) * 14, y: i * 122, rotate: sel ? 0 : (i - 2) * 0.7, scale: sel ? 1.03 : 1, zIndex: sel ? 10 : 1, duration: dur(0.55), ease: 'back.out(1.5)' });
  });
  function show(i, first) {
    if (i === cur) return;
    cur = i;
    cards.forEach((c, k) => { if (k === i) c.classList.add('seen'); });
    place();
    $('#npTag').textContent = `PISTA ${i + 1} DE ${D.QUESTIONS.length}`;
    $('#notePad .pin').style.background = CV[D.QUESTIONS[i].c];
    tw?.kill();
    if (first || motion.reduced) { $('#npText').textContent = D.QUESTIONS[i].idea; return; }
    gsap.fromTo('#notePad', { rotate: 5, y: -24, scale: 0.96 }, { rotate: 1.6, y: 0, scale: 1, duration: 0.6, ease: 'back.out(2)' });
    tw = typeInto($('#npText'), D.QUESTIONS[i].idea);
  }
  fan.addEventListener('click', (e) => { const c = e.target.closest('.fcard'); if (c) show(+c.dataset.i); });
  cards.forEach((c, i) => gsap.set(c, { x: (i % 2) * 14, y: i * 122, rotate: (i - 2) * 0.7 }));
  show(0, true);
}

/* ---------- 5 · vocabulario: emparejar ---------- */
function initVocab() {
  const terms = $('#mTerms'), defs = $('#mDefs'), lines = $('#mLines'), box = $('.match');
  const R = rng(20);
  const order = D.VOCAB.map((_, i) => i).sort(() => R() - 0.5);
  let sel = null, score = 0;
  const build = () => {
    terms.innerHTML = D.VOCAB.map((v, i) => `<button class="mi term" data-i="${i}">${v.t}</button>`).join('');
    defs.innerHTML = order.map((i) => `<button class="mi def" data-i="${i}">${D.VOCAB[i].d}</button>`).join('');
    lines.innerHTML = ''; sel = null; score = 0; $('#mScore').textContent = 0;
  };
  build();
  const pos = (el, side) => {
    const col = el.parentElement;
    return [col.offsetLeft + el.offsetLeft + (side === 'r' ? el.offsetWidth : 0), col.offsetTop + el.offsetTop + el.offsetHeight / 2];
  };
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.mi'); if (!b || b.classList.contains('ok')) return;
    if (b.classList.contains('term')) { $$('.term.sel', terms).forEach((x) => x.classList.remove('sel')); sel = b; b.classList.add('sel'); return; }
    if (!sel) { toast('Primero toca una palabra de la izquierda'); return; }
    if (sel.dataset.i === b.dataset.i) {
      sel.classList.remove('sel'); sel.classList.add('ok'); b.classList.add('ok');
      lines.setAttribute('viewBox', `0 0 ${box.offsetWidth} ${box.offsetHeight}`);
      const [x1, y1] = pos(sel, 'r'), [x2, y2] = pos(b, 'l');
      const p = svgEl('path', { d: `M${x1} ${y1} C ${x1 + 130} ${y1}, ${x2 - 130} ${y2}, ${x2} ${y2}`, pathLength: 1 }, lines);
      gsap.to(p, { strokeDashoffset: 0, duration: dur(0.7), ease: 'power2.out' });
      gsap.fromTo([sel, b], { scale: 1.06 }, { scale: 1, duration: dur(0.4), ease: 'back.out(3)', clearProps: 'transform' });
      sel = null; score++; $('#mScore').textContent = score;
      if (score === D.VOCAB.length) { confetti(960, 540, 140); toast('¡10 de 10 pares!'); }
    } else {
      [sel, b].forEach((x) => { x.classList.add('bad'); setTimeout(() => x.classList.remove('bad'), 500); });
      sel.classList.remove('sel'); sel = null;
    }
  });
  $('#mReset').onclick = build;
}

/* ---------- 6 · F-V-D-I en 3D ---------- */
function initFVDI(deck, three) {
  const stepsEl = $('#fvSteps');
  stepsEl.innerHTML = D.FVDI.map((s, i) => `<button role="tab" data-i="${i}" style="--sc:${CV[s.c]}">${s.k}<small>${s.name}</small></button>`).join('');
  let cur = 0, tw;
  function show(i, animate = true) {
    cur = i;
    const s = D.FVDI[i];
    $$('button', stepsEl).forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('done', k < i); b.setAttribute('aria-selected', k === i); });
    $('#fvCard').innerHTML = `<div class="tag mono"><b>PASO ${i + 1}</b> · ${s.k}</div><h3>${s.name}</h3><p class="ask">${s.ask}</p><p class="say" id="fvSay"></p>`;
    tw?.kill();
    if (animate) { gsap.fromTo('#fvCard', { rotate: -2, y: 16 }, { rotate: 0, y: 0, duration: dur(0.5), ease: 'back.out(2)', clearProps: 'transform' }); tw = typeInto($('#fvSay'), s.say, 0.8); }
    else $('#fvSay').textContent = s.say;
    three.chart.setStep(i);
    $('#fvPrev').disabled = i === 0; $('#fvNext').textContent = i === D.FVDI.length - 1 ? 'Volver a F ↺' : 'Siguiente ▸';
  }
  stepsEl.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show(+b.dataset.i); });
  $('#fvPrev').onclick = () => show(Math.max(0, cur - 1));
  $('#fvNext').onclick = () => show(cur === D.FVDI.length - 1 ? 0 : cur + 1);
  three.onBar = (i, label, v) => toast(`${label}: ${v} consultas por 1.000 personas`);
  deck.hooks.enter[5] = () => { three.live.chart = true; three.chart.resize(); three.chart.grow(); show(0, false); };
  deck.hooks.leave[5] = () => { three.live.chart = false; };
}

/* ---------- 7 · describir vs inferir ---------- */
function initDesc() {
  const S = D.SERIES.consultas;
  const { groups } = drawBars($('#dChart'), { labels: S.labels, values: S.values, vmax: 60, W: 560, H: 290, grow: false });
  const HL = [[5], [1, 2], [], [], [3, 4], []];
  $('#descWords').innerHTML = D.DESC_WORDS.map((w) => `<span class="wp">${w}</span>`).join('');
  $('#infWords').innerHTML = D.INF_WORDS.map((w) => `<span class="wp inf">${w}</span>`).join('');
  const box = $('#stm');
  box.innerHTML = D.STATEMENTS.map((s, i) => `<div class="st" data-i="${i}" data-a><p>${s.t}</p><div class="btns"><button data-a="describe">Lo veo en el gráfico</button><button data-a="infiere">Necesita más evidencia</button></div><p class="why">${s.why}</p></div>`).join('');
  let done = 0, good = 0;
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.btns button'); if (!b) return;
    const st = b.closest('.st'), i = +st.dataset.i;
    if (st.classList.contains('done')) return;
    const ok = b.dataset.a === D.STATEMENTS[i].a;
    st.classList.add('done', ok ? 'right' : 'wrong'); b.classList.add('pick');
    $$('.btns button', st).forEach((x) => (x.disabled = true));
    done++; if (ok) good++;
    $$('.bar-r', $('#dChart')).forEach((g, k) => g.classList.toggle('hl', HL[i].includes(k)));
    $$('#dChart .bar-r rect.b').forEach((r, k) => { r.style.fill = HL[i].includes(k) ? 'var(--mari)' : ''; });
    gsap.fromTo(st, { x: ok ? 0 : -8 }, { x: 0, duration: dur(0.5), ease: 'elastic.out(1,.3)', clearProps: 'transform' });
    $('#descScore').textContent = `${done} / 6 clasificadas · ${good} aciertos`;
    if (done === 6 && good === 6) { confetti(960, 640, 120); toast('¡6 de 6! Describes sin inventar causas'); }
  });
}

/* ---------- 8 · constructor de titulares ---------- */
function initHead() {
  const sel = D.HEAD.slots.map(() => -1);
  const box = $('#slotsBox');
  box.innerHTML = D.HEAD.slots.map((s, si) => `<div class="brow" data-a><span class="tag mono">${si + 1} · ${s.name.toUpperCase()}</span><div class="row">${s.opts.map((o, oi) => `<button class="chip-opt" data-s="${si}" data-o="${oi}">${o.label || o.t}</button>`).join('')}</div></div>`).join('');
  const front = $('#frontText'), stamp = $('#frontStamp');
  function paint(why) {
    const parts = D.HEAD.slots.map((s, i) => (sel[i] >= 0 ? s.opts[sel[i]].t : null));
    const filled = sel.filter((x) => x >= 0).length;
    const txt = parts.map((p, i) => (p === null ? `<span class="ph">…${D.HEAD.slots[i].name.toLowerCase()}…</span>` : esc(p))).filter((p, i) => parts[i] !== '' ).join(' ');
    front.innerHTML = txt;
    let a = 0, c = 0, p = 0;
    sel.forEach((o, i) => { if (o >= 0) { const op = D.HEAD.slots[i].opts[o]; a += op.a; c += op.c; p += op.p; } });
    $('#mAlarm').style.width = Math.min(100, a * 25) + '%';
    $('#mCause').style.width = Math.min(100, c * 100) + '%';
    $('#mPrec').style.width = Math.min(100, p * 25) + '%';
    stamp.classList.remove('show', 'good', 'bad', 'mid');
    if (filled === D.HEAD.slots.length) {
      const k = a === 0 && c === 0 && p >= 3 ? 'good' : a >= 2 || c ? 'bad' : 'mid';
      stamp.textContent = k === 'good' ? 'RESPONSABLE' : k === 'bad' ? 'SENSACIONALISTA' : 'MEJORABLE';
      stamp.classList.add('show', k);
      gsap.fromTo(stamp, { scale: 2.4, rotate: -30, opacity: 0 }, { scale: 1, rotate: -8, opacity: 1, duration: dur(0.5), ease: 'back.out(2.2)' });
      if (k === 'good') confetti(...stagePoint($('.paper')), 80);
    }
    if (why) $('#headWhy').textContent = why;
    gsap.fromTo(front, { scale: 0.97, opacity: 0.6 }, { scale: 1, opacity: 1, duration: dur(0.35), clearProps: 'transform,opacity' });
  }
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.chip-opt'); if (!b) return;
    const si = +b.dataset.s, oi = +b.dataset.o;
    sel[si] = oi;
    $$(`.chip-opt[data-s="${si}"]`, box).forEach((x) => x.classList.toggle('on', x === b));
    paint(D.HEAD.slots[si].opts[oi].why);
  });
  paint();
}

/* ---------- 9 · comparación justa ---------- */
function initFair(deck, three) {
  const cards = $('#distCards');
  cards.innerHTML = D.DISTRICTS.map((d) => `<div class="dc card ${d.color}" data-id="${d.id}"><h4>${d.name}</h4><div class="big" data-big>${d.cases}</div><div class="sub" data-sub>casos notificados</div><div class="sub">Población: ${d.pop.toLocaleString('es-CL')} personas</div></div>`).join('');
  let mode = 'total';
  function paint(animate) {
    $$('.dc', cards).forEach((c, i) => {
      const d = D.DISTRICTS[i];
      $('[data-sub]', c).textContent = mode === 'total' ? 'casos notificados' : 'casos por cada 1.000 personas';
      const to = mode === 'total' ? d.cases : d.per1000;
      if (animate) countUp($('[data-big]', c), to); else $('[data-big]', c).textContent = to;
    });
    $$('.mode-sw button').forEach((b) => { b.classList.toggle('on', b.dataset.m === mode); b.setAttribute('aria-pressed', b.dataset.m === mode); });
  }
  $('.mode-sw').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; mode = b.dataset.m; three.fair.setMode(mode); paint(true); });
  $('#fairOpts').innerHTML = D.FAIR.map((f, i) => `<button class="fo" data-i="${i}">${f.t}</button>`).join('');
  $('#fairOpts').addEventListener('click', (e) => {
    const b = e.target.closest('.fo'); if (!b) return;
    const f = D.FAIR[+b.dataset.i];
    b.classList.add(f.ok ? 'right' : 'wrong');
    $('#fairFb').innerHTML = `<b>${f.ok ? 'Se sostiene.' : 'No se sostiene.'}</b> ${f.why}`;
    gsap.fromTo(b, { x: f.ok ? 0 : -8 }, { x: 0, duration: dur(0.5), ease: 'elastic.out(1,.3)', clearProps: 'transform' });
  });
  deck.hooks.enter[8] = () => { three.live.fair = true; three.fair.resize(); mode = 'total'; three.fair.setMode('total', true); paint(false); };
  deck.hooks.leave[8] = () => { three.live.fair = false; };
  paint(false);
}

/* ---------- 10 · laboratorio de lectura ---------- */
function initLab() {
  const state = D.LAB.map(() => ({ done: {}, mode: null, open: 'fuente' }));
  let cur = 0;
  const tabs = $('#labTabs');
  tabs.innerHTML = D.LAB.map((d, i) => `<button role="tab" data-i="${i}">${d.tab}</button>`).join('');
  const rows = $('#fichaRows');
  const bars = { groups: [] };
  const NAMES = D.FIELD_NAMES;
  const KEYS = ['fuente', 'poblacion', 'variables', 'max', 'min', 'tendencia', 'comparacion'];
  const ds = () => D.LAB[cur], st = () => state[cur];
  const serie = () => D.SERIES[ds().series];

  function drawChart(grow) {
    const S = serie(), h = ds().kind === 'hbars';
    const r = drawBars($('#labChart'), { labels: S.labels, values: S.values, vmax: h ? 80 : 70, W: 700, H: 420, horizontal: h, grow });
    bars.groups = r.groups;
    r.groups.forEach((g, i) => {
      const on = () => onBar(i, g);
      g.addEventListener('click', on); g.addEventListener('keydown', (e) => { if (e.key === 'Enter') on(); });
    });
    ['max', 'min'].forEach((k) => { if (st().done[k] !== undefined) bars.groups[st().done[k]].classList.add(k); });
  }
  function onBar(i, g) {
    const m = st().mode;
    const S = serie();
    if (!m) { toast(`${S.labels[i]}: ${S.values[i]}`); return; }
    const target = ds()[m];
    if (i === target) {
      st().done[m] = i; g.classList.add(m);
      const nxt = KEYS.find((x) => st().done[x] === undefined);
      st().open = nxt || null; st().mode = nxt === 'max' || nxt === 'min' ? nxt : null;
      render(); toast(`${m === 'max' ? 'Máximo' : 'Mínimo'}: ${S.labels[i]} (${S.values[i]})`);
      if (Object.keys(st().done).length === 7) { confetti(...stagePoint($('.lab-ficha')), 130); toast('¡Ficha completa!'); }
      gsap.fromTo(g, { y: -10 }, { y: 0, duration: dur(0.5), ease: 'bounce.out' });
    } else {
      g.classList.add('wrong'); setTimeout(() => g.classList.remove('wrong'), 500);
      $('#labHint').textContent = `Ese no es el ${m === 'max' ? 'valor más alto' : 'valor más bajo'}. Compara las barras otra vez.`;
    }
  }
  function render() {
    const d = ds(), s = st(), S = serie();
    $$('button', tabs).forEach((b, i) => { b.classList.toggle('on', i === cur); b.setAttribute('aria-selected', i === cur); });
    $('#labTitle').textContent = d.title;
    rows.innerHTML = KEYS.map((k) => {
      const isBar = k === 'max' || k === 'min';
      const done = s.done[k] !== undefined, open = s.open === k;
      const val = done ? (isBar ? `${S.labels[s.done[k]]} (${S.values[s.done[k]]})` : d.fields[k].opts[d.fields[k].ok]) : '';
      const body = isBar
        ? `<div class="fr-opts"><div class="fr-val">${done ? val : `Toca la barra del ${k === 'max' ? 'valor más alto' : 'valor más bajo'} en el gráfico.`}</div></div>`
        : `<div class="fr-opts">${d.fields[k].opts.map((o, oi) => `<button class="fo2 ${done && oi === d.fields[k].ok ? 'right' : ''}" data-k="${k}" data-o="${oi}" ${done ? 'disabled' : ''}>${o}</button>`).join('')}</div>`;
      return `<div class="fr ${done ? 'done' : ''} ${open ? 'open active' : ''}" data-k="${k}"><button class="fr-h"><i class="dot"></i>${NAMES[k]}<span class="st2">${done ? '✓' : ''}</span></button>${done && !open ? `<div class="fr-val">${esc(val)}</div>` : ''}${body}</div>`;
    }).join('');
    const n = Object.keys(s.done).length;
    $('#labCount').textContent = `${n}/7`;
    $('#labRing').style.strokeDashoffset = 113 * (1 - n / 7);
    $('#labHint').textContent = s.mode ? `Toca en el gráfico la barra del ${s.mode === 'max' ? 'valor máximo' : 'valor mínimo'}.` : 'Elige un campo de la ficha: si es «máximo» o «mínimo», toca la barra.';
  }
  rows.addEventListener('click', (e) => {
    const h = e.target.closest('.fr-h');
    if (h) {
      const k = h.parentElement.dataset.k;
      st().open = st().open === k ? null : k;
      st().mode = (k === 'max' || k === 'min') && st().done[k] === undefined && st().open === k ? k : null;
      render(); return;
    }
    const o = e.target.closest('.fo2'); if (!o) return;
    const k = o.dataset.k, oi = +o.dataset.o;
    if (oi === ds().fields[k].ok) {
      st().done[k] = oi; render();
      const nxt = KEYS.find((x) => st().done[x] === undefined); st().open = nxt || null;
      if (nxt === 'max' || nxt === 'min') st().mode = nxt;
      render();
      if (Object.keys(st().done).length === 7) { confetti(...stagePoint($('.lab-ficha')), 130); toast('¡Ficha completa!'); }
    } else { o.classList.add('wrong'); gsap.fromTo(o, { x: -8 }, { x: 0, duration: dur(0.5), ease: 'elastic.out(1,.3)' }); }
  });
  tabs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { cur = +b.dataset.i; render(); drawChart(true); } });
  render(); drawChart(false);
}

/* ---------- 11 · clasificar conclusiones (arrastrar o tocar) ---------- */
function initConcl() {
  const tray = $('#trayCards'), binsEl = $('#bins');
  let selected = null, score = 0, drags = [];
  function build() {
    drags.forEach((d) => d.kill()); drags = []; selected = null; score = 0; $('#cScore').textContent = 0;
    binsEl.innerHTML = D.BINS.map((b) => `<div class="bin" data-k="${b.k}" style="--bc:${CV[b.c]}" tabindex="0" role="button" aria-label="Zona ${b.name}"><h4>${b.name}</h4><p class="sub">${b.sub}</p><div class="drop"></div></div>`).join('');
    const R = rng(11);
    const idx = D.CONCL.map((_, i) => i).sort(() => R() - 0.5);
    tray.innerHTML = idx.map((i) => `<button class="cc" data-i="${i}"><small>GRÁFICO ${D.CONCL[i].ds}</small>${D.CONCL[i].t}<span class="res"></span></button>`).join('');
    $$('.cc', tray).forEach((c) => {
      drags.push(Draggable.create(c, {
        type: 'x,y', zIndexBoost: true,
        onClick() { select(c); },
        onDragStart() { select(c); },
        onDragEnd() {
          const hit = $$('.bin', binsEl).find((b) => this.hitTest(b, '40%'));
          if (hit) place(c, hit.dataset.k); else gsap.to(c, { x: 0, y: 0, duration: dur(0.5), ease: 'elastic.out(1,.6)' });
        },
      })[0]);
    });
  }
  function select(c) { $$('.cc.sel', tray).forEach((x) => x.classList.remove('sel')); if (c.classList.contains('placed')) return; selected = c; c.classList.add('sel'); }
  function place(c, bin) {
    const item = D.CONCL[+c.dataset.i];
    const ok = item.k === bin;
    const res = $('.res', c);
    if (!ok) {
      c.classList.add('badc'); res.textContent = `No: ${item.why}`;
      gsap.fromTo(c, { x: 0, y: 0 }, { x: 0, y: 0, duration: dur(0.5), ease: 'elastic.out(1,.4)' });
      gsap.fromTo(c, { rotate: -4 }, { rotate: 0, duration: dur(0.6), ease: 'elastic.out(1,.3)', clearProps: 'transform' });
      setTimeout(() => c.classList.remove('badc'), 2600);
      return;
    }
    const dr = drags.find((d) => d.target === c); dr?.kill();
    c.classList.remove('sel'); c.classList.add('placed', 'good'); res.textContent = item.why;
    gsap.set(c, { clearProps: 'transform,zIndex' });
    const from = srect(c);
    $(`.bin[data-k="${bin}"] .drop`, binsEl).appendChild(c);
    const to = srect(c);
    gsap.fromTo(c, { x: from.x - to.x, y: from.y - to.y, scale: 1.05 }, { x: 0, y: 0, scale: 1, duration: dur(0.6), ease: 'expo.out', clearProps: 'transform' });
    selected = null; score++; $('#cScore').textContent = score;
    if (score === D.CONCL.length) { confetti(960, 500, 140); toast('¡6 de 6! Distingues lo que muestran los datos'); }
  }
  binsEl.addEventListener('click', (e) => { const b = e.target.closest('.bin'); if (b && selected) place(selected, b.dataset.k); });
  binsEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const b = e.target.closest('.bin'); if (b && selected) place(selected, b.dataset.k); } });
  $('#cReset').onclick = build;
  build();
}

/* ---------- 12 · titular de máximo 15 palabras ---------- */
function initWrite() {
  let cur = 0;
  const tabs = $('#wTabs'), ta = $('#wText');
  tabs.innerHTML = D.HEADLINE.map((h, i) => `<button role="tab" data-i="${i}">${h.tab}</button>`).join('');
  const crit = { P: $('#cP'), A: $('#cA'), C: $('#cC'), L: $('#cL') };
  const setC = (k, cls, html) => { crit[k].className = `crit card ${cls}`; $('p', crit[k]).innerHTML = html; };
  const found = (t, kind) => D.FLAGS.filter((f) => f.kind === kind).map((f) => (t.match(f.re) || [])[0]).filter(Boolean);
  function evaluate() {
    const h = D.HEADLINE[cur], t = ta.value, n = wordsOf(t);
    store.set('h' + cur, t);
    $('#wCount').textContent = n;
    const ring = $('#wRing');
    ring.style.strokeDashoffset = 113 * (1 - Math.min(n, 15) / 15);
    ring.style.stroke = n > 15 ? 'var(--verm)' : n > 12 ? 'var(--mari)' : 'var(--jade)';
    const prev = $('#wPrevText');
    prev.textContent = n ? t.trim() : 'Tu titular aparecerá aquí'; prev.classList.toggle('empty', !n);
    if (!n) { setC('P', '', 'Incluye cifras y el cambio observado.'); setC('A', '', 'Sin palabras alarmistas ni opinión.'); setC('C', '', 'Describe: no expliques causas sin evidencia.'); setC('L', '', 'Entre 6 y 15 palabras.'); return; }
    const absol = found(t, 'absoluto');
    if (h.need.every((re) => re.test(t)) && !absol.length) setC('P', 'g', `Muy bien: ${h.needLabel}.`);
    else if (absol.length) setC('P', 'y', `Cuidado con el absoluto <mark>${absol[0]}</mark>: ¿lo respalda el dato?`);
    else setC('P', 'y', `Revisa la precisión: debería ${h.needLabel}.`);
    const al = found(t, 'alarma');
    al.length ? setC('A', 'r', `Palabra alarmista u opinión: <mark>${al[0]}</mark>.`) : setC('A', 'g', 'No se detecta alarmismo.');
    const ca = found(t, 'causa');
    ca.length ? setC('C', 'r', `Sugiere una causa no demostrada: <mark>${ca[0]}</mark>.`) : setC('C', 'g', 'No agrega causas que el gráfico no muestra.');
    n > 15 ? setC('L', 'r', `Supera el límite: recorta <mark>${n - 15}</mark> palabra${n - 15 > 1 ? 's' : ''}.`) : n < 6 ? setC('L', 'y', 'Muy corto: agrega el dato y el período.') : setC('L', 'g', `${n} de 15 palabras.`);
  }
  function load(i) {
    cur = i;
    $$('button', tabs).forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i); });
    $('#wData').textContent = D.HEADLINE[i].data;
    ta.value = store.get('h' + i, '');
    $('#wModelBox').hidden = true; $('#wModel').textContent = 'Ver modelo'; $('#wModelTxt').textContent = D.HEADLINE[i].model;
    evaluate();
  }
  tabs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) load(+b.dataset.i); });
  ta.addEventListener('input', evaluate);
  $('#wModel').onclick = () => {
    const box = $('#wModelBox'); box.hidden = !box.hidden; $('#wModel').textContent = box.hidden ? 'Ver modelo' : 'Ocultar modelo';
    if (!box.hidden) { $('#wModelTxt').textContent = `${D.HEADLINE[cur].model} (${wordsOf(D.HEADLINE[cur].model)} palabras)`; gsap.fromTo(box, { y: 14, opacity: 0, rotate: -2 }, { y: 0, opacity: 1, rotate: 0, duration: dur(0.45), ease: 'back.out(1.8)', clearProps: 'transform,opacity' }); }
  };
  $('#wClear').onclick = () => { ta.value = ''; evaluate(); ta.focus(); };
  load(0);
}

/* ---------- 13 · caza de palabras 3D ---------- */
function initWords(deck, three) {
  let cur = 0;
  const tabs = $('#hTabs'), card = $('#hCard');
  const done = {};
  tabs.innerHTML = D.HEADLINES.map((h, i) => `<button role="tab" data-i="${i}">Titular ${i + 1}</button>`).join('');
  const norm = (s) => s.toLowerCase().replace(/[¡!¿?,:.;]/g, '');
  let els = [], toks = [];
  function load(i) {
    cur = i;
    const h = D.HEADLINES[i];
    $$('button', tabs).forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('done', !!done[k]); b.setAttribute('aria-selected', k === i); });
    toks = h.text.split(' ');
    card.innerHTML = `<div class="tag mono">TITULAR ${i + 1} DE ${D.HEADLINES.length}</div><h3>${esc(h.text)}</h3><p>Marca las palabras que suman <b>opinión</b> o una <b>causa no demostrada</b>. Si crees que no hay ninguna, no marques nada y toca «Revisar».</p><div id="hRes"></div>`;
    els = three.words.setWords(toks);
  }
  function check() {
    const h = D.HEADLINES[cur];
    const flag = h.flag.map(norm);
    let hit = 0, wrong = 0, miss = 0;
    els.forEach((el, k) => {
      const on = el.classList.contains('on'), isF = flag.includes(norm(toks[k]));
      el.classList.remove('hit', 'miss', 'ok');
      if (on && isF) { el.classList.add('hit'); hit++; }
      else if (on && !isF) { el.classList.add('miss'); wrong++; }
      else if (!on && isF) { el.classList.add('miss'); miss++; }
    });
    const perfect = !wrong && !miss;
    done[cur] = perfect;
    $$('button', tabs)[cur].classList.toggle('done', perfect);
    $('#hRes').innerHTML = `<p class="score">${perfect ? '¡Exacto!' : `${hit} acierto${hit === 1 ? '' : 's'} · ${wrong} de más · ${miss} sin marcar`}</p><p class="fix">Versión responsable: ${esc(h.fix)}</p>`;
    gsap.fromTo('#hRes', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: dur(0.45), clearProps: 'transform,opacity' });
    if (perfect) confetti(...stagePoint($('.words-stage')), 80);
    if (Object.values(done).filter(Boolean).length === D.HEADLINES.length) toast('¡Cuatro titulares revisados!');
  }
  tabs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) load(+b.dataset.i); });
  $('#hCheck').onclick = check;
  $('#hReset').onclick = () => load(cur);
  deck.hooks.enter[12] = () => { three.live.words = true; three.words.resize(); load(cur); document.fonts?.ready.then(() => three.words.layout()); };
  deck.hooks.leave[12] = () => { three.live.words = false; };
}

/* ---------- 14 · ticket de salida ---------- */
function initTicket() {
  const A = new Set(), B = new Set();
  const mk = (id, arr, set) => {
    $(id).innerHTML = arr.map((t, i) => `<button class="word" data-i="${i}">${t}</button>`).join('');
    $(id).addEventListener('click', (e) => { const w = e.target.closest('.word'); if (!w) return; const i = +w.dataset.i; set.has(i) ? set.delete(i) : set.add(i); sync(); });
  };
  mk('#bankA', D.TICKET_A, A); mk('#bankB', D.TICKET_B, B);
  let fired = false;
  function sync() {
    const fill = (id, arr, set) => { const el = $(id); const t = [...set].sort().map((i) => arr[i]); el.textContent = t.length ? t.join(' y ') : 'elige una opción'; el.classList.toggle('empty', !t.length); };
    fill('#tA', D.TICKET_A, A); fill('#tB', D.TICKET_B, B);
    $$('#bankA .word').forEach((w, i) => { w.classList.toggle('on', A.has(i)); w.classList.remove('bad'); });
    $$('#bankB .word').forEach((w, i) => { const on = B.has(i); w.classList.toggle('on', on && D.TICKET_OK_B.includes(i)); w.classList.toggle('bad', on && !D.TICKET_OK_B.includes(i)); });
    const fb = $('#ticketFb'); fb.className = 'ticket-fb card';
    const badB = [...B].filter((i) => !D.TICKET_OK_B.includes(i)), badA = [...A].filter((i) => !D.TICKET_OK_A.includes(i));
    const okA = [...A].filter((i) => D.TICKET_OK_A.includes(i)).length, okB = [...B].filter((i) => D.TICKET_OK_B.includes(i)).length;
    if (badB.length || badA.length) { fb.classList.add('warn'); fb.innerHTML = badB.length ? '<b>Revisemos:</b> un gráfico no muestra «la causa segura» de una tendencia. Describe lo visible y busca más evidencia para explicar.' : '<b>Revisemos:</b> esa opción no ayuda a explicar una tendencia. Piensa en contexto y evidencia.'; fired = false; return; }
    if (okA && okB) { fb.classList.add('good'); fb.innerHTML = '<b>¡Eso es!</b> Para explicar una tendencia necesitas contexto y más evidencia; el gráfico te permite describir lo visible.'; if (!fired) { fired = true; confetti(...stagePoint($('.ticket')), 80); } return; }
    fired = false; fb.textContent = 'Puedes elegir más de una opción en cada frase.';
  }
  sync();
  $('#selfList').innerHTML = D.SELF.map((t, i) => `<li><button data-i="${i}" aria-pressed="false"><span class="bx">✓</span>${t}</button></li>`).join('');
  $('#selfList').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    b.classList.toggle('on'); b.setAttribute('aria-pressed', b.classList.contains('on'));
    gsap.fromTo($('.bx', b), { scale: 0.4, rotate: -90 }, { scale: 1, rotate: 0, duration: dur(0.45), ease: 'back.out(3)' });
    if ($$('#selfList button.on').length === D.SELF.length) { confetti(...stagePoint($('#selfList')), 130); toast('¡Lista para la clase 21!'); }
  });
}
