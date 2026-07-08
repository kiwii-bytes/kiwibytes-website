import * as THREE from 'three';
import { ACCENT, BLUE, DARK, makeMaterial, makeLineMaterial, easeOutCubic } from '../helpers.js';

// 03 -- Custom AI & LLM Integrations: a literal AI chip/processor, so it
// reads instantly instead of relying on an abstract network shape.
export function buildAIScene(prefersReducedMotion) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 1.7, 0.2),
    makeMaterial(DARK, { opacity: 0.95, roughness: 0.35, metalness: 0.4 })
  );
  group.add(body);

  // Pins along all four edges, like an IC package.
  const PIN_COUNT = 6;
  for (let side = 0; side < 4; side++) {
    for (let i = 0; i < PIN_COUNT; i++) {
      const pin = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.05, 0.05),
        makeMaterial(0xcfd3d8, { opacity: 0.95, roughness: 0.25, metalness: 0.8 })
      );
      const offset = -0.72 + (i / (PIN_COUNT - 1)) * 1.44;
      const edge = 0.95;
      if (side === 0) pin.position.set(offset, edge, 0);
      if (side === 1) pin.position.set(offset, -edge, 0);
      if (side === 2) { pin.position.set(edge, offset, 0); pin.rotation.z = Math.PI / 2; }
      if (side === 3) { pin.position.set(-edge, offset, 0); pin.rotation.z = Math.PI / 2; }
      group.add(pin);
    }
  }

  // Circuit traces etched into the top face -- simple right-angle paths
  // running from the edges in toward the glowing core.
  const traceDefs = [
    [[-0.7, 0.7], [-0.7, 0.2], [-0.25, 0.2]],
    [[0.7, 0.7], [0.7, 0.3], [0.25, 0.3]],
    [[-0.7, -0.7], [-0.3, -0.7], [-0.3, -0.25]],
    [[0.7, -0.7], [0.2, -0.7], [0.2, -0.25]],
    [[-0.7, 0], [-0.35, 0]],
    [[0.7, -0.1], [0.35, -0.1]],
  ];
  const tracePositions = [];
  traceDefs.forEach((path) => {
    for (let i = 0; i < path.length - 1; i++) {
      tracePositions.push(path[i][0], path[i][1], 0.101, path[i + 1][0], path[i + 1][1], 0.101);
    }
  });
  const traceGeo = new THREE.BufferGeometry();
  traceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(tracePositions), 3));
  group.add(new THREE.LineSegments(traceGeo, makeLineMaterial(ACCENT, 0.8)));

  // Small via dots at each trace joint for detail.
  traceDefs.forEach((path) => {
    path.forEach(([x, y]) => {
      const via = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.02, 8),
        makeMaterial(ACCENT, { opacity: 0.9, emissive: ACCENT, emissiveIntensity: 0.3 })
      );
      via.rotation.x = Math.PI / 2;
      via.position.set(x, y, 0.101);
      group.add(via);
    });
  });

  const core = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.55, 0.06),
    makeMaterial(ACCENT, { opacity: 0.95, emissive: ACCENT, emissiveIntensity: 0.7, roughness: 0.2 })
  );
  core.position.z = 0.12;
  group.add(core);

  // Small pulses of "signal" traveling along a couple of the traces.
  const flowMat = makeMaterial(ACCENT, { opacity: 0.95, emissive: ACCENT, emissiveIntensity: 1 });
  const flowGeo = new THREE.SphereGeometry(0.035, 8, 8);
  const FLOW_COUNT = 8;
  const flowMesh = new THREE.InstancedMesh(flowGeo, flowMat, FLOW_COUNT);
  group.add(flowMesh);
  const dummy = new THREE.Object3D();
  const flowPaths = traceDefs.filter((p) => p.length > 1);
  const flowState = Array.from({ length: FLOW_COUNT }, (_, i) => ({
    path: flowPaths[i % flowPaths.length],
    offset: Math.random(),
    speed: 0.2 + Math.random() * 0.15,
  }));

  // A faint orbiting halo of connection points -- keeps a bit of the
  // "network" feel without it being the whole story.
  const haloGroup = new THREE.Group();
  const haloColors = [ACCENT, BLUE, 0xffffff];
  const haloNodes = haloColors.map((color, i) => {
    const node = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.09, 0),
      makeMaterial(color, { opacity: 0.85, emissive: color, emissiveIntensity: 0.3 })
    );
    node.userData.radius = 1.5 + i * 0.25;
    node.userData.speed = 0.25 + i * 0.08;
    node.userData.phase = i * (Math.PI * 2 / 3);
    haloGroup.add(node);
    return node;
  });
  group.add(haloGroup);

  group.userData.update = (t, lp) => {
    const eased = easeOutCubic(lp);
    group.scale.setScalar(0.55 + 0.45 * eased);
    group.rotation.y = Math.sin(t * 0.12) * 0.18;
    group.rotation.x = 0.12;

    const pulse = 0.5 + Math.sin(t * 1.8) * 0.1;
    core.material.emissiveIntensity = prefersReducedMotion ? 0.7 : pulse + 0.3;

    flowState.forEach((f, i) => {
      const localT = prefersReducedMotion ? f.offset : (f.offset + t * f.speed) % 1;
      const segCount = f.path.length - 1;
      const segT = localT * segCount;
      const segIndex = Math.min(segCount - 1, Math.floor(segT));
      const segLocal = segT - segIndex;
      const a = f.path[segIndex];
      const b = f.path[segIndex + 1];
      dummy.position.set(
        a[0] + (b[0] - a[0]) * segLocal,
        a[1] + (b[1] - a[1]) * segLocal,
        0.11
      );
      dummy.updateMatrix();
      flowMesh.setMatrixAt(i, dummy.matrix);
    });
    flowMesh.instanceMatrix.needsUpdate = true;

    haloNodes.forEach((node) => {
      const angle = t * node.userData.speed + node.userData.phase;
      node.position.set(Math.cos(angle) * node.userData.radius, Math.sin(t * 0.3 + node.userData.phase) * 0.3, Math.sin(angle) * node.userData.radius * 0.6);
    });
  };

  return group;
}
