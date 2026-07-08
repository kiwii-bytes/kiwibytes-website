import * as THREE from 'three';

export const ACCENT = 0x74c915;
export const ACCENT_SECONDARY = 0xa08556;
export const DARK = 0x23232b;
export const BLUE = 0x3b5bdb;

export function makeMaterial(color, opts = {}) {
  const {
    opacity = 1,
    roughness = 0.4,
    metalness = 0.15,
    emissive = 0x000000,
    emissiveIntensity = 0,
    wireframe = false,
  } = opts;
  const mat = new THREE.MeshStandardMaterial({
    color, roughness, metalness, emissive, emissiveIntensity, wireframe,
    transparent: true, opacity,
  });
  mat.userData.baseOpacity = opacity;
  return mat;
}

export function makeLineMaterial(color, opacity = 1) {
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  mat.userData.baseOpacity = opacity;
  return mat;
}

// Additive blending reads as a glow on a dark background but washes out
// toward invisible on a light one (it can only ever brighten toward white).
// Since the site now supports both themes, every points material must be
// able to flip blending mode live when the user toggles theme.
const pointMaterialRegistry = [];

export function makePointsMaterial(color, size, opacity = 1) {
  const mat = new THREE.PointsMaterial({
    color, size, sizeAttenuation: true, transparent: true, opacity, depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  mat.userData.baseOpacity = opacity;
  pointMaterialRegistry.push(mat);
  return mat;
}

export function updatePointMaterialsForTheme(theme) {
  const blending = theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending;
  pointMaterialRegistry.forEach((mat) => {
    mat.blending = blending;
    mat.needsUpdate = true;
  });
}

export function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

export function applyGroupAlpha(root, alpha) {
  root.traverse((obj) => {
    const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
    mats.forEach((m) => {
      if (m && typeof m.userData.baseOpacity === 'number') {
        m.opacity = m.userData.baseOpacity * alpha;
      }
    });
  });
}

// Registers a mesh that should "assemble" into place as local segment
// progress advances, plus a gentle idle float once settled.
export function registerAssembledPart(mesh, restPosition, startOffset, floatAmp = 0.05, floatSpeed = 0.6, phase = 0) {
  mesh.userData.rest = restPosition.clone();
  mesh.userData.startOffset = startOffset.clone();
  mesh.userData.floatAmp = floatAmp;
  mesh.userData.floatSpeed = floatSpeed;
  mesh.userData.phase = phase;
  mesh.position.copy(restPosition).add(startOffset);
  return mesh;
}

export function updateAssembledParts(group, t, localProgress) {
  const eased = easeOutCubic(localProgress);
  group.children.forEach((child) => {
    if (!child.userData.rest) return;
    const float = Math.sin(t * child.userData.floatSpeed + child.userData.phase) * child.userData.floatAmp;
    child.position.copy(child.userData.rest)
      .addScaledVector(child.userData.startOffset, 1 - eased);
    child.position.y += float * eased;
  });
}
