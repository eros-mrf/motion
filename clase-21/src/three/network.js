// Red de evidencia: un núcleo (el mensaje) y 8 esferas de información alrededor.
// Al tocar una esfera se acopla: si es evidencia pertinente, un haz estable la une al núcleo y este se vuelve
// más sólido; si es ruido (rumor, anécdota), el haz tiembla, aparecen grietas y sube el ruido.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { motion } from '../../../src/util.js';

const GLASS_VS = /* glsl */ `varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vP = position; vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`;
const ORB_FS = /* glsl */ `
  uniform vec3 uTint; uniform float uHot; varying vec3 vN; varying vec3 vV; varying vec3 vP;
  void main(){ float f = pow(1. - abs(dot(vN, vV)), 1.8); vec3 col = mix(uTint, vec3(1.), .22) + f*uTint*.45 + uHot*uTint*.5; gl_FragColor = vec4(col, .78 + f*.2); }`;
const CORE_FS = /* glsl */ `
  uniform float uTime, uSolid, uNoise; varying vec3 vN; varying vec3 vV; varying vec3 vP;
  float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }
  void main(){
    float f = pow(1. - abs(dot(vN, vV)), 1.6);
    vec3 weak = vec3(.66,.60,.93), strong = mix(vec3(.45,.36,1.), vec3(.09,.71,.64), uSolid);
    vec3 col = mix(weak, strong, uSolid) + f*.35;
    // grietas: líneas finas donde un campo de ondas se acerca a cero
    float w = sin(vP.x*9. + sin(vP.y*7. + uTime)) * sin(vP.y*8. + sin(vP.z*6.)) ;
    float crack = smoothstep(.06, .0, abs(w)) * uNoise;
    col = mix(col, vec3(1.,.36,.45), crack*.9);
    gl_FragColor = vec4(col, .78 + f*.2);
  }`;

export function createNetwork(canvas, labelsEl, items, onPick) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
  camera.position.set(0, 3.0, 8.6);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.enablePan = false; controls.enableZoom = false; controls.autoRotate = true; controls.autoRotateSpeed = 0.6;
  controls.minPolarAngle = 0.9; controls.maxPolarAngle = 1.7; controls.target.set(0, 0, 0);

  const cu = { uTime: { value: 0 }, uSolid: { value: 0 }, uNoise: { value: 0 } };
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 5), new THREE.ShaderMaterial({ uniforms: cu, vertexShader: GLASS_VS, fragmentShader: CORE_FS, transparent: true }));
  scene.add(core);
  const halo = new THREE.Mesh(new THREE.RingGeometry(3.2, 3.24, 120), new THREE.MeshBasicMaterial({ color: 0x7a5cff, transparent: true, opacity: 0.25, side: THREE.DoubleSide }));
  halo.rotation.x = -Math.PI / 2; scene.add(halo);

  const N = items.length;
  const orbs = items.map((it, i) => {
    const a = (i / N) * Math.PI * 2 + 0.3;
    const home = new THREE.Vector3(Math.cos(a) * 3.3, Math.sin(i * 2.1) * 1.1, Math.sin(a) * 3.3);
    const u = { uTint: { value: new THREE.Color(0x8f7bff) }, uHot: { value: 0 } };
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 24), new THREE.ShaderMaterial({ uniforms: u, vertexShader: GLASS_VS, fragmentShader: ORB_FS, transparent: true }));
    mesh.userData.i = i; scene.add(mesh);
    const pts = new Float32Array(18 * 3);
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: it.rel ? 0x16b5a4 : 0xff5d73, transparent: true, opacity: 0.95 }));
    line.visible = false; line.frustumCulled = false; scene.add(line);
    const el = document.createElement('div'); el.className = 'lb net' + (it.rel ? '' : ' irr'); el.innerHTML = `<b>${it.id}</b>${it.short}`; labelsEl.appendChild(el);
    return { it, a, home, pos: home.clone(), k: 0, u, mesh, line, pts, el, hover: 0, on: false, ph: Math.random() * 6 };
  });

  // chispas
  const NP = 100, pp = new Float32Array(NP * 3);
  for (let i = 0; i < NP; i++) pp.set([(Math.random() - 0.5) * 9, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 9], i * 3);
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  scene.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.8, depthWrite: false })));

  const stats = { solid: 0, noise: 0 };
  function setAttached(i, on) {
    const o = orbs[i]; o.on = on;
    gsap.to(o, { k: on ? 1 : 0, duration: motion.reduced ? 0.01 : 1.0, ease: on ? 'back.out(1.6)' : 'power2.inOut' });
    gsap.to(o.u.uTint.value, { r: on ? (o.it.rel ? 0.09 : 1) : 0.56, g: on ? (o.it.rel ? 0.71 : 0.36) : 0.48, b: on ? (o.it.rel ? 0.64 : 0.45) : 1, duration: 0.5 });
    o.line.visible = on;
  }
  function setStats(solid, noise) {
    gsap.to(stats, { solid, noise, duration: motion.reduced ? 0.01 : 0.9, ease: 'power2.out' });
  }

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const meshes = orbs.map((o) => o.mesh);
  let down = null;
  const pick = (e) => { const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); const h = ray.intersectObjects(meshes, false)[0]; return h ? h.object.userData.i : -1; };
  canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => { if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return; const i = pick(e); if (i >= 0) onPick?.(i); });
  let hov = -1;
  canvas.addEventListener('pointermove', (e) => { hov = pick(e); canvas.style.cursor = hov >= 0 ? 'pointer' : 'grab'; });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  const v3 = new THREE.Vector3();
  let t = 0;
  function frame(dt) {
    t += dt * (motion.reduced ? 0.2 : 1);
    controls.autoRotate = !motion.reduced; controls.update();
    cu.uTime.value = t; cu.uSolid.value = stats.solid; cu.uNoise.value = stats.noise;
    core.scale.setScalar(0.85 + stats.solid * 0.55 + Math.sin(t * 2) * 0.02);
    core.rotation.y += dt * 0.2;
    halo.rotation.z += dt * 0.05;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    orbs.forEach((o, i) => {
      const a = o.a + t * 0.12;
      const home = new THREE.Vector3(Math.cos(a) * 3.3, Math.sin(i * 2.1 + t * 0.5) * 1.1, Math.sin(a) * 3.3);
      const near = new THREE.Vector3(Math.cos(a) * 1.9, Math.sin(i * 2.1) * 0.4, Math.sin(a) * 1.9);
      o.pos.lerpVectors(home, near, o.k);
      o.mesh.position.copy(o.pos);
      o.hover += ((hov === i ? 1 : 0) - o.hover) * 0.2;
      o.mesh.scale.setScalar(1 + o.hover * 0.22 + (o.on ? 0.1 : 0));
      o.u.uHot.value = o.hover * 0.6 + (o.on ? 0.3 : 0);
      if (o.on) {
        const from = o.pos, to = core.position, p = o.pts;
        for (let s = 0; s < 18; s++) {
          const k = s / 17; const j = o.it.rel ? 0.02 : 0.16;
          p[s * 3] = from.x * (1 - k) + to.x * k + (Math.random() - 0.5) * j * Math.sin(k * 3.14) * 3;
          p[s * 3 + 1] = from.y * (1 - k) + to.y * k + (Math.random() - 0.5) * j * Math.sin(k * 3.14) * 3;
          p[s * 3 + 2] = from.z * (1 - k) + to.z * k + (Math.random() - 0.5) * j * Math.sin(k * 3.14) * 3;
        }
        o.line.geometry.attributes.position.needsUpdate = true;
      }
      v3.copy(o.pos); v3.y += 0.85; v3.project(camera);
      o.el.style.left = ((v3.x + 1) / 2) * w + 'px'; o.el.style.top = ((1 - v3.y) / 2) * h + 'px';
      o.el.style.opacity = '1';
    });
    renderer.render(scene, camera);
  }
  return { frame, resize, setAttached, setStats };
}
