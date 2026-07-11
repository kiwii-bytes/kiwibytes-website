// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH FOR THE SITE'S IDENTITY AND URL.
//
// When you buy a custom domain (strongly recommended), change SITE_URL and
// BASE_PATH here -- canonical tags, Open Graph URLs and the sitemap all read
// from these.
//
//   Custom domain (e.g. https://kiwibytes.in):
//     SITE_URL  = 'https://kiwibytes.in'
//     BASE_PATH = '/'
//   ...and add a CNAME file in public/ + point DNS at GitHub Pages.
//
// ALSO UPDATE (these are static files and cannot import from here):
//   - public/robots.txt  -> the Sitemap: line
//   - public/llms.txt    -> the contact/URL references
// ---------------------------------------------------------------------------

export const SITE_URL = 'https://kiwii-bytes.github.io';
export const BASE_PATH = '/kiwibytes-website/';

export const SITE_NAME = 'Kiwi Bytes';
export const SITE_TAGLINE = 'Engineering Studio for Web, AI & Commerce';
export const SITE_DESCRIPTION =
  'Kiwi Bytes is a software engineering studio in Mumbai, India building web platforms, production AI agents, workflow automation, and Shopify & marketplace commerce systems.';

export const CONTACT_EMAIL = 'contact.kiwibytes@gmail.com';
export const LOCATION = 'Mumbai, India';

// Only list profiles that genuinely exist -- `sameAs` entries pointing at dead
// URLs actively hurt entity trust with search engines.
export const SOCIALS = {
  github: 'https://github.com/kiwii-bytes',
};

// The one real, publicly verifiable product. Reviewify and Nourish are in
// development and are presented as such -- see src/data/products.js.
export const WEBTARSUS_REPO = 'https://github.com/Aqib-Ansari';

// Turn on only when REAL client testimonials exist. Never populate this with
// invented quotes -- fabricated endorsements are illegal (FTC / India CPA-ASCI)
// and destroy the trust they're meant to build.
export const SHOW_TESTIMONIALS = false;

/** Prefix a root-relative path with the deploy base path. */
export function withBase(path = '/') {
  const clean = String(path).replace(/^\/+/, '');
  return `${BASE_PATH}${clean}`;
}

/** Absolute canonical URL for a given path. */
export function absoluteUrl(path = '/') {
  return new URL(withBase(path), SITE_URL).href;
}
