// Orchestrator for the site-preview generator. Runs the guardrails first, then
// fetch -> extract -> generate -> render, caching by URL. Any failure throws a
// PreviewError; the endpoint turns that into the single calm fallback message.
import { getConfig, PreviewError, type PreviewConfig } from './config';
import { normaliseUrl } from './urls';
import { fetchSite } from './fetch';
import { extractContent } from './extract';
import { generateHomepage } from './generate';
import { renderToImage } from './render';
import {
  checkRateLimit,
  checkDailyCap,
  cacheGet,
  cacheSet,
  verifyTurnstile,
} from './guardrails';

export interface PreviewInput {
  url: string;
  ip: string;
  turnstileToken: string;
  now: number;
  cfg?: PreviewConfig;
}

export interface PreviewResult {
  image: string; // base64 data URL
  cached: boolean;
}

export async function runPreview(input: PreviewInput): Promise<PreviewResult> {
  const cfg = input.cfg ?? getConfig();

  if (!cfg.enabled) {
    throw new PreviewError('disabled', 'preview feature is disabled');
  }

  // 1. Normalise + reject junk before anything else.
  const url = normaliseUrl(input.url);

  // 2. Cheap local checks that cost nothing.
  checkRateLimit(input.ip, cfg, input.now);
  checkDailyCap(cfg, input.now);

  // 3. Bot challenge (one network call, still before any paid work).
  await verifyTurnstile(input.turnstileToken, cfg.turnstileSecret, input.ip);

  // 4. Cache: return a recent render for the same URL instantly.
  const hit = cacheGet(url, cfg, input.now);
  if (hit) return { image: hit, cached: true };

  // 5. Fetch the visitor's site. Fails closed (no paid work on a dead input).
  const html = await fetchSite(url);

  // 6. Extract, generate, render.
  const content = extractContent(html);
  const homepage = await generateHomepage(content, cfg.anthropicKey);
  const image = await renderToImage(homepage, cfg.screenshotKey);

  // 7. Cache and return.
  cacheSet(url, image, input.now);
  return { image, cached: false };
}
