// Fondo 3D · Clase 21: "aurora y cristal".
// Un shader de aurora (ruido con deformación de dominio, colores pastel) + esferas de vidrio flotantes.
// Cada diapositiva cambia la paleta; cada transición acelera el flujo; el clic lanza una onda de luz.
import * as THREE from 'three';
import { rng, motion } from '../../../src/util.js';

const PALS = {
  sun:    ['#fff1e2', '#ffd3c4', '#ffc4de', '#e7d6ff'],
  violet: ['#f2ecff', '#dbd0ff', '#ffdaee', '#cfe9ff'],
  mint:   ['#eafff9', '#c9f6ec', '#d6e6ff', '#f6e3ff'],
  coral:  ['#fff1ee', '#ffd2d6', '#ffcae2', '#ffe3bb'],
};
const MOODS = ['sun', 'sun', 'sun', 'violet', 'violet', 'mint', 'mint', 'mint', 'mint', 'coral', 'coral', 'coral', 'violet', 'sun'];

const AURORA_FS = /* glsl */ `
  precision highp float;
  uniform float uTime; uniform vec2 uRes; uniform vec3 uC0, uC1, uC2, uC3; uniform vec3 uRip;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
  float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.02+vec2(3.1,1.7); a*=.5; } return v; }
  void main(){
    vec2 uv = gl_FragCoord.xy / uRes;
    float asp = uRes.x / uRes.y;
    vec2 p = vec2(uv.x*asp, uv.y) * 1.5;
    float t = uTime * .045;
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2,1.3) - t));
    vec2 r = vec2(fbm(p + 3.*q + vec2(1.7,9.2) + t*1.6), fbm(p + 3.*q + vec2(8.3,2.8) - t));
    float f = fbm(p + 3.*r);
    vec3 col = mix(uC0, uC1, clamp(f*1.7, 0., 1.));
    col = mix(col, uC2, clamp(length(q)*.95, 0., 1.));
    col = mix(col, uC3, clamp(r.x*.9, 0., 1.) * .7);
    float d = distance(uv*vec2(asp,1.), uRip.xy*vec2(asp,1.));
    float w = exp(-pow((d - uRip.z*.75)*7., 2.)) * exp(-uRip.z*1.3);
    col += w * vec3(.18,.12,.2);
    col += .06 * smoothstep(.9, .0, distance(uv, vec2(.5,.45)));   // luz suave al centro
    gl_FragColor = vec4(col, 1.);
  }`;

const ORB_VS = /* glsl */ `
  attribute vec3 aTint; attribute float aSeed;
  varying vec3 vN; varying vec3 vV; varying vec3 vT; varying float vS;
  void main(){
    vec4 p = vec4(position, 1.); vec3 n = normal;
    #ifdef USE_INSTANCING
      p = instanceMatrix * p; n = mat3(instanceMatrix) * n;
    #endif
    vec4 mv = modelViewMatrix * p;
    vN = normalize(normalMatrix * n); vV = normalize(-mv.xyz); vT = aTint; vS = aSeed;
    gl_Position = projectionMatrix * mv;
  }`;
const ORB_FS = /* glsl */ `
  uniform float uTime; varying vec3 vN; varying vec3 vV; varying vec3 vT; varying float vS;
  void main(){
    float f = pow(1. - max(dot(vN, vV), 0.), 2.4);
    vec3 irid = .5 + .5*cos(6.2831*(f*.8 + vS + vec3(0., .33, .67)) + uTime*.3);
    vec3 col = mix(vT, irid, .45) + f*.35;
    float a = .10 + f*.55;
    gl_FragColor = vec4(col, a);
  }`;

export function createBG(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.25));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 80);
  camera.position.set(0, 0, 14);

  const cur = PALS.sun.map((c) => new THREE.Color(c)), tar = PALS.sun.map((c) => new THREE.Color(c));
  const U = { uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uC0: { value: cur[0] }, uC1: { value: cur[1] }, uC2: { value: cur[2] }, uC3: { value: cur[3] }, uRip: { value: new THREE.Vector3(0.5, 0.5, 9) } };
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms: U, vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.9999, 1.); }', fragmentShader: AURORA_FS, depthTest: false, depthWrite: false,
  }));
  quad.frustumCulled = false; quad.renderOrder = -10;
  scene.add(quad);

  // esferas de vidrio
  const N = 18, R = rng(2121);
  const ou = { uTime: U.uTime };
  const geo = new THREE.SphereGeometry(1, 40, 28);
  const tint = new Float32Array(N * 3), seed = new Float32Array(N);
  const TINTS = [new THREE.Color('#9d85ff'), new THREE.Color('#ff8da0'), new THREE.Color('#5fd9c9'), new THREE.Color('#ffc27a')];
  const orbs = [];
  for (let i = 0; i < N; i++) {
    const c = TINTS[i % 4]; tint.set([c.r, c.g, c.b], i * 3); seed[i] = R();
    orbs.push({ x: (R() - 0.5) * 34, y: (R() - 0.5) * 18, z: -8 + R() * 11, s: 0.5 + R() * R() * 2.6, sp: 0.15 + R() * 0.3, ph: R() * 6.28 });
  }
  geo.setAttribute('aTint', new THREE.InstancedBufferAttribute(tint, 3));
  geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 1));
  const mesh = new THREE.InstancedMesh(geo, new THREE.ShaderMaterial({ uniforms: ou, vertexShader: ORB_VS, fragmentShader: ORB_FS, transparent: true, depthWrite: false }), N);
  mesh.frustumCulled = false; mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(mesh);
  const m4 = new THREE.Matrix4(), q0 = new THREE.Quaternion(), p3 = new THREE.Vector3(), s3 = new THREE.Vector3();

  let time = 0, flow = 1, mx = 0, my = 0, rip = 9;
  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    U.uRes.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
  }
  resize(); addEventListener('resize', resize);
  addEventListener('pointermove', (e) => { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; });

  function setMood(i) {
    const pal = PALS[MOODS[i % MOODS.length]];
    pal.forEach((c, k) => tar[k].set(c));
    flow = 7; rip = 0; U.uRip.value.set(0.5, 0.5, 0);
  }
  function pulseAt(cx, cy) { U.uRip.value.set(cx / innerWidth, 1 - cy / innerHeight, 0); rip = 0; }

  function update(dt) {
    const slow = motion.reduced ? 0.12 : 1;
    flow += (1 - flow) * (1 - Math.exp(-dt * 1.6));
    time += dt * slow * flow;
    U.uTime.value = time;
    rip += dt; U.uRip.value.z = Math.min(rip, 9);
    for (let k = 0; k < 4; k++) cur[k].lerp(tar[k], 1 - Math.exp(-dt * 2.2));
    const par = motion.reduced ? 0 : 1;
    camera.position.x += (mx * 1.4 * par - camera.position.x) * (1 - Math.exp(-dt * 2));
    camera.position.y += (-my * 0.9 * par - camera.position.y) * (1 - Math.exp(-dt * 2));
    camera.lookAt(0, 0, 0);
    const pulse = Math.exp(-rip * 1.6);
    orbs.forEach((o, i) => {
      p3.set(o.x + Math.sin(time * o.sp + o.ph) * 1.3, o.y + Math.cos(time * o.sp * 0.8 + o.ph) * 1.1, o.z + Math.sin(time * 0.4 + o.ph) * 0.6);
      s3.setScalar(o.s * (1 + pulse * 0.18 * Math.sin(rip * 9 + i)));
      m4.compose(p3, q0, s3); mesh.setMatrixAt(i, m4);
    });
    mesh.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
  }
  return { update, setMood, pulseAt };
}
