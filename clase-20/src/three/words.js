// Caza de palabras: las palabras de un titular flotan en 3D (etiquetas DOM ancladas a posiciones 3D,
// con paralaje real al moverse la cámara). Anillos de tinta y confeti de papel acompañan; al marcar
// una palabra sale una salpicadura de confeti desde su posición.
import * as THREE from 'three';
import { gsap } from 'gsap';
import { rng, motion } from '../../../src/util.js';

const COL = [0xff4a1c, 0x2447ff, 0xffb300, 0x0fa37f];

export function createWords(canvas, labelsEl, onToggle) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  const scene = new THREE.Scene();
  const FOV = 34, D = 14;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
  camera.position.set(0, 0, D);

  // anillos de tinta
  const rings = new THREE.Group(); scene.add(rings);
  [[5.2, 0.4, 0.2], [6.8, -0.5, 0.9], [8.4, 0.25, -0.6]].forEach(([r, rx, rz], i) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.025, 8, 160), new THREE.MeshBasicMaterial({ color: 0x15120f, transparent: true, opacity: 0.55 - i * 0.12 }));
    m.rotation.set(rx + 1.2, 0, rz); rings.add(m);
  });
  // confeti de papel (instanciado)
  const NP = 140, R = rng(7);
  const paper = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.3, 0.18), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, vertexColors: false }), NP);
  paper.instanceMatrix.setUsage(THREE.DynamicDrawUsage); paper.frustumCulled = false;
  const parts = Array.from({ length: NP }, (_, i) => ({
    p: new THREE.Vector3((R() - 0.5) * 18, (R() - 0.5) * 9, -2 - R() * 5), v: new THREE.Vector3(), r: new THREE.Euler(R() * 6, R() * 6, R() * 6), vr: (R() - 0.5) * 2, burst: 0, home: null, s: 0.6 + R(),
  }));
  parts.forEach((p, i) => { p.home = p.p.clone(); paper.setColorAt(i, new THREE.Color(COL[i % 4])); });
  scene.add(paper);

  let items = []; // {el, pos:Vector3, home:Vector3, bob}
  const v3 = new THREE.Vector3(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s3 = new THREE.Vector3(), eu = new THREE.Euler();

  function layout() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h || !items.length) return;
    const u = (2 * D * Math.tan((FOV * Math.PI) / 360)) / h; // unidades de mundo por píxel
    const maxW = w - 140, gap = 34, rowH = 118;
    const rows = []; let row = [], cw = 0;
    items.forEach((it) => {
      const iw = it.el.offsetWidth;
      if (cw + iw > maxW && row.length) { rows.push(row); row = []; cw = 0; }
      row.push({ it, iw }); cw += iw + gap;
    });
    rows.push(row);
    rows.forEach((r, ri) => {
      const total = r.reduce((a, b) => a + b.iw + gap, -gap);
      let x = -total / 2;
      const y = (ri - (rows.length - 1) / 2) * rowH;
      r.forEach(({ it, iw }, k) => {
        const px = x + iw / 2;
        it.home.set(px * u, -y * u, ((it.idx * 37) % 5 - 2) * 0.22);
        x += iw + gap;
      });
    });
  }

  function setWords(words) {
    labelsEl.innerHTML = '';
    items = words.map((t, i) => {
      const el = document.createElement('button');
      el.className = 'wd'; el.textContent = t; el.setAttribute('aria-pressed', 'false'); el.style.opacity = 0;
      el.addEventListener('click', () => { const on = el.classList.toggle('on'); el.setAttribute('aria-pressed', on); if (on) burst(it); onToggle?.(i, on, el); });
      labelsEl.appendChild(el);
      const it = { el, idx: i, home: new THREE.Vector3(), pos: new THREE.Vector3(), bob: Math.random() * 6, intro: 0 };
      return it;
    });
    layout();
    items.forEach((it, i) => { gsap.to(it, { intro: 1, duration: motion.reduced ? 0.01 : 1.1, delay: motion.reduced ? 0 : 0.07 * i, ease: 'back.out(1.5)' }); gsap.to(it.el, { opacity: 1, duration: 0.4, delay: motion.reduced ? 0 : 0.07 * i }); });
    return items.map((i) => i.el);
  }

  function burst(it) {
    let n = 0;
    parts.forEach((p) => {
      if (n >= 26 || p.burst > 0) return;
      n++; p.burst = 1;
      p.p.copy(it.pos);
      p.v.set((Math.random() - 0.5) * 9, Math.random() * 6 + 1, (Math.random() - 0.2) * 4);
    });
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    layout();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  let t = 0, mx = 0, my = 0;
  canvas.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width - 0.5) * 2; my = ((e.clientY - r.top) / r.height - 0.5) * 2; });
  labelsEl.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width - 0.5) * 2; my = ((e.clientY - r.top) / r.height - 0.5) * 2; });

  function frame(dt) {
    t += dt * (motion.reduced ? 0.15 : 1);
    const par = motion.reduced ? 0 : 1;
    camera.position.x += ((mx * 1.6 * par) - camera.position.x) * (1 - Math.exp(-dt * 2.5));
    camera.position.y += ((-my * 0.9 * par) - camera.position.y) * (1 - Math.exp(-dt * 2.5));
    camera.lookAt(0, 0, 0);
    rings.rotation.y = t * 0.12; rings.rotation.x = Math.sin(t * 0.2) * 0.1;
    parts.forEach((p, i) => {
      if (p.burst > 0) { p.v.y -= 9 * dt; p.p.addScaledVector(p.v, dt); p.burst -= dt * 0.7; if (p.burst <= 0) { p.p.copy(p.home); p.v.set(0, 0, 0); } }
      else { p.p.y = p.home.y + Math.sin(t * 0.6 + i) * 0.4; p.p.x = p.home.x + Math.cos(t * 0.4 + i * 1.3) * 0.3; }
      p.r.x += p.vr * dt; p.r.y += p.vr * dt * 0.7;
      eu.copy(p.r); q.setFromEuler(eu); s3.setScalar(p.s * (p.burst > 0 ? 1.3 : 1));
      m4.compose(p.p, q, s3); paper.setMatrixAt(i, m4);
    });
    paper.instanceMatrix.needsUpdate = true;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    items.forEach((it) => {
      it.pos.set(it.home.x, it.home.y + 6 * (1 - it.intro), it.home.z - 4 * (1 - it.intro));
      v3.copy(it.pos); v3.y += Math.sin(t * 1.6 + it.bob) * 0.1;
      v3.project(camera);
      const depth = 1 - (it.pos.z) * 0.02;
      it.el.style.left = ((v3.x + 1) / 2) * w + 'px';
      it.el.style.top = ((1 - v3.y) / 2) * h + 'px';
      it.el.style.zIndex = String(30 + Math.round(it.pos.z * 10));
      it.el.style.scale = String(depth);
    });
    renderer.render(scene, camera);
  }
  return { frame, resize, setWords, layout };
}
