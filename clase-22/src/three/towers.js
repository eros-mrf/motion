// Torres 3D: altura = errores por contenido. Los tres contenidos con más errores llevan un anillo luminoso.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';

const COLS = [0xffc233, 0xffc233, 0xb69cff, 0xb69cff, 0x2fd6b5, 0x2fd6b5, 0x62b0ff, 0x62b0ff];
const CSS = ['#ffc233', '#ffc233', '#b69cff', '#b69cff', '#2fd6b5', '#2fd6b5', '#62b0ff', '#62b0ff'];

export function createTowers(canvas, labelsEl, n = 8) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  camera.position.set(0, 5.8, 12.4);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.enablePan = false; controls.enableZoom = false; controls.autoRotate = true; controls.autoRotateSpeed = 0.5;
  controls.minPolarAngle = 0.95; controls.maxPolarAngle = 1.5; controls.target.set(0, 1.4, 0);
  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  const sun = new THREE.DirectionalLight(0xfff0d8, 1.8); sun.position.set(5, 9, 6); scene.add(sun);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 5.6, 0.2, 64), new THREE.MeshStandardMaterial({ color: 0x20132a, roughness: 0.6 }));
  base.position.y = -0.1; scene.add(base);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(5.5, 0.04, 10, 120), new THREE.MeshBasicMaterial({ color: 0xffc233 })); rim.rotation.x = Math.PI / 2; scene.add(rim);

  const towers = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const x = Math.sin(a) * 3.7, z = Math.cos(a) * 3.7;
    const m = new THREE.MeshStandardMaterial({ color: COLS[i], emissive: COLS[i], emissiveIntensity: 0.12, roughness: 0.35, metalness: 0.15 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1, 1.05), m);
    mesh.position.set(x, 0.05, z); scene.add(mesh);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.07, 12, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
    halo.rotation.x = Math.PI / 2; halo.position.set(x, 0.2, z); scene.add(halo);
    const el = document.createElement('div'); el.className = 'lb'; el.style.setProperty('--lc', CSS[i]); el.textContent = i + 1; labelsEl.appendChild(el);
    towers.push({ mesh, halo, el, m, h: 0.08, tgt: 0.08, top: 0, x, z, val: 0 });
  }
  const state = { max: 3 };
  function setValues(vals, max) {
    const mx = Math.max(max, 1);
    vals.forEach((v, i) => {
      const T = towers[i]; T.val = v;
      gsap.to(T, { h: 0.08 + (v / mx) * 4.6, duration: motion.reduced ? 0.01 : 1.1, ease: 'elastic.out(1,.7)' });
    });
  }
  function setTop(idx) {
    towers.forEach((T, i) => {
      const on = idx.includes(i);
      gsap.to(T.halo.material, { opacity: on ? 1 : 0, duration: 0.5 });
      gsap.to(T.m, { emissiveIntensity: on ? 0.55 : 0.12, duration: 0.5 });
      T.top = on ? 1 : 0;
    });
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  const v3 = new THREE.Vector3();
  let t = 0;
  function frame(dt) {
    t += dt * (motion.reduced ? 0.2 : 1);
    controls.autoRotate = !motion.reduced; controls.update();
    camera.updateMatrixWorld();
    towers.forEach((T) => {
      T.mesh.scale.y = T.h; T.mesh.position.y = T.h / 2;
      T.halo.position.y = T.h + 0.18 + Math.sin(t * 2.4) * 0.06 * T.top;
      T.halo.rotation.z += dt * 1.2;
      v3.set(T.x, T.h + 0.75, T.z).project(camera);
      T.el.style.left = ((v3.x + 1) / 2) * canvas.clientWidth + 'px'; T.el.style.top = ((1 - v3.y) / 2) * canvas.clientHeight + 'px';
      T.el.textContent = `${towers.indexOf(T) + 1} · ${T.val}`;
    });
    renderer.render(scene, camera);
  }
  return { frame, resize, setValues, setTop };
}
