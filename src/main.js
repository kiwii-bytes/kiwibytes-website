// Client entry. CSS is imported by BaseLayout.astro (Astro bundles it into a
// real stylesheet link), so this file is initialization only.
//
// Astro bundles component <script> tags as deferred ES modules, which execute
// after the document has been parsed -- so the DOM is guaranteed ready here
// and no DOMContentLoaded wrapper is needed.
import { initSmoothScroll, refreshScrollTriggers } from './lib/lenis-gsap.js';
import { initRevealSystem, initHeaderScrollState } from './lib/reveal.js';
import { initMobileNav } from './lib/mobileNav.js';
import { initTheme } from './lib/theme.js';
import { initHero } from './sections/hero.js';
import { initProjectBuilder } from './modal/projectBuilder.js';
import { initNewsletter } from './lib/newsletter.js';

// Note: the FAQ deliberately has no JS -- it uses native <details>/<summary>,
// which is keyboard-accessible for free and keeps every answer present in the
// HTML (JS-gated answers are invisible to the AI crawlers we want citing us).

initTheme();
initSmoothScroll();
initMobileNav();
initHeaderScrollState();
initRevealSystem();
initHero();          // no-ops off the homepage
initProjectBuilder();
initNewsletter();    // no-ops where the form isn't present

window.addEventListener('load', () => {
  // Pin/reveal positions are computed against document height, which changes
  // once webfonts swap in -- recompute so nothing lands off-target.
  document.fonts?.ready.then(refreshScrollTriggers);
  refreshScrollTriggers();
});
