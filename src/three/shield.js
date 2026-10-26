// Escudo 3D del protocolo de aula: núcleo de "información verificada" (shader fresnel + ruido),
// tres anillos (Verificar · Contextualizar · Cuidar el lenguaje) y chispas orbitando.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { gsap } from 'gsap';
import { rng, motion } from '../util.js';

const CORE_VS = /* glsl */ `
  uniform float uTime; varying vec3 vN; varying vec3 vV; varying float vH;
  void main(){
    float n = sin(position.x*3.+uTime)*sin(position.y*3.+uTime*1.3)*sin(position.z*3.-uTime*.8);
    vec3 p = position + normal*n*.09; vH = n;
    vec4 mv = modelViewMatrix*vec4(p,1.);
    vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix*mv;
  }`;
const CORE_FS = /* glsl */ `
  uniform vec3 uA; uniform vec3 uB; uniform vec3 uTint; uniform float uGlow;
  varying vec3 vN; varying vec3 vV; varying float vH;
  void main(){
    float f = pow(1.-max(dot(vN,vV),0.), 2.2);
    vec3 c = mix(uA, uB, f*.9+vH*.3) + uTint*f*.9;
    gl_FragColor = vec4(c*(1.+uGlow), .5 + f*.5);
  }`;

const SPARK_VS = /* glsl */ `
  uniform float uScale, uTime; attribute float aSeed, aR; attribute vec3 aAx; varying float vA;
  void main(){
    float a = uTime*(.25+aSeed*.5) + aSeed*40.;
    vec3 p = vec3(cos(a), 0., sin(a))*aR;
    float c = cos(aAx.x*6.28), s = sin(aAx.x*6.28);
    p = vec3(p.x, p.y*c - p.z*s, p.y*s + p.z*c);
    c = cos(aAx.y*6.28); s = sin(aAx.y*6.28);
    p = vec3(p.x*c - p.y*s, p.x*s + p.y*c, p.z);
    vec4 mv = modelViewMatrix*vec4(p,1.); gl_Position = projectionMatrix*mv;
    vA = .3 + .7*(.5+.5*sin(uTime*2.+aSeed*30.));
    gl_PointSize = (.05+aSeed*.06)*uScale/-mv.z;
  }`;
const SPARK_FS = /* glsl */ `
  varying float vA; void main(){ float d=length(gl_PointCoord-.5); float a=smoothstep(.5,0.,d); gl_FragColor=vec4(.75,.95,1.,a*a*vA); }`;

const RING_COLORS = ['#ffc247', '#2ee6c5', '#a07bff'];

export function createShield(canvas, onPick) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
  camera.position.set(0, 1.0, 8.3);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.enablePan = false; controls.enableZoom = false;
  controls.autoRotate = true; controls.autoRotateSpeed = 0.9;

  const rig = new THREE.Group();
  scene.add(rig);

  // núcleo
  const coreU = { uTime: { value: 0 }, uA: { value: new THREE.Color('#0e7f8c') }, uB: { value: new THREE.Color('#aaffee') }, uTint: { value: new THREE.Color('#2ee6c5').multiplyScalar(0.4) }, uGlow: { value: 0.1 } };
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 5), new THREE.ShaderMaterial({ uniforms: coreU, vertexShader: CORE_VS, fragmentShader: CORE_FS, transparent: true }));
  rig.add(core);
  const cage = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.32, 1)), new THREE.LineBasicMaterial({ color: 0x9cfff0, transparent: true, opacity: 0.35 }));
  rig.add(cage);
  const shell = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(3.35, 2)), new THREE.LineBasicMaterial({ color: 0x7e8dff, transparent: true, opacity: 0.1 }));
  rig.add(shell);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const pl = new THREE.PointLight(0x2ee6c5, 40, 12);
  rig.add(pl);

  // anillos
  const defs = [
    { r: 1.95, rot: [1.0, 0.25, 0.1], sp: 0.5 },
    { r: 2.4, rot: [0.35, 0.95, 0.3], sp: -0.38 },
    { r: 2.85, rot: [-0.95, -0.35, 0.7], sp: 0.3 },
  ];
  const rings = defs.map((d, i) => {
    const g = new THREE.Group();
    g.rotation.set(...d.rot);
    const color = new THREE.Color(RING_COLORS[i]);
    const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, metalness: 0.75, roughness: 0.22, transparent: true });
    const torus = new THREE.Mesh(new THREE.TorusGeometry(d.r, 0.075, 24, 180), mat);
    const pick = new THREE.Mesh(new THREE.TorusGeometry(d.r, 0.3, 8, 80), new THREE.MeshBasicMaterial({ visible: false }));
    pick.userData.ring = i;
    const gemMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: color, emissiveIntensity: 1.6, metalness: 0.4, roughness: 0.15, transparent: true });
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.2), gemMat);
    const gem2 = gem.clone();
    g.add(torus, pick, gem, gem2);
    const outer = new THREE.Group(); // permite animar escala/rotación sin tocar la inclinación
    outer.add(g);
    rig.add(outer);
    return { outer, g, torus, pick, gem, gem2, mat, gemMat, d, color, a: i * 2.1, k: 1, target: 1 };
  });

  // chispas
  const SN = 420, R = rng(77);
  const sp = { seed: new Float32Array(SN), r: new Float32Array(SN), ax: new Float32Array(SN * 3) };
  for (let i = 0; i < SN; i++) { sp.seed[i] = R(); sp.r[i] = 1.6 + R() * 2; sp.ax.set([R(), R(), R()], i * 3); }
  const spg = new THREE.BufferGeometry();
  spg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SN * 3), 3));
  spg.setAttribute('aSeed', new THREE.BufferAttribute(sp.seed, 1));
  spg.setAttribute('aR', new THREE.BufferAttribute(sp.r, 1));
  spg.setAttribute('aAx', new THREE.BufferAttribute(sp.ax, 3));
  const sparkU = { uScale: { value: 600 }, uTime: { value: 0 } };
  const sparks = new THREE.Points(spg, new THREE.ShaderMaterial({ uniforms: sparkU, vertexShader: SPARK_VS, fragmentShader: SPARK_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  sparks.frustumCulled = false;
  rig.add(sparks);

  let sel = -1, time = 0, hover = -1;
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const picks = rings.map((r) => r.pick);
  function hit(e) {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const h = ray.intersectObjects(picks, false)[0];
    return h ? h.object.userData.ring : -1;
  }
  let down = null;
  canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return;
    const i = hit(e);
    if (i >= 0) { select(i); onPick?.(i, true); }
  });
  canvas.addEventListener('pointermove', (e) => { hover = hit(e); canvas.style.cursor = hover >= 0 ? 'pointer' : 'grab'; });

  function select(i) {
    sel = i;
    rings.forEach((r, k) => { r.target = i < 0 ? 1 : k === i ? 1.7 : 0.12; });
    if (i >= 0) {
      const c = rings[i].color;
      gsap.to(coreU.uTint.value, { r: c.r * 0.7, g: c.g * 0.7, b: c.b * 0.7, duration: 0.6 });
      gsap.fromTo(coreU.uGlow, { value: 0.8 }, { value: 0.1, duration: 1.1, ease: 'power2.out' });
      gsap.fromTo(rings[i].outer.scale, { x: 1.14, y: 1.14, z: 1.14 }, { x: 1, y: 1, z: 1, duration: 0.9, ease: 'elastic.out(1,.45)' });
    }
  }

  // entrada cinematográfica: los anillos llegan girando y se "ensamblan"
  function assemble() {
    const rd = motion.reduced ? 0.01 : 1;
    rings.forEach((r, i) => {
      gsap.killTweensOf([r.outer.scale, r.outer.rotation, r.mat, r.gemMat]);
      gsap.fromTo(r.outer.scale, { x: 3.2, y: 3.2, z: 3.2 }, { x: 1, y: 1, z: 1, duration: 1.7 * rd, delay: 0.15 * i * rd, ease: 'expo.out' });
      gsap.fromTo(r.outer.rotation, { y: Math.PI * (2 + i), x: Math.PI * 0.6 }, { y: 0, x: 0, duration: 2.1 * rd, delay: 0.15 * i * rd, ease: 'expo.out' });
      gsap.fromTo(r.mat, { opacity: 0 }, { opacity: 1, duration: 0.9 * rd, delay: 0.15 * i * rd });
      gsap.fromTo(r.gemMat, { opacity: 0 }, { opacity: 1, duration: 0.9 * rd, delay: 0.15 * i * rd });
    });
    gsap.fromTo(core.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: 1, y: 1, z: 1, duration: 1.4 * rd, ease: 'elastic.out(1,.55)' });
    gsap.fromTo(coreU.uGlow, { value: 1.4 }, { value: 0.1, duration: 1.8 * rd, ease: 'power2.out' });
    select(-1);
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    sparkU.uScale.value = (h * renderer.getPixelRatio() * 0.5) / Math.tan((camera.fov * Math.PI) / 360);
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  function frame(dt) {
    const slow = motion.reduced ? 0.15 : 1;
    time += dt * slow;
    coreU.uTime.value = time; sparkU.uTime.value = time;
    controls.autoRotate = !motion.reduced;
    controls.update();
    core.rotation.y += dt * 0.25 * slow;
    cage.rotation.y -= dt * 0.18 * slow; cage.rotation.x += dt * 0.07 * slow;
    shell.rotation.y += dt * 0.05 * slow;
    rings.forEach((r, i) => {
      r.a += dt * r.d.sp * 1.4 * slow;
      const th = r.a;
      r.gem.position.set(Math.cos(th) * r.d.r, Math.sin(th) * r.d.r, 0);
      r.gem2.position.set(-Math.cos(th) * r.d.r, -Math.sin(th) * r.d.r, 0);
      r.gem.rotation.y += dt * 2; r.gem2.rotation.x += dt * 2;
      r.k += (r.target - r.k) * (1 - Math.exp(-dt * 5));
      const h = hover === i ? 0.5 : 0;
      r.mat.emissiveIntensity = 0.25 + r.k * 0.9 + h;
      r.gemMat.emissiveIntensity = 0.5 + r.k * 1.3;
      r.torus.scale.setScalar(1);
      r.g.rotation.z += dt * 0.12 * r.d.sp * slow;
    });
    pl.intensity = 30 + Math.sin(time * 2) * 8;
    renderer.render(scene, camera);
  }

  return { frame, resize, select, assemble, get selected() { return sel; } };
}
