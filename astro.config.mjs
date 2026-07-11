import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL, BASE_PATH } from './src/consts.js';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: {
    // Emit /about/index.html rather than /about.html so URLs are clean and
    // canonical/sitemap entries match what's actually served.
    format: 'directory',
  },
});
