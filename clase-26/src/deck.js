// Clase 26 · lo propio de esta clase sobre el motor común (core/deck-base.js): títulos que se «teclean» con cursor,
// frase destacada como texto seleccionado y transición de persiana (10 franjas verticales).
import { gsap } from 'gsap';
import { $, $$ } from '../../src/util.js';
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
  const strips = Array.from({ length: 10 }, () => pane.appendChild(document.createElement('i')));
  const caret = document.createElement('i'); caret.className = 'caret'; caret.setAttribute('aria-hidden', 'true');
  const effects = {
    clear: '.title .ch',
    // el título se escribe letra a letra con un cursor; la frase destacada se «selecciona» después
    enter(slide, t, quick) {
      caret.remove();
      const title = $('.title[data-a="title"]', slide);
      if (title) splitChars(title);
      const chars = title ? $$('.ch', title) : [], ems = title ? $$('em', title) : [];
      if (quick) { gsap.set(chars, { opacity: 1 }); gsap.set(ems, { '--k': 1 }); }
      else if (chars.length) {
        gsap.set(chars, { opacity: 0 }); gsap.set(ems, { '--k': 0 });
        const total = Math.min(1.15, chars.length * 0.022);
        t.to(chars, { opacity: 1, duration: 0.001, stagger: total / chars.length, onStart() { this.targets()[0].after(caret); } }, 0.05);
        t.fromTo(ems, { '--k': 0 }, { '--k': 1, duration: 0.55, ease: 'power3.inOut', stagger: 0.12 }, total + 0.1);
      }
      if (title && quick) chars.at(-1)?.after(caret);
      const els = $$('[data-a]', slide).filter((e) => e.dataset.a !== 'title');
      const clean = { clearProps: 'transform,opacity,visibility,clipPath' };
      if (quick) t.fromTo(els, { opacity: 0 }, { opacity: 1, duration: 0.25, ...clean }, 0);
      else t.fromTo(els, { opacity: 0, y: 34, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1, ...clean }, 0.25);
    },
    // persiana: las franjas bajan de izquierda a derecha y suben al descubrir la diapositiva nueva
    transition: {
      out: (tl) => tl.set(strips, { transformOrigin: 'top' }).to(strips, { scaleY: 1, duration: 0.3, ease: 'power2.out', stagger: { amount: 0.3, from: 'start' } }),
      in: (tl) => tl.set(strips, { transformOrigin: 'bottom' }).to(strips, { scaleY: 0, duration: 0.3, ease: 'power2.in', stagger: { amount: 0.3, from: 'start' } }, '+=0.02'),
      reset: () => gsap.set(strips, { scaleY: 0, transformOrigin: 'top' }),
    },
  };
  return baseDeck({ phases: PHASES, notes: NOTES, onChange, effects });
}
