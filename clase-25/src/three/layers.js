// Modelo 3D de UNA diapositiva en cinco capas: propósito → idea científica → evidencia → fuente → mensaje.
// Las capas caen una a una; al completar, la pila se compacta como una diapositiva armada.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';

const HEX = { hi: 0xffe14d, mint: 0x6ff0c8, sky: 0x9fd3ff, pink: 0xff9ccb, lilac: 0xc9b8ff };
const CSS = { hi: '#ffe14d', mint: '#6ff0c8', sky: '#9fd3ff', pink: '#ff9ccb', lilac: '#c9b8ff' };

function plateTexture(i, L) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 640;
  const g = c.getContext('2d');
  g.fillStyle = '#f8faff'; g.fillRect(0, 0, 1024, 640);
  g.strokeStyle = 'rgba(27,70,216,.16)'; g.lineWidth = 1;
  for (let x = 0; x <= 1024; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 640); g.stroke(); }
  for (let y = 0; y <= 640; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(1024, y); g.stroke(); }
  g.fillStyle = CSS[L.c]; g.fillRect(0, 0, 40, 640);
  g.fillStyle = '#0d1b4c'; g.font = '800 200px Manrope, Inter, sans-serif'; g.textBaseline = 'middle';
  g.fillText(String(i + 1), 90, 200);
  g.font = '800 82px Manrope, Inter, sans-serif'; g.fillText(L.name, 90, 420);
  g.fillStyle = '#3a4a86'; g.font = '600 46px Inter, sans-serif'; g.fillText(L.short, 90, 520);
  g.strokeStyle = '#1b46d8'; g.lineWidth = 6; g.strokeRect(8, 8, 1008, 624);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  return tex;
}

export function createLayers(canvas, labelsEl, layers, onPick) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
  camera.position.set(0, 8.0, 13.6);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.enablePan = false; controls.enableZoom = false; controls.target.set(0, 1.4, 0);
  controls.minPolarAngle = 0.5; controls.maxPolarAngle = 1.45; controls.autoRotate = true; controls.autoRotateSpeed = 0.45;
  scene.add(new THREE.AmbientLight(0xffffff, 1.05));
  const sun = new THREE.DirectionalLight(0xffffff, 1.2); sun.position.set(4, 9, 6); scene.add(sun);

  // mesa de dibujo
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.3, 0.12, 64), new THREE.MeshStandardMaterial({ color: 0x0e2f94, roughness: 0.7 }));
  floor.position.y = -0.2; scene.add(floor);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(4.25, 0.04, 8, 100), new THREE.MeshBasicMaterial({ color: 0xffe14d })); rim.rotation.x = Math.PI / 2; rim.position.y = -0.13; scene.add(rim);

  const GAP = 0.95, CLOSED = 0.13;
  const plates = layers.map((L, i) => {
    const edge = new THREE.MeshStandardMaterial({ color: HEX[L.c], roughness: 0.5 });
    const top = new THREE.MeshBasicMaterial({ map: plateTexture(i, L), toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.1, 2.75), [edge, edge, top, edge, edge, edge]);
    mesh.visible = false; mesh.userData.i = i; scene.add(mesh);
    const el = document.createElement('div'); el.className = 'lb'; el.textContent = `${i + 1} · ${L.name}`; el.style.setProperty('--lc', CSS[L.c]); el.style.opacity = 0; labelsEl.appendChild(el);
    const rp = [new THREE.Vector3(-2.2, 0, -1.375), new THREE.Vector3(2.2, 0, -1.375), new THREE.Vector3(2.2, 0, 1.375), new THREE.Vector3(-2.2, 0, 1.375)];
    const ghost = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(rp), new THREE.LineDashedMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, dashSize: 0.18, gapSize: 0.12 }));
    ghost.computeLineDistances(); scene.add(ghost);
    return { mesh, el, ghost, y: 0, k: 0, shown: false, hot: 0 };
  });
  const st = { gap: GAP };
  function layout() { plates.forEach((p, i) => { p.y = 0.15 + i * st.gap; }); }
  layout();

  function setStep(n) {
    plates.forEach((p, i) => {
      const want = i < n;
      if (want && !p.shown) {
        p.shown = true; p.mesh.visible = true;
        gsap.fromTo(p, { k: 0 }, { k: 1, duration: motion.reduced ? 0.01 : 0.9, ease: 'bounce.out' });
        gsap.fromTo(p.mesh.material[2], { opacity: 0 }, { opacity: 1, duration: 0.4 });
        p.mesh.material[2].transparent = true;
        gsap.to(p.el, { opacity: 1, duration: 0.4 });
      } else if (!want && p.shown) {
        p.shown = false; gsap.to(p, { k: 0, duration: 0.3, onComplete: () => { p.mesh.visible = false; } }); gsap.to(p.el, { opacity: 0, duration: 0.2 });
      }
    });
  }
  function assemble(on) { gsap.to(st, { gap: on ? CLOSED : GAP, duration: motion.reduced ? 0.01 : 1.1, ease: 'power3.inOut', onUpdate: layout }); }
  function highlight(i) { plates.forEach((p, k) => gsap.to(p, { hot: k === i ? 1 : 0, duration: 0.35 })); }
  function reset() { setStep(0); assemble(false); highlight(-1); }

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let down = null;
  const pickI = (e) => { const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); const h = ray.intersectObjects(plates.filter((p) => p.shown).map((p) => p.mesh), false)[0]; return h ? h.object.userData.i : -1; };
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
  let t = 0;
  function frame(dt) {
    t += dt * (motion.reduced ? 0.2 : 1);
    controls.autoRotate = !motion.reduced; controls.update(); camera.updateMatrixWorld();
    plates.forEach((p, i) => {
      const drop = (1 - p.k) * 3.2;
      p.mesh.position.set(0, p.y + drop + p.hot * 0.35 + Math.sin(t * 1.4 + i) * 0.02, 0);
      p.ghost.position.set(0, p.y, 0); p.ghost.visible = !p.shown || p.k < 1; p.ghost.rotation.y = p.mesh.rotation.y;
      p.mesh.rotation.y = (i % 2 ? -1 : 1) * (st.gap > 0.5 ? 0.05 * i : 0.01 * i);
      v3.set(-2.35, p.mesh.position.y, 1.45).project(camera);
      p.el.style.left = ((v3.x + 1) / 2) * canvas.clientWidth + 'px'; p.el.style.top = ((1 - v3.y) / 2) * canvas.clientHeight + 'px';
      p.el.style.display = st.gap < 0.5 ? 'none' : '';
    });
    renderer.render(scene, camera);
  }
  return { frame, resize, setStep, assemble, highlight, reset };
}
