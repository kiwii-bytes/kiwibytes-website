import * as THREE from 'three';
import { ACCENT, ACCENT_SECONDARY, DARK, makeMaterial, registerAssembledPart, updateAssembledParts } from '../helpers.js';

// 01 -- Premium Web Engineering: stacked browser-window panels over a grid
export function buildWebScene() {
  const group = new THREE.Group();

  const grid = new THREE.GridHelper(7, 14, ACCENT, DARK);
  grid.material.transparent = true;
  grid.material.opacity = 0.18;
  grid.material.userData.baseOpacity = 0.18;
  grid.position.y = -2.2;
  group.add(grid);

  const panelDefs = [
    { pos: new THREE.Vector3(-1.1, 0.6, 0.4), size: [2.6, 1.7], color: 0xffffff, tilt: 0.08 },
    { pos: new THREE.Vector3(0.9, -0.3, -0.3), size: [2.2, 1.4], color: 0xf1f5e8, tilt: -0.1 },
    { pos: new THREE.Vector3(-0.4, -1.0, 0.9), size: [1.8, 1.15], color: 0xffffff, tilt: 0.05 },
  ];

  panelDefs.forEach((def, i) => {
    const panel = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(def.size[0], def.size[1], 0.06),
      makeMaterial(def.color, { opacity: 0.92, roughness: 0.5, metalness: 0.05 })
    );
    panel.add(body);

    const topBar = new THREE.Mesh(
      new THREE.BoxGeometry(def.size[0], 0.18, 0.07),
      makeMaterial(DARK, { opacity: 0.9, roughness: 0.6 })
    );
    topBar.position.y = def.size[1] / 2 - 0.09;
    panel.add(topBar);

    [-1, 0, 1].forEach((n) => {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.025, 8, 8),
        makeMaterial(n === -1 ? ACCENT : ACCENT_SECONDARY, { opacity: 1, emissive: n === -1 ? ACCENT : 0x000000, emissiveIntensity: n === -1 ? 0.8 : 0 })
      );
      dot.position.set(-def.size[0] / 2 + 0.16 + n * 0.11, def.size[1] / 2 - 0.09, 0.045);
      panel.add(dot);
    });

    for (let l = 0; l < 3; l++) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(def.size[0] * (0.75 - l * 0.15), 0.06, 0.02),
        makeMaterial(l === 0 ? ACCENT : 0xd8d8d0, { opacity: 0.85 })
      );
      line.position.set(-def.size[0] * 0.08, def.size[1] / 2 - 0.4 - l * 0.22, 0.045);
      panel.add(line);
    }

    panel.rotation.y = def.tilt;
    panel.renderOrder = i;
    registerAssembledPart(panel, def.pos, new THREE.Vector3(0, -2.4, -1), 0.04, 0.5, i * 1.3);
    group.add(panel);
  });

  group.userData.update = (t, lp) => {
    updateAssembledParts(group, t, lp);
    group.rotation.y = Math.sin(t * 0.12) * 0.08;
  };
  return group;
}
