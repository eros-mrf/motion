// Modelos 3D ESQUEMÁTICOS (no a escala) de un virus y una bacteria.
// Virus: material genético + cubierta + espigas de proteína (InstancedMesh que "respira").
// Bacteria: célula en cápsula con pared, nucleoide, ribosomas y flagelos.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { rng, motion } from '../../../src/util.js';

function makeVirus() {
  const g = new THREE.Group();
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 3), new THREE.MeshStandardMaterial({ color: 0x16337f, emissive: 0x2a63d6, emissiveIntensity: 0.55, roughness: 0.35, metalness: 0.25 }));
  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.03, 2), new THREE.MeshBasicMaterial({ color: 0x9cc0ff, wireframe: true, transparent: true, opacity: 0.22 }));
  const gen = new THREE.Mesh(new THREE.TorusKnotGeometry(0.34, 0.07, 140, 10, 3, 5), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffcf3d, emissiveIntensity: 0.9 }));
  g.add(core, wire, gen);
  const N = 54, stems = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.035, 0.06, 1, 8), new THREE.MeshStandardMaterial({ color: 0x7fa6ff, emissive: 0x2a63d6, emissiveIntensity: 0.4 }), N);
  const tips = new THREE.InstancedMesh(new THREE.SphereGeometry(0.12, 14, 12), new THREE.MeshStandardMaterial({ color: 0xff4d94, emissive: 0xff4d94, emissiveIntensity: 0.9 }), N);
  const dirs = [];
  for (let i = 0; i < N; i++) { // esfera de Fibonacci
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
    dirs.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r));
  }
  g.add(stems, tips);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), p = new THREE.Vector3(), s = new THREE.Vector3();
  function update(t) {
    dirs.forEach((d, i) => {
      const len = 0.45 + 0.1 * Math.sin(t * 2 + i * 1.7);
      q.setFromUnitVectors(up, d);
      p.copy(d).multiplyScalar(1 + len / 2); s.set(1, len, 1);
      m.compose(p, q, s); stems.setMatrixAt(i, m);
      p.copy(d).multiplyScalar(1 + len); s.setScalar(1);
      m.compose(p, new THREE.Quaternion(), s); tips.setMatrixAt(i, m);
    });
    stems.instanceMatrix.needsUpdate = true; tips.instanceMatrix.needsUpdate = true;
    gen.rotation.x = t * 0.6; gen.rotation.y = t * 0.4;
  }
  update(0);
  const anchors = { v1: new THREE.Object3D(), v2: new THREE.Object3D() };
  anchors.v1.position.set(0.9, 0.9, 0.55).multiplyScalar(1.05); anchors.v2.position.set(0, 0, 0);
  g.add(anchors.v1, anchors.v2);
  return { group: g, update, anchors };
}

function makeBacteria() {
  const g = new THREE.Group();
  const body = new THREE.Group();
  const cap = new THREE.Mesh(new THREE.CapsuleGeometry(0.8, 1.9, 14, 28), new THREE.MeshStandardMaterial({ color: 0x2c6b1a, emissive: 0x7bd018, emissiveIntensity: 0.28, transparent: true, opacity: 0.5, roughness: 0.35 }));
  const shell = new THREE.Mesh(new THREE.CapsuleGeometry(0.84, 1.9, 10, 20), new THREE.MeshBasicMaterial({ color: 0xb8ff3c, wireframe: true, transparent: true, opacity: 0.22 }));
  cap.rotation.z = shell.rotation.z = Math.PI / 2;
  const nuc = new THREE.Mesh(new THREE.TorusKnotGeometry(0.3, 0.06, 160, 10, 2, 5), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffcf3d, emissiveIntensity: 0.9 }));
  nuc.scale.set(1.5, 1, 1);
  body.add(cap, shell, nuc);
  const R = rng(5), ribo = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff4d94 }), 70), m = new THREE.Matrix4();
  for (let i = 0; i < 70; i++) {
    const x = (R() - 0.5) * 2.5, a = R() * Math.PI * 2, r = Math.sqrt(R()) * 0.62;
    m.makeTranslation(x, Math.sin(a) * r, Math.cos(a) * r); ribo.setMatrixAt(i, m);
  }
  body.add(ribo);
  g.add(body);
  const fl = new THREE.Group();
  for (let k = 0; k < 4; k++) {
    const pts = []; const a = (k / 4) * Math.PI * 2;
    for (let i = 0; i <= 24; i++) { const x = -1.75 - i * 0.12; pts.push(new THREE.Vector3(x, Math.sin(i * 0.7 + k) * 0.25 * Math.cos(a), Math.sin(i * 0.7 + k) * 0.25 * Math.sin(a))); }
    fl.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.03, 6), new THREE.MeshStandardMaterial({ color: 0xb8ff3c, emissive: 0xb8ff3c, emissiveIntensity: 0.4 })));
  }
  g.add(fl);
  const anchors = { b1: new THREE.Object3D(), b2: new THREE.Object3D(), b3: new THREE.Object3D() };
  anchors.b1.position.set(0.2, 0.86, 0.3); anchors.b2.position.set(0.2, 0, 0); anchors.b3.position.set(-3.1, 0, 0);
  g.add(anchors.b1, anchors.b2, anchors.b3);
  function update(t) { fl.rotation.x = t * 3; fl.children.forEach((c, i) => { c.rotation.z = Math.sin(t * 3 + i) * 0.06; }); nuc.rotation.x = t * 0.5; body.position.y = Math.sin(t) * 0.04; }
  return { group: g, update, anchors };
}

export function createAgents(canvas, onPins) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
  camera.position.set(0, 1.1, 8.4);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.enablePan = false; controls.enableZoom = false; controls.autoRotate = true; controls.autoRotateSpeed = 1.1;
  controls.target.set(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(4, 5, 6); scene.add(key);
  const rim = new THREE.PointLight(0xb8ff3c, 30, 20); rim.position.set(-5, 2, -3); scene.add(rim);
  const rim2 = new THREE.PointLight(0x4d8dff, 30, 20); rim2.position.set(5, -2, -3); scene.add(rim2);

  const virus = makeVirus(), bact = makeBacteria();
  const slotV = new THREE.Group(), slotB = new THREE.Group();
  slotV.add(virus.group); slotB.add(bact.group);
  scene.add(slotV, slotB);
  let mode = 'virus', t = 0;
  const pinList = [];

  function apply(m, instant) {
    mode = m;
    const d = instant || motion.reduced ? 0.01 : 1.0;
    const cfg = {
      virus: { v: [0, 1.35], b: [0, 0.001] },
      bacteria: { v: [0, 0.001], b: [0, 1.0] },
      both: { v: [-2.8, 1.05], b: [2.3, 0.8] },
    }[m];
    gsap.to(slotV.position, { x: cfg.v[0], duration: d, ease: 'expo.out' });
    gsap.to(slotV.scale, { x: cfg.v[1], y: cfg.v[1], z: cfg.v[1], duration: d, ease: m === 'both' ? 'expo.out' : 'back.out(1.4)' });
    gsap.to(slotB.position, { x: cfg.b[0], duration: d, ease: 'expo.out' });
    gsap.to(slotB.scale, { x: cfg.b[1], y: cfg.b[1], z: cfg.b[1], duration: d, ease: m === 'both' ? 'expo.out' : 'back.out(1.4)' });
    camera.position.z = m === 'both' ? 9.2 : 8.4;
  }
  apply('virus', true);

  function setPins(list) { pinList.length = 0; list.forEach((p) => pinList.push(p)); }
  const v = new THREE.Vector3();
  function project() {
    if (!onPins) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const out = pinList.map((p) => {
      const a = virus.anchors[p.id] || bact.anchors[p.id];
      const owner = virus.anchors[p.id] ? slotV : slotB;
      a.getWorldPosition(v);
      v.project(camera);
      return { id: p.id, x: ((v.x + 1) / 2) * w, y: ((1 - v.y) / 2) * h, vis: owner.scale.x > 0.3 && v.z < 1 };
    });
    onPins(out);
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  function frame(dt) {
    t += dt * (motion.reduced ? 0.2 : 1);
    controls.autoRotate = !motion.reduced;
    controls.update();
    virus.update(t); bact.update(t);
    virus.group.rotation.y = t * 0.15; bact.group.rotation.y = Math.sin(t * 0.3) * 0.2;
    renderer.render(scene, camera);
    project();
  }
  return { frame, resize, setMode: apply, setPins, get mode() { return mode; } };
}
