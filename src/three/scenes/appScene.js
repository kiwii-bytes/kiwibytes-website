import * as THREE from 'three';
import { ACCENT, ACCENT_SECONDARY, BLUE, makeMaterial, easeOutCubic } from '../helpers.js';

// 02 -- Bespoke App Development: floating phone with animated screen + orbiting icons
export function buildAppScene(prefersReducedMotion) {
  const group = new THREE.Group();

  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 256;
  screenCanvas.height = 512;
  const sctx = screenCanvas.getContext('2d');
  const screenTexture = new THREE.CanvasTexture(screenCanvas);

  function drawScreen(t) {
    sctx.fillStyle = '#12141a';
    sctx.fillRect(0, 0, 256, 512);
    sctx.fillStyle = 'rgba(116, 201, 21, 0.9)';
    sctx.fillRect(24, 40, 208, 34);
    for (let i = 0; i < 5; i++) {
      const y = 100 + i * 78;
      const wobble = Math.sin(t * 1.4 + i) * 6;
      sctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(160,133,86,0.18)';
      sctx.fillRect(24, y + wobble, 208, 56);
      sctx.fillStyle = 'rgba(255,255,255,0.35)';
      sctx.fillRect(40, y + wobble + 16, 120, 10);
      sctx.fillRect(40, y + wobble + 34, 80, 8);
    }
    screenTexture.needsUpdate = true;
  }
  drawScreen(0);

  const phone = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 3.1, 0.16),
    makeMaterial(0x1b1b20, { opacity: 0.95, roughness: 0.35, metalness: 0.4 })
  );
  phone.add(body);

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.42, 2.85),
    new THREE.MeshBasicMaterial({ map: screenTexture, transparent: true, opacity: 1 })
  );
  screen.material.userData.baseOpacity = 1;
  screen.position.z = 0.081;
  phone.add(screen);

  phone.rotation.y = -0.25;
  phone.rotation.x = 0.05;
  group.add(phone);

  const satellites = [];
  const satelliteColors = [ACCENT, BLUE, ACCENT_SECONDARY, 0xffffff];
  satelliteColors.forEach((color, i) => {
    const sat = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.16, 0),
      makeMaterial(color, { opacity: 0.95, emissive: color, emissiveIntensity: 0.35, roughness: 0.3 })
    );
    sat.userData.radiusX = 2.1 + (i % 2) * 0.4;
    sat.userData.radiusZ = 1.4 + (i % 2) * 0.3;
    sat.userData.speed = 0.35 + i * 0.07;
    sat.userData.phase = i * (Math.PI / 2);
    sat.userData.y = Math.sin(i) * 0.6;
    satellites.push(sat);
    group.add(sat);
  });

  group.userData.update = (t, lp) => {
    const eased = easeOutCubic(lp);
    phone.scale.setScalar(0.4 + 0.6 * eased);
    phone.position.y = -2 * (1 - eased);
    if (!prefersReducedMotion) drawScreen(t);
    satellites.forEach((sat) => {
      const angle = t * sat.userData.speed + sat.userData.phase;
      sat.position.set(
        Math.cos(angle) * sat.userData.radiusX * eased,
        sat.userData.y,
        Math.sin(angle) * sat.userData.radiusZ * eased
      );
      sat.rotation.x += 0.01;
      sat.rotation.y += 0.015;
    });
    group.rotation.y = Math.sin(t * 0.1) * 0.1;
  };

  return group;
}
