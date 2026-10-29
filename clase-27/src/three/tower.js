// Torre 3D de las siete diapositivas del PPT con un semáforo: cada bloque se pinta de verde / amarillo / rojo según su estado
// y el semáforo resume el avance del grupo (orientativo).
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';
import * as THREE from 'three';
import { makeStage, makePicker, projector } from '../../../core/scene-kit.js';

const COL = [0x12a150, 0xffcf3f, 0xe5311f];

export function createTower(canvas, labelsEl, slides, onPick) {
  const { renderer, scene, camera, controls, resize } = makeStage(canvas, {
    fov: 36, pos: [0.4, 4.4, 12.5], target: [0.8, 2.6, 0], ambient: 0.95, sun: [1.3, [4, 9, 6]],
    orbit: { minPolarAngle: 0.8, maxPolarAngle: 1.5, minAzimuthAngle: -0.8, maxAzimuthAngle: 0.8 },
  });
  const place = projector(canvas, camera);
  const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, ...o });
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 0.2, 48), std(0x2b241d)); floor.position.y = -0.1; scene.add(floor);

  const H = 0.62, GAP = 0.09;
  const blocks = slides.map((s, i) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(3.5, H, 2.0), std(COL[1]));
    m.position.set(-0.7, 0.1 + H / 2 + i * (H + GAP), 0); m.userData.i = i; scene.add(m);
    return { m, c: new THREE.Color(COL[1]), k: 0, st: 1 };
  });
  // semáforo
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.6, 0.22), std(0x4d443a)); post.position.set(3.0, 2.3, 0); scene.add(post);
  const head = new THREE.Mesh(new THREE.BoxGeometry(1.3, 3.6, 0.9), std(0x15120f)); head.position.set(3.0, 4.4, 0); scene.add(head);
  const lamps = [2, 1, 0].map((st, k) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 18), std(COL[st], { emissive: COL[st], emissiveIntensity: 0.05 }));
    m.position.set(3.0, 5.5 - k * 1.1, 0.5); scene.add(m); return { m, st };
  });
  let overall = 1;
  const els = slides.map((s) => { const el = document.createElement('div'); el.className = 'lb'; el.textContent = `${s.n} · ${s.t}`; el.style.setProperty('--lc', '#15120f'); labelsEl.appendChild(el); return el; });

  makePicker(canvas, camera, () => blocks.map((b) => b.m), { onPick: (i) => onPick?.(i) });

  function setStates(arr) {
    arr.forEach((st, i) => {
      const b = blocks[i];
      if (b.st !== st) { b.st = st; if (!motion.reduced) gsap.fromTo(b, { k: 1 }, { k: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' }); }
    });
  }
  function setOverall(k) { overall = k; }
  function frame(dt) {
    controls.update(); camera.updateMatrixWorld();
    blocks.forEach((b, i) => {
      b.c.lerp(new THREE.Color(COL[b.st]), motion.reduced ? 1 : Math.min(1, dt * 9));
      b.m.material.color.copy(b.c);
      b.m.scale.set(1 + b.k * 0.08, 1 + b.k * 0.25, 1 + b.k * 0.08);
      place(els[i], new THREE.Vector3(-0.7, b.m.position.y, 1.05));
    });
    lamps.forEach(({ m, st }) => { m.material.emissiveIntensity += ((st === overall ? 1.4 : 0.05) - m.material.emissiveIntensity) * Math.min(1, dt * 8); });
    renderer.render(scene, camera);
  }
  return { frame, resize, setStates, setOverall };
}
