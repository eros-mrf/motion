// Clase 25 · lo propio de esta clase sobre el motor común (core/deck-base.js): mosaico de transición,
// palabras con máscara + marcador amarillo, pin de la regla y la mira con coordenadas.
import { gsap } from 'gsap';
import { $, $$, motion } from '../../src/util.js';
import { createDeck as baseDeck } from '../../core/deck-base.js';
import { PHASES, NOTES } from './data.js';

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
  const pane = $('#pane');
  const tiles = Array.from({ length: 144 }, () => pane.appendChild(document.createElement('i')));
  const grid = { grid: [9, 16] };
  const effects = {
    clear: '.title .wi',
    step: (want) => { $('#pin').style.transform = `translateX(${want * PITCH}px)`; },
    // palabras que suben dentro de su máscara y marcador amarillo que subraya lo importante
    enter(slide, t, quick) {
      const title = $('.title[data-a="title"]', slide);
      if (title) splitWords(title);
      const words = title ? $$('.wi', title) : [], ems = title ? $$('em', title) : [];
      if (quick) { gsap.set(words, { yPercent: 0 }); gsap.set(ems, { '--k': 1 }); }
      else {
        if (words.length) t.fromTo(words, { yPercent: 115 }, { yPercent: 0, duration: 0.75, ease: 'expo.out', stagger: 0.06, clearProps: 'transform' }, 0.05);
        if (ems.length) t.fromTo(ems, { '--k': 0 }, { '--k': 1, duration: 0.7, ease: 'power3.inOut', stagger: 0.12 }, 0.55);
      }
      const els = $$('[data-a]', slide).filter((e) => e.dataset.a !== 'title');
      const clean = { clearProps: 'transform,opacity,visibility,clipPath' };
      if (quick) t.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.25, ...clean }, 0);
      else t.fromTo(els, { opacity: 0, y: 40, rotation: 0.6, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, rotation: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.out', stagger: 0.09, ...clean }, 0.2);
    },
    // mosaico de cuadrícula (16 × 9) que se enciende y se apaga
    transition: {
      out: (tl) => tl.to(tiles, { scale: 1.02, duration: 0.28, ease: 'power2.out', stagger: { ...grid, from: 'start', amount: 0.42 } }),
      in: (tl) => tl.to(tiles, { scale: 0, duration: 0.28, ease: 'power2.in', stagger: { ...grid, from: 'end', amount: 0.42 } }, '+=0.02'),
      reset: () => gsap.set(tiles, { scale: 0 }),
    },
  };
  const deck = baseDeck({ phases: PHASES, notes: NOTES, onChange, effects });

  // mira del plano: líneas finas y coordenadas siguen al cursor
  const cross = $('#cross'), crossTxt = $('#crossTxt');
  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' || motion.reduced) { cross.classList.remove('on'); return; }
    cross.classList.add('on');
    cross.style.setProperty('--cx', e.clientX + 'px'); cross.style.setProperty('--cy', e.clientY + 'px');
    const k = Math.min(innerWidth / 1920, innerHeight / 1080);
    crossTxt.textContent = `x ${String(Math.round((e.clientX - (innerWidth - 1920 * k) / 2) / k)).padStart(4, '0')} · y ${String(Math.round((e.clientY - (innerHeight - 1080 * k) / 2) / k)).padStart(4, '0')}`;
  });
  document.documentElement.addEventListener('pointerleave', () => cross.classList.remove('on'));
  return deck;
}
