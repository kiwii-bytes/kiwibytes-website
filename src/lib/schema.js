// JSON-LD builders. Structured data is how search engines and LLMs identify
// *what this company is* as an entity, rather than guessing from prose.
//
// Rule for this file: never assert anything here that isn't true on the site.
// Fake aggregateRating/review markup is exactly what gets a site manually
// penalised, on top of being an illegal fake endorsement.
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  CONTACT_EMAIL,
  LOCATION,
  SOCIALS,
  absoluteUrl,
} from '../consts.js';

const ORG_ID = `${SITE_URL}/#organization`;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: SITE_NAME,
    alternateName: 'Kiwibytes',
    url: absoluteUrl('/'),
    logo: absoluteUrl('kiwi-logo.png'),
    image: absoluteUrl('og-image.png'),
    description: SITE_DESCRIPTION,
    email: CONTACT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    areaServed: 'Worldwide',
    knowsAbout: [
      'Web application development',
      'AI agents and LLM integration',
      'Retrieval-Augmented Generation (RAG)',
      'Workflow automation and n8n',
      'Robotic Process Automation (RPA)',
      'Shopify development',
      'Marketplace API integration',
      'Cloud infrastructure and DevOps',
    ],
    sameAs: Object.values(SOCIALS),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: absoluteUrl('/'),
    description: SITE_DESCRIPTION,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  };
}

/** Breadcrumbs: [{ name, path }] — path is root-relative, e.g. '/services'. */
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** FAQ: [{ q, a }] — powers answer-engine (AEO) results. */
export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/** Service offering: [{ name, description }] */
export function serviceSchema(services) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.name,
        description: s.description,
        provider: { '@id': ORG_ID },
        areaServed: 'Worldwide',
      },
    })),
  };
}

export function blogPostingSchema({ title, description, slug, publishDate, updatedDate, tags = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url: absoluteUrl(`/blog/${slug}`),
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(`/blog/${slug}`) },
    datePublished: new Date(publishDate).toISOString(),
    ...(updatedDate ? { dateModified: new Date(updatedDate).toISOString() } : {}),
    // The team is intentionally not named publicly, so the organization is the
    // author of record. Claiming a fictional individual author would be a lie
    // and would fail E-E-A-T scrutiny anyway.
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    image: absoluteUrl('og-image.png'),
    keywords: tags.join(', '),
    inLanguage: 'en',
  };
}

export { LOCATION };
