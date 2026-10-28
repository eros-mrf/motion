// Mesa de guion: siete láminas en fila (una por diapositiva). Se encienden cuando su oración objetivo cumple el criterio.
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';
import * as THREE from 'three';
import { makeStage, makePicker } from '../../../core/scene-kit.js';

function drawCard(c, s, status, selected) {
  const g = c.getContext('2d'); const W = c.width, H = c.height;
  g.clearRect(0, 0, W, H);
  g.fillStyle = '#f8faff'; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(27,70,216,.15)'; g.lineWidth = 1;
  for (let x = 0; x <= W; x += 24) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
  for (let y = 0; y <= H; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  const col = status === 2 ? '#0f9b6b' : status === 1 ? '#e09b00' : '#1b46d8';
  g.fillStyle = col; g.fillRect(0, 0, W, 22);
  g.fillStyle = '#0d1b4c'; g.font = '800 150px Manrope, Inter, sans-serif'; g.textBaseline = 'alphabetic'; g.fillText(String(s.n), 28, 190);
  g.font = '800 40px Manrope, Inter, sans-serif';
  const words = s.t.split(' '); let line = '', y = 250;
  words.forEach((w) => { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > W - 60 && line) { g.fillText(line, 28, y); line = w; y += 46; } else line = t; });
  g.fillText(line, 28, y);
  if (status) { g.fillStyle = col; g.beginPath(); g.arc(W - 60, 100, 36, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); if (status === 2) { g.moveTo(W - 78, 100); g.lineTo(W - 64, 116); g.lineTo(W - 40, 84); } else { g.moveTo(W - 60, 80); g.lineTo(W - 60, 104); g.moveTo(W - 60, 118); g.lineTo(W - 60, 120); } g.stroke(); }
  g.strokeStyle = selected ? '#ffb800' : '#0d1b4c'; g.lineWidth = selected ? 14 : 5; g.strokeRect(3, 3, W - 6, H - 6);
}

export function createTable(canvas, slides7, onPick) {
  const st = makeStage(canvas, { fov: 30, pos: [0, 0.35, 4.6], target: [0, 0.1, 0], ambient: 1.0, sun: [1.3, [2, 4, 5]] });
  const { renderer, scene, camera } = st;

  const W = 1.5, H = 0.95, SP = 1.98;
  const rail = new THREE.Mesh(new THREE.BoxGeometry(14.2, 0.06, 0.5), new THREE.MeshStandardMaterial({ color: 0x0a2373, roughness: 0.6 }));
  rail.position.set(0, -0.58, 0); scene.add(rail);
  const cards = slides7.map((s, i) => {
    const cv = document.createElement('canvas'); cv.width = 480; cv.height = 304;
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    const group = new THREE.Group(); group.add(mesh);
    const back = new THREE.Mesh(new THREE.PlaneGeometry(W + 0.14, H + 0.14), new THREE.MeshBasicMaterial({ color: 0x0a2373 })); back.position.z = -0.02; group.add(back);
    group.position.set((i - 3) * SP, 0, 0); scene.add(group);
    mesh.userData.i = i;
    const o = { s, cv, tex, mesh, group, status: 0, sel: false, k: 0, base: (i - 3) * SP };
    const redraw = () => { drawCard(cv, s, o.status, o.sel); tex.needsUpdate = true; };
    o.redraw = redraw; redraw();
    return o;
  });
  document.fonts?.ready.then(() => cards.forEach((c) => c.redraw()));

  function setStatus(i, st) { const c = cards[i]; if (!c || c.status === st) return; c.status = st; c.redraw(); if (st === 2 && !motion.reduced) gsap.fromTo(c.group.scale, { x: 1.18, y: 1.18 }, { x: 1, y: 1, duration: 0.7, ease: 'elastic.out(1,.45)' }); }
  function setSelected(i) { cards.forEach((c, k) => { const on = k === i; if (c.sel !== on) { c.sel = on; c.redraw(); } gsap.to(c, { k: on ? 1 : 0, duration: motion.reduced ? 0.01 : 0.5, ease: 'power3.out' }); }); }

  let mx = 0;
  makePicker(canvas, camera, () => cards.map((c) => c.mesh), { onPick, idle: 'default' });
  canvas.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width - 0.5) * 2; });
  canvas.addEventListener('pointerleave', () => { mx = 0; });
  st.onResize = () => {
    const th = Math.tan((camera.fov * Math.PI) / 360);
    camera.position.z = Math.max(((7 * SP + 1.4) / 2) / (th * camera.aspect), (H * 1.5) / (2 * th));
  };

  let t = 0;
  function frame(dt) {
    t += dt * (motion.reduced ? 0.2 : 1);
    cards.forEach((c, i) => {
      c.group.position.y = Math.sin(t * 1.3 + i * 0.8) * 0.03 + c.k * 0.1;
      c.group.position.z = c.k * 0.12;
      c.group.rotation.y = (motion.reduced ? 0 : mx * 0.18 * (i - 3) * 0.08) + (c.k ? 0 : 0);
      const sc = 1 + c.k * 0.1; if (!gsap.isTweening(c.group.scale)) c.group.scale.set(sc, sc, 1);
    });
    renderer.render(scene, camera);
  }
  return { frame, resize: st.resize, setStatus, setSelected };
}
