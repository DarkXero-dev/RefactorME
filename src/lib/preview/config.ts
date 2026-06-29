// Central config for the site-preview generator.
// Reads from import.meta.env (build) and process.env (serverless runtime).
// Every value has a safe default so importing this never throws.

type AnyEnv = Record<string, string | undefined>;

function readEnv(): AnyEnv {
  const meta = (import.meta as unknown as { env?: AnyEnv }).env ?? {};
  const proc = typeof process !== 'undefined' && process.env ? process.env : {};
  // runtime (process.env) wins over build-time values
  return { ...meta, ...proc };
}

export interface PreviewConfig {
  enabled: boolean;
  anthropicKey: string;
  screenshotKey: string;
  turnstileSecret: string;
  dailyCap: number;
  perIpHourly: number;
  cacheTtlHours: number;
}

export function getConfig(env: AnyEnv = readEnv()): PreviewConfig {
  const num = (v: string | undefined, d: number) => {
    const n = parseInt(v ?? '', 10);
    return Number.isFinite(n) ? n : d;
  };
  return {
    enabled: (env.PREVIEW_ENABLED ?? 'false').toLowerCase() === 'true',
    anthropicKey: env.ANTHROPIC_API_KEY ?? '',
    screenshotKey: env.SCREENSHOT_API_KEY ?? '',
    turnstileSecret: env.TURNSTILE_SECRET ?? '',
    dailyCap: num(env.DAILY_GENERATE_CAP, 100),
    perIpHourly: num(env.PER_IP_HOURLY_LIMIT, 3),
    cacheTtlHours: num(env.CACHE_TTL_HOURS, 24),
  };
}

// The one message a visitor ever sees on any failure. Turns a dead end
// into a lead. No em dashes.
export const FALLBACK_MESSAGE =
  'We could not get a clean read on that site automatically. Email the URL to hello@refactor.me and we will mock up a preview by hand.';

export class PreviewError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'PreviewError';
  }
}
