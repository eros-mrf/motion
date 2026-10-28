// Radar 3D de cinco criterios formativos. El pentágono se extruye y cambia a verde cuando el proyecto puede pasar a computación.
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';
import * as THREE from 'three';
import { makeStage, projector } from '../../../core/scene-kit.js';

export function createRadar(canvas, labelsEl, crit) {
  const { renderer, scene, camera, controls, resize } = makeStage(canvas, { fov: 34, pos: [0, 7.8, 7.8], target: [0, 0.2, 0], ambient: 1.0, sun: [1.2, [3, 7, 4]], orbit: { minPolarAngle: 0.4, maxPolarAngle: 1.35, autoRotate: true, autoRotateSpeed: 0.5 } });
  const place = projector(canvas, camera);

  const N = crit.length, R = 2.7;
  const ang = (i) => (i / N) * Math.PI * 2 - Math.PI / 2;
  const pt = (i, k) => new THREE.Vector3(Math.cos(ang(i)) * R * k, 0, Math.sin(ang(i)) * R * k);
  const base = new THREE.Group(); scene.add(base);
  [0.25, 0.5, 0.75, 1].forEach((k) => {
    const pts = Array.from({ length: N }, (_, i) => pt(i, k)); pts.push(pts[0].clone());
    base.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: k === 1 ? 0.85 : 0.38 })));
  });
  for (let i = 0; i < N; i++) base.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), pt(i, 1)]), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })));
  const ds = new THREE.Shape();
  for (let i = 0; i < N; i++) { const p = pt(i, 1.08); if (!i) ds.moveTo(p.x, -p.z); else ds.lineTo(p.x, -p.z); }
  ds.closePath();
  const disc = new THREE.Mesh(new THREE.ShapeGeometry(ds), new THREE.MeshBasicMaterial({ color: 0x0a2373, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
  disc.rotation.x = -Math.PI / 2; disc.position.y = -0.05; base.add(disc);

  const vals = Array(N).fill(0.05);
  const mat = new THREE.MeshStandardMaterial({ color: 0xffe14d, transparent: true, opacity: 0.86, roughness: 0.45, side: THREE.DoubleSide });
  let mesh = null, outline = null;
  const markers = Array.from({ length: N }, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), new THREE.MeshStandardMaterial({ color: 0xffffff })); scene.add(m); return m; });
  function rebuild() {
    if (mesh) { mesh.geometry.dispose(); scene.remove(mesh); }
    if (outline) { outline.geometry.dispose(); scene.remove(outline); }
    const sh = new THREE.Shape();
    vals.forEach((v, i) => { const p = pt(i, Math.max(0.04, v)); if (!i) sh.moveTo(p.x, -p.z); else sh.lineTo(p.x, -p.z); });
    sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.38, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    mesh = new THREE.Mesh(geo, mat); mesh.position.y = 0; scene.add(mesh);
    const pts = vals.map((v, i) => { const p = pt(i, Math.max(0.04, v)); p.y = 0.39; return p; }); pts.push(pts[0].clone());
    outline = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xffffff }));
    scene.add(outline);
    markers.forEach((m, i) => { const p = pt(i, Math.max(0.04, vals[i])); m.position.set(p.x, 0.5, p.z); m.material.color.set(vals[i] >= 0.99 ? 0x6ff0c8 : 0xffffff); });
  }
  rebuild();
  const els = crit.map((c, i) => { const el = document.createElement('div'); el.className = 'lb'; el.textContent = c.t; labelsEl.appendChild(el); return el; });

  function setValues(target) {
    const from = vals.slice();
    const o = { k: 0 };
    gsap.to(o, { k: 1, duration: motion.reduced ? 0.01 : 1.0, ease: 'power3.out', onUpdate: () => { target.forEach((v, i) => { vals[i] = from[i] + (v - from[i]) * o.k; }); rebuild(); } });
  }
  function setGate(on) { const c = new THREE.Color(on ? 0x6ff0c8 : 0xffe14d); gsap.to(mat.color, { r: c.r, g: c.g, b: c.b, duration: 0.6 }); }

  function frame() {
    controls.autoRotate = !motion.reduced; controls.update(); camera.updateMatrixWorld();
    els.forEach((el, i) => { const p = pt(i, 1.16); p.y = 0.1; place(el, p); });
    renderer.render(scene, camera);
  }
  return { frame, resize, setValues, setGate };
}
