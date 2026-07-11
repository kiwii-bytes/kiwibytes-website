// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH FOR SITE CONTENT.
// Used by the homepage, the detail pages, AND the JSON-LD schema, so a claim
// can never drift out of sync between what a human reads and what a crawler
// reads.
//
// HONESTY RULES BAKED INTO THIS FILE (agreed with the team):
//  * Kiwi Bytes has no clients yet -> no testimonials, no client logos, and no
//    outcome presented as a Kiwi Bytes delivery.
//  * The engineers are still employed elsewhere -> we claim their SKILLS
//    (which are theirs), never the employer's confidential business results
//    (revenue figures, client brands, internal metrics).
//  * Reviewify and Nourish are NOT live -> they are labelled in-development,
//    with no invented performance metrics. WebTarsus is real and linkable.
// ---------------------------------------------------------------------------

/** Hero stats — every one of these is a capability the engineers actually have. */
export const HERO_STATS = [
  { value: '20+', label: 'Shopify stores shipped' },
  { value: '80+', label: 'Hours/day of manual work automated' },
  { value: '10+', label: 'Marketplace & payment APIs integrated' },
];

// Shown under the stats so nobody mistakes an engineer's track record for a
// Kiwi Bytes client outcome. Being upfront here is what makes the rest credible.
export const STATS_DISCLAIMER =
  "Our engineers' track record, built across years of production e-commerce and automation work.";

export const SERVICES = [
  {
    id: 'web',
    num: '01',
    name: 'Premium Web Engineering',
    short: 'Fast, modern web platforms built with Next.js and React — engineered for conversion, not just looks.',
    description:
      'Custom web platforms and frontends built on Next.js and React, tuned for Core Web Vitals, SEO and conversion rather than just visual polish.',
    bullets: [
      'Next.js & modern SPA architecture',
      'Performance-first, responsive by default',
      'SEO and web-vitals tuned',
    ],
    detail: [
      'We build the storefront, dashboard or marketing site as a real engineering project: typed components, sensible state, and a build that stays fast as the codebase grows.',
      'Performance is a requirement, not a nice-to-have. Slow pages cost conversions, so we treat Core Web Vitals as an acceptance criterion.',
    ],
    icon: 'code',
  },
  {
    id: 'app',
    num: '02',
    name: 'Bespoke App Development',
    short: 'Cross-platform apps with native-grade feel, from first sprint to app-store release.',
    description:
      'Cross-platform mobile and desktop applications with offline-first sync and native-grade interaction quality.',
    bullets: ['iOS, Android & cross-platform', 'Offline-first sync', 'Seamless system integration'],
    detail: [
      'Apps that hold up outside the demo: real offline behaviour, real sync-conflict handling, real error states.',
      'We integrate with the systems you already run — your database, your ERP, your payment stack — instead of asking you to change how you work.',
    ],
    icon: 'phone',
  },
  {
    id: 'ai',
    num: '03',
    name: 'Custom AI & LLM Integrations',
    short: 'Production RAG pipelines and multi-agent systems — not demos.',
    description:
      'Production retrieval-augmented generation (RAG) pipelines and LLM integrations over your own data, with evaluation and cost control.',
    bullets: [
      'RAG over your own data',
      'Multi-agent orchestration (LangChain, LangGraph)',
      'Secure API gateways & usage governance',
    ],
    detail: [
      'A RAG demo takes an afternoon. A RAG system that survives real users takes evaluation, chunking that suits your documents, guardrails, and a cost ceiling that does not surprise you at the end of the month.',
      'We have built conversational database agents and text-to-SQL layers that let non-technical staff query multi-table schemas in plain English.',
    ],
    icon: 'sparkle',
  },
  {
    id: 'agents',
    num: '04',
    name: 'Autonomous AI Agents',
    short: 'Agentic workflows that take entire manual processes off your team’s plate.',
    description:
      'Agentic workflows and robotic process automation (RPA) that remove repetitive manual operations work.',
    bullets: [
      'n8n & custom agent workflows',
      'Self-healing tasks & feedback loops',
      '24/7 autonomous data entry',
    ],
    detail: [
      'Our engineers have automated 80+ hours of manual work per day using n8n, Python RPA and scheduled agents — reconciliation, listing updates, data entry, report generation.',
      'Agents fail. We build them to fail loudly and recover, with retries, alerting and a human-in-the-loop path, rather than silently corrupting your data.',
    ],
    icon: 'agents',
  },
  {
    id: 'cloud',
    num: '05',
    name: 'Scalable Cloud & DevOps',
    short: 'AWS infrastructure built to survive growth, not just launch day.',
    description:
      'AWS cloud architecture, CI/CD and infrastructure-as-code designed to stay stable as traffic grows.',
    bullets: ['AWS: S3, Lambda, CloudFront, EC2', 'CI/CD & infrastructure as code', 'Monitoring wired in from day one'],
    detail: [
      'S3, Lambda, CloudFront, EC2 and CloudWatch, wired together with CI/CD so deploys are boring and reversible.',
      'Monitoring and alerting are part of the build, not a follow-up ticket. If it breaks at 2am, someone should know before your customers do.',
    ],
    icon: 'cloud',
  },
  {
    id: 'shopify',
    num: '06',
    name: 'Shopify & E-Commerce Systems',
    short: 'Storefronts, marketplace integrations and the automation that holds them together.',
    description:
      'Shopify storefronts, custom apps, and Amazon/eBay/Walmart marketplace integrations, plus the order and reconciliation automation behind them.',
    bullets: [
      'Custom themes & headless storefronts',
      'Marketplace integrations: Amazon, eBay, Walmart',
      'Checkout, fulfilment & reconciliation automation',
    ],
    detail: [
      'Our engineers have shipped 20+ Shopify stores and integrated Amazon SP-API, eBay, Walmart, Mirakl and PayPal — order sync, inventory sync, fulfilment tracking, refunds and reconciliation.',
      'The storefront is the easy half. The hard half is everything behind it staying consistent across channels — that is the part we specialise in.',
    ],
    icon: 'bag',
  },
];

/** Honest capability proof. No employer names, no confidential figures. */
export const CAPABILITIES = [
  {
    stat: '20+',
    title: 'Shopify stores shipped',
    body: 'Built from scratch and launched — custom themes, headless storefronts, custom apps, and the order/inventory automation behind them.',
  },
  {
    stat: '80+',
    title: 'Hours/day of manual work automated',
    body: 'Reconciliation, listing updates, logistics status, bulk refunds and data entry replaced with n8n workflows, Python RPA and scheduled agents.',
  },
  {
    stat: '10+',
    title: 'Marketplace & payment APIs integrated',
    body: 'Amazon SP-API, eBay, Walmart, Mirakl, AbeBooks, PayPal and more — order ingestion, listing publication and refund automation.',
  },
  {
    stat: 'Production',
    title: 'AI systems, not demos',
    body: 'Multi-agent frameworks on LangChain/LangGraph, RAG over relational data, and text-to-SQL agents that non-technical staff actually use.',
  },
];

/**
 * Products. `status` is enforced honestly:
 *  - 'live'         -> real, publicly verifiable
 *  - 'in-development' -> NOT shipped. No performance metrics may be claimed.
 */
export const PRODUCTS = [
  {
    name: 'WebTarsus',
    tagline: 'Open-source browser automation',
    status: 'live',
    statusLabel: 'Live · Open source',
    description:
      'A Chrome extension and FastAPI backend that turn plain-English instructions into real browser automation, using WebSockets and LangGraph agents.',
    detail:
      'Record complex browser tasks, map CSV parameters onto them, and let autonomous agents run them. Built with FastAPI, WebSockets, a Manifest V3 extension and LangGraph.',
    proof: 'Public source code — inspect it yourself.',
    icon: 'cursor',
  },
  {
    name: 'Reviewify',
    tagline: 'Google reviews automation',
    status: 'in-development',
    statusLabel: 'In development',
    description:
      'Reads new Google Business reviews, scores sentiment, and drafts contextual replies in your brand voice for approval.',
    detail:
      'Currently in active development. We are building it on the same agent stack we use for client work — when it ships, the numbers we publish here will be measured, not estimated.',
    proof: null,
    icon: 'chat',
  },
  {
    name: 'Nourish',
    tagline: 'AI nutrition engine',
    status: 'in-development',
    statusLabel: 'In development',
    description:
      'A mobile vision model that estimates macronutrients from a photo of a meal and generates matching recipe suggestions.',
    detail:
      'Currently in active development. Accuracy figures will be published once the model is evaluated on a real held-out dataset — not before.',
    proof: null,
    icon: 'leaf',
  },
];

export const PROCESS = [
  {
    num: '01',
    title: 'Scope & Architect',
    body: 'Data models, architecture and security decided before a line of code ships. You get the plan in writing.',
  },
  {
    num: '02',
    title: 'Bespoke Design',
    body: 'Interfaces designed to convert, not just to look good. You see the design before we build it.',
  },
  {
    num: '03',
    title: 'Parallel Iteration',
    body: 'Built in parallel across isolated environments, reviewed continuously. You see progress weekly, not at the end.',
  },
  {
    num: '04',
    title: 'Production Release',
    body: 'Zero-downtime launch with monitoring and alerting wired in from day one — plus a handover you can actually maintain.',
  },
];

/**
 * FAQs. These are the AEO engine: answer engines and LLMs lift short, direct,
 * self-contained answers. Every answer here must be one we'd actually stand
 * behind on a sales call.
 */
export const FAQS = [
  {
    q: 'What does Kiwi Bytes do?',
    a: 'Kiwi Bytes is a software engineering studio based in Mumbai, India. We build custom web platforms, mobile and desktop apps, production AI agents and LLM/RAG integrations, workflow automation, cloud infrastructure, and Shopify and marketplace commerce systems.',
  },
  {
    q: 'How much does a project cost?',
    a: 'Most engagements fall into three bands: Starter (under ₹50,000) for a focused build or automation, Growth (₹50,000–₹2,00,000) for a full storefront, app or AI integration, and Enterprise (₹2,00,000+) for multi-system platform work. Use the Project Builder for a scoped estimate within one business day.',
  },
  {
    q: 'How long does a typical project take?',
    a: 'A focused automation or landing build typically takes 1–3 weeks. A full Shopify storefront or a production AI integration usually runs 4–8 weeks. Multi-system platform work runs longer. We give you a written timeline during scoping, before any code is written.',
  },
  {
    q: 'Do you work with early-stage startups?',
    a: 'Yes. We are a new studio ourselves, so we are set up for small, fast, tightly scoped engagements as well as larger builds. If your budget is genuinely too small for what you need, we will say so rather than take the work and under-deliver.',
  },
  {
    q: 'Have you worked with clients before?',
    a: 'Kiwi Bytes is a new studio and is taking on its first client engagements now. Our engineers, however, have years of production experience — 20+ Shopify stores shipped, 80+ hours/day of manual work automated, and 10+ marketplace and payment APIs integrated. We are upfront about which is which.',
  },
  {
    q: 'What is RAG, and do I actually need it?',
    a: 'RAG (retrieval-augmented generation) lets a language model answer using your own documents or database instead of only its training data. You need it when answers must be grounded in your content — support docs, product catalogues, internal policies. You do not need it for generic writing tasks.',
  },
  {
    q: 'Can you automate work we currently do manually?',
    a: 'Usually, yes. Repetitive, rule-based work with a clear input and output — reconciliation, listing updates, data entry, report generation, refund processing — is the sweet spot. Our engineers have removed 80+ hours of manual work per day using n8n, Python RPA and scheduled agents.',
  },
  {
    q: 'Where are you based, and do you work remotely?',
    a: 'We are based in Mumbai, India, and we work with clients remotely worldwide. Communication is async-first with scheduled check-ins, so time zones are not a blocker.',
  },
];
