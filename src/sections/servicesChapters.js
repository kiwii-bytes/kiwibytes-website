import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/lenis-gsap.js';
import { createThreeCore } from '../three/core.js';
import { buildScenes } from '../three/scenes/index.js';
import { applyGroupAlpha, updatePointMaterialsForTheme } from '../three/helpers.js';
import { bloomIsSupported, createBloomComposer } from '../three/bloom.js';
import { getTheme, onThemeChange } from '../lib/theme.js';

export function initServicesChapters() {
  const canvas = document.getElementById('gl-canvas');
  if (!canvas) return;

  const core = createThreeCore(canvas);
  if (!core) {
    canvas.style.display = 'none';
    return; // WebGL unavailable -- page still works without the 3D layer
  }
  const { renderer, scene, camera } = core;

  const scenes = buildScenes(prefersReducedMotion);
  scenes.forEach((g) => { g.visible = false; scene.add(g); });

  updatePointMaterialsForTheme(getTheme());
  core.updateLightingForTheme(getTheme());
  onThemeChange((theme) => {
    updatePointMaterialsForTheme(theme);
    core.updateLightingForTheme?.(theme);
    setComposerForTheme(theme);
  });

  const SEGMENT_COUNT = scenes.length;
  const BLEND = 0.12;
  const HALF_BLEND = BLEND / 2;

  // Continuous per-scene alpha as a function of `scaled` -- not derived from
  // a floor()'d index, so adjacent scenes never disagree at the exact
  // boundary (that mismatch is what caused a visible opacity "pop" in an
  // earlier version of this crossfade).
  function alphaFor(i, scaled) {
    let a = 1;
    if (i > 0) {
      const fadeInStart = i - HALF_BLEND;
      const fadeInEnd = i + HALF_BLEND;
      if (scaled <= fadeInStart) return 0;
      if (scaled < fadeInEnd) a = Math.min(a, (scaled - fadeInStart) / (fadeInEnd - fadeInStart));
    }
    if (i < SEGMENT_COUNT - 1) {
      const fadeOutStart = i + 1 - HALF_BLEND;
      const fadeOutEnd = i + 1 + HALF_BLEND;
      if (scaled >= fadeOutEnd) return 0;
      if (scaled > fadeOutStart) a = Math.min(a, 1 - (scaled - fadeOutStart) / (fadeOutEnd - fadeOutStart));
    }
    return Math.max(0, Math.min(1, a));
  }

  // UnrealBloomPass's composite shader always outputs opaque alpha, which
  // silently breaks this canvas's transparency (invisible on the dark theme,
  // where the backdrop is already near-black, but it paints over the light
  // theme's page background everywhere the canvas sits). Bloom was only
  // ever meant to matter on the dark theme anyway -- it barely reads
  // against white -- so gate it off entirely on light theme instead of
  // trying to make bloom alpha-correct.
  let composer = null;
  function setComposerForTheme(theme) {
    const wantsBloom = theme !== 'light' && !prefersReducedMotion && bloomIsSupported();
    if (wantsBloom && !composer) composer = createBloomComposer(renderer, scene, camera);
    if (!wantsBloom) composer = null;
  }
  setComposerForTheme(getTheme());

  const chapterEls = document.querySelectorAll('.chapter');
  const progressLabel = document.getElementById('chapter-progress-label');
  const progressFill = document.getElementById('chapter-progress-fill');

  let activeIndex = -1;
  let lastScaled = 0;
  let mode = 'mobile'; // 'desktop' (crossfade) | 'mobile' (discrete)

  function setDisplayIndex(index) {
    if (index === activeIndex) return;
    activeIndex = index;
    if (progressLabel) progressLabel.textContent = `0${index + 1} / 0${SEGMENT_COUNT}`;
    if (progressFill) progressFill.style.width = `${((index + 1) / SEGMENT_COUNT) * 100}%`;
    chapterEls.forEach((el) => {
      el.classList.toggle('is-active', parseInt(el.dataset.sceneIndex, 10) === index);
    });
  }

  function applyCrossfade(scaled) {
    lastScaled = scaled;
    scenes.forEach((group, i) => {
      const alpha = alphaFor(i, scaled);
      group.visible = alpha > 0.001;
      if (group.visible) applyGroupAlpha(group, alpha);
    });
    chapterEls.forEach((el) => {
      const i = parseInt(el.dataset.sceneIndex, 10);
      el.style.opacity = String(alphaFor(i, scaled));
    });
    const displayIndex = Math.max(0, Math.min(SEGMENT_COUNT - 1, Math.round(scaled - 0.5)));
    setDisplayIndex(displayIndex);
  }

  // The 3D layer is persistent (fixed, full-page), so it must be explicitly
  // turned off once scroll leaves the services-chapters range in either
  // direction -- otherwise whatever scene was last active stays frozen
  // visible and bleeds through Products/Process/CTA/Footer indefinitely.
  function hideAllScenes() {
    scenes.forEach((group) => { group.visible = false; });
    chapterEls.forEach((el) => { el.style.opacity = '0'; });
  }

  // Desktop: pinned + scrubbed crossfade across all 6 chapters in one take.
  function setupDesktop() {
    mode = 'desktop';
    const chapterPin = document.querySelector('.chapter-pin');

    const st = ScrollTrigger.create({
      trigger: chapterPin,
      start: 'top top',
      end: () => `+=${window.innerHeight * SEGMENT_COUNT}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => applyCrossfade(self.progress * SEGMENT_COUNT),
      onLeave: hideAllScenes,
      onLeaveBack: hideAllScenes,
    });

    return () => st.kill();
  }

  // Mobile: no pin/scroll-jack -- each chapter is a normal in-flow block,
  // always fully visible; whichever is nearest the viewport center gets its
  // 3D scene switched on (a discrete swap, not a scrubbed crossfade).
  function setupMobile() {
    mode = 'mobile';
    chapterEls.forEach((el) => { el.style.opacity = '1'; });

    const triggers = Array.from(chapterEls).map((el) => {
      const i = parseInt(el.dataset.sceneIndex, 10);
      return ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => {
          if (self.isActive) {
            scenes.forEach((group, gi) => {
              const alpha = gi === i ? 1 : 0;
              group.visible = alpha > 0;
              if (group.visible) applyGroupAlpha(group, alpha);
            });
            setDisplayIndex(i);
          } else {
            scenes[i].visible = false;
          }
        },
      });
    });

    // Deliberately not forcing any scene visible here -- each chapter's own
    // trigger above turns its scene on only once that chapter actually
    // scrolls into view. Forcing scene 0 on at init made it bleed through
    // the hero (the canvas is a persistent full-page layer, visible from
    // scroll position 0 onward).

    return () => triggers.forEach((t) => t.kill());
  }

  const mm = gsap.matchMedia();
  mm.add('(min-width: 769px)', setupDesktop);
  mm.add('(max-width: 768px)', setupMobile);

  // Render loop unified with the GSAP ticker (which Lenis also drives) so
  // scene motion and scroll progress stay on one clock, per the Lenis+GSAP
  // wiring notes -- no independent requestAnimationFrame here.
  const startTime = performance.now();
  let paused = document.visibilityState !== 'visible';
  document.addEventListener('visibilitychange', () => {
    paused = document.visibilityState !== 'visible';
  });

  gsap.ticker.add(() => {
    if (paused) return;
    const t = prefersReducedMotion ? 0 : (performance.now() - startTime) / 1000;

    scenes.forEach((group, i) => {
      if (!group.visible || !group.userData.update) return;
      const ownProgress = mode === 'desktop'
        ? Math.max(0, Math.min(1, lastScaled - i))
        : 1;
      group.userData.update(t, ownProgress);
    });

    if (composer) composer.render();
    else renderer.render(scene, camera);
  });
}
