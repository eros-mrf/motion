// Carrusel 3D de fuentes: cada tarjeta es una "página web" dibujada en un canvas 2D (CanvasTexture).
// Arrastrar = girar con inercia · clic = auditar la tarjeta (se centra con GSAP).
import * as THREE from 'three';
import { gsap } from 'gsap';
import { rng, motion } from '../../../src/util.js';

const TAU = Math.PI * 2;

function wrap(ctx, text, x, y, maxW, lh, maxLines = 4) {
  const words = text.split(' ');
  let line = '', n = 0;
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && line) {
      ctx.fillText(line, x, y); y += lh; line = w; if (++n >= maxLines - 1) { }
    } else line = t;
  }
  ctx.fillText(line, x, y);
  return y + lh;
}

function drawCard(src, mark) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 700;
  const g = c.getContext('2d');
  const col = src.color;
  const grd = g.createLinearGradient(0, 0, 0, 700);
  grd.addColorStop(0, '#0f2a21'); grd.addColorStop(1, '#06130e');
  g.fillStyle = grd; g.fillRect(0, 0, 512, 700);
  // barra de navegador
  g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(0, 0, 512, 56);
  ['#ff5f57', '#ffbd2e', '#28c840'].forEach((cc, i) => { g.fillStyle = cc; g.beginPath(); g.arc(30 + i * 26, 28, 8, 0, TAU); g.fill(); });
  g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(130, 14, 360, 28);
  g.fillStyle = 'rgba(255,255,255,.55)'; g.font = '500 17px "IBM Plex Mono", monospace';
  g.fillText(src.host.slice(0, 30), 142, 34);
  // tipo
  g.fillStyle = col; g.fillRect(34, 92, 4, 120);
  g.font = '600 20px "IBM Plex Mono", monospace'; g.fillStyle = col;
  g.fillText(src.kind.toUpperCase(), 52, 112);
  g.fillStyle = '#ecf8f0'; g.font = '800 40px Syne, sans-serif';
  const y = wrap(g, src.title, 52, 158, 420, 46, 3);
  g.fillStyle = 'rgba(236,248,240,.7)'; g.font = '500 25px Manrope, sans-serif';
  wrap(g, src.sub, 52, y + 14, 420, 32, 3);
  // líneas de texto simuladas
  g.fillStyle = 'rgba(255,255,255,.12)';
  for (let i = 0; i < 8; i++) g.fillRect(34, 400 + i * 30, 444 - ((i * 53) % 150), 11);
  // ficha inferior
  g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(0, 650, 512, 50);
  g.fillStyle = col; g.fillRect(0, 696, 512, 4);
  if (mark) {
    g.save(); g.translate(256, 350); g.rotate(-0.22);
    g.strokeStyle = mark.color; g.lineWidth = 8; g.fillStyle = 'rgba(4,12,10,.78)';
    g.fillRect(-190, -52, 380, 104); g.strokeRect(-190, -52, 380, 104);
    g.fillStyle = mark.color; g.font = '800 54px Syne, sans-serif'; g.textAlign = 'center';
    g.fillText(mark.text, 0, 18);
    g.restore();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createLibrary(canvas, sources, onSelect) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  camera.position.set(0, 1.4, 12.2);
  camera.lookAt(0, 0.1, 0);

  const ring = new THREE.Group();
  scene.add(ring);
  const N = sources.length, Rd = 4.7, step = TAU / N;
  const cards = sources.map((s, i) => {
    const holder = new THREE.Group();
    const a = i * step;
    holder.position.set(Math.sin(a) * Rd, 0, Math.cos(a) * Rd);
    holder.rotation.y = a;
    const tex = drawCard(s);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 3.7), new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide, toneMapped: false }));
    const edge = new THREE.Mesh(new THREE.PlaneGeometry(2.88, 3.88), new THREE.MeshBasicMaterial({ color: new THREE.Color(s.color), transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false }));
    edge.position.z = -0.02;
    const back = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 3.7), new THREE.MeshBasicMaterial({ color: 0x0b1f18 }));
    back.rotation.y = Math.PI; back.position.z = -0.012;
    holder.add(edge, mesh, back);
    ring.add(holder);
    return { holder, mesh, edge, tex, src: s, lift: 0, liftT: 0, i, mark: null };
  });
  // si las tipografías aún no estaban listas, redibuja
  document.fonts?.ready.then(() => cards.forEach((c) => { c.tex.dispose(); c.mesh.material.map = drawCard(c.src, c.mark); c.mesh.material.needsUpdate = true; c.tex = c.mesh.material.map; }));

  // suelo: anillos de luz
  const floor = new THREE.Group();
  [Rd - 0.6, Rd + 0.1, Rd + 0.9].forEach((r, k) => {
    const m = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.03, 128), new THREE.MeshBasicMaterial({ color: k === 1 ? 0xb8ff3c : 0x4d8dff, transparent: true, opacity: k === 1 ? 0.7 : 0.3, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    m.rotation.x = -Math.PI / 2; m.position.y = -1.85; floor.add(m);
  });
  scene.add(floor);
  // polvo de datos
  const R = rng(61), NP = 260, pp = new Float32Array(NP * 3);
  for (let i = 0; i < NP; i++) { const a = R() * TAU, r = 1 + R() * 7; pp.set([Math.sin(a) * r, -1.8 + R() * 5, Math.cos(a) * r], i * 3); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  const dust = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xb8ff3c, size: 0.045, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(dust);

  // ---- interacción ----
  const state = { rot: 0, vel: 0, drag: false, moved: 0, auto: true, sel: -1, hover: -1, tween: null };
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const meshes = cards.map((c) => c.mesh);
  const pick = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const h = ray.intersectObjects(meshes, false)[0];
    return h ? meshes.indexOf(h.object) : -1;
  };
  let lastX = 0;
  canvas.addEventListener('pointerdown', (e) => { state.drag = true; state.moved = 0; lastX = e.clientX; state.auto = false; state.tween?.kill(); canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => {
    if (state.drag) { const dx = e.clientX - lastX; lastX = e.clientX; state.moved += Math.abs(dx); state.rot += dx * 0.006; state.vel = dx * 0.006; }
    state.hover = pick(e); canvas.style.cursor = state.hover >= 0 ? 'pointer' : state.drag ? 'grabbing' : 'grab';
  });
  canvas.addEventListener('pointerup', (e) => {
    state.drag = false;
    if (state.moved < 6) { const i = pick(e); if (i >= 0) select(i); }
  });

  function select(i) {
    state.sel = i; state.auto = false; state.vel = 0;
    // girar el anillo para dejar la tarjeta i al frente (camino más corto)
    const target = -cards[i].holder.rotation.y;
    let d = ((target - state.rot) % TAU + TAU * 1.5) % TAU - Math.PI;
    state.tween?.kill();
    const o = { v: state.rot };
    state.tween = gsap.to(o, { v: state.rot + d, duration: motion.reduced ? 0.01 : 1.1, ease: 'expo.out', onUpdate: () => { state.rot = o.v; } });
    onSelect?.(cards[i].src, i);
  }
  function markDone(i, text, color) {
    const c = cards[i];
    c.mark = { text, color };
    c.mesh.material.map.dispose();
    c.mesh.material.map = drawCard(c.src, c.mark);
    c.mesh.material.needsUpdate = true; c.tex = c.mesh.material.map;
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  let t = 0;
  function frame(dt) {
    t += dt;
    if (state.auto && !motion.reduced) state.rot += dt * 0.12;
    if (!state.drag) { state.rot += state.vel; state.vel *= 0.94; }
    ring.rotation.y = state.rot;
    dust.rotation.y = -t * 0.04;
    cards.forEach((c, i) => {
      const front = Math.cos(c.holder.rotation.y + state.rot); // 1 = frente
      const selected = state.sel === i, hov = state.hover === i;
      c.liftT = selected ? 1 : hov ? 0.5 : 0;
      c.lift += (c.liftT - c.lift) * (1 - Math.exp(-dt * 8));
      c.holder.position.x = Math.sin(c.holder.rotation.y) * (Rd + c.lift * 0.9);
      c.holder.position.z = Math.cos(c.holder.rotation.y) * (Rd + c.lift * 0.9);
      c.holder.position.y = Math.sin(t * 1.2 + i) * 0.06 + c.lift * 0.12;
      c.edge.material.opacity = (selected ? 0.75 : hov ? 0.35 : 0) * (0.7 + 0.3 * Math.sin(t * 5));
      c.mesh.material.color.setScalar(0.45 + 0.55 * Math.max(0, (front + 0.6) / 1.6) + c.lift * 0.2);
    });
    renderer.render(scene, camera);
  }

  return { frame, resize, select, markDone, get selected() { return state.sel; } };
}
