// Tarjeta de autocuidado en 3D: un panel de cristal con el mensaje E-R-L que escribe el grupo.
// La textura se redibuja en un canvas 2D cada vez que cambia el texto; la tarjeta flota y se inclina con el cursor.
import * as THREE from 'three';
import { motion } from '../../../src/util.js';

const W = 1100, H = 700;
const COL = { E: '#7a5cff', R: '#16b5a4', L: '#ff5d73' };
const STATE = { g: '#16b5a4', y: '#ffa94d', r: '#ff5d73', '': 'rgba(42,33,64,.22)' };
const CRIT = [['correcto', 'Correcto'], ['util', 'Útil'], ['respetuoso', 'Respetuoso'], ['verificable', 'Verificable']];

function wrapLines(g, text, maxW) {
  const out = []; let line = '';
  for (const w of text.split(/\s+/).filter(Boolean)) {
    const t = line ? line + ' ' + w : w;
    if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
  }
  if (line) out.push(line);
  return out;
}
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

function draw(c, m) {
  const g = c.getContext('2d');
  g.clearRect(0, 0, W, H);
  const grd = g.createLinearGradient(0, 0, W, H);
  grd.addColorStop(0, '#ffffff'); grd.addColorStop(1, '#f1eaff');
  g.fillStyle = grd; rr(g, 8, 8, W - 16, H - 16, 54); g.fill();
  g.lineWidth = 6; const bg = g.createLinearGradient(0, 0, W, 0); bg.addColorStop(0, '#7a5cff'); bg.addColorStop(0.5, '#ff5d73'); bg.addColorStop(1, '#ffa94d');
  g.strokeStyle = bg; rr(g, 8, 8, W - 16, H - 16, 54); g.stroke();
  g.fillStyle = '#5b5073'; g.font = '700 24px "Space Mono", monospace'; g.fillText('TARJETA DE AUTOCUIDADO', 56, 70);
  const blocks = [['E', 'EVIDENCIA', m.E], ['R', 'RECOMENDACIÓN', m.R], ['L', 'LÍMITE', m.L]];
  let y = 108;
  blocks.forEach(([k, name, text]) => {
    g.fillStyle = COL[k]; rr(g, 56, y, 14, 126, 7); g.fill();
    g.font = '700 22px "Space Mono", monospace'; g.fillText(name, 88, y + 22);
    g.font = '600 32px "Plus Jakarta Sans", sans-serif'; g.fillStyle = text ? '#2a2140' : 'rgba(42,33,64,.35)';
    const lines = wrapLines(g, text || 'Escribe aquí…', W - 180).slice(0, 3);
    lines.forEach((l, i) => g.fillText(l + (i === 2 && wrapLines(g, text || '', W - 180).length > 3 ? '…' : ''), 88, y + 62 + i * 40));
    y += 152;
  });
  // criterios
  CRIT.forEach(([k, name], i) => {
    const x = 56 + i * 250;
    g.fillStyle = STATE[m.crit?.[k] ?? '']; g.beginPath(); g.arc(x + 14, H - 52, 14, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#2a2140'; g.font = '700 24px "Plus Jakarta Sans", sans-serif'; g.fillText(name, x + 38, H - 43);
  });
}

export function createCard3D(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
  camera.position.set(0, 0, 8.6);

  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  let model = { E: '', R: '', L: '', crit: {} };
  const redraw = () => { draw(cv, model); tex.needsUpdate = true; };
  redraw();
  document.fonts?.ready.then(redraw);

  const group = new THREE.Group(); scene.add(group);
  const AR = W / H, CW = 5.2, CH = CW / AR;
  const card = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(CW + 0.5, CH + 0.5), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, uniforms: { uTime: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform float uTime; varying vec2 vUv; void main(){ vec2 d=abs(vUv-.5)*2.; float e=max(d.x,d.y); float a=smoothstep(.78,1.,e)*(1.-smoothstep(1.,1.2,e)); vec3 c=mix(vec3(.48,.36,1.),vec3(1.,.36,.45),vUv.x+.2*sin(uTime)); gl_FragColor=vec4(c,a*.55); }',
  }));
  glow.position.z = -0.05;
  // destello que cruza la tarjeta
  const shine = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uT: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'uniform float uT; varying vec2 vUv; void main(){ float x=vUv.x+vUv.y*.35; float a=exp(-pow((x-uT)*7.,2.)); gl_FragColor=vec4(vec3(1.),a*.35); }',
  }));
  shine.position.z = 0.01;
  group.add(glow, card, shine);

  // chispas
  const NP = 70, pp = new Float32Array(NP * 3), vs = new Float32Array(NP);
  for (let i = 0; i < NP; i++) { pp.set([(Math.random() - 0.5) * 7, (Math.random() - 0.5) * 4.4, -0.3 - Math.random()], i * 3); vs[i] = 0.1 + Math.random() * 0.3; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xb59bff, size: 0.08, transparent: true, opacity: 0.8, depthWrite: false })));

  let mx = 0, my = 0, t = 0, pulse = 0;
  canvas.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mx = ((e.clientX - r.left) / r.width - 0.5) * 2; my = ((e.clientY - r.top) / r.height - 0.5) * 2; });
  canvas.addEventListener('pointerleave', () => { mx = 0; my = 0; });

  function update(m) { model = m; redraw(); pulse = 1; }
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const th = Math.tan((camera.fov * Math.PI) / 360);
    camera.position.z = Math.max((CW / 0.9) / (2 * th * camera.aspect), (CH / 0.84) / (2 * th));
  }
  new ResizeObserver(resize).observe(canvas); resize();

  function frame(dt) {
    t += dt * (motion.reduced ? 0.2 : 1);
    pulse = Math.max(0, pulse - dt * 2);
    const par = motion.reduced ? 0 : 1;
    group.rotation.y += ((mx * 0.45 * par) - group.rotation.y) * (1 - Math.exp(-dt * 4));
    group.rotation.x += ((my * 0.3 * par) - group.rotation.x) * (1 - Math.exp(-dt * 4));
    group.position.y = Math.sin(t * 1.2) * 0.06;
    group.scale.setScalar(1 + pulse * 0.025);
    glow.material.uniforms.uTime.value = t;
    shine.material.uniforms.uT.value = ((t * 0.35) % 2.4) - 0.7;
    const p = pg.attributes.position.array;
    for (let i = 0; i < NP; i++) { p[i * 3 + 1] += vs[i] * dt; if (p[i * 3 + 1] > 2.4) p[i * 3 + 1] = -2.4; }
    pg.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  }
  return { frame, resize, update, redraw };
}
