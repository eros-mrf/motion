import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { $, $$, toast, confetti as confettiRaw, motion, rng } from '../../src/util.js';
import * as D from './data.js';

gsap.registerPlugin(Draggable);

const PAL = ['#ffe14d', '#6ff0c8', '#ff9ccb', '#9fd3ff', '#c9b8ff', '#ffffff'];
const confetti = (x, y, n) => confettiRaw(x, y, n, PAL);
const CV = { hi: 'var(--hi)', mint: 'var(--mint)', pink: 'var(--pink)', sky: 'var(--sky)', lilac: 'var(--lilac)', coral: 'var(--coral)' };
const NOTE_BG = { hi: '#ffe14d', mint: '#6ff0c8', sky: '#9fd3ff', pink: '#ff9ccb', lilac: '#c9b8ff' };
const store = {
  get(k, d = '') { try { return localStorage.getItem('c25:' + k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('c25:' + k, v); } catch { /* sin almacenamiento */ } },
};
const dur = (d) => (motion.reduced ? 0.01 : d);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
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
const nWords = (t) => t.trim().split(/\s+/).filter(Boolean).length;
const fmtT = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
function setRing(fg, frac, len = 176) { fg.style.strokeDashoffset = String(len * (1 - Math.max(0, Math.min(1, frac)))); }
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
// Draggable no admite objetos fuera del DOM: devuelve el elemento de una lista bajo el puntero/solapamiento
const overlapped = (el, list, th = '40%') => list.find((t) => Draggable.hitTest(el, t, th));

// ---- estado compartido entre diapositivas (se guarda lo escrito en este equipo) ----
const S = {
  crit: [], topic: null, aud: null, guard: false,
  q: store.get('q'), ideas: [store.get('i0'), store.get('i1'), store.get('i2')], myth: store.get('myth'), ev: store.get('ev'), msg: store.get('msg'),
  srcs: [], objs: Array.from({ length: 7 }, (_, i) => store.get('o' + i)),
  team: 4, names: Array.from({ length: 6 }, (_, i) => store.get('n' + i) || `Integrante ${i + 1}`), roles: {},
  qAns: Array.from({ length: 5 }, (_, i) => store.get('a' + i)),
};
const refresh = { ficha: () => {}, seven: () => {}, roles: () => {}, src: () => {}, topic: () => {}, pitch: () => {}, end: () => {} };
const topicOf = () => D.TOPICS.find((t) => t.id === S.topic) || null;

export function initSlides(deck, three) {
  initCover(deck);
  initProd();
  initQuestions();
  initVocab();
  initLayers(deck, three);
  initRubric(deck);
  initTopic();
  initFicha();
  initSources();
  initSeven(deck, three);
  initRoles();
  initPitch(deck, three);
  initEnd(deck);
}

/* ---------- 1 · portada: plano de siete diapositivas que se dibuja ---------- */
function initCover(deck) {
  const g = $('#coverDraw');
  const names = ['Portada', 'Audiencia', 'Idea 1', 'Idea 2', 'Idea 3', 'Mito/evid.', 'Mensaje'];
  const items = [];
  names.forEach((n, i) => {
    const x = 20 + i * 235;
    items.push(svgEl('rect', { x, y: 24, width: 205, height: 110, rx: 6, class: 'fr' }, g));
    const t = svgEl('text', { x: x + 14, y: 62, class: 'nm' }, g); t.textContent = String(i + 1);
    const u = svgEl('text', { x: x + 14, y: 112 }, g); u.textContent = n;
    items.push(svgEl('line', { x1: x + 14, x2: x + 150, y1: 78, y2: 78, stroke: '#fff', 'stroke-width': 2, opacity: 0.5 }, g));
    [t, u].forEach((e) => { e.style.opacity = 0; items.push(e); });
  });
  const dim = svgEl('path', { d: 'M20,164 L1650,164 M20,152 L20,176 M1650,152 L1650,176 M20,164 l12,-7 M20,164 l12,7 M1650,164 l-12,-7 M1650,164 l-12,7', class: 'dm', fill: 'none' }, g);
  const dt = svgEl('text', { x: 835, y: 156, 'text-anchor': 'middle' }, g); dt.textContent = 'PLAN MAESTRO · SIETE DIAPOSITIVAS · UNA PREGUNTA CENTRAL'; dt.style.fill = '#ffe14d'; dt.style.opacity = 0;
  deck.hooks.enter[0] = () => {
    const rects = $$('rect', g);
    rects.forEach((r) => { const len = r.getTotalLength?.() || 700; r.style.strokeDasharray = len; r.style.strokeDashoffset = motion.reduced ? 0 : len; });
    const len = dim.getTotalLength?.() || 1800; dim.style.strokeDasharray = len; dim.style.strokeDashoffset = motion.reduced ? 0 : len;
    gsap.to(rects, { strokeDashoffset: 0, duration: dur(1.0), stagger: 0.12, ease: 'power2.out', delay: 0.9 });
    gsap.to($$('text', g).filter((e) => e !== dt), { opacity: 1, duration: dur(0.4), stagger: 0.07, delay: 1.2 });
    gsap.to(dim, { strokeDashoffset: 0, duration: dur(1.2), ease: 'power2.inOut', delay: 1.9 });
    gsap.to(dt, { opacity: 1, duration: dur(0.5), delay: 2.8 });
  };
}

/* ---------- 3 · dos productos ficticios ---------- */
function initProd() {
  const seen = new Set();
  let active = null;
  const lensCap = $('#lensCap');
  $$('#lensBtns button').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.k;
    active = active === k ? null : k;
    $$('#lensBtns button').forEach((x) => x.classList.toggle('on', x.dataset.k === active));
    ['A', 'B'].forEach((id) => { const p = $('#poster' + id); ['evid', 'fuente', 'msg', 'deco'].forEach((q) => p.classList.toggle('lens-' + q, active === q)); });
    if (active) { seen.add(active); lensCap.innerHTML = `<p><b>A:</b> ${esc(D.PRODUCTS.A.spots[active])}</p><p><b>B:</b> ${esc(D.PRODUCTS.B.spots[active])}</p>`; }
    else lensCap.innerHTML = '<b>Toca una lupa</b> y mira qué muestra cada producto.';
  }));
  let voted = false;
  const crit = $('#critBox');
  crit.style.opacity = 0.5; crit.style.pointerEvents = 'none';
  const vote = (id) => {
    const ok = id === 'B';
    $('#vote' + id).classList.add(ok ? 'ok' : 'bad');
    $('#voteFb').innerHTML = ok
      ? `<b style="color:var(--ok)">✓ El producto B enseña mejor.</b> Es breve, tiene una evidencia visual, cita su fuente y da un mensaje concreto.${seen.size < 3 ? ' Revisa también las otras lupas.' : ''}`
      : '<b style="color:var(--err)">Mira otra vez.</b> El A tiene mucha decoración, pero ¿muestra evidencia, cita una fuente y dice qué hacer? Prueba con las lupas.';
    if (ok && !voted) { voted = true; crit.style.opacity = 1; crit.style.pointerEvents = 'auto'; gsap.fromTo(crit, { y: 20 }, { y: 0, duration: dur(0.6), ease: 'power3.out' }); }
  };
  $('#voteA').onclick = () => vote('A'); $('#voteB').onclick = () => vote('B');
  const chips = $('#critChips');
  const picked = new Set();
  shuffle(D.CRITERIA_POOL, rng(seed())).forEach((c) => {
    const b = mk('button', 'cchip', esc(c.t)); b.dataset.id = c.id; b.dataset.good = c.good ? '1' : '0';
    b.addEventListener('click', () => {
      if (picked.has(c.id)) picked.delete(c.id); else if (picked.size < 3) picked.add(c.id); else { toast('Elige solo tres: quita una primero'); return; }
      evalCrit();
    });
    chips.appendChild(b);
  });
  function evalCrit() {
    $$('.cchip', chips).forEach((b) => { b.classList.toggle('on', picked.has(b.dataset.id)); b.classList.remove('bad'); });
    $('#critN').textContent = `${picked.size} de 3`;
    const fb = $('#critFb');
    if (picked.size < 3) { fb.textContent = ''; return; }
    const sel = D.CRITERIA_POOL.filter((c) => picked.has(c.id));
    const bad = sel.filter((c) => !c.good);
    if (bad.length) {
      $$('.cchip', chips).forEach((b) => b.classList.toggle('bad', bad.some((x) => x.id === b.dataset.id)));
      fb.innerHTML = `<b style="color:var(--err)">Cambia la marcada en rojo.</b> ${esc(bad[0].why)}`;
    } else {
      S.crit = sel.map((c) => c.id);
      fb.innerHTML = '<b style="color:var(--ok)">✓ Tres criterios que ayudan a enseñar.</b> Los compararemos con la rúbrica en la diapositiva 7.';
      burst($('#critBox'), 80);
    }
    if (bad.length) S.crit = [];
  }
}

/* ---------- 4 · preguntas iniciales ---------- */
function initQuestions() {
  const row = $('#notesRow'), ans = $('#qAns');
  const rot = [-2, 1.5, -1, 2, -1.5];
  let cur = -1;
  const doneN = () => S.qAns.filter((a) => a.trim().length >= 8).length;
  D.QUESTIONS.forEach((q, i) => {
    const b = mk('button', 'note', `<b>${String(i + 1).padStart(2, '0')}</b>${esc(q.q)}`);
    b.style.setProperty('--nc', NOTE_BG[q.c]); b.style.setProperty('--r', rot[i] + 'deg'); b.setAttribute('role', 'listitem'); b.dataset.i = i;
    b.addEventListener('click', () => {
      cur = i; $$('.note', row).forEach((x) => x.classList.toggle('on', x === b));
      $('#qTag').textContent = `PREGUNTA ${i + 1} · IDEA DE APOYO`;
      $('#qTitle').textContent = q.q; $('#qText').textContent = q.idea;
      ans.disabled = false; ans.value = S.qAns[i]; ans.focus();
    });
    row.appendChild(b);
  });
  const paint = () => {
    $$('.note', row).forEach((b, i) => b.classList.toggle('done', S.qAns[i].trim().length >= 8));
    $('#qGauge').style.width = `${(doneN() / 5) * 100}%`; $('#qCount').textContent = `${doneN()} de 5 respondidas`;
  };
  ans.addEventListener('input', () => { if (cur < 0) return; S.qAns[cur] = ans.value; store.set('a' + cur, ans.value); paint(); if (doneN() === 5) toast('Las cinco preguntas tienen respuesta'); });
  paint();
}

/* ---------- 5 · vocabulario (arrastrar) ---------- */
function initVocab() {
  const bank = $('#vBank'), grid = $('#vGrid');
  const COLS = ['var(--hi)', 'var(--mint)', 'var(--pink)', 'var(--sky)', 'var(--lilac)', 'var(--coral)'];
  let ok = 0, err = 0, selChip = -1, drags = [];
  function build() {
    drags.forEach((d) => d.kill()); drags = [];
    bank.innerHTML = ''; grid.innerHTML = ''; ok = 0; err = 0; selChip = -1;
    const rnd = rng(seed());
    const rows = shuffle(D.VOCAB.map((_, i) => i), rnd).map((i) => {
      const r = mk('div', 'vrow'); r.dataset.i = i;
      r.innerHTML = `<div class="vdrop" data-i="${i}" style="--vc:${COLS[i % 6]}">suelta aquí</div><div class="vdef">${esc(D.VOCAB[i].d)}</div>`;
      grid.appendChild(r); return r;
    });
    shuffle(D.VOCAB.map((_, i) => i), rnd).forEach((i) => {
      const c = mk('button', 'vchip', esc(D.VOCAB[i].t)); c.dataset.i = i; bank.appendChild(c);
      c.addEventListener('click', () => { if (c.classList.contains('dragging')) return; selChip = selChip === i ? -1 : i; $$('.vchip', bank).forEach((x) => x.classList.toggle('sel', +x.dataset.i === selChip)); });
      drags.push(Draggable.create(c, {
        type: 'x,y', zIndexBoost: true,
        onDragStart() { c.classList.add('dragging'); },
        onDragEnd() { const drop = overlapped(c, $$('.vdrop:not(.done)', grid)); setTimeout(() => c.classList.remove('dragging'), 30); if (drop) place(i, +drop.dataset.i, c); else gsap.to(c, { x: 0, y: 0, duration: dur(0.4), ease: 'power3.out' }); },
        onRelease() { setTimeout(() => c.classList.remove('dragging'), 30); },
      })[0]);
    });
    $$('.vrow', grid).forEach((r) => r.addEventListener('click', (e) => { if (e.target.closest('.vchip')) return; if (selChip >= 0) { const c = $(`.vchip[data-i="${selChip}"]`, bank); if (c) place(selChip, +r.dataset.i, c); } }));
    stat(); $('#vFb').textContent = 'Arrastra un término (o tócalo) y suéltalo sobre su definición.';
  }
  const stat = () => { $('#vOk').textContent = ok; $('#vErr').textContent = err; };
  function place(ci, ri, chip) {
    const row = $(`.vrow[data-i="${ri}"]`, grid), drop = $('.vdrop', row);
    if (drop.classList.contains('done')) return;
    if (ci === ri) {
      ok++; selChip = -1;
      const d = drags.find((x) => x.target === chip); d?.kill();
      gsap.set(chip, { x: 0, y: 0, clearProps: 'transform' });
      drop.textContent = ''; drop.appendChild(chip); drop.classList.add('done'); chip.classList.remove('sel', 'dragging');
      gsap.fromTo(drop, { scale: 1.06 }, { scale: 1, duration: dur(0.5), ease: 'elastic.out(1,.5)' });
      $('#vFb').innerHTML = `<b style="color:var(--mint)">✓ ${esc(D.VOCAB[ri].t)}.</b> ${esc(D.VOCAB[ri].d)}`;
      if (ok === 8) { burst($('#vOk'), 140); $('#vFb').innerHTML = `<b style="color:var(--mint)">¡Vocabulario completo!</b> ${err ? `Con ${err} intento${err > 1 ? 's' : ''} fallido${err > 1 ? 's' : ''}: repasa los que dudaste.` : 'Sin errores.'}`; }
    } else {
      err++; row.classList.remove('wrong'); void row.offsetWidth; row.classList.add('wrong');
      gsap.to(chip, { x: 0, y: 0, duration: dur(0.4), ease: 'power3.out' });
      $('#vFb').innerHTML = `<b style="color:var(--coral)">Todavía no.</b> «${esc(D.VOCAB[ci].t)}» no corresponde a esa definición. Piensa en su idea clave.`;
    }
    stat();
  }
  $('#vReset').onclick = build;
  build();
}

/* ---------- 6 · una diapositiva en cinco capas ---------- */
function initLayers(deck, three) {
  let step = 0;
  const list = $('#layList');
  D.LAYERS.forEach((L, i) => {
    const li = mk('li', '', `<b>${i + 1}</b><div><strong>${L.name}</strong><span>${esc(L.short)}</span></div>`); li.style.setProperty('--lc', CV[L.c]); li.dataset.i = i;
    li.addEventListener('click', () => { if (i < step) show(i); });
    list.appendChild(li);
  });
  function show(i) {
    const L = D.LAYERS[i];
    $('#layCard').style.setProperty('--lc', CV[L.c]);
    $('#layName').textContent = `${i + 1}. ${L.name}`; $('#layText').textContent = L.text;
    $$('#layList li').forEach((li, k) => li.classList.toggle('on', k === i));
    three.lay.highlight(i);
  }
  const paint = () => {
    $$('#layList li').forEach((li, i) => { li.classList.toggle('done', i < step); if (i >= step) li.classList.remove('on'); });
    const nx = $('#layNext');
    nx.textContent = step >= 5 ? 'Diapositiva armada ✓' : `Agregar capa ${step + 1}: ${D.LAYERS[step].name}`; nx.disabled = step >= 5;
  };
  $('#layNext').onclick = () => {
    if (step >= 5) return;
    step++; three.lay.setStep(step); show(step - 1); paint();
    if (step === 5) setTimeout(() => {
      three.lay.assemble(true); three.lay.highlight(-1);
      $('#layName').textContent = 'Diapositiva armada';
      $('#layText').textContent = 'Cinco capas, una sola idea: propósito claro, idea científica correcta, evidencia visual, fuente verificable y un mensaje de autocuidado.';
      $$('#layList li').forEach((li) => li.classList.remove('on'));
      burst($('#layCard'), 100);
    }, motion.reduced ? 50 : 1100);
  };
  $('#layReset').onclick = () => {
    step = 0; three.lay.reset(); paint();
    $('#layName').textContent = 'Arma la diapositiva'; $('#layText').textContent = 'Pulsa «Agregar capa» para construir una diapositiva con la secuencia del plan.';
  };
  three.onLayerPick = (i) => { if (i < step) show(i); };
  paint();
  deck.hooks.enter[5] = () => { three.live.lay = true; three.lay.resize(); };
  deck.hooks.leave[5] = () => { three.live.lay = false; };
}

/* ---------- 7 · estructura del PPT y rúbrica ---------- */
function initRubric(deck) {
  const cards = $('#rubCards');
  let idx = 0, errs = 0, lock = false;
  D.RUBRIC.forEach((r) => {
    const b = mk('button', 'rubc', `<b>${esc(r.name)}</b><span>${esc(r.d)}</span>`); b.style.setProperty('--rc', CV[r.c]); b.dataset.id = r.id;
    b.addEventListener('click', () => answer(r.id, b));
    cards.appendChild(b);
  });
  const list = $('#structList');
  D.SLIDES7.forEach((s) => list.appendChild(mk('li', '', `<i>${s.n}</i><div>${esc(s.t)}<small>${esc(s.hint)}</small></div>`)));
  function show() {
    if (idx >= D.RUBRIC_STATEMENTS.length) {
      $('#stNum').textContent = 'FRASES COMPLETAS'; $('#stText').textContent = errs ? `Las seis frases quedaron clasificadas con ${errs} intento${errs > 1 ? 's' : ''} fallido${errs > 1 ? 's' : ''}.` : '¡Seis de seis sin errores!';
      $('#rubFb').innerHTML = '<b>La rúbrica oficial es la que entregue tu docente.</b> Estos seis criterios guiarán tu planificación.'; burst($('#stText'), 110); return;
    }
    $('#stNum').textContent = `FRASE ${idx + 1} DE 6`; $('#stText').textContent = D.RUBRIC_STATEMENTS[idx].s; lock = false;
  }
  function answer(id, b) {
    if (lock || idx >= D.RUBRIC_STATEMENTS.length || b.classList.contains('used')) return;
    const st = D.RUBRIC_STATEMENTS[idx];
    if (id === st.a) {
      lock = true; b.classList.add('ok', 'used');
      $('#rubFb').innerHTML = `<b style="color:#bff7e3">✓ Criterio: ${esc(D.RUBRIC.find((r) => r.id === id).name)}.</b>`;
      idx++; setTimeout(show, motion.reduced ? 100 : 1000);
    } else {
      errs++; b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad');
      $('#rubFb').innerHTML = '<b>Todavía no.</b> Piensa qué evidencia de calidad demuestra esa frase.';
      setTimeout(() => b.classList.remove('bad'), 700);
    }
  }
  const mine = () => {
    const box = $('#mineBox');
    if (!S.crit.length) { box.innerHTML = '<span class="dim" style="color:var(--ink2)">Aún no elegiste criterios en la diapositiva 3.</span>'; return; }
    box.innerHTML = S.crit.map((id) => { const c = D.CRITERIA_POOL.find((x) => x.id === id); const r = D.RUBRIC.find((x) => x.id === c.rub); return `<div class="m"><i>✓</i><span><b>${esc(c.t)}</b> → ${esc(r.name)}</span></div>`; }).join('') +
      `<div style="margin-top:6px;color:var(--ink2);font-size:17px">Coinciden con ${new Set(S.crit.map((id) => D.CRITERIA_POOL.find((x) => x.id === id).rub)).size} de los 6 criterios.</div>`;
  };
  deck.hooks.enter[6] = mine;
  show(); mine();
}

/* ---------- 8 · tema y audiencia ---------- */
function initTopic() {
  const grid = $('#topicGrid'), chips = $('#audChips');
  const OAC = { 'OA 1': 'var(--mint)', 'OA 2': 'var(--pink)', 'OA 3': 'var(--hi)' };
  D.TOPICS.forEach((t) => {
    const b = mk('button', 'tcard', `<i>${t.oa}</i><br>${esc(t.name)}`); b.style.setProperty('--oc', OAC[t.oa]); b.dataset.id = t.id; b.setAttribute('role', 'radio');
    b.addEventListener('click', () => { S.topic = t.id; paint(); });
    grid.appendChild(b);
  });
  D.AUDIENCES.forEach((a, i) => {
    const b = mk('button', 'achip', esc(a)); b.dataset.i = i; b.setAttribute('role', 'radio');
    b.addEventListener('click', () => { S.aud = i; paint(); });
    chips.appendChild(b);
  });
  $$('.gck').forEach((c) => c.addEventListener('change', paint));
  let announced = false;
  function paint() {
    $$('.tcard', grid).forEach((b) => { const on = +b.dataset.id === S.topic; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
    $$('.achip', chips).forEach((b) => { const on = +b.dataset.i === S.aud; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
    S.guard = $$('.gck').every((c) => c.checked);
    const fb = $('#guardFb'), t = topicOf();
    if (t && S.aud !== null && S.guard) {
      fb.innerHTML = `<span style="color:var(--ok)">✓ Tema fijado:</span> ${esc(t.name)} · ${esc(D.AUDIENCES[S.aud])}. Dentro de ${t.oa}.`;
      if (!announced) { announced = true; burst($('.guard'), 90); }
    } else if (t && S.aud !== null) fb.textContent = 'Confirma los tres resguardos para fijar el tema.';
    else if (t) fb.textContent = 'Ahora elige la audiencia escolar.';
    else fb.textContent = 'Elige tema, audiencia y confirma el resguardo.';
    refresh.ficha(); refresh.pitch();
  }
  refresh.topic = paint;
  paint();
}

/* ---------- 9 · ficha de planificación ---------- */
function initFicha() {
  const f = { q: $('#fQ'), i: [$('#fI0'), $('#fI1'), $('#fI2')], myth: $('#fMyth'), ev: $('#fEv'), msg: $('#fMsg') };
  f.q.value = S.q; f.i.forEach((e, k) => { e.value = S.ideas[k]; }); f.myth.value = S.myth; f.ev.value = S.ev; f.msg.value = S.msg;
  const sync = () => {
    S.q = f.q.value; S.ideas = f.i.map((e) => e.value); S.myth = f.myth.value; S.ev = f.ev.value; S.msg = f.msg.value;
    store.set('q', S.q); S.ideas.forEach((v, k) => store.set('i' + k, v)); store.set('myth', S.myth); store.set('ev', S.ev); store.set('msg', S.msg);
    paint(); refresh.pitch();
  };
  [f.q, ...f.i, f.myth, f.ev, f.msg].forEach((e) => e.addEventListener('input', sync));
  const YN = /^¿\s*(es|son|se puede|puede|pueden|existe|hay|est[aá]|est[aá]n|sirve|sirven)(?![a-záéíóúñ])/i;
  function semaphore() {
    const q = S.q.trim(), t = topicOf(), w = nWords(q);
    const rows = [];
    rows.push(['Formato de pregunta (¿…?)', !q ? '' : /^¿.+\?$/.test(q) ? 'g' : /[¿?]/.test(q) ? 'y' : 'r']);
    rows.push(['Extensión adecuada (6 a 22 palabras)', !q ? '' : w >= 6 && w <= 22 ? 'g' : w >= 4 ? 'y' : 'r']);
    rows.push(['Se responde con evidencia (no solo sí/no)', !q ? '' : YN.test(q) ? 'r' : 'g']);
    rows.push(['Se relaciona con el tema elegido', !q ? '' : !t ? 'y' : t.kw.test(q) ? 'g' : 'r']);
    return rows;
  }
  function paint() {
    const t = topicOf();
    $('#fTopic').textContent = t ? `${t.oa} · ${t.name}` : 'Sin tema elegido (vuelve a la diapositiva 8)';
    const rows = semaphore();
    S.qScore = S.q.trim() ? rows.filter((r) => r[1] === 'g').length / 4 : 0;
    $('#sema').innerHTML = rows.map(([t2, c]) => `<div class="sm ${c}"><i>${c === 'g' ? '✓' : c === 'y' ? '!' : c === 'r' ? '✕' : ''}</i>${t2}</div>`).join('');
    const vals = [S.q, ...S.ideas, S.myth, S.ev, S.msg];
    const filled = vals.filter((v) => nWords(v) >= 3).length;
    const pct = Math.round((filled / vals.length) * 100);
    $('#fGauge').style.width = pct + '%'; $('#fPct').textContent = pct + ' %';
  }
  $('#fExample').onclick = () => {
    const t = topicOf();
    if (!t) { toast('Primero elige un tema en la diapositiva 8'); return; }
    f.q.value = t.ex.q; f.i.forEach((e, k) => { e.value = t.ex.ideas[k]; }); f.myth.value = t.ex.myth; f.ev.value = t.ex.ev; f.msg.value = t.ex.msg;
    sync(); toast('Ejemplo cargado: edítalo con tus propias palabras'); burst($('#fPct'), 60);
  };
  refresh.ficha = () => { f.q.value = S.q; f.i.forEach((e, k) => { e.value = S.ideas[k]; }); f.myth.value = S.myth; f.ev.value = S.ev; f.msg.value = S.msg; paint(); };
  paint();
}

/* ---------- 10 · fuentes ---------- */
function initSources() {
  const grid = $('#srcGrid'), done = new Set();
  shuffle(D.SOURCES, rng(seed())).forEach((s) => {
    const c = mk('div', 'scard paper');
    c.dataset.id = s.id; c.dataset.cat = s.cat;
    c.innerHTML = `<p>${esc(s.t)}</p><div class="yn">${['P', 'A', 'N'].map((k) => `<button data-c="${k}">${D.SRC_CAT[k]}</button>`).join('')}</div><div class="why"></div><button class="star" aria-pressed="false">★ Incluir</button>`;
    $$('.yn button', c).forEach((b) => b.addEventListener('click', () => {
      const good = b.dataset.c === s.cat;
      $$('.yn button', c).forEach((x) => { x.disabled = true; if (x.dataset.c === s.cat) x.classList.add('ok'); });
      if (!good) b.classList.add('bad');
      $('.why', c).innerHTML = `<b style="color:${good ? 'var(--ok)' : 'var(--err)'}">${good ? '✓' : '✕ Correcto: ' + D.SRC_CAT[s.cat] + '.'}</b> ${esc(s.why)}`;
      done.add(s.id); if (good) c.dataset.good = '1';
      c.classList.add('done'); if (!s.inst || !good) $('.star', c).style.display = 'none';
      paint();
    }));
    $('.star', c).addEventListener('click', () => {
      const i = S.srcs.indexOf(s.id);
      if (i >= 0) S.srcs.splice(i, 1); else if (S.srcs.length >= 2) { toast('Ya elegiste dos fuentes: quita una primero'); return; } else S.srcs.push(s.id);
      paint(); if (S.srcs.length === 2) burst($('.src-bar'), 90);
    });
    grid.appendChild(c);
  });
  function paint() {
    $$('.scard', grid).forEach((c) => { const on = S.srcs.includes(c.dataset.id); const b = $('.star', c); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.textContent = on ? '★ Incluida' : '★ Incluir'; });
    $('#srcOk').textContent = done.size; $('#srcInst').textContent = S.srcs.length;
    $('#srcChosen').innerHTML = S.srcs.map((id) => `<span class="src-chip">${esc(D.SOURCES.find((x) => x.id === id).t)}</span>`).join('');
    $('#srcHint').textContent = S.srcs.length === 2 ? 'Listas para el checklist «¿Información o rumor?» de la clase 26.' : 'Clasifica bien una fuente institucional y márcala con ★ para incluirla.';
    refresh.pitch();
  }
  refresh.src = paint;
  paint();
}

/* ---------- 11 · siete diapositivas ---------- */
function initSeven(deck, three) {
  const rowsEl = $('#sevenRows');
  let sel = 0;
  const rows = D.SLIDES7.map((s, i) => {
    const r = mk('div', 'srow', `<b>${s.n}</b><strong>${esc(s.t)}<small>${esc(s.hint)}</small></strong><input aria-label="Oración objetivo de la diapositiva ${s.n}" placeholder="Al terminar, la audiencia podrá…"><button>Usar ejemplo</button><i>·</i>`);
    const inp = $('input', r); inp.value = S.objs[i];
    inp.addEventListener('focus', () => select(i));
    inp.addEventListener('input', () => { S.objs[i] = inp.value; store.set('o' + i, inp.value); paintRow(i); refresh.pitch(); });
    $('button', r).addEventListener('click', () => { inp.value = s.ex; S.objs[i] = s.ex; store.set('o' + i, s.ex); select(i); paintRow(i); refresh.pitch(); });
    rowsEl.appendChild(r); return r;
  });
  const OBJ_START = /^al terminar,?\s+(la audiencia|el p[uú]blico|las personas|quienes)/i;
  const statusOf = (v) => { const t = v.trim(); if (!t) return 0; const w = nWords(t); return OBJ_START.test(t) && D.OBJ_VERBS.test(t) && w >= 6 && w <= 30 ? 2 : 1; };
  function paintRow(i) {
    const st = statusOf(S.objs[i]); const r = rows[i];
    r.classList.toggle('ok', st === 2); r.classList.toggle('warn', st === 1);
    $('i', r).textContent = st === 2 ? '✓' : st === 1 ? '!' : '·';
    three.tb.setStatus(i, st);
  }
  function select(i) { sel = i; rows.forEach((r, k) => r.classList.toggle('on', k === i)); three.tb.setSelected(i); }
  three.onCardPick = (i) => { select(i); $('input', rows[i]).focus(); };
  refresh.seven = () => { rows.forEach((r, i) => { $('input', r).value = S.objs[i]; paintRow(i); }); };
  deck.hooks.enter[10] = () => { three.live.tb = true; three.tb.resize(); rows.forEach((_, i) => paintRow(i)); select(sel); };
  deck.hooks.leave[10] = () => { three.live.tb = false; };
  rows.forEach((_, i) => paintRow(i));
}

/* ---------- 12 · roles ---------- */
function initRoles() {
  const bank = $('#roleBank'), grid = $('#teamGrid');
  let selRole = null, drags = [];
  const assignedTo = (rid) => (S.roles[rid] !== undefined && S.roles[rid] < S.team ? S.roles[rid] : -1);
  function chip(r, inPerson) {
    const c = mk('div', 'rchip', `<b>${esc(r.t)}</b><span>${esc(r.d)}</span>`); c.style.setProperty('--rc', CV[r.c]); c.dataset.id = r.id; c.tabIndex = 0; c.setAttribute('role', 'button');
    if (selRole === r.id) c.classList.add('sel');
    const toggle = () => { selRole = selRole === r.id ? null : r.id; render(); };
    c.addEventListener('click', () => { if (c.classList.contains('dragging')) return; toggle(); });
    c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    return c;
  }
  function render() {
    drags.forEach((d) => d.kill()); drags = [];
    bank.innerHTML = ''; grid.innerHTML = '';
    D.ROLES.forEach((r) => { const cell = mk('div', 'rcell'); if (assignedTo(r.id) < 0) cell.appendChild(chip(r)); bank.appendChild(cell); });
    for (let p = 0; p < S.team; p++) {
      const card = mk('div', 'person paper'); card.dataset.p = p;
      card.innerHTML = `<div class="top"><span class="av">${p + 1}</span><input aria-label="Nombre del integrante ${p + 1}" value="${esc(S.names[p])}"></div><div class="got"></div>`;
      const inp = $('input', card); inp.addEventListener('input', () => { S.names[p] = inp.value; store.set('n' + p, inp.value); refresh.end(); });
      const got = $('.got', card);
      D.ROLES.filter((r) => assignedTo(r.id) === p).forEach((r) => got.appendChild(chip(r, true)));
      card.addEventListener('click', (e) => { if (e.target.closest('input') || e.target.closest('.rchip')) return; if (selRole) assign(selRole, p); });
      grid.appendChild(card);
    }
    $$('.rchip', document.querySelector('.s-roles')).forEach((c) => {
      const rid = c.dataset.id;
      drags.push(Draggable.create(c, {
        type: 'x,y', zIndexBoost: true,
        onDragStart() { c.classList.add('dragging'); },
        onRelease() { setTimeout(() => c.classList.remove('dragging'), 30); },
        onDragEnd() {
          const person = overlapped(c, $$('.person', grid), '30%');
          const inBank = !person && Draggable.hitTest(c, bank, '30%');
          setTimeout(() => c.classList.remove('dragging'), 30);
          if (person) assign(rid, +person.dataset.p);
          else if (inBank && assignedTo(rid) >= 0) { delete S.roles[rid]; render(); }
          else gsap.to(c, { x: 0, y: 0, duration: dur(0.35), ease: 'power3.out' });
        },
      })[0]);
    });
    check();
  }
  function assign(rid, p) { S.roles[rid] = p; selRole = null; render(); }
  function counts() { const c = Array(S.team).fill(0); D.ROLES.forEach((r) => { const p = assignedTo(r.id); if (p >= 0) c[p]++; }); return c; }
  let announced = false;
  function check() {
    const c = counts(), un = D.ROLES.filter((r) => assignedTo(r.id) < 0);
    const fb = $('#roleFb');
    S.rolesOk = false;
    if (un.length) fb.textContent = `Faltan ${un.length} rol${un.length > 1 ? 'es' : ''} por asignar: ${un.map((r) => r.t).join(', ')}.`;
    else if (c.some((x) => x === 0)) fb.innerHTML = `<b style="color:var(--hi)">Hay integrantes sin rol.</b> Todos deben participar: reparte los roles.`;
    else if (c.some((x) => x > 2)) fb.innerHTML = `<b style="color:var(--hi)">Hay integrantes con más de dos roles.</b> Reparte mejor la carga.`;
    else { S.rolesOk = true; fb.innerHTML = '<b style="color:var(--mint)">✓ Roles bien distribuidos.</b> Todos participan y todos exponen una parte.'; if (!announced) { announced = true; burst($('#teamN'), 100); } }
    refresh.pitch();
  }
  $('#teamN').textContent = S.team;
  $('#teamMinus').onclick = () => { if (S.team > 3) { S.team--; Object.keys(S.roles).forEach((k) => { if (S.roles[k] >= S.team) delete S.roles[k]; }); $('#teamN').textContent = S.team; render(); } };
  $('#teamPlus').onclick = () => { if (S.team < 6) { S.team++; $('#teamN').textContent = S.team; render(); } };
  refresh.roles = () => { $('#teamN').textContent = S.team; render(); };
  render();
}

/* ---------- 13 · pitch + radar ---------- */
function initPitch(deck, three) {
  const textEl = $('#pitchText');
  const ph = (t) => `<span class="ph">[${t}]</span>`;
  const short = (s) => s.trim().replace(/\.$/, '').split(/(?<=[.;])\s/)[0].replace(/\.$/, '');
  let words = [];
  function script() {
    const q = S.q.trim(), ideas = S.ideas.map((x) => short(x)).filter(Boolean);
    const srcs = S.srcs.map((id) => D.SOURCES.find((x) => x.id === id).t.replace(/ \(.+?\)/, ''));
    const parts = [
      ['Nuestro proyecto responde la pregunta ', q ? `«${esc(q)}»` : ph('pregunta central')],
      ['. Enseñará que ', ideas.length ? esc(ideas.slice(0, 2).map((s) => s.charAt(0).toLowerCase() + s.slice(1)).join(', y que ')) : ph('ideas científicas')],
      ['. Lo respaldaremos con ', S.ev.trim() ? esc(S.ev.trim().replace(/\.$/, '').replace(/^./, (c) => c.toLowerCase())) : ph('evidencia o gráfico')],
      [', con fuentes como ', srcs.length ? esc(srcs.join(' y ')) : ph('dos fuentes institucionales')],
      ['. Nuestro mensaje de autocuidado es: ', S.msg.trim() ? esc(S.msg.trim()) : ph('mensaje de autocuidado')],
    ];
    return parts;
  }
  function renderScript() {
    const html = script().map(([a, b]) => a + b).join('');
    textEl.innerHTML = html.replace(/(>[^<]*)|([^<>]+)(?=<|$)/g, (m) => m);
    // palabras para el karaoke (solo texto fuera de etiquetas)
    const div = document.createElement('div'); div.innerHTML = html;
    const frag = [];
    const walk = (n) => n.childNodes.forEach((c) => {
      if (c.nodeType === 3) frag.push(...c.textContent.split(/(\s+)/).filter(Boolean).map((t) => (/^\s+$/.test(t) ? t : `<span class="pw">${esc(t)}</span>`)));
      else if (c.nodeType === 1) { frag.push(`<span class="${c.className}">`); walk(c); frag.push('</span>'); }
    });
    walk(div); textEl.innerHTML = frag.join('');
    words = $$('.pw', textEl);
  }
  function values() {
    const t = topicOf();
    const v = [
      Math.min(1, (S.qScore ?? 0) * 1.34),
      t ? (S.guard ? 1 : 0.6) : 0,
      Math.min(1, S.srcs.length / 2),
      nWords(S.ev) >= 3 ? 1 : S.ev.trim() ? 0.4 : 0,
      S.rolesOk ? 1 : Math.min(0.75, D.ROLES.filter((r) => S.roles[r.id] !== undefined && S.roles[r.id] < S.team).length / 8),
    ];
    return v;
  }
  let gate = false;
  function update() {
    renderScript();
    const v = values();
    gate = v[0] >= 0.99 && v[2] >= 0.99;
    three.rd.setValues(v); three.rd.setGate(gate);
    const miss = [];
    if (v[0] < 0.99) miss.push('una pregunta central más clara (revisa el semáforo de la ficha)');
    if (v[2] < 0.99) miss.push('dos fuentes institucionales previstas');
    const g = $('#gate');
    g.classList.toggle('pass', gate);
    g.innerHTML = gate ? '✓ Pasa a la fase de computación<small>Tiene pregunta central clara y dos fuentes institucionales iniciales.</small>' : `Todavía no pasa a computación<small>Falta: ${miss.join(' y ')}.</small>`;
    const n = words.length;
    $('#pClock').title = `${n} palabras (ideal: 60 a 80 para 30 segundos)`;
    update.v = v;
  }
  refresh.pitch = () => { if (document.querySelector('.s-pitch.active') || true) update(); };
  const ring = $('#pRingFg'), clk = $('#pClock');
  const timer = makeTimer(30, (left, total) => {
    clk.textContent = `00:${String(left).padStart(2, '0')}`; setRing(ring, left / total);
    const on = Math.round(words.length * (1 - left / total)); words.forEach((w, i) => w.classList.toggle('on', i < on));
  }, () => { toast('¡30 segundos! ¿Alcanzaste a decirlo todo?'); $('#pStart').textContent = 'Practicar el pitch'; });
  $('#pStart').onclick = () => {
    if (timer.running) { timer.reset(); $('#pStart').textContent = 'Practicar el pitch'; words.forEach((w) => w.classList.remove('on')); return; }
    renderScript(); timer.start(); $('#pStart').textContent = 'Detener';
    if (words.length > 95) toast('El guion es largo para 30 segundos: acórtalo');
  };
  $('#pPrec').onclick = () => {
    const v = update.v || values();
    const i = v.indexOf(Math.min(...v));
    $('#precText').textContent = D.FORM_CRIT[i].prec; gsap.fromTo('#precBox', { scale: 0.97 }, { scale: 1, duration: dur(0.5), ease: 'back.out(2)' });
  };
  $('#pDemo').onclick = () => { loadDemo(); update(); toast('Proyecto de ejemplo cargado (ficticio)'); };
  setRing(ring, 1);
  deck.hooks.enter[12] = () => { three.live.rd = true; three.rd.resize(); update(); };
  deck.hooks.leave[12] = () => { three.live.rd = false; timer.reset(); words.forEach((w) => w.classList.remove('on')); $('#pStart').textContent = 'Practicar el pitch'; };
  update();
}

function loadDemo() {
  const t = D.TOPICS.find((x) => x.id === 8);
  S.topic = 8; S.aud = 0; S.guard = true; $$('.gck').forEach((c) => { c.checked = true; });
  S.q = t.ex.q; S.ideas = t.ex.ideas.slice(); S.myth = t.ex.myth; S.ev = t.ex.ev; S.msg = t.ex.msg;
  store.set('q', S.q); S.ideas.forEach((v, k) => store.set('i' + k, v)); store.set('myth', S.myth); store.set('ev', S.ev); store.set('msg', S.msg);
  S.srcs = ['minsal', 'oms'];
  S.objs = D.SLIDES7.map((s) => s.ex); S.objs.forEach((v, i) => store.set('o' + i, v));
  S.team = 4; D.ROLES.forEach((r, i) => { S.roles[r.id] = [0, 0, 1, 2, 3, 3][i]; });
  refresh.topic(); refresh.ficha(); refresh.src(); refresh.seven(); refresh.roles(); refresh.end();
}

/* ---------- 14 · ticket, plan maestro y aviso ---------- */
function initEnd(deck) {
  const tA = $('#tA'), tB = $('#tB');
  tA.value = store.get('tA'); tB.value = store.get('tB');
  function lists() {
    const a = [...S.ideas.filter((x) => x.trim()).map((x) => x.trim().replace(/\.$/, '')), S.q.trim()].filter(Boolean);
    const b = [S.ev.trim(), ...S.srcs.map((id) => 'una fuente institucional: ' + D.SOURCES.find((x) => x.id === id).t)].filter(Boolean);
    $('#dlA').innerHTML = a.map((x) => `<option value="${esc(x)}">`).join('');
    $('#dlB').innerHTML = b.map((x) => `<option value="${esc(x)}">`).join('');
  }
  const SRC_RE = /fuente|minsal|oms|curr[ií]culum|institu|oficial|dato|gr[aá]fic|esquema|tabla|evidencia/i;
  let announced = false;
  function ticket() {
    store.set('tA', tA.value); store.set('tB', tB.value);
    const fb = $('#ticketFb'); const a = nWords(tA.value), b = nWords(tB.value);
    if (!a || !b) { fb.textContent = 'Completa la frase con elementos de tu ficha.'; return; }
    if (a < 3) fb.innerHTML = '<b style="color:var(--coral-d)">Precisa más lo que enseñarán:</b> una idea científica concreta (mínimo tres palabras).';
    else if (b < 3 || !SRC_RE.test(tB.value)) fb.innerHTML = '<b style="color:var(--coral-d)">Falta el respaldo:</b> nombra la evidencia (gráfico, esquema, dato) y la fuente institucional.';
    else { fb.innerHTML = '<b style="color:var(--ok)">✓ Ticket completo.</b> Enseña una idea concreta y la respalda con evidencia y fuente.'; if (!announced) { announced = true; burst($('.ticket'), 90); } }
  }
  tA.addEventListener('input', ticket); tB.addEventListener('input', ticket);
  function summary() {
    const t = topicOf();
    const n = (S.q.trim() ? 1 : 0) + S.ideas.filter((x) => x.trim()).length;
    const rows = [
      ['TEMA', t ? `${t.oa} · ${t.name}` : '—'], ['AUDIENCIA', S.aud !== null ? D.AUDIENCES[S.aud] : '—'], ['PREGUNTA', S.q.trim() || '—'],
      ['IDEAS', `${S.ideas.filter((x) => x.trim()).length} de 3`], ['FUENTES', S.srcs.length ? S.srcs.map((id) => D.SOURCES.find((x) => x.id === id).t.replace(/ \(.+?\)/, '')).join(' · ') : '—'],
      ['GUION', `${S.objs.filter((o) => o.trim()).length} de 7 oraciones`], ['ROLES', S.rolesOk ? 'Distribuidos ✓' : 'Por completar'],
    ];
    $('#planSum').innerHTML = rows.map(([k, v]) => `<div><b>${k}</b><span>${esc(v)}</span></div>`).join('');
    return n;
  }
  function planText() {
    const t = topicOf();
    const roles = D.ROLES.map((r) => `  - ${r.t}: ${S.roles[r.id] !== undefined && S.roles[r.id] < S.team ? S.names[S.roles[r.id]] : '(sin asignar)'}`).join('\n');
    return [
      'PLAN MAESTRO · PROYECTO «AUTOCUIDADO INFORMADO: DEL MITO A LA EVIDENCIA»',
      'Ciencias Naturales 7° · Unidad 4 · Clase 25 (planificación; borrador del grupo)', '',
      `Tema: ${t ? `${t.name} (${t.oa})` : '—'}`, `Audiencia: ${S.aud !== null ? D.AUDIENCES[S.aud] : '—'}`, '',
      `Pregunta central: ${S.q.trim() || '—'}`, '', 'Tres ideas científicas:', ...S.ideas.map((x, i) => `  ${i + 1}. ${x.trim() || '—'}`), '',
      `Mito o duda frecuente: ${S.myth.trim() || '—'}`, `Evidencia o gráfico: ${S.ev.trim() || '—'}`, `Mensaje de autocuidado: ${S.msg.trim() || '—'}`, '',
      'Fuentes previstas (institucionales; verificar en el sitio oficial vigente):', ...(S.srcs.length ? S.srcs.map((id) => `  - ${D.SOURCES.find((x) => x.id === id).t}`) : ['  —']), '',
      'Siete diapositivas (oración objetivo):', ...D.SLIDES7.map((s, i) => `  ${s.n}. ${s.t}: ${S.objs[i].trim() || '—'}`), '',
      'Roles:', roles, '',
      `Ticket de salida: Nuestro proyecto enseñará ${tA.value.trim() || '____'} y lo respaldaremos con ${tB.value.trim() || '____'}.`, '',
      'Próxima clase: computación. Traer esta planificación. Mostrar dos fuentes institucionales antes de crear.',
    ].join('\n');
  }
  $('#planDl').onclick = () => {
    try {
      const url = URL.createObjectURL(new Blob([planText()], { type: 'text/plain;charset=utf-8' }));
      const a = document.createElement('a'); a.href = url; a.download = 'plan-maestro-autocuidado-informado.txt'; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Plan descargado');
    } catch { toast('No se pudo descargar: usa «Copiar»'); }
  };
  $('#planCopy').onclick = async () => {
    try { await navigator.clipboard.writeText(planText()); toast('Plan copiado'); } catch {
      const ta = document.createElement('textarea'); ta.value = planText(); document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast('Plan copiado'); } catch { toast('No se pudo copiar'); } ta.remove();
    }
  };
  $$('.s-end .check input').forEach((c, i) => { c.checked = store.get('ck' + i) === '1'; c.addEventListener('change', () => { store.set('ck' + i, c.checked ? '1' : '0'); if ($$('.s-end .check input').every((x) => x.checked)) { burst($('.check'), 90); toast('Autoevaluación completa'); } }); });
  refresh.end = () => { lists(); summary(); ticket(); };
  deck.hooks.enter[13] = () => { lists(); summary(); ticket(); };
  lists(); summary();
}
