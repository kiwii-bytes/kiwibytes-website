import * as THREE from 'three';
import { ACCENT, DARK, makeMaterial, makeLineMaterial, easeOutCubic } from '../helpers.js';

// 05 -- Scalable Cloud & DevOps: a literal puffy cloud shape with server
// racks synced beneath it, instead of an abstract connected-box network.
export function buildCloudScene(prefersReducedMotion) {
  const group = new THREE.Group();

  const cloudMat = makeMaterial(0xf0f1f3, { opacity: 0.92, roughness: 0.5, metalness: 0.05, emissive: ACCENT, emissiveIntensity: 0.05 });
  const cloudGroup = new THREE.Group();
  const puffDefs = [
    { pos: [0, 0, 0], r: 0.62 },
    { pos: [-0.62, 0.05, 0.1], r: 0.42 },
    { pos: [0.6, 0.08, -0.1], r: 0.46 },
    { pos: [-0.25, 0.3, 0.2], r: 0.4 },
    { pos: [0.3, 0.32, 0.15], r: 0.38 },
    { pos: [0.05, -0.12, 0.3], r: 0.4 },
  ];
  puffDefs.forEach((p) => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(p.r, 16, 16), cloudMat);
    puff.position.set(...p.pos);
    cloudGroup.add(puff);
  });
  cloudGroup.position.y = 1.1;
  group.add(cloudGroup);

  const serverDefs = [
    { x: -1.5, z: 0.3 },
    { x: 0, z: 0.6 },
    { x: 1.5, z: 0.2 },
  ];
  const servers = serverDefs.map((def) => {
    const rack = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 1.5, 0.5),
      makeMaterial(DARK, { opacity: 0.95, roughness: 0.4, metalness: 0.3 })
    );
    rack.add(body);

    const lights = [];
    for (let i = 0; i < 4; i++) {
      const light = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.06, 0.02),
        makeMaterial(ACCENT, { opacity: 0.95, emissive: ACCENT, emissiveIntensity: 0.6 })
      );
      light.position.set(0, 0.5 - i * 0.32, 0.26);
      rack.add(light);
      lights.push(light);
    }

    rack.position.set(def.x, -0.9, def.z);
    rack.userData.lights = lights;
    group.add(rack);
    return rack;
  });

  const linePositions = [];
  servers.forEach((rack) => {
    linePositions.push(
      rack.position.x, rack.position.y + 0.75, rack.position.z,
      cloudGroup.position.x, cloudGroup.position.y - 0.5, cloudGroup.position.z
    );
  });
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  group.add(new THREE.LineSegments(lineGeo, makeLineMaterial(ACCENT, 0.35)));

  const FLOW_COUNT = 9;
  const flowMat = makeMaterial(ACCENT, { opacity: 0.95, emissive: ACCENT, emissiveIntensity: 0.9 });
  const flowGeo = new THREE.SphereGeometry(0.05, 8, 8);
  const flowMesh = new THREE.InstancedMesh(flowGeo, flowMat, FLOW_COUNT);
  group.add(flowMesh);
  const dummy = new THREE.Object3D();
  const cloudBottom = new THREE.Vector3(cloudGroup.position.x, cloudGroup.position.y - 0.5, cloudGroup.position.z);
  const flowState = Array.from({ length: FLOW_COUNT }, (_, i) => ({
    server: servers[i % servers.length],
    offset: Math.random(),
    speed: 0.2 + Math.random() * 0.15,
  }));

  group.userData.update = (t, lp) => {
    const eased = easeOutCubic(lp);
    group.scale.setScalar(0.55 + 0.45 * eased);
    group.rotation.y = Math.sin(t * 0.08) * 0.15;
    // Note: cloudGroup's position stays fixed (rather than bobbing) so the
    // static connector lines to each server don't visibly detach from it.

    servers.forEach((rack, i) => {
      rack.userData.lights.forEach((light, li) => {
        const blink = 0.4 + Math.max(0, Math.sin(t * 1.5 + i + li * 0.7)) * 0.6;
        light.material.emissiveIntensity = prefersReducedMotion ? 0.6 : blink;
      });
    });

    flowState.forEach((f, i) => {
      const localT = prefersReducedMotion ? f.offset : (f.offset + t * f.speed) % 1;
      const start = new THREE.Vector3(f.server.position.x, f.server.position.y + 0.75, f.server.position.z);
      dummy.position.lerpVectors(start, cloudBottom, localT);
      dummy.updateMatrix();
      flowMesh.setMatrixAt(i, dummy.matrix);
    });
    flowMesh.instanceMatrix.needsUpdate = true;
  };

  return group;
}
