// Simulación 3D "Cómo viaja un rumor": modelo simplificado de cascada en una red.
//  estado 0 = aún no recibe · 1 = recibió el rumor · 2 = verificó / fue informado
//  Al recibir el rumor, cada persona verifica con probabilidad `verify`; quien verifica
//  frena el rumor y pasa a difundir evidencia.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { rng, motion } from '../util.js';

const COL = {
  0: new THREE.Color('#7f93c4'),
  1: new THREE.Color('#ff5c3a'),
  2: new THREE.Color('#2ee6c5'),
};
const BASE = { 0: 0.38, 1: 0.66, 2: 0.66 };

const NODE_VS = /* glsl */ `
  uniform float uScale; attribute vec3 aCol; attribute float aSize; varying vec3 vCol;
  void main(){ vCol=aCol; vec4 mv=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*mv; gl_PointSize=aSize*uScale/-mv.z; }`;
const NODE_FS = /* glsl */ `
  varying vec3 vCol;
  void main(){ float d=length(gl_PointCoord-.5); float core=smoothstep(.2,.12,d); float glow=smoothstep(.5,0.,d); glow*=glow;
    gl_FragColor=vec4(mix(vCol*glow, vec3(1.), core*.55), max(glow*.9, core)); }`;

export function createRumorSim(canvas, onStats) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 1.2, 9.2);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.07;
  controls.enablePan = false; controls.minDistance = 5; controls.maxDistance = 13;
  controls.autoRotate = true; controls.autoRotateSpeed = 0.7;

  // ---- grafo ----
  const N = 120, R = rng(18);
  const P = [];
  let guard = 0;
  while (P.length < N && guard++ < 20000) {
    const v = new THREE.Vector3(R() * 2 - 1, R() * 2 - 1, R() * 2 - 1);
    if (v.length() > 1) continue;
    v.multiplyScalar(3.5); v.y *= 0.85;
    if (P.every((q) => q.distanceTo(v) > 0.8)) P.push(v);
  }
  const n = P.length;
  const adj = Array.from({ length: n }, () => new Set());
  const E = [];
  const link = (a, b) => { if (a !== b && !adj[a].has(b)) { adj[a].add(b); adj[b].add(a); E.push([a, b]); } };
  for (let i = 0; i < n; i++) {
    P.map((q, j) => [j, q.distanceToSquared(P[i])]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 3).forEach(([j]) => link(i, j));
  }
  for (let k = 0; k < 10; k++) link((R() * n) | 0, (R() * n) | 0); // atajos de "mundo pequeño"
  const adjL = adj.map((s) => [...s]);

  // ---- geometrías ----
  const uniforms = { uScale: { value: 600 } };
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), siz = new Float32Array(n);
  P.forEach((p, i) => pos.set([p.x, p.y, p.z], i * 3));
  const ng = new THREE.BufferGeometry();
  ng.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  ng.setAttribute('aCol', new THREE.BufferAttribute(col, 3));
  ng.setAttribute('aSize', new THREE.BufferAttribute(siz, 1));
  const nodes = new THREE.Points(ng, new THREE.ShaderMaterial({ uniforms, vertexShader: NODE_VS, fragmentShader: NODE_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  nodes.frustumCulled = false;
  scene.add(nodes);

  const lpos = new Float32Array(E.length * 6), lcol = new Float32Array(E.length * 6);
  E.forEach(([a, b], k) => lpos.set([P[a].x, P[a].y, P[a].z, P[b].x, P[b].y, P[b].z], k * 6));
  const lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.BufferAttribute(lpos, 3));
  lg.setAttribute('color', new THREE.BufferAttribute(lcol, 3));
  const lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(lines);

  // paquetes de mensaje que viajan por las conexiones
  const PK = 220;
  const kpos = new Float32Array(PK * 3), kcol = new Float32Array(PK * 3), ksz = new Float32Array(PK);
  const pk = Array.from({ length: PK }, () => ({ t: 1, a: 0, b: 0, c: 0 }));
  const kg = new THREE.BufferGeometry();
  kg.setAttribute('position', new THREE.BufferAttribute(kpos, 3));
  kg.setAttribute('aCol', new THREE.BufferAttribute(kcol, 3));
  kg.setAttribute('aSize', new THREE.BufferAttribute(ksz, 1));
  const packets = new THREE.Points(kg, new THREE.ShaderMaterial({ uniforms, vertexShader: NODE_VS, fragmentShader: NODE_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  packets.frustumCulled = false;
  scene.add(packets);

  // halo suave central
  const halo = new THREE.Mesh(new THREE.SphereGeometry(4.2, 32, 24), new THREE.MeshBasicMaterial({ color: 0x1a2a66, transparent: true, opacity: 0.1, side: THREE.BackSide, depthWrite: false }));
  scene.add(halo);

  // ---- estado de la simulación ----
  let st = new Uint8Array(n), pop = new Float32Array(n), eact = new Float32Array(E.length);
  const edgeIndex = new Map(E.map(([a, b], k) => [a * 1000 + b, k]).concat(E.map(([a, b], k) => [b * 1000 + a, k])));
  let verify = 0.45, mode = 'rumor', round = 0, frontR = [], frontE = [], acc = 0, run = 0, active = false, rnd = rng(7);
  const TICK = 0.62, P_SHARE = 0.85, P_EVID = 0.3, P_FIX = 0.06; // la evidencia circula más lento que el rumor

  const stats = () => {
    let r = 0, e = 0;
    for (let i = 0; i < n; i++) { if (st[i] === 1) r++; else if (st[i] === 2) e++; }
    const live = frontR.length + frontE.length > 0;
    const state = round === 0 && !r && !e ? 'wait' : !live ? (r / n < 0.35 ? 'contained' : 'done') : 'running';
    onStats?.({ rumor: r / n, evid: e / n, round, state, verify });
  };
  const setState = (i, s) => { st[i] = s; pop[i] = 1; };
  const sendPacket = (a, b, c) => {
    const p = pk.find((q) => q.t >= 1);
    if (p) { p.t = 0; p.a = a; p.b = b; p.c = c; }
    const k = edgeIndex.get(a * 1000 + b);
    if (k !== undefined) eact[k] = 1;
  };

  function reset() {
    st = new Uint8Array(n); pop = new Float32Array(n); eact = new Float32Array(E.length);
    frontR = []; frontE = []; round = 0; acc = 0; run++; rnd = rng(7 + run * 13);
    pk.forEach((p) => (p.t = 1));
    stats();
  }
  function seed(kind, i) {
    const cands = [...Array(n).keys()].filter((j) => st[j] === 0);
    if (i === undefined || i === null) i = cands.length ? cands[(rnd() * cands.length) | 0] : (rnd() * n) | 0;
    if (kind === 'rumor') { setState(i, 1); frontR.push(i); }
    else { setState(i, 2); frontE.push(i); }
    active = true; stats();
  }
  function step() {
    round++;
    const nr = [], ne = [];
    for (const u of frontR) {
      for (const v of adjL[u]) {
        if (st[v] !== 0 || rnd() > P_SHARE) continue;
        if (rnd() < verify) { setState(v, 2); ne.push(v); sendPacket(u, v, 2); }   // verifica: frena y difunde evidencia
        else { setState(v, 1); nr.push(v); sendPacket(u, v, 1); }
      }
    }
    for (const u of frontE) {
      for (const v of adjL[u]) {
        if (st[v] === 0 && rnd() < P_EVID) { setState(v, 2); ne.push(v); sendPacket(u, v, 2); }
        else if (st[v] === 1 && rnd() < P_FIX) { setState(v, 2); ne.push(v); sendPacket(u, v, 2); } // el rumor se corrige
      }
    }
    frontR = nr; frontE = ne;
    stats();
  }

  // ---- interacción: clic en un nodo ----
  const ray = new THREE.Vector3();
  let down = null;
  canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    let best = -1, bd = 1e9;
    for (let i = 0; i < n; i++) {
      ray.copy(P[i]).project(camera);
      const sx = ((ray.x + 1) / 2) * rect.width, sy = ((1 - ray.y) / 2) * rect.height;
      const d = Math.hypot(sx - mx, sy - my);
      if (d < bd) { bd = d; best = i; }
    }
    if (best >= 0 && bd < 46 * (rect.width / canvas.clientWidth)) {
      if (st[best] !== 0) return;
      seed(mode, best);
    }
  });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    uniforms.uScale.value = (h * renderer.getPixelRatio() * 0.5) / Math.tan((camera.fov * Math.PI) / 360);
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  // ---- render ----
  const tmp = new THREE.Color();
  function frame(dt) {
    controls.autoRotate = !motion.reduced;
    controls.update();
    if (active) {
      acc += dt;
      if (acc >= TICK) {
        acc = 0;
        if (frontR.length || frontE.length) step();
      }
    }
    for (let i = 0; i < n; i++) {
      pop[i] = Math.max(0, pop[i] - dt * 1.8);
      const c = COL[st[i]];
      const bright = st[i] === 0 ? 0.55 : 1;
      col[i * 3] = c.r * bright; col[i * 3 + 1] = c.g * bright; col[i * 3 + 2] = c.b * bright;
      siz[i] = BASE[st[i]] * (1 + pop[i] * 1.5);
    }
    ng.attributes.aCol.needsUpdate = true; ng.attributes.aSize.needsUpdate = true;

    for (let k = 0; k < E.length; k++) {
      eact[k] = Math.max(0, eact[k] - dt * 0.9);
      const [a, b] = E[k];
      const sa = st[a], sb = st[b];
      const s = sa === 1 || sb === 1 ? 1 : sa === 2 || sb === 2 ? 2 : 0;
      const base = s === 0 ? 0.1 : 0.22;
      tmp.copy(COL[s]);
      const m = base + eact[k] * 0.9;
      lcol.set([tmp.r * m, tmp.g * m, tmp.b * m, tmp.r * m, tmp.g * m, tmp.b * m], k * 6);
    }
    lg.attributes.color.needsUpdate = true;

    for (let i = 0; i < PK; i++) {
      const p = pk[i];
      if (p.t < 1) {
        p.t = Math.min(1, p.t + dt / (TICK * 0.9));
        const A = P[p.a], B = P[p.b], f = p.t;
        kpos.set([A.x + (B.x - A.x) * f, A.y + (B.y - A.y) * f, A.z + (B.z - A.z) * f], i * 3);
        const c = COL[p.c];
        kcol.set([c.r * 1.3, c.g * 1.3, c.b * 1.3], i * 3);
        ksz[i] = 0.34 * Math.sin(f * Math.PI);
      } else ksz[i] = 0;
    }
    kg.attributes.position.needsUpdate = true; kg.attributes.aCol.needsUpdate = true; kg.attributes.aSize.needsUpdate = true;
    renderer.render(scene, camera);
  }

  reset();
  return {
    frame, resize, reset,
    launch: () => seed('rumor'),
    evidence: () => seed('evid'),
    setVerify: (v) => { verify = v; },
    setMode: (m) => { mode = m; },
    get hasActivity() { return round > 0 || frontR.length > 0 || frontE.length > 0 || st.some((s) => s > 0); },
    // utilidades para pruebas
    _headless: (v, kind = 'rumor', maxRounds = 40) => {
      verify = v; reset(); seed(kind);
      let g = 0; while ((frontR.length || frontE.length) && g++ < maxRounds) step();
      let r = 0, e = 0; for (let i = 0; i < n; i++) { if (st[i] === 1) r++; else if (st[i] === 2) e++; }
      return { rumor: r / n, evid: e / n, rounds: round };
    },
  };
}
