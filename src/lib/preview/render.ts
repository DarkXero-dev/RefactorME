// Render generated HTML to a PNG via an HTML-to-image service (ScreenshotOne).
// Avoids self-hosting a headless browser. Returns a base64 data URL so the
// screenshot key never reaches the visitor.
import { PreviewError } from './config';

export async function renderToImage(html: string, screenshotKey: string): Promise<string> {
  if (!screenshotKey) throw new PreviewError('config', 'missing SCREENSHOT_API_KEY');

  let res: Response;
  try {
    res = await fetch('https://api.screenshotone.com/take', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        access_key: screenshotKey,
        html,
        viewport_width: 1280,
        viewport_height: 800,
        full_page: true,
        format: 'png',
        block_cookie_banners: true,
        block_ads: true,
      }),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new PreviewError('render_failed', msg);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new PreviewError('render_failed', `screenshot status ${res.status} ${detail.slice(0, 200)}`);
  }

  const buf = await res.arrayBuffer();
  return `data:image/png;base64,${toBase64(buf)}`;
}

function toBase64(buf: ArrayBuffer): string {
  // Node (Vercel/Netlify functions) has Buffer; fall back to btoa elsewhere.
  if (typeof Buffer !== 'undefined') return Buffer.from(buf).toString('base64');
  let binary = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  // eslint-disable-next-line no-undef
  return btoa(binary);
}
