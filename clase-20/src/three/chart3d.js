// Gráfico de barras 3D para la rutina F-V-D-I. Estilo "tinta": cada barra lleva contorno negro (casco invertido).
// Pasos acumulativos: F (fuente y población) · V (ejes) · D (máximo, mínimo y tendencia) · I (preguntas abiertas).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';

const C = { ink: 0x15120f, cobalt: 0x2447ff, jade: 0x0fa37f, verm: 0xff4a1c, mari: 0xffb300, paper: 0xfffaf0 };
const SC = 0.066;

export function createChart3D(canvas, labelsEl, series, onBar) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  camera.position.set(0.5, 3.6, 11.5);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.enablePan = false; controls.enableZoom = false;
  controls.minPolarAngle = 0.9; controls.maxPolarAngle = 1.62; controls.minAzimuthAngle = -0.9; controls.maxAzimuthAngle = 0.9;
  controls.target.set(0, 1.8, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-4, 8, 6); scene.add(key);

  const n = series.values.length, GAP = 1.42, BW = 1.0;
  const x0 = -((n - 1) * GAP) / 2;
  const rig = new THREE.Group(); scene.add(rig);

  // suelo y pared con líneas de referencia
  const floor = new THREE.Mesh(new THREE.BoxGeometry(n * GAP + 1.6, 0.18, 3.2), new THREE.MeshLambertMaterial({ color: C.paper }));
  floor.position.y = -0.09;
  const floorHull = new THREE.Mesh(new THREE.BoxGeometry(n * GAP + 1.74, 0.3, 3.34), new THREE.MeshBasicMaterial({ color: C.ink, side: THREE.BackSide }));
  floorHull.position.y = -0.09;
  rig.add(floor, floorHull);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(n * GAP + 1.6, 4.9), new THREE.MeshBasicMaterial({ color: 0xf6ecd4 }));
  wall.position.set(0, 2.45, -1.6); rig.add(wall);
  const grid = new THREE.Group();
  for (let v = 10; v <= 70; v += 10) {
    const l = new THREE.Mesh(new THREE.PlaneGeometry(n * GAP + 1.6, 0.018), new THREE.MeshBasicMaterial({ color: C.ink, transparent: true, opacity: v % 20 === 0 ? 0.28 : 0.12 }));
    l.position.set(0, v * SC, -1.59); grid.add(l);
  }
  rig.add(grid);

  // barras
  const bars = series.values.map((v, i) => {
    const h = v * SC;
    const g = new THREE.Group();
    g.position.set(x0 + i * GAP, 0, 0);
    const mat = new THREE.MeshLambertMaterial({ color: C.cobalt });
    const m = new THREE.Mesh(new THREE.BoxGeometry(BW, 1, BW), mat);
    m.position.y = 0.5; m.scale.y = 0.001;
    const hull = new THREE.Mesh(new THREE.BoxGeometry(BW + 0.12, 1, BW + 0.12), new THREE.MeshBasicMaterial({ color: C.ink, side: THREE.BackSide }));
    hull.position.y = 0.5; hull.scale.y = 0.001;
    g.add(hull, m); rig.add(g);
    return { g, m, hull, mat, h, v, i, grow: { k: 0 }, bounce: 0 };
  });
  const max = series.values.indexOf(Math.max(...series.values)), min = series.values.indexOf(Math.min(...series.values));

  // línea de tendencia
  const pts = bars.map((b) => new THREE.Vector3(b.g.position.x, b.h + 0.42, 0));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.2);
  const tubeGeo = new THREE.TubeGeometry(curve, 80, 0.07, 10);
  const tube = new THREE.Mesh(tubeGeo, new THREE.MeshBasicMaterial({ color: C.ink }));
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 14), new THREE.MeshBasicMaterial({ color: C.ink }));
  const idxCount = tubeGeo.index.count;
  tubeGeo.setDrawRange(0, 0); tube.visible = false; arrow.visible = false;
  rig.add(tube, arrow);

  // etiquetas DOM proyectadas
  const labels = [];
  const mk = (cls, text, pos, extra) => {
    const el = document.createElement('div'); el.className = 'lb ' + cls; el.innerHTML = text; el.style.opacity = 0;
    labelsEl.appendChild(el);
    const o = { el, pos: pos ? pos.clone() : null, show: false, ...extra };
    labels.push(o); return o;
  };
  const valLb = bars.map((b) => mk('val', String(b.v), new THREE.Vector3(b.g.position.x, b.h + 0.75, 0)));
  const yearLb = bars.map((b, i) => mk('', series.labels[i], new THREE.Vector3(b.g.position.x, -0.45, 1.5)));
  yearLb.forEach((l) => { l.el.style.opacity = 1; l.show = true; l.el.style.color = '#15120f'; l.el.style.fontWeight = 600; });
  valLb.forEach((l) => { l.show = true; l.el.style.opacity = 1; });
  const board = mk('board', '<b>FUENTE Y POBLACIÓN</b>Servicio de Salud (datos ilustrativos).<br>Personas de 15 a 29 años de una región ficticia.', null, { fixed: [0.3, 0.17] });
  const axX = mk('axis', 'AÑO →', new THREE.Vector3(0, -0.95, 1.8));
  const axY = mk('axis', '↑ CONSULTAS POR 1.000 PERSONAS', null, { fixed: [0.3, 0.09] });
  const maxLb = mk('max', 'MÁXIMO · 58', new THREE.Vector3(bars[max].g.position.x - 1.1, bars[max].h + 1.45, 0));
  const minLb = mk('min', 'MÍNIMO · 31', new THREE.Vector3(bars[min].g.position.x, bars[min].h + 1.45, 0));
  const q1 = mk('q', '?', new THREE.Vector3(bars[min].g.position.x + 0.7, bars[min].h + 2.1, 0), { bob: 0 });
  const q2 = mk('q', '?', new THREE.Vector3(bars[n - 1].g.position.x + 1.1, bars[n - 1].h + 1.3, 0), { bob: 1.6 });
  const qNote = mk('board', '<b>INFERENCIA</b>El gráfico muestra <i>qué</i> pasó, no <i>por qué</i>. Hace falta otra evidencia.', null, { fixed: [0.3, 0.22] });

  const setShow = (o, v) => { o.show = v; o.el.style.opacity = v ? 1 : 0; };
  let step = -1;
  function setStep(s, instant) {
    step = s;
    const dd = instant || motion.reduced ? 0.01 : 1;
    setShow(board, s >= 0 && s !== 3 ? s === 0 : false);
    setShow(axX, s >= 1); setShow(axY, s >= 1);
    bars.forEach((b, i) => {
      const c = s >= 2 && i === max ? C.jade : s >= 2 && i === min ? C.verm : C.cobalt;
      b.mat.color.setHex(c);
    });
    setShow(maxLb, s >= 2); setShow(minLb, s >= 2);
    tube.visible = arrow.visible = s >= 2;
    const target = s >= 2 ? 1 : 0;
    gsap.to(tubeProg, { v: target, duration: 1.4 * dd, ease: 'power2.inOut' });
    setShow(q1, s >= 3); setShow(q2, s >= 3); setShow(qNote, s >= 3);
    // la cámara se acomoda a cada paso
    const cam = [[0.2, 3.4, 11.2], [-2.8, 3.8, 10.6], [3.2, 3.6, 10.4], [-0.2, 3.9, 12.4]][Math.max(0, s)];
    gsap.to(camera.position, { x: cam[0], y: cam[1], z: cam[2], duration: 1.4 * dd, ease: 'expo.out' });
  }
  const tubeProg = { v: 0 };

  // interacción: clic en una barra
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const meshes = bars.map((b) => b.m);
  let down = null;
  canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const h = ray.intersectObjects(meshes, false)[0];
    if (h) { const i = meshes.indexOf(h.object); bars[i].bounce = 1; onBar?.(i, series.labels[i], series.values[i]); }
  });

  function grow() {
    bars.forEach((b, i) => {
      b.grow.k = 0;
      gsap.to(b.grow, { k: 1, duration: motion.reduced ? 0.01 : 1.1, delay: motion.reduced ? 0 : 0.12 * i, ease: 'elastic.out(1,.6)' });
    });
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  const v3 = new THREE.Vector3();
  let t = 0;
  function frame(dt) {
    t += dt;
    controls.update();
    bars.forEach((b) => {
      b.bounce = Math.max(0, b.bounce - dt * 2.2);
      const k = Math.max(0.001, b.grow.k) * (1 + Math.sin(b.bounce * 9) * 0.05 * b.bounce);
      const hh = b.h * k;
      b.m.scale.y = hh; b.m.position.y = hh / 2;
      b.hull.scale.y = hh + 0.12; b.hull.position.y = hh / 2 - 0.02;
    });
    tubeGeo.setDrawRange(0, Math.floor((idxCount * tubeProg.v) / 3) * 3);
    const end = curve.getPoint(1), tan = curve.getTangent(1);
    arrow.position.copy(end).addScaledVector(tan, 0.1 * tubeProg.v);
    arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan.normalize());
    arrow.scale.setScalar(Math.min(1, tubeProg.v * 3));
    const w = canvas.clientWidth, h = canvas.clientHeight;
    labels.forEach((o) => {
      if (o.fixed) { o.el.style.left = o.fixed[0] * w + 'px'; o.el.style.top = o.fixed[1] * h + 'px'; return; }
      v3.copy(o.pos); if (o.bob !== undefined) v3.y += Math.sin(t * 2.4 + o.bob) * 0.12;
      if (o.el.classList.contains('val')) { const b = bars[valLb.indexOf(o)]; v3.y = b.h * Math.max(0.001, b.grow.k) + 0.75; }
      v3.project(camera);
      o.el.style.left = ((v3.x + 1) / 2) * w + 'px'; o.el.style.top = ((1 - v3.y) / 2) * h + 'px';
    });
    renderer.render(scene, camera);
  }

  setStep(0, true);
  return { frame, resize, setStep, grow, get step() { return step; } };
}
