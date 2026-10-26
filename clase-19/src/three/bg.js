// Fondo 3D · Clase 19: "retícula de datos".
// Terreno de cuadrícula con relieve, sol rayado en el horizonte, hojas de documentos flotantes
// y motas de datos. Cada diapositiva cambia el tono; cada transición lanza un impulso de "warp";
// el clic dispara una onda expansiva sobre el terreno.
import * as THREE from 'three';
import { rng, lerp, motion } from '../../../src/util.js';

const MOODS = [
  ['#b8ff3c', '#4d8dff', '#ffcf3d', '#ff4d94'], // 1 portada
  ['#b8ff3c', '#4d8dff', '#ffcf3d', '#ff4d94'],
  ['#ffcf3d', '#ff4d94', '#ffcf3d', '#b8ff3c'],
  ['#4d8dff', '#b8ff3c', '#4d8dff', '#ff4d94'],
  ['#4d8dff', '#b8ff3c', '#4d8dff', '#ffcf3d'],
  ['#b8ff3c', '#ffcf3d', '#b8ff3c', '#4d8dff'],
  ['#4d8dff', '#ffcf3d', '#4d8dff', '#b8ff3c'],
  ['#ffcf3d', '#b8ff3c', '#ff4d94', '#4d8dff'],
  ['#b8ff3c', '#4d8dff', '#4d8dff', '#ff4d94'],
  ['#ff4d94', '#ffcf3d', '#ff4d94', '#4d8dff'],
  ['#ff4d94', '#b8ff3c', '#ff4d94', '#ffcf3d'],
  ['#ff4d94', '#4d8dff', '#ff4d94', '#b8ff3c'],
  ['#4d8dff', '#ff4d94', '#4d8dff', '#ffcf3d'],
  ['#ffcf3d', '#b8ff3c', '#ffcf3d', '#4d8dff'],
];

const TERRAIN_VS = /* glsl */ `
  uniform float uTime, uScroll, uRad; uniform vec2 uClick;
  varying vec3 vW; varying float vH; varying float vRing; varying float vD;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
  void main(){
    vec3 p = position;                       // plano XZ ya rotado en la geometría
    vec2 q = vec2(p.x, p.z + uScroll);
    float side = smoothstep(6., 26., abs(p.x));
    float h = (noise(q*.18) * 2. - 1.) * 5. * side;
    h += sin(q.x*.35 + uTime*.6) * cos(q.y*.28 - uTime*.5) * .35;
    float d = distance(vec2(p.x, p.z), uClick);
    vRing = exp(-pow((d - uRad)*.45, 2.)) * step(.01, uRad) * (1. - smoothstep(0., 90., uRad));
    h += vRing * 1.6;
    p.y += h; vH = h;
    vec4 wp = modelMatrix * vec4(p, 1.);
    vW = vec3(q.x, wp.y, q.y);
    vD = length(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`;
const TERRAIN_FS = /* glsl */ `
  uniform vec3 uC1, uC2; uniform float uPulse;
  varying vec3 vW; varying float vH; varying float vRing; varying float vD;
  void main(){
    vec2 g = vW.xz * .5;
    vec2 gr = abs(fract(g - .5) - .5) / fwidth(g);
    float line = 1. - min(min(gr.x, gr.y), 1.);
    vec3 col = mix(uC1, uC2, smoothstep(-.4, 5., vH));
    float fade = exp(-vD * .017);
    float a = (line * (.6 + uPulse*.8 + vRing*1.5) + .03) * fade;
    gl_FragColor = vec4(col * (1. + vRing*1.2), a);
  }`;

const SUN_VS = /* glsl */ `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const SUN_FS = /* glsl */ `
  uniform vec3 uA, uB; uniform float uTime; varying vec2 vUv;
  void main(){
    vec2 p = vUv - .5; float r = length(p);
    float disc = smoothstep(.5, .485, r);
    float glow = exp(-r*3.2) * .55;
    float stripe = step(.5, fract((vUv.y - uTime*.01) * 22.));
    float cut = mix(1., stripe, smoothstep(.55, .25, vUv.y));
    vec3 col = mix(uB, uA, smoothstep(.1, .9, vUv.y));
    float a = (disc * cut * .85 + glow);
    gl_FragColor = vec4(col, a);
  }`;

const DOC_VS = /* glsl */ `
  attribute float aSeed; attribute float aIdx; varying vec2 vUv; varying float vS; varying float vI;
  void main(){
    vUv = uv; vS = aSeed; vI = aIdx;
    vec4 mv = vec4(position, 1.);
    #ifdef USE_INSTANCING
      mv = instanceMatrix * mv;
    #endif
    gl_Position = projectionMatrix * modelViewMatrix * mv;
  }`;
const DOC_FS = /* glsl */ `
  uniform vec3 uC[4]; uniform float uTime, uPulse; varying vec2 vUv; varying float vS; varying float vI;
  void main(){
    int i = int(vI + .5);
    vec3 c = uC[i];
    vec2 u = vUv;
    float border = step(u.x, .04) + step(.96, u.x) + step(u.y, .03) + step(.97, u.y);
    float head = step(.82, u.y) * step(u.y, .9) * step(.08, u.x) * step(u.x, .6);
    float line = step(.5, fract(u.y * 16.)) * step(.1, u.x) * step(u.x, .9 - .25*fract(vS*7. + floor(u.y*16.)*.37)) * step(.08, u.y) * step(u.y, .78);
    float a = clamp(border*.8 + head*.9 + line*.35, 0., 1.);
    a *= .42 + .25*sin(uTime*.8 + vS*30.) + uPulse*.5;
    gl_FragColor = vec4(c, a);
  }`;

const MOTE_VS = /* glsl */ `
  uniform float uTime, uScale; attribute float aSeed; varying float vA;
  void main(){
    vec3 p = position;
    p.y = mod(p.y + uTime*(.25 + aSeed*.5), 18.);
    p.x += sin(uTime*.4 + aSeed*30.) * .6;
    vec4 mv = modelViewMatrix * vec4(p, 1.);
    gl_Position = projectionMatrix * mv;
    vA = .25 + .75*fract(aSeed*13.);
    gl_PointSize = (.06 + aSeed*.09) * uScale / -mv.z;
  }`;
const MOTE_FS = /* glsl */ `
  uniform vec3 uC; varying float vA;
  void main(){ float d = length(gl_PointCoord-.5); float a = smoothstep(.5,0.,d); gl_FragColor = vec4(uC, a*a*vA); }`;

export function createBG(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x040c0a, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 400);
  camera.position.set(0, 3.4, 12);
  const R = rng(1919);
  const blend = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending };

  const C = MOODS[0].map((c) => new THREE.Color(c));
  const cTarget = MOODS[0].map((c) => new THREE.Color(c));

  // ---- terreno ----
  const tU = {
    uTime: { value: 0 }, uScroll: { value: 0 }, uPulse: { value: 0 }, uRad: { value: 0 }, uClick: { value: new THREE.Vector2(0, -20) },
    uC1: { value: C[0] }, uC2: { value: C[1] },
  };
  const tg = new THREE.PlaneGeometry(150, 220, 150, 220);
  tg.rotateX(-Math.PI / 2);
  const terrain = new THREE.Mesh(tg, new THREE.ShaderMaterial({ uniforms: tU, vertexShader: TERRAIN_VS, fragmentShader: TERRAIN_FS, ...blend, side: THREE.DoubleSide }));
  terrain.position.set(0, -1.4, -80);
  terrain.frustumCulled = false;
  scene.add(terrain);

  // ---- sol rayado ----
  const sU = { uA: { value: C[2] }, uB: { value: C[3] }, uTime: { value: 0 } };
  const sun = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShaderMaterial({ uniforms: sU, vertexShader: SUN_VS, fragmentShader: SUN_FS, ...blend }));
  sun.scale.set(70, 70, 1);
  sun.position.set(0, 14, -170);
  scene.add(sun);

  // ---- hojas de documentos flotantes ----
  const ND = 64;
  const dGeo = new THREE.PlaneGeometry(1.5, 2);
  const aSeed = new Float32Array(ND), aIdx = new Float32Array(ND);
  const docs = [];
  for (let i = 0; i < ND; i++) {
    aSeed[i] = R(); aIdx[i] = (R() * 4) | 0;
    docs.push({ x: (R() - 0.5) * 70, y: 1 + R() * 14, z: -R() * 90 + 4, ry: R() * 6.28, sp: 0.2 + R() * 0.6, s: 0.8 + R() * 1.4 });
  }
  dGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1));
  dGeo.setAttribute('aIdx', new THREE.InstancedBufferAttribute(aIdx, 1));
  const dU = { uC: { value: C }, uTime: { value: 0 }, uPulse: { value: 0 } };
  const dm = new THREE.InstancedMesh(dGeo, new THREE.ShaderMaterial({ uniforms: dU, vertexShader: DOC_VS, fragmentShader: DOC_FS, ...blend, side: THREE.DoubleSide }), ND);
  dm.frustumCulled = false;
  scene.add(dm);
  const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), e4 = new THREE.Euler(), v3 = new THREE.Vector3(), s3 = new THREE.Vector3();

  // ---- motas ----
  const NM = 700;
  const mp = new Float32Array(NM * 3), ms = new Float32Array(NM);
  for (let i = 0; i < NM; i++) { mp.set([(R() - 0.5) * 60, R() * 18, -R() * 80 + 6], i * 3); ms[i] = R(); }
  const mg = new THREE.BufferGeometry();
  mg.setAttribute('position', new THREE.BufferAttribute(mp, 3));
  mg.setAttribute('aSeed', new THREE.BufferAttribute(ms, 1));
  const mU = { uTime: { value: 0 }, uScale: { value: 800 }, uC: { value: C[0] } };
  const motes = new THREE.Points(mg, new THREE.ShaderMaterial({ uniforms: mU, vertexShader: MOTE_VS, fragmentShader: MOTE_FS, ...blend }));
  motes.frustumCulled = false;
  scene.add(motes);

  // ---- estado ----
  let time = 0, kick = 0, speed = 3, mx = 0, my = 0, ringT = 99, camY = 3.4, camYT = 3.4, lookY = 1.2;
  const ray = new THREE.Raycaster();

  function resize() {
    const W = innerWidth, H = innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    mU.uScale.value = (H * renderer.getPixelRatio() * 0.5) / Math.tan((camera.fov * Math.PI) / 360);
  }
  resize();
  addEventListener('resize', resize);
  addEventListener('pointermove', (e) => { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; });

  function setMood(i) {
    const m = MOODS[i % MOODS.length];
    m.forEach((c, k) => cTarget[k].set(c));
    camYT = 2.6 + (i % 4) * 0.9;
    kick = 1; speed = 26;
  }
  function pulseAt(cx, cy) {
    ray.setFromCamera(new THREE.Vector2((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1), camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1.4);
    const hit = new THREE.Vector3();
    if (ray.ray.intersectPlane(plane, hit)) tU.uClick.value.set(hit.x - terrain.position.x, hit.z - terrain.position.z);
    else tU.uClick.value.set(0, -30);
    ringT = 0; kick = Math.max(kick, 0.6);
  }

  function update(dt) {
    const slow = motion.reduced ? 0.12 : 1;
    time += dt * slow;
    tU.uTime.value = time; sU.uTime.value = time; dU.uTime.value = time; mU.uTime.value = time;
    kick *= Math.exp(-dt * 2.4);
    speed += (3 - speed) * (1 - Math.exp(-dt * 2.2));
    tU.uScroll.value += dt * speed * slow;
    tU.uPulse.value = kick; dU.uPulse.value = kick;
    ringT += dt;
    tU.uRad.value = ringT < 3.2 ? ringT * 26 : 0;
    // color suave
    for (let k = 0; k < 4; k++) C[k].lerp(cTarget[k], 1 - Math.exp(-dt * 2.4));
    mU.uC.value = C[0];
    // documentos: derivan hacia arriba y rotan
    for (let i = 0; i < ND; i++) {
      const d = docs[i];
      const y = ((d.y + time * d.sp) % 16) + 0.5;
      const z = d.z + ((tU.uScroll.value * 0.4) % 90) - ((d.z + (tU.uScroll.value * 0.4) % 90) > 6 ? 90 : 0);
      e4.set(0, d.ry + time * 0.15 * d.sp, Math.sin(time * 0.4 + i) * 0.1);
      q4.setFromEuler(e4);
      v3.set(d.x, y, z); s3.setScalar(d.s);
      m4.compose(v3, q4, s3);
      dm.setMatrixAt(i, m4);
    }
    dm.instanceMatrix.needsUpdate = true;
    // cámara
    const par = motion.reduced ? 0 : 1;
    camY = lerp(camY, camYT, 1 - Math.exp(-dt * 1.6));
    camera.position.x = lerp(camera.position.x, mx * 2.2 * par, 1 - Math.exp(-dt * 2));
    camera.position.y = lerp(camera.position.y, camY - my * 0.8 * par, 1 - Math.exp(-dt * 2));
    camera.position.z = lerp(camera.position.z, 12 - kick * 3.5, 1 - Math.exp(-dt * 3));
    camera.lookAt(mx * 1.2 * par, lookY + 1.6, -40);
    renderer.render(scene, camera);
  }

  return { update, setMood, pulseAt };
}
