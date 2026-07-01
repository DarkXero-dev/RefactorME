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
});
