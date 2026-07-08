import './style/tokens.css';
import './style/base.css';
import './style/components.css';
import './style/sections/hero.css';
import './style/sections/services.css';
import './style/sections/products.css';
import './style/sections/process.css';
import './style/sections/cta.css';
import './style/sections/modal.css';

import { initSmoothScroll, refreshScrollTriggers } from './lib/lenis-gsap.js';
import { initRevealSystem, initNavScrollSpy } from './lib/reveal.js';
import { initMobileNav } from './lib/mobileNav.js';
import { initTheme } from './lib/theme.js';
import { initHero } from './sections/hero.js';
import { initServicesChapters } from './sections/servicesChapters.js';
import { initProjectBuilder } from './modal/projectBuilder.js';

// Applied as early as possible (module scripts run after HTML parsing but
// before DOMContentLoaded) to minimize a flash of the wrong theme.
initTheme();

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initMobileNav();
  initNavScrollSpy();
  initRevealSystem();
  initHero();
  initServicesChapters();
  initProjectBuilder();

  window.addEventListener('load', () => {
    document.fonts?.ready.then(refreshScrollTriggers);
    refreshScrollTriggers();
  });
});
