import * as THREE from 'three';
import { ACCENT, ACCENT_SECONDARY, BLUE, DARK, makeMaterial, makePointsMaterial, easeOutCubic } from '../helpers.js';

// 06 -- Shopify & E-Commerce Systems: stylized bag with orbiting product tiles
export function buildShopifyScene(prefersReducedMotion) {
  const group = new THREE.Group();

  const bagShape = new THREE.Shape();
  bagShape.moveTo(-0.9, 1.1);
  bagShape.lineTo(0.9, 1.1);
  bagShape.lineTo(0.65, -1.2);
  bagShape.lineTo(-0.65, -1.2);
  bagShape.lineTo(-0.9, 1.1);

  const bagGeo = new THREE.ExtrudeGeometry(bagShape, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 2 });
  bagGeo.center();
  const bag = new THREE.Mesh(bagGeo, makeMaterial(ACCENT, { opacity: 0.92, roughness: 0.35, metalness: 0.1, emissive: ACCENT, emissiveIntensity: 0.12 }));
  group.add(bag);

  [-0.45, 0.45].forEach((x) => {
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.05, 8, 24, Math.PI),
      makeMaterial(DARK, { opacity: 0.9, roughness: 0.4, metalness: 0.2 })
    );
    handle.position.set(x, 1.05, 0);
    handle.rotation.z = Math.PI;
    group.add(handle);
  });

  // A small price tag hanging off the bag -- reinforces "shopping/purchase"
  // as a universal, brand-neutral visual rather than any specific logo.
  const tagGroup = new THREE.Group();
  const tagShape = new THREE.Shape();
  tagShape.moveTo(-0.22, 0.1);
  tagShape.lineTo(0.14, 0.1);
  tagShape.lineTo(0.14, -0.1);
  tagShape.lineTo(-0.22, -0.1);
  tagShape.lineTo(-0.32, 0);
  tagShape.lineTo(-0.22, 0.1);
  const tagGeo = new THREE.ExtrudeGeometry(tagShape, { depth: 0.03, bevelEnabled: false });
  const tag = new THREE.Mesh(tagGeo, makeMaterial(0xf2f2ef, { opacity: 0.95, roughness: 0.45 }));
  tagGroup.add(tag);
  const tagHole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.05, 12),
    makeMaterial(DARK, { opacity: 1 })
  );
  tagHole.rotation.x = Math.PI / 2;
  tagHole.position.set(-0.26, 0, 0);
  tagGroup.add(tagHole);
  tagGroup.position.set(0.5, 0.55, 0.32);
  tagGroup.rotation.z = -0.35;
  group.add(tagGroup);

  const tileColors = [ACCENT, BLUE, ACCENT_SECONDARY, 0xffffff];
  const tiles = [];
  tileColors.forEach((color, i) => {
    const tile = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.34, 0.05),
      makeMaterial(color, { opacity: 0.9, emissive: color, emissiveIntensity: 0.25 })
    );
    tile.userData.radius = 2.0 + (i % 2) * 0.3;
    tile.userData.speed = 0.3 + i * 0.06;
    tile.userData.phase = i * (Math.PI / 2);
    tile.userData.y = -0.5 + i * 0.35;
    tiles.push(tile);
    group.add(tile);
  });

  const BURST_COUNT = 40;
  const burstPositions = new Float32Array(BURST_COUNT * 3);
  const burstSeeds = [];
  for (let i = 0; i < BURST_COUNT; i++) {
    const seed = { x: (Math.random() - 0.5) * 2.4, z: (Math.random() - 0.5) * 2.4, offset: Math.random() };
    burstSeeds.push(seed);
    burstPositions[i * 3] = seed.x;
    burstPositions[i * 3 + 1] = -1.5;
    burstPositions[i * 3 + 2] = seed.z;
  }
  const burstGeo = new THREE.BufferGeometry();
  burstGeo.setAttribute('position', new THREE.BufferAttribute(burstPositions, 3));
  const burstMat = makePointsMaterial(ACCENT_SECONDARY, 0.05, 0.7);
  const burst = new THREE.Points(burstGeo, burstMat);
  group.add(burst);

  group.userData.update = (t, lp) => {
    const eased = easeOutCubic(lp);
    group.scale.setScalar(0.5 + 0.5 * eased);
    bag.rotation.y = Math.sin(t * 0.15) * 0.2;
    group.rotation.y = t * 0.06;
    tagGroup.rotation.z = -0.35 + Math.sin(t * 0.9) * 0.06;

    tiles.forEach((tile) => {
      const angle = t * tile.userData.speed + tile.userData.phase;
      tile.position.set(
        Math.cos(angle) * tile.userData.radius * eased,
        tile.userData.y,
        Math.sin(angle) * tile.userData.radius * eased
      );
      tile.rotation.y += 0.01;
    });

    if (!prefersReducedMotion) {
      const posAttr = burst.geometry.getAttribute('position');
      for (let i = 0; i < BURST_COUNT; i++) {
        const seed = burstSeeds[i];
        const y = -1.5 + ((t * 0.3 + seed.offset) % 1) * 3;
        posAttr.setXYZ(i, seed.x, y, seed.z);
      }
      posAttr.needsUpdate = true;
    }
  };

  return group;
}
