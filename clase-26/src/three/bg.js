// Fondo: pantalla de puntos (trama de semitono) verde petróleo con ventanas fantasma que flotan, brillo que sigue al cursor y ondas al hacer clic.
import * as THREE from 'three';
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';

const VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }';
const FS = /* glsl */ `
  precision highp float;
  uniform float uTime, uDpr; uniform vec2 uRes, uMouse; uniform vec3 uTint, uPulse; varying vec2 vUv;
  float box(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.)) + min(max(d.x, d.y), 0.); }
  void main(){
    vec2 px = vUv * uRes; float cell = 34. * uDpr;
    vec2 g = px / cell; vec2 id = floor(g); vec2 f = fract(g) - .5;
    vec2 c = (id + .5) * cell / uRes;                       // centro del punto en uv
    float asp = uRes.x / uRes.y;
    float wave = sin(c.x * 6.5 + uTime * .5) * .5 + sin(c.y * 8. - uTime * .38 + c.x * 3.) * .5;
    float r = .17 + .09 * wave + .1 * smoothstep(.0, 1., c.y);   // más grandes hacia arriba
    float dm = length((c - (uMouse + .5)) * vec2(asp, 1.));
    r += .26 * exp(-dm * dm * 26.);                          // el cursor «enciende» puntos
    float dp = length((c - uPulse.xy) * vec2(asp, 1.));
    r += .34 * exp(-pow((dp - uPulse.z * 1.3) * 9., 2.)) * (1. - uPulse.z);
    // ventanas fantasma (contornos) a la deriva
    float win = 0.;
    for(int i = 0; i < 4; i++){
      float fi = float(i);
      vec2 ctr = vec2(.24 + fi * .22 + sin(uTime * .09 + fi * 2.1) * .05, .3 + mod(fi * .37, .5) + cos(uTime * .08 + fi) * .04);
      vec2 sz = vec2(.1 + .02 * fi, .07 + .012 * mod(fi, 2.));
      float d = box((vUv - ctr) * vec2(asp, 1.), sz * vec2(asp * .7, 1.));
      win += (1. - smoothstep(.0015, .0045, abs(d))) * .5;
    }
    float dotv = 1. - smoothstep(r - .06, r + .03, length(f));
    vec3 base = mix(vec3(.047, .184, .165), vec3(.027, .125, .114), vUv.y * .8 + .1);
    base *= .88 + .2 * smoothstep(1.1, .1, length(vUv - vec2(.55, .5)));
    vec3 dotCol = mix(vec3(.5, .78, .7), uTint, .5);
    float amt = dotv * (.1 + .22 * smoothstep(.1, .5, r));
    gl_FragColor = vec4(base + dotCol * amt + vec3(.5, .8, .72) * win * .22, 1.);
  }`;

export function createBG(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(dpr);
  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const u = { uTime: { value: 0 }, uDpr: { value: dpr }, uRes: { value: new THREE.Vector2(1920, 1080) }, uMouse: { value: new THREE.Vector2(0.2, 0.2) }, uTint: { value: new THREE.Color(0xff7059) }, uPulse: { value: new THREE.Vector3(0.5, 0.5, 1) } };
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: u, vertexShader: VS, fragmentShader: FS, depthTest: false })));
  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    u.uRes.value.set(w * dpr, h * dpr);
  }
  addEventListener('resize', resize); resize();
  addEventListener('pointermove', (e) => { u.uMouse.value.set(e.clientX / innerWidth - 0.5, 0.5 - e.clientY / innerHeight); });
  let t = 0;
  return {
    update(dt) { t += dt * (motion.reduced ? 0.1 : 1); u.uTime.value = t; renderer.render(scene, cam); },
    setMood(hex) { const c = new THREE.Color(hex); gsap.to(u.uTint.value, { r: c.r, g: c.g, b: c.b, duration: motion.reduced ? 0.01 : 1.2 }); },
    pulseAt(x, y) { u.uPulse.value.set(x / innerWidth, 1 - y / innerHeight, 0); if (motion.reduced) { u.uPulse.value.z = 1; return; } gsap.fromTo(u.uPulse.value, { z: 0 }, { z: 1, duration: 2.0, ease: 'power2.out' }); },
  };
}
