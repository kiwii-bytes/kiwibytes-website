import * as THREE from 'three';
import { ACCENT, BLUE } from './helpers.js';

export function createThreeCore(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (err) {
    return null;
  }
  // `alpha: true` only makes the canvas *capable* of transparency -- the
  // renderer's own default clear alpha is still 1 (opaque black) unless set
  // explicitly. That was invisible on the dark theme (opaque black over a
  // near-black page background) but completely masked the light theme's
  // background everywhere the canvas sits behind untinted page content.
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 8);

  // Dimmer ambient than the old light-theme version -- on a near-black
  // background we want shapes to read from their own emissive glow and the
  // accent rim/fill lights, not from flat ambient fill.
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(4, 6, 6);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(ACCENT, 3, 24);
  rimLight.position.set(-4, -2, 4);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(BLUE, 1.4, 24);
  fillLight.position.set(3, -3, -3);
  scene.add(fillLight);

  function setPixelRatio() {
    const isTouch = matchMedia('(pointer: coarse)').matches;
    const cap = isTouch || window.innerWidth < 480 ? 1 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
  }

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    setPixelRatio();
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);
  resize();

  // Light theme has an implicitly bright backdrop, so objects need less
  // ambient/key fill to read with the same contrast a dark backdrop gives
  // them for free.
  function updateLightingForTheme(theme) {
    const isLight = theme === 'light';
    ambient.intensity = isLight ? 0.75 : 0.4;
    keyLight.intensity = isLight ? 0.6 : 0.9;
  }

  return { renderer, scene, camera, resize, updateLightingForTheme };
}
