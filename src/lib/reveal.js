import { gsap, prefersReducedMotion } from './lenis-gsap.js';

export function initRevealSystem() {
  const els = Array.from(document.querySelectorAll('.reveal-on-scroll'));
  if (!els.length) return;

  // Reduced motion: leave everything visible, do nothing at all.
  if (prefersReducedMotion) return;

  // The hidden state is applied from JS, never from CSS. That's deliberate: if
  // this script ever fails to run, a visitor (or a crawler) still sees all the
  // content rather than a blank page.
  gsap.set(els, { opacity: 0, y: 40 });

  const show = (el, delay = 0) =>
    gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay });

  // IntersectionObserver rather than a scroll-driven trigger.
  //
  // Why: scroll-driven reveals only fire when a scroll *event* fires. A
  // programmatic jump -- an anchor link like /services#web, a restored scroll
  // position on back/forward, or scrollIntoView() -- moves the page without
  // producing the scroll stream Lenis/ScrollTrigger listen to, so elements
  // that land in view were left permanently at opacity 0. IntersectionObserver
  // reports intersection regardless of *how* the page got there, and also
  // fires immediately on observe() for anything already in view.
  const io = new IntersectionObserver(
    (entries) => {
      const entering = entries.filter((e) => e.isIntersecting);
      entering.forEach((entry, i) => {
        show(entry.target, i * 0.08); // stagger items that appear together
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px' }
  );

  els.forEach((el) => {
    // Already scrolled past (e.g. we deep-linked below it)? Just show it —
    // don't make the user scroll back up to un-hide content.
    if (el.getBoundingClientRect().bottom < 0) {
      gsap.set(el, { opacity: 1, y: 0 });
    } else {
      io.observe(el);
    }
  });
}

// Header background state. Uses the native scroll event rather than a
// ScrollTrigger, for the same robustness reason as above: Lenis scrolls the
// real window, so native scroll fires reliably, including after a jump.
export function initHeaderScrollState() {
  const header = document.querySelector('.header');
  if (!header) return;

  const update = () => header.classList.toggle('scrolled', window.scrollY > 20);
  update(); // correct on first paint, including when landing mid-page
  window.addEventListener('scroll', update, { passive: true });
}
