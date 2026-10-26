// Fondo 3D: "red de información". Tres enjambres de color (rumor / prejuicio / evidencia)
// + una red de nodos con pulsos que viajan por las conexiones.
// El peso de cada color cambia según la diapositiva; cada transición da un impulso de cámara.
import * as THREE from 'three';
import { rng, lerp, motion } from '../util.js';

const PAL = [new THREE.Color('#ff5c3a'), new THREE.Color('#a07bff'), new THREE.Color('#2ee6c5'), new THREE.Color('#bcc8ff')];

// pesos [rumor, prejuicio, evidencia, neutro] por diapositiva
const MOODS = [
  [1.0, 1.0, 1.0, 0.6], [0.5, 0.5, 0.9, 0.7], [1.0, 0.6, 0.5, 0.5], [0.4, 1.0, 0.5, 0.6],
  [0.5, 0.9, 0.7, 0.6], [0.9, 0.4, 1.0, 0.5], [1.0, 0.8, 0.3, 0.4], [1.0, 0.4, 0.4, 0.6],
  [0.6, 0.4, 1.0, 0.6], [0.7, 0.5, 0.9, 0.6], [0.5, 0.9, 0.8, 0.5], [0.8, 0.6, 0.8, 0.5],
  [0.3, 0.9, 1.0, 0.7], [0.4, 0.5, 1.0, 0.8],
];

const STAR_VS = /* glsl */ `
  uniform float uTime, uScale, uPulse, uClickK;
  uniform vec3 uClick;
  uniform vec4 uW;
  uniform vec3 uC[4];
  attribute float aSeed, aSize, aIdx;
  varying vec3 vCol; varying float vA;
  void main(){
    vec3 p = position;
    float t = uTime*.15 + aSeed*20.;
    p += vec3(sin(t*1.3+p.y*.3), cos(t*1.1+p.x*.3), sin(t+p.z*.3))*.6;
    vec2 dv = p.xy - uClick.xy;
    float d = length(dv);
    p.xy += normalize(dv+1e-4) * exp(-d*.32) * uClickK * 3.2;
    vec4 mv = modelViewMatrix * vec4(p,1.);
    gl_Position = projectionMatrix * mv;
    int i = int(aIdx+.5);
    float w = i==0 ? uW.x : (i==1 ? uW.y : (i==2 ? uW.z : uW.w));
    vCol = uC[i];
    vA = w * (.35 + .65*(.5+.5*sin(uTime*.8+aSeed*40.))) * (1.+uPulse*1.6);
    gl_PointSize = max(1.5, aSize * uScale * (1.+uPulse*.7) / -mv.z) * clamp(w+.25,0.,1.2);
  }`;
const STAR_FS = /* glsl */ `
  varying vec3 vCol; varying float vA;
  void main(){
    float d = length(gl_PointCoord-.5);
    float a = smoothstep(.5,0.,d); a *= a;
    gl_FragColor = vec4(vCol, a*vA);
  }`;

const LINE_VS = /* glsl */ `
  uniform vec4 uW; uniform vec3 uC[4]; uniform float uPulse;
  attribute float aIdx; varying vec3 vCol; varying float vA;
  void main(){
    int i = int(aIdx+.5);
    float w = i==0 ? uW.x : (i==1 ? uW.y : (i==2 ? uW.z : uW.w));
    vCol = uC[i]; vA = w*.2*(1.+uPulse);
    gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.);
  }`;
const LINE_FS = /* glsl */ `varying vec3 vCol; varying float vA; void main(){ gl_FragColor = vec4(vCol, vA); }`;

const PULSE_VS = /* glsl */ `
  uniform float uTime, uScale; uniform vec4 uW; uniform vec3 uC[4];
  attribute vec3 aA; attribute vec3 aB; attribute float aSpeed, aOff, aIdx;
  varying vec3 vCol; varying float vA;
  void main(){
    float f = fract(uTime*aSpeed + aOff);
    vec3 p = mix(aA, aB, f);
    vec4 mv = modelViewMatrix*vec4(p,1.);
    gl_Position = projectionMatrix*mv;
    int i = int(aIdx+.5);
    float w = i==0 ? uW.x : (i==1 ? uW.y : (i==2 ? uW.z : uW.w));
    vCol = uC[i]; vA = w * sin(f*3.14159);
    gl_PointSize = .26*uScale/-mv.z;
  }`;
const PULSE_FS = /* glsl */ `
  varying vec3 vCol; varying float vA;
  void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,0.,d); gl_FragColor=vec4(vCol*1.4, a*a*vA); }`;

export function createBG(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x060812, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  camera.position.set(0, 0, 14);

  const R = rng(1807);
  const uniforms = {
    uTime: { value: 0 }, uScale: { value: 800 }, uPulse: { value: 0 },
    uW: { value: new THREE.Vector4(1, 1, 1, 0.6) }, uC: { value: PAL },
    uClick: { value: new THREE.Vector3(999, 999, 0) }, uClickK: { value: 0 },
  };
  const addBlend = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending };

  // --- enjambres de fondo ---
  const N = 2600;
  const pos = new Float32Array(N * 3), seed = new Float32Array(N), size = new Float32Array(N), idx = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const r = 5 + Math.pow(R(), 0.75) * 30;
    const th = R() * Math.PI * 2, ph = Math.acos(2 * R() - 1);
    pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.8, r * Math.cos(ph)], i * 3);
    seed[i] = R(); size[i] = 0.05 + R() * R() * 0.22;
    const q = R(); idx[i] = q < 0.22 ? 0 : q < 0.44 ? 1 : q < 0.74 ? 2 : 3;
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  sg.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  sg.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  sg.setAttribute('aIdx', new THREE.BufferAttribute(idx, 1));
  const stars = new THREE.Points(sg, new THREE.ShaderMaterial({ uniforms, vertexShader: STAR_VS, fragmentShader: STAR_FS, ...addBlend }));
  scene.add(stars);

  // --- red de nodos (hubs + conexiones + pulsos) ---
  const net = new THREE.Group();
  scene.add(net);
  const H = 120, hubs = [];
  for (let i = 0; i < H; i++) {
    const r = 4 + R() * 7.5, th = R() * Math.PI * 2, ph = Math.acos(2 * R() - 1);
    hubs.push({ p: new THREE.Vector3(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.75, r * Math.cos(ph)), idx: (R() * 3.4) | 0 });
  }
  const hp = new Float32Array(H * 3), hs = new Float32Array(H), hseed = new Float32Array(H), hi = new Float32Array(H);
  hubs.forEach((h, i) => { hp.set([h.p.x, h.p.y, h.p.z], i * 3); hs[i] = 0.22 + R() * 0.22; hseed[i] = R(); hi[i] = h.idx; });
  const hg = new THREE.BufferGeometry();
  hg.setAttribute('position', new THREE.BufferAttribute(hp, 3));
  hg.setAttribute('aSeed', new THREE.BufferAttribute(hseed, 1));
  hg.setAttribute('aSize', new THREE.BufferAttribute(hs, 1));
  hg.setAttribute('aIdx', new THREE.BufferAttribute(hi, 1));
  const hubPts = new THREE.Points(hg, new THREE.ShaderMaterial({ uniforms: { ...uniforms }, vertexShader: STAR_VS, fragmentShader: STAR_FS, ...addBlend }));
  net.add(hubPts);

  const edges = [];
  for (let i = 0; i < H; i++) {
    const ds = hubs.map((h, j) => [j, h.p.distanceToSquared(hubs[i].p)]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 2);
    ds.forEach(([j]) => { if (!edges.some(([a, b]) => (a === i && b === j) || (a === j && b === i))) edges.push([i, j]); });
  }
  const lp = new Float32Array(edges.length * 6), li = new Float32Array(edges.length * 2);
  edges.forEach(([a, b], k) => {
    lp.set([hubs[a].p.x, hubs[a].p.y, hubs[a].p.z, hubs[b].p.x, hubs[b].p.y, hubs[b].p.z], k * 6);
    li[k * 2] = hubs[a].idx; li[k * 2 + 1] = hubs[a].idx;
  });
  const lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.BufferAttribute(lp, 3));
  lg.setAttribute('aIdx', new THREE.BufferAttribute(li, 1));
  net.add(new THREE.LineSegments(lg, new THREE.ShaderMaterial({ uniforms, vertexShader: LINE_VS, fragmentShader: LINE_FS, ...addBlend })));

  const P = Math.min(70, edges.length);
  const pa = new Float32Array(P * 3), pb = new Float32Array(P * 3), psp = new Float32Array(P), po = new Float32Array(P), pi = new Float32Array(P);
  for (let k = 0; k < P; k++) {
    const [a, b] = edges[(R() * edges.length) | 0];
    pa.set([hubs[a].p.x, hubs[a].p.y, hubs[a].p.z], k * 3); pb.set([hubs[b].p.x, hubs[b].p.y, hubs[b].p.z], k * 3);
    psp[k] = 0.12 + R() * 0.22; po[k] = R(); pi[k] = hubs[a].idx;
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P * 3), 3));
  pg.setAttribute('aA', new THREE.BufferAttribute(pa, 3));
  pg.setAttribute('aB', new THREE.BufferAttribute(pb, 3));
  pg.setAttribute('aSpeed', new THREE.BufferAttribute(psp, 1));
  pg.setAttribute('aOff', new THREE.BufferAttribute(po, 1));
  pg.setAttribute('aIdx', new THREE.BufferAttribute(pi, 1));
  const pulses = new THREE.Points(pg, new THREE.ShaderMaterial({ uniforms, vertexShader: PULSE_VS, fragmentShader: PULSE_FS, ...addBlend }));
  pulses.frustumCulled = false;
  net.add(pulses);

  // --- estado dinámico ---
  const w = new THREE.Vector4(1, 1, 1, 0.6), wT = new THREE.Vector4(...MOODS[0]);
  const camT = new THREE.Vector3(0, 0, 14), look = new THREE.Vector3(), lookT = new THREE.Vector3();
  let kick = 0, mx = 0, my = 0, clickT = 9, time = 0, mood = 0;
  const ray = new THREE.Raycaster();

  function resize() {
    const W = innerWidth, Hh = innerHeight;
    renderer.setSize(W, Hh, false);
    camera.aspect = W / Hh; camera.updateProjectionMatrix();
    uniforms.uScale.value = (Hh * renderer.getPixelRatio() * 0.5) / Math.tan((camera.fov * Math.PI) / 360);
    hubPts.material.uniforms.uScale = uniforms.uScale;
  }
  resize();
  addEventListener('resize', resize);
  addEventListener('pointermove', (e) => { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; });

  function setMood(i) {
    mood = i;
    wT.set(...MOODS[i % MOODS.length]);
    const a = i * 0.83;
    camT.set(Math.sin(a) * 2.4, Math.cos(a * 1.3) * 1.3, 14 - (i % 3) * 1.4);
    lookT.set(Math.sin(a + 1) * 0.8, Math.cos(a) * 0.4, 0);
    kick = 1;
  }
  function pulseAt(clientX, clientY) {
    ray.setFromCamera(new THREE.Vector2((clientX / innerWidth) * 2 - 1, -(clientY / innerHeight) * 2 + 1), camera);
    const t = -ray.ray.origin.z / ray.ray.direction.z;
    const p = ray.ray.origin.clone().addScaledVector(ray.ray.direction, t);
    // convertir a espacio local aproximado (el grupo rota despacio: efecto suficiente)
    uniforms.uClick.value.copy(p);
    clickT = 0; kick = Math.max(kick, 0.7);
  }

  function update(dt) {
    const slow = motion.reduced ? 0.1 : 1;
    time += dt * slow;
    uniforms.uTime.value = time;
    kick *= Math.exp(-dt * 2.6);
    uniforms.uPulse.value = kick;
    clickT += dt;
    uniforms.uClickK.value = clickT < 3 ? Math.exp(-clickT * 3.2) * (motion.reduced ? 0.3 : 1) : 0;
    w.lerp(wT, 1 - Math.exp(-dt * 2.2));
    uniforms.uW.value.copy(w);
    stars.rotation.y = time * 0.012; stars.rotation.x = Math.sin(time * 0.05) * 0.06;
    net.rotation.y = -time * 0.03;
    const par = motion.reduced ? 0 : 1;
    camera.position.x = lerp(camera.position.x, camT.x + mx * 1.2 * par, 1 - Math.exp(-dt * 2));
    camera.position.y = lerp(camera.position.y, camT.y - my * 0.8 * par, 1 - Math.exp(-dt * 2));
    camera.position.z = lerp(camera.position.z, camT.z - kick * 2.2, 1 - Math.exp(-dt * 3));
    look.lerp(lookT, 1 - Math.exp(-dt * 1.5));
    camera.lookAt(look);
    renderer.render(scene, camera);
  }

  return { update, setMood, pulseAt, kick: () => { kick = 1; }, get mood() { return mood; } };
}
