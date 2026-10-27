// Fondo: mapa de curvas de nivel (shader) que respira lento + brasas ámbar. Un clic lanza una onda por el mapa.
import * as THREE from 'three';
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';

const VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }';
const FS = /* glsl */ `
  precision highp float;
  uniform float uTime, uAsp; uniform vec3 uTint; uniform vec3 uPulse; uniform vec2 uMouse; varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), f.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y); }
  float fbm(vec2 p){ float a = .5, s = 0.; for(int i = 0; i < 5; i++){ s += a*vnoise(p); p = p*2.03 + vec2(7.3, 1.9); a *= .5; } return s; }
  void main(){
    vec2 uv = vUv; vec2 p = (uv - .5) * vec2(uAsp, 1.);
    vec2 q = p*1.9 + uMouse*.07 + vec2(uTime*.012, -uTime*.008);
    float h = fbm(q + fbm(q*.8 + uTime*.015)*.6);
    // pulso: una onda que ensancha las curvas
    float d = length(uv - uPulse.xy); float ring = exp(-pow((d - uPulse.z*1.1)*7., 2.)) * (1. - uPulse.z);
    h += ring*.08;
    float v = h*15.;
    float fw = fwidth(v) + .0001;
    float dl = abs(fract(v - .5) - .5)/fw;
    float line = 1. - smoothstep(.0, 1.4, dl);
    float major = 1. - smoothstep(.0, 1.8, abs(fract(v/5. - .5) - .5)*5./fw);
    float edge = smoothstep(.12, .85, length(uv - vec2(.5, .5))*1.15);
    float inten = (.075 + .13*edge)*line + (.06 + .12*edge)*major + ring*.5*line;
    vec3 base = mix(vec3(.075, .04, .085), vec3(.115, .065, .13), uv.y);
    vec3 col = base + uTint*inten + uTint*ring*.12;
    col *= .78 + .3*smoothstep(1.1, .2, length(uv - .5));
    gl_FragColor = vec4(col, 1.);
  }`;

export function createBG(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const u = { uTime: { value: 0 }, uAsp: { value: 1.78 }, uTint: { value: new THREE.Color(0xffc233) }, uPulse: { value: new THREE.Vector3(0.5, 0.5, 1) }, uMouse: { value: new THREE.Vector2() } };
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: u, vertexShader: VS, fragmentShader: FS, depthTest: false })));

  // brasas
  const NP = 70, pos = new Float32Array(NP * 3), vel = new Float32Array(NP);
  for (let i = 0; i < NP; i++) { pos.set([(Math.random() * 2 - 1) * 1.8, (Math.random() * 2 - 1), 0], i * 3); vel[i] = 0.01 + Math.random() * 0.03; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pm = new THREE.PointsMaterial({ color: 0xffc233, size: 3, sizeAttenuation: false, transparent: true, opacity: 0.55, depthTest: false, blending: THREE.AdditiveBlending });
  scene.add(new THREE.Points(pg, pm));

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    u.uAsp.value = w / h;
  }
  addEventListener('resize', resize); resize();
  addEventListener('pointermove', (e) => { u.uMouse.value.set(e.clientX / innerWidth - 0.5, 0.5 - e.clientY / innerHeight); });

  let t = 0;
  function update(dt) {
    t += dt * (motion.reduced ? 0.15 : 1);
    u.uTime.value = t;
    const p = pg.attributes.position.array;
    for (let i = 0; i < NP; i++) {
      p[i * 3 + 1] += vel[i] * dt * (motion.reduced ? 0.2 : 1);
      if (p[i * 3 + 1] > 1.05) { p[i * 3 + 1] = -1.05; p[i * 3] = (Math.random() * 2 - 1) * 1.8; }
    }
    pg.attributes.position.needsUpdate = true;
    renderer.render(scene, cam);
  }
  return {
    update,
    setMood(hex) { const c = new THREE.Color(hex); gsap.to(u.uTint.value, { r: c.r, g: c.g, b: c.b, duration: motion.reduced ? 0.01 : 1.4 }); gsap.to(pm.color, { r: c.r, g: c.g, b: c.b, duration: 1.4 }); },
    pulseAt(x, y) { u.uPulse.value.set(x / innerWidth, 1 - y / innerHeight, 0); if (motion.reduced) { u.uPulse.value.z = 1; return; } gsap.fromTo(u.uPulse.value, { z: 0 }, { z: 1, duration: 2.2, ease: 'power2.out' }); },
  };
}
