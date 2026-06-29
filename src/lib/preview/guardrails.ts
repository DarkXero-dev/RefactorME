// Abuse and cost controls. Every check here runs BEFORE any paid work (Claude
// or the screenshot service), so bad traffic costs nothing.
//
// Note: the rate-limit, daily-cap, and cache state is in-memory and therefore
// per-instance. On serverless it resets on cold starts and is not shared across
// concurrent instances, so it is a best-effort brake, not a hard global ledger.
// For a hard global cap, back these with a shared store (KV, Redis, D1). The
// in-memory version is documented in the README and is fine for a low-traffic
// one-person service.
import type { PreviewConfig } from './config';
import { PreviewError } from './config';

const HOUR = 60 * 60 * 1000;

const ipHits = new Map<string, number[]>(); // ip -> request timestamps (ms)
const cache = new Map<string, { image: string; ts: number }>(); // url -> cached image
let dayKey = '';
let dayCount = 0;

function today(now: number): string {
  // UTC day bucket. now is passed in so this stays testable.
  return new Date(now).toISOString().slice(0, 10);
}

export function checkRateLimit(ip: string, cfg: PreviewConfig, now: number): void {
  const cutoff = now - HOUR;
  const hits = (ipHits.get(ip) || []).filter((t) => t > cutoff);
  if (hits.length >= cfg.perIpHourly) {
    throw new PreviewError('rate_limited', 'per-ip hourly limit reached');
  }
  hits.push(now);
  ipHits.set(ip, hits);
}

export function checkDailyCap(cfg: PreviewConfig, now: number): void {
  const key = today(now);
  if (key !== dayKey) {
    dayKey = key;
    dayCount = 0;
  }
  if (dayCount >= cfg.dailyCap) {
    throw new PreviewError('daily_cap', 'global daily cap reached');
  }
  dayCount += 1;
}

export function cacheGet(url: string, cfg: PreviewConfig, now: number): string | null {
  const hit = cache.get(url);
  if (!hit) return null;
  if (now - hit.ts > cfg.cacheTtlHours * HOUR) {
    cache.delete(url);
    return null;
  }
  return hit.image;
}

export function cacheSet(url: string, image: string, now: number): void {
  cache.set(url, { image, ts: now });
}

// Verify a Cloudflare Turnstile token before doing any paid work.
export async function verifyTurnstile(
  token: string,
  secret: string,
  ip: string
): Promise<void> {
  if (!secret) throw new PreviewError('config', 'missing TURNSTILE_SECRET');
  if (!token) throw new PreviewError('bot_check', 'missing turnstile token');

  const form = new URLSearchParams();
  form.set('secret', secret);
  form.set('response', token);
  if (ip) form.set('remoteip', ip);

  let res: Response;
  try {
    res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new PreviewError('bot_check', msg);
  }

  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  if (!data.success) throw new PreviewError('bot_check', 'turnstile verification failed');
}
