import * as THREE from 'three';
import { ACCENT, ACCENT_SECONDARY, BLUE, DARK, makeMaterial, makeLineMaterial, easeOutCubic } from '../helpers.js';

function buildRobot(scale, color) {
  const bot = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.4, 0.32),
    makeMaterial(DARK, { opacity: 0.95, roughness: 0.4, metalness: 0.35 })
  );
  bot.add(body);

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.24, 0.28),
    makeMaterial(0xe4e6ea, { opacity: 0.95, roughness: 0.3, metalness: 0.2 })
  );
  head.position.y = 0.32;
  bot.add(head);

  [-0.08, 0.08].forEach((x) => {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 8, 8),
      makeMaterial(color, { opacity: 1, emissive: color, emissiveIntensity: 0.9 })
    );
    eye.position.set(x, 0.33, 0.15);
    bot.add(eye);
  });

  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.18, 6),
    makeMaterial(0xaaaaaa, { opacity: 0.9, roughness: 0.4, metalness: 0.6 })
  );
  antenna.position.y = 0.55;
  bot.add(antenna);

  const antennaTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 8, 8),
    makeMaterial(color, { opacity: 1, emissive: color, emissiveIntensity: 0.7 })
  );
  antennaTip.position.y = 0.65;
  bot.add(antennaTip);

  [-0.28, 0.28].forEach((x) => {
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.24, 0.08),
      makeMaterial(color, { opacity: 0.9, emissive: color, emissiveIntensity: 0.2, roughness: 0.4 })
    );
    arm.position.set(x, -0.02, 0);
    bot.add(arm);
  });

  bot.scale.setScalar(scale);
  return bot;
}

// 04 -- Autonomous AI Agents: literal little robots orbiting a hub robot,
// instead of abstract icosahedron nodes.
export function buildAgentsScene() {
  const group = new THREE.Group();

  const hub = buildRobot(1.5, ACCENT);
  group.add(hub);

  const agents = [];
  const agentDefs = [
    { rx: 2.4, rz: 1.3, speed: 0.5, phase: 0, y: 0.5, color: ACCENT },
    { rx: 1.7, rz: 2.2, speed: -0.4, phase: 1.2, y: -0.4, color: BLUE },
    { rx: 2.7, rz: 1.0, speed: 0.35, phase: 2.4, y: 0.15, color: ACCENT_SECONDARY },
    { rx: 1.3, rz: 1.8, speed: -0.55, phase: 3.6, y: -0.6, color: ACCENT },
    { rx: 2.2, rz: 1.5, speed: 0.45, phase: 4.8, y: 0.65, color: 0xffffff },
  ];

  agentDefs.forEach((def) => {
    const bot = buildRobot(0.8, def.color);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    const line = new THREE.Line(lineGeo, makeLineMaterial(def.color, 0.3));
    group.add(bot, line);
    agents.push({ mesh: bot, line, ...def });
  });

  group.userData.update = (t, lp) => {
    const eased = easeOutCubic(lp);
    group.scale.setScalar(0.55 + 0.45 * eased);
    hub.rotation.y = Math.sin(t * 0.25) * 0.3;

    agents.forEach((a) => {
      const angle = t * a.speed + a.phase;
      const x = Math.cos(angle) * a.rx * eased;
      const y = a.y;
      const z = Math.sin(angle) * a.rz * eased;
      a.mesh.position.set(x, y, z);
      a.mesh.rotation.y = angle + Math.PI / 2;
      a.mesh.rotation.z = Math.sin(t * 0.8 + a.phase) * 0.08;

      const posAttr = a.line.geometry.getAttribute('position');
      posAttr.setXYZ(0, 0, 0.15, 0);
      posAttr.setXYZ(1, x, y, z);
      posAttr.needsUpdate = true;
    });

    group.rotation.y = Math.sin(t * 0.08) * 0.1;
  };

  return group;
}
