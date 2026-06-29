// Generate a modernized homepage from extracted content, using Claude.
// Raw HTTPS call to /v1/messages (no SDK dependency, so the static draft build
// stays light). Uses the cheap Haiku tier since this runs on every click, caps
// output, and caches the stable system prompt across calls via cache_control.
import type { Extracted } from './extract';
import { PreviewError } from './config';

const MODEL = 'claude-haiku-4-5'; // cheapest current tier, fine for HTML generation
const MAX_TOKENS = 4000;

// Stable across every call, so it is a good cache_control breakpoint. Tuned to
// the site's current dark, cool dashboard identity (not the old gintsugi look).
const SYSTEM = `You are redesigning a small business homepage. You will be given the existing content extracted from their current site. Produce a single self-contained modern homepage as one HTML file with all CSS inline in a <style> tag.

Rules:
- Dark mode only, cool palette: slate, indigo, blue, cyan, violet, grey. No warm colours (no brown, gold, orange, red, pink, green, yellow).
- Clean, modern, dashboard-influenced editorial style. Generous spacing, strong type hierarchy, one tasteful accent.
- Keep the business's real content (name, what they do, real sections). Do not invent fake testimonials, fake stats, or false claims.
- Fully responsive. No external CSS or JS files, no frameworks, no <script> tags. A Google Fonts <link> is allowed.
- Output only the HTML document, starting with <!doctype html>. No commentary, no markdown fences.`;

export async function generateHomepage(content: Extracted, apiKey: string): Promise<string> {
  if (!apiKey) throw new PreviewError('config', 'missing ANTHROPIC_API_KEY');

  const userContent = [
    `Business type guess: ${content.businessType}`,
    `Title: ${content.title || '(none)'}`,
    `Description: ${content.description || '(none)'}`,
    `Headings: ${content.headings.join(' | ') || '(none)'}`,
    `Navigation: ${content.navLabels.join(', ') || '(none)'}`,
    `Brand colours seen: ${content.colors.join(', ') || '(none)'}`,
    `Body text excerpt: ${content.bodyText || '(none)'}`,
  ].join('\n');

  let res: Response;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        // system as a content-block array so the stable prompt can be cached
        system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
        messages: [
          {
            role: 'user',
            content: `Here is the existing site content. Redesign it.\n\n${userContent}`,
          },
        ],
      }),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new PreviewError('generate_failed', msg);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new PreviewError('generate_failed', `claude status ${res.status} ${detail.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
    stop_reason?: string;
  };
  const text = (data.content || [])
    .filter((b) => b.type === 'text' && b.text)
    .map((b) => b.text)
    .join('')
    .trim();

  if (!text) throw new PreviewError('generate_failed', 'empty model response');

  return stripFences(text);
}

// Strip any accidental markdown fences so the raw HTML can go straight to render.
function stripFences(s: string): string {
  let out = s.trim();
  if (out.startsWith('```')) {
    out = out.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '');
  }
  const i = out.toLowerCase().indexOf('<!doctype');
  return (i > 0 ? out.slice(i) : out).trim();
}
