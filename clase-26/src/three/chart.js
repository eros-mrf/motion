// Gráfico de barras 3D con datos ficticios. Las partes del gráfico (título, ejes con unidad, fuente y marca «ilustrativo») se activan desde la diapositiva.
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';
import * as THREE from 'three';
import { makeStage, makePicker, projector } from '../../../core/scene-kit.js';

const COL = { mint: 0x7be0c0, sky: 0x8fd0ff, sun: 0xf5c451, co: 0xff7059 };
const MAXV = 20, H = 4.2; // valor máximo del eje y altura en unidades 3D

export function createChart(canvas, labelsEl, chart, onPick) {
  const { renderer, scene, camera, controls, resize } = makeStage(canvas, {
    fov: 34, pos: [0, 4.3, 10.6], target: [0, 1.5, 0], ambient: 0.95, sun: [1.35, [4, 9, 6]],
    orbit: { minPolarAngle: 0.7, maxPolarAngle: 1.45, minAzimuthAngle: -0.85, maxAzimuthAngle: 0.85 },
  });
  const place = projector(canvas, camera);
  const n = chart.bars.length, gap = 1.75, x0 = -((n - 1) * gap) / 2;

  const floor = new THREE.Mesh(new THREE.BoxGeometry(n * gap + 1.6, 0.16, 3.4), new THREE.MeshStandardMaterial({ color: 0x103b35, roughness: 0.8 }));
  floor.position.y = -0.08; scene.add(floor);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(n * gap + 1.6, H + 0.6), new THREE.MeshBasicMaterial({ color: 0x0a2926, transparent: true, opacity: 0.85 }));
  wall.position.set(0, (H + 0.6) / 2, -1.7); scene.add(wall);

  // ejes: líneas de referencia y marcas (se muestran con «Ejes con unidad»)
  const axes = new THREE.Group(); scene.add(axes);
  const ticks = [0, 5, 10, 15, 20];
  const tickEls = ticks.map((v) => { const el = document.createElement('div'); el.className = 'lb'; el.style.setProperty('--lc', '#7be0c0'); el.textContent = v; labelsEl.appendChild(el); return { el, v }; });
  ticks.forEach((v) => {
    const y = (v / MAXV) * H;
    axes.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-(n * gap) / 2 - 0.5, y, -1.69), new THREE.Vector3((n * gap) / 2 + 0.5, y, -1.69)]),
      new THREE.LineBasicMaterial({ color: 0xf4f1e8, transparent: true, opacity: v === 0 ? 0.9 : 0.35 })));
  });
  axes.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-(n * gap) / 2 - 0.5, 0, -1.69), new THREE.Vector3(-(n * gap) / 2 - 0.5, H, -1.69)]), new THREE.LineBasicMaterial({ color: 0xf4f1e8 })));

  // barras
  const bars = chart.bars.map((b, i) => {
    const mat = new THREE.MeshStandardMaterial({ color: COL[b.c], roughness: 0.45, metalness: 0.05, emissive: 0x000000 });
    const m = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1, 1.15), mat);
    m.userData.i = i; m.position.x = x0 + i * gap; scene.add(m);
    return { m, mat, b, h: (b.v / MAXV) * H, k: 0 };
  });
  const mk = (cls, text, lc) => { const el = document.createElement('div'); el.className = cls; if (lc) el.style.setProperty('--lc', lc); el.textContent = text; labelsEl.appendChild(el); return el; };
  const valEls = bars.map(({ b }) => mk('lb', b.v, '#f5c451'));
  const catEls = bars.map(({ b }) => mk('lb', b.short || b.t, '#8fd0ff'));
  const unitEl = mk('lb', chart.unit, '#7be0c0');
  const titleEl = mk('lb', chart.title, '#ff7059'); titleEl.style.fontSize = '19px';
  const srcEl = mk('lb', 'Fuente: ' + chart.source, '#f5c451');
  const illEl = mk('lb pk', 'ILUSTRATIVO', '#1a0e0b'); illEl.style.transform += ' rotate(-6deg)';
  const show = { title: false, axes: false, src: false, ill: false };
  let sel = -1, hov = -1;

  makePicker(canvas, camera, () => bars.map((x) => x.m), { onPick: (i) => { select(i); onPick?.(i); }, onHover: (i) => { hov = i; } });

  function grow() {
    bars.forEach((x, i) => {
      x.k = motion.reduced ? 1 : 0;
      if (!motion.reduced) gsap.to(x, { k: 1, duration: 0.9, delay: 0.1 + i * 0.1, ease: 'back.out(1.4)' });
    });
  }
  function select(i) { sel = i; }
  function setParts(p) { Object.assign(show, p); }

  function frame() {
    controls.update(); camera.updateMatrixWorld();
    bars.forEach((x, i) => {
      const h = Math.max(0.02, x.h * x.k);
      x.m.scale.y = h; x.m.position.y = h / 2;
      const on = i === sel, hv = i === hov;
      x.mat.emissive.setHex(on ? 0x444444 : hv ? 0x222222 : 0x000000);
      x.m.scale.x = x.m.scale.z = on ? 1.08 : 1;
    });
    bars.forEach((x, i) => {
      place(valEls[i], new THREE.Vector3(x.m.position.x, x.m.scale.y, 0), 0.0); valEls[i].style.marginTop = '-20px';
      place(catEls[i], new THREE.Vector3(x.m.position.x, 0, 0.95), -0.05); catEls[i].style.marginTop = '14px';
    });
    tickEls.forEach(({ el, v }) => { el.style.display = show.axes ? '' : 'none'; place(el, new THREE.Vector3(-(n * gap) / 2 - 0.95, (v / MAXV) * H, -1.69)); });
    unitEl.style.display = show.axes ? '' : 'none'; place(unitEl, new THREE.Vector3(-(n * gap) / 2 - 0.5, H + 0.35, -1.69));
    axes.visible = show.axes;
    titleEl.style.display = show.title ? '' : 'none'; place(titleEl, new THREE.Vector3(0, H + 0.95, -1.69));
    srcEl.style.display = show.src ? '' : 'none'; place(srcEl, new THREE.Vector3(0, -0.2, 1.7), -0.4);
    illEl.style.display = show.ill ? '' : 'none'; place(illEl, new THREE.Vector3((n * gap) / 2 - 0.4, H + 0.2, -1.69));
    renderer.render(scene, camera);
  }
  return { frame, resize, setParts, select, grow };
}
