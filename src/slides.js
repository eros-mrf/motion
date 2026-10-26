import { gsap } from 'gsap';
import { $, $$, toast, confetti, motion, clamp } from './util.js';
import * as D from './data.js';

const COLOR = { evidencia: 'var(--cyan)', rumor: 'var(--ember)', verificar: 'var(--amber)' };
const CVAR = { evid: 'var(--cyan)', rumor: 'var(--ember)', prej: 'var(--violet)', amber: 'var(--amber)' };
const store = {
  get(k, d = '') { try { return localStorage.getItem('c18:' + k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('c18:' + k, v); } catch { /* sin almacenamiento */ } },
};
// centro de un elemento en coordenadas del escenario 1920×1080 (para el confeti)
function stagePoint(el) {
  const s = $('#stage').getBoundingClientRect(), r = el.getBoundingClientRect(), k = s.width / 1920;
  return [(r.left + r.width / 2 - s.left) / k, (r.top + r.height / 2 - s.top) / k];
}
const dur = (d) => (motion.reduced ? 0.01 : d);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function initSlides(deck, three) {
  initMessages();
  initQuestions();
  initVocab();
  initSim(deck, three);
  initPath(deck);
  initDetector();
  initAER(deck);
  const lab = initLab();
  initWrite();
  initSwaps();
  initShield(deck, three);
  initTicket();
  initCover(deck);
  initRoute(deck);
  return { lab };
}

/* ---------- 1 · portada ---------- */
function initCover(deck) {
  deck.hooks.enter[0] = () => {
    if (motion.reduced) return;
    gsap.fromTo('.cover-title .w-rumor .glitch', { x: -30, skewX: -20 }, { x: 0, skewX: 0, duration: 1.4, ease: 'elastic.out(1,.4)', delay: 0.4 });
  };
}

/* ---------- 2 · ruta ---------- */
function initRoute(deck) {
  deck.hooks.enter[1] = () => {
    const segs = $$('.timeline .seg');
    gsap.fromTo(segs, { scaleX: 0, transformOrigin: 'left center', opacity: 0 }, { scaleX: 1, opacity: 1, duration: dur(0.8), stagger: 0.09, ease: 'expo.out', delay: 0.8, clearProps: 'transform,opacity' });
    gsap.fromTo('.route-line line', { strokeDasharray: '6 8', strokeDashoffset: 600 }, { strokeDashoffset: 0, duration: dur(1.6), ease: 'power2.inOut', delay: 0.4 });
  };
}

/* ---------- 3 · mensajes ---------- */
function initMessages() {
  const grid = $('#msgGrid');
  const state = {};
  grid.innerHTML = D.MSGS.map((m) => `
    <article class="msg" data-a data-id="${m.id}">
      <div class="from"><span>${m.from}</span></div>
      <div class="bubble">${m.text}</div>
      <div class="picks" role="group" aria-label="Clasificar mensaje ${m.id}">
        ${D.CHOICES.map((c) => `<button class="pick" data-c="${c.id}" style="--pc:${COLOR[c.id]}"><i></i>${c.label}</button>`).join('')}
      </div>
      <div class="reveal" aria-live="polite"><b style="color:${COLOR[m.key]}">CLAVE SUGERIDA: ${m.key.toUpperCase()} · ${m.tag.toUpperCase()}</b>${m.why}</div>
    </article>`).join('');
  const card = (id) => $(`.msg[data-id="${id}"]`);
  function paint() {
    const answered = Object.values(state).filter((v) => v.pick).length;
    const ok = Object.entries(state).filter(([id, v]) => v.pick && v.pick === D.MSGS.find((m) => m.id === id).key).length;
    $('#msgScore').textContent = `${answered} / 4 marcados${answered ? ` · ${ok} coinciden con la clave` : ''}`;
  }
  function settle(id, pick, reveal = true) {
    const m = D.MSGS.find((x) => x.id === id), el = card(id);
    state[id] = { pick };
    $$('.pick', el).forEach((b) => { b.classList.toggle('sel', b.dataset.c === pick); b.classList.toggle('fade', !!pick && b.dataset.c !== pick); });
    if (reveal) {
      el.classList.add('done');
      el.classList.toggle('ok', pick === m.key);
      el.classList.toggle('no', !!pick && pick !== m.key);
      gsap.fromTo($('.reveal', el), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: dur(0.5), ease: 'power3.out', clearProps: 'all' });
      if (pick === m.key) gsap.fromTo(el, { scale: 1 }, { scale: 1.025, yoyo: true, repeat: 1, duration: dur(0.18) });
    }
    paint();
  }
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('.pick');
    if (!b) return;
    settle(b.closest('.msg').dataset.id, b.dataset.c);
  });
  $('#msgReveal').onclick = () => D.MSGS.forEach((m, i) => setTimeout(() => settle(m.id, state[m.id]?.pick ?? null), i * 140));
  $('#msgReset').onclick = () => {
    D.MSGS.forEach((m) => { delete state[m.id]; const el = card(m.id); el.classList.remove('done', 'ok', 'no'); $$('.pick', el).forEach((b) => b.classList.remove('sel', 'fade')); });
    paint();
  };
  paint();
}

/* ---------- 4 · preguntas ---------- */
function initQuestions() {
  const list = $('#qList');
  list.innerHTML = D.QUESTIONS.map((q, i) => `<li><button data-i="${i}" data-a="route"><span class="qn">${i + 1}</span><span>${q.q}</span></button></li>`).join('');
  const show = (i, first) => {
    const q = D.QUESTIONS[i];
    $$('button', list).forEach((b, k) => { b.classList.toggle('on', k === i); if (k === i) b.classList.add('seen'); });
    $('#qTag').textContent = `PREGUNTA ${i + 1} DE ${D.QUESTIONS.length}`;
    const apply = () => { $('#qTitle').textContent = q.q; $('#qIdea').textContent = q.idea; };
    if (first || motion.reduced) { apply(); return; }
    gsap.timeline()
      .to(['#qTitle', '.q-idea'], { autoAlpha: 0, y: -14, duration: 0.18, stagger: 0.04 })
      .add(apply)
      .fromTo(['#qTitle', '.q-idea'], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.09, clearProps: 'all' });
  };
  list.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show(+b.dataset.i); });
  show(0, true);
}

/* ---------- 5 · vocabulario ---------- */
function initVocab() {
  $('#vocabGrid').innerHTML = D.VOCAB.map((v, i) => `
    <button class="vcard" data-a style="--vc:${CVAR[v.c]}" aria-label="${v.t}. Toca para ver la definición">
      <span class="in">
        <span class="f"><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="term">${v.t}</span><span class="tap">TOCA PARA VOLTEAR</span></span>
        <span class="b"><span class="term">${v.t}</span><p>${v.d}</p></span>
      </span>
    </button>`).join('');
  $('#vocabGrid').addEventListener('click', (e) => { const c = e.target.closest('.vcard'); if (c) c.classList.toggle('flip'); });
}

/* ---------- 6 · simulación 3D del rumor ---------- */
function initSim(deck, three) {
  const sim = three.sim;
  const out = { r: $('#stRumor'), e: $('#stEvid'), n: $('#stRound'), read: $('#simRead') };
  const pct = (v) => `${Math.round(v * 100)}%`;
  let lastState = '';
  three.onSimStats = (s) => {
    out.r.textContent = pct(s.rumor); out.e.textContent = pct(s.evid); out.n.textContent = s.round;
    let k = s.state === 'wait' ? 'wait' : s.state === 'contained' ? 'contained' : s.verify < 0.3 ? 'low' : s.verify < 0.65 ? 'mid' : 'high';
    if (s.state === 'wait') k = 'wait';
    if (k !== lastState) { lastState = k; out.read.textContent = D.SIM_READS[k]; if (!motion.reduced) gsap.fromTo(out.read, { opacity: 0.2 }, { opacity: 1, duration: 0.5 }); }
    if (s.state === 'contained' && !three._celebrated) { three._celebrated = true; confetti(...stagePoint($('#stRumor')), 70, ['#2ee6c5', '#ffffff']); }
    if (s.state !== 'contained') three._celebrated = false;
  };
  const verify = $('#verify');
  const paint = () => { $('#verifyOut').textContent = `${verify.value}%`; verify.style.setProperty('--p', `${verify.value}%`); sim.setVerify(verify.value / 100); };
  verify.addEventListener('input', paint); paint();
  const setMode = (m) => { sim.setMode(m); $('#modeRumor').classList.toggle('on', m === 'rumor'); $('#modeEvid').classList.toggle('on', m === 'evid'); $('#modeRumor').setAttribute('aria-pressed', m === 'rumor'); $('#modeEvid').setAttribute('aria-pressed', m === 'evid'); };
  $('#modeRumor').onclick = () => setMode('rumor');
  $('#modeEvid').onclick = () => setMode('evid');
  $('#simLaunch').onclick = () => { sim.reset(); sim.launch(); };
  $('#simReset').onclick = () => { sim.reset(); out.read.textContent = D.SIM_READS.wait; lastState = 'wait'; };
  out.read.textContent = D.SIM_READS.wait;

  let demo;
  deck.hooks.enter[5] = () => {
    three.live.sim = true; sim.resize();
    clearTimeout(demo);
    if (!sim.hasActivity) demo = setTimeout(() => { if (deck.index === 5 && !sim.hasActivity) sim.launch(); }, 1800);
  };
  deck.hooks.leave[5] = () => { three.live.sim = false; clearTimeout(demo); };
}

/* ---------- 7 · camino del estigma ---------- */
function initPath(deck) {
  $('#pathSteps').innerHTML = D.PATHS.A.steps.map((_, i) => `<li class="pstep"><div class="node">${i + 1}</div><div class="lbl"></div></li>`).join('');
  const path = $('#path'), steps = $$('.pstep'), dot = $('#pathDot'), glow = $('#pathGlow');
  glow.setAttribute('pathLength', '1');
  let key = 'A', tween;
  function set(k, instant) {
    key = k;
    path.style.setProperty('--pc', k === 'A' ? 'var(--ember)' : 'var(--cyan)');
    $('#pathA').classList.toggle('on', k === 'A'); $('#pathB').classList.toggle('on', k === 'B');
    $('#pathA').setAttribute('aria-pressed', k === 'A'); $('#pathB').setAttribute('aria-pressed', k === 'B');
    const P = D.PATHS[k];
    steps.forEach((s, i) => { const l = $('.lbl', s); gsap.fromTo(l, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: dur(0.5), delay: dur(i * 0.1), ease: 'power3.out' }); l.textContent = P.steps[i]; s.classList.remove('show'); });
    gsap.fromTo('#pathMsg', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: dur(0.6), delay: dur(0.2), clearProps: 'transform,opacity,visibility' });
    $('#pathMsg').textContent = P.msg;
    tween?.kill();
    const prog = { v: 0 };
    tween = gsap.to(prog, {
      v: 1, duration: instant || motion.reduced ? 0.01 : 3.2, ease: 'power1.inOut', delay: instant ? 0 : 0.5,
      onUpdate: () => {
        glow.style.strokeDashoffset = 1 - prog.v;
        gsap.set(dot, { x: 1378 * prog.v });
        steps.forEach((s, i) => s.classList.toggle('show', prog.v >= i / 4 - 0.001));
      },
    });
  }
  glow.style.strokeDasharray = 1;
  $('#pathA').onclick = () => set('A');
  $('#pathB').onclick = () => set('B');
  deck.hooks.enter[6] = () => set(key);
  set('A', true);
}

/* ---------- 8 · detector de señales ---------- */
function initDetector() {
  const found = [];
  const chain = $('#chain');
  chain.innerHTML = D.CHAIN.map((c) => (c.k ? `<button class="sig" data-k="${c.k}">${esc(c.t)}</button>` : esc(c.t))).join('');
  const list = $('#sigList');
  list.innerHTML = D.SIGNALS.map((s) => `<li data-k="${s.k}"><span class="ck">✓</span><div>${s.name}<small>${s.hint}</small></div></li>`).join('');
  const paint = () => {
    $('#sigCount').textContent = `${found.length} / ${D.SIGNALS.length}`;
    $('#sigCount').style.color = found.length === D.SIGNALS.length ? 'var(--cyan)' : 'var(--ember)';
  };
  function mark(k, quiet) {
    if (found.includes(k)) return;
    found.push(k);
    const b = $(`.sig[data-k="${k}"]`, chain);
    b.classList.add('found'); b.dataset.n = found.length;
    $$('li.latest', list).forEach((l) => l.classList.remove('latest'));
    const li = $(`li[data-k="${k}"]`, list); li.classList.add('on', 'latest');
    gsap.fromTo(li, { x: 30 }, { x: 0, duration: dur(0.5), ease: 'back.out(2)' });
    gsap.fromTo(b, { scale: 1.12 }, { scale: 1, duration: dur(0.4), ease: 'back.out(3)' });
    paint();
    if (found.length === D.SIGNALS.length && !quiet) { confetti(...stagePoint($('#sigCount')), 110); toast('¡Detector completo! 7 señales encontradas'); }
  }
  chain.addEventListener('click', (e) => { const b = e.target.closest('.sig'); if (b) mark(b.dataset.k); });
  $('#detectAll').onclick = () => D.SIGNALS.forEach((s, i) => setTimeout(() => mark(s.k, i < D.SIGNALS.length - 1), i * 160));
  $('#detectReset').onclick = () => {
    found.length = 0;
    $$('.sig', chain).forEach((b) => { b.classList.remove('found'); delete b.dataset.n; });
    $$('li', list).forEach((l) => l.classList.remove('on', 'latest'));
    paint();
  };
  paint();
}

/* ---------- 9 · A–E–R ---------- */
function initAER(deck) {
  let step = 0, playing = null;
  const cards = ['aerA', 'aerE', 'aerR'].map((id) => $('#' + id));
  const finalEl = $('#aerFinal');
  const text = finalEl.textContent.trim();
  const words = text.split(/\s+/);
  finalEl.innerHTML = words.map((w) => `<span class="aw">${w}</span>`).join(' ');
  $('#aerWc').textContent = `${words.length} palabras · límite 40`;
  const marks = $$('#aerQuote mark');
  function show(n, animate = true) {
    step = n;
    $$('.aer-steps button[data-step]').forEach((b, i) => { b.classList.toggle('on', i === n); b.setAttribute('aria-selected', i === n); });
    cards.forEach((c, i) => c.classList.toggle('live', i <= n));
    if (!animate) return;
    if (n === 0) {
      gsap.set(marks, { clearProps: 'all' }); marks.forEach((m) => m.classList.remove('off'));
      gsap.fromTo(marks, { backgroundColor: 'rgba(255,92,58,0)' }, { backgroundColor: 'rgba(255,92,58,.28)', duration: dur(0.6), stagger: 0.3, yoyo: true, repeat: 1, clearProps: 'backgroundColor' });
      gsap.set('.stamp', { opacity: 0 }); gsap.set('.checks .ck', { opacity: 0 }); gsap.set('.aw', { opacity: 0.0 });
    }
    if (n === 1) {
      gsap.fromTo('.stamp', { opacity: 0, scale: 2.6, rotate: -20 }, { opacity: 1, scale: 1, rotate: -5, duration: dur(0.55), delay: dur(0.5), ease: 'back.out(1.6)' });
      gsap.set('.checks .ck', { opacity: 0 }); gsap.set('.aw', { opacity: 0 });
    }
    if (n === 2) {
      gsap.set('.stamp', { opacity: 1, scale: 1, rotate: -5 });
      gsap.fromTo('.aw', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: dur(0.35), stagger: dur(0.05), ease: 'power2.out', delay: dur(0.3) });
      gsap.fromTo('.checks .ck', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: dur(0.4), stagger: 0.25, delay: dur(0.3 + words.length * 0.05), ease: 'back.out(2)' });
    }
  }
  function stop() { if (playing) { playing.kill(); playing = null; $('#aerPlay').textContent = '▶ Reproducir'; } }
  $$('.aer-steps button[data-step]').forEach((b) => b.addEventListener('click', () => { stop(); show(+b.dataset.step); }));
  $('#aerPlay').onclick = () => {
    if (playing) { stop(); return; }
    $('#aerPlay').textContent = '❚❚ Pausa';
    playing = gsap.timeline({ onComplete: () => { playing = null; $('#aerPlay').textContent = '▶ Reproducir'; } })
      .add(() => show(0)).to({}, { duration: dur(2.6) })
      .add(() => show(1)).to({}, { duration: dur(3.2) })
      .add(() => show(2)).to({}, { duration: dur(3.5) });
  };
  deck.hooks.enter[8] = () => { show(0, false); gsap.set('.stamp', { opacity: 0 }); gsap.set('.checks .ck', { opacity: 0 }); gsap.set('.aw', { opacity: 0 }); setTimeout(() => show(0), 700); };
  deck.hooks.leave[8] = stop;
  show(0, false);
}

/* ---------- 10 · laboratorio ---------- */
function initLab() {
  let cur = 0;
  const opened = D.LAB.map(() => new Set());
  const tabs = $('#labTabs');
  tabs.innerHTML = D.LAB.map((m, i) => `<button role="tab" data-i="${i}">${m.title}</button>`).join('');
  $('#labForm').innerHTML = ['Afirmación principal', 'Posible prejuicio', 'Evidencia encontrada', 'Nivel de confiabilidad'].map((t, i) => `
    <button class="field" data-f="${i}"><span class="tag mono">${i + 1} · ${t.toUpperCase()}</span><span class="ans"></span><span class="ask">Toca para revelar la pauta</span></button>`).join('');
  const foot = $('.lab-foot');
  const reveal = document.createElement('button');
  reveal.className = 'btn ghost'; reveal.style.cssText = 'margin-left:auto;padding:8px 20px;font-size:18px'; reveal.textContent = 'Revelar pauta completa';
  foot.appendChild(reveal);

  const arc = $('#gaugeArc'), needle = $('#gaugeNeedle'), gt = $('#gaugeTxt');
  gsap.set(needle, { rotation: -90, svgOrigin: '100 100' });
  function gauge(v, txt) {
    const c = v < 0.34 ? '#ff5c3a' : v < 0.67 ? '#ffc247' : '#2ee6c5';
    gsap.to(arc, { strokeDashoffset: 252 * (1 - v), stroke: c, duration: dur(1.2), ease: 'power3.out' });
    gsap.to(needle, { rotation: -90 + v * 180, svgOrigin: '100 100', duration: dur(1.3), ease: 'elastic.out(1,.6)' });
    gt.textContent = txt; gt.style.color = c;
  }
  const answer = (m, f) => [m.claim, m.prej, m.evid, `${m.reliabTxt}: no cita una fuente verificable y contradice lo que indican las fuentes sanitarias oficiales.`][f];
  function paint(animate) {
    const m = D.LAB[cur];
    $$('button', tabs).forEach((b, i) => { b.classList.toggle('on', i === cur); b.setAttribute('aria-selected', i === cur); });
    $('#labText').textContent = m.text;
    $$('.field').forEach((f, i) => {
      $('.ans', f).textContent = answer(m, i);
      f.classList.toggle('open', opened[cur].has(i));
    });
    $('#labSrc').innerHTML = m.sources.map((s) => `<li class="${s.ok ? 'ok' : 'no'}"><b>${s.n}</b><small>${s.d}</small><br><span class="bd">${s.badge}</span></li>`).join('');
    if (animate) gsap.fromTo(['#labText', '#labSrc li'], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: dur(0.45), stagger: 0.07, ease: 'power3.out', clearProps: 'all' });
    if (opened[cur].has(3)) gauge(m.reliab, m.reliabTxt); else { gauge(0, '—'); gsap.set(arc, { strokeDashoffset: 252 }); }
  }
  function open(f) {
    opened[cur].add(f);
    const el = $(`.field[data-f="${f}"]`);
    el.classList.add('open');
    if (f === 3) gauge(D.LAB[cur].reliab, D.LAB[cur].reliabTxt);
  }
  $('#labForm').addEventListener('click', (e) => { const f = e.target.closest('.field'); if (f) open(+f.dataset.f); });
  tabs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { cur = +b.dataset.i; paint(true); } });
  reveal.onclick = () => [0, 1, 2, 3].forEach((f) => setTimeout(() => open(f), f * 260));
  paint(false);
  return { get cur() { return cur; } };
}

/* ---------- 11 · reescritura ---------- */
function initWrite() {
  let cur = 0;
  const tabs = $('#wTabs'), ta = $('#wText');
  tabs.innerHTML = D.LAB.map((m, i) => `<button role="tab" data-i="${i}">${m.title}</button>`).join('');
  const crit = { E: $('#critE'), R: $('#critR'), C: $('#critC') };
  const setCrit = (k, cls, html) => { crit[k].className = `crit glass ${cls}`; $('p', crit[k]).innerHTML = html; };
  const wc = (t) => t.trim().split(/\s+/).filter(Boolean).length;
  function evaluate() {
    const m = D.LAB[cur], t = ta.value, n = wc(t);
    store.set('w' + cur, t);
    $('#wCount').textContent = n;
    const ring = $('#wRing');
    ring.style.strokeDashoffset = 113 * (1 - Math.min(n, 40) / 40);
    ring.style.stroke = n > 40 ? 'var(--ember)' : n > 32 ? 'var(--amber)' : 'var(--cyan)';
    if (!n) { setCrit('E', '', 'Escribe tu publicación para recibir una pista.'); setCrit('R', '', 'Sin etiquetas, sin culpa, sin miedo innecesario.'); setCrit('C', '', 'Entre 10 y 40 palabras, con puntuación.'); return; }
    // claridad
    if (n > 40) setCrit('C', 'r', `Supera el límite: recorta <mark>${n - 40}</mark> palabra${n - 40 > 1 ? 's' : ''}.`);
    else if (n < 10) setCrit('C', 'y', 'Muy breve: agrega la evidencia que corrige el mensaje.');
    else if (!/[.!?]\s*$/.test(t.trim()) || !/^[A-ZÁÉÍÓÚÑ¿¡«"]/.test(t.trim())) setCrit('C', 'y', 'Buen largo. Cuida la mayúscula inicial y el punto final.');
    else setCrit('C', 'g', `Dentro del límite (${n}/40) y bien puntuada.`);
    // respeto
    const hits = D.STIGMA_TERMS.filter((s) => s.re.test(t) && !(s.soft && /no es (su |tu )?culpa|sin culpa|no (es|implica) culpa|no es una señal de culpa/i.test(t)));
    if (hits.some((h) => !h.soft)) setCrit('R', 'r', hits.filter((h) => !h.soft).map((h) => `<mark>${(t.match(h.re) || [''])[0]}</mark> ${h.tip}`).join('<br>'));
    else if (hits.length) setCrit('R', 'y', hits.map((h) => `<mark>${(t.match(h.re) || [''])[0]}</mark> ${h.tip}`).join('<br>'));
    else setCrit('R', 'g', 'No se detectan etiquetas ni culpa. Que lo confirme tu verificador/a.');
    // exactitud
    const abs = /\b(siempre|nunca|jam[aá]s|todos|nadie|100 ?%)\b/i.exec(t);
    const okKw = m.kw.every((re) => re.test(t));
    if (abs) setCrit('E', 'y', `Cuidado con el absoluto <mark>${abs[1]}</mark>: ¿la fuente lo respalda?`);
    else if (okKw) setCrit('E', 'g', `Incluye lo clave: ${m.kwLabel}. Falta contrastar con la fuente oficial.`);
    else setCrit('E', 'y', `Revisa la evidencia: ¿${m.kwLabel}?`);
  }
  function load(i) {
    cur = i;
    $$('button', tabs).forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i); });
    $('#wOrig').textContent = D.LAB[i].text;
    ta.value = store.get('w' + i, '');
    $('#wModelTxt').textContent = D.LAB[i].model;
    $('#wModelBox').hidden = true; $('#wModel').textContent = 'Ver modelo';
    evaluate();
  }
  tabs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) load(+b.dataset.i); });
  ta.addEventListener('input', evaluate);
  $('#wModel').onclick = () => {
    const box = $('#wModelBox'); box.hidden = !box.hidden;
    $('#wModel').textContent = box.hidden ? 'Ver modelo' : 'Ocultar modelo';
    if (!box.hidden) { $('#wModelTxt').innerHTML = `${esc(D.LAB[cur].model)}<br><span class="mono dim" style="font-size:15px">${wc(D.LAB[cur].model)} palabras</span>`; gsap.fromTo(box, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: dur(0.4), clearProps: 'all' }); }
  };
  $('#wClear').onclick = () => { ta.value = ''; evaluate(); ta.focus(); };
  $('#wCopy').onclick = async () => {
    try { await navigator.clipboard.writeText(ta.value); toast('Texto copiado'); }
    catch { ta.select(); document.execCommand?.('copy'); toast('Texto copiado'); }
  };
  load(0);
}

/* ---------- 12 · palabras ---------- */
function initSwaps() {
  const list = $('#swapList');
  list.innerHTML = D.SWAPS.map((s, i) => `<button class="swap bad" data-a data-i="${i}"><span class="st">PALABRA QUE ESTIGMATIZA</span><span class="tx">${s.bad}</span><span class="wy">Toca para mejorarla</span></button>`).join('');
  function flip(el, fix) {
    const s = D.SWAPS[+el.dataset.i];
    const to = fix ?? !el.classList.contains('fixed');
    if (to === el.classList.contains('fixed')) return;
    gsap.timeline()
      .to(el, { rotationX: 90, duration: dur(0.18), ease: 'power2.in', transformPerspective: 800 })
      .add(() => {
        el.classList.toggle('fixed', to); el.classList.toggle('bad', !to);
        $('.st', el).textContent = to ? 'PALABRA QUE CUIDA' : 'PALABRA QUE ESTIGMATIZA';
        $('.tx', el).textContent = to ? s.good : s.bad;
        $('.wy', el).textContent = to ? s.why : 'Toca para mejorarla';
      })
      .to(el, { rotationX: 0, duration: dur(0.35), ease: 'back.out(1.8)', clearProps: 'transform' });
    if (to && $$('.swap.fixed', list).length + 1 === D.SWAPS.length) setTimeout(() => confetti(...stagePoint(list), 90), 500);
  }
  list.addEventListener('click', (e) => { const b = e.target.closest('.swap'); if (b) flip(b); });
  $('#swapAll').onclick = () => $$('.swap', list).forEach((b, i) => setTimeout(() => flip(b, true), i * 220));
  $('#swapReset').onclick = () => $$('.swap', list).forEach((b) => flip(b, false));
}

/* ---------- 13 · protocolo / escudo 3D ---------- */
function initShield(deck, three) {
  const proto = $('#proto');
  proto.innerHTML = D.PROTO.map((p, i) => `
    <button class="pcard" data-a data-i="${i}" style="--pc:${p.color}">
      <span class="pn">${i + 1}</span><h3>${p.name}</h3>
      <ul>${p.q.map((q) => `<li>• ${q}</li>`).join('')}</ul>
    </button>`).join('');
  let auto = null, idx = 0;
  const sync = (i) => { $$('.pcard', proto).forEach((c, k) => c.classList.toggle('on', k === i)); };
  const pick = (i, byUser) => { three.shield.select(i); sync(i); idx = i; if (byUser) { clearInterval(auto); auto = null; } };
  proto.addEventListener('click', (e) => { const c = e.target.closest('.pcard'); if (c) pick(+c.dataset.i, true); });
  three.onShieldPick = (i) => pick(i, true);
  deck.hooks.enter[12] = () => {
    three.live.shield = true; three.shield.resize(); three.shield.assemble();
    sync(-1);
    clearInterval(auto);
    setTimeout(() => { if (deck.index === 12) { pick(0); auto = setInterval(() => pick((idx + 1) % 3), 4200); } }, 2400);
  };
  deck.hooks.leave[12] = () => { three.live.shield = false; clearInterval(auto); auto = null; };
}

/* ---------- 14 · ticket de salida ---------- */
function initTicket() {
  const bank = $('#bank');
  bank.innerHTML = D.BANK.map((b, i) => `<button class="word" data-i="${i}">${b.w}</button>`).join('');
  const slots = [null, null, null];
  const blanks = $$('.blank');
  const why = {
    exacta: 'dice solo lo que la evidencia permite',
    respetuosa: 'cuida a las personas y evita etiquetas',
    clara: 'se entiende sin generar miedo ni confusión',
    verificable: 'se puede contrastar con una fuente',
    'basada en evidencia': 'se apoya en datos y fuentes confiables',
    'sin estigma': 'explica sin culpar ni etiquetar',
    'con fuente': 'muestra de dónde sale el dato',
  };
  function paint() {
    blanks.forEach((b, i) => {
      const w = slots[i] !== null ? D.BANK[slots[i]] : null;
      b.textContent = w ? w.w : '';
      b.classList.toggle('filled', !!w); b.classList.toggle('bad', !!w && !w.good);
      b.style.setProperty('--bc', w?.good ? CVAR[w.c] : '');
      b.classList.toggle('next', !w && slots.indexOf(null) === i);
    });
    $$('.word', bank).forEach((b, i) => b.classList.toggle('used', slots.includes(i)));
    const fb = $('#ticketFb');
    const filled = slots.filter((s) => s !== null);
    fb.className = 'ticket-fb glass';
    if (filled.length < 3) { fb.textContent = filled.length ? `Faltan ${3 - filled.length}. Toca un espacio para quitar una palabra.` : 'Elige tres palabras del banco. Toca un espacio para quitarla.'; return; }
    const bad = filled.filter((i) => !D.BANK[i].good);
    if (bad.length) {
      fb.classList.add('warn');
      fb.innerHTML = `<b>Revisemos:</b> «${D.BANK[bad[0]].w}» no es un criterio de calidad. Que algo se difunda mucho no lo hace verdadero. ¿La cambias por una palabra que ayude a cuidar?`;
    } else {
      fb.classList.add('good');
      fb.innerHTML = `<b>¡Muy bien!</b> ` + filled.map((i) => `<i>${D.BANK[i].w}</i>: ${why[D.BANK[i].w]}`).join(' · ') + '.';
      confetti(...stagePoint($('#blanks')), 100);
    }
  }
  bank.addEventListener('click', (e) => {
    const b = e.target.closest('.word'); if (!b) return;
    const k = slots.indexOf(null); if (k < 0) { toast('Quita una palabra tocando un espacio'); return; }
    slots[k] = +b.dataset.i; paint();
    gsap.fromTo(blanks[k], { scale: 1.12 }, { scale: 1, duration: dur(0.45), ease: 'back.out(3)' });
  });
  blanks.forEach((b, i) => b.addEventListener('click', () => { slots[i] = null; paint(); }));
  paint();

  const self = $('#selfList');
  self.innerHTML = D.SELF.map((t, i) => `<li><button data-i="${i}" aria-pressed="false"><span class="bx">✓</span>${t}</button></li>`).join('');
  self.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const on = b.classList.toggle('on'); b.setAttribute('aria-pressed', on);
    gsap.fromTo($('.bx', b), { scale: 0.5 }, { scale: 1, duration: dur(0.4), ease: 'back.out(3)' });
    if ($$('button.on', self).length === D.SELF.length) { confetti(...stagePoint(self), 120); toast('¡Lista para la próxima clase!'); }
  });
}
