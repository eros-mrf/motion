// Anillo 3D del ensayo: 5 minutos = una vuelta. Cada integrante ocupa un arco con su color (según cuánto habló),
// el arco verde exterior marca la zona de 3 a 4 minutos y la aguja avanza con el cronómetro.
import { motion } from '../../../src/util.js';
import * as THREE from 'three';
import { makeStage, projector } from '../../../core/scene-kit.js';

const TOTAL = 300, RO = 3.0, RI = 2.0;
const ang = (s) => (Math.min(s, TOTAL) / TOTAL) * Math.PI * 2;
const pt = (a, r) => new THREE.Vector2(Math.sin(a) * r, Math.cos(a) * r);

function sector(a0, a1, r0, r1, depth, color) {
  const sh = new THREE.Shape(), n = Math.max(2, Math.ceil((a1 - a0) / 0.05));
  const outer = [], inner = [];
  for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; outer.push(pt(a, r1)); inner.push(pt(a, r0)); }
  sh.moveTo(outer[0].x, outer[0].y); outer.forEach((p) => sh.lineTo(p.x, p.y)); inner.reverse().forEach((p) => sh.lineTo(p.x, p.y)); sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false }); g.rotateX(-Math.PI / 2);
  return new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color, roughness: 0.5 }));
}

export function createRing(canvas, labelsEl) {
  const { renderer, scene, camera, controls, resize } = makeStage(canvas, {
    fov: 36, pos: [0, 7.6, 6.8], target: [0, 0, 0.2], ambient: 0.95, sun: [1.25, [3, 8, 5]],
    orbit: { minPolarAngle: 0.35, maxPolarAngle: 1.3 },
  });
  const place = projector(canvas, camera);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(3.7, 3.7, 0.2, 64), new THREE.MeshStandardMaterial({ color: 0x2b241d, roughness: 0.7 })); base.position.y = -0.12; scene.add(base);
  const track = sector(0, Math.PI * 2 - 0.0001, RI, RO, 0.06, 0x3f362c); scene.add(track);
  const zone = sector(ang(180), ang(240), RO + 0.12, RO + 0.5, 0.2, 0x12a150); scene.add(zone);
  for (let s = 0; s < TOTAL; s += 30) {
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, s % 60 ? 0.22 : 0.4), new THREE.MeshStandardMaterial({ color: 0xfffdf6 }));
    const a = ang(s), p = pt(a, RI - 0.3); t.position.set(p.x, 0.05, -p.y); t.rotation.y = -a; scene.add(t);
  }
  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.35, RO + 0.5), new THREE.MeshStandardMaterial({ color: 0xffcf3f, emissive: 0x6b5200 }));
  needle.geometry.translate(0, 0, -(RO + 0.5) / 2); needle.position.y = 0.4; scene.add(needle);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.5, 24), new THREE.MeshStandardMaterial({ color: 0xffcf3f })); hub.position.y = 0.3; scene.add(hub);
  const mins = [0, 1, 2, 3, 4].map((m) => { const el = document.createElement('div'); el.className = 'lb dk'; el.textContent = m === 0 ? '0' : `${m} min`; el.style.setProperty('--lc', '#ffcf3f'); labelsEl.appendChild(el); return { el, m }; });
  let segs = [], meshes = [], now = 0;
  function setTime(t) { now = t; }
  function setSegments(list, t) {
    now = t; meshes.forEach((m) => { scene.remove(m); m.geometry.dispose(); }); meshes = [];
    list.forEach(({ from, to, color }) => { if (to - from < 0.5) return; const m = sector(ang(from), ang(Math.min(to, TOTAL)), RI + 0.05, RO - 0.05, 0.38, color); scene.add(m); meshes.push(m); });
    segs = list;
  }
  function frame() {
    controls.update(); camera.updateMatrixWorld();
    needle.rotation.y = -ang(now);
    mins.forEach(({ el, m }) => { const a = ang(m * 60), p = pt(a, RO + 0.95); place(el, new THREE.Vector3(p.x, 0.2, -p.y)); });
    renderer.render(scene, camera);
  }
  return { frame, resize, setSegments, setTime };
}
