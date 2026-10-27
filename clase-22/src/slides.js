import { gsap } from 'gsap';
import { $, $$, toast, confetti as confettiRaw, motion, rng } from '../../src/util.js';
import * as D from './data.js';

const PAL = ['#ffc233', '#2fd6b5', '#b69cff', '#62b0ff', '#ff6b8a', '#ffffff'];
const confetti = (x, y, n) => confettiRaw(x, y, n, PAL);
const CV = { amber: 'var(--amber)', teal: 'var(--teal)', lilac: 'var(--lilac)', sky: 'var(--sky)', rose: 'var(--rose)' };
const store = {
  get(k, d = '') { try { return localStorage.getItem('c22:' + k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('c22:' + k, v); } catch { /* sin almacenamiento */ } },
};
const dur = (d) => (motion.reduced ? 0.01 : d);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); parent?.appendChild(e); return e; };
const mk = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
function srect(el) {
  const s = $('#stage').getBoundingClientRect(), r = el.getBoundingClientRect(), k = s.width / 1920;
  return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
}
const burst = (el, n = 90) => { const r = srect(el); confetti(r.x + r.w / 2, r.y + r.h / 2, n); };
const shuffle = (arr, rnd) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const seed = () => (Date.now() ^ (Math.random() * 1e9)) >>> 0;
function typeInto(el, text, d = 1) {
  if (motion.reduced) { el.textContent = text; return; }
  const o = { n: 0 };
  gsap.killTweensOf(o);
  el.textContent = '';
  gsap.to(o, { n: text.length, duration: Math.min(1.4, text.length * 0.012) * d, ease: 'none', onUpdate: () => { el.textContent = text.slice(0, Math.round(o.n)); } });
}
function setRing(fg, frac, len = 176) { fg.style.strokeDashoffset = String(len * (1 - Math.max(0, Math.min(1, frac)))); }
const fmtT = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
// temporizador sencillo: tick(s restantes), end()
function makeTimer(total, tick, end) {
  let left = total, id = null;
  const api = {
    get left() { return left; }, get running() { return !!id; },
    start() { if (id) return; if (left <= 0) left = total; id = setInterval(() => { left--; tick(left, total); if (left <= 0) { api.stop(); end?.(); } }, 1000); tick(left, total); },
    stop() { clearInterval(id); id = null; },
    reset() { api.stop(); left = total; tick(left, total); },
  };
  return api;
}

// estado compartido entre diapositivas (ensayo → corrección → cierre)
const shared = { essay: null, classErr: Array(8).fill(0), demo: false };

export function initSlides(deck, three) {
  initCover(deck);
  initMap(deck, three);
  initQuestions();
  initVocab();
  initSel();
  initChart(deck);
  initDev();
  initStations(deck, three);
  initE12();
  initE34();
  initEssay(deck);
  initCorr(deck, three);
  initEnd(deck);
}

/* ---------- 1 · portada ---------- */
function initCover(deck) {
  deck.hooks.enter[0] = () => {
    gsap.fromTo('.brow', { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: dur(0.7), stagger: 0.12, ease: 'power3.out', delay: 1.0, clearProps: 'transform,opacity' });
  };
}

/* ---------- 3 · mapa rápido ---------- */
function initMap(deck, three) {
  const marks = Array(16).fill(0);
  const idx = (b, l) => b * 4 + l;
  $$('#mapWrite textarea').forEach((t, i) => { t.value = store.get('ta' + i); t.addEventListener('input', () => store.set('ta' + i, t.value)); });
  const groups = $('#chipGroups');
  D.BRANCHES.forEach((b, bi) => {
    const g = mk('div', 'cg'); g.style.setProperty('--bc', CV[b.c]);
    g.appendChild(mk('h4', '', b.name.toUpperCase()));
    const row = mk('div');
    b.leaves.forEach((txt, li) => {
      const c = mk('button', 'cchip', esc(txt)); c.dataset.i = idx(bi, li);
      c.addEventListener('click', () => toggle(idx(bi, li)));
      row.appendChild(c);
    });
    g.appendChild(row); groups.appendChild(g);
  });
  const paint = () => {
    $$('.cchip').forEach((c) => { const m = marks[+c.dataset.i]; c.classList.toggle('had', m === 1); c.classList.toggle('added', m === 2); c.setAttribute('aria-pressed', m === 1); });
    const had = marks.filter((m) => m === 1).length, add = marks.filter((m) => m === 2).length;
    $('#mapPct').textContent = `${had} de 16`;
    $('#mapGauge').style.width = `${(had / 16) * 100}%`;
    let fb = 'Marca los conceptos que escribiste.';
    if (had + add > 0) {
      const per = D.BRANCHES.map((b, bi) => ({ b, n: [0, 1, 2, 3].filter((l) => marks[idx(bi, l)] === 1).length }));
      const weak = per.slice().sort((a, c) => a.n - c.n)[0];
      fb = add ? `Agregaste ${add} concepto${add > 1 ? 's' : ''} con color ámbar. Rama para repasar primero: ${weak.b.name}.` : `Recuperaste ${had} sin apuntes. Rama con menos marcas: ${weak.b.name}.`;
    }
    $('#mapFb').textContent = fb;
  };
  function toggle(i) {
    marks[i] = marks[i] === 1 ? 0 : 1;
    three.map.setLeaf(i, marks[i]); paint();
    if (marks.filter((m) => m === 1).length === 16) { burst($('#mapPct')); toast('¡Recuperaste los 16 conceptos!'); }
  }
  three.onLeafPick = (i) => { if (!$('#mapCmp').hidden) toggle(i); else toast('Pulsa «Comparar con la lista» para marcar'); };
  $('#mapAdd').onclick = () => {
    marks.forEach((m, i) => { if (m === 0) { marks[i] = 2; three.map.setLeaf(i, 2, true); } });
    paint(); toast('Lo olvidado quedó marcado en ámbar');
  };

  const ring = $('#mapRingFg'), clk = $('#mapClock');
  const timer = makeTimer(240, (left, total) => { clk.textContent = fmtT(left); setRing(ring, left / total); }, () => { toast('¡Tiempo! Ahora compara con la lista'); showCompare(); });
  function showCompare() {
    timer.stop();
    $('#mapWrite').hidden = true; $('#mapCmp').hidden = false;
    gsap.fromTo('.cg', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: dur(0.6), stagger: 0.1, ease: 'power3.out', clearProps: 'all' });
    paint();
  }
  $('#mapStart').onclick = () => {
    if (timer.running) { timer.reset(); $('#mapStart').textContent = 'Comenzar 4 min'; return; }
    $('#mapWrite').hidden = false; $('#mapCmp').hidden = true;
    timer.start(); $('#mapStart').textContent = 'Reiniciar'; $('#ta0').focus();
  };
  $('#mapCompare').onclick = showCompare;
  setRing(ring, 1);
  deck.hooks.enter[2] = () => { three.live.map = true; three.map.resize(); };
  deck.hooks.leave[2] = () => { three.live.map = false; timer.stop(); $('#mapStart').textContent = 'Comenzar 4 min'; };
}

/* ---------- 4 · preguntas ---------- */
function initQuestions() {
  const board = $('#qBoard'), seen = new Set();
  D.QUESTIONS.forEach((q, i) => {
    const b = mk('button', 'qrow', `<b>${String(i + 1).padStart(2, '0')}</b><span>${esc(q.q)}</span><i>✓</i>`);
    b.style.setProperty('--qc', CV[q.c]); b.setAttribute('role', 'listitem'); b.dataset.i = i;
    b.addEventListener('click', () => {
      $$('.qrow').forEach((x) => x.classList.remove('on')); b.classList.add('on'); b.classList.add('seen'); seen.add(i);
      $('#qPanel').style.setProperty('--qc', CV[q.c]);
      $('#qTag').textContent = `PREGUNTA ${i + 1}`;
      $('#qTitle').textContent = q.q;
      typeInto($('#qIdea'), q.idea);
      $('#qGauge').style.width = `${(seen.size / 5) * 100}%`;
      $('#qCount').textContent = `${seen.size} de 5 abiertas`;
      if (seen.size === 5) toast('Las cinco preguntas están abiertas');
    });
    board.appendChild(b);
  });
}

/* ---------- 5 · vocabulario ---------- */
function initVocab() {
  const terms = $('#vTerms'), defs = $('#vDefs'), mid = $('#vMid');
  const COLS = ['var(--amber)', 'var(--teal)', 'var(--lilac)', 'var(--sky)'];
  let sel = -1, ok = 0, err = 0, svg;
  const done = new Set();
  function build() {
    terms.innerHTML = ''; defs.innerHTML = ''; mid.innerHTML = ''; sel = -1; ok = 0; err = 0; done.clear();
    svg = svgEl('svg', {}, mid);
    D.VOCAB.forEach((v, i) => {
      const b = mk('button', 'vb', `<span class="vterm">${v.t}</span>`); b.dataset.i = i; b.style.setProperty('--vc', COLS[i % 4]);
      b.addEventListener('click', () => pickTerm(i, b)); terms.appendChild(b);
    });
    shuffle(D.VOCAB.map((_, i) => i), rng(seed())).forEach((i) => {
      const b = mk('button', 'vb', `<span class="vdef">${esc(D.VOCAB[i].d)}</span>`); b.dataset.i = i; b.style.setProperty('--vc', COLS[i % 4]);
      b.addEventListener('click', () => pickDef(i, b)); defs.appendChild(b);
    });
    stat(); $('#vFb').textContent = 'Elige un término y luego su definición.';
  }
  const stat = () => { $('#vOk').textContent = ok; $('#vErr').textContent = err; };
  function pickTerm(i, b) {
    if (done.has(i)) return;
    sel = i; $$('#vTerms .vb').forEach((x) => x.classList.toggle('sel', x === b));
    $('#vFb').textContent = `«${D.VOCAB[i].t}»: ahora elige su definición.`;
  }
  function pickDef(i, b) {
    if (done.has(i)) return;
    if (sel < 0) { $('#vFb').textContent = 'Primero elige un término de la columna izquierda.'; return; }
    if (sel === i) {
      done.add(i); ok++;
      const tb = $(`#vTerms .vb[data-i="${i}"]`);
      tb.classList.remove('sel'); tb.classList.add('done'); b.classList.add('done');
      const mr = mid.getBoundingClientRect(), k = mr.width / 150 || 1, a = tb.getBoundingClientRect(), c = b.getBoundingClientRect();
      const y1 = (a.top + a.height / 2 - mr.top) / k, y2 = (c.top + c.height / 2 - mr.top) / k;
      const p = svgEl('path', { d: `M0,${y1} C75,${y1} 75,${y2} 150,${y2}`, fill: 'none', stroke: COLS[i % 4], 'stroke-width': 4, 'stroke-linecap': 'round' }, svg);
      const len = p.getTotalLength?.() || 200; p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      gsap.to(p, { strokeDashoffset: 0, duration: dur(0.6), ease: 'power2.out' });
      sel = -1; $('#vFb').innerHTML = `<b style="color:var(--ok)">✓ ${D.VOCAB[i].t}.</b> ${esc(D.VOCAB[i].d)}`;
      if (ok === 9) { burst($('#vOk'), 140); $('#vFb').innerHTML = `<b style="color:var(--ok)">¡Vocabulario completo!</b> ${err ? `Con ${err} intento${err > 1 ? 's' : ''} fallido${err > 1 ? 's' : ''}: repasa los que dudaste.` : 'Sin errores.'}`; }
    } else {
      err++; b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong');
      $('#vFb').innerHTML = `<b style="color:var(--err)">Todavía no.</b> «${D.VOCAB[sel].t}» no coincide con esa definición. Piensa en la idea clave de la palabra.`;
    }
    stat();
  }
  $('#vReset').onclick = build;
  build();
}

/* ---------- 6 · selección con distractores ---------- */
function initSel() {
  const M = D.MODEL_SEL;
  const absRe = /\b(siempre|solo|basta|nunca|todas?)\b/gi;
  let step = 0;
  $('#selStem').innerHTML = esc(M.stem).replace(M.order, `<span class="hl" id="selHl">${M.order}</span>`);
  const alts = $('#selAlts');
  M.alts.forEach((a) => {
    const b = mk('button', 'alt', `<b>${a.id}</b><span class="atxt">${esc(a.t)}</span>`); b.dataset.id = a.id; b.dataset.ok = a.ok ? '1' : '0';
    b.addEventListener('click', () => {
      $$('.alt', alts).forEach((x) => x.classList.remove('sel')); b.classList.add('sel');
      $('#selWhy').innerHTML = `<b style="color:${a.ok ? 'var(--ok)' : 'var(--err)'}">Alternativa ${a.id} ${a.ok ? '✓' : '✗'}</b> — ${esc(a.why)}`;
    });
    alts.appendChild(b);
  });
  const stp = $('#selSteps');
  M.steps.forEach((s) => stp.appendChild(mk('li', '', `<b>${s.n}</b><div><strong>${s.t}</strong><span>${s.d}</span></div>`)));
  const paint = () => {
    $$('li', stp).forEach((li, i) => { li.classList.toggle('done', i < step); li.classList.toggle('on', i === step); });
    $('#selNext').textContent = step >= 4 ? 'Completado ✓' : `Paso ${step + 1}: ${M.steps[step].t}`;
    $('#selNext').disabled = step >= 4;
  };
  function reveal() {
    if (step >= 4) return;
    step++;
    if (step === 1) gsap.fromTo('#selHl', { backgroundColor: 'rgba(255,194,51,.9)' }, { backgroundColor: 'rgba(255,194,51,.28)', duration: dur(1.2) });
    if (step === 2) $$('.atxt', alts).forEach((s) => { s.innerHTML = s.innerHTML.replace(absRe, '<span class="abs">$1</span>'); });
    if (step === 3) M.alts.forEach((a, i) => { const t = mk('span', 'tagc', a.tag.toUpperCase()); $$('.atxt', alts)[i].appendChild(t); });
    if (step === 4) {
      $$('.alt', alts).forEach((b) => b.classList.add(b.dataset.ok === '1' ? 'ok' : 'bad'));
      typeInto($('#selConceptT'), M.concept);
      $('#selWhy').innerHTML = '<b style="color:var(--ok)">Justificación completa.</b> Elegí B porque corrige el error, evita absolutos y orienta a la acción.';
      burst($('#selConcept'), 70);
    }
    paint();
  }
  $('#selNext').onclick = reveal;
  $('#selReset').onclick = () => {
    step = 0;
    $$('.atxt', alts).forEach((s, i) => { s.textContent = M.alts[i].t; });
    $$('.alt', alts).forEach((b) => b.classList.remove('ok', 'bad', 'sel'));
    $('#selConceptT').textContent = 'Completa los cuatro pasos para revelarlo.';
    $('#selWhy').textContent = 'Pulsa una alternativa para ver por qué funciona o falla.';
    paint();
  };
  paint();
}

/* ---------- 7 · gráfico ---------- */
function initChart(deck) {
  const M = D.MODEL_CHART;
  $('#chTitle').textContent = M.title; $('#chSrc').textContent = `${M.unit} · ${M.src}`;
  const svg = $('#chSvg'), W = 860, H = 430, L = 74, B = 80, T = 34, R = 20, ph = H - B - T;
  const y = (v) => T + ph - (v / 100) * ph;
  const axis = svgEl('g', { id: 'chAxis' }, svg);
  [0, 25, 50, 75, 100].forEach((v) => {
    svgEl('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), stroke: 'rgba(255,226,170,.2)', 'stroke-width': 1.5 }, svg);
    const t = svgEl('text', { x: L - 12, y: y(v) + 6, 'text-anchor': 'end' }, axis); t.textContent = v + ' %';
  });
  const bw = 112, gap = (W - L - R - bw * M.bars.length) / M.bars.length;
  const COL = ['#ff6b8a', '#b69cff', '#62b0ff', '#2fd6b5'];
  const bars = M.bars.map((b, i) => {
    const x = L + gap / 2 + i * (bw + gap);
    const r = svgEl('rect', { x, y: y(0), width: bw, height: 0, rx: 6, fill: COL[i] }, svg);
    const val = svgEl('text', { x: x + bw / 2, y: y(b.v) - 10, 'text-anchor': 'middle', class: 'val', opacity: 0 }, svg); val.textContent = b.v + ' %';
    const parts = b.l.split(' ');
    const lab = svgEl('text', { x: x + bw / 2, y: H - B + 30, 'text-anchor': 'middle', class: 'lab' }, svg);
    const half = Math.ceil(parts.length / 2);
    [parts.slice(0, half).join(' '), parts.slice(half).join(' ')].filter(Boolean).forEach((ln, k) => { const ts = svgEl('tspan', { x: x + bw / 2, dy: k ? 22 : 0 }, lab); ts.textContent = ln; });
    const ring = svgEl('rect', { x: x - 6, y: y(b.v) - 6, width: bw + 12, height: y(0) - y(b.v) + 12, rx: 10, class: 'hlring' }, svg);
    return { r, val, ring, b, x };
  });
  const drawBars = () => bars.forEach((o, i) => {
    o.r.setAttribute('height', 0); o.r.setAttribute('y', y(0)); o.val.setAttribute('opacity', 0);
    const h = y(0) - y(o.b.v), s = { k: 0 };
    gsap.to(s, { k: 1, duration: dur(0.9), delay: dur(0.15 * i), ease: 'power3.out', onUpdate: () => { o.r.setAttribute('height', h * s.k); o.r.setAttribute('y', y(0) - h * s.k); }, onComplete: () => o.val.setAttribute('opacity', 1) });
  });
  let step = 0;
  const stp = $('#chSteps');
  M.steps.forEach((s) => stp.appendChild(mk('li', '', `<b>${s.n}</b><div><strong>${s.t}</strong><span>${s.d}</span></div>`)));
  const optsEl = $('#chOpts');
  shuffle(M.options, rng(seed())).forEach((o) => {
    const b = mk('button', 'opt', esc(o.t)); b.disabled = true; b.dataset.ok = o.ok ? '1' : '0';
    b.addEventListener('click', () => {
      $$('.opt', optsEl).forEach((x) => { if (x === b) x.classList.add(o.ok ? 'ok' : 'bad'); });
      $('#chWhy').innerHTML = `<b style="color:${o.ok ? 'var(--ok)' : 'var(--err)'}">${o.ok ? '✓ Conclusión adecuada.' : '✗ Todavía no.'}</b> ${esc(o.why)}`;
      if (o.ok) { burst(b, 80); $$('.opt', optsEl).forEach((x) => { x.disabled = true; }); }
    });
    optsEl.appendChild(b);
  });
  const paint = () => {
    $$('li', stp).forEach((li, i) => { li.classList.toggle('done', i < step); li.classList.toggle('on', i === step); });
    $('#chNext').textContent = step >= 3 ? 'Pasos completos ✓' : `Paso ${step + 1}: ${M.steps[step].t}`;
    $('#chNext').disabled = step >= 3;
    $('#chTitle').style.color = step >= 1 ? 'var(--amber)' : '';
    $('#chAxis').style.fill = step >= 1 ? '#ffc233' : '';
    bars.forEach((o, i) => o.ring.classList.toggle('on', step === 2 && (o.b.v === Math.max(...M.bars.map((q) => q.v)) || o.b.v === Math.min(...M.bars.map((q) => q.v)))));
    $$('.opt', optsEl).forEach((b) => { if (!b.classList.contains('ok') && !b.classList.contains('bad')) b.disabled = step < 3; });
  };
  $('#chNext').onclick = () => { if (step < 3) { step++; paint(); if (step === 3) $('#chWhy').textContent = 'Ahora elige la conclusión que los datos permiten.'; } };
  $('#chReset').onclick = () => {
    step = 0; $$('.opt', optsEl).forEach((b) => { b.classList.remove('ok', 'bad'); }); $('#chWhy').textContent = 'Completa los pasos y elige la conclusión adecuada.'; paint(); drawBars();
  };
  paint();
  deck.hooks.enter[6] = drawBars;
}

/* ---------- 8 · desarrollo corto ---------- */
function initDev() {
  const M = D.MODEL_DEV;
  $('#devPrompt').innerHTML = `<b>Enunciado (ficticio):</b> ${esc(M.prompt)}`;
  const sel = {};
  const slotsEl = $('#devSlots');
  const SC = ['var(--amber)', 'var(--teal)', 'var(--rose)'];
  const rnd = rng(seed());
  M.slots.forEach((s, si) => {
    const box = mk('div', 'slot'); box.style.setProperty('--sc', SC[si]);
    box.appendChild(mk('h4', '', esc(s.label)));
    const list = mk('div', 'so');
    shuffle(s.opts, rnd).forEach((o) => {
      const b = mk('button', '', esc(o.t)); b.dataset.q = o.q; b.dataset.slot = s.id;
      b.addEventListener('click', () => { sel[s.id] = o; $$('button', list).forEach((x) => x.classList.toggle('sel', x === b)); update(); });
      list.appendChild(b);
    });
    box.appendChild(list); slotsEl.appendChild(box);
  });
  const rub = $('#devRubric');
  const HINT = { claim: 'La afirmación debe orientar a una acción segura, no minimizar el problema.', ev: 'La evidencia no es popularidad ni una experiencia aislada: es un concepto o dato verificable.', lim: 'Evita absolutos: reconoce el alcance de la recomendación.' };
  function update() {
    const parts = M.slots.map((s) => (sel[s.id] ? `${s.label} ${sel[s.id].t}` : null));
    $('#devAnswer').textContent = parts.filter(Boolean).join(' ') || 'Elige una pieza en cada fila.';
    rub.innerHTML = '';
    let pts = 0, n = 0;
    M.slots.forEach((s) => {
      const o = sel[s.id]; const cls = !o ? '' : o.q === 2 ? 'ok' : o.q === 1 ? 'mid' : 'bad';
      if (o) { pts += o.q; n++; }
      rub.appendChild(mk('div', 'rub ' + cls, `<i>${cls === 'ok' ? '✓' : cls === 'mid' ? '~' : cls === 'bad' ? '✗' : ''}</i>${esc(s.rub)}`));
    });
    const fb = $('#devFb');
    if (n < 3) fb.textContent = `Completa las tres piezas (${n} de 3).`;
    else if (pts === 6) { fb.innerHTML = '<b style="color:var(--ok)">¡Respuesta completa!</b> Afirma, demuestra con un concepto y reconoce su límite.'; burst($('#devAnswer'), 110); }
    else {
      const weak = M.slots.find((s) => sel[s.id].q < 2);
      fb.innerHTML = `<b style="color:var(--amber)">Casi.</b> Mejora «${esc(weak.rub)}»: ${HINT[weak.id]}`;
    }
  }
  update();
}

/* ---------- 9 · estaciones (carrusel 3D) ---------- */
function initStations(deck, three) {
  let sel = 0, round = 0;
  const card = $('#stCard'), groupsEl = $('#stGroups');
  const ring = $('#stRingFg'), clk = $('#stClock'), startBtn = $('#stStart');
  const timer = makeTimer(360, (left, total) => { clk.textContent = fmtT(left); setRing(ring, left / total); }, () => {
    toast('¡Tiempo de estación! Rota los grupos'); startBtn.textContent = 'Iniciar estación';
    if (!motion.reduced) gsap.fromTo('#stRotate', { scale: 1.12 }, { scale: 1, duration: 0.8, repeat: 3, ease: 'elastic.out(1,.4)' });
  });
  function renderCard() {
    const s = D.STATIONS[sel];
    card.style.setProperty('--sc', CV[s.c]);
    card.innerHTML = `<div class="tabs" role="tablist">${D.STATIONS.map((x, i) => `<button role="tab" data-i="${i}" class="${i === sel ? 'on' : ''}" style="--tc:${CV[x.c]}">Andén ${x.n}</button>`).join('')}</div>
      <h3>${esc(s.name)}</h3><p><b>Tarea:</b> ${esc(s.task)}</p><p><b>Producto:</b> ${esc(s.out)}</p>`;
    $$('.tabs button', card).forEach((b) => b.addEventListener('click', () => select(+b.dataset.i)));
  }
  function renderGroups() {
    groupsEl.innerHTML = D.GROUPS.map((g, gi) => {
      const st = D.STATIONS[(gi + round) % 4];
      return `<div class="gtok" style="--gc:${['#ff6b8a', '#43e08f', '#62b0ff', '#ffc233'][gi]}"><b>${g}</b><span>Andén ${st.n}</span></div>`;
    }).join('');
  }
  function select(i) { sel = i; renderCard(); three.st.select(i); }
  three.onStationPick = select;
  startBtn.onclick = () => {
    if (timer.running) { timer.stop(); startBtn.textContent = 'Reanudar'; } else { timer.start(); startBtn.textContent = 'Pausar'; }
  };
  $('#stRotate').onclick = () => {
    round = (round + 1) % 4; three.st.setRound(round); timer.reset(); startBtn.textContent = 'Iniciar estación';
    renderGroups(); toast(`Rotación ${round + 1} de 4: cada grupo avanza un andén`);
  };
  renderCard(); renderGroups(); setRing(ring, 1);
  deck.hooks.enter[8] = () => { three.live.st = true; three.st.resize(); three.st.select(sel); };
  deck.hooks.leave[8] = () => { three.live.st = false; timer.stop(); startBtn.textContent = 'Iniciar estación'; };
}

/* ---------- 10 · estaciones 1 y 2 ---------- */
function initE12() {
  let okN = 0, tab = 0;
  const tot = D.E1.length + D.E2.length;
  const upd = (msg) => { $('#e12Score').textContent = `${okN} / ${tot}`; if (msg) $('#e12Fb').innerHTML = msg; };
  const grid = $('#e1Grid');
  D.E1.forEach((q) => {
    const c = mk('div', 'e1c panel', `<p>${esc(q.s)}</p><div class="yn"><button data-v="1">✓ Hecho</button><button data-v="0">✗ Mito</button></div><div class="why"></div>`);
    $$('.yn button', c).forEach((b) => b.addEventListener('click', () => {
      const val = b.dataset.v === '1', good = val === q.fact;
      $$('.yn button', c).forEach((x) => { x.disabled = true; if ((x.dataset.v === '1') === q.fact) x.classList.add('ok'); });
      if (!good) b.classList.add('bad');
      if (good) okN++;
      $('.why', c).innerHTML = `<b style="color:${good ? 'var(--ok)' : 'var(--err)'}">${good ? '¡Correcto!' : `Era ${q.fact ? 'un hecho' : 'un mito'}.`}</b> ${esc(q.why)}`;
      upd(good ? 'Bien: justificaste con una vía de transmisión o un concepto.' : 'Anota la razón: la usarás en el mini ensayo.');
    }));
    grid.appendChild(c);
  });
  const rows = $('#e2Rows');
  const LAB = { bac: 'Bacterias', vir: 'Virus', amb: 'Ambas' };
  D.E2.forEach((q) => {
    const r = mk('div', 'e2r', `<p>${esc(q.s)}<small></small></p>${['bac', 'vir', 'amb'].map((k) => `<button data-k="${k}">${LAB[k]}</button>`).join('')}`);
    $$('button', r).forEach((b) => b.addEventListener('click', () => {
      const good = b.dataset.k === q.a;
      $$('button', r).forEach((x) => { x.disabled = true; if (x.dataset.k === q.a) x.classList.add('ok'); });
      if (!good) b.classList.add('bad'); else okN++;
      $('small', r).innerHTML = `<b style="color:${good ? 'var(--ok)' : 'var(--err)'}">${good ? '✓' : '✗ Correcta: ' + LAB[q.a] + '.'}</b> ${esc(q.why)}`;
      upd('Recuerda: son características generales; el diagnóstico y el tratamiento los indica un profesional.');
    }));
    rows.appendChild(r);
  });
  $$('.s-e12 .tabs button').forEach((b) => b.addEventListener('click', () => {
    tab = +b.dataset.t;
    $$('.s-e12 .tabs button').forEach((x) => x.classList.toggle('on', x === b));
    $('#e1').hidden = tab !== 0; $('#e2').hidden = tab !== 1;
    gsap.fromTo(tab ? '#e2' : '#e1', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: dur(0.5), ease: 'power3.out', clearProps: 'all' });
  }));
  upd();
}

/* ---------- 11 · estaciones 3 y 4 ---------- */
function initE34() {
  let okN = 0;
  const tot = D.E3.items.length + 1;
  const upd = (msg) => { $('#e34Score').textContent = `${okN} / ${tot}`; if (msg) $('#e34Fb').innerHTML = msg; };
  $('#e3Case').innerHTML = `<b>Caso ficticio.</b> ${esc(D.E3.case)}`;
  const rows = $('#e3Rows');
  D.E3.items.forEach((q) => {
    const c = mk('div', 'e3r panel', `<p>${esc(q.s)}</p><div class="yn"><button data-v="1">Hacer</button><button data-v="0">Evitar</button></div><div class="why"></div>`);
    $$('.yn button', c).forEach((b) => b.addEventListener('click', () => {
      const val = b.dataset.v === '1', good = val === q.do;
      $$('.yn button', c).forEach((x) => { x.disabled = true; if ((x.dataset.v === '1') === q.do) x.classList.add('ok'); });
      if (!good) b.classList.add('bad'); else okN++;
      $('.why', c).innerHTML = `<b style="color:${good ? 'var(--ok)' : 'var(--err)'}">${good ? '✓' : '✗ Lo adecuado es ' + (q.do ? 'hacerlo' : 'evitarlo') + '.'}</b> ${esc(q.why)}`;
      upd('Justifica siempre con un concepto: la consulta oportuna y la privacidad son parte del autocuidado.');
      if (okN === tot - 1 + (e4Done ? 1 : 0) && e4Done) burst($('#e34Score'), 90);
    }));
    rows.appendChild(c);
  });
  // gráfico de líneas
  let e4Done = false, drawn = false;
  const M = D.E4;
  $('#e4Title').textContent = M.title; $('#e4Src').textContent = `${M.unit} · ${M.src}`;
  const svg = $('#e4Svg'), W = 860, H = 400, L = 80, B = 56, T = 24, R = 30, pw = W - L - R, ph = H - B - T;
  const xs = (i) => L + (i / (M.pts.length - 1)) * pw, ys = (v) => T + ph - (v / 300) * ph;
  [0, 100, 200, 300].forEach((v) => {
    svgEl('line', { x1: L, x2: W - R, y1: ys(v), y2: ys(v), stroke: 'rgba(255,226,170,.2)', 'stroke-width': 1.5 }, svg);
    const t = svgEl('text', { x: L - 12, y: ys(v) + 6, 'text-anchor': 'end' }, svg); t.textContent = v;
  });
  M.pts.forEach(([yr], i) => { const t = svgEl('text', { x: xs(i), y: H - B + 32, 'text-anchor': 'middle', class: 'lab' }, svg); t.textContent = yr; });
  const path = svgEl('path', { d: M.pts.map(([, v], i) => `${i ? 'L' : 'M'}${xs(i)},${ys(v)}`).join(' '), fill: 'none', stroke: '#62b0ff', 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
  const dots = M.pts.map(([, v], i) => {
    const c = svgEl('circle', { cx: xs(i), cy: ys(v), r: 8, fill: '#130b15', stroke: '#ffc233', 'stroke-width': 4, opacity: 0 }, svg);
    const t = svgEl('text', { x: xs(i), y: ys(v) - 18, 'text-anchor': 'middle', class: 'val', opacity: 0, style: 'font-size:22px' }, svg); t.textContent = v;
    return [c, t];
  });
  function drawLine() {
    const len = path.getTotalLength?.() || 900;
    path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
    gsap.to(path, { strokeDashoffset: 0, duration: dur(1.4), ease: 'power2.inOut' });
    dots.forEach(([c, t], i) => gsap.to([c, t], { opacity: 1, duration: 0.3, delay: dur(1.4 * (i / (dots.length - 1))) }));
  }
  const optsEl = $('#e4Opts');
  shuffle(M.options, rng(seed())).forEach((o) => {
    const b = mk('button', 'opt', esc(o.t)); b.dataset.ok = o.ok ? '1' : '0';
    b.addEventListener('click', () => {
      if (e4Done) return;
      b.classList.add(o.ok ? 'ok' : 'bad');
      $('#e4Why').innerHTML = `<b style="color:${o.ok ? 'var(--ok)' : 'var(--err)'}">${o.ok ? '✓ Conclusión adecuada.' : '✗ Todavía no.'}</b> ${esc(o.why)}`;
      if (o.ok) { e4Done = true; okN++; $$('.opt', optsEl).forEach((x) => { x.disabled = true; }); upd('Una tendencia describe qué pasó; no prueba por qué pasó.'); burst(b, 80); }
    });
    optsEl.appendChild(b);
  });
  $$('.s-e34 .tabs button').forEach((b) => b.addEventListener('click', () => {
    const tab = +b.dataset.t;
    $$('.s-e34 .tabs button').forEach((x) => x.classList.toggle('on', x === b));
    $('#e3').hidden = tab !== 0; $('#e4').hidden = tab !== 1;
    gsap.fromTo(tab ? '#e4' : '#e3', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: dur(0.5), ease: 'power3.out', clearProps: 'all' });
    if (tab === 1 && !drawn) { drawn = true; drawLine(); }
  }));
  upd();
}

/* ---------- 12 · mini ensayo ---------- */
const TOPIC = { T: ['TRANSMISIÓN', 'var(--amber)'], P: ['PREVENCIÓN', 'var(--lilac)'], S: ['SÍNTOMAS Y CONSECUENCIAS', 'var(--teal)'], F: ['FUENTES Y EVIDENCIA', 'var(--sky)'] };
function initEssay(deck) {
  const rnd = rng(seed());
  const Q = D.ESSAY.map((q) => ({ ...q, alts: shuffle(q.alts, rnd), j: shuffle(q.j, rnd) }));
  const ans = Q.map(() => ({ a: -1, j: -1 }));
  let cur = 0, delivered = false;
  const dots = $('#esDots');
  Q.forEach((_, i) => { const b = mk('button', '', String(i + 1)); b.setAttribute('aria-label', `Pregunta ${i + 1}`); b.addEventListener('click', () => { cur = i; render(); }); dots.appendChild(b); });
  const ring = $('#esRingFg'), clk = $('#esClock');
  const timer = makeTimer(900, (left, total) => { clk.textContent = fmtT(left); setRing(ring, left / total); }, () => { toast('¡Se acabó el tiempo! Se entrega lo respondido'); deliver(); });
  setRing(ring, 1);
  function render() {
    const q = Q[cur], a = ans[cur];
    $$('button', dots).forEach((b, i) => { b.classList.toggle('on', i === cur); b.classList.toggle('ans', ans[i].a >= 0 && ans[i].j >= 0); });
    const [tn, tc] = TOPIC[q.topic];
    $('#esTopic').textContent = tn; $('#esTopic').style.setProperty('--tc', tc);
    $('#esNum').textContent = `Pregunta ${cur + 1} de ${Q.length}`;
    $('#esStem').textContent = q.q;
    const altsEl = $('#esAlts'); altsEl.innerHTML = '';
    q.alts.forEach(([t, ok], i) => {
      const b = mk('button', 'alt', `<b>${'ABCD'[i]}</b><span>${esc(t)}</span>`); b.dataset.ok = ok ? '1' : '0';
      if (a.a === i) b.classList.add('sel');
      if (delivered) { b.disabled = true; if (ok) b.classList.add('ok'); else if (a.a === i) b.classList.add('bad'); }
      b.addEventListener('click', () => { ans[cur].a = i; render(); });
      altsEl.appendChild(b);
    });
    const jEl = $('#esJOpts'); jEl.innerHTML = '';
    $('#esJust').hidden = a.a < 0 && !delivered;
    q.j.forEach(([t, ok], i) => {
      const b = mk('button', 'opt', esc(t)); b.dataset.ok = ok ? '1' : '0';
      if (a.j === i) b.classList.add('sel');
      if (delivered) { b.disabled = true; if (ok) b.classList.add('ok'); else if (a.j === i) b.classList.add('bad'); }
      b.addEventListener('click', () => { ans[cur].j = i; render(); });
      jEl.appendChild(b);
    });
    $('#esPrev').disabled = cur === 0; $('#esNext').disabled = cur === Q.length - 1;
    $('#esDone').hidden = delivered;
    const left = ans.filter((x) => x.a < 0 || x.j < 0).length;
    $('#esHint').textContent = delivered ? 'Revisión: verde = correcto. Revisa cómo se justifica cada respuesta.' : (left ? `Te falta completar ${left} pregunta${left > 1 ? 's' : ''} (respuesta y justificación).` : 'Todo respondido: revisa y entrega.');
  }
  function deliver() {
    timer.stop(); delivered = true;
    const per = Q.map((q, i) => {
      const altOk = ans[i].a >= 0 && q.alts[ans[i].a][1], justOk = ans[i].j >= 0 && q.j[ans[i].j][1];
      return { pts: (altOk ? 1 : 0) + (justOk ? 1 : 0), altOk, justOk };
    });
    // reordenar por contenido original (ci coincide con índice de D.ESSAY)
    const byC = Array(8).fill(null); Q.forEach((q, i) => { byC[q.ci] = per[i]; });
    const score = per.reduce((s, p) => s + p.pts, 0);
    shared.essay = { score, per: byC, total: Q.length * 2 }; shared.demo = false;
    setRing($('#esScoreFg'), score / (Q.length * 2));
    $('#esScore').textContent = `${score}`;
    const wrong = byC.map((p, i) => ({ p, i })).filter((x) => x.p.pts < 2).map((x) => D.CONTENTS[x.i]);
    $('#esRTitle').textContent = score >= 14 ? '¡Muy buen ensayo!' : score >= 10 ? 'Buen avance' : 'Hay contenidos para reforzar';
    $('#esRText').textContent = `${score} de ${Q.length * 2} puntos (1 por respuesta y 1 por justificación). ${wrong.length ? 'Para repasar: ' + wrong.slice(0, 3).join(', ') + (wrong.length > 3 ? '…' : '') + '.' : 'Todos los contenidos quedaron logrados.'} Es un ensayo formativo, sin calificación.`;
    $('#esResult').hidden = false;
    gsap.fromTo('#esResult', { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: dur(0.6), ease: 'back.out(1.4)', clearProps: 'transform,opacity' });
    if (score >= 12) burst($('#esScore'), 130);
    render();
  }
  $('#esStart').onclick = () => { if (delivered) return; if (timer.running) { timer.reset(); $('#esStart').textContent = 'Comenzar'; } else { timer.start(); $('#esStart').textContent = 'Reiniciar reloj'; } };
  $('#esPrev').onclick = () => { cur = Math.max(0, cur - 1); render(); };
  $('#esNext').onclick = () => { cur = Math.min(Q.length - 1, cur + 1); render(); };
  $('#esDone').onclick = deliver;
  $('#esGoCorr').onclick = () => { $('#esResult').hidden = true; deck.go(12); };
  $('#esRetry').onclick = () => {
    delivered = false; ans.forEach((a) => { a.a = -1; a.j = -1; }); cur = 0; timer.reset(); $('#esStart').textContent = 'Comenzar';
    $('#esResult').hidden = true; shared.essay = null; render();
  };
  deck.hooks.leave[11] = () => { timer.stop(); $('#esStart').textContent = delivered ? 'Comenzar' : 'Comenzar'; if (!delivered) timer.reset(); };
  render();
}

/* ---------- 13 · corrección razonada ---------- */
const TIPS = [
  'Repasa las tres vías (sexual sin protección, sangre, de madre a hijo/a) y descarta el contacto cotidiano.',
  'Un mito etiqueta personas o usa absolutos: busca siempre la exposición real a una vía.',
  'Une cada medida con la vía que interrumpe y con su límite: no elimina todo el riesgo.',
  'Ante una molestia: adulto de confianza + centro de salud; evita la automedicación.',
  'Algunas ITS no dan síntomas: la apariencia no sirve para diagnosticar.',
  'Sin tratamiento oportuno hay complicaciones y la transmisión continúa.',
  'Pregunta: ¿quién lo dice, cómo lo sabe y puedo verificarlo?',
  'Título → unidad → comparar → concluir solo lo que muestra («en esta muestra…»).',
];
const TCOL = ['amber', 'amber', 'lilac', 'lilac', 'teal', 'teal', 'sky', 'sky'];
function initCorr(deck, three) {
  let mode = 'mine', selI = -1;
  const rowsEl = $('#corrRows');
  const vals = () => (mode === 'mine' ? D.CONTENTS.map((_, i) => (shared.essay ? 2 - shared.essay.per[i].pts : 0)) : shared.classErr.slice());
  function top3() {
    const v = vals();
    return v.map((x, i) => ({ x, i })).filter((o) => o.x > 0).sort((a, b) => b.x - a.x || a.i - b.i).slice(0, 3).map((o) => o.i);
  }
  function buildRows() {
    rowsEl.innerHTML = '';
    D.CONTENTS.forEach((name, i) => {
      const r = mk('div', 'crow'); r.setAttribute('role', 'button'); r.tabIndex = 0; r.dataset.i = i; r.style.setProperty('--tc', CV[TCOL[i]]);
      let right = '';
      if (mode === 'mine') {
        const p = shared.essay?.per[i];
        right = p ? `<span class="st ${p.pts === 2 ? 'ok' : p.pts === 1 ? 'mid' : 'bad'}">${p.pts}/2</span>` : '<span class="st">—</span>';
      } else right = `<span class="cnt"><button data-d="-1" aria-label="Menos errores">−</button><em>${shared.classErr[i]}</em><button data-d="1" aria-label="Más errores">+</button></span>`;
      r.innerHTML = `<b>${i + 1}</b><span>${name}</span>${right}`;
      r.addEventListener('click', (e) => {
        const d = e.target.closest('[data-d]');
        if (d) { shared.classErr[i] = Math.max(0, Math.min(40, shared.classErr[i] + +d.dataset.d)); refresh(); return; }
        selI = i; explain(i); $$('.crow', rowsEl).forEach((x) => x.classList.toggle('on', x === r));
      });
      r.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === r) { e.preventDefault(); r.click(); } });
      if (i === selI) r.classList.add('on');
      rowsEl.appendChild(r);
    });
  }
  function explain(i) {
    const q = D.ESSAY[i], ok = q.alts.find((a) => a[1])[0], pj = q.j.find((a) => a[1])[0];
    const p = shared.essay?.per[i];
    $('#corrExp').innerHTML = `<span class="tag mono">CORRECCIÓN RAZONADA · ${D.CONTENTS[i].toUpperCase()}</span>
      <p><b>Pregunta tipo:</b> ${esc(q.q)}</p><p><b>Respuesta correcta:</b> ${esc(ok)}</p><p><b>La evidencia o concepto que lo demuestra es…</b> ${esc(pj)}</p>${p ? `<p><b>Tu ensayo:</b> respuesta ${p.altOk ? '✓' : '✗'} · justificación ${p.justOk ? '✓' : '✗'}</p>` : ''}`;
  }
  function refresh() {
    buildRows();
    const v = vals(); const t = top3();
    three.tw.setValues(v, Math.max(2, ...v)); three.tw.setTop(t);
    const rf = $('#refuerzo');
    if (!t.length) rf.innerHTML = '<h4>ÚLTIMO REFUERZO BREVE</h4><p style="font-size:20px;color:var(--txt2);margin:0">Aún no hay errores registrados. Entrega el mini ensayo, registra los errores del curso con + y −, o usa datos de ejemplo (ilustrativos).</p>';
    else rf.innerHTML = `<h4>ÚLTIMO REFUERZO BREVE · TRES CONTENIDOS CON MÁS ERRORES${shared.demo ? ' (DATOS DE EJEMPLO)' : ''}</h4>` + t.map((i, k) => `<div class="rf"><b>${k + 1}</b><p><strong>${D.CONTENTS[i]}</strong> (${v[i]} error${v[i] > 1 ? 'es' : ''}). ${TIPS[i]}</p></div>`).join('');
  }
  $$('.s-corr .tabs button[data-m]').forEach((b) => b.addEventListener('click', () => {
    mode = b.dataset.m; $$('.s-corr .tabs button[data-m]').forEach((x) => x.classList.toggle('on', x === b)); refresh();
    $('#twHint').textContent = mode === 'mine' ? 'Altura = errores en tu ensayo · anillo = los 3 contenidos con más errores' : 'Altura = errores del curso (registra con + y −) · anillo = los 3 con más errores';
  }));
  $('#corrDemo').onclick = () => {
    shared.essay = { score: 10, total: 16, per: [2, 1, 0, 2, 0, 1, 2, 1].map((pts) => ({ pts, altOk: pts > 0, justOk: pts === 2 })) };
    shared.classErr = [7, 12, 18, 5, 16, 9, 4, 14]; shared.demo = true;
    refresh(); toast('Datos de ejemplo cargados (ilustrativos)');
  };
  deck.hooks.enter[12] = () => { three.live.tw = true; three.tw.resize(); refresh(); };
  deck.hooks.leave[12] = () => { three.live.tw = false; };
}

/* ---------- 14 · tarjeta de estudio y ticket ---------- */
function initEnd(deck) {
  const prio = new Set();
  let strat = -1;
  const chipsEl = $('#prioChips');
  D.CONTENTS.forEach((name, i) => {
    const b = mk('button', 'pchip', esc(name)); b.dataset.i = i;
    b.addEventListener('click', () => {
      if (prio.has(i)) prio.delete(i);
      else if (prio.size >= 2) { toast('Elige solo dos prioridades: quita una primero'); return; } else prio.add(i);
      paint();
    });
    chipsEl.appendChild(b);
  });
  const stEl = $('#strats');
  D.STRATEGIES.forEach((s, i) => {
    const b = mk('button', 'strat', esc(s)); b.setAttribute('role', 'radio'); b.addEventListener('click', () => { strat = i; paint(); });
    stEl.appendChild(b);
  });
  function paint() {
    $$('.pchip', chipsEl).forEach((b) => b.classList.toggle('on', prio.has(+b.dataset.i)));
    $('#prioN').textContent = `${prio.size} de 2`;
    $$('.strat', stEl).forEach((b, i) => { b.classList.toggle('on', i === strat); b.setAttribute('aria-checked', i === strat); });
    const names = [...prio].map((i) => D.CONTENTS[i].toLowerCase());
    $('#studySum').innerHTML = prio.size === 2 && strat >= 0
      ? `<b style="color:var(--amber)">Mi plan:</b> estudiaré <b>${names[0]}</b> y <b>${names[1]}</b> usando la estrategia «${esc(D.STRATEGIES[strat].toLowerCase())}».`
      : 'Elige tus dos prioridades y una estrategia.';
  }
  // ticket
  const a = $('#dA'), b = $('#dB');
  [a, b].forEach((sel) => { sel.appendChild(mk('option', '', 'Elige…')); sel.firstChild.value = ''; D.DIFF_TERMS.forEach((t) => { const o = mk('option', '', t); o.value = t; sel.appendChild(o); }); });
  let wasOk = false;
  function ticket() {
    const x = a.value, y = b.value, fb = $('#ticketFb');
    if (!x || !y) { fb.textContent = 'Elige dos conceptos que se confundan con facilidad.'; return; }
    if (x === y) { fb.innerHTML = '<b style="color:var(--err)">Elige dos conceptos distintos.</b>'; return; }
    const ok = D.DIFF_OK.some(([p, q]) => (p === x && q === y) || (p === y && q === x));
    const key = [x, y].sort().join('|');
    if (ok) {
      fb.innerHTML = `<b style="color:var(--ok)">✓ Buen contraste.</b> ${esc(D.DIFF_HINT[key] || 'Escribe en una frase en qué se diferencian y con qué ejemplo lo demuestras.')}`;
      if (!wasOk) { wasOk = true; burst($('.ticket'), 90); }
    } else fb.innerHTML = `<b style="color:var(--amber)">Pensemos.</b> ¿En qué se diferencian «${x}» y «${y}»? Prueba con pares como dato / opinión o mito / hecho.`;
  }
  a.onchange = ticket; b.onchange = ticket;
  $$('.ck input').forEach((c, i) => { c.checked = store.get('ck' + i) === '1'; c.addEventListener('change', () => { store.set('ck' + i, c.checked ? '1' : '0'); if ($$('.ck input').every((x) => x.checked)) { burst($('.check'), 90); toast('Autoevaluación completa'); } }); });
  deck.hooks.enter[13] = () => {
    if (!prio.size && shared.essay) {
      const v = D.CONTENTS.map((_, i) => ({ i, x: 2 - shared.essay.per[i].pts })).filter((o) => o.x > 0).sort((p, q) => q.x - p.x || p.i - q.i).slice(0, 2);
      v.forEach((o) => prio.add(o.i));
      if (v.length) toast('Prioridades sugeridas según tus errores del ensayo');
    }
    paint();
  };
  paint();
}
