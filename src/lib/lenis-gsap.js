import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;

export function initSmoothScroll() {
  if (prefersReducedMotion) {
    // Reduced motion: skip inertial smoothing entirely (it's a motion effect
    // some users are explicitly opting out of). ScrollTrigger still works
    // fine against native scroll.
    return null;
  }

  lenis = new Lenis({ autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  // Lenis already provides its own smoothing -- GSAP's lag compensation
  // would otherwise fight it and cause drift.
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis() {
  return lenis;
}

export function pauseScroll() {
  lenis?.stop();
}

export function resumeScroll() {
  lenis?.start();
}

export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}

export { gsap, ScrollTrigger };
