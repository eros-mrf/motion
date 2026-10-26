// Fondo 3D · Clase 20: "skyline de datos".
// Una cuadrícula de barras (un gráfico gigante) sobre papel crema que respira con ondas.
// Cada diapositiva cambia la paleta y la cámara; cada transición lanza una ola; el clic, otra.
import * as THREE from 'three';
import { rng, lerp, motion } from '../../../src/util.js';

const PAPER = new THREE.Color('#f1e9d6');
const PAL = { verm: '#ff4a1c', cobalt: '#2447ff', mari: '#ffb300', jade: '#0fa37f' };
// paleta principal y secundaria por diapositiva
const MOODS = [
  ['mari', 'verm'], ['mari', 'cobalt'], ['mari', 'verm'], ['cobalt', 'mari'], ['cobalt', 'jade'],
  ['jade', 'cobalt'], ['mari', 'jade'], ['verm', 'mari'], ['jade', 'mari'], ['verm', 'cobalt'],
  ['verm', 'mari'], ['verm', 'jade'], ['cobalt', 'verm'], ['mari', 'cobalt'],
];

export function createBG(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setClearColor(PAPER, 1);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(PAPER, 22, 62);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  camera.position.set(0, 12, 20);

  scene.add(new THREE.AmbientLight(0xffffff, 1.35));
  const sun = new THREE.DirectionalLight(0xffffff, 1.5);
  sun.position.set(-8, 16, 10);
  scene.add(sun);

  const COLS = 46, ROWS = 32, SP = 1.25, W = 0.86;
  const N = COLS * ROWS;
  const geo = new THREE.BoxGeometry(W, 1, W);
  geo.translate(0, 0.5, 0); // la base queda en y = 0
  const mesh = new THREE.InstancedMesh(geo, new THREE.MeshLambertMaterial({ color: 0xffffff }), N);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  scene.add(mesh);

  const R = rng(2020);
  const bars = [];
  for (let i = 0; i < N; i++) {
    const cx = i % COLS, cz = (i / COLS) | 0;
    bars.push({ x: (cx - COLS / 2) * SP, z: (cz - ROWS / 2) * SP - 6, ph: R() * 6.28, pick: R() < 0.32 ? 1 : 0, amp: 0.6 + R() * 0.8 });
  }
  const colA = new THREE.Color(), colB = new THREE.Color(), tmp = new THREE.Color();
  const cur = [new THREE.Color(PAL.mari), new THREE.Color(PAL.verm)];
  const tar = [new THREE.Color(PAL.mari), new THREE.Color(PAL.verm)];
  const m4 = new THREE.Matrix4(), s3 = new THREE.Vector3(), p3 = new THREE.Vector3(), q0 = new THREE.Quaternion();
  const ripples = []; // {x,z,t}
  let time = 0, mx = 0, my = 0, camT = new THREE.Vector3(0, 12, 20), lookT = new THREE.Vector3(0, 0, -6), look = new THREE.Vector3(0, 0, -6);
  const ray = new THREE.Raycaster();

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  resize(); addEventListener('resize', resize);
  addEventListener('pointermove', (e) => { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; });

  function setMood(i) {
    const m = MOODS[i % MOODS.length];
    tar[0].set(PAL[m[0]]); tar[1].set(PAL[m[1]]);
    const a = i * 0.7;
    camT.set(Math.sin(a) * 6, 10 + (i % 3) * 1.6, 19 - (i % 4));
    lookT.set(Math.sin(a + 2) * 3, 0, -6);
    ripples.push({ x: 0, z: -6, t: 0 });
  }
  function pulseAt(cx, cy) {
    ray.setFromCamera(new THREE.Vector2((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1), camera);
    const t = -ray.ray.origin.y / ray.ray.direction.y;
    if (t > 0) { const p = ray.ray.origin.clone().addScaledVector(ray.ray.direction, t); ripples.push({ x: p.x, z: p.z, t: 0 }); }
    if (ripples.length > 6) ripples.shift();
  }

  function update(dt) {
    const slow = motion.reduced ? 0.1 : 1;
    time += dt * slow;
    cur[0].lerp(tar[0], 1 - Math.exp(-dt * 2.4)); cur[1].lerp(tar[1], 1 - Math.exp(-dt * 2.4));
    ripples.forEach((r) => { r.t += dt; });
    while (ripples.length && ripples[0].t > 4.5) ripples.shift();
    const amp = motion.reduced ? 0.25 : 1;
    for (let i = 0; i < N; i++) {
      const b = bars[i];
      let h = 0.9 + (Math.sin(b.x * 0.32 + time * 0.6) + Math.sin(b.z * 0.27 - time * 0.45) + Math.sin((b.x + b.z) * 0.16 + time * 0.3)) * 0.55 * b.amp;
      for (const r of ripples) {
        const d = Math.hypot(b.x - r.x, b.z - r.z);
        const front = r.t * 14;
        const w = Math.exp(-Math.pow((d - front) * 0.38, 2));
        h += w * 4.2 * Math.exp(-r.t * 0.7) * amp;
      }
      h = Math.max(0.12, h);
      p3.set(b.x, 0, b.z); s3.set(1, h, 1);
      m4.compose(p3, q0, s3);
      mesh.setMatrixAt(i, m4);
      colA.copy(cur[b.pick]);
      const k = Math.min(1, 0.25 + h * 0.2);
      tmp.copy(PAPER).lerp(colA, 0.38 + 0.3 * k);
      mesh.setColorAt(i, tmp);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    const par = motion.reduced ? 0 : 1;
    camera.position.x = lerp(camera.position.x, camT.x + mx * 2 * par, 1 - Math.exp(-dt * 1.6));
    camera.position.y = lerp(camera.position.y, camT.y - my * 0.8 * par, 1 - Math.exp(-dt * 1.6));
    camera.position.z = lerp(camera.position.z, camT.z, 1 - Math.exp(-dt * 1.6));
    look.lerp(lookT, 1 - Math.exp(-dt * 1.4));
    camera.lookAt(look);
    renderer.render(scene, camera);
  }
  return { update, setMood, pulseAt };
}
