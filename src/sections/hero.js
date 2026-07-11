import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/lenis-gsap.js';

function splitIntoChars(line) {
  const text = line.textContent;
  line.textContent = '';
  const frag = document.createDocumentFragment();
  text.split('').forEach((char) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? ' ' : char;
    span.style.display = 'inline-block';
    frag.appendChild(span);
  });
  line.appendChild(frag);
  return line.querySelectorAll('.char');
}

function animateCounter(el) {
  const raw = el.textContent.trim();
  // Compound/range values like "10–20x" would misparse under a naive
  // digit-strip (the two numbers concatenate into one bogus target) -- skip
  // the count-up for those and just let them appear via the parent reveal.
  if (/\d[^\d.]+\d/.test(raw)) return;

  const numeric = parseFloat(raw.replace(/[^0-9.]/g, ''));
  const suffix = raw.replace(/^[^0-9]*[0-9.]+/, '');
  const prefix = raw.match(/^[^0-9]*/)[0];

  const counter = { val: 0 };
  gsap.to(counter, {
    val: numeric,
    duration: 1.4,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = `${prefix}${Math.round(counter.val)}${suffix}`;
    },
    onComplete: () => {
      el.textContent = raw;
    },
  });
}

export function initHero() {
  const hero = document.getElementById('hero-section');
  if (!hero) return; // only the homepage has the animated hero

  // The gradient line relies on `background-clip: text` against its own
  // direct text content -- splitting it into per-char spans breaks that
  // rendering technique, so it's animated as a single block instead.
  const splitLines = hero.querySelectorAll('.hero-line:not(.gradient-text)');
  const gradientLine = hero.querySelector('.hero-line.gradient-text');
  const otherEls = hero.querySelectorAll('.hero-subtitle, .hero-actions, .hero-stats, .hero-tag');
  const stats = hero.querySelectorAll('.stat-num');
  const scrollCue = hero.querySelector('.scroll-cue');

  if (prefersReducedMotion) {
    return; // content is visible by default; skip entrance/exit choreography entirely
  }

  const charGroups = Array.from(splitLines).map(splitIntoChars);

  gsap.set(charGroups.flatMap((g) => Array.from(g)), { yPercent: 120, opacity: 0 });
  gsap.set(gradientLine, { y: 24, opacity: 0 });
  gsap.set(otherEls, { y: 24, opacity: 0 });
  gsap.set(scrollCue, { opacity: 0 });

  const tl = gsap.timeline({ delay: 0.3 });
  charGroups.forEach((chars, i) => {
    tl.to(chars, {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.018,
    }, i * 0.12);
  });
  tl.to(gradientLine, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, charGroups.length * 0.12);
  tl.to(otherEls, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, '-=0.4');
  tl.to(scrollCue, { opacity: 1, duration: 0.6 }, '-=0.2');
  tl.call(() => stats.forEach(animateCounter), [], '-=0.3');

  // Authored exit as the user scrolls away, instead of an abrupt cut.
  gsap.to(hero.querySelector('.hero-container'), {
    y: -80,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}
