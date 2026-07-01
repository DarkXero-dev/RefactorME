// Server-side fetch of the visitor's site. Short timeout, follow redirects,
// HTML only, size capped. Any problem becomes a PreviewError so the caller
// can stop before spending money on Claude or the screenshot service.
import { PreviewError } from './config';

const UA =
  'Mozilla/5.0 (compatible; RefaktorMePreviewBot/1.0; +https://refaktor.me)';

export async function fetchSite(
  url: string,
  opts: { timeoutMs?: number; maxBytes?: number } = {}
): Promise<string> {
  const timeoutMs = opts.timeoutMs ?? 8000;
  const maxBytes = opts.maxBytes ?? 2_000_000;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' },
    });
    if (!res.ok) throw new PreviewError('fetch_failed', `upstream status ${res.status}`);
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (!ct.includes('text/html') && !ct.includes('application/xhtml')) {
      throw new PreviewError('not_html', `content-type ${ct || 'unknown'}`);
    }
    const buf = await res.arrayBuffer();
    if (buf.byteLength > maxBytes) {
      throw new PreviewError('too_large', `response ${buf.byteLength} bytes`);
    }
    const html = new TextDecoder('utf-8').decode(buf);
    if (!html || html.length < 200) throw new PreviewError('empty', 'page had no usable html');
    return html;
  } catch (err) {
    if (err instanceof PreviewError) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    throw new PreviewError('fetch_failed', msg);
  } finally {
    clearTimeout(timer);
  }
}
