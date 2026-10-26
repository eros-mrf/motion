// Comparación justa (distritos ficticios): "casos totales" (columnas) vs "por cada 1.000 personas" (pictograma).
// Cada distrito se muestra como una plataforma de 1.000 cubos (1 cubo = 1 persona); los casos resaltan en color.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { rng, motion } from '../../../src/util.js';

const COL = { cobalt: 0x2447ff, verm: 0xff4a1c, ink: 0x15120f, paper: 0xfffaf0, person: 0xcdbf9f };
const COLS = 40, ROWS = 25, SP = 0.11;

export function createFair(canvas, labelsEl, districts) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
  camera.position.set(0, 6.2, 15.4);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.enablePan = false; controls.enableZoom = false;
  controls.minPolarAngle = 0.7; controls.maxPolarAngle = 1.5; controls.minAzimuthAngle = -0.8; controls.maxAzimuthAngle = 0.8;
  controls.target.set(0, 1.0, 0);
  scene.add(new THREE.AmbientLight(0xffffff, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(-5, 9, 7); scene.add(key);

  const R = rng(99);
  const PW = COLS * SP, PD = ROWS * SP;
  const state = { k: 0 };
  const dm = new THREE.Object3D();
  const labels = [];
  const mkLb = (cls, html, pos) => {
    const el = document.createElement('div'); el.className = 'lb ' + cls; el.innerHTML = html;
    labelsEl.appendChild(el); const o = { el, pos: pos.clone() }; labels.push(o); return o;
  };

  const groups = districts.map((d, di) => {
    const g = new THREE.Group();
    g.position.x = di === 0 ? -3.4 : 3.4;
    scene.add(g);
    const color = COL[d.color];
    // plataforma
    const plat = new THREE.Mesh(new THREE.BoxGeometry(PW + 0.4, 0.2, PD + 0.4), new THREE.MeshLambertMaterial({ color: COL.paper }));
    plat.position.y = -0.1;
    const platHull = new THREE.Mesh(new THREE.BoxGeometry(PW + 0.54, 0.34, PD + 0.54), new THREE.MeshBasicMaterial({ color: COL.ink, side: THREE.BackSide }));
    platHull.position.y = -0.1;
    g.add(plat, platHull);
    // 1.000 personas
    const people = new THREE.InstancedMesh(new THREE.BoxGeometry(SP * 0.72, 1, SP * 0.72), new THREE.MeshLambertMaterial({ color: COL.person }), COLS * ROWS);
    people.instanceMatrix.setUsage(THREE.DynamicDrawUsage); people.frustumCulled = false;
    g.add(people);
    // casos por 1.000 personas: cubos de color
    const caseIdx = new Set();
    while (caseIdx.size < d.per1000) caseIdx.add((R() * COLS * ROWS) | 0);
    const cases = [...caseIdx].map((ix) => {
      const cx = ix % COLS, cz = (ix / COLS) | 0;
      const m = new THREE.Mesh(new THREE.BoxGeometry(SP * 1.5, 1, SP * 1.5), new THREE.MeshLambertMaterial({ color }));
      const h = new THREE.Mesh(new THREE.BoxGeometry(SP * 1.5 + 0.05, 1, SP * 1.5 + 0.05), new THREE.MeshBasicMaterial({ color: COL.ink, side: THREE.BackSide }));
      const x = (cx - COLS / 2 + 0.5) * SP, z = (cz - ROWS / 2 + 0.5) * SP;
      m.position.set(x, 0, z); h.position.set(x, 0, z); g.add(m, h);
      return { m, h, ix };
    });
    // columna de casos totales
    const colH = d.cases * 0.036;
    const col = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1, 1.9), new THREE.MeshLambertMaterial({ color }));
    const colHull = new THREE.Mesh(new THREE.BoxGeometry(2.54, 1, 2.04), new THREE.MeshBasicMaterial({ color: COL.ink, side: THREE.BackSide }));
    g.add(colHull, col);
    const name = mkLb('axis', d.name.toUpperCase(), new THREE.Vector3(g.position.x, -0.3, PD / 2 + 0.8));
    const val = mkLb('val', '', new THREE.Vector3(g.position.x, colH + 0.7, 0));
    return { d, g, people, cases, col, colHull, colH, name, val };
  });

  function layout() {
    const k = state.k, N = COLS * ROWS;
    groups.forEach((G) => {
      // personas: aparecen en barrido con k
      for (let i = 0; i < N; i++) {
        const cx = i % COLS, cz = (i / COLS) | 0;
        const lag = (cz / ROWS) * 0.5;
        const s = Math.min(1, Math.max(0, (k - lag) / 0.5));
        const e = s * s * (3 - 2 * s);
        dm.position.set((cx - COLS / 2 + 0.5) * SP, 0.05 * e, (cz - ROWS / 2 + 0.5) * SP);
        dm.scale.set(1, Math.max(0.0001, 0.1 * e), 1);
        dm.updateMatrix(); G.people.setMatrixAt(i, dm.matrix);
      }
      G.people.instanceMatrix.needsUpdate = true;
      const kc = Math.min(1, Math.max(0, (k - 0.4) / 0.6));
      G.cases.forEach((c, i) => {
        const h = Math.max(0.0001, kc * 0.55);
        c.m.scale.y = h; c.m.position.y = h / 2; c.h.scale.y = h + 0.05; c.h.position.y = h / 2 - 0.02;
        c.m.visible = c.h.visible = kc > 0.01;
      });
      const kt = 1 - Math.min(1, k * 1.6);
      const hh = Math.max(0.0001, G.colH * kt);
      G.col.scale.y = hh; G.col.position.y = hh / 2; G.colHull.scale.y = hh + 0.14; G.colHull.position.y = hh / 2 - 0.02;
      G.col.visible = G.colHull.visible = kt > 0.01;
      G.val.pos.y = k < 0.5 ? hh + 0.6 : 1.2;
      G.val.pos.z = k < 0.5 ? 0 : 0;
      G.val.el.innerHTML = k < 0.5 ? `${G.d.cases}<small> casos</small>` : `${G.d.per1000}<small> por 1.000</small>`;
      G.val.el.style.fontSize = '28px';
    });
  }

  function setMode(m, instant) {
    gsap.to(state, { k: m === 'rate' ? 1 : 0, duration: instant || motion.reduced ? 0.01 : 1.6, ease: 'power2.inOut' });
    gsap.to(camera.position, { y: m === 'rate' ? 9.4 : 6.2, z: m === 'rate' ? 13.2 : 15.4, duration: instant || motion.reduced ? 0.01 : 1.4, ease: 'expo.out' });
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  const v3 = new THREE.Vector3();
  function frame() {
    controls.update();
    layout();
    const w = canvas.clientWidth, h = canvas.clientHeight;
    labels.forEach((o) => {
      v3.copy(o.pos); v3.x = o.pos.x; v3.project(camera);
      o.el.style.left = ((v3.x + 1) / 2) * w + 'px'; o.el.style.top = ((1 - v3.y) / 2) * h + 'px';
    });
    renderer.render(scene, camera);
  }
  layout();
  return { frame, resize, setMode, get k() { return state.k; } };
}
