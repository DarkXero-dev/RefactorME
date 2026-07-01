// POST /api/preview : the site-preview generator endpoint.
//
// Draft mode (GitHub Pages, the default): the site builds as a static export,
// so this route is prerendered to a harmless GET stub and the POST logic is not
// reachable. The front-end button is inert while PREVIEW_ENABLED is false, so
// nothing calls this and nothing is spent.
//
// Live mode: build with SERVER_BUILD=1 and a server adapter (see astro.config.mjs).
// Then prerender is false, this is a real server endpoint, and with
// PREVIEW_ENABLED=true the POST path runs for real.
import type { APIRoute } from 'astro';
import { runPreview } from '../../lib/preview';
import { getConfig, FALLBACK_MESSAGE, PreviewError } from '../../lib/preview/config';

// Static (draft) build => prerender (GET stub only). Server build => live endpoint.
const serverBuild =
  (import.meta as { env?: Record<string, string | undefined> }).env?.SERVER_BUILD ??
  (typeof process !== 'undefined' ? process.env.SERVER_BUILD : undefined);
export const prerender = serverBuild !== '1';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function clientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || request.headers.get('cf-connecting-ip') || 'unknown';
}

export const GET: APIRoute = () =>
  json({ ok: false, error: 'method', message: 'POST a {"url"} to use the preview generator.' }, 405);

export const POST: APIRoute = async ({ request }) => {
  const cfg = getConfig();

  // Hard off-switch. In draft mode the front-end never calls this anyway.
  if (!cfg.enabled) {
    return json({ ok: false, error: 'disabled', message: 'Live preview coming soon.' }, 503);
  }

  let body: { url?: string; turnstileToken?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, error: 'bad_request', message: FALLBACK_MESSAGE }, 400);
  }

  try {
    const result = await runPreview({
      url: body.url || '',
      ip: clientIp(request),
      turnstileToken: body.turnstileToken || '',
      now: Date.now(),
      cfg,
    });
    return json({ ok: true, image: result.image, cached: result.cached });
  } catch (err) {
    const code = err instanceof PreviewError ? err.code : 'error';
    // Friendly, specific message for the limits; the calm fallback for the rest.
    if (code === 'rate_limited' || code === 'daily_cap') {
      return json(
        {
          ok: false,
          error: code,
          message:
            'The preview tool is resting for now. Email the URL to hello@refaktor.me and we will mock up a preview by hand.',
        },
        429
      );
    }
    if (code === 'bot_check') {
      return json({ ok: false, error: 'bot_check', message: 'Please try that once more.' }, 400);
    }
    // unreadable site, blocked fetch, model/render error, bad url, etc.
    return json({ ok: false, error: 'fallback', message: FALLBACK_MESSAGE }, 200);
  }
};
