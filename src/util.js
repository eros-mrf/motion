import { gsap } from 'gsap';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;

// RNG determinista (mulberry32): mismas semillas → mismos fotogramas
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const motion = { reduced: false };

// Parte un título en palabras y letras (con máscara) para la animación de entrada.
export function splitTitle(el) {
  if (el.dataset.split) return el._chars;
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const chars = [];
  text.split(/\s+/).forEach((word, i, arr) => {
    const w = document.createElement('span');
    w.className = 'wd';
    w.setAttribute('aria-hidden', 'true');
    [...word].forEach((c) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = c;
      w.appendChild(s);
      chars.push(s);
    });
    el.appendChild(w);
    if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
  });
  el.dataset.split = '1';
  el._chars = chars;
  return chars;
}

// Mensaje corto (teclas, estados)
let toastT;
export function toast(msg) {
  const t = $('#shortcuts');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 1800);
}

// ---- Confeti 2D (rectángulos con rotación, gravedad y arrastre, ver skill particle-system) ----
const cv = () => $('#confetti');
let parts = [];
let running = false;
export function confetti(x = 960, y = 700, n = 140, colors = ['#2ee6c5', '#ffc247', '#a07bff', '#ff5c3a', '#ffffff']) {
  if (motion.reduced) return;
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
    const s = 500 + Math.random() * 900;
    parts.push({
      x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
      w: 10 + Math.random() * 14, h: 6 + Math.random() * 8,
      r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 14,
      life: 1, c: colors[(Math.random() * colors.length) | 0],
    });
  }
  if (!running) { running = true; gsap.ticker.add(stepConfetti); }
}
function stepConfetti(_, dt) {
  const c = cv();
  const ctx = c.getContext('2d');
  const d = Math.min(dt / 1000, 0.05);
  ctx.clearRect(0, 0, c.width, c.height);
  parts = parts.filter((p) => p.life > 0 && p.y < c.height + 40);
  for (const p of parts) {
    p.vy += 1500 * d;
    p.vx *= 0.985; p.vy *= 0.985;
    p.x += p.vx * d; p.y += p.vy * d; p.r += p.vr * d;
    p.life -= d * 0.45;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6));
    ctx.translate(p.x, p.y); ctx.rotate(p.r);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }
  if (!parts.length) { running = false; gsap.ticker.remove(stepConfetti); ctx.clearRect(0, 0, c.width, c.height); }
}
