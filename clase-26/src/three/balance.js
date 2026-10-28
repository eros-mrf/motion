// Balanza 3D «mito frente a evidencia»: a la izquierda un bloque grande (el mito); a la derecha se apilan bloques de evidencia.
// Las fuentes oficiales pesan más; las que no tienen respaldo son bloques huecos que casi no pesan. Es una metáfora orientativa.
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';
import * as THREE from 'three';
import { makeStage, projector } from '../../../core/scene-kit.js';

const KINDS = { o: { col: 0x7be0c0, s: 0.95 }, c: { col: 0xf5c451, s: 0.78 }, r: { col: 0xff7059, s: 0.62 } };

export function createBalance(canvas, labelsEl) {
  const { renderer, scene, camera, controls, resize } = makeStage(canvas, {
    fov: 34, pos: [0, 3.0, 15.2], target: [0, 1.5, 0], ambient: 0.9, sun: [1.4, [3, 8, 7]],
    orbit: { minPolarAngle: 1.0, maxPolarAngle: 1.7, minAzimuthAngle: -0.8, maxAzimuthAngle: 0.8 },
  });
  const place = projector(canvas, camera);
  const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, ...o });

  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 2.0, 0.3, 40), std(0xf7f3e8)); base.position.y = -1.6; scene.add(base);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 5.2, 20), std(0xe8e1cd)); post.position.y = 1.0; scene.add(post);
  const pivotY = 3.55, HL = 4.2;
  const beam = new THREE.Group(); beam.position.y = pivotY; scene.add(beam);
  beam.add(new THREE.Mesh(new THREE.BoxGeometry(HL * 2 + 0.4, 0.22, 0.3), std(0xf7f3e8)));
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), std(0xff7059)); cap.position.y = pivotY; scene.add(cap);

  function pan(color) {
    const g = new THREE.Group();
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.55, 0.16, 40), std(color)); g.add(dish);
    const strings = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 2.2, 0), new THREE.Vector3(-1.6, 0, 0), new THREE.Vector3(0, 2.2, 0), new THREE.Vector3(1.6, 0, 0),
      new THREE.Vector3(0, 2.2, 0), new THREE.Vector3(0, 0, 1.2), new THREE.Vector3(0, 2.2, 0), new THREE.Vector3(0, 0, -1.2)]),
    new THREE.LineBasicMaterial({ color: 0xf4f1e8 }));
    g.add(strings); scene.add(g); return g;
  }
  const panL = pan(0xe8e1cd), panR = pan(0xe8e1cd);

  // bloque del mito (izquierda)
  const myth = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.7, 1.7), std(0xb6513f, { roughness: 0.6 }));
  myth.position.y = 0.93; panL.add(myth);
  const mythTop = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.9, 1.0), std(0xd9705a)); mythTop.position.y = 2.2; panL.add(mythTop);

  // bloques de evidencia (derecha)
  let blocks = [];
  function setBlocks(kinds) {
    blocks.forEach((b) => { panR.remove(b); b.geometry.dispose(); });
    blocks = [];
    let y = 0.08;
    kinds.forEach((k, i) => {
      const { col, s } = KINDS[k];
      const hollow = k === 'r';
      const m = new THREE.Mesh(new THREE.BoxGeometry(s * 1.5, s * 0.7, s * 1.5), std(col, hollow ? { transparent: true, opacity: 0.35, wireframe: false } : {}));
      const off = ((i % 2) - 0.5) * 0.25;
      m.position.set(off, y + s * 0.35, 0);
      y += s * 0.7 + 0.02;
      panR.add(m); blocks.push(m);
      if (!motion.reduced) { m.scale.set(0.01, 0.01, 0.01); gsap.to(m.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: 'back.out(2)' }); }
    });
  }

  // resorte amortiguado hacia el ángulo objetivo
  let ang = 0, vel = 0, target = 0;
  function setTilt(t) { target = Math.max(-0.4, Math.min(0.4, t)); if (motion.reduced) { ang = target; vel = 0; } }
  let won = false;
  function setWon(v) { won = v; }

  const lm = document.createElement('div'); lm.className = 'lb'; lm.style.setProperty('--lc', '#ff7059'); labelsEl.appendChild(lm);
  const le = document.createElement('div'); le.className = 'lb'; le.style.setProperty('--lc', '#7be0c0'); labelsEl.appendChild(le);
  function setLabels(a, b) { lm.textContent = a; le.textContent = b; }

  function frame(dt) {
    controls.update();
    if (!motion.reduced) { const acc = (target - ang) * 28 - vel * 4.2; vel += acc * dt; ang += vel * dt; }
    beam.rotation.z = ang;
    const ex = HL * Math.cos(ang), ey = HL * Math.sin(ang);
    panL.position.set(-ex, pivotY - 2.5 - ey, 0);
    panR.position.set(ex, pivotY - 2.5 + ey, 0);
    cap.material.color.setHex(won ? 0x7be0c0 : 0xff7059);
    camera.updateMatrixWorld();
    place(lm, new THREE.Vector3(-ex, pivotY - 2.5 - ey + 3.2, 0));
    place(le, new THREE.Vector3(ex, pivotY - 2.5 + ey + 3.2 + Math.max(0, blocks.length - 3) * 0.25, 0));
    renderer.render(scene, camera);
  }
  return { frame, resize, setBlocks, setTilt, setLabels, setWon };
}
