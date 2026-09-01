// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Hauptdomain (vom Kunden bestätigt): vzugshop.ch. elektrobreitenmoser.ch und
  // vzug-spezialist.ch sind Alias-Domains, die per DNS/Hosting-Redirect auf diese
  // Domain zeigen sollen (301, damit Google nur eine Version indexiert) - siehe
  // README.md "Domain & E-Mail". Dieser Wert steuert canonical-Tags, JSON-LD und
  // sitemap.xml.
  site: 'https://vzugshop.ch',
  vite: {
    plugins: [tailwindcss()]
  }
});