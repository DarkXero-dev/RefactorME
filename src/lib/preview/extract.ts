// Defensive, dependency-free extraction from raw HTML. Regex based so it
// runs anywhere serverless. Missing fields are normal, never throw.

export interface Extracted {
  title: string;
  description: string;
  headings: string[];
  bodyText: string;
  navLabels: string[];
  images: string[];
  colors: string[];
  businessType: string;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
}
function strip(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}
function all(re: RegExp, html: string, group = 1): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const v = (m[group] || '').trim();
    if (v) out.push(v);
  }
  return out;
}

const TYPES: Array<[string, RegExp]> = [
  ['cafe or restaurant', /\b(cafe|café|coffee|restaurant|pizza|menu|bakery|bar|bistro|kitchen|dining)\b/i],
  ['shop', /\b(shop|store|buy|cart|product|checkout|boutique)\b/i],
  ['tradesperson', /\b(plumb|electric|builder|roofing|carpenter|handyman|contractor|repair)\b/i],
  ['salon or studio', /\b(salon|barber|spa|tattoo|studio|fitness|gym|yoga|pilates)\b/i],
  ['portfolio', /\b(portfolio|photographer|designer|illustrator|artist|work|projects)\b/i],
  ['professional services', /\b(law|legal|account|consult|clinic|dental|agency|advisor)\b/i],
];

export function extractContent(html: string): Extracted {
  const head = html.slice(0, 60000);

  const title =
    strip((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '') ||
    strip((html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i) || [])[1] || '');

  const description =
    (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i) || [])[1] ||
    (html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)/i) || [])[1] || '';

  const headings = all(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi, html)
    .map(strip).filter(Boolean).slice(0, 10);

  const paras = all(/<p[^>]*>([\s\S]*?)<\/p>/gi, html).map(strip).filter((t) => t.length > 30);
  const bodyText = paras.join(' ').slice(0, 1200);

  const navLabels = Array.from(
    new Set(all(/<a[^>]*>([\s\S]*?)<\/a>/gi, html).map(strip).filter((t) => t.length > 1 && t.length < 24))
  ).slice(0, 12);

  const images = Array.from(
    new Set(all(/<img[^>]+src=["']([^"']+)["']/gi, html))
  ).filter((s) => /^https?:\/\//i.test(s)).slice(0, 8);

  const colors = Array.from(new Set(all(/#([0-9a-f]{6}|[0-9a-f]{3})\b/gi, head, 0))).slice(0, 8);

  const hay = (title + ' ' + description + ' ' + headings.join(' ') + ' ' + navLabels.join(' ') + ' ' + bodyText).toLowerCase();
  const businessType = (TYPES.find(([, re]) => re.test(hay)) || ['small business', /.*/])[0] as string;

  return { title: decodeEntities(title), description: decodeEntities(description), headings, bodyText, navLabels, images, colors, businessType };
}
