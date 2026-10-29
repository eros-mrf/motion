// Fondo: amarillo de rotulador con hojas rayadas (instanciadas) que flotan en profundidad, parallax con el cursor
// y un remolino de hojas al hacer clic.
import * as THREE from 'three';
import { motion, rng } from '../../../src/util.js';

function sheetTexture() {
  const c = document.createElement('canvas'); c.width = 160; c.height = 224;
  const g = c.getContext('2d');
  g.fillStyle = '#fffdf6'; g.fillRect(0, 0, 160, 224);
  g.strokeStyle = 'rgba(42,75,255,.35)'; g.lineWidth = 2;
  for (let y = 40; y < 224; y += 18) { g.beginPath(); g.moveTo(0, y); g.lineTo(160, y); g.stroke(); }
  g.strokeStyle = 'rgba(229,49,31,.7)'; g.beginPath(); g.moveTo(24, 0); g.lineTo(24, 224); g.stroke();
  g.fillStyle = 'rgba(21,18,15,.55)'; g.fillRect(34, 14, 70, 8); g.fillRect(34, 26, 40, 5);
  g.strokeStyle = '#e5311f'; g.lineWidth = 3; g.beginPath(); g.moveTo(40, 112); g.lineTo(46, 118); g.lineTo(58, 100); g.stroke(); // marca de visto
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function createBG(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(dpr); renderer.setClearColor(0xffcf3f, 1);
  const scene = new THREE.Scene();
  const FOV = 40, Z = 14;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 80); camera.position.set(0, 0, Z);
  const N = 34, rnd = rng(2701);
  const mat = new THREE.MeshBasicMaterial({ map: sheetTexture(), transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false });
  const mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.6, 2.24), mat, N);
  scene.add(mesh);
  const tints = [0xffffff, 0xffffff, 0xffffff, 0xffe3de, 0xdfe5ff, 0xdcf5e6];
  const S = Array.from({ length: N }, (_, i) => {
    mesh.setColorAt(i, new THREE.Color(tints[Math.floor(rnd() * tints.length)]));
    return { x: (rnd() - 0.5) * 34, y: (rnd() - 0.5) * 18, z: -12 + rnd() * 13, rz: (rnd() - 0.5) * 1.2, ry: (rnd() - 0.5) * 0.8, ph: rnd() * 6.28, sp: 0.2 + rnd() * 0.4, k: 0, spin: 0 };
  });
  mesh.instanceColor.needsUpdate = true;
  const dummy = new THREE.Object3D(), mouse = { x: 0, y: 0 };
  const view = { w: 1920, h: 1080 };
  function resize() {
    const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); view.w = w; view.h = h;
  }
  addEventListener('resize', resize); resize();
  addEventListener('pointermove', (e) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = 0.5 - e.clientY / innerHeight; });
  let t = 0;
  return {
    update(dt) {
      t += dt * (motion.reduced ? 0.1 : 1);
      camera.position.x += (mouse.x * 2.2 - camera.position.x) * 0.04; camera.position.y += (mouse.y * 1.4 - camera.position.y) * 0.04;
      S.forEach((s, i) => {
        s.k *= Math.pow(0.04, dt); s.spin *= Math.pow(0.06, dt);
        dummy.position.set(s.x + Math.sin(t * s.sp + s.ph) * 0.5, s.y + Math.cos(t * s.sp * 0.8 + s.ph) * 0.5, s.z);
        dummy.rotation.set(Math.sin(t * 0.2 + s.ph) * 0.25, s.ry + Math.sin(t * s.sp + s.ph) * 0.4 + s.spin * 6.28, s.rz + s.k * 0.6);
        dummy.scale.setScalar(1 + s.k * 0.35);
        dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    },
    setMood(hex) { mat.color.set(0xffffff).lerp(new THREE.Color(hex), 0.08); },
    pulseAt(x, y) {
      if (motion.reduced) return;
      const hh = Math.tan((FOV * Math.PI) / 360) * Z, ww = hh * (view.w / view.h);
      const wx = (x / view.w - 0.5) * 2 * ww, wy = (0.5 - y / view.h) * 2 * hh;
      S.forEach((s) => { const d = Math.hypot(s.x - wx, s.y - wy); const k = Math.max(0, 1 - d / 12); s.k = Math.max(s.k, k); s.spin = Math.max(s.spin, k * 0.5); });
    },
  };
}
