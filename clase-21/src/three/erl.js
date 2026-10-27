// Estructura E-R-L en 3D: tres láminas de cristal (Evidencia, Recomendación, Límite) que se apilan
// una sobre otra; con la última, el bloque se compacta y brilla ("el mensaje queda armado").
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { rng, motion } from '../../../src/util.js';

const COLS = [0x7a5cff, 0x16b5a4, 0xff5d73];
const NAMES = ['Evidencia', 'Recomendación', 'Límite o alcance'];
const LET = ['E', 'R', 'L'];

const GLASS_VS = /* glsl */ `varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`;
const GLASS_FS = /* glsl */ `
  uniform vec3 uTint; uniform float uGlow, uAlpha; varying vec3 vN; varying vec3 vV;
  void main(){
    float f = pow(1. - abs(dot(vN, vV)), 1.7);
    vec3 col = mix(uTint, vec3(1.), .18) + f*uTint*.55 + uGlow*uTint*.6;
    gl_FragColor = vec4(col, (.55 + f*.4 + uGlow*.2) * uAlpha);
  }`;

export function createERL(canvas, labelsEl, onPick) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  camera.position.set(3.2, 2.9, 8.2);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.enablePan = false; controls.enableZoom = false;
  controls.minPolarAngle = 0.8; controls.maxPolarAngle = 1.5; controls.minAzimuthAngle = -0.2; controls.maxAzimuthAngle = 1.1;
  controls.target.set(0, 1.2, 0);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.06, 64), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 }));
  base.position.y = -0.4; scene.add(base);
  const ring = new THREE.Mesh(new THREE.RingGeometry(3.4, 3.46, 96), new THREE.MeshBasicMaterial({ color: 0x7a5cff, transparent: true, opacity: 0.45, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = -0.36; scene.add(ring);

  const slabs = COLS.map((c, i) => {
    const u = { uTint: { value: new THREE.Color(c) }, uGlow: { value: 0 }, uAlpha: { value: 0 } };
    const geo = new THREE.BoxGeometry(4.2, 0.36, 2.6);
    const mesh = new THREE.Mesh(geo, new THREE.ShaderMaterial({ uniforms: u, vertexShader: GLASS_VS, fragmentShader: GLASS_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0 }));
    const g = new THREE.Group(); g.add(mesh, edges); g.position.y = 6; scene.add(g);
    mesh.userData.i = i;
    return { g, mesh, edges, u, y: 6, show: 0 };
  });

  // chispas que suben por la pila
  const R = rng(5), NP = 160, pp = new Float32Array(NP * 3), pc = new Float32Array(NP * 3), ps = new Float32Array(NP);
  for (let i = 0; i < NP; i++) { pp.set([(R() - 0.5) * 3.6, R() * 3, (R() - 0.5) * 2.2], i * 3); ps[i] = 0.3 + R() * 0.7; const c = new THREE.Color(COLS[i % 3]); pc.set([c.r, c.g, c.b], i * 3); }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pp, 3)); pg.setAttribute('color', new THREE.BufferAttribute(pc, 3));
  const dust = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false }));
  scene.add(dust);

  // etiquetas DOM
  const labels = COLS.map((c, i) => {
    const el = document.createElement('div'); el.className = 'lb'; el.style.setProperty('--lc', '#' + new THREE.Color(c).getHexString());
    el.innerHTML = `<b>${LET[i]}</b>${NAMES[i]}`; el.style.opacity = 0; labelsEl.appendChild(el); return el;
  });

  let step = -1, merged = 0, t = 0;
  const mergeState = { k: 0 };
  function layout(s) {
    // altura de cada lámina según el paso: apiladas desde abajo
    const gap = 0.95 - mergeState.k * 0.55;
    slabs.forEach((sl, i) => {
      const vis = i <= s;
      sl.target = vis ? 0.1 + i * gap : 6;
    });
  }
  function setStep(s, instant) {
    const d = instant || motion.reduced ? 0.01 : 1;
    step = s;
    slabs.forEach((sl, i) => {
      const vis = i <= s;
      gsap.to(sl.u.uAlpha, { value: vis ? 1 : 0, duration: 0.7 * d });
      gsap.to(sl.edges.material, { opacity: vis ? 0.9 : 0, duration: 0.7 * d });
      gsap.to(labels[i], { opacity: vis ? 1 : 0, duration: 0.5 * d });
      if (i === s) { gsap.fromTo(sl.u.uGlow, { value: 1 }, { value: 0.15, duration: 1.4 * d, ease: 'power2.out' }); }
    });
    const done = s === 2;
    gsap.to(mergeState, { k: done ? 1 : 0, duration: 1.1 * d, ease: 'power2.inOut', delay: done ? 0.5 * d : 0 });
    if (done) gsap.fromTo(slabs.map((x) => x.u.uGlow), { value: 0.1 }, { value: 0.55, duration: 0.7 * d, yoyo: true, repeat: 1, delay: 1.1 * d, stagger: 0 });
    layout(s);
    slabs.forEach((sl, i) => {
      if (i <= s) gsap.fromTo(sl, { y: i === s ? 6 : sl.y }, { y: sl.target, duration: 1.3 * d, ease: i === s ? 'bounce.out' : 'expo.out' });
    });
  }

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let down = null;
  canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const h = ray.intersectObjects(slabs.map((s) => s.mesh), false)[0];
    if (h) onPick?.(h.object.userData.i);
  });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  const v3 = new THREE.Vector3();
  function frame(dt) {
    t += dt * (motion.reduced ? 0.2 : 1);
    controls.update();
    layout(step);
    slabs.forEach((sl, i) => {
      // recalcular con compactación (la compactación cambia el objetivo de y)
      const vis = i <= step;
      const gap = 0.95 - mergeState.k * 0.55;
      if (vis && !gsap.isTweening(sl)) sl.y = 0.1 + i * gap;
      sl.g.position.y = sl.y + Math.sin(t * 1.2 + i) * 0.04;
      sl.g.rotation.y = Math.sin(t * 0.3 + i) * 0.04;
    });
    const pos = pg.attributes.position.array;
    for (let i = 0; i < NP; i++) { pos[i * 3 + 1] += ps[i] * dt * 0.9; if (pos[i * 3 + 1] > 3.3) pos[i * 3 + 1] = 0; }
    pg.attributes.position.needsUpdate = true;
    dust.visible = step >= 0;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    slabs.forEach((sl, i) => {
      v3.set(2.55, sl.g.position.y + 0.15, 0.6).project(camera);
      labels[i].style.left = ((v3.x + 1) / 2) * w + 'px'; labels[i].style.top = ((1 - v3.y) / 2) * h + 'px';
    });
    renderer.render(scene, camera);
  }
  setStep(0, true);
  return { frame, resize, setStep, get step() { return step; } };
}
