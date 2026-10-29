import { gsap } from 'gsap';
import { $, $$, toast, confetti as confettiRaw, motion, rng } from '../../src/util.js';
import * as D from './data.js';

const PAL = ['#e5311f', '#2a4bff', '#12a150', '#7a3cff', '#15120f', '#fffdf6'];
const confetti = (x, y, n) => confettiRaw(x, y, n, PAL);
const CV = { rd: 'var(--rd)', bl: 'var(--bl)', gr: 'var(--gr)', vi: 'var(--vi)', yl: 'var(--yl)' };
const store = {
  get(k, d = '') { try { return localStorage.getItem('c27:' + k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('c27:' + k, v); } catch { /* sin almacenamiento */ } },
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mk = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
function srect(el) {
  const s = $('#stage').getBoundingClientRect(), r = el.getBoundingClientRect(), k = s.width / 1920;
  return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
}
const burst = (el, n = 90) => { const r = srect(el); confetti(r.x + r.w / 2, r.y + r.h / 2, n); };
const shuffle = (arr, rnd) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const seed = () => (Date.now() ^ (Math.random() * 1e9)) >>> 0;
const nWords = (t) => t.trim().split(/\s+/).filter(Boolean).length;
const shake = (el) => { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); };
const say = (el, txt) => { el.textContent = txt; };
const int = (k, d) => { const v = parseInt(store.get(k, String(d)), 10); return Number.isFinite(v) ? v : d; };
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const chip = (cls, t) => `<span class="sg3 ${cls}">${t}</span>`;

// ---- estado compartido entre diapositivas (se guarda lo escrito en este equipo) ----
const S = {
  team: Math.min(6, Math.max(3, int('team', 4))),
  names: Array.from({ length: 6 }, (_, i) => store.get('n' + i) || `Integrante ${i + 1}`),
  st: Array.from({ length: 7 }, (_, i) => int('sv' + i, 1)),
  who: Array.from({ length: 7 }, (_, i) => int('sw' + i, i % 4)),
  task: Array.from({ length: 7 }, (_, i) => int('sk' + i, i % 5)),
  qa: Array.from({ length: 5 }, (_, i) => int('qa' + i, -1)),
  qd: Array.from({ length: 5 }, (_, i) => store.get('qd' + i) === '1'),
  bd: Object.fromEntries(D.CATS.map((c) => [c.id, c.items.map((_, i) => int(`bt_${c.id}${i}`, 0))])),
  gate: D.GATES.map((g, gi) => g.items.map((_, i) => store.get(`gt${gi}_${i}`) === '1')),
  mejora: store.get('mejora'), recordar: store.get('recordar'),
  self: D.SELF.map((f) => int('sf_' + f.id, 1)),
  roles: Array.from({ length: 6 }, (_, i) => int('ro' + i, i % 4)),
  groups: int('groups', 6), gst: Array.from({ length: 8 }, (_, i) => int('gs' + i, 1)),
  order: (store.get('order') || '0,1,2,3,4,5,6,7').split(',').map(Number),
  meta: store.get('meta'), review: false,
};
const refresh = { end: () => {}, roles: () => {}, board: () => {} };
const who = (i) => S.names[i] || `Integrante ${i + 1}`;
const pendQ = () => D.CHECKQ.map((q, i) => ({ i, task: q.task })).filter((x) => S.qa[x.i] > 0);

export function initSlides(deck, three) {
  initCover();
  initRoute();
  initSemaforo(deck, three);
  initQuestions();
  initVocab();
  initControl();
  initC3(deck, three);
  initFeedback();
  initBoard(deck);
  initGate();
  initCross();
  initRehearsal(deck, three);
  initOrder(deck);
  initEnd(deck);
}

// ============ 1 · Portada ============
function initCover() {
  const INFO = ['¿La pregunta central está clara y se puede responder con evidencia?', '¿Cada concepto está definido con palabras propias y sin copiar?', '¿El modelo o proceso se entiende sin imágenes explícitas?', '¿La evidencia corrige el mito sin estigmatizar?', '¿El gráfico tiene título, unidad, año y fuente?', '¿Los mensajes evitan miedo, vergüenza y afirmaciones absolutas?', '¿Hay dos fuentes institucionales y dónde pedir ayuda?'];
  const MARK = ['?', '¶', '✓', '✂', '%', '♥', '§'];
  const fan = $('#cvFan'), info = $('#cvInfo');
  D.SLIDES7.forEach((s, i) => {
    const b = mk('button', 'pl', `<span class="no">${s.n}</span><span class="nm">${s.t}</span><span class="mk">${MARK[i]}</span>`);
    b.style.setProperty('--i', i); b.setAttribute('role', 'listitem'); b.setAttribute('aria-label', `Diapositiva ${s.n}: ${s.t}. ${INFO[i]}`);
    const on = () => { $$('.pl', fan).forEach((x) => x.classList.toggle('on', x === b)); info.textContent = `Diap. ${s.n} · ${s.t}: ${INFO[i]}`; };
    b.addEventListener('mouseenter', on); b.addEventListener('focus', on); b.addEventListener('click', on);
    fan.appendChild(b);
  });
}

// ============ 2 · Ruta ============
function initRoute() {
  const R = [['Revisamos cuánto falta', 'Semáforo de avance y meta del grupo.'], ['Distribuimos tareas pendientes', 'Tareas distintas: que no todos hagan lo mismo.'], ['Terminamos y verificamos', 'Bloque de finalización y punto de control docente.'], ['Aplicamos revisión 3C', 'Correcto, Claro, Cambiar: una mejora prioritaria.'], ['Ensayamos y registramos la última mejora', '3 a 4 minutos, todos participan.']];
  const ol = $('#routeSteps');
  R.forEach(([t, d], i) => {
    const li = mk('li'); const b = mk('button', '', `<i>${i + 1}</i><div><b>${t}</b><span>${d}</span></div>`); b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => { const v = !b.classList.contains('done'); b.classList.toggle('done', v); b.setAttribute('aria-pressed', String(v)); });
    li.appendChild(b); ol.appendChild(li);
  });
  const el = $('#routeTime');
  Object.values(D.PHASES).forEach((p) => {
    const s = mk('div', 'seg', `<b>${p.min}'</b><span>${p.name}</span>`); s.style.setProperty('--w', p.min); s.style.setProperty('--c', p.color); s.title = `${p.name}: ${p.min} min`; el.appendChild(s);
  });
}

// ============ 3 · Semáforo de avance y meta ============
function initSemaforo(deck, three) {
  const rows = $('#semRows'), txt = $('#semTxt');
  const sbtn = [], whoSel = [], taskSel = [];
  D.SLIDES7.forEach((s, i) => {
    const r = mk('div', 'sr', `<span class="n">${s.n}</span><b>${s.t}</b>`);
    D.AVANCE.forEach((a, k) => { const b = mk('button', `sb s${k}`, a.s); b.title = a.t; b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', () => setState(i, k)); r.appendChild(b); (sbtn[i] ||= []).push(b); });
    const ws = mk('select'); ws.setAttribute('aria-label', `Responsable de la diapositiva ${s.n}`); ws.addEventListener('change', () => { S.who[i] = +ws.value; store.set('sw' + i, S.who[i]); paint(); });
    const ts = mk('select'); ts.setAttribute('aria-label', `Tarea de la diapositiva ${s.n}`); ts.innerHTML = D.TAREAS.map((t, k) => `<option value="${k}">${t}</option>`).join('');
    ts.addEventListener('change', () => { S.task[i] = +ts.value; store.set('sk' + i, S.task[i]); paint(); });
    r.appendChild(ws); r.appendChild(ts); rows.appendChild(r); whoSel.push(ws); taskSel.push(ts);
  });
  function setState(i, k) { S.st[i] = k; store.set('sv' + i, k); paint(); }
  const overall = () => (S.st.includes(2) ? 2 : S.st.every((x) => x === 0) ? 0 : 1);
  function paint() {
    D.SLIDES7.forEach((_, i) => {
      sbtn[i].forEach((b, k) => { b.classList.toggle('on', S.st[i] === k); b.setAttribute('aria-pressed', String(S.st[i] === k)); });
      whoSel[i].innerHTML = S.names.slice(0, S.team).map((n, k) => `<option value="${k}">${esc(n)}</option>`).join(''); whoSel[i].value = String(Math.min(S.who[i], S.team - 1));
      taskSel[i].value = String(S.task[i]);
      whoSel[i].disabled = taskSel[i].disabled = S.st[i] === 0;
    });
    three.tw.setStates(S.st); const o = overall(); three.tw.setOverall(o);
    const pend = S.st.map((v, i) => (v ? i : -1)).filter((i) => i >= 0), n = pend.length;
    let m = o === 0 ? 'Verde: las siete diapositivas están completas. Usa el tiempo para verificar y ensayar.'
      : o === 1 ? `Amarillo: faltan uno o dos elementos (${n} diapositiva${n === 1 ? '' : 's'} por completar).`
        : `Rojo: falta contenido importante en ${S.st.filter((v) => v === 2).length} diapositiva(s). Empieza por ahí.`;
    if (n >= 2) {
      const tasks = new Set(pend.map((i) => S.task[i])), people = new Set(pend.map((i) => Math.min(S.who[i], S.team - 1)));
      if (tasks.size === 1) m += ' Todos tienen la misma tarea: reparte tareas distintas.';
      else if (people.size === 1) m += ' Una sola persona tiene todos los pendientes: reparte.';
      else m += ' Reparto equilibrado.';
    }
    say(txt, m);
  }
  three.onTowerPick = (i) => setState(i, (S.st[i] + 1) % 3);
  // meta concreta
  const meta = $('#metaTxt'), chk = $('#metaChk');
  meta.value = S.meta;
  const checkMeta = () => {
    const t = meta.value.trim(); S.meta = meta.value; store.set('meta', meta.value);
    if (!t) { chk.innerHTML = ''; return; }
    const w = nWords(t), first = t.split(/\s+/)[0];
    chk.innerHTML = chip(D.META_VERBS.test(first) ? 'g' : 'y', D.META_VERBS.test(first) ? 'Empieza con un verbo' : 'Empieza con un verbo (terminar, citar…)')
      + chip(/\d|diapositiva|siete|todas|cada/i.test(t) ? 'g' : 'y', /\d|diapositiva|siete|todas|cada/i.test(t) ? 'Se puede comprobar' : 'Di qué diapositivas o cuántas')
      + chip(w <= 25 ? 'g' : 'r', `${w} palabras${w <= 25 ? '' : ' · muy larga'}`);
  };
  meta.addEventListener('input', checkMeta); checkMeta();
  // integrantes
  const names = $('#teamNames');
  const inputs = Array.from({ length: 6 }, (_, i) => { const inp = mk('input'); inp.type = 'text'; inp.maxLength = 16; inp.value = S.names[i]; inp.setAttribute('aria-label', `Integrante ${i + 1}`); inp.addEventListener('input', () => { S.names[i] = inp.value.trim() || `Integrante ${i + 1}`; store.set('n' + i, inp.value.trim()); paint(); refresh.roles(); }); names.appendChild(inp); return inp; });
  const team = (n) => { S.team = Math.max(3, Math.min(6, n)); store.set('team', S.team); $('#teamN').textContent = S.team; inputs.forEach((inp, i) => { inp.hidden = i >= S.team; }); paint(); refresh.roles(); };
  $('#teamMinus').onclick = () => team(S.team - 1); $('#teamPlus').onclick = () => team(S.team + 1);
  team(S.team);
  deck.hooks.enter[2] = () => { three.live.tw = true; three.tw.resize(); paint(); };
  deck.hooks.leave[2] = () => { three.live.tw = false; };
}

// ============ 4 · Preguntas de autocontrol ============
function initQuestions() {
  const list = $('#qList'), todo = $('#qTodo');
  const optBtns = D.CHECKQ.map((q, i) => {
    const r = mk('div', 'qr', `<p><i>${i + 1}</i>${esc(q.q)}</p><div class="opts" role="group" aria-label="Respuesta a la pregunta ${i + 1}"></div>`);
    const bs = q.opts.map((o, k) => { const b = mk('button', `opt k${k}`, esc(o)); b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', () => { S.qa[i] = k; store.set('qa' + i, k); paint(); refresh.board(); }); r.querySelector('.opts').appendChild(b); return b; });
    list.appendChild(r); return bs;
  });
  function paint() {
    optBtns.forEach((bs, i) => bs.forEach((b, k) => { b.classList.toggle('on', S.qa[i] === k); b.setAttribute('aria-pressed', String(S.qa[i] === k)); }));
    const pend = pendQ(), answered = S.qa.filter((x) => x >= 0).length;
    say($('#qCount'), answered === 0 ? 'Responde las cinco preguntas mirando tu PPT.' : `${answered} de 5 respondidas · ${pend.length} pendiente${pend.length === 1 ? '' : 's'}`);
    todo.innerHTML = '';
    if (answered === 5 && !pend.length) { todo.appendChild(mk('li', 'done', '<i class="bx"></i><span>Sin pendientes: pasa a verificar con el control científico.</span>')); return; }
    pend.forEach(({ i, task }) => {
      const li = mk('li', S.qd[i] ? 'done' : '', `<i class="bx"></i><span><b>${i + 1}.</b> ${esc(task)}</span>`); li.tabIndex = 0;
      const t = () => { S.qd[i] = !S.qd[i]; store.set('qd' + i, S.qd[i] ? '1' : '0'); li.classList.toggle('done', S.qd[i]); refresh.board(); };
      li.addEventListener('click', t); li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
      todo.appendChild(li);
    });
  }
  paint();
}

// ============ 5 · Vocabulario ============
function initVocab() {
  const rnd = rng(seed()), grid = $('#vGrid');
  let solved = 0;
  shuffle(D.VOCAB, rnd).forEach((v) => {
    const card = mk('div', 'vc', `<p>${esc(v.s).replace('____', '<u>&nbsp;</u>')}</p><div class="opts"></div><span class="use"></span>`);
    shuffle([v.t, ...v.alt], rnd).forEach((o) => {
      const b = mk('button', 'opt', esc(o));
      b.addEventListener('click', () => {
        if (card.classList.contains('ok')) return;
        if (o === v.t) {
          card.classList.add('ok'); b.classList.add('ok'); $$('.opt', card).forEach((x) => { x.disabled = true; });
          card.querySelector('u').textContent = v.t; card.querySelector('.use').textContent = `En el taller: ${v.use}`;
          solved++; $('#vProg').textContent = `${solved} / 8`; $('#vBar').style.width = `${(solved / 8) * 100}%`;
          if (solved === 8) burst($('#vGrid'), 120);
        } else { b.classList.add('bad'); shake(card); setTimeout(() => b.classList.remove('bad'), 700); }
      });
      card.querySelector('.opts').appendChild(b);
    });
    grid.appendChild(card);
  });
}

// ============ 6 · Control científico final ============
function initControl() {
  const ul = $('#ctlFrags'), btns = $('#ctlBtns'), fb = $('#ctlFb');
  let sel = null, done = 0;
  const frag = {};
  shuffle(D.BORRADOR, rng(seed())).forEach((b) => {
    const li = mk('li'); const btn = mk('button', '', esc(b.txt)); btn.dataset.id = b.id; frag[b.id] = btn;
    btn.addEventListener('click', () => { if (btn.classList.contains('done')) return; sel = b.id; $$('#ctlFrags button').forEach((x) => x.classList.toggle('sel', x === btn)); $('#ctlStep').textContent = '2. ¿QUÉ CONTROL FALLA AQUÍ?'; say(fb, 'Elige el control que corresponde a este fragmento.'); });
    li.appendChild(btn); ul.appendChild(li);
  });
  D.CONTROLES.forEach((c) => {
    const b = mk('button', '', `${c.t}<small>${c.q}</small>`);
    b.addEventListener('click', () => {
      if (!sel) { say(fb, 'Primero elige un fragmento subrayado.'); shake($('.ctl-fb')); return; }
      const f = D.BORRADOR.find((x) => x.id === sel);
      if (f.ctl === c.id) {
        frag[sel].classList.remove('sel'); frag[sel].classList.add('done'); frag[sel].insertAdjacentHTML('beforeend', `<span class="tg">✓ ${c.t.toUpperCase()}</span>`);
        say(fb, `Correcto (${c.t}). ${f.fix}`); sel = null; done++; $('#ctlProg').textContent = `${done} de 5 fragmentos corregidos`; $('#ctlStep').textContent = '1. ELIGE UN FRAGMENTO';
        if (done === 5) { $('#ctlStamp').hidden = false; say(fb, 'Los cinco controles aplicados. Recuerda: un solo error importante basta para no pasar al ensayo.'); burst($('.ctl-draft'), 110); }
      } else { shake(frag[sel]); say(fb, `Ese control (${c.t}) pregunta «${c.q}». Vuelve a leer el fragmento: ¿es lo que falla aquí?`); }
    });
    btns.appendChild(b);
  });
}

// ============ 7 · Técnica 3C ============
function initC3(deck, three) {
  const list = $('#c3Notes'), bt = $('#c3Btns'), fb = $('#c3Fb');
  let sel = null, sorted = 0, cardOf = {}, phase = 1;
  const items = shuffle(D.C3_NOTES.map((n, i) => ({ ...n, i })), rng(seed()));
  const nb = {};
  items.forEach((n) => {
    const li = mk('li'); const b = mk('button', '', esc(n.t)); nb[n.i] = b;
    b.addEventListener('click', () => {
      if (phase === 1) { if (b.dataset.bin) return; sel = n.i; $$('#c3Notes button').forEach((x) => x.classList.toggle('sel', x === b)); }
      else if (n.bin === 2) {
        if (n.best) { $$('#c3Notes button').forEach((x) => x.classList.remove('star')); b.classList.add('star'); three.bi.setPriority(cardOf[n.i]); say(fb, D.C3_PRIORITY); burst(fb, 90); }
        else { shake(b); say(fb, 'Sirve, pero hay otra mejora que pesa más: ¿cuál corrige un error de exactitud?'); }
      }
    });
    li.appendChild(b); list.appendChild(li);
  });
  const binBtns = D.C3.map((c, k) => {
    const b = mk('button', c.c, `${c.id}<small>${c.q}</small>`);
    b.addEventListener('click', () => {
      if (sel === null) { say(fb, 'Primero toca un comentario.'); return; }
      const n = D.C3_NOTES[sel];
      if (n.bin === k) {
        const nbtn = nb[sel]; nbtn.dataset.bin = k; nbtn.classList.remove('sel'); nbtn.classList.add('b' + k); nbtn.insertAdjacentHTML('beforeend', `<small>→ ${c.id.toUpperCase()}</small>`);
        cardOf[sel] = three.bi.addCard(k); sel = null; sorted++;
        say(fb, `Bien: va en «${c.id}».`);
        if (sorted === 6) { phase = 2; $('#c3Step').textContent = '2. TOCA LA MEJORA PRIORITARIA DE «CAMBIAR»'; say(fb, 'Todo clasificado. Ahora elige UNA sola mejora prioritaria entre las de «Cambiar».'); binBtns.forEach((x) => { x.disabled = true; }); }
      } else { const nbtn = nb[sel]; shake(nbtn); say(fb, `Revisa: «${c.id}» es ${c.q.toLowerCase()}.`); }
    });
    bt.appendChild(b); return b;
  });
  const reset = mk('button', 'btn ghost sm', 'Reiniciar'); reset.style.justifySelf = 'start';
  reset.onclick = () => { three.bi.reset(); sorted = 0; phase = 1; sel = null; cardOf = {}; $('#c3Step').textContent = '1. TOCA UN COMENTARIO Y ELIGE SU CAJA'; say(fb, ''); binBtns.forEach((x) => { x.disabled = false; }); Object.values(nb).forEach((b) => { delete b.dataset.bin; b.className = ''; b.querySelector('small')?.remove(); }); };
  $('.c3-right').appendChild(reset);
  deck.hooks.enter[6] = () => { three.live.bi = true; three.bi.resize(); };
  deck.hooks.leave[6] = () => { three.live.bi = false; };
}

// ============ 8 · Retroalimentación útil ============
function initFeedback() {
  const rnd = rng(seed());
  let idx = 0; const solved = D.VAGUE.map(() => false);
  const opts = $('#fbOpts'), res = $('#fbRes'), next = $('#fbNext');
  function show() {
    const v = D.VAGUE[idx];
    say($('#fbTag'), `COMENTARIO VAGO ${idx + 1} DE ${D.VAGUE.length}`); say($('#fbVague'), `«${v.v}»`); say(res, ''); opts.innerHTML = '';
    next.disabled = !solved[idx] || idx === D.VAGUE.length - 1; next.textContent = idx === D.VAGUE.length - 1 ? 'Completo ✓' : 'Siguiente →';
    shuffle(v.o, rnd).forEach((o) => {
      const b = mk('button', 'opt', esc(o.t));
      b.addEventListener('click', () => {
        if (solved[idx]) return;
        say(res, o.fb); b.classList.add(o.k === 2 ? 'ok' : 'bad');
        if (o.k === 2) { solved[idx] = true; $$('.opt', opts).forEach((x) => { x.disabled = true; }); next.disabled = idx === D.VAGUE.length - 1; if (solved.every(Boolean)) { res.textContent += ' ¡Las cuatro reescrituras útiles!'; burst(res, 90); } }
        else shake(b);
      });
      opts.appendChild(b);
    });
  }
  next.onclick = () => { if (idx < D.VAGUE.length - 1) { idx++; show(); } };
  $('#fbReset').onclick = () => { idx = 0; solved.fill(false); show(); };
  show();
  const mine = $('#fbMine'), chk = $('#fbChk');
  mine.addEventListener('input', () => {
    const t = mine.value.trim(); if (!t) { chk.innerHTML = ''; return; }
    const w = nWords(t), where = /diap(ositiva)?\.?\s*\d/i.test(t), what = D.FB_VERBS.test(t), why = /(?<![a-záéíóúñ])(para|porque|así|ya que|de modo)(?![a-záéíóúñ])/i.test(t);
    chk.innerHTML = chip(where ? 'g' : 'y', where ? 'Dónde: indica la diapositiva' : 'Falta dónde (diap. N)') + chip(what ? 'g' : 'y', what ? 'Qué: propone un cambio' : 'Falta qué cambiar (verbo)') + chip(why ? 'g' : 'y', why ? 'Para qué: explica el motivo' : 'Falta para qué') + chip(w <= 35 ? 'g' : 'y', `${w} palabras`);
  });
}

// ============ 9 · Bloque de finalización ============
function initBoard(deck) {
  const wrap = $('#bdCats'), extra = $('#bdExtra');
  const btns = {};
  D.CATS.forEach((c) => {
    const sh = mk('div', 'sheet cat', `<span class="stab ${c.c === 'yl' ? 'dark' : ''}" style="--c:${CV[c.c]}">${c.t.toUpperCase()}</span>`);
    c.items.forEach((it, i) => {
      const row = mk('div', 'tk', `<span>${esc(it)}</span>`); const b = mk('button', 'st'); b.addEventListener('click', () => { S.bd[c.id][i] = (S.bd[c.id][i] + 1) % 3; store.set(`bt_${c.id}${i}`, S.bd[c.id][i]); paint(); });
      row.appendChild(b); sh.appendChild(row); btns[`${c.id}${i}`] = b;
    });
    wrap.appendChild(sh);
  });
  function paint() {
    let sum = 0;
    D.CATS.forEach((c) => c.items.forEach((_, i) => { const v = S.bd[c.id][i], b = btns[`${c.id}${i}`]; b.className = `st s${v}`; b.textContent = D.ST_TASK[v]; sum += v; }));
    const pend = pendQ(), pq = pend.filter((p) => !S.qd[p.i]).length;
    const pct = Math.round((sum / 24) * 100);
    sum += 0; $('#bdPct').textContent = pct + '%'; $('#bdRing').style.strokeDashoffset = String(176 * (1 - pct / 100));
    extra.innerHTML = '';
    if (!pend.length) extra.appendChild(mk('li', 'done', '<i class="bx"></i><span>No hay pendientes extra (responde las preguntas iniciales).</span>'));
    pend.forEach(({ i, task }) => {
      const li = mk('li', S.qd[i] ? 'done' : '', `<i class="bx"></i><span>${esc(task)}</span>`); li.tabIndex = 0;
      const t = () => { S.qd[i] = !S.qd[i]; store.set('qd' + i, S.qd[i] ? '1' : '0'); paint(); };
      li.addEventListener('click', t); li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
      extra.appendChild(li);
    });
    const left = 12 - Object.values(S.bd).flat().filter((v) => v === 2).length;
    say($('#bdMsg'), left === 0 && pq === 0 ? 'Tablero completo: pasa al punto de control docente.' : `Faltan ${left} tarea${left === 1 ? '' : 's'} del tablero${pq ? ` y ${pq} pendiente${pq === 1 ? '' : 's'} de las preguntas` : ''}.`);
  }
  refresh.board = paint; paint();
  deck.hooks.enter[8] = paint;
}

// ============ 10 · Punto de control docente ============
function initGate() {
  const grid = $('#gateGrid'), stamp = $('#gStamp'), msg = $('#gMsg'), ask = $('#gAsk');
  const sheets = D.GATES.map((g, gi) => {
    const sh = mk('div', 'sheet gate', `<span class="stab" style="--c:${CV[g.c]}">${g.t.toUpperCase()}</span><span class="lock" aria-hidden="true">🔒</span>`);
    const ul = mk('ul', 'todo');
    g.items.forEach((it, i) => {
      const li = mk('li', S.gate[gi][i] ? 'done' : '', `<i class="bx"></i><span>${esc(it)}</span>`); li.tabIndex = 0; li.setAttribute('role', 'checkbox'); li.setAttribute('aria-checked', String(S.gate[gi][i]));
      const t = () => { S.gate[gi][i] = !S.gate[gi][i]; store.set(`gt${gi}_${i}`, S.gate[gi][i] ? '1' : '0'); li.classList.toggle('done', S.gate[gi][i]); li.setAttribute('aria-checked', String(S.gate[gi][i])); paint(); };
      li.addEventListener('click', t); li.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); t(); } });
      ul.appendChild(li);
    });
    sh.appendChild(ul); grid.appendChild(sh); return sh;
  });
  let asked = false;
  function paint() {
    const miss = D.GATES.map((g, gi) => ({ t: g.t, n: S.gate[gi].filter((x) => !x).length }));
    sheets.forEach((sh, gi) => { const ok = miss[gi].n === 0; sh.classList.toggle('ok', ok); sh.querySelector('.lock').textContent = ok ? '🔓' : '🔒'; });
    const all = miss.every((m) => m.n === 0);
    if (!all) asked = false;
    ask.disabled = !all;
    stamp.className = 'stamp' + (all ? ' ok' : '');
    stamp.textContent = asked ? 'EN REVISIÓN DOCENTE' : all ? 'LISTO PARA EL DOCENTE' : 'PENDIENTE';
    say(msg, asked ? 'El docente confirma con la pauta. Si hay observaciones, vuelves al tablero. No se aprueba para ensayo con fuentes faltantes, errores científicos importantes o lenguaje estigmatizante.'
      : all ? 'Autochequeo completo. Pide la revisión: el sello de «aprobado para ensayo» lo da el docente con la pauta.'
        : `Falta: ${miss.filter((m) => m.n).map((m) => `${m.t} (${m.n})`).join(', ')}. No se pasa al ensayo con fuentes faltantes, errores científicos importantes o lenguaje estigmatizante.`);
  }
  ask.onclick = () => { asked = true; paint(); burst(stamp, 60); };
  paint();
}

// ============ 11 · Revisión cruzada y copia final ============
function initCross() {
  const ok = $('#crOk'), cl = $('#crClear'), ch = $('#crChg'), chk = $('#crChk');
  let pri = 0;
  const rows = [0, 1, 2].map((i) => {
    const r = mk('div', 'row' + (i === 0 ? ' pri' : ''), `<button aria-label="Marcar como mejora prioritaria" aria-pressed="${i === 0}">${i === 0 ? '★' : '☆'}</button>`);
    const inp = mk('input'); inp.type = 'text'; inp.maxLength = 160; inp.placeholder = i === 0 ? 'Ej.: En la diap. 5 cambia «todos» por «en este caso ficticio se observa…» para no exagerar.' : 'Otra idea (opcional, no es la prioritaria)';
    inp.setAttribute('aria-label', `Cambiar ${i + 1}`); r.appendChild(inp); ch.appendChild(r);
    r.querySelector('button').addEventListener('click', () => { pri = i; paint(); });
    inp.addEventListener('input', paint); return { r, inp };
  });
  function paint() {
    rows.forEach(({ r }, i) => { r.classList.toggle('pri', i === pri); const b = r.querySelector('button'); b.textContent = i === pri ? '★' : '☆'; b.setAttribute('aria-pressed', String(i === pri)); });
    const t = rows[pri].inp.value.trim();
    const where = /diap(ositiva)?\.?\s*\d/i.test(t), what = D.FB_VERBS.test(t), why = /(?<![a-záéíóúñ])(para|porque|así|ya que|de modo)(?![a-záéíóúñ])/i.test(t);
    chk.innerHTML = chip(ok.value.trim() ? 'g' : 'y', ok.value.trim() ? 'Correcto registrado' : 'Falta «Correcto»') + chip(cl.value.trim() ? 'g' : 'y', cl.value.trim() ? 'Claro registrado' : 'Falta «Claro»')
      + (t ? chip(where ? 'g' : 'y', where ? 'Dónde' : 'Falta dónde') + chip(what ? 'g' : 'y', what ? 'Qué' : 'Falta qué') + chip(why ? 'g' : 'y', why ? 'Para qué' : 'Falta para qué') : chip('y', 'Escribe la mejora prioritaria'));
  }
  ok.addEventListener('input', paint); cl.addEventListener('input', paint); paint();
  // nombre estandarizado
  const tema = $('#nmTema'), grupo = $('#nmGrupo');
  tema.innerHTML = D.TEMAS.map((t) => `<option>${t}</option>`).join(''); grupo.innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => `<option value="${g}">${g}</option>`).join('');
  const name = () => `AutocuidadoInformado_${tema.value}_G${grupo.value}_vFinal.pptx`;
  const upd = () => { const n = name(); $('#nmOut').textContent = n; say($('#nmFb'), D.NAME_RE.test(n) ? 'Nombre válido: sin espacios, tildes ni caracteres raros. Guarda esta copia además del archivo de trabajo.' : 'Revisa el nombre: sin espacios ni tildes.'); };
  tema.onchange = upd; grupo.onchange = upd; upd();
  $('#nmCopy').onclick = () => { try { navigator.clipboard.writeText(name()).then(() => toast('Nombre copiado'), () => toast('Selecciona y copia el nombre')); } catch { toast('Selecciona y copia el nombre'); } };
}

// ============ 12 · Ensayo de 3 a 4 minutos ============
function initRehearsal(deck, three) {
  const spk = $('#reSpk'), go = $('#reGo'), res = $('#reRes'), demo = $('#reDemo');
  let run = false, t = 0, cur = 0, per = [], segs = [], timer = null, lastRebuild = 0;
  const reset = () => { run = false; t = 0; cur = 0; per = Array(S.team).fill(0); segs = [{ who: 0, from: 0, to: 0 }]; clearInterval(timer); go.textContent = 'Iniciar ensayo'; say($('#reTime'), '00:00'); say($('#reState'), 'Listo para ensayar'); say(res, 'Cuando terminen, aquí aparecerá el balance: tiempo total y participación.'); sync(); drawBtns(); };
  const color = (i) => D.MEMBER_COLORS[i % D.MEMBER_COLORS.length];
  function drawBtns() {
    spk.innerHTML = '';
    for (let i = 0; i < S.team; i++) {
      const b = mk('button', i === cur ? 'on' : '', `<i style="--c:${color(i)}"></i><span>${esc(who(i))}<small>${mmss(per[i] || 0)}</small></span>`); b.setAttribute('aria-pressed', String(i === cur));
      b.addEventListener('click', () => { if (i === cur) return; segs.at(-1).to = t; segs.push({ who: i, from: t, to: t }); cur = i; sync(true); drawBtns(); }); spk.appendChild(b);
    }
  }
  function sync(rebuild) {
    const list = segs.map((s) => ({ from: s.from, to: s.to, color: color(s.who) }));
    three.rg.setTime(t); if (rebuild || t - lastRebuild > 2) { three.rg.setSegments(list, t); lastRebuild = t; }
  }
  function tick() {
    const dt = 0.1 * (demo.checked ? 10 : 1); t += dt; per[cur] = (per[cur] || 0) + dt; segs.at(-1).to = t;
    say($('#reTime'), mmss(t)); say($('#reState'), `Habla: ${who(cur)}${t > 240 ? ' · ¡pasó de 4 min!' : t >= 180 ? ' · zona de 3 a 4 min' : ''}`);
    spk.querySelectorAll('small').forEach((s, i) => { s.textContent = mmss(per[i] || 0); }); sync();
    if (t >= 300) end();
  }
  go.onclick = () => {
    if (run) { run = false; clearInterval(timer); go.textContent = 'Reanudar'; say($('#reState'), 'En pausa'); return; }
    if (t === 0 && per.length !== S.team) reset();
    run = true; go.textContent = 'Pausar'; timer = setInterval(tick, 100);
  };
  function end() {
    if (!t) { reset(); return; }
    run = false; clearInterval(timer); go.textContent = 'Iniciar ensayo'; segs.at(-1).to = t; sync(true);
    const tot = t, mx = Math.max(...per), low = per.filter((s) => s < 15).length;
    const parts = [];
    parts.push(tot < 180 ? `Duración ${mmss(tot)}: faltó tiempo; agreguen un ejemplo o expliquen con más calma.` : tot <= 240 ? `Duración ${mmss(tot)}: dentro de lo esperado (3 a 4 minutos).` : `Duración ${mmss(tot)}: se pasaron; acorten la parte más larga.`);
    parts.push(low ? `${low} integrante${low === 1 ? '' : 's'} casi no habló (menos de 15 s): repartan la palabra.` : 'Todos participaron.');
    if (mx / tot > 0.5) parts.push('Una persona habló más de la mitad del tiempo.');
    say(res, parts.join(' ')); say($('#reState'), 'Ensayo terminado');
    if (tot >= 180 && tot <= 240 && !low && mx / tot <= 0.5) burst(res, 100);
  }
  $('#reEnd').onclick = end;
  const ctl = $('#reCtl');
  D.CONTROL_ENSAYO.forEach((c, i) => { const li = mk('li', store.get('rc' + i) === '1' ? 'done' : '', `<i class="bx"></i><span>${esc(c)}</span>`); li.tabIndex = 0; const f = () => { const v = !li.classList.contains('done'); li.classList.toggle('done', v); store.set('rc' + i, v ? '1' : '0'); }; li.addEventListener('click', f); li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(); } }); ctl.appendChild(li); });
  refresh.roles = () => { if (!run && t === 0) { per = Array(S.team).fill(0); drawBtns(); } };
  reset();
  deck.hooks.enter[11] = () => { three.live.rg = true; three.rg.resize(); if (!run && t === 0) { per = Array(S.team).fill(0); cur = 0; drawBtns(); } sync(true); };
  deck.hooks.leave[11] = () => { three.live.rg = false; if (run) { run = false; clearInterval(timer); go.textContent = 'Reanudar'; } };
}

// ============ 13 · Estado final y orden ============
function initOrder(deck) {
  const rows = $('#orRows'), roles = $('#roRows');
  const grp = (n) => { S.groups = Math.max(3, Math.min(8, n)); store.set('groups', S.groups); $('#grN').textContent = S.groups; paint(); };
  $('#grMinus').onclick = () => grp(S.groups - 1); $('#grPlus').onclick = () => grp(S.groups + 1);
  const ord = () => { const o = S.order.filter((x) => x < S.groups); for (let i = 0; i < S.groups; i++) if (!o.includes(i)) o.push(i); return o; };
  function paint() {
    const o = ord(); rows.innerHTML = '';
    o.forEach((g, pos) => {
      const r = mk('div', `or-row s${S.gst[g]}`, `<span class="n">${pos + 1}</span><b>Grupo ${g + 1}</b>`);
      const sel = mk('select'); sel.setAttribute('aria-label', `Estado del grupo ${g + 1}`); sel.innerHTML = D.ESTADOS.map((e, k) => `<option value="${k}">${e}</option>`).join(''); sel.value = String(S.gst[g]);
      sel.addEventListener('change', () => { S.gst[g] = +sel.value; store.set('gs' + g, S.gst[g]); paint(); });
      const mv = mk('div', 'mv', '<button aria-label="Subir">↑</button><button aria-label="Bajar">↓</button>');
      const [up, dn] = mv.children;
      const swap = (d) => { const j = pos + d; if (j < 0 || j >= o.length) return; [o[pos], o[j]] = [o[j], o[pos]]; S.order = o; store.set('order', o.join(',')); paint(); };
      up.onclick = () => swap(-1); dn.onclick = () => swap(1);
      r.appendChild(sel); r.appendChild(mv); rows.appendChild(r);
    });
    const c = [0, 1, 2].map((k) => o.filter((g) => S.gst[g] === k).length);
    say($('#orSum'), `${c[0]} listo${c[0] === 1 ? '' : 's'} · ${c[1]} casi listo${c[1] === 1 ? '' : 's'} · ${c[2]} con corrección importante.${c[2] ? ' Sugerencia (orientativa): los grupos con corrección importante reciben apoyo antes de presentar; el orden lo decide el docente.' : ''}`);
  }
  function paintRoles() {
    roles.innerHTML = '';
    for (let i = 0; i < S.team; i++) {
      const r = mk('div', 'ro', `<span>${esc(who(i))}</span>`); const sel = mk('select'); sel.setAttribute('aria-label', `Rol de ${who(i)}`);
      sel.innerHTML = D.ROLES.map((e, k) => `<option value="${k}">${e}</option>`).join(''); sel.value = String(S.roles[i] % 4);
      sel.addEventListener('change', () => { S.roles[i] = +sel.value; store.set('ro' + i, S.roles[i]); paintRoles(); }); r.appendChild(sel); roles.appendChild(r);
    }
    const rs = Array.from({ length: S.team }, (_, i) => S.roles[i] % 4), timers = rs.filter((x) => x === 1).length, miss = [0, 1, 2, 3].filter((k) => !rs.includes(k));
    say($('#roMsg'), timers === 0 ? 'Falta quien controle el tiempo.' : timers > 1 ? 'Solo una persona controla el tiempo.' : miss.length ? `Roles sin asignar: ${miss.map((k) => D.ROLES[k].toLowerCase()).join(', ')}. (Con menos de 4 integrantes algunos roles se comparten.)` : 'Todos los roles de la feria están cubiertos.');
  }
  grp(S.groups); paintRoles();
  const prev = refresh.roles; refresh.roles = () => { prev(); paintRoles(); };
  deck.hooks.enter[12] = () => { paint(); paintRoles(); };
}

// ============ 14 · Ticket y aviso ============
function initEnd(deck) {
  $('#tkNotice').textContent = D.NEXT_NOTICE;
  const mkChips = (id, list, key, target) => {
    const el = $(id); const bs = list.map((t) => { const b = mk('button', S[key] === t ? 'on' : '', esc(t)); b.setAttribute('aria-pressed', String(S[key] === t)); b.addEventListener('click', () => { S[key] = S[key] === t ? '' : t; store.set(key, S[key]); bs.forEach((x, k) => { const on = list[k] === S[key]; x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); }); $(target).textContent = S[key] || '…'; summary(); }); el.appendChild(b); return b; });
    $(target).textContent = S[key] || '…';
  };
  mkChips('#tkAc', D.MEJORAS, 'mejora', '#tkA'); mkChips('#tkBc', D.RECORDAR, 'recordar', '#tkB');
  const LV = ['Aún no', 'En camino', 'Logrado'], selfEl = $('#tkSelf');
  D.SELF.forEach((f, i) => {
    const row = mk('div', 'tkr', `<span>${f.t}</span>`); row.style.setProperty('--c', CV[f.c]);
    LV.forEach((l, k) => { const b = mk('button', S.self[i] === k ? 'on' : '', l); b.setAttribute('aria-pressed', String(S.self[i] === k)); b.addEventListener('click', () => { S.self[i] = k; store.set('sf_' + f.id, k); $$('button', row).forEach((x, j) => { x.classList.toggle('on', j === k); x.setAttribute('aria-pressed', String(j === k)); }); summary(); }); row.appendChild(b); });
    selfEl.appendChild(row);
  });
  const gateTxt = () => { const n = S.gate.flat().filter(Boolean).length; return `${n} de 9 controles del punto de control`; };
  function summary() {
    const lg = S.self.filter((v) => v === 2).length, weak = D.SELF.filter((_, i) => S.self[i] < 2).map((f) => f.t.toLowerCase());
    const bd = Object.values(S.bd).flat().filter((v) => v === 2).length;
    $('#tkSum').innerHTML = `<b>Mejora incorporada:</b> ${esc(S.mejora || 'sin elegir')}.<br><b>Recordar en el ensayo:</b> ${esc(S.recordar || 'sin elegir')}.<br><b>Tablero:</b> ${bd} de 12 tareas listas · ${gateTxt()}.<br><b>Criterios logrados:</b> ${lg} de 4${weak.length ? ` · por reforzar: ${esc(weak.join('; '))}` : ''}.`;
  }
  refresh.end = summary;
  $('#tkDl').onclick = () => {
    const bd = D.CATS.map((c) => `  ${c.t}: ${S.bd[c.id].map((v) => D.ST_TASK[v]).join(' / ')}`).join('\n');
    const roles = Array.from({ length: S.team }, (_, i) => `  ${who(i)}: ${D.ROLES[S.roles[i] % 4]}`).join('\n');
    const self = D.SELF.map((f, i) => `  ${f.t}: ${LV[S.self[i]]}`).join('\n');
    const txt = `CLASE 27 · Taller editorial y ensayo científico\nRegistro del grupo (ilustrativo; se guarda solo en este equipo)\n\nMeta de la sesión: ${S.meta || '(sin escribir)'}\nLa mejora más importante que incorporamos fue: ${S.mejora || '(sin elegir)'}\nDurante el ensayo debemos recordar: ${S.recordar || '(sin elegir)'}\n\nTablero:\n${bd}\n${gateTxt()}\n\nRoles en la feria:\n${roles}\n\nAutoevaluación (criterios del plan):\n${self}\n\n${D.NEXT_NOTICE}\n`;
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' })); a.download = 'clase27-registro-del-grupo.txt'; a.click(); URL.revokeObjectURL(a.href);
    toast('Registro descargado');
  };
  summary();
  deck.hooks.enter[13] = summary;
}
