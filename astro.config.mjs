// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // TODO: Domain (mit/ohne "www.") vor Launch mit dem Kunden bestätigen.
  // ANFORDERUNGEN.md nennt nur "elektrobreitenmoser.ch" (Plesk-Setup noch offen);
  // aktuelle Test-URL ist https://vzug.saxer.sg. Dieser Wert steuert
  // canonical-Tags, JSON-LD und sitemap.xml.
  site: 'https://www.elektrobreitenmoser.ch',
  vite: {
    plugins: [tailwindcss()]
  }
});