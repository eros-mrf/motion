// Clase 27 · lo propio de esta clase sobre el motor común (core/deck-base.js): los títulos entran como un borrador
// (letras desordenadas) que se «edita» hasta quedar alineado, con subrayado de lápiz rojo; transición de tiras que cruzan la pantalla.
import { gsap } from 'gsap';
import { $, $$, rng } from '../../src/util.js';
import { createDeck as baseDeck } from '../../core/deck-base.js';
import { PHASES, NOTES } from './data.js';

// Parte un título en palabras (nowrap) con letras sueltas (<span class="ch">), respetando <em> y <br> internos.
function splitChars(el) {
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
          else {
            const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
            [...tk].forEach((ch) => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; w.appendChild(s); });
            frag.appendChild(w);
          }
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1 && !c.classList.contains('w') && c.tagName !== 'BR') walk(c);
    });
  };
  walk(el);
}

export function createDeck({ onChange }) {
  const pane = $('#pane');
  const strips = Array.from({ length: 6 }, () => pane.appendChild(document.createElement('i')));
  const rnd = rng(27);
  const effects = {
    clear: '.title .ch',
    enter(slide, t, quick) {
      const title = $('.title[data-a="title"]', slide);
      if (title) splitChars(title);
      const chars = title ? $$('.ch', title) : [], ems = title ? $$('em', title) : [];
      if (quick) { gsap.set(chars, { opacity: 1, y: 0, rotation: 0 }); gsap.set(ems, { '--k': 1 }); }
      else if (chars.length) {
        // posiciones de «borrador» deterministas: cada letra cae desde arriba, torcida, y se endereza
        chars.forEach((c) => gsap.set(c, { opacity: 0, y: -30 - rnd() * 40, rotation: (rnd() - 0.5) * 40, x: (rnd() - 0.5) * 18 }));
        gsap.set(ems, { '--k': 0 });
        const total = Math.min(0.9, chars.length * 0.02);
        t.to(chars, { opacity: 1, y: 0, x: 0, rotation: 0, duration: 0.55, ease: 'back.out(2.2)', stagger: total / chars.length, clearProps: 'transform' }, 0.05);
        t.fromTo(ems, { '--k': 0 }, { '--k': 1, duration: 0.5, ease: 'power3.inOut', stagger: 0.12 }, total + 0.35);
      }
      const els = $$('[data-a]', slide).filter((e) => e.dataset.a !== 'title');
      const clean = { clearProps: 'transform,opacity,visibility,clipPath' };
      if (quick) t.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.25, ...clean }, 0);
      else t.fromTo(els, { opacity: 0, y: 40, rotation: -0.6 }, { opacity: 1, y: 0, rotation: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1, ...clean }, 0.25);
    },
    // tiras horizontales que entran por lados alternos y salen por el lado contrario
    transition: {
      out: (tl) => tl.fromTo(strips, { x: 0, xPercent: (i) => (i % 2 ? 101 : -101) }, { xPercent: 0, duration: 0.32, ease: 'power3.out', stagger: 0.04 }),
      in: (tl) => tl.to(strips, { xPercent: (i) => (i % 2 ? -101 : 101), duration: 0.32, ease: 'power3.in', stagger: 0.04 }, '+=0.02'),
      reset: () => gsap.set(strips, { x: 0, xPercent: (i) => (i % 2 ? 101 : -101) }),
    },
  };
  return baseDeck({ phases: PHASES, notes: NOTES, onChange, effects });
}
