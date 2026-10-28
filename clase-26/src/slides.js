import { gsap } from 'gsap';
import { $, $$, toast, confetti as confettiRaw, motion, rng } from '../../src/util.js';
import * as D from './data.js';

const PAL = ['#ff7059', '#7be0c0', '#f5c451', '#b9a8ff', '#8fd0ff', '#f7f3e8'];
const confetti = (x, y, n) => confettiRaw(x, y, n, PAL);
const CV = { co: 'var(--co)', sun: 'var(--sun)', mint: 'var(--mint)', lila: 'var(--lila)', sky: 'var(--sky)' };
const store = {
  get(k, d = '') { try { return localStorage.getItem('c26:' + k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('c26:' + k, v); } catch { /* sin almacenamiento */ } },
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
const num1 = (x) => x.toFixed(1).replace('.', ',');
const shake = (el) => { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); };
const setNote = (el, text, cls = '') => { el.textContent = text; el.className = el.className.replace(/\b(good|warn|won)\b/g, '').trim() + (cls ? ' ' + cls : ''); };

// ---- estado compartido entre diapositivas (se guarda lo escrito en este equipo) ----
const S = {
  team: Math.min(6, Math.max(3, parseInt(store.get('team', '4'), 10) || 4)),
  names: Array.from({ length: 6 }, (_, i) => store.get('n' + i) || `Integrante ${i + 1}`),
  assign: Array.from({ length: 7 }, (_, i) => parseInt(store.get('as' + i, String(i)), 10) || 0),
  status: Array.from({ length: 7 }, (_, i) => parseInt(store.get('st' + i, '0'), 10) || 0),
  pend: Array.from({ length: 7 }, (_, i) => store.get('pd' + i) === '1'),
  self: D.SELF.map((f) => parseInt(store.get('sf_' + f.id, '1'), 10)),
  focus: store.get('focus'), own: store.get('own'),
};
const refresh = { end: () => {} };

export function initSlides(deck, three) {
  initCover(deck);
  initRoute();
  initActivity();
  initQuestions();
  initVocab();
  initAnatomy(deck);
  initSynth();
  initChart(deck, three);
  initRef();
  initBoard(deck);
  initBalance(deck, three);
  initCare();
  initReview(deck, three);
  initEnd(deck);
}

// ============ 1 · Portada ============
function initCover(deck) {
  const film = $('#cvThumbs'), info = $('#cvInfo');
  D.SLIDES7.forEach((s) => {
    const b = mk('button', 'th', `<span class="tb">${s.n}</span><span class="tt">${s.t}</span><i class="ln"></i><i class="ln s"></i>`);
    b.style.setProperty('--c', CV[s.c]); b.setAttribute('role', 'listitem');
    b.setAttribute('aria-label', `Diapositiva ${s.n}: ${s.t}. ${s.tip}`);
    const say = () => { $$('.th', film).forEach((t) => t.classList.toggle('on', t === b)); info.textContent = `Diapositiva ${s.n} · ${s.t}: ${s.tip}`; };
    b.addEventListener('mouseenter', say); b.addEventListener('focus', say); b.addEventListener('click', say);
    film.appendChild(b);
  });
  deck.hooks.enter[0] = () => {
    if (motion.reduced) return;
    gsap.fromTo($$('.th', film), { y: 40, opacity: 0, rotation: -2 }, { y: 0, opacity: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.12, delay: 1.0, clearProps: 'transform,opacity' });
  };
}

// ============ 2 · Ruta ============
function initRoute() {
  const el = $('#routeTime');
  Object.values(D.PHASES).forEach((p) => {
    const s = mk('div', 'seg', `<b>${p.min}'</b><span>${p.name}</span>`); s.title = `${p.name}: ${p.min} min`;
    s.style.setProperty('--w', p.min); s.style.setProperty('--c', p.color); el.appendChild(s);
  });
}

// ============ 3 · Activación: ¿información o rumor? ============
function initActivity() {
  let cur = 0;
  const st = {}, reasons = new Set();
  const tabsEl = $('#tabs');
  const tabBtns = D.TABS.map((t, i) => {
    const b = mk('button', '', ''); b.setAttribute('role', 'tab'); b.addEventListener('click', () => show(i)); tabsEl.appendChild(b); return b;
  });
  const paintTabs = () => D.TABS.forEach((t, i) => {
    const b = tabBtns[i];
    b.className = (i === cur ? 'on ' : '') + (st[t.id] === 'ok' ? 'st-ok' : st[t.id] === 'no' ? 'st-no' : '');
    b.setAttribute('aria-selected', String(i === cur));
    b.innerHTML = `<span class="sg">${st[t.id] === 'ok' ? '✓' : st[t.id] === 'no' ? '✕' : '○'}</span>${esc(t.name)}`;
  });
  function show(i) {
    cur = i; const t = D.TABS[i];
    $('#pgUrl').textContent = t.url; $('#pgHead').textContent = t.headline;
    $('#pgMeta').innerHTML = `<dt>Publica</dt><dd>${esc(t.own)}</dd><dt>Fecha</dt><dd>${esc(t.date)}</dd><dt>Propósito</dt><dd>${esc(t.aim)}</dd><dt>Datos</dt><dd>${esc(t.cites)}</dd>`;
    $('#pgSigns').innerHTML = t.sees.map((s) => `<li>${esc(s)}</li>`).join('');
    setNote($('#pgNote'), 'Revisa quién publica, cuándo, para qué y si muestra datos verificables. Todas las páginas son ilustrativas.');
    $('#pgNote').className = 'pg-note';
    paintTabs();
  }
  const note = (txt, cls) => { const n = $('#pgNote'); n.textContent = txt; n.className = 'pg-note ' + cls; };
  $('#tabOk').onclick = () => {
    const t = D.TABS[cur];
    if (!t.inst) { shake($('#page')); note(`No es una fuente institucional. ${t.why}`, 'warn'); return; }
    if (st[t.id] === 'ok') { delete st[t.id]; note('Quitaste esta fuente de tu selección.', ''); } else { st[t.id] = 'ok'; note('Buena elección: institución identificable, fecha y datos que se pueden verificar.', 'good'); }
    paintTabs(); update();
  };
  $('#tabNo').onclick = () => {
    const t = D.TABS[cur];
    if (t.inst) { shake($('#page')); note('Ojo: esta página sí tiene institución, fecha y datos verificables. Revísala antes de descartarla.', 'warn'); return; }
    st[t.id] = 'no'; note(`Bien descartada. ${t.why}`, 'good'); paintTabs(); update();
  };
  const why = $('#whyList');
  D.WHY.forEach((w) => {
    const b = mk('button', '', esc(w.t)); b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      if (reasons.has(w.id)) { reasons.delete(w.id); b.classList.remove('on', 'bad'); }
      else { reasons.add(w.id); b.classList.add(w.ok ? 'on' : 'bad'); if (!w.ok) { shake(b); $('#ckMsg').textContent = w.why; } }
      b.setAttribute('aria-pressed', String(reasons.has(w.id)));
      update();
    });
    why.appendChild(b);
  });
  $('#ckOA').addEventListener('change', update);
  function update() {
    const chosen = D.TABS.filter((t) => st[t.id] === 'ok').length;
    const good = D.WHY.filter((w) => w.ok && reasons.has(w.id)).length, wrong = D.WHY.some((w) => !w.ok && reasons.has(w.id));
    const c1 = chosen >= 2, c2 = good >= 3 && !wrong, c3 = $('#ckOA').checked;
    $('#ck1').classList.toggle('done', c1); $('#ck2').classList.toggle('done', c2); $('#ck3').classList.toggle('done', c3);
    $('#ck1n').textContent = `${chosen} elegida${chosen === 1 ? '' : 's'} (mínimo 2)`;
    $('#ck2n').textContent = wrong ? 'Quita la razón que no demuestra confiabilidad' : `${good} razón${good === 1 ? '' : 'es'} válida${good === 1 ? '' : 's'} (mínimo 3)`;
    if (!wrong && $('#ckMsg').textContent && !(c1 && c2 && c3)) $('#ckMsg').textContent = '';
    $('#ckGo').disabled = !(c1 && c2 && c3);
  }
  $('#ckGo').onclick = () => {
    $('#ckMsg').textContent = 'Checklist completo: muestra tus dos fuentes al docente y abre el programa de presentaciones.';
    burst($('#ckGo'), 110);
  };
  show(0); update();
}

// ============ 4 · Preguntas iniciales ============
function initQuestions() {
  const list = $('#qList'), strip = $('#qStrip'), ans = $('#qAns');
  let cur = 0;
  const minis = D.SLIDES7.map((s) => { const m = mk('div', 'mini', `<b>${s.n}</b><span>${s.t}</span>`); m.style.setProperty('--c', CV[s.c]); m.setAttribute('role', 'listitem'); strip.appendChild(m); return m; });
  const btns = D.QUESTIONS.map((q, i) => {
    const li = mk('li'); const b = mk('button', '', `<i>${i + 1}</i><span>${esc(q.q)}</span>`); b.style.setProperty('--c', CV[q.c]);
    b.addEventListener('click', () => select(i)); li.appendChild(b); list.appendChild(li); return b;
  });
  function select(i) {
    cur = i; const q = D.QUESTIONS[i];
    btns.forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('done', !!store.get('qa' + k)); });
    $('#qIdea').textContent = q.idea; $('#qBar').textContent = `pregunta-${i + 1}.txt`;
    minis.forEach((m, k) => m.classList.toggle('on', q.on.includes(k + 1)));
    ans.value = store.get('qa' + i);
  }
  ans.addEventListener('input', () => { store.set('qa' + cur, ans.value); btns[cur].classList.toggle('done', !!ans.value.trim()); });
  select(0);
}

// ============ 5 · Vocabulario ============
function initVocab() {
  const rnd = rng(seed());
  const defs = $('#vDefs'), bank = $('#vBank');
  let selDef = null, solved = 0;
  const order = shuffle(D.VOCAB.map((_, i) => i), rnd);
  const dBtns = order.map((vi) => {
    const v = D.VOCAB[vi];
    const li = mk('li'); const b = mk('button', '', `<span class="bl">¿término?</span><span class="tx">${esc(v.d)}</span>`);
    b.addEventListener('click', () => { if (b.classList.contains('ok')) return; dBtns.forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); selDef = vi; $('#vMsg').textContent = 'Ahora toca el término que corresponde.'; });
    li.appendChild(b); defs.appendChild(li); b.dataset.vi = vi; return b;
  });
  shuffle(D.VOCAB.map((_, i) => i), rnd).forEach((vi) => {
    const v = D.VOCAB[vi];
    const b = mk('button', '', esc(v.t));
    b.addEventListener('click', () => {
      const msg = $('#vMsg');
      if (selDef === null) { msg.textContent = 'Primero toca una definición.'; shake(msg); return; }
      const db = dBtns.find((x) => +x.dataset.vi === selDef);
      if (vi === selDef) {
        b.classList.add('ok'); b.disabled = true; db.classList.remove('sel'); db.classList.add('ok');
        db.querySelector('.bl').textContent = v.t;
        db.querySelector('.tx').innerHTML = `${esc(v.d)}<span class="use">En el PPT: ${esc(v.use)}</span>`;
        selDef = null; solved++;
        $('#vProg').textContent = `${solved} / 7`; $('#vBar').style.width = `${(solved / 7) * 100}%`;
        msg.textContent = solved === 7 ? '¡Vocabulario completo! Estos términos aparecerán en tu PPT.' : 'Correcto.';
        if (solved === 7) burst(bank, 120);
      } else { b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 700); shake(b); msg.textContent = D.VOCAB_HINT[D.VOCAB[selDef].t]; }
    });
    bank.appendChild(b);
  });
}

// ============ 6 · Anatomía de una diapositiva ============
function initAnatomy(deck) {
  const slide = $('#anSlide'), stage = slide.parentElement;
  const sw = $('#anSw');
  const clearHTML = `
    <h4 data-p="titulo">La pubertad empieza en edades distintas</h4>
    <p class="idea" data-p="idea">Cada persona cambia a su propio ritmo.</p>
    <div class="mid">
      <div class="vis" data-p="visual"><svg viewBox="0 0 460 190" role="img" aria-label="Esquema ilustrativo: tres barras con rangos de edad distintos">
        <line x1="20" y1="160" x2="440" y2="160" stroke="#47655e" stroke-width="2"/>
        <rect x="60" y="22" width="150" height="26" rx="13" fill="#7be0c0"/><rect x="110" y="62" width="190" height="26" rx="13" fill="#8fd0ff"/><rect x="170" y="102" width="200" height="26" rx="13" fill="#f5c451"/>
        <text x="20" y="182">más temprano</text><text x="342" y="182">más tarde</text>
        <text x="64" y="15">Persona A · esquema ilustrativo</text>
      </svg></div>
      <div class="evi" data-p="evidencia">El inicio de los cambios varía entre personas.<small>Ilustrativo</small></div>
    </div>
    <div class="src" data-p="fuente">Fuente: Ministerio de Salud (ejemplo), 2024</div>`;
  const badHTML = `
    <span class="star">★</span><h4>PUBERTAD!!! TODO LO QUE DEBES SABER</h4>
    <p>La pubertad es un proceso complejo de cambios físicos, hormonales, emocionales y sociales que ocurre en distintos momentos aunque algunas personas dicen que a los 12 todas cambian y si no pasa es raro y mejor no contarlo a nadie porque da vergüenza y además existen muchos tipos de cambios en el cuerpo, en la voz, en la piel, en el estado de ánimo, en las amistades.</p>
    <p>Los especialistas indican que hay hormonas, glándulas, etapas, escalas y clasificaciones que se explican con tablas largas que no caben en esta lámina. Además hay que cuidar la alimentación, el sueño, el deporte, la higiene, la ropa, las redes sociales y las relaciones con amistades y familia, y también hay que informarse bien aunque aquí no ponemos de dónde sale lo que decimos.</p>
    <p>En conclusión todos cambian igual y siempre a la misma edad según lo que se comenta.</p>`;
  let hs = [], sel = null;
  const render = () => {
    const bad = sw.checked;
    slide.className = 'an-slide' + (bad ? ' bad' : ''); slide.innerHTML = bad ? badHTML : clearHTML;
    $('#anSwTxt').textContent = bad ? 'Versión cargada' : 'Versión clara';
    hs.forEach((h) => h.remove()); hs = [];
    D.ANATOMY.forEach((a) => {
      const b = mk('button', 'hs', String(a.n)); b.setAttribute('aria-label', `${a.n}. ${a.t}`); b.addEventListener('click', () => pick(a.id)); stage.appendChild(b); b.dataset.id = a.id; hs.push(b);
    });
    place(); meters(bad);
    $('#anList').classList.toggle('off', bad);
    if (bad) { sel = null; paintList(); $('#anBar').textContent = 'por-que-no-funciona'; $('#anText').innerHTML = `<ul>${D.ANATOMY_BAD.map((t) => `<li>${t}</li>`).join('')}</ul>`; }
    else { pick(sel || 'titulo'); }
  };
  function place() {
    hs.forEach((h) => {
      const el = slide.querySelector(`[data-p="${h.dataset.id}"]`);
      h.classList.toggle('off', !el);
      if (!el) return;
      h.style.left = `${18 + el.offsetLeft - 46}px`; h.style.top = `${18 + el.offsetTop - 2}px`;
    });
  }
  function meters(bad) {
    const c = slide.cloneNode(true); c.querySelectorAll('svg,.star').forEach((x) => x.remove());
    const words = nWords(c.textContent);
    $('#anMeter').innerHTML =
      `<div class="met ${words <= 40 ? 'good' : 'warn'}"><span>Palabras</span><b>${words}${words <= 40 ? ' ≤ 40' : ' > 40'}</b></div>` +
      `<div class="met ${bad ? 'warn' : 'good'}"><span>Ideas</span><b>${bad ? '5+' : '1'}</b></div>` +
      `<div class="met ${bad ? 'warn' : 'good'}"><span>Fuente</span><b>${bad ? 'No' : 'Sí'}</b></div>`;
  }
  const paintList = () => $$('#anList button').forEach((b) => b.classList.toggle('on', b.dataset.id === sel));
  function pick(id) {
    if (sw.checked) { sw.checked = false; render(); }
    sel = id; const a = D.ANATOMY.find((x) => x.id === id);
    $('#anBar').textContent = `${a.n}-${a.id}`; $('#anText').textContent = a.text;
    paintList(); hs.forEach((h) => h.classList.toggle('on', h.dataset.id === id));
  }
  D.ANATOMY.forEach((a) => {
    const li = mk('li'); const b = mk('button', '', `<i>${a.n}</i>${a.t}<span>${a.short}</span>`); b.dataset.id = a.id; b.addEventListener('click', () => pick(a.id)); li.appendChild(b); $('#anList').appendChild(li);
  });
  sw.addEventListener('change', render);
  deck.hooks.enter[5] = () => { render(); };
}

// ============ 7 · Síntesis ============
function initSynth() {
  const para = $('#syPara');
  const pos = D.KEYWORDS.map((k) => ({ k, i: D.PARAGRAPH.indexOf(k) })).filter((p) => p.i >= 0).sort((a, b) => a.i - b.i);
  let html = '', at = 0;
  pos.forEach((p) => { html += esc(D.PARAGRAPH.slice(at, p.i)) + `<mark tabindex="0" role="button" aria-pressed="false">${esc(p.k)}</mark>`; at = p.i + p.k.length; });
  html += esc(D.PARAGRAPH.slice(at)); para.innerHTML = html;
  const marks = $$('mark', para);
  const count = () => { $('#syMarks').textContent = `Toca las frases que usarías. Marcadas: ${marks.filter((m) => m.classList.contains('on')).length}`; };
  marks.forEach((m) => {
    const t = () => { m.classList.toggle('on'); m.setAttribute('aria-pressed', String(m.classList.contains('on'))); count(); };
    m.addEventListener('click', t); m.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
  });
  const cand = $('#syCand'), fb = $('#syFb');
  const items = shuffle(D.SYNTH, rng(seed()));
  const btns = items.map((c) => {
    const b = mk('button', '', `${esc(c.t)}<span class="tg"></span>`);
    b.addEventListener('click', () => {
      fb.textContent = c.fb; b.classList.add(c.ok ? 'ok' : 'bad'); b.querySelector('.tg').textContent = c.tag;
      if (c.ok) { btns.forEach((x, i) => { x.querySelector('.tg').textContent = items[i].tag; }); burst(fb, 60); }
    });
    cand.appendChild(b); return b;
  });
  // revisor orientativo de la frase propia
  const norm = (t) => t.toLowerCase().replace(/[.,;:¡!¿?()«»"“”]/g, '').split(/\s+/).filter(Boolean);
  const src = norm(D.PARAGRAPH);
  function longestRun(a, b) {
    let best = 0, prev = new Array(b.length + 1).fill(0);
    for (let i = 1; i <= a.length; i++) {
      const cur = new Array(b.length + 1).fill(0);
      for (let j = 1; j <= b.length; j++) if (a[i - 1] === b[j - 1]) { cur[j] = prev[j - 1] + 1; if (cur[j] > best) best = cur[j]; }
      prev = cur;
    }
    return best;
  }
  const STIG = /(anormal|raro|rara|irresponsable|culpa|asco|sucio|vergüenza)/i;
  const mine = $('#syMine'), chk = $('#syChk');
  const chip = (cls, t) => `<span class="sg3 ${cls}">${t}</span>`;
  mine.addEventListener('input', () => {
    const t = mine.value.trim();
    if (!t) { chk.innerHTML = ''; return; }
    const w = nWords(t), run = longestRun(norm(t), src);
    D.ABSOLUTES.lastIndex = 0; const abs = D.ABSOLUTES.test(t); D.ABSOLUTES.lastIndex = 0;
    chk.innerHTML =
      chip(run >= 6 ? 'r' : run >= 4 ? 'y' : 'g', run >= 6 ? `Copias ${run} palabras seguidas` : run >= 4 ? 'Cambia más palabras' : 'Palabras propias') +
      chip(abs ? 'r' : STIG.test(t) ? 'y' : 'g', abs ? 'Hay una palabra absoluta' : STIG.test(t) ? 'Revisa que no fomente vergüenza' : 'Sin absolutos ni estigma') +
      chip(w < 8 ? 'y' : w > 25 ? 'r' : 'g', `${w} palabras · ${w < 8 ? 'muy corta' : w > 25 ? 'muy larga' : 'largo adecuado'}`);
  });
}

// ============ 8 · Gráfico 3D ============
function initChart(deck, three) {
  const ul = $('#chParts'), text = $('#chText'), bar = $('#chBar');
  const on = { title: false, axes: false, src: false, ill: false };
  D.CHART.parts.forEach((p) => {
    const li = mk('li'); const l = mk('label', '', `<input type="checkbox"><div><b>${p.t}</b><span>${esc(p.why)}</span></div>`);
    const cb = l.querySelector('input');
    cb.addEventListener('change', () => {
      on[p.id] = cb.checked; three.ch.setParts(on);
      bar.textContent = p.t.toLowerCase();
      text.textContent = cb.checked ? (p.id === 'title' ? `${D.CHART.title}. ${D.CHART.conclusion}` : p.why) : `Sin «${p.t.toLowerCase()}» el gráfico se entiende menos.`;
      if (Object.values(on).every(Boolean)) { text.textContent = `Gráfico completo. ${D.CHART.conclusion}`; burst($('#chText'), 80); }
    });
    li.appendChild(l); ul.appendChild(li);
  });
  three.onBarPick = (i) => { const b = D.CHART.bars[i]; bar.textContent = `barra-${i + 1}`; text.textContent = D.CHART.say(b); };
  deck.hooks.enter[7] = () => { three.live.ch = true; three.ch.resize(); three.ch.grow(); };
  deck.hooks.leave[7] = () => { three.live.ch = false; };
}

// ============ 9 · Referencia simple ============
function initRef() {
  $('#rfDoc').innerHTML = `Documento consultado: <b>${esc(D.REF.doc)}</b>`;
  const wrap = $('#rfFields'), pick = {};
  D.REF.fields.forEach((f) => {
    const row = mk('div', 'rf-row', `<label>${f.t}</label><div class="chips"></div>`);
    const chips = row.querySelector('.chips');
    f.opts.forEach((o, oi) => {
      const b = mk('button', '', esc(o));
      b.addEventListener('click', () => {
        pick[f.id] = oi;
        $$('button', chips).forEach((x, k) => { x.classList.remove('ok', 'bad'); if (k === oi) x.classList.add(oi === f.ok ? 'ok' : 'bad'); });
        const msg = $('#rfMsg'); msg.textContent = oi === f.ok ? 'Bien: ese dato sirve para comprobar la fuente.' : f.bad;
        update();
      });
      chips.appendChild(b);
    });
    wrap.appendChild(row);
  });
  const part = (id) => { const f = D.REF.fields.find((x) => x.id === id); return pick[id] === f.ok ? esc(f.opts[f.ok]) : `<span class="miss">${f.t.toLowerCase()}</span>`; };
  function update() {
    const okN = D.REF.fields.filter((f) => pick[f.id] === f.ok).length;
    $('#rfStat').textContent = `${okN} / 5`; $('#rfBar').style.width = `${(okN / 5) * 100}%`;
    $('#rfOut').innerHTML = `${part('inst')}. (${part('year')}). <i>${part('title')}</i>. ${part('url')}. ${part('seen')}.`;
    const ie = pick.inst === 0, ye = pick.year === 0;
    $('#rfFoot').textContent = `Fuente: ${ie ? D.REF.fields[0].opts[0] : '—'}${ye ? ', ' + D.REF.fields[2].opts[0] : ''}`;
    $('#rfCopy').disabled = okN < 5;
    if (okN === 5) { $('#rfMsg').textContent = 'Referencia completa: lista para la diapositiva 7. Al pie de cada lámina basta la versión corta.'; burst($('#rfOut'), 90); }
  }
  $('#rfCopy').onclick = () => {
    const txt = $('#rfOut').textContent;
    try { navigator.clipboard.writeText(txt).then(() => toast('Referencia copiada'), () => toast('Selecciona y copia el texto')); } catch { toast('Selecciona y copia el texto'); }
  };
  update();
}

// ============ 10 · Tablero de las siete diapositivas ============
function initBoard(deck) {
  let sel = 0;
  const rows = $('#tbRows');
  const nm = () => S.names.slice(0, S.team);
  const rowEls = D.SLIDES7.map((s, i) => {
    const r = mk('div', 'b-row', `<span class="n">${s.n}</span><div><b>${s.t}</b><small></small></div><select aria-label="Responsable de la diapositiva ${s.n}"></select><button class="st"></button>`);
    r.style.setProperty('--c', CV[s.c]); r.setAttribute('role', 'listitem'); r.tabIndex = 0;
    r.addEventListener('click', (e) => { if (e.target.closest('select,button')) return; select(i); });
    r.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === r) { e.preventDefault(); e.stopPropagation(); select(i); } });
    r.querySelector('select').addEventListener('change', (e) => { S.assign[i] = +e.target.value; store.set('as' + i, S.assign[i]); paint(); });
    r.querySelector('.st').addEventListener('click', () => { S.status[i] = (S.status[i] + 1) % 3; store.set('st' + i, S.status[i]); select(i); paint(); if (S.status.every((x) => x === 2)) burst($('#tbRows'), 120); });
    rows.appendChild(r); return r;
  });
  const names = $('#tbNames');
  const nameInputs = Array.from({ length: 6 }, (_, i) => {
    const inp = mk('input'); inp.type = 'text'; inp.maxLength = 18; inp.value = S.names[i]; inp.setAttribute('aria-label', `Integrante ${i + 1}`);
    inp.addEventListener('input', () => { S.names[i] = inp.value.trim() || `Integrante ${i + 1}`; store.set('n' + i, inp.value.trim()); paint(); });
    names.appendChild(inp); return inp;
  });
  function team(n) {
    S.team = Math.max(3, Math.min(6, n)); store.set('team', S.team); $('#tbTeam').textContent = S.team;
    nameInputs.forEach((inp, i) => { inp.hidden = i >= S.team; });
    S.assign = S.assign.map((a, i) => (a >= S.team ? i % S.team : a));
    paint();
  }
  $('#tbMinus').onclick = () => team(S.team - 1); $('#tbPlus').onclick = () => team(S.team + 1);
  function select(i) {
    sel = i; const s = D.SLIDES7[i];
    $('#tbBar').textContent = `diapositiva-${s.n}`; $('#tbTitle').textContent = `${s.n}. ${s.t}`; $('#tbTip').textContent = s.tip;
    const ul = $('#tbMust'); ul.innerHTML = '';
    s.must.forEach((m, j) => {
      const key = `mk${i}_${j}`;
      const li = mk('li', store.get(key) === '1' ? 'done' : '', `<i class="bx"></i><div><b>${esc(m)}</b></div>`);
      li.tabIndex = 0;
      const t = () => { const v = !li.classList.contains('done'); li.classList.toggle('done', v); store.set(key, v ? '1' : '0'); };
      li.addEventListener('click', t); li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
      ul.appendChild(li);
    });
    rowEls.forEach((r, k) => r.classList.toggle('on', k === i));
  }
  function paint() {
    const n = nm();
    rowEls.forEach((r, i) => {
      const s = r.querySelector('select');
      s.innerHTML = n.map((p, k) => `<option value="${k}">${esc(p)}</option>`).join(''); s.value = String(S.assign[i]);
      r.querySelector('small').textContent = D.SLIDES7[i].must[0];
      const b = r.querySelector('.st'); b.className = 'st s' + S.status[i]; b.textContent = D.STATES[S.status[i]];
    });
    const pct = Math.round((S.status.reduce((a, b) => a + b, 0) / 14) * 100);
    $('#tbPct').textContent = pct + '%'; $('#tbRing').style.strokeDashoffset = String(176 * (1 - pct / 100));
    const miss = n.filter((_, k) => !S.assign.some((a) => a === k));
    const cov = $('#tbCover');
    cov.textContent = miss.length ? `Falta asignar una parte a: ${miss.join(', ')}.` : 'Todas las personas del grupo tienen al menos una diapositiva y una parte de la exposición.';
    cov.className = 'b-cover' + (miss.length ? '' : ' ok');
    refresh.end();
  }
  team(S.team); select(0);
  deck.hooks.enter[9] = () => { paint(); };
}

// ============ 11 · Balanza mito–evidencia ============
function initBalance(deck, three) {
  let cur = 0;
  const picks = D.MYTHS.map(() => []);
  const won = D.MYTHS.map(() => false);
  const tabs = $('#blMyths'), evEl = $('#blEv'), msg = $('#blMsg'), draft = $('#blDraft');
  const tBtns = D.MYTHS.map((m, i) => { const b = mk('button', '', esc(m.myth)); b.setAttribute('role', 'tab'); b.addEventListener('click', () => select(i)); tabs.appendChild(b); return b; });
  function select(i) {
    cur = i; const m = D.MYTHS[i];
    tBtns.forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', String(k === i)); });
    evEl.innerHTML = '';
    m.ev.forEach((e, k) => {
      const b = mk('button', 'ev k-' + e.kind, `${esc(e.t)}<small><em>${D.KIND[e.kind]}</em><span>${esc(e.src)}</span></small>`);
      b.classList.toggle('on', picks[i].includes(k)); b.setAttribute('aria-pressed', String(picks[i].includes(k)));
      b.addEventListener('click', () => {
        const p = picks[cur], at = p.indexOf(k);
        if (at >= 0) p.splice(at, 1); else p.push(k);
        b.classList.toggle('on', at < 0); b.setAttribute('aria-pressed', String(at < 0)); weigh(true);
      });
      evEl.appendChild(b);
    });
    weigh(false);
  }
  function weigh(user) {
    const m = D.MYTHS[cur], p = picks[cur];
    const R = p.reduce((a, k) => a + D.WEIGHT[m.ev[k].kind], 0), L = D.MYTH_WEIGHT;
    const kinds = p.map((k) => m.ev[k].kind);
    three.bl.setBlocks(kinds); three.bl.setTilt((L - R) * 0.075); three.bl.setLabels(`Mito · peso ${num1(L)}`, `Evidencia · peso ${num1(R)}`);
    const isWon = R > L, hasR = kinds.includes('r'), nOff = kinds.filter((k) => k === 'o').length;
    three.bl.setWon(isWon);
    if (!p.length) setNote(msg, `El mito pesa ${num1(L)} y la balanza no tiene evidencia. Pon fuentes para contrastarlo.`);
    else if (isWon) setNote(msg, `La evidencia (${num1(R)}) supera al mito (${num1(L)}). ${hasR ? 'Pero saca los bloques huecos: sin respaldo no se citan.' : 'Ya puedes redactar la diapositiva 4.'}`, 'won');
    else setNote(msg, `La evidencia pesa ${num1(R)} frente a ${num1(L)}. ${hasR ? 'Los bloques huecos casi no pesan: no sirven para corregir un mito. ' : ''}${nOff < 2 ? 'Busca dos fuentes oficiales que lo contrasten.' : 'Aún no alcanza.'}`);
    if (isWon && !won[cur] && user) { won[cur] = true; burst(msg, 80); }
    if (!isWon) won[cur] = false;
    tBtns[cur].classList.toggle('done', isWon);
    if (isWon) draft.value = `Mito frecuente: «${m.myth}»\nLo que dice la evidencia: ${m.fix}\nFuentes: ${p.filter((k) => m.ev[k].kind !== 'r').map((k) => m.ev[k].src).join('; ')}.\n(Ejemplo ilustrativo: adáptalo con tus palabras.)`;
    else if (user || !draft.value) draft.value = '';
    draft.placeholder = 'Cuando la evidencia confiable supere al mito, aquí aparecerá un borrador de la diapositiva 4.';
  }
  $('#blCopy').onclick = () => {
    if (!draft.value.trim()) { toast('Aún no hay borrador: equilibra la balanza'); return; }
    try { navigator.clipboard.writeText(draft.value).then(() => toast('Borrador copiado'), () => toast('Selecciona y copia el texto')); } catch { toast('Selecciona y copia el texto'); }
  };
  deck.hooks.enter[10] = () => { three.live.bl = true; three.bl.resize(); select(cur); };
  deck.hooks.leave[10] = () => { three.live.bl = false; };
}

// ============ 12 · Autocuidado sin miedo y dónde buscar ayuda ============
function initCare() {
  const rnd = rng(seed());
  let idx = 0, solved = D.MSGS.map(() => false);
  const opts = $('#msOpts'), fb = $('#msFb'), next = $('#msNext'), dots = $('#msDots');
  const dotEls = D.MSGS.map(() => { const d = mk('i'); dots.appendChild(d); return d; });
  function show() {
    const m = D.MSGS[idx];
    $('#msTag').textContent = `MENSAJE ${idx + 1} DE ${D.MSGS.length}`; $('#msFlag').textContent = m.flag; $('#msBad').textContent = `«${m.bad}»`;
    fb.textContent = ''; opts.innerHTML = ''; next.disabled = !solved[idx] || idx === D.MSGS.length - 1;
    next.textContent = idx === D.MSGS.length - 1 ? 'Revisión completa ✓' : 'Siguiente mensaje →';
    shuffle(m.opts, rnd).forEach((o) => {
      const b = mk('button', '', esc(o.t));
      b.addEventListener('click', () => {
        if (solved[idx]) return;
        b.classList.add(o.ok ? 'ok' : 'bad'); fb.textContent = o.fb;
        if (o.ok) {
          solved[idx] = true; $$('button', opts).forEach((x) => { x.disabled = true; }); next.disabled = idx === D.MSGS.length - 1;
          if (solved.every(Boolean)) { fb.textContent += ' ¡Los cinco mensajes cuidan! Úsalos como modelo para la diapositiva 6.'; burst($('#msFb'), 110); }
        } else shake(b);
        paintDots();
      });
      opts.appendChild(b);
    });
    paintDots();
  }
  const paintDots = () => dotEls.forEach((d, i) => { d.className = solved[i] ? 'done' : i === idx ? 'on' : ''; });
  next.onclick = () => { if (idx < D.MSGS.length - 1) { idx++; show(); } };
  $('#msReset').onclick = () => { idx = 0; solved = D.MSGS.map(() => false); show(); };
  show();

  // dónde buscar ayuda (diapositiva 7)
  const list = $('#hpList'), msg = $('#hpMsg');
  let done = 0;
  D.HELP.forEach((h) => {
    const row = mk('div', 'hp-row', `<span>${esc(h.t)}</span><button aria-label="Sí va: ${esc(h.t)}">✓</button><button aria-label="No va: ${esc(h.t)}">✕</button>`);
    const [yes, no] = $$('button', row);
    const answer = (v) => {
      if (row.classList.contains('ok')) return;
      if (v === h.ok) {
        row.classList.remove('bad'); row.classList.add('ok'); yes.disabled = no.disabled = true; done++;
        msg.textContent = h.ok ? 'Sí va en la diapositiva 7.' : `Correcto, no va. ${h.why}`;
        if (done === D.HELP.length) { msg.textContent = 'Lista completa. Recuerda: los canales vigentes los proyecta el docente y se verifican en la fuente oficial.'; burst(list, 90); }
      } else { row.classList.add('bad'); shake(row); msg.textContent = h.ok ? 'Esta opción sí ayuda a quien busca información o apoyo.' : h.why; }
    };
    yes.onclick = () => answer(true); no.onclick = () => answer(false);
    list.appendChild(row);
  });
}

// ============ 13 · Revisión entre grupos (banquito) ============
function initReview(deck, three) {
  let cur = 0;
  const lv = D.REVIEW.map(() => [1, 1, 1]), checked = D.REVIEW.map(() => false);
  const tabs = $('#rvTabs'), crit = $('#rvCrit'), fb = $('#rvFb'), hi = $('#rvHi');
  const tBtns = D.REVIEW.map((r, i) => { const b = mk('button', '', `Diapositiva ${r.id}`); b.setAttribute('role', 'tab'); b.addEventListener('click', () => select(i)); tabs.appendChild(b); return b; });
  const rows = D.CRIT3.map((c, ci) => {
    const row = mk('div', 'cr3', `<b>${c.t}<small>${c.q}</small></b>`);
    row.style.setProperty('--c', CV[c.c]);
    const bs = D.LEVELS.map((l, k) => { const b = mk('button', '', l); b.setAttribute('aria-pressed', 'false'); b.addEventListener('click', () => { lv[cur][ci] = k; checked[cur] = false; paint(); three.st.setLevels(lv[cur]); fb.textContent = 'Cuando termines, comprueba con la clave orientativa.'; }); row.appendChild(b); return b; });
    crit.appendChild(row); return bs;
  });
  const check = mk('button', 'btn sm', 'Comprobar con la clave orientativa'); check.style.alignSelf = 'start';
  crit.appendChild(check);
  function paint() {
    const r = D.REVIEW[cur];
    rows.forEach((bs, ci) => bs.forEach((b, k) => {
      b.classList.toggle('on', lv[cur][ci] === k); b.setAttribute('aria-pressed', String(lv[cur][ci] === k));
      b.classList.toggle('key', checked[cur] && r.key[ci] === k);
    }));
  }
  function select(i) {
    cur = i; const r = D.REVIEW[i];
    tBtns.forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', String(k === i)); });
    $('#rvBar').textContent = `diapositiva-${r.id.toLowerCase()}-ilustrativa.txt`;
    let body = r.body; if (hi.checked) body = body.replace(D.ABSOLUTES, '<span class="abs">$&</span>');
    $('#rvSlide').innerHTML = body;
    fb.textContent = checked[i] ? fb.textContent : 'Califica cada pata y mira el banquito.';
    paint(); three.st.setLevels(lv[i]);
  }
  hi.addEventListener('change', () => select(cur));
  check.onclick = () => {
    const r = D.REVIEW[cur]; checked[cur] = true; paint();
    const miss = r.key.map((k, i) => (lv[cur][i] === k ? null : i)).filter((x) => x !== null);
    if (!miss.length) { fb.textContent = '¡Coincides con la clave en las tres patas! (La clave es orientativa: la revisión humana prevalece.)'; burst(fb, 70); }
    else fb.textContent = miss.map((i) => `${D.CRIT3[i].t}: ${r.fb[i]}`).join(' ') + ' (Clave orientativa.)';
  };
  const pd = $('#pdList');
  D.SLIDES7.forEach((s, i) => {
    const b = mk('button', S.pend[i] ? 'on' : '', `Diap. ${s.n}`); b.setAttribute('aria-pressed', String(S.pend[i]));
    b.addEventListener('click', () => { S.pend[i] = !S.pend[i]; store.set('pd' + i, S.pend[i] ? '1' : '0'); b.classList.toggle('on', S.pend[i]); b.setAttribute('aria-pressed', String(S.pend[i])); refresh.end(); });
    pd.appendChild(b);
  });
  deck.hooks.enter[12] = () => { three.live.st = true; three.st.resize(); select(cur); };
  deck.hooks.leave[12] = () => { three.live.st = false; };
}

// ============ 14 · Ticket de salida y aviso ============
function initEnd(deck) {
  const foci = $('#tkFoci'), own = $('#tkOwn'), selfEl = $('#tkSelf');
  $('#tkNotice').textContent = D.NEXT_NOTICE;
  const focusText = () => (own.value.trim() || S.focus || '');
  const line = () => { $('#tkLine').innerHTML = `Antes de presentar necesitamos mejorar <u>${esc(focusText() || '…')}</u>.`; };
  const fBtns = D.FOCI.map((f) => {
    const b = mk('button', S.focus === f ? 'on' : '', esc(f)); b.setAttribute('aria-pressed', String(S.focus === f));
    b.addEventListener('click', () => { S.focus = S.focus === f ? '' : f; store.set('focus', S.focus); own.value = ''; S.own = ''; store.set('own', ''); fBtns.forEach((x, k) => { const on = D.FOCI[k] === S.focus; x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); }); line(); summary(); });
    foci.appendChild(b); return b;
  });
  own.value = S.own;
  own.addEventListener('input', () => { S.own = own.value; store.set('own', own.value); if (own.value.trim()) { S.focus = ''; store.set('focus', ''); fBtns.forEach((x) => { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); }); } line(); summary(); });
  const LV = ['Aún no', 'En camino', 'Logrado'];
  D.SELF.forEach((f, i) => {
    const row = mk('div', 'tkr', `<span>${f.t}</span>`); row.style.setProperty('--c', CV[f.c]);
    LV.forEach((l, k) => { const b = mk('button', S.self[i] === k ? 'on' : '', l); b.setAttribute('aria-pressed', String(S.self[i] === k)); b.addEventListener('click', () => { S.self[i] = k; store.set('sf_' + f.id, k); $$('button', row).forEach((x, j) => { x.classList.toggle('on', j === k); x.setAttribute('aria-pressed', String(j === k)); }); summary(); }); row.appendChild(b); });
    selfEl.appendChild(row);
  });
  const pendTxt = () => { const p = D.SLIDES7.filter((_, i) => S.pend[i]).map((s) => `diap. ${s.n}`); return p.length ? p.join(', ') : 'ninguna registrada'; };
  function summary() {
    const lg = S.self.filter((v) => v === 2).length, weak = D.SELF.filter((_, i) => S.self[i] < 2).map((f) => f.t.toLowerCase());
    $('#tkSum').innerHTML = `<b>Foco de mejora:</b> ${esc(focusText() || 'sin elegir')}.<br><b>Criterios logrados:</b> ${lg} de 4${weak.length ? ` · por reforzar: ${esc(weak.join('; '))}` : ''}.<br><b>Diapositivas pendientes:</b> ${pendTxt()}.`;
  }
  refresh.end = summary;
  $('#tkDl').onclick = () => {
    const resp = D.SLIDES7.map((s, i) => `  Diap. ${s.n} (${s.t}): ${S.names[S.assign[i]] || '—'} · ${D.STATES[S.status[i]]}`).join('\n');
    const self = D.SELF.map((f, i) => `  ${f.t}: ${LV[S.self[i]]}`).join('\n');
    const txt = `CLASE 26 · Computación: PPT «Autocuidado informado»\nRegistro del grupo (ilustrativo; se guarda solo en este equipo)\n\nAntes de presentar necesitamos mejorar: ${focusText() || '(sin elegir)'}\n\nResponsabilidades:\n${resp}\n\nAutoevaluación (criterios del plan):\n${self}\n\nDiapositivas pendientes: ${pendTxt()}\n\n${D.NEXT_NOTICE}\n`;
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' })); a.download = 'clase26-registro-del-grupo.txt'; a.click(); URL.revokeObjectURL(a.href);
    toast('Registro descargado');
  };
  line(); summary();
  deck.hooks.enter[13] = () => { line(); summary(); };
}
