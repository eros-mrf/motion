// Fondo: plano azul cobalto con cuadrícula técnica (shader), círculos de compás que giran lento y ondas al hacer clic.
import * as THREE from 'three';
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';

const VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }';
const FS = /* glsl */ `
  precision highp float;
  uniform float uTime, uDpr; uniform vec2 uRes, uMouse; uniform vec3 uTint, uPulse; varying vec2 vUv;
  float grid(vec2 p, float s, float w){ vec2 g = abs(fract(p/s - .5) - .5)*s; float d = min(g.x, g.y); return 1. - smoothstep(w - .6, w + .6, d); }
  void main(){
    vec2 px = vUv*uRes; vec2 off = uMouse*14.*uDpr + vec2(uTime*2., uTime*1.2)*uDpr;
    vec2 p = px + off;
    float minor = grid(p, 28.*uDpr, .8*uDpr), major = grid(p, 140.*uDpr, 1.3*uDpr);
    vec2 c = (vUv - vec2(.82, .46)) * vec2(uRes.x/uRes.y, 1.);
    float r = length(c), a = atan(c.y, c.x);
    float rings = 0.;
    for(int i = 0; i < 3; i++){ float rad = .2 + float(i)*.13; float ln = 1. - smoothstep(.0015, .004, abs(r - rad)); float dash = step(.55, fract(a*(3.+float(i)*2.)/6.2832 + uTime*(.02 + float(i)*.01)*(mod(float(i),2.)*2.-1.))); rings += ln*dash; }
    vec2 pu = (vUv - uPulse.xy) * vec2(uRes.x/uRes.y, 1.); float d = length(pu);
    float ring = exp(-pow((d - uPulse.z*1.2)*8., 2.)) * (1. - uPulse.z);
    vec3 base = mix(vec3(.12, .30, .90), vec3(.075, .21, .70), vUv.y*.9 + .1);
    base *= .86 + .22*smoothstep(1.05, .15, length(vUv - .5));
    vec3 lineCol = mix(vec3(1.), uTint, .28);
    float amt = minor*.085 + major*.16 + rings*.2 + ring*(minor + major)*.7 + ring*.06;
    gl_FragColor = vec4(base + lineCol*amt, 1.);
  }`;

export function createBG(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(dpr);
  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const u = { uTime: { value: 0 }, uDpr: { value: dpr }, uRes: { value: new THREE.Vector2(1920, 1080) }, uMouse: { value: new THREE.Vector2() }, uTint: { value: new THREE.Color(0xffe14d) }, uPulse: { value: new THREE.Vector3(0.5, 0.5, 1) } };
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
    update(dt) { t += dt * (motion.reduced ? 0.12 : 1); u.uTime.value = t; renderer.render(scene, cam); },
    setMood(hex) { const c = new THREE.Color(hex); gsap.to(u.uTint.value, { r: c.r, g: c.g, b: c.b, duration: motion.reduced ? 0.01 : 1.2 }); },
    pulseAt(x, y) { u.uPulse.value.set(x / innerWidth, 1 - y / innerHeight, 0); if (motion.reduced) { u.uPulse.value.z = 1; return; } gsap.fromTo(u.uPulse.value, { z: 0 }, { z: 1, duration: 2.0, ease: 'power2.out' }); },
  };
}
