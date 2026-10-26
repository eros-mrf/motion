// Ficha holográfica: 9 paneles (uno por campo). Los pendientes orbitan; los completos
// vuelan y se acoplan a la tarjeta. Al completar los 9, la tarjeta gira y estalla en chispas.
import * as THREE from 'three';
import { gsap } from 'gsap';
import { rng, motion } from '../../../src/util.js';

const TAU = Math.PI * 2;
const COLS = 3, PW = 1.3, PH = 0.84, GAP = 0.08;

function drawPanel(field, done, text) {
  const c = document.createElement('canvas');
  c.width = 540; c.height = 334;
  const g = c.getContext('2d');
  const col = done ? '#b8ff3c' : '#ffcf3d';
  const grd = g.createLinearGradient(0, 0, 540, 334);
  grd.addColorStop(0, done ? '#12361f' : '#0e1f1a'); grd.addColorStop(1, '#06130e');
  g.fillStyle = grd; g.fillRect(0, 0, 540, 334);
  g.strokeStyle = col; g.lineWidth = 6; g.strokeRect(3, 3, 534, 328);
  g.fillStyle = col; g.fillRect(0, 0, 90, 8);
  g.font = '800 92px Syne, sans-serif'; g.fillText(field.icon, 28, 112);
  g.fillStyle = '#ecf8f0'; g.font = '800 44px Syne, sans-serif';
  const words = (field.short || field.name).split(' '); let line = '', y = 188;
  words.forEach((w) => { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > 480 && line) { g.fillText(line, 28, y); y += 50; line = w; } else line = t; });
  g.fillText(line, 28, y);
  g.font = '600 30px "IBM Plex Mono", monospace'; g.fillStyle = col;
  g.fillText(done ? '✓ COMPLETA' : '· PENDIENTE', 28, 312);
  if (done && text) {
    g.fillStyle = 'rgba(236,248,240,.62)'; g.font = '500 24px Manrope, sans-serif';
    g.fillText(text.slice(0, 28) + (text.length > 28 ? '…' : ''), 28, y + 40);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  return tex;
}

export function createFicha(canvas, fields) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 80);
  camera.position.set(0, 0, 7.9);

  const rig = new THREE.Group();
  scene.add(rig);

  // placa trasera con brillo según progreso
  const CW = COLS * PW + (COLS - 1) * GAP + 0.4, CH = 3 * PH + 2 * GAP + 0.4;
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), new THREE.MeshBasicMaterial({ color: 0x0c2a1f, transparent: true, opacity: 0.55 }));
  plate.position.z = -0.06;
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(CW + 0.34, CH + 0.34), new THREE.MeshBasicMaterial({ color: 0xb8ff3c, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false }));
  glow.position.z = -0.1;
  const frame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(CW, CH)), new THREE.LineBasicMaterial({ color: 0xb8ff3c, transparent: true, opacity: 0.5 }));
  rig.add(plate, glow, frame);

  const panels = fields.map((f, i) => {
    const col = i % COLS, row = Math.floor(i / COLS);
    const dock = new THREE.Vector3((col - 1) * (PW + GAP), (1 - row) * (PH + GAP), 0);
    const mat = new THREE.MeshBasicMaterial({ map: drawPanel(f, false), side: THREE.DoubleSide, transparent: true, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), mat);
    mesh.scale.setScalar(0.62);
    rig.add(mesh);
    return { f, i, mesh, dock, docked: false, done: false, tween: null, ph: (i / fields.length) * TAU, text: '' };
  });

  // chispas ambientales + ráfaga
  const R = rng(33), NS = 220, sp = new Float32Array(NS * 3), sv = new Float32Array(NS * 3), sl = new Float32Array(NS);
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const sparks = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xd8ff7a, size: 0.09, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
  sparks.frustumCulled = false; rig.add(sparks);
  function burst() {
    for (let i = 0; i < NS; i++) {
      const a = R() * TAU, b = (R() - 0.5) * Math.PI, s = 1.5 + R() * 4.5;
      sp.set([0, 0, 0.2], i * 3); sv.set([Math.cos(a) * Math.cos(b) * s, Math.sin(b) * s, Math.sin(a) * Math.cos(b) * s], i * 3); sl[i] = 1;
    }
  }
  for (let i = 0; i < NS; i++) sp.set([0, 0, -50], i * 3);

  let t = 0, mx = 0, my = 0, complete = false, spin = null;
  canvas.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width - 0.5) * 2; my = ((e.clientY - r.top) / r.height - 0.5) * 2; });

  function dockPanel(p) {
    p.docked = false; p.tween?.kill();
    const from = p.mesh.position.clone();
    const o = { k: 0 };
    p.tween = gsap.to(o, {
      k: 1, duration: motion.reduced ? 0.01 : 1.1, ease: 'expo.out',
      onUpdate: () => { p.mesh.position.lerpVectors(from, p.dock, o.k); p.mesh.scale.setScalar(0.62 + 0.38 * o.k); p.mesh.rotation.y = (1 - o.k) * Math.PI * 2; p.mesh.rotation.z = (1 - o.k) * 0.4; },
      onComplete: () => { p.docked = true; },
    });
  }
  function undock(p) { p.tween?.kill(); p.docked = false; p.mesh.rotation.set(0, 0, 0); gsap.to(p.mesh.scale, { x: 0.62, y: 0.62, z: 0.62, duration: 0.4 }); }

  // states: [{done, text}] por campo
  function setStates(states) {
    let n = 0;
    states.forEach((s, i) => {
      const p = panels[i];
      if (s.done) n++;
      const changed = s.done !== p.done || s.text !== p.text;
      if (changed) {
        p.mesh.material.map.dispose();
        p.mesh.material.map = drawPanel(p.f, s.done, s.text); p.mesh.material.needsUpdate = true;
      }
      if (s.done && !p.done) dockPanel(p);
      if (!s.done && p.done) undock(p);
      p.done = s.done; p.text = s.text;
    });
    const k = n / panels.length;
    gsap.to(glow.material, { opacity: 0.08 + k * 0.32, duration: 0.6 });
    gsap.to(frame.material, { opacity: 0.35 + k * 0.65, duration: 0.6 });
    const isComplete = n === panels.length;
    if (isComplete && !complete) {
      spin?.kill();
      spin = gsap.fromTo(rig.rotation, { y: 0 }, { y: TAU, duration: motion.reduced ? 0.01 : 1.8, ease: 'power3.inOut', delay: 0.9 });
      setTimeout(burst, 1500);
    }
    complete = isComplete;
    return n;
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  function frame_(dt) {
    t += dt * (motion.reduced ? 0.15 : 1);
    if (!spin || !spin.isActive()) { rig.rotation.y += ((mx * 0.28) - rig.rotation.y) * (1 - Math.exp(-dt * 3)); rig.rotation.x += ((my * 0.16) - rig.rotation.x) * (1 - Math.exp(-dt * 3)); }
    panels.forEach((p) => {
      if (p.docked || (p.tween && p.tween.isActive() && p.done)) return;
      // órbita elíptica alrededor de la tarjeta
      const a = t * 0.35 + p.ph, rx = 2.75, ry = 2.3;
      p.mesh.position.set(Math.cos(a) * rx, Math.sin(a) * ry, Math.sin(a * 2) * 0.6 + 0.6);
      p.mesh.rotation.z = Math.sin(a) * 0.12;
    });
    // chispas
    const pos = sg.attributes.position.array;
    for (let i = 0; i < NS; i++) {
      if (sl[i] > 0) { pos[i * 3] += sv[i * 3] * dt; pos[i * 3 + 1] += sv[i * 3 + 1] * dt; pos[i * 3 + 2] += sv[i * 3 + 2] * dt; sv[i * 3 + 1] -= 3 * dt; sl[i] -= dt * 0.6; if (sl[i] <= 0) pos[i * 3 + 2] = -50; }
    }
    sg.attributes.position.needsUpdate = true;
    glow.material.opacity += Math.sin(t * 2) * 0.0015;
    renderer.render(scene, camera);
  }

  return { frame: frame_, resize, setStates, burst, get complete() { return complete; } };
}
