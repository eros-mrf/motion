// Tres cajas 3D para la técnica 3C (Correcto · Claro · Cambiar). Cada comentario clasificado cae en su caja;
// una estrella marca la única mejora prioritaria.
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';
import * as THREE from 'three';
import { makeStage, projector } from '../../../core/scene-kit.js';

const COL = [0x12a150, 0x2a4bff, 0xe5311f], PALE = [0xc8f0d9, 0xd3dbff, 0xffd5cd];

export function createBins(canvas, labelsEl, bins) {
  const { renderer, scene, camera, controls, resize } = makeStage(canvas, {
    fov: 36, pos: [0, 6.4, 10.2], target: [0, 0.9, 0], ambient: 0.95, sun: [1.3, [3, 9, 6]],
    orbit: { minPolarAngle: 0.6, maxPolarAngle: 1.45, minAzimuthAngle: -0.7, maxAzimuthAngle: 0.7 },
  });
  const place = projector(canvas, camera);
  const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, ...o });
  const floor = new THREE.Mesh(new THREE.BoxGeometry(13, 0.2, 5), std(0x2b241d)); floor.position.y = -0.1; scene.add(floor);
  const XS = [-4.2, 0, 4.2], count = [0, 0, 0];
  XS.forEach((x, b) => {
    const g = new THREE.Group(); g.position.x = x; scene.add(g);
    const mat = std(COL[b]);
    const base = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.18, 2.8), mat); base.position.y = 0.09; g.add(base);
    const back = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.7, 0.16), mat); back.position.set(0, 0.85, -1.4); g.add(back);
    [-1.62, 1.62].forEach((sx) => { const w = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.2, 2.8), mat); w.position.set(sx, 0.6, 0); g.add(w); });
    const front = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.6, 0.16), mat); front.position.set(0, 0.3, 1.4); g.add(front);
  });
  const els = bins.map((b, i) => { const el = document.createElement('div'); el.className = 'lb dk'; el.textContent = b.id; el.style.setProperty('--lc', '#' + COL[i].toString(16).padStart(6, '0')); labelsEl.appendChild(el); return el; });
  const cards = [];
  let star = null;

  function addCard(bin) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.09, 1.6), std(PALE[bin]));
    const strip = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 0.22), std(COL[bin])); strip.position.z = -0.65; m.add(strip);
    const y = 0.28 + count[bin] * 0.13; count[bin]++;
    m.position.set(XS[bin] + (Math.random() - 0.5) * 0.25, motion.reduced ? y : 7, (Math.random() - 0.5) * 0.3);
    m.rotation.y = (Math.random() - 0.5) * 0.35; scene.add(m); cards.push({ m, bin, y });
    if (!motion.reduced) gsap.to(m.position, { y, duration: 0.9, ease: 'bounce.out' });
    return cards.length - 1;
  }
  function setPriority(id) {
    if (star) { scene.remove(star); star.geometry.dispose(); star = null; }
    if (id == null) return;
    star = new THREE.Mesh(new THREE.OctahedronGeometry(0.42), std(0xffcf3f, { emissive: 0x6b5200 }));
    scene.add(star); star.userData.target = cards[id].m;
  }
  function reset() { cards.forEach(({ m }) => { scene.remove(m); m.geometry.dispose(); }); cards.length = 0; count.fill(0); setPriority(null); }

  function frame(dt) {
    controls.update(); camera.updateMatrixWorld();
    els.forEach((el, i) => place(el, new THREE.Vector3(XS[i], 2.15, 1.4)));
    if (star) { const t = star.userData.target; star.position.set(t.position.x, t.position.y + 1.0 + Math.sin(performance.now() / 300) * 0.12, t.position.z); star.rotation.y += dt * (motion.reduced ? 0 : 2.2); }
    renderer.render(scene, camera);
  }
  return { frame, resize, addCard, setPriority, reset };
}
