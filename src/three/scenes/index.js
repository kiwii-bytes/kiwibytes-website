import { buildWebScene } from './webScene.js';
import { buildAppScene } from './appScene.js';
import { buildAIScene } from './aiScene.js';
import { buildAgentsScene } from './agentsScene.js';
import { buildCloudScene } from './cloudScene.js';
import { buildShopifyScene } from './shopifyScene.js';

export const sceneLabels = [
  'Premium Web Engineering',
  'Bespoke App Development',
  'Custom AI & LLM Integrations',
  'Autonomous AI Agents',
  'Scalable Cloud & DevOps',
  'Shopify & E-Commerce Systems',
];

export function buildScenes(prefersReducedMotion) {
  return [
    buildWebScene(),
    buildAppScene(prefersReducedMotion),
    buildAIScene(prefersReducedMotion),
    buildAgentsScene(),
    buildCloudScene(prefersReducedMotion),
    buildShopifyScene(prefersReducedMotion),
  ];
}
