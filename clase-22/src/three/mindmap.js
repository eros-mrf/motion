// Mapa conceptual 3D: núcleo «OA 3», cuatro ramas (colores de estación) y 16 hojas (conceptos clave).
// Hoja: 0 sin marcar (apagada) · 1 «la tenía» (verde) · 2 «agregada» (ámbar).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';

const HEX = { amber: 0xffc233, lilac: 0xb69cff, teal: 0x2fd6b5, sky: 0x62b0ff };
const CSS = { amber: '#ffc233', lilac: '#b69cff', teal: '#2fd6b5', sky: '#62b0ff' };
const C_DIM = new THREE.Color(0x4a3a55), C_HAD = new THREE.Color(0x43e08f), C_ADD = new THREE.Color(0xffc233);

export function createMindmap(canvas, labelsEl, branches, onPick) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  camera.position.set(0, 4.6, 13.2);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.enablePan = false; controls.enableZoom = false; controls.autoRotate = true; controls.autoRotateSpeed = 0.55;
  controls.minPolarAngle = 0.9; controls.maxPolarAngle = 1.75;
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const key = new THREE.DirectionalLight(0xfff0d8, 1.7); key.position.set(4, 8, 6); scene.add(key);
  const rim = new THREE.PointLight(0xffc233, 14, 20); rim.position.set(0, 1, 0); scene.add(rim);

  // núcleo
  const core = new THREE.Group(); scene.add(core);
  const cm = new THREE.Mesh(new THREE.SphereGeometry(0.8, 40, 28), new THREE.MeshStandardMaterial({ color: 0x2a1832, emissive: 0xffc233, emissiveIntensity: 0.35, roughness: 0.35, metalness: 0.2 }));
  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 1), new THREE.MeshBasicMaterial({ color: 0xffc233, wireframe: true, transparent: true, opacity: 0.35 }));
  core.add(cm, wire);
  const coreEl = document.createElement('div'); coreEl.className = 'lb'; coreEl.textContent = 'OA 3'; coreEl.style.setProperty('--lc', '#ffc233'); labelsEl.appendChild(coreEl);

  const leaves = [], bnodes = [];
  const leafMeshes = [];
  branches.forEach((b, bi) => {
    const ang = Math.PI / 4 + bi * (Math.PI / 2);
    const bp = new THREE.Vector3(Math.cos(ang) * 2.7, (bi % 2 ? -0.35 : 0.35), Math.sin(ang) * 2.7);
    const col = new THREE.Color(HEX[b.c]);
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 24), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.28, roughness: 0.3 }));
    node.position.copy(bp); scene.add(node);
    const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), bp]);
    scene.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.8 })));
    const el = document.createElement('div'); el.className = 'lb'; el.textContent = b.name; el.style.setProperty('--lc', CSS[b.c]); labelsEl.appendChild(el);
    bnodes.push({ node, bp, el, mat: node.material, n: 0 });
    b.leaves.forEach((txt, li) => {
      const out = new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang));
      const side = new THREE.Vector3(-Math.sin(ang), 0, Math.cos(ang));
      const lp = bp.clone().addScaledVector(out, 1.1 + (li % 2) * 0.3).addScaledVector(side, (li - 1.5) * 0.85).add(new THREE.Vector3(0, ((li % 2) ? 0.75 : -0.7), 0));
      const lm = new THREE.MeshStandardMaterial({ color: C_DIM.clone(), emissive: new THREE.Color(0x000000), roughness: 0.35, transparent: true, opacity: 0.75 });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 18), lm);
      mesh.position.copy(lp); mesh.userData.i = leaves.length; scene.add(mesh); leafMeshes.push(mesh);
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([bp, lp]), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.35 })));
      const le = document.createElement('div'); le.className = 'lb leaf'; le.textContent = txt; le.style.setProperty('--lc', CSS[b.c]); labelsEl.appendChild(le);
      leaves.push({ mesh, lm, el: le, state: 0, bi, hover: 0, flash: 0, base: lp });
    });
  });

  function setLeaf(i, state, quiet = false) {
    const L = leaves[i]; if (!L) return;
    const prev = L.state; L.state = state;
    const tc = state === 1 ? C_HAD : state === 2 ? C_ADD : C_DIM;
    const dur = motion.reduced ? 0.01 : 0.5;
    gsap.to(L.lm.color, { r: tc.r, g: tc.g, b: tc.b, duration: dur });
    gsap.to(L.lm.emissive, { r: state ? tc.r * 0.55 : 0, g: state ? tc.g * 0.55 : 0, b: state ? tc.b * 0.55 : 0, duration: dur });
    gsap.to(L.lm, { opacity: state ? 1 : 0.75, duration: dur });
    if (state && !prev) { L.flash = quiet ? 0 : 1; if (!motion.reduced) gsap.fromTo(L.mesh.scale, { x: 1.9, y: 1.9, z: 1.9 }, { x: 1, y: 1, z: 1, duration: 0.7, ease: 'elastic.out(1,.5)' }); }
    // brillo de la rama = hojas marcadas / 4
    const b = bnodes[L.bi]; b.n = leaves.filter((x) => x.bi === L.bi && x.state).length;
    gsap.to(b.mat, { emissiveIntensity: 0.28 + b.n * 0.2, duration: dur });
    const total = leaves.filter((x) => x.state).length;
    gsap.to(cm.material, { emissiveIntensity: 0.35 + total * 0.07, duration: dur });
  }
  function reset() { leaves.forEach((_, i) => setLeaf(i, 0)); }

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let hov = -1, down = null;
  const pick = (e) => { const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); const h = ray.intersectObjects(leafMeshes, false)[0]; return h ? h.object.userData.i : -1; };
  canvas.addEventListener('pointermove', (e) => { hov = pick(e); canvas.style.cursor = hov >= 0 ? 'pointer' : 'grab'; });
  canvas.addEventListener('pointerleave', () => { hov = -1; });
  canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => { if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return; const i = pick(e); if (i >= 0) onPick?.(i); });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  const v3 = new THREE.Vector3();
  const place = (el, p, dy = 0) => { v3.copy(p); v3.y += dy; v3.project(camera); el.style.left = ((v3.x + 1) / 2) * canvas.clientWidth + 'px'; el.style.top = ((1 - v3.y) / 2) * canvas.clientHeight + 'px'; };
  let t = 0;
  function frame(dt) {
    t += dt * (motion.reduced ? 0.2 : 1);
    controls.autoRotate = !motion.reduced; controls.update();
    wire.rotation.y += dt * 0.3; wire.rotation.x += dt * 0.12;
    core.scale.setScalar(1 + Math.sin(t * 1.8) * 0.03);
    camera.updateMatrixWorld();
    place(coreEl, core.position, 1.35);
    bnodes.forEach((b) => place(b.el, b.node.position, 0.85));
    leaves.forEach((L, i) => {
      L.hover += ((hov === i ? 1 : 0) - L.hover) * 0.25;
      L.flash = Math.max(0, L.flash - dt * 0.7);
      L.mesh.position.y = L.base.y + Math.sin(t * 1.3 + i) * 0.05;
      L.mesh.scale.setScalar(1 + L.hover * 0.35);
      L.el.classList.toggle('show', L.hover > 0.5 || L.flash > 0.05);
      place(L.el, L.mesh.position, 0.5);
    });
    renderer.render(scene, camera);
  }
  return { frame, resize, setLeaf, reset };
}
