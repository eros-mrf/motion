// Utilidades comunes para escenas Three.js: escenario con cámara/luces/OrbitControls, selección con el puntero,
// etiquetas DOM proyectadas desde 3D y creación tolerante a fallos (sin WebGL la clase sigue funcionando).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// opts: { fov, pos:[x,y,z], target:[x,y,z], orbit:{…propiedades de OrbitControls}|null, ambient, sun:[intensidad,[x,y,z]], pr }
export function makeStage(canvas, { fov = 36, pos = [0, 0, 10], target = [0, 0, 0], orbit = null, ambient = 1, sun = null, pr = 1.75 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, pr));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 60);
  camera.position.set(...pos);
  let controls = null;
  if (orbit) {
    controls = new OrbitControls(camera, canvas);
    Object.assign(controls, { enableDamping: true, enablePan: false, enableZoom: false }, orbit);
    controls.target.set(...target);
  } else camera.lookAt(...target);
  if (ambient) scene.add(new THREE.AmbientLight(0xffffff, ambient));
  if (sun) { const l = new THREE.DirectionalLight(0xffffff, sun[0]); l.position.set(...sun[1]); scene.add(l); }
  const st = { renderer, scene, camera, controls, onResize: null };
  st.resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    st.onResize?.(w, h);
  };
  new ResizeObserver(st.resize).observe(canvas); st.resize();
  return st;
}

// Selección con el puntero: devuelve el índice `userData.i` del objeto tocado (o -1). Ignora arrastres de más de 6 px.
export function makePicker(canvas, camera, getMeshes, { onPick, onHover, idle = 'grab' } = {}) {
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let down = null;
  const pick = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const h = ray.intersectObjects(getMeshes(), false)[0];
    return h ? h.object.userData.i : -1;
  };
  canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => { if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) return; const i = pick(e); if (i >= 0) onPick?.(i); });
  canvas.addEventListener('pointermove', (e) => { const i = pick(e); canvas.style.cursor = i >= 0 ? 'pointer' : idle; onHover?.(i); });
  canvas.addEventListener('pointerleave', () => onHover?.(-1));
  return { pick };
}

// Posiciona un elemento DOM sobre un punto 3D: place(el, Vector3, dy).
export function projector(canvas, camera) {
  const v = new THREE.Vector3();
  return (el, p, dy = 0) => {
    v.copy(p); v.y += dy; v.project(camera);
    el.style.left = ((v.x + 1) / 2) * canvas.clientWidth + 'px';
    el.style.top = ((1 - v.y) / 2) * canvas.clientHeight + 'px';
  };
}

// Si no hay WebGL la presentación sigue funcionando (solo se pierden las escenas 3D).
export function safe(label, fn, canvas) {
  try { return fn(); } catch (err) {
    console.warn(`[${label}] WebGL no disponible`, err);
    if (canvas?.parentElement) {
      const m = document.createElement('div');
      m.style.cssText = 'position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:40px;color:inherit;font-size:22px';
      m.textContent = 'La escena 3D no está disponible en este equipo. El resto de la actividad funciona igual.';
      canvas.parentElement.appendChild(m);
    }
    return null;
  }
}
