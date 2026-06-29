// @ts-check
import { defineConfig } from 'astro/config';

// Two build modes, selected by the SERVER_BUILD env var:
//
//   (default)        Static export for the GitHub Pages DRAFT.
//                    base = '/refactor-me/'. The preview API route is
//                    prerendered to a harmless stub; the button is inert.
//
//   SERVER_BUILD=1   Server build for the LIVE deploy (Vercel by default),
//                    where the /api/preview endpoint runs for real. Requires
//                    `npm i @astrojs/vercel`. See README "Going live".
//
// Moving to a custom root domain on GitHub Pages later: set base to '/'.
const serverBuild = process.env.SERVER_BUILD === '1';

let adapter;
if (serverBuild) {
  // Imported only in server mode, so the draft build does not need the package.
  const vercel = (await import('@astrojs/vercel')).default;
  adapter = vercel();
}

export default defineConfig({
  // base must match the GitHub repo name exactly (case-sensitive).
  // Repo: https://github.com/DarkXero-dev/ReafactorME
  // Live draft URL: https://darkxero-dev.github.io/ReafactorME/
  site: serverBuild ? 'https://refactor.me' : 'https://darkxero-dev.github.io',
  base: serverBuild ? '/' : '/ReafactorME/',
  output: serverBuild ? 'server' : 'static',
  adapter,
  trailingSlash: 'ignore',
  vite: {
    server: {
      allowedHosts: ['crucial-painted-mar-converter.trycloudflare.com'],
    },
  },
});
