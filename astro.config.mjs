import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Final custom domain — set before generating sitemap/canonical URLs.
export default defineConfig({
  site: 'https://www.neurodata-master.org',
  integrations: [sitemap()],
  redirects: {
    // Wix "Gallery" menu slug redirects to About, same as on the Wix site
    '/blank-1': '/about',
  },
});
