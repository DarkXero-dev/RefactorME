// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages deploy for the custom domain refaktor.me.
// Repo: https://github.com/DarkXero-dev/RefactorME
// Served at the domain root via GitHub Pages custom domain,
// so base is '/' (not '/RefactorME/').
export default defineConfig({
  site: 'https://refaktor.me',
  base: '/',
  output: 'static',
  trailingSlash: 'ignore',
  // Astro 7 changed compressHTML default to 'jsx', which strips whitespace
  // between inline elements (collapsed "including<a>X</a>and"). true keeps
  // minification without eating significant spaces in prose.
  compressHTML: true,
  vite: {
    server: {
      allowedHosts: ['gay-temperatures-armstrong-recording.trycloudflare.com'],
    },
  },
});
