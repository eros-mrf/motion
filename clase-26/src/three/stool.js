// Banquito 3D de tres patas: exactitud, respeto y claridad. La altura de cada pata depende del nivel (Falta / En camino / Logrado);
// si una es más corta el asiento se inclina y la «idea» (esfera) rueda hacia el lado débil. Con las tres logradas queda nivelado.
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';
import * as THREE from 'three';
import { makeStage, projector } from '../../../core/scene-kit.js';

const COLS = [0x8fd0ff, 0xff7059, 0x7be0c0];
const hOf = (lv) => 2.0 + lv * 0.55;
const R = 1.55;

export function createStool(canvas, labelsEl, crit) {
  const { renderer, scene, camera, controls, resize } = makeStage(canvas, {
    fov: 34, pos: [0, 4.4, 9.2], target: [0, 1.5, 0], ambient: 0.95, sun: [1.3, [3, 8, 5]],
    orbit: { minPolarAngle: 0.5, maxPolarAngle: 1.5, autoRotate: false },
  });
  const place = projector(canvas, camera);
  const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, ...o });

  const floor = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.12, 48), std(0x103b35)); floor.position.y = -0.06; scene.add(floor);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.04, 8, 64), std(0xf4f1e8)); ring.rotation.x = Math.PI / 2; ring.position.y = 0.01; scene.add(ring);

  const ang = (i) => (i * 2 * Math.PI) / 3;
  const foot = (i) => new THREE.Vector3(Math.sin(ang(i)) * R, 0, Math.cos(ang(i)) * R);
  const legs = crit.map((_, i) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 1, 18), std(COLS[i])); scene.add(m);
    const f = foot(i); m.position.x = f.x; m.position.z = f.z; return m;
  });
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(2.25, 2.25, 0.28, 3), std(0xf7f3e8)); scene.add(seat);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 18), std(0xf5c451, { emissive: 0x3a2a00 })); scene.add(ball);
  const L = { v0: 0, v1: 0, v2: 0 }, tg = [0, 0, 0]; // objeto (no arreglo): gsap trataría un arreglo como lista de objetivos
  const els = crit.map((c, i) => { const el = document.createElement('div'); el.className = 'lb'; el.style.setProperty('--lc', '#' + COLS[i].toString(16).padStart(6, '0')); labelsEl.appendChild(el); return el; });
  const seatEl = document.createElement('div'); seatEl.className = 'lb pk'; seatEl.textContent = 'Mensaje de la diapositiva'; labelsEl.appendChild(seatEl);
  const names = ['Falta', 'En camino', 'Logrado'];
  let ballOff = new THREE.Vector3();

  function setLevels(next) {
    next.forEach((v, i) => { tg[i] = v; });
    if (motion.reduced) { L.v0 = tg[0]; L.v1 = tg[1]; L.v2 = tg[2]; return; }
    gsap.to(L, { v0: tg[0], v1: tg[1], v2: tg[2], duration: 0.9, ease: 'elastic.out(1,0.6)', overwrite: true });
  }

  const up = new THREE.Vector3(0, 1, 0), tmpQ = new THREE.Quaternion();
  let t = 0;
  function frame(dt) {
    t += dt;
    controls.update();
    const P = [L.v0, L.v1, L.v2].map((v, i) => { const f = foot(i); return new THREE.Vector3(f.x, hOf(v), f.z); });
    P.forEach((p, i) => { legs[i].scale.y = p.y; legs[i].position.y = p.y / 2; });
    const n = new THREE.Vector3().subVectors(P[1], P[0]).cross(new THREE.Vector3().subVectors(P[2], P[0]));
    if (n.y < 0) n.negate(); n.normalize();
    const c = P[0].clone().add(P[1]).add(P[2]).multiplyScalar(1 / 3);
    const tilt = Math.hypot(n.x, n.z);
    // balanceo leve cuando está desparejo
    const wob = motion.reduced ? 0 : Math.sin(t * 3.2) * Math.min(0.04, tilt * 0.22);
    seat.quaternion.copy(tmpQ.setFromUnitVectors(up, n));
    seat.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), wob);
    seat.position.copy(c).addScaledVector(n, 0.14);
    // la esfera rueda hacia el lado bajo (gradiente) con tope en el borde
    const dir = new THREE.Vector3(n.x, 0, n.z); if (dir.length() > 1e-4) dir.normalize();
    const want = dir.multiplyScalar(Math.min(1.25, tilt * 7));
    ballOff.lerp(want, motion.reduced ? 1 : Math.min(1, dt * 5));
    ball.position.copy(c).add(ballOff).addScaledVector(n, 0.14 + 0.14 + 0.34);
    camera.updateMatrixWorld();
    els.forEach((el, i) => {
      const lvl = Math.round(tg[i]);
      el.textContent = `${crit[i].t}: ${names[lvl]}`;
      place(el, foot(i).clone().multiplyScalar(1.55), 0.15);
    });
    place(seatEl, c.clone(), 0.9);
    renderer.render(scene, camera);
  }
  return { frame, resize, setLevels };
}
