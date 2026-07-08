import { gsap, ScrollTrigger, prefersReducedMotion } from './lenis-gsap.js';

export function initRevealSystem() {
  const els = gsap.utils.toArray('.reveal-on-scroll');
  if (!els.length) return;

  if (prefersReducedMotion) {
    els.forEach((el) => el.classList.add('revealed'));
    return;
  }

  ScrollTrigger.batch(els, {
    start: 'top 88%',
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
      });
    },
    once: true,
  });

  gsap.set(els, { opacity: 0, y: 40 });
}

export function initNavScrollSpy() {
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link[data-nav-target]');
  const sections = Array.from(navLinks)
    .map((link) => ({
      link,
      el: document.getElementById(link.dataset.navTarget),
    }))
    .filter((entry) => entry.el);

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      header.classList.toggle('scrolled', self.scroll() > 20);
    },
  });

  sections.forEach(({ link, el }) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) {
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      },
    });
  });
}
