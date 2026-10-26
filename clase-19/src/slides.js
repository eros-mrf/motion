import { gsap } from 'gsap';
import { $, $$, toast, confetti as confettiRaw, motion } from '../../src/util.js';
import * as D from './data.js';
import { scramble } from './deck.js';

const PAL = ['#b8ff3c', '#4d8dff', '#ff4d94', '#ffcf3d', '#ffffff'];
const confetti = (x, y, n) => confettiRaw(x, y, n, PAL);
const CV = { lime: 'var(--lime)', blue: 'var(--blue)', pink: 'var(--pink)', gold: 'var(--gold)' };
const store = {
  get(k, d = '') { try { return localStorage.getItem('c19:' + k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('c19:' + k, v); } catch { /* sin almacenamiento */ } },
};
const dur = (d) => (motion.reduced ? 0.01 : d);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const words = (t) => t.trim().split(/\s+/).filter(Boolean).length;
// rectángulo de un elemento en coordenadas del escenario 1920×1080
function srect(el) {
  const s = $('#stage').getBoundingClientRect(), r = el.getBoundingClientRect(), k = s.width / 1920;
  return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
}
const stagePoint = (el) => { const r = srect(el); return [r.x + r.w / 2, r.y + r.h / 2]; };
// escribe texto letra a letra (máquina de escribir)
function typeInto(el, text, d = 1) {
  if (motion.reduced) { el.textContent = text; return null; }
  const o = { n: 0 };
  el.textContent = '';
  return gsap.to(o, { n: text.length, duration: Math.min(1.8, text.length * 0.018) * d, ease: 'none', onUpdate: () => { el.textContent = text.slice(0, Math.round(o.n)); } });
}

export function initSlides(deck, three) {
  initCover(deck);
  initRoute(deck);
  initAnatomy();
  initQuestions();
  initVocab();
  initLibrary(deck, three);
  initQuery();
  initSynthesis();
  initAgents(deck, three);
  initRoles(deck);
  initFicha(deck, three);
  initQC();
  initDuel();
  initTicket(deck);
}

/* ---------- 1 · portada: búsquedas que se escriben solas ---------- */
function initCover(deck) {
  const QS = ['¿cómo se transmite?', 'síntomas generales de una ITS', '¿cómo se previene? fuente oficial', 'ficha científica con referencias'];
  const el = $('#typed');
  let alive = false, qi = 0, timer;
  const step = () => {
    if (!alive) return;
    const q = QS[qi++ % QS.length];
    let i = 0;
    const type = () => {
      if (!alive) return;
      el.textContent = q.slice(0, ++i);
      if (i < q.length) timer = setTimeout(type, 55 + Math.random() * 50);
      else timer = setTimeout(erase, 1700);
    };
    const erase = () => {
      if (!alive) return;
      el.textContent = el.textContent.slice(0, -1);
      if (el.textContent.length) timer = setTimeout(erase, 22); else timer = setTimeout(step, 250);
    };
    type();
  };
  deck.hooks.enter[0] = () => { alive = true; qi = 0; clearTimeout(timer); if (motion.reduced) el.textContent = QS[0]; else timer = setTimeout(step, 1400); };
  deck.hooks.leave[0] = () => { alive = false; clearTimeout(timer); };
}

/* ---------- 2 · ruta: tubería de datos ---------- */
function initRoute(deck) {
  deck.hooks.enter[1] = () => {
    const nodes = $$('.pipe-steps li');
    const line = $('#pipeLine'), dot = $('#pipeDot');
    gsap.set(dot, { x: 0 });
    const tl = gsap.timeline({ delay: 0.9 });
    tl.to(line, { strokeDashoffset: 0, duration: dur(2.2), ease: 'power2.inOut' }, 0);
    tl.to(dot, { x: 1374, duration: dur(2.2), ease: 'power2.inOut' }, 0);
    nodes.forEach((n, i) => tl.fromTo($('.pn', n), { scale: 0.4, opacity: 0.2 }, { scale: 1, opacity: 1, duration: dur(0.5), ease: 'back.out(2.4)' }, dur(0.55 * i)));
    tl.fromTo('.timeline .seg', { scaleY: 0, transformOrigin: 'bottom' }, { scaleY: 1, duration: dur(0.6), stagger: 0.07, ease: 'expo.out', clearProps: 'transform' }, dur(0.4));
  };
}

/* ---------- 3 · anatomía de una fuente + checklist ---------- */
function initAnatomy() {
  const info = $('#anatInfo');
  const show = (k, anim = true) => {
    const a = D.ANATOMY.find((x) => x.id === k);
    $$('.hot').forEach((h) => h.classList.toggle('on', h.dataset.k === k));
    info.innerHTML = `<div class="tag mono">PUNTO ${a.n} · ${a.name.toUpperCase()}</div><h3>${a.q}</h3><p class="q">Dónde mirar</p><p>${a.tip}</p>`;
    if (anim) gsap.fromTo(info.children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: dur(0.45), stagger: 0.06, ease: 'power3.out', clearProps: 'transform,opacity' });
  };
  $$('.hot').forEach((h) => { h.addEventListener('click', () => show(h.dataset.k)); h.addEventListener('mouseenter', () => show(h.dataset.k, false)); });
  show('inst', false);

  const rows = $('#gateRows');
  rows.innerHTML = [1, 2].map((f) => `<div class="grow"><b class="mono">F${f}</b>${D.ANATOMY.map((a) => `<button class="gck" data-f="${f}" data-k="${a.id}">${a.name.split(' ')[0]}</button>`).join('')}</div>`).join('');
  const gate = $('.gate'), msg = $('#gateMsg');
  let opened = false;
  rows.addEventListener('click', (e) => {
    const b = e.target.closest('.gck'); if (!b) return;
    b.classList.toggle('on');
    const n = $$('.gck.on', rows).length;
    gate.classList.toggle('open', n === 6);
    msg.textContent = n === 6 ? '✓ Dos fuentes validadas: ya pueden escribir.' : `Completa los 3 datos de F1 y F2 (${n}/6).`;
    if (n === 6 && !opened) { opened = true; confetti(...stagePoint($('.lock')), 70); } else if (n < 6) opened = false;
  });
}

/* ---------- 4 · preguntas: consola ---------- */
function initQuestions() {
  const list = $('#qList');
  list.innerHTML = D.QUESTIONS.map((q, i) => `<li><button data-i="${i}" data-a><span class="qn">${i + 1}</span><span>${q.q}</span></button></li>`).join('');
  let cur = -1, tw;
  const show = (i, first) => {
    if (i === cur) return;
    cur = i;
    $$('button', list).forEach((b, k) => { b.classList.toggle('on', k === i); if (k === i) b.classList.add('seen'); });
    $('#qTag').textContent = `consulta_${i + 1}.txt`;
    tw?.kill();
    if (first || motion.reduced) { $('#qTitle').textContent = D.QUESTIONS[i].q; $('#qIdea').textContent = D.QUESTIONS[i].idea; return; }
    scramble($('#qTitle'), D.QUESTIONS[i].q, { duration: 0.7 });
    tw = typeInto($('#qIdea'), D.QUESTIONS[i].idea);
  };
  list.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show(+b.dataset.i); });
  show(0, true);
}

/* ---------- 5 · vocabulario con buscador ---------- */
function initVocab() {
  const grid = $('#vocabGrid');
  grid.innerHTML = D.VOCAB.map((v, i) => `
    <button class="vc" data-a style="--acc:${CV[v.c]}" data-t="${v.t}" aria-expanded="false">
      <span class="vn">${String(i + 1).padStart(2, '0')}</span><span class="vt">${v.t}</span>
      <span class="vd">${v.d}</span><span class="vx">${v.ex}</span>
    </button>`).join('');
  grid.addEventListener('click', (e) => { const c = e.target.closest('.vc'); if (!c) return; const o = c.classList.toggle('open'); c.setAttribute('aria-expanded', o); });
  $('#vq').addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    $$('.vc', grid).forEach((c, i) => {
      const v = D.VOCAB[i];
      const hit = !q || (v.t + ' ' + v.d + ' ' + v.ex).toLowerCase().includes(q);
      c.classList.toggle('dim', !hit);
      if (q && hit) c.classList.add('open');
      const t = $('.vt', c);
      t.innerHTML = q && v.t.toLowerCase().includes(q) ? v.t.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>') : v.t;
    });
  });
}

/* ---------- 6 · biblioteca 3D: auditoría de fuentes ---------- */
function initLibrary(deck, three) {
  const card = $('#libCard'), score = $('#libScore');
  const done = {}; let correct = 0;
  const paintScore = () => { score.textContent = `Auditadas ${Object.keys(done).length} / ${D.SOURCES.length} · aciertos ${correct}`; };
  const empty = () => { card.innerHTML = `<div class="empty"><b>Elige una fuente</b>Gira la biblioteca y toca una tarjeta.<br>Revisa <span class="c-lime">institución</span>, <span class="c-gold">fecha</span> y <span class="c-pink">propósito</span>; luego decide.</div>`; };
  empty(); paintScore();
  const render = (src, i) => {
    const d = done[src.id];
    const mk = (k, label, v) => `<button class="chk ${d ? (v ? 'y' : 'n') : ''}" data-k="${k}" data-v="${v}"><i>${d ? (v ? '✓' : '✕') : '?'}</i>${label}</button>`;
    card.style.setProperty('--acc', src.color);
    card.innerHTML = `
      <span class="kind" style="--kc:${src.color}">${src.kind.toUpperCase()}</span>
      <h3>${src.title}</h3><p class="sub">${src.sub}</p><div class="host">${src.host}</div>
      <div class="chks">${mk('inst', 'Institución', src.inst)}${mk('date', 'Fecha', src.date)}${mk('purp', 'Propósito', src.purp)}</div>
      <div class="ask">¿La usarías en tu ficha?</div>
      <div class="decs">${Object.entries(D.VERDICTS).map(([k, v]) => `<button class="dec ${d && d.pick === k ? 'pick' : ''}" data-d="${k}" style="--dc:${CV[v.cls]}" ${d ? 'disabled' : ''}>${v.label}</button>`).join('')}</div>
      ${d ? `<div class="fb" style="--fc:${CV[D.VERDICTS[src.verdict].cls]}"><b>${d.pick === src.verdict ? '¡Bien!' : 'Revisemos.'} Veredicto: ${D.VERDICTS[src.verdict].label}.</b> ${src.why}</div>` : '<div class="fb" style="--fc:var(--muted)">Toca los tres recuadros «?» para auditar la página y luego decide.</div>'}`;
    gsap.fromTo(card.children, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: dur(0.45), stagger: 0.05, ease: 'power3.out', clearProps: 'transform,opacity' });
    card.dataset.i = i;
  };
  card.addEventListener('click', (e) => {
    const i = +card.dataset.i; const src = D.SOURCES[i];
    const chk = e.target.closest('.chk');
    if (chk && !done[src.id]) {
      const v = chk.dataset.v === 'true'; chk.classList.add(v ? 'y' : 'n'); $('i', chk).textContent = v ? '✓' : '✕';
      gsap.fromTo(chk, { scale: 0.85 }, { scale: 1, duration: dur(0.4), ease: 'back.out(3)' });
    }
    const dec = e.target.closest('.dec');
    if (dec && !done[src.id]) {
      done[src.id] = { pick: dec.dataset.d };
      const ok = dec.dataset.d === src.verdict;
      if (ok) correct++;
      render(src, i); paintScore();
      three.lib.markDone(i, D.VERDICTS[src.verdict].label.toUpperCase(), { use: '#b8ff3c', care: '#ffcf3d', drop: '#ff4d94' }[src.verdict]);
      if (Object.keys(done).length === D.SOURCES.length) { confetti(...stagePoint(score), 120); toast(`Auditoría completa: ${correct} de ${D.SOURCES.length} aciertos`); }
    }
  });
  three.onLibSelect = (src, i) => render(src, i);
  deck.hooks.enter[5] = () => { three.live.lib = true; three.lib.resize(); };
  deck.hooks.leave[5] = () => { three.live.lib = false; };
}

/* ---------- 7 · búsqueda acotada ---------- */
function initQuery() {
  const active = new Set();
  const cloud = $('#chipCloud');
  cloud.innerHTML = D.QUERY_CHIPS.map((c) => `<button class="kc ${c.good ? '' : 'bad'}" data-id="${c.id}">${c.good ? '+ ' : '− '}${c.label}</button>`).join('');
  const BASE = 12400000;
  let shown = BASE; const cnt = { v: BASE };
  const fmt = (n) => Math.round(n).toLocaleString('es-CL');
  function visible() {
    const g = [...active].filter((id) => D.QUERY_CHIPS.find((c) => c.id === id).good).length;
    const b = active.size - g;
    const has = (id) => active.has(id);
    const order = { oficial: 0, cuidado: 1, descartar: 2 };
    const list = D.RESULTS.filter((r) => {
      if (!active.size) return true;
      if (r.tag === 'oficial') return r.need.some(has) || g >= 2;
      if (r.tag === 'cuidado') return r.need.some(has) || g >= 1;
      if (r.need.length) return r.need.some(has);
      return g < 2 && b === 0; // el sitio genérico solo aparece con búsquedas vagas
    });
    return active.size ? list.sort((a, b2) => order[a.tag] - order[b2.tag]) : list.slice().sort((a, b2) => order[b2.tag] - order[a.tag]);
  }
  function paint() {
    $$('.kc', cloud).forEach((b) => b.classList.toggle('on', active.has(b.dataset.id)));
    const tokens = $('#qTokens');
    tokens.innerHTML = active.size ? [...active].map((id) => { const c = D.QUERY_CHIPS.find((x) => x.id === id); return `<span class="tok ${c.good ? '' : 'bad'}">${c.label}</span>`; }).join('') : '<span class="ph">Toca palabras clave para armar la búsqueda…</span>';
    if (active.size) gsap.fromTo($$('.tok', tokens).slice(-1), { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: dur(0.4), ease: 'back.out(3)' });
    let n = BASE; active.forEach((id) => { n *= D.QUERY_CHIPS.find((c) => c.id === id).cut; });
    n = Math.max(12, Math.min(n, 90000000));
    gsap.to(cnt, { v: n, duration: dur(0.8), ease: 'power3.out', onUpdate: () => { $('#qCount').textContent = fmt(cnt.v); } });
    const list = visible();
    $('#results').innerHTML = list.map((r) => `<div class="res ${r.tag}"><h4>${r.t}</h4><p>${r.h}</p><span class="bd">${r.tag.toUpperCase()}</span></div>`).join('');
    gsap.fromTo('#results .res', { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: dur(0.45), stagger: 0.05, ease: 'power3.out', clearProps: 'transform,opacity' });
    const off = list.filter((r) => r.tag === 'oficial').length;
    const prec = list.length ? Math.round((off / list.length) * 100) : 0;
    $('#precBar').style.width = prec + '%';
    $('#precBar').style.background = prec >= 66 ? 'var(--lime)' : prec >= 33 ? 'var(--gold)' : 'var(--pink)';
    $('#precTxt').textContent = !list.length ? 'Sin resultados: agrega palabras clave.' : !active.size ? 'Sin palabras clave: millones de resultados y mucho ruido.' : prec >= 66 ? `${prec} % de los resultados son oficiales: búsqueda acotada.` : `${prec} % oficiales. Agrega el nombre de la ITS y una institución (MINSAL, OMS).`;
  }
  cloud.addEventListener('click', (e) => { const b = e.target.closest('.kc'); if (!b) return; const id = b.dataset.id; active.has(id) ? active.delete(id) : active.add(id); paint(); });
  $('#qReset').onclick = () => { active.clear(); paint(); };
  paint();
}

/* ---------- 8 · síntesis: de un párrafo a 3 ideas ---------- */
function initSynthesis() {
  const para = $('#paraText'), slots = $('#slots');
  para.innerHTML = D.PARAGRAPH.map((p, i) => `<span class="sent" data-i="${i}" tabindex="0" role="button">${p.s}</span> `).join('');
  const order = ['trans', 'sint', 'prev'];
  slots.innerHTML = order.map((k) => `<div class="slot" data-k="${k}"><h4>IDEA · ${D.IDEAS[k].name.toUpperCase()}</h4><span class="ref">${D.IDEAS[k].ref}</span><p></p></div>`).join('');
  const got = new Set(); const note = $('#paraNote');
  function pick(el) {
    const p = D.PARAGRAPH[+el.dataset.i];
    if (el.classList.contains('picked')) return;
    if (!p.key) {
      el.classList.add('ctx');
      gsap.fromTo(el, { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,.3)' });
      note.textContent = 'Contexto útil, pero no responde la pregunta de investigación: no es una idea central.';
      return;
    }
    el.classList.add('picked'); got.add(p.key);
    const slot = $(`.slot[data-k="${p.key}"]`, slots);
    const a = srect(el), b = srect(slot);
    const fly = document.createElement('div');
    fly.style.cssText = `position:absolute;left:${a.x}px;top:${a.y}px;width:${a.w}px;height:${a.h}px;background:rgba(184,255,60,.35);border:2px solid var(--lime);z-index:30;pointer-events:none`;
    $('#stage').appendChild(fly);
    gsap.to(fly, { left: b.x, top: b.y, width: b.w, height: b.h, duration: dur(0.7), ease: 'expo.inOut', onComplete: () => {
      fly.remove(); slot.classList.add('full');
      typeInto($('p', slot), D.IDEAS[p.key].para, 0.9);
      gsap.fromTo($('.ref', slot), { scale: 0, rotation: -20 }, { scale: 1, rotation: 0, duration: dur(0.5), ease: 'back.out(3)' });
    } });
    note.textContent = `${got.size} / 3 ideas centrales`;
    if (got.size === 3) { note.textContent = '✓ Tres ideas propias, cada una con su referencia. Eso es una síntesis.'; setTimeout(() => confetti(...stagePoint(slots), 80), 900); }
  }
  para.addEventListener('click', (e) => { const s = e.target.closest('.sent'); if (s) pick(s); });
  para.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const s = e.target.closest('.sent'); if (s) pick(s); } });

  // copiar vs parafrasear
  const gs = { sim: 0, acc: 0 };
  function mode(k) {
    const m = D.COPY_DEMO[k];
    $('#modeCopy').classList.toggle('on', k === 'copy'); $('#modePara').classList.toggle('on', k === 'para');
    $('#modeCopy').setAttribute('aria-pressed', k === 'copy'); $('#modePara').setAttribute('aria-pressed', k === 'para');
    typeInto($('#copyText'), m.text, 0.6);
    gsap.to(gs, { sim: m.sim, acc: m.acc, duration: dur(0.9), ease: 'power3.out', onUpdate: () => {
      $('#gSim').style.width = gs.sim + '%'; $('#gSim').style.background = gs.sim > 60 ? 'var(--pink)' : 'var(--lime)'; $('#gSimN').textContent = Math.round(gs.sim) + '%';
      $('#gAcc').style.width = gs.acc + '%'; $('#gAccN').textContent = Math.round(gs.acc) + '%';
    } });
  }
  $('#modeCopy').onclick = () => mode('copy');
  $('#modePara').onclick = () => mode('para');
  mode('copy');
}

/* ---------- 9 · agentes 3D ---------- */
function initAgents(deck, three) {
  const NOTE = { v1: 'Las proteínas de superficie ayudan al virus a unirse a las células.', v2: 'Contiene las instrucciones genéticas; no puede copiarse por sí solo.', b1: 'La pared da forma y protección a la célula.', b2: 'El material genético está en una región central (nucleoide).', b3: 'Los flagelos ayudan a algunas bacterias a moverse.' };
  const all = [...D.AGENTS.virus.pins.map((p) => ({ ...p, a: 'virus' })), ...D.AGENTS.bacteria.pins.map((p) => ({ ...p, a: 'bacteria' }))];
  const pinsEl = $('#pins');
  pinsEl.innerHTML = all.map((p) => `<button class="pin" data-id="${p.id}" style="--pc:${D.AGENTS[p.a].color}"><i></i>${p.label}</button>`).join('');
  const els = Object.fromEntries($$('.pin', pinsEl).map((e) => [e.dataset.id, e]));
  let mode = 'virus';
  three.onPins = (list) => {
    list.forEach((p) => {
      const el = els[p.id]; if (!el) return;
      const on = p.vis && (mode === 'both' || all.find((x) => x.id === p.id).a === mode);
      el.style.left = p.x + 'px'; el.style.top = p.y + 'px'; el.style.opacity = on ? 1 : 0; el.style.pointerEvents = on ? 'auto' : 'none';
    });
  };
  const card = $('#agentCard');
  function paint() {
    if (mode === 'both') {
      card.style.setProperty('--ac', 'var(--lime)'); card.style.setProperty('--acc', 'var(--lime)');
      card.innerHTML = `<div class="tag mono">COMPARAR</div><h3>Virus vs. bacteria</h3>
        <ul><li><b class="c-lime">Bacteria:</b> célula completa · se reproduce sola · antibióticos</li>
        <li><b class="c-blue">Virus:</b> no es célula · necesita células huésped · no responde a antibióticos</li>
        <li>El tipo de agente ayuda a explicar el tratamiento, pero <b>no determina por sí solo los síntomas</b>.</li></ul>
        <div class="ex">También existen otros agentes (hongos, parásitos). Hoy trabajamos virus y bacterias.</div>`;
    } else {
      const a = D.AGENTS[mode];
      card.style.setProperty('--ac', a.color); card.style.setProperty('--acc', a.color);
      card.innerHTML = `<div class="tag mono">AGENTE · MODELO ESQUEMÁTICO</div><h3>${a.name}</h3><ul>${a.facts.map((f) => `<li>${f}</li>`).join('')}</ul><div class="ex">${a.ex}</div><div class="ex" id="pinNote" style="border:0;padding-top:6px;color:var(--ink)"></div>`;
    }
    gsap.fromTo(card.children, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: dur(0.45), stagger: 0.06, ease: 'power3.out', clearProps: 'transform,opacity' });
  }
  function setMode(m) {
    mode = m; three.agents.setMode(m);
    $$('.a-tabs button').forEach((b) => { b.classList.toggle('on', b.dataset.m === m); b.setAttribute('aria-selected', b.dataset.m === m); });
    paint();
  }
  $('.a-tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setMode(b.dataset.m); });
  pinsEl.addEventListener('click', (e) => { const p = e.target.closest('.pin'); if (!p) return; const n = $('#pinNote'); if (n) typeInto(n, NOTE[p.dataset.id], 0.6); else toast(NOTE[p.dataset.id]); });
  three.agents.setPins(all);
  deck.hooks.enter[8] = () => { three.live.agents = true; three.agents.resize(); setMode('virus'); };
  deck.hooks.leave[8] = () => { three.live.agents = false; };
  paint();
}

/* ---------- 10 · roles ---------- */
function initRoles(deck) {
  const grid = $('#rolesGrid');
  grid.innerHTML = D.ROLES.map((r) => `
    <article class="role" data-a style="--acc:${CV[r.c]}"><span class="seat mono">Nº 0</span><div class="ic">${r.icon}</div><h3>${r.name}</h3><p>${r.does}</p><div class="tool">⚙ ${r.tool}</div></article>`).join('');
  const roles = $$('.role', grid);
  function deal() {
    const seats = [1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
    roles.forEach((r, i) => { $('.seat', r).textContent = `Nº ${seats[i]}`; r.classList.remove('dealt'); });
    // reordena visualmente por número de puesto
    const sorted = roles.map((r, i) => [r, seats[i]]).sort((a, b) => a[1] - b[1]);
    sorted.forEach(([r]) => grid.appendChild(r));
    gsap.fromTo(sorted.map((s) => s[0]), { rotationY: -100, y: -80, opacity: 0, transformPerspective: 1400 }, { rotationY: 0, y: 0, opacity: 1, duration: dur(0.9), stagger: 0.12, ease: 'back.out(1.5)', clearProps: 'transform,opacity',
      onStart: () => {}, onComplete: () => roles.forEach((r) => r.classList.add('dealt')) });
    sorted.forEach(([r], i) => gsap.delayedCall(dur(0.5 + i * 0.12), () => r.classList.add('dealt')));
  }
  $('#dealBtn').onclick = deal;
  $('#dealReset').onclick = () => {
    D.ROLES.forEach((d) => { const r = roles.find((x) => $('h3', x).textContent === d.name); grid.appendChild(r); r.classList.remove('dealt'); });
    gsap.fromTo(roles, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: dur(0.4), stagger: 0.05, clearProps: 'transform,opacity' });
  };
}

/* ---------- 11 · ficha científica con panel 3D ---------- */
function initFicha(deck, three) {
  const box = $('#fields');
  let vals = {};
  try { vals = JSON.parse(store.get('ficha', '{}')); } catch { vals = {}; }
  D.FIELDS.forEach((f) => { vals[f.id] = vals[f.id] || { t: '', s: [] }; });
  box.innerHTML = D.FIELDS.map((f, i) => `
    <div class="fld" data-id="${f.id}">
      <button class="fld-h" aria-expanded="false"><span class="ic">${f.icon}</span><span>${i + 1}. ${f.name}</span><span class="st">PENDIENTE</span></button>
      <div class="fld-b"><div class="hint">${f.hint}</div><textarea rows="2" aria-label="${f.name}" spellcheck="true"></textarea>
        ${f.src ? `<div class="srcs"><span class="lb">FUENTE DEL DATO:</span><button class="sc" data-s="F1">F1</button><button class="sc" data-s="F2">F2</button></div>` : ''}</div>
    </div>`).join('');
  const els = Object.fromEntries($$('.fld', box).map((e) => [e.dataset.id, e]));
  const isDone = (f) => {
    const v = vals[f.id], n = words(v.t);
    if (f.id === 'fuentes') return (/F1/.test(v.t) && /F2/.test(v.t) && n >= 6) || n >= 10;
    if (f.id === 'img') return n >= 4;
    return n >= 5 && v.s.length >= 1;
  };
  let lastDone = 0;
  function sync(save = true) {
    const states = D.FIELDS.map((f) => ({ done: isDone(f), text: vals[f.id].t }));
    D.FIELDS.forEach((f, i) => {
      const el = els[f.id]; el.classList.toggle('done', states[i].done);
      $('.st', el).textContent = states[i].done ? '✓ COMPLETA' : (f.src && words(vals[f.id].t) >= 5 && !vals[f.id].s.length ? 'FALTA FUENTE' : 'PENDIENTE');
      $$('.sc', el).forEach((b) => b.classList.toggle('on', vals[f.id].s.includes(b.dataset.s)));
    });
    const n = three.ficha.setStates(states);
    $('#fCount').textContent = `${n}/9`;
    $('#fRing').style.strokeDashoffset = 113 * (1 - n / 9);
    if (n === 9 && lastDone < 9) { setTimeout(() => confetti(...stagePoint($('.ficha-stage')), 140), 1300); toast('¡Ficha completa! Pásala al revisor/a.'); }
    lastDone = n;
    if (save) store.set('ficha', JSON.stringify(vals));
  }
  D.FIELDS.forEach((f) => { $('textarea', els[f.id]).value = vals[f.id].t; });
  box.addEventListener('click', (e) => {
    const h = e.target.closest('.fld-h');
    if (h) { const el = h.parentElement, open = !el.classList.contains('open'); $$('.fld', box).forEach((x) => { x.classList.remove('open'); $('.fld-h', x).setAttribute('aria-expanded', 'false'); }); if (open) { el.classList.add('open'); h.setAttribute('aria-expanded', 'true'); $('textarea', el).focus({ preventScroll: true }); } return; }
    const s = e.target.closest('.sc');
    if (s) { const id = s.closest('.fld').dataset.id, v = vals[id]; const k = s.dataset.s; v.s = v.s.includes(k) ? v.s.filter((x) => x !== k) : [...v.s, k]; sync(); }
  });
  box.addEventListener('input', (e) => { if (e.target.matches('textarea')) { vals[e.target.closest('.fld').dataset.id].t = e.target.value; sync(); } });
  $('#fClear').onclick = () => { D.FIELDS.forEach((f) => { vals[f.id] = { t: '', s: [] }; $('textarea', els[f.id]).value = ''; }); sync(); };
  $('#fDemo').onclick = () => {
    D.FIELDS.forEach((f, i) => setTimeout(() => { vals[f.id] = { t: D.FICHA_DEMO[f.id].t, s: [...D.FICHA_DEMO[f.id].s] }; $('textarea', els[f.id]).value = vals[f.id].t; sync(); }, i * (motion.reduced ? 20 : 420)));
  };
  deck.hooks.enter[10] = () => { three.live.ficha = true; three.ficha.resize(); sync(false); if (!$('.fld.open', box)) $('.fld-h', els.agente).click(); };
  deck.hooks.leave[10] = () => { three.live.ficha = false; };
  sync(false);
}

/* ---------- 12 · control de calidad: radar ---------- */
function initQC() {
  const svg = $('#radar'), ns = 'http://www.w3.org/2000/svg', R = 170, N = D.QC.length;
  const ang = (i) => -Math.PI / 2 + (i / N) * Math.PI * 2;
  let h = '';
  [0.25, 0.5, 0.75, 1].forEach((k) => { h += `<polygon class="ring-l" points="${D.QC.map((_, i) => `${Math.cos(ang(i)) * R * k},${Math.sin(ang(i)) * R * k}`).join(' ')}"/>`; });
  D.QC.forEach((q, i) => { h += `<line class="axis" x1="0" y1="0" x2="${Math.cos(ang(i)) * R}" y2="${Math.sin(ang(i)) * R}"/><text x="${Math.cos(ang(i)) * (R + 40)}" y="${Math.sin(ang(i)) * (R + 30) + 5}">${q.name}</text>`; });
  h += '<polygon class="poly" id="poly" points=""/>' + D.QC.map((_, i) => `<circle class="pt" id="pt${i}" r="7"/>`).join('');
  svg.innerHTML = h;
  const on = D.QC.map(() => false), rad = D.QC.map(() => 0.12);
  const draw = () => {
    $('#poly').setAttribute('points', rad.map((r, i) => `${Math.cos(ang(i)) * R * r},${Math.sin(ang(i)) * R * r}`).join(' '));
    rad.forEach((r, i) => { const p = $('#pt' + i); p.setAttribute('cx', Math.cos(ang(i)) * R * r); p.setAttribute('cy', Math.sin(ang(i)) * R * r); p.style.fill = on[i] ? 'var(--lime)' : 'var(--dim)'; });
  };
  draw();
  const list = $('#qcList');
  list.innerHTML = D.QC.map((q, i) => `<li><button class="qci" data-i="${i}" data-a><span class="bx"><b>✓</b></span>${q.full}</button></li>`).join('');
  const vd = $('#verdict');
  function verdict() {
    const n = on.filter(Boolean).length;
    const [t, c] = n >= 7 ? [`${n}/8 · Lista para entregar`, 'var(--lime)'] : n >= 5 ? [`${n}/8 · Casi: falta revisar`, 'var(--gold)'] : [`${n}/8 · Aún no responde al OA 3`, 'var(--pink)'];
    vd.textContent = t; vd.style.color = c;
  }
  verdict();
  list.addEventListener('click', (e) => {
    const b = e.target.closest('.qci'); if (!b) return;
    const i = +b.dataset.i; on[i] = !on[i]; b.classList.toggle('on', on[i]);
    gsap.to(rad, { [i]: on[i] ? 1 : 0.12, duration: dur(0.8), ease: 'elastic.out(1,.55)', onUpdate: draw });
    verdict();
    if (on.every(Boolean)) setTimeout(() => confetti(...stagePoint(svg), 120), 500);
  });
}

/* ---------- 13 · duelo de paráfrasis ---------- */
function initDuel() {
  let r = 0, score = 0; const res = [];
  const opts = $('#duelOpts'), fb = $('#duelFb'), src = $('#duelSrc');
  const paintRounds = () => { $('#rounds').innerHTML = `<span>RONDA ${Math.min(r + 1, 3)}/3</span>` + D.DUEL.map((_, i) => `<i class="${res[i] === undefined ? (i === r ? 'on' : '') : res[i] ? 'ok' : 'no'}"></i>`).join(''); };
  function show() {
    if (r >= D.DUEL.length) {
      src.textContent = 'Fin del duelo';
      opts.innerHTML = '';
      fb.innerHTML = `<b>${score} de ${D.DUEL.length} aciertos.</b> Un buen parafraseo conserva el dato, cambia las palabras y registra la fuente. <button class="btn" id="duelAgain" style="margin-left:18px;padding:8px 22px;font-size:18px">Jugar de nuevo</button>`;
      $('#duelAgain').onclick = () => { r = 0; score = 0; res.length = 0; show(); };
      if (score === D.DUEL.length) confetti(...stagePoint(fb), 120);
      paintRounds(); return;
    }
    const d = D.DUEL[r];
    src.textContent = d.src;
    opts.innerHTML = d.opts.map((o, i) => `<button class="opt" data-i="${i}"><span class="lt">OPCIÓN ${'ABC'[i]}</span>${o.t}<div class="mt"><div class="mini"><span>similitud</span><div class="meter"><i style="width:${o.sim}%;background:${o.sim > 60 ? 'var(--pink)' : 'var(--lime)'}"></i></div><b>${o.sim}%</b></div><div class="mini"><span>exactitud</span><div class="meter ok"><i style="width:${o.acc}%"></i></div><b>${o.acc}%</b></div></div></button>`).join('');
    fb.textContent = 'Elige la mejor paráfrasis: conserva el dato, cambia las palabras.';
    gsap.fromTo('.opt', { rotationX: -80, opacity: 0, transformOrigin: 'top', transformPerspective: 1000 }, { rotationX: 0, opacity: 1, duration: dur(0.7), stagger: 0.1, ease: 'back.out(1.4)', clearProps: 'transform,opacity' });
    paintRounds();
  }
  opts.addEventListener('click', (e) => {
    const b = e.target.closest('.opt'); if (!b || b.classList.contains('rev')) return;
    const d = D.DUEL[r], o = d.opts[+b.dataset.i];
    $$('.opt', opts).forEach((x, i) => { x.classList.add('rev', d.opts[i].ok ? 'ok' : 'no'); if (x === b) x.classList.add('chosen'); });
    res[r] = o.ok; if (o.ok) score++;
    fb.innerHTML = `<b>${o.ok ? '¡Correcto!' : 'No del todo.'}</b> ${o.why} <button class="btn" id="duelNext" style="margin-left:18px;padding:8px 22px;font-size:18px">${r < D.DUEL.length - 1 ? 'Siguiente ▶' : 'Ver resultado'}</button>`;
    $('#duelNext').onclick = () => { r++; show(); };
    if (o.ok) confetti(...stagePoint(b), 40);
    paintRounds();
  });
  show();
}

/* ---------- 14 · ticket + autoevaluación + próxima clase ---------- */
function initTicket(deck) {
  const mk = (id, arr, target) => {
    $(id).innerHTML = arr.map((t) => `<button class="word">${t}</button>`).join('');
    $(id).addEventListener('click', (e) => { const w = e.target.closest('.word'); if (!w) return; $(target).textContent = w.textContent; sync(); });
  };
  mk('#bankSrc', D.TICKET_SOURCES, '#tSrc'); mk('#bankWhy', D.TICKET_REASONS, '#tWhy');
  let fired = false;
  function sync() {
    $$('#bankSrc .word').forEach((w) => w.classList.toggle('on', w.textContent === $('#tSrc').textContent));
    $$('#bankWhy .word').forEach((w) => w.classList.toggle('on', w.textContent === $('#tWhy').textContent));
    const ok = $('#tSrc').textContent.trim().length > 3 && $('#tWhy').textContent.trim().length > 6;
    const fb = $('#ticketFb');
    fb.classList.toggle('good', ok);
    fb.innerHTML = ok ? '<b class="c-lime">¡Listo!</b> Tu respuesta nombra una fuente y justifica con un criterio. Eso es investigar con evidencia.' : 'Completa la frase con una opción o con tus palabras.';
    if (ok && !fired) { fired = true; confetti(...stagePoint($('.ticket')), 70); } if (!ok) fired = false;
  }
  $('#tSrc').addEventListener('input', sync); $('#tWhy').addEventListener('input', sync);
  $('#selfList').innerHTML = D.SELF.map((t, i) => `<li><button data-i="${i}" aria-pressed="false"><span class="bx"><b>✓</b></span>${t}</button></li>`).join('');
  $('#selfList').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    b.classList.toggle('on'); b.setAttribute('aria-pressed', b.classList.contains('on'));
    gsap.fromTo($('.bx', b), { scale: 0.5 }, { scale: 1, duration: dur(0.4), ease: 'back.out(3)' });
    if ($$('#selfList button.on').length === D.SELF.length) { confetti(...stagePoint($('#selfList')), 120); toast('¡Lista para la clase 20!'); }
  });
  // mini gráfico de la próxima clase
  const bars = [22, 30, 26, 41, 36, 52];
  $('#miniBars').innerHTML = bars.map((v, i) => `<rect x="${8 + i * 40}" y="${66 - v}" width="26" height="${v}" style="transform-box:fill-box;transform-origin:bottom"/>`).join('');
  deck.hooks.enter[13] = () => {
    gsap.fromTo('#miniBars rect', { scaleY: 0 }, { scaleY: 1, duration: dur(0.9), stagger: 0.09, ease: 'back.out(1.6)', delay: 0.8 });
    gsap.fromTo('.mini-chart .trend', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur(1.4), ease: 'power2.inOut', delay: 1.3 });
  };
}
