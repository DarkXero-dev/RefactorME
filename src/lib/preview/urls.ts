// URL validation and normalisation. Block obvious junk, localhost, and
// private network ranges before any paid work happens.
import { PreviewError } from './config';

export function normaliseUrl(raw: string): string {
  let s = (raw || '').trim();
  if (!s) throw new PreviewError('bad_url', 'empty url');
  if (s.length > 2048) throw new PreviewError('bad_url', 'url too long');
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    throw new PreviewError('bad_url', 'not a valid url');
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new PreviewError('bad_url', 'only http and https are allowed');
  }
  if (isBlockedHost(u.hostname)) {
    throw new PreviewError('bad_url', 'that host is not allowed');
  }
  // hostname must have a dot (reject bare names) unless it is an explicit IP
  if (!u.hostname.includes('.') && !u.hostname.includes(':')) {
    throw new PreviewError('bad_url', 'that does not look like a public site');
  }
  u.hash = '';
  return u.toString();
}

export function isBlockedHost(host: string): boolean {
  const h = host.toLowerCase().replace(/^\[|\]$/g, '');
  if (h === 'localhost' || h.endsWith('.localhost')) return true;
  if (h === '::1' || h.startsWith('fc') || h.startsWith('fd') || h.startsWith('fe80')) return true;
  // IPv4 private / loopback / link-local / metadata ranges
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [parseInt(m[1], 10), parseInt(m[2], 10)];
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 169 && b === 254) return true; // link-local + cloud metadata
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a >= 224) return true; // multicast / reserved
  }
  return false;
}
