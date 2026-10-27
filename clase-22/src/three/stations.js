// Carrusel 3D de cuatro andenes. Cada andén tiene un letrero con su número; cuatro grupos (A–D) rotan por los puestos.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';

const HEX = { amber: 0xffc233, teal: 0x2fd6b5, lilac: 0xb69cff, sky: 0x62b0ff };
const CSS = { amber: '#ffc233', teal: '#2fd6b5', lilac: '#b69cff', sky: '#62b0ff' };
const GCOL = [0xff6b8a, 0x43e08f, 0x62b0ff, 0xffc233];
const GCSS = ['#ff6b8a', '#43e08f', '#62b0ff', '#ffc233'];

function signTexture(n, name, css) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#0c060e'; g.fillRect(0, 0, 512, 256);
  g.fillStyle = css; g.fillRect(0, 0, 14, 256);
  g.fillStyle = css; g.font = '800 170px "Bricolage Grotesque", sans-serif'; g.textBaseline = 'middle'; g.fillText(String(n), 44, 138);
  g.fillStyle = '#f8f1e7'; g.font = '700 38px "DM Sans", sans-serif';
  const words = name.split(' '); let line = '', y = 92;
  words.forEach((w) => { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > 270 && line) { g.fillText(line, 210, y); line = w; y += 46; } else line = t; });
  g.fillText(line, 210, y);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return tex;
}

export function createStations(canvas, labelsEl, stations, onPick) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
  camera.position.set(0, 6.2, 13.8);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.enablePan = false; controls.enableZoom = false; controls.minPolarAngle = 0.85; controls.maxPolarAngle = 1.5;
  controls.target.set(0, 0.7, 0);
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const sun = new THREE.DirectionalLight(0xfff0d8, 1.8); sun.position.set(5, 9, 7); scene.add(sun);
  const glowL = new THREE.PointLight(0xffc233, 22, 14); glowL.position.set(0, 3, 3); scene.add(glowL);

  // plataforma circular
  const ring = new THREE.Group(); scene.add(ring);
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(5.1, 5.3, 0.24, 72), new THREE.MeshStandardMaterial({ color: 0x20132a, roughness: 0.6, metalness: 0.2 }));
  floor.position.y = -0.12; ring.add(floor);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.05, 12, 120), new THREE.MeshBasicMaterial({ color: 0xffc233 })); rim.rotation.x = Math.PI / 2; rim.position.y = 0.02; ring.add(rim);
  const rails = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.03, 8, 120), new THREE.MeshBasicMaterial({ color: 0xffe2aa, transparent: true, opacity: 0.4 })); rails.rotation.x = Math.PI / 2; rails.position.y = 0.01; ring.add(rails);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.65, 1.2, 28), new THREE.MeshStandardMaterial({ color: 0x2a1832, emissive: 0xffc233, emissiveIntensity: 0.25, roughness: 0.4 })); hub.position.y = 0.6; ring.add(hub);
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 4), new THREE.MeshStandardMaterial({ color: 0xffc233, emissive: 0xffc233, emissiveIntensity: 0.5 })); arrow.position.y = 1.7; ring.add(arrow);

  const R = 3.3;
  const booths = stations.map((s, i) => {
    const a = (i / 4) * Math.PI * 2; // 0 → frente (+z)
    const g = new THREE.Group(); g.position.set(Math.sin(a) * R, 0, Math.cos(a) * R); g.rotation.y = a; ring.add(g);
    const col = HEX[s.c];
    const plat = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.16, 1.7), new THREE.MeshStandardMaterial({ color: 0x3a2548, roughness: 0.5 })); plat.position.y = 0.08; g.add(plat);
    const edge = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.05, 0.1), new THREE.MeshBasicMaterial({ color: col })); edge.position.set(0, 0.18, 0.85); g.add(edge);
    const postM = new THREE.MeshStandardMaterial({ color: 0xd9c9bd, roughness: 0.4, metalness: 0.4 });
    [[-1, -0.7], [1, -0.7], [-1, 0.7], [1, 0.7]].forEach(([x, z]) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.7, 10), postM); p.position.set(x, 1.0, z); g.add(p); });
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.12, 1.9), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.2, roughness: 0.35 })); canopy.position.y = 1.9; g.add(canopy);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.85), new THREE.MeshBasicMaterial({ map: signTexture(s.n, s.name, CSS[s.c]) })); sign.position.set(0, 1.36, 0.97); g.add(sign);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.95, 0.04), new THREE.MeshBasicMaterial({ color: col })); frame.position.set(0, 1.36, 0.94); g.add(frame);
    const bench = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.12, 0.35), new THREE.MeshStandardMaterial({ color: 0x1a0f12 })); bench.position.set(0, 0.5, -0.45); g.add(bench);
    [canopy, plat, sign, frame, bench].forEach((m) => { m.userData.i = i; });
    return { g, a, canopy, col, sign, hit: [canopy, plat, sign, frame] };
  });

  // grupos
  const tokens = GCOL.map((c, gi) => {
    const t = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.55, 18), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.25, roughness: 0.35 }));
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 20, 14), new THREE.MeshStandardMaterial({ color: c, roughness: 0.3 }));
    body.position.y = 0.44; head.position.y = 0.88; t.add(body, head);
    scene.add(t);
    const el = document.createElement('div'); el.className = 'lb stlb'; el.textContent = 'Grupo ' + 'ABCD'[gi]; el.style.setProperty('--lc', GCSS[gi]); labelsEl.appendChild(el);
    return { t, el, ang: 0, gi };
  });
  const stLabels = stations.map((s) => { const el = document.createElement('div'); el.className = 'lb stlb'; el.textContent = s.name; el.style.setProperty('--lc', CSS[s.c]); labelsEl.appendChild(el); return el; });

  // chispas
  const NP = 90, pp = new Float32Array(NP * 3);
  for (let i = 0; i < NP; i++) pp.set([(Math.random() - 0.5) * 11, Math.random() * 4.5, (Math.random() - 0.5) * 11], i * 3);
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffe2aa, size: 0.05, transparent: true, opacity: 0.7, depthWrite: false })));

  let sel = 0, round = 0;
  const state = { rot: 0, tokAng: { 0: 0, 1: 1, 2: 2, 3: 3 } };
  // el puesto s queda al frente cuando ring.rotation.y = -ang(s)
  function select(i) {
    sel = i;
    const target = -booths[i].a;
    // camino más corto
    let cur = state.rot; let d = ((target - cur + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
    gsap.to(state, { rot: cur + d, duration: motion.reduced ? 0.01 : 1.1, ease: 'power3.inOut' });
    const col = new THREE.Color(HEX[stations[i].c]);
    gsap.to(glowL.color, { r: col.r, g: col.g, b: col.b, duration: 0.6 });
    booths.forEach((b, k) => gsap.to(b.canopy.material, { emissiveIntensity: k === i ? 0.75 : 0.18, duration: 0.5 }));
  }
  function setRound(r, animate = true) {
    round = r;
    tokens.forEach((tk) => {
      const dest = (tk.gi + r) % 4;
      const from = state.tokAng[tk.gi];
      // avanza siempre en el mismo sentido (+): destino = próximo múltiplo equivalente
      let to = dest; while (to < from - 0.001) to += 4;
      gsap.to(state.tokAng, { [tk.gi]: to, duration: animate && !motion.reduced ? 1.3 : 0.01, ease: 'power2.inOut' });
    });
  }

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const hits = booths.flatMap((b) => b.hit);
  const pickI = (e) => { const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); const h = ray.intersectObjects(hits, false)[0]; return h ? h.object.userData.i : -1; };
  let down = null;
  canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => { if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return; const i = pickI(e); if (i >= 0) onPick?.(i); });
  canvas.addEventListener('pointermove', (e) => { canvas.style.cursor = pickI(e) >= 0 ? 'pointer' : 'grab'; });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  const v3 = new THREE.Vector3();
  const put = (el, p, dy) => { v3.copy(p); v3.y += dy; v3.project(camera); el.style.left = ((v3.x + 1) / 2) * canvas.clientWidth + 'px'; el.style.top = ((1 - v3.y) / 2) * canvas.clientHeight + 'px'; };
  let t = 0;
  function frame(dt) {
    t += dt * (motion.reduced ? 0.2 : 1);
    controls.update();
    ring.rotation.y = state.rot;
    arrow.rotation.y += dt * 1.2; arrow.position.y = 1.7 + Math.sin(t * 2) * 0.08;
    ring.updateMatrixWorld(true);
    const wp = new THREE.Vector3();
    booths.forEach((b, i) => { b.g.getWorldPosition(wp); put(stLabels[i], wp, 2.55); });
    tokens.forEach((tk) => {
      const slot = state.tokAng[tk.gi]; // puesto (continuo)
      const a = (slot / 4) * Math.PI * 2;
      // posición: sobre la plataforma del puesto correspondiente (en el marco del anillo)
      const local = new THREE.Vector3(Math.sin(a) * (R - 0.15), 0.16, Math.cos(a) * (R - 0.15));
      const off = (tk.gi - 1.5) * 0.46;
      const tang = new THREE.Vector3(Math.cos(a), 0, -Math.sin(a)).multiplyScalar(off);
      local.add(tang);
      local.applyMatrix4(ring.matrixWorld);
      tk.t.position.copy(local);
      tk.t.position.y += Math.abs(Math.sin(t * 3 + tk.gi)) * 0.03;
      put(tk.el, tk.t.position, 1.35);
    });
    const p = pg.attributes.position.array;
    for (let i = 0; i < NP; i++) { p[i * 3 + 1] += dt * 0.15; if (p[i * 3 + 1] > 4.5) p[i * 3 + 1] = 0; }
    pg.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  }
  select(0); setRound(0, false);
  return { frame, resize, select, setRound };
}
