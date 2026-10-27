import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { $, $$, toast, confetti as confettiRaw, motion } from '../../src/util.js';
import * as D from './data.js';

gsap.registerPlugin(Draggable);

const PAL = ['#7a5cff', '#ff5d73', '#16b5a4', '#ffa94d', '#ffffff'];
const confetti = (x, y, n) => confettiRaw(x, y, n, PAL);
const CV = { coral: 'var(--coral)', violet: 'var(--violet)', mint: 'var(--mint)', sun: 'var(--sun)' };
const store = {
  get(k, d = '') { try { return localStorage.getItem('c21:' + k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('c21:' + k, v); } catch { /* sin almacenamiento */ } },
};
const dur = (d) => (motion.reduced ? 0.01 : d);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const wordsOf = (t) => t.trim().split(/\s+/).filter(Boolean).length;
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); parent?.appendChild(e); return e; };
function srect(el) {
  const s = $('#stage').getBoundingClientRect(), r = el.getBoundingClientRect(), k = s.width / 1920;
  return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
}
const stagePoint = (el) => { const r = srect(el); return [r.x + r.w / 2, r.y + r.h / 2]; };
function typeInto(el, text, d = 1) {
  if (motion.reduced) { el.textContent = text; return null; }
  const o = { n: 0 };
  el.textContent = '';
  return gsap.to(o, { n: text.length, duration: Math.min(1.5, text.length * 0.014) * d, ease: 'none', onUpdate: () => { el.textContent = text.slice(0, Math.round(o.n)); } });
}
const cap = (s) => s.replace(/^\s*(\S)/, (m) => m.toUpperCase());

// estado compartido entre el taller (10) y el redactor (11)
const shared = { cas: 0, evidence: [] };

export function initSlides(deck, three) {
  initCover(deck);
  initTwo();
  initOrbs();
  initDeck();
  initERL(deck, three);
  initBalance();
  initSwipe(deck);
  initNet(deck, three);
  initCase(deck);
  initWrite(deck, three);
  initGallery();
  initShare();
  initTicket();
}

/* ---------- 1 · portada ---------- */
function initCover(deck) {
  deck.hooks.enter[0] = () => {
    gsap.fromTo('.erl-chips > *', { scale: 0.5, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: dur(0.8), stagger: 0.12, ease: 'back.out(2)', delay: 0.9, clearProps: 'transform,opacity' });
  };
}

/* ---------- 3 · dos mensajes ---------- */
function initTwo() {
  const markUp = (m, cls) => { let h = esc(m.text); m.marks.forEach((k) => { h = h.replace(esc(k.w), `<mark class="${cls}">${esc(k.w)}</mark>`); }); return h; };
  $('#mFromA').textContent = D.MSG_ABS.from; $('#mFromB').textContent = D.MSG_PRU.from;
  $('#mTextA').textContent = D.MSG_ABS.text; $('#mTextB').textContent = D.MSG_PRU.text;
  let pick = null, analyzed = false;
  const cards = $$('.msgcard');
  cards.forEach((c) => c.addEventListener('click', () => {
    pick = c.dataset.m;
    cards.forEach((x) => { x.classList.toggle('sel', x === c); x.classList.toggle('dimmed', x !== c && analyzed); });
    $('#msgAnalyze').disabled = false;
    $('#twoFb').textContent = 'Anotado. Cuando quieras, analicemos las palabras de cada mensaje.';
    gsap.fromTo(c, { scale: 0.98 }, { scale: 1, duration: dur(0.5), ease: 'elastic.out(1,.4)', clearProps: 'transform' });
  }));
  $('#msgAnalyze').onclick = () => {
    analyzed = true;
    $('#mTextA').innerHTML = markUp(D.MSG_ABS, 'bad'); $('#mTextB').innerHTML = markUp(D.MSG_PRU, 'good');
    $('#vA').innerHTML = '<b class="c-coral">ABSOLUTO</b>' + D.MSG_ABS.marks.map((m) => `«${esc(m.w)}»: ${m.why}`).join('<br>');
    $('#vB').innerHTML = '<b class="c-mint">PRUDENTE</b>' + D.MSG_PRU.marks.map((m) => `«${esc(m.w)}»: ${m.why}`).join('<br>');
    $('#gA').style.width = '96%'; $('#gB').style.width = '46%';
    $('#twoFb').innerHTML = pick === 'pru' ? '<b>¡Bien!</b> El mensaje B comunica mejor la ciencia: describe un efecto con prudencia, reconoce su límite y dirige a un profesional.' : '<b>Veamos:</b> el mensaje A suena seguro, pero promete de más. La ciencia comunica con prudencia y reconoce sus límites: el mensaje B.';
    if (pick === 'pru') confetti(960, 430, 70);
    gsap.fromTo('.verdict', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: dur(0.7), stagger: 0.15, ease: 'expo.out' });
  };
}

/* ---------- 4 · burbujas ---------- */
function initOrbs() {
  const box = $('#orbs');
  box.innerHTML = D.QUESTIONS.map((q, i) => `<button class="orb" role="tab" data-i="${i}" style="--oc:${CV[q.c]}" aria-label="Pregunta ${i + 1}">${i + 1}</button>`).join('');
  let cur = -1, tw;
  function show(i, first) {
    if (i === cur) return;
    cur = i;
    const q = D.QUESTIONS[i];
    $$('.orb', box).forEach((o, k) => { o.classList.toggle('on', k === i); if (k === i) o.classList.add('seen'); o.setAttribute('aria-selected', k === i); });
    $('#qTag').textContent = `PREGUNTA ${i + 1} DE ${D.QUESTIONS.length}`;
    $('#qPanel').style.setProperty('--qc', CV[q.c]);
    tw?.kill();
    if (first || motion.reduced) { $('#qTitle').textContent = q.q; $('#qIdea').textContent = q.idea; return; }
    gsap.fromTo('#qTitle', { opacity: 0, y: 24, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out', clearProps: 'filter,transform' });
    $('#qTitle').textContent = q.q;
    tw = typeInto($('#qIdea'), q.idea);
  }
  box.addEventListener('click', (e) => { const b = e.target.closest('.orb'); if (b) show(+b.dataset.i); });
  show(0, true);
}

/* ---------- 5 · mazo de vocabulario ---------- */
function initDeck() {
  const stage = $('#deckStage'), list = $('#knownList');
  let queue, known, cards;
  const build = () => {
    stage.innerHTML = ''; list.innerHTML = '<span class="dim">Aún no hay palabras aprendidas.</span>';
    queue = D.VOCAB.map((_, i) => i); known = [];
    cards = D.VOCAB.map((v, i) => {
      const el = document.createElement('div');
      el.className = 'dcard'; el.dataset.i = i; el.style.setProperty('--dc', CV[v.c]);
      el.innerHTML = `<div class="face front"><span class="num">${String(i + 1).padStart(2, '0')} / 08</span><span class="term">${v.t}</span><span class="tap">TOCA PARA VER LA DEFINICIÓN</span></div><div class="face back"><span class="term">${v.t}</span><p>${v.d}</p><p class="ex">${v.ex}</p></div>`;
      el._flip = false;
      el.addEventListener('click', () => { if (queue[0] !== i) return; el._flip = !el._flip; gsap.to(el, { rotationY: el._flip ? 180 : 0, duration: dur(0.8), ease: 'expo.out' }); });
      stage.appendChild(el); return el;
    });
    $('#dKnown').textContent = 0;
    layout(true);
  };
  function layout(instant) {
    cards.forEach((el, i) => {
      const k = queue.indexOf(i);
      if (k < 0) return;
      gsap.to(el, { x: 0, y: k * 18, scale: 1 - k * 0.04, opacity: k < 4 ? 1 : 0, zIndex: 100 - k, rotationY: k === 0 && el._flip ? 180 : 0, rotate: 0, duration: instant ? 0.01 : dur(0.7), ease: 'expo.out', transformPerspective: 1600 });
      el.style.pointerEvents = k === 0 ? 'auto' : 'none';
    });
  }
  function act(know) {
    if (!queue.length) return;
    const i = queue[0], el = cards[i];
    gsap.to(el, { x: know ? 1000 : -1000, rotate: know ? 16 : -16, opacity: 0, duration: dur(0.6), ease: 'power3.in', onComplete: () => {
      if (know) {
        queue.shift(); known.push(i); el.style.display = 'none';
        if (known.length === 1) list.innerHTML = '';
        const w = document.createElement('span'); w.className = 'kw'; w.style.setProperty('--dc', CV[D.VOCAB[i].c]); w.textContent = D.VOCAB[i].t; list.appendChild(w);
        gsap.fromTo(w, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: dur(0.5), ease: 'back.out(3)' });
        $('#dKnown').textContent = known.length;
        if (!queue.length) { confetti(960, 560, 120); toast('¡Mazo completo! 8 de 8'); }
      } else { queue.push(queue.shift()); el._flip = false; gsap.set(el, { x: 0, rotate: 0, rotationY: 0 }); }
      layout();
    } });
  }
  $('#dKnow').onclick = () => act(true);
  $('#dReview').onclick = () => act(false);
  $('#dReset').onclick = build;
  build();
}

/* ---------- 6 · E-R-L ---------- */
function initERL(deck, three) {
  const stepsEl = $('#erlSteps');
  stepsEl.innerHTML = D.ERL.map((s, i) => `<button role="tab" data-i="${i}" style="--sc:${CV[s.c]}">${s.k}<small>${s.name}</small></button>`).join('');
  let cur = 0, tw;
  function show(i, animate = true) {
    cur = i;
    const s = D.ERL[i];
    $$('button', stepsEl).forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('done', k < i); b.setAttribute('aria-selected', k === i); });
    $('#erlCard').innerHTML = `<div class="tag mono">PASO ${i + 1} · ${s.k}</div><h3 style="color:${CV[s.c]}">${s.name}</h3><p class="ask">${s.ask}</p><p class="say" id="erlSay"></p>`;
    tw?.kill();
    if (animate) { gsap.fromTo('#erlCard', { y: 18, opacity: 0.4 }, { y: 0, opacity: 1, duration: dur(0.6), ease: 'expo.out', clearProps: 'transform,opacity' }); tw = typeInto($('#erlSay'), s.text, 0.8); }
    else $('#erlSay').textContent = s.text;
    $('#erlFinalTxt').innerHTML = D.ERL.slice(0, i + 1).map((x, k) => `<span class="${x.k.toLowerCase()}">${esc(x.text)}</span>`).join(' ');
    three.erl.setStep(i);
    $('#erlPrev').disabled = i === 0; $('#erlNext').textContent = i === D.ERL.length - 1 ? 'Volver a E ↺' : 'Siguiente ▸';
    if (i === D.ERL.length - 1 && animate) setTimeout(() => confetti(...stagePoint($('.erl-final')), 60), 900);
  }
  stepsEl.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show(+b.dataset.i); });
  $('#erlPrev').onclick = () => show(Math.max(0, cur - 1));
  $('#erlNext').onclick = () => show(cur === D.ERL.length - 1 ? 0 : cur + 1);
  three.onERLPick = (i) => show(i);
  deck.hooks.enter[5] = () => { three.live.erl = true; three.erl.resize(); show(0, false); };
  deck.hooks.leave[5] = () => { three.live.erl = false; };
}

/* ---------- 7 · balanza ---------- */
function initBalance() {
  let ev = -1, wd = -1;
  $('#evPicks').innerHTML = D.EVID_LEVELS.map((e) => `<button class="pk" data-i="${e.id}"><b>${e.name}</b>${e.text}</button>`).join('');
  $('#wdPicks').innerHTML = D.WORDINGS.map((w) => `<button class="pk" data-i="${w.id}"><span>«…${w.t}»</span><i>${w.tag}</i></button>`).join('');
  const svg = $('#balSvg');
  const g = { beam: svgEl('line', { stroke: '#2a2140', 'stroke-width': 8, 'stroke-linecap': 'round' }, svg) };
  svgEl('path', { d: 'M300 400 L320 160 L340 400 Z', fill: 'rgba(122,92,255,.28)', stroke: '#7a5cff', 'stroke-width': 4, 'stroke-linejoin': 'round' }, svg);
  svgEl('circle', { cx: 320, cy: 150, r: 14, fill: '#fff', stroke: '#2a2140', 'stroke-width': 5 }, svg);
  const pans = ['L', 'R'].map((side) => {
    const grp = svgEl('g', {}, svg);
    const ropes = [svgEl('line', { stroke: '#2a2140', 'stroke-width': 3 }, grp), svgEl('line', { stroke: '#2a2140', 'stroke-width': 3 }, grp)];
    const pan = svgEl('path', { d: 'M-90 0 Q0 46 90 0 Z', fill: side === 'L' ? 'rgba(122,92,255,.4)' : 'rgba(255,93,115,.4)', stroke: '#2a2140', 'stroke-width': 4, 'stroke-linejoin': 'round' }, grp);
    const blocks = svgEl('g', {}, grp);
    const label = svgEl('text', { y: 80, 'text-anchor': 'middle', 'font-size': 20, fill: '#5b5073' }, grp);
    label.textContent = side === 'L' ? 'EVIDENCIA' : 'MENSAJE';
    return { grp, ropes, blocks };
  });
  const st = { ang: 0 };
  function draw() {
    const a = (st.ang * Math.PI) / 180, L = 220;
    const lx = 320 - L * Math.cos(a), ly = 150 - L * Math.sin(a), rx = 320 + L * Math.cos(a), ry = 150 + L * Math.sin(a);
    g.beam.setAttribute('x1', lx); g.beam.setAttribute('y1', ly); g.beam.setAttribute('x2', rx); g.beam.setAttribute('y2', ry);
    [[pans[0], lx, ly], [pans[1], rx, ry]].forEach(([p, x, y]) => {
      p.grp.setAttribute('transform', `translate(${x},${y + 96})`);
      p.ropes[0].setAttribute('x1', -90); p.ropes[0].setAttribute('y1', 0); p.ropes[0].setAttribute('x2', 0); p.ropes[0].setAttribute('y2', -96);
      p.ropes[1].setAttribute('x1', 90); p.ropes[1].setAttribute('y1', 0); p.ropes[1].setAttribute('x2', 0); p.ropes[1].setAttribute('y2', -96);
    });
  }
  function setBlocks(p, n, color) {
    p.blocks.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const r = svgEl('rect', { x: -34, y: -42 - i * 40, width: 68, height: 36, rx: 10, fill: color, stroke: '#2a2140', 'stroke-width': 3 }, p.blocks);
      gsap.fromTo(r, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: dur(0.5), delay: i * 0.08, ease: 'bounce.out' });
    }
  }
  const allowed = (e) => e; // débil→0 · moderada→1 · fuerte→2
  function update() {
    const lw = ev < 0 ? 0 : ev + 1, rw = wd < 0 ? 0 : wd + 1;
    setBlocks(pans[0], lw, '#9d85ff'); setBlocks(pans[1], rw, '#ff8da0');
    const target = Math.max(-24, Math.min(24, (rw - lw) * 7));
    gsap.to(st, { ang: target, duration: dur(1.2), ease: 'elastic.out(1,.55)', onUpdate: draw });
    const v = $('#balVerdict');
    if (ev < 0 || wd < 0) { v.innerHTML = '<b>Elige las dos cosas</b>La balanza compara la fuerza de la evidencia con la fuerza del lenguaje.'; return; }
    const diff = wd - allowed(ev);
    let html;
    if (wd === 3) html = '<b class="c-coral">Sobre-afirma</b>Un absoluto («evita siempre…») casi nunca se justifica: ni con evidencia fuerte hay certeza total.';
    else if (diff > 0) html = '<b class="c-coral">Sobre-afirma</b>El mensaje dice más de lo que la evidencia sostiene. Baja la fuerza del verbo o busca más evidencia.';
    else if (diff === 0) html = '<b class="c-mint">Ajustado ✓</b>El lenguaje coincide con la fuerza de la evidencia: comunica sin prometer de más.';
    else if (diff === -1) html = '<b class="c-mint">Prudente ✓</b>Es seguro: dice un poco menos de lo que la evidencia permitiría.';
    else html = '<b class="c-sun">Demasiado tímido</b>La evidencia permite decir más; un mensaje tan cauteloso puede no orientar.';
    v.innerHTML = html;
    if (diff === 0 && wd < 3) confetti(...stagePoint($('.bal-vis')), 50);
  }
  const sel = (box, i) => $$('.pk', box).forEach((b) => b.classList.toggle('on', +b.dataset.i === i));
  $('#evPicks').addEventListener('click', (e) => { const b = e.target.closest('.pk'); if (!b) return; ev = +b.dataset.i; sel($('#evPicks'), ev); update(); });
  $('#wdPicks').addEventListener('click', (e) => { const b = e.target.closest('.pk'); if (!b) return; wd = +b.dataset.i; sel($('#wdPicks'), wd); update(); });
  draw(); update();
}

/* ---------- 8 · deslizar: informa vs decide ---------- */
function initSwipe(deck) {
  const stage = $('#swipeStage');
  let i = 0, score = 0, done = 0, drag = null, busy = false;
  const zl = $('.zl'), zr = $('.zr');
  function makeCard() {
    if (i >= D.SWIPE.length) { finish(); return; }
    const c = D.SWIPE[i];
    const el = document.createElement('div');
    el.className = 'scard'; el.innerHTML = `<span class="no">TARJETA ${i + 1} DE ${D.SWIPE.length}</span><p>${esc(c.t)}</p><span class="stamp l">DECIDE POR OTRO</span><span class="stamp r">INFORMA</span>`;
    stage.appendChild(el);
    gsap.fromTo(el, { scale: 0.85, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, duration: dur(0.6), ease: 'back.out(1.6)' });
    drag = Draggable.create(el, {
      type: 'x', inertia: false,
      onDrag() { const x = this.x; gsap.set(el, { rotate: x / 28 }); $('.stamp.l', el).style.opacity = Math.min(1, Math.max(0, -x / 180)); $('.stamp.r', el).style.opacity = Math.min(1, Math.max(0, x / 180)); zl.classList.toggle('hot', x < -90); zr.classList.toggle('hot', x > 90); },
      onDragEnd() { if (Math.abs(this.x) > 200) commit(this.x > 0 ? 'informa' : 'decide', el); else { gsap.to(el, { x: 0, rotate: 0, duration: dur(0.6), ease: 'elastic.out(1,.5)' }); $$('.stamp', el).forEach((s) => (s.style.opacity = 0)); zl.classList.remove('hot'); zr.classList.remove('hot'); } },
    })[0];
  }
  function commit(ans, el) {
    if (busy || i >= D.SWIPE.length) return;
    busy = true;
    el = el || $('.scard', stage);
    const c = D.SWIPE[i], ok = ans === c.a;
    drag?.kill();
    zl.classList.remove('hot'); zr.classList.remove('hot');
    gsap.to(el, { x: ans === 'informa' ? 1100 : -1100, rotate: ans === 'informa' ? 18 : -18, opacity: 0, duration: dur(0.55), ease: 'power3.in', onComplete: () => { el.remove(); i++; busy = false; makeCard(); } });
    done++; if (ok) score++;
    $('#swScore').textContent = `${done} / ${D.SWIPE.length} · ${score} aciertos`;
    $('#swFb').innerHTML = `<b class="${ok ? 'c-mint' : 'c-coral'}">${ok ? '¡Bien!' : 'Revisemos.'}</b> Es una tarjeta que <u>${c.a === 'informa' ? 'informa' : 'decide por otra persona'}</u>. ${c.why}`;
  }
  function finish() {
    stage.innerHTML = `<div class="scard" style="cursor:default"><span class="no">RESULTADO</span><p>${score} de ${D.SWIPE.length} aciertos</p><span class="no">Informar es entregar evidencia y opciones; decidir por otro es imponer.</span></div>`;
    gsap.fromTo('.scard', { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: dur(0.6), ease: 'back.out(1.6)' });
    if (score === D.SWIPE.length) confetti(960, 520, 130);
  }
  function reset() { stage.innerHTML = ''; i = 0; score = 0; done = 0; busy = false; $('#swScore').textContent = `0 / ${D.SWIPE.length} · 0 aciertos`; $('#swFb').textContent = 'Arrastra la tarjeta hacia un lado, usa los botones o las teclas A (decide) y D (informa).'; makeCard(); }
  $('#swL').onclick = () => commit('decide');
  $('#swR').onclick = () => commit('informa');
  $('#swReset').onclick = reset;
  addEventListener('keydown', (e) => {
    if (deck.index !== 7 || e.target.matches?.('input,textarea')) return;
    if (e.key === 'a' || e.key === 'A') commit('decide'); else if (e.key === 'd' || e.key === 'D') commit('informa');
  });
  makeCard();
}

/* ---------- 9 · red de evidencia ---------- */
function initNet(deck, three) {
  $('#netMsg').textContent = D.NET_MSG;
  const list = $('#netList');
  list.innerHTML = D.NET.map((n, i) => `<button class="ni ${n.rel ? 'rel' : 'irr'}" data-i="${i}"><i>${n.id}</i><span>${n.t}</span></button>`).join('');
  const on = new Set();
  function sync(last) {
    let solid = 0, noise = 0;
    on.forEach((i) => { const n = D.NET[i]; if (n.rel) solid += n.w; else noise += 25; });
    solid = Math.min(100, solid); noise = Math.min(100, noise);
    $('#nSolid').style.width = solid + '%'; $('#nSolidN').textContent = solid + ' %';
    $('#nNoise').style.width = noise + '%'; $('#nNoiseN').textContent = noise + ' %';
    three.net.setStats(solid / 100, noise / 100);
    if (last !== undefined) {
      const n = D.NET[last], isOn = on.has(last);
      $('#netFb').innerHTML = !isOn ? 'Pieza desacoplada.' : n.rel ? `<b class="c-mint">Aporta.</b> Viene de una fuente confiable y respalda el mensaje (+${n.w} %).` : `<b class="c-coral">Ruido.</b> Es una opinión o anécdota sin fuente verificable: no respalda el mensaje.`;
    }
    if (solid === 100 && noise === 0) { toast('Mensaje sólido y sin ruido'); confetti(...stagePoint($('.net-stage')), 90); }
  }
  function toggle(i) {
    const isOn = !on.has(i);
    isOn ? on.add(i) : on.delete(i);
    $$('.ni', list)[i].classList.toggle('on', isOn);
    three.net.setAttached(i, isOn);
    sync(i);
  }
  list.addEventListener('click', (e) => { const b = e.target.closest('.ni'); if (b) toggle(+b.dataset.i); });
  three.onNetPick = toggle;
  deck.hooks.enter[8] = () => { three.live.net = true; three.net.resize(); };
  deck.hooks.leave[8] = () => { three.live.net = false; };
}

/* ---------- 10 · taller: extrae la evidencia ---------- */
function initCase(deck) {
  let cur = 0;
  const picked = D.CASES.map(() => new Set());
  const tabs = $('#caseTabs');
  tabs.innerHTML = D.CASES.map((c, i) => `<button role="tab" data-i="${i}">${c.tab}</button>`).join('');
  function renderData(d) {
    const box = $('#dataCard');
    let h = `<h4>${d.title.toUpperCase()}</h4>`;
    if (d.kind === 'icons') h += `<div class="ic-list">${d.items.map((x) => `<div>${x}</div>`).join('')}</div>`;
    else if (d.kind === 'dots') h += `<div class="dots">${Array.from({ length: d.n }, (_, k) => `<i data-k="${k}"></i>`).join('')}</div><div class="dcap">${d.caption}</div>`;
    else h += `<table class="dt">${d.rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table>`;
    box.innerHTML = h;
    if (d.kind === 'dots') $$('.dots i', box).forEach((e, k) => setTimeout(() => e.classList.toggle('on', k < d.on), motion.reduced ? 0 : 400 + k * 110));
  }
  function render(anim) {
    const c = D.CASES[cur];
    $$('button', tabs).forEach((b, i) => { b.classList.toggle('on', i === cur); b.setAttribute('aria-selected', i === cur); });
    $('#viralTxt').textContent = c.viral; $('#srcName').textContent = c.src.toUpperCase();
    renderData(c.data);
    $('#srcSents').innerHTML = c.sents.map((s, i) => `<button class="ss ${picked[cur].has(i) ? 'done ' + (s.rel ? 'rel' : 'irr') : ''}" data-i="${i}">${s.t}</button>`).join('');
    updateTray();
    if (anim) gsap.fromTo(['#viralTxt', '#srcSents .ss', '#dataCard'], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: dur(0.6), stagger: 0.06, ease: 'expo.out', clearProps: 'transform,opacity' });
  }
  function updateTray() {
    const c = D.CASES[cur];
    const relIdx = c.sents.map((s, i) => (s.rel ? i : -1)).filter((i) => i >= 0);
    const got = relIdx.filter((i) => picked[cur].has(i));
    $('#trayBar').style.width = (got.length / relIdx.length) * 100 + '%';
    $('#trayList').innerHTML = got.length ? got.map((i) => `<div class="tl">${c.sents[i].t}</div>`).join('') : '<span class="dim">Aún no seleccionas evidencia.</span>';
    const full = got.length === relIdx.length;
    $('#caseKey').hidden = !full; $('#caseKey').textContent = full ? `Idea clave: ${c.keyIdea}` : '';
    $('#toWrite').disabled = got.length < 2;
    shared.cas = cur; shared.evidence = got.map((i) => c.sents[i].t);
  }
  $('#srcSents').addEventListener('click', (e) => {
    const b = e.target.closest('.ss'); if (!b || b.classList.contains('done')) return;
    const i = +b.dataset.i, s = D.CASES[cur].sents[i];
    picked[cur].add(i);
    b.classList.add('done', s.rel ? 'rel' : 'irr');
    if (!s.rel) { b.classList.add('nope'); toast('No aporta a la recomendación'); }
    else gsap.fromTo(b, { scale: 1.03 }, { scale: 1, duration: dur(0.5), ease: 'elastic.out(1,.4)', clearProps: 'transform' });
    updateTray();
    const relIdx = D.CASES[cur].sents.map((x, k) => (x.rel ? k : -1)).filter((k) => k >= 0);
    if (relIdx.every((k) => picked[cur].has(k))) confetti(...stagePoint($('.case-tray')), 80);
  });
  tabs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { cur = +b.dataset.i; render(true); } });
  $('#toWrite').onclick = () => deck.go(10);
  render(false);
}

/* ---------- 11 · redactor E-R-L ---------- */
const MODELS = {
  0: { E: 'Según una hoja informativa sanitaria, las ITS se transmiten por mecanismos específicos y cualquier persona expuesta puede adquirir una.', R: 'Informarse sobre cómo se transmiten y conversar con un profesional ayuda a tomar decisiones de autocuidado.', L: 'Esta información es general y no reemplaza la orientación de un profesional.' },
  1: { E: 'Según el Ministerio de Salud, muchas ITS pueden no dar síntomas.', R: 'Consultar y realizar controles cuando corresponde ayuda a cuidar la salud, aunque te sientas bien.', L: 'Es información general; ante una duda personal, consulta en tu centro de salud.' },
  2: { E: 'Las fuentes sanitarias señalan que ninguna medida aislada es una garantía absoluta.', R: 'Combinar información confiable, medidas de barrera, vacunación cuando existe y consulta oportuna puede ayudar a reducir el riesgo.', L: 'No reemplaza la orientación de un profesional de la salud.' },
};
function initWrite(deck, three) {
  const F = { E: $('#fE'), R: $('#fR'), L: $('#fL') };
  Object.entries(D.STARTERS).forEach(([k, arr]) => { $(`.starters[data-s="${k}"]`).innerHTML = arr.map((t) => `<button class="st" data-k="${k}">${t.trim()}…</button>`).join(''); });
  try { const sv = JSON.parse(store.get('w', '{}')); Object.keys(F).forEach((k) => { F[k].value = sv[k] || ''; }); } catch { /* vacío */ }
  const get = () => ({ E: F.E.value, R: F.R.value, L: F.L.value });
  function criteria(m) {
    const all = `${m.E} ${m.R} ${m.L}`, n = wordsOf(all);
    const out = { correcto: ['', 'Escribe las tres partes para evaluar.'], util: ['', 'Sugiere una acción clara.'], respetuoso: ['', 'Sin culpa, etiquetas ni imposiciones.'], verificable: ['', 'Cita una fuente o dato.'] };
    if (!n) return out;
    const abs = all.match(D.CRIT.absolutos);
    if (abs) out.correcto = ['r', `Evita el absoluto <mark>${abs[0]}</mark>.`];
    else if (!m.L.trim()) out.correcto = ['y', 'Falta el límite o alcance (L).'];
    else if (!D.CRIT.limite.test(m.L)) out.correcto = ['y', 'Tu límite debería decir qué no reemplaza o cuándo consultar.'];
    else out.correcto = ['g', 'Prudente y con límite.'];
    if (wordsOf(m.R) >= 6 && D.CRIT.accion.test(m.R)) out.util = ['g', 'Sugiere una acción clara.'];
    else out.util = ['y', 'Agrega una acción de autocuidado (R).'];
    const es = all.match(D.CRIT.estigma), im = all.match(D.CRIT.impone);
    if (es) out.respetuoso = ['r', `Evita <mark>${es[0]}</mark>.`];
    else if (im) out.respetuoso = ['y', `«${im[0]}» impone: informa, no decidas por otros.`];
    else out.respetuoso = ['g', 'Lenguaje respetuoso.'];
    if (D.CRIT.fuente.test(m.E)) out.verificable = ['g', 'Cita fuente o dato.'];
    else out.verificable = [wordsOf(m.E) >= 6 ? 'y' : '', 'Indica la fuente («según…»).'];
    return out;
  }
  let raf = 0;
  function evaluate() {
    const m = get(), n = wordsOf(`${m.E} ${m.R} ${m.L}`);
    store.set('w', JSON.stringify(m));
    $('#wCount').textContent = n;
    const ring = $('#wRing'); ring.style.strokeDashoffset = 113 * (1 - Math.min(n, 45) / 45); ring.style.stroke = n > 45 ? 'var(--coral)' : n > 38 ? 'var(--sun)' : 'var(--mint)';
    const c = criteria(m);
    $('#crits').innerHTML = D.CRITERIA.map((k) => `<div class="cr ${c[k.k][0]}"><b><i></i>${k.name}</b><p>${n > 45 && k.k === 'correcto' ? 'Supera las tres líneas: recorta.' : c[k.k][1]}</p></div>`).join('');
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => three.card.update({ ...m, crit: Object.fromEntries(Object.entries(c).map(([k, v]) => [k, v[0]])) }));
  }
  Object.values(F).forEach((t) => t.addEventListener('input', evaluate));
  $$('.starters').forEach((box) => box.addEventListener('click', (e) => { const b = e.target.closest('.st'); if (!b) return; const k = b.dataset.k, t = D.STARTERS[k][$$('.st', box).indexOf(b)]; if (!F[k].value.trim()) { F[k].value = t; } F[k].focus(); evaluate(); }));
  function evChips() {
    const box = $('#evChips');
    box.innerHTML = shared.evidence.length ? shared.evidence.map((t, i) => `<button class="evc" data-i="${i}">${t}</button>`).join('') : '<span class="dim" style="font-size:15px">Elige evidencia en el taller (diapositiva 10) para insertarla aquí.</span>';
  }
  $('#evChips').addEventListener('click', (e) => { const b = e.target.closest('.evc'); if (!b) return; F.E.value = F.E.value.trim() ? `${F.E.value.trim()} ${shared.evidence[+b.dataset.i]}` : shared.evidence[+b.dataset.i]; evaluate(); });
  $('#wModel').onclick = () => {
    const box = $('#wModelBox'), m = MODELS[shared.cas] || MODELS[1];
    box.hidden = !box.hidden; $('#wModel').textContent = box.hidden ? 'Ver modelo' : 'Ocultar modelo';
    if (!box.hidden) { $('#wModelTxt').innerHTML = `<b class="c-violet">E</b> ${esc(m.E)}<br><b class="c-mint">R</b> ${esc(m.R)}<br><b class="c-coral">L</b> ${esc(m.L)}`; gsap.fromTo(box, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: dur(0.5), ease: 'expo.out', clearProps: 'transform,opacity' }); }
  };
  $('#wClear').onclick = () => { Object.values(F).forEach((t) => { t.value = ''; }); evaluate(); F.E.focus(); };
  deck.hooks.enter[10] = () => { three.live.card = true; three.card.resize(); evChips(); evaluate(); };
  deck.hooks.leave[10] = () => { three.live.card = false; };
  evaluate();
}

/* ---------- 12 · galería ---------- */
function initGallery() {
  let sel = -1, crit = null, stem = null;
  const posted = {};
  const cards = $('#galCards');
  cards.innerHTML = D.GALLERY.map((g, i) => `<button class="gc" data-i="${i}"><span class="gid">MENSAJE ${i + 1} · GRUPO ANÓNIMO</span>${esc(g.t)}<span class="notes2"></span></button>`).join('');
  $('#gCrits').innerHTML = D.CRITERIA.map((c) => `<button class="gcr" data-k="${c.k}">${c.name}<small>${c.hint}</small></button>`).join('');
  $('#gStems').innerHTML = D.FB_STEMS.map((s) => `<button class="gstem" data-k="${s.k}">${s.t}</button>`).join('');
  function paint() {
    $$('.gc', cards).forEach((c, i) => c.classList.toggle('sel', i === sel));
    $$('.gcr').forEach((b) => b.classList.toggle('on', b.dataset.k === crit));
    $$('.gstem').forEach((b) => b.classList.toggle('on', b.dataset.k === stem));
    $('#gTag').textContent = sel < 0 ? 'ELIGE UN MENSAJE DE LA GALERÍA' : `COMENTARIO PARA EL MENSAJE ${sel + 1}`;
    $('#gPost').disabled = !(sel >= 0 && !posted[sel] && crit && stem && $('#gText').value.trim().length >= 12);
  }
  cards.addEventListener('click', (e) => { const c = e.target.closest('.gc'); if (c) { sel = +c.dataset.i; $('#gNote').textContent = posted[sel] ? 'Ya comentaste este mensaje.' : ''; paint(); } });
  $('#gCrits').addEventListener('click', (e) => { const b = e.target.closest('.gcr'); if (b) { crit = b.dataset.k; paint(); } });
  $('#gStems').addEventListener('click', (e) => { const b = e.target.closest('.gstem'); if (!b) return; stem = b.dataset.k; const t = D.FB_STEMS.find((s) => s.k === stem).t; const ta = $('#gText'); if (!ta.value.trim()) ta.value = t + ' '; ta.focus(); paint(); });
  $('#gText').addEventListener('input', paint);
  $('#gPost').onclick = () => {
    const g = D.GALLERY[sel], txt = $('#gText').value.trim();
    posted[sel] = { crit, txt };
    const note = document.createElement('span'); note.className = 'sticky'; note.textContent = `[${D.CRITERIA.find((c) => c.k === crit).name}] ${txt}`;
    $$('.gc .notes2', cards)[sel].appendChild(note);
    gsap.fromTo(note, { scale: 0, rotate: -20, y: -40 }, { scale: 1, rotate: -1.5, y: 0, duration: dur(0.7), ease: 'back.out(2.5)' });
    const n = Object.keys(posted).length; $('#gScore').textContent = n;
    $('#gNote').innerHTML = g.weak ? (crit === g.weak ? `<b>¡Buena elección!</b> ${g.note}` : `<b>Sugerencia docente:</b> ${g.note}`) : `<b>Mensaje sólido.</b> ${g.note}`;
    $('#gText').value = ''; crit = null; stem = null; paint();
    if (n === D.GALLERY.length) { confetti(960, 540, 110); toast('¡Galería completa!'); }
  };
  $('#gReset').onclick = () => { Object.keys(posted).forEach((k) => delete posted[k]); $$('.notes2', cards).forEach((n) => { n.innerHTML = ''; }); $('#gScore').textContent = 0; $('#gNote').textContent = ''; sel = -1; crit = null; stem = null; $('#gText').value = ''; paint(); };
  paint();
}

/* ---------- 13 · dos fuertes y uno por mejorar ---------- */
function initShare() {
  const tabs = $('#shTabs'), main = $('#shMain');
  const items = [{ k: 's1', label: 'Mensaje fuerte 1' }, { k: 's2', label: 'Mensaje fuerte 2' }, { k: 'w', label: 'Por mejorar', weak: true }];
  tabs.innerHTML = items.map((t, i) => `<button role="tab" data-i="${i}" class="${t.weak ? 'weak' : ''}"><i></i>${t.label}</button>`).join('');
  let cur = 0; const picks = D.IMPROVE.slots.map(() => -1);
  const crit = (flags) => { $('#shCrit').innerHTML = `<div class="tag mono">LOS 4 CRITERIOS</div>` + D.CRITERIA.map((c, i) => `<div class="shc ${flags[i] ? 'on' : ''}"><i>✓</i>${c.name}</div>`).join(''); };
  function render() {
    $$('button', tabs).forEach((b, i) => { b.classList.toggle('on', i === cur); b.setAttribute('aria-selected', i === cur); });
    if (cur < 2) {
      const s = D.IMPROVE.strong[cur];
      main.innerHTML = `<div class="tag mono">MENSAJE ${cur + 1} · SIN IDENTIFICAR AUTORES</div><div class="msg">${esc(s.t)}</div><div class="why2"><b class="c-mint">¿Por qué es fuerte?</b> ${s.note}</div>`;
      crit([1, 1, 1, 1]);
      gsap.fromTo('#shMain .msg', { opacity: 0, y: 20, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: dur(0.8), ease: 'expo.out', clearProps: 'filter,transform' });
      return;
    }
    renderWeak();
  }
  function compose() {
    const parts = D.IMPROVE.slots.map((s, i) => (picks[i] >= 0 ? s.opts[picks[i]].t : null));
    if (parts.every((p) => p === null)) return null;
    return parts.map((p, i) => (p === null ? `<span class="pc">…${D.IMPROVE.slots[i].name.toLowerCase()}…</span>` : `<span class="pc fixed">${esc(p)}</span>`)).join('');
  }
  function renderWeak(why) {
    const html = compose();
    const flags = [0, 0, 0, 0];
    const ok = (i) => picks[i] >= 0 && D.IMPROVE.slots[i].opts[picks[i]].ok;
    flags[0] = ok(1) && ok(2) && ok(3) ? 1 : 0; flags[1] = ok(1) ? 1 : 0; flags[2] = picks[1] >= 0 && picks[2] >= 0 && ok(1) && ok(2) ? 1 : 0; flags[3] = ok(0) ? 1 : 0;
    main.innerHTML = `<div class="tag mono">MENSAJE POR MEJORAR · ELIGE LAS PIEZAS</div><div class="msg">${html ? cap(html.replace(/^(<span[^>]*>)(\S)/, (m, a, b) => a + b.toUpperCase())) : `<span class="pc">${esc(D.IMPROVE.weak)}</span>`}</div>`
      + `<div class="opts">${D.IMPROVE.slots.map((s, si) => `<div class="orow"><span class="slot-h">${si + 1} · ${s.name.toUpperCase()}</span><div class="oc">${s.opts.map((o, oi) => `<button data-s="${si}" data-o="${oi}" class="${picks[si] === oi ? (o.ok ? 'on' : 'bad') : ''}">${o.label || esc(o.t.replace(/^[,. ]+/, ''))}</button>`).join('')}</div></div>`).join('')}</div>`
      + `<div class="why2" aria-live="polite">${why || 'Toca las piezas para reescribir el mensaje con evidencia, prudencia y límite.'}</div>`;
    crit(flags);
    if (flags.every(Boolean)) { toast('¡Mensaje mejorado!'); confetti(...stagePoint(main), 90); }
  }
  tabs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { cur = +b.dataset.i; render(); } });
  main.addEventListener('click', (e) => {
    const b = e.target.closest('.opts button'); if (!b) return;
    const si = +b.dataset.s, oi = +b.dataset.o; picks[si] = oi;
    renderWeak(`<b>${D.IMPROVE.slots[si].opts[oi].ok ? 'Bien.' : 'Revisemos.'}</b> ${D.IMPROVE.slots[si].opts[oi].why}`);
  });
  render();
}

/* ---------- 14 · ticket ---------- */
function initTicket() {
  const A = new Set(), B = new Set();
  const mk = (id, arr, set) => {
    $(id).innerHTML = arr.map((o, i) => `<button class="word" data-i="${i}">${o.t}</button>`).join('');
    $(id).addEventListener('click', (e) => { const w = e.target.closest('.word'); if (!w) return; const i = +w.dataset.i; set.has(i) ? set.delete(i) : set.add(i); sync(); });
  };
  mk('#bankA', D.TICKET_A, A); mk('#bankB', D.TICKET_B, B);
  let fired = false;
  function sync() {
    const fill = (id, arr, set) => { const el = $(id); const t = [...set].sort().map((i) => arr[i].t); el.textContent = t.length ? t.join(' y ') : 'elige una opción'; el.classList.toggle('empty', !t.length); };
    fill('#tA', D.TICKET_A, A); fill('#tB', D.TICKET_B, B);
    const paint = (sel, arr, set) => $$(`${sel} .word`).forEach((w, i) => { const on = set.has(i); w.classList.toggle('on', on && arr[i].ok); w.classList.toggle('bad', on && !arr[i].ok); });
    paint('#bankA', D.TICKET_A, A); paint('#bankB', D.TICKET_B, B);
    const fb = $('#ticketFb'); fb.className = 'ticket-fb glass';
    const bad = [...A].some((i) => !D.TICKET_A[i].ok) || [...B].some((i) => !D.TICKET_B[i].ok);
    const okA = [...A].some((i) => D.TICKET_A[i].ok), okB = [...B].some((i) => D.TICKET_B[i].ok);
    if (bad) { fb.classList.add('warn'); fb.innerHTML = '<b>Revisemos:</b> una recomendación no se sostiene por parecer segura ni por convencer, sino por su evidencia; y reconoce límites para no dar falsas seguridades.'; fired = false; return; }
    if (okA && okB) { fb.classList.add('good'); fb.innerHTML = '<b>¡Eso es!</b> La evidencia respalda y permite verificar; los límites cuidan a las personas y evitan falsas seguridades.'; if (!fired) { fired = true; confetti(...stagePoint($('.ticket')), 90); } return; }
    fired = false; fb.textContent = 'Puedes elegir más de una opción en cada frase.';
  }
  sync();
  $('#selfList').innerHTML = D.SELF.map((t, i) => `<li><button data-i="${i}" aria-pressed="false"><span class="bx">✓</span>${t}</button></li>`).join('');
  $('#selfList').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    b.classList.toggle('on'); b.setAttribute('aria-pressed', b.classList.contains('on'));
    gsap.fromTo($('.bx', b), { scale: 0.4 }, { scale: 1, duration: dur(0.5), ease: 'back.out(3)' });
    if ($$('#selfList button.on').length === D.SELF.length) { confetti(...stagePoint($('#selfList')), 130); toast('¡Lista para el repaso de la clase 22!'); }
  });
}
