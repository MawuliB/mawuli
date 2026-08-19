// Build-time SEO guard. Runs AFTER `ng build` (production, prerendered) and
// fails the build if any indexable route regresses. The indexable set is read
// from src/sitemap.xml so this stays in sync with what we actually publish.
//
// Fails if a prerendered page has:
//   - any robots meta tag at all (indexable pages must never carry one)
//   - != 1 canonical, or a canonical that isn't the page's own absolute URL
//   - != 1 meta description
//   - != 1 <h1>
//   - JSON-LD that doesn't JSON.parse
//   - a suspiciously small rendered body (prerender produced an empty shell)

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(root, 'dist', 'mawuli', 'browser');
const ORIGIN = 'https://mawuli.thinks.work';
const MIN_BODY_TEXT = 500; // chars of visible text

const sitemap = await readFile(join(root, 'src', 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

const errors = [];
const fail = (path, msg) => errors.push(`[${path}] ${msg}`);

for (const url of urls) {
  const path = url.replace(ORIGIN, '') || '/';
  const file =
    path === '/' ? join(DIST, 'index.html') : join(DIST, path, 'index.html');

  if (!existsSync(file)) {
    fail(path, `prerendered file missing (${file}) — route was not prerendered`);
    continue;
  }

  const html = await readFile(file, 'utf8');
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? '';

  // Match robots meta STRUCTURALLY (by name attr), never by its value string.
  if (/<meta\s+[^>]*name=["']robots["'][^>]*>/i.test(html)) {
    fail(path, 'has a robots meta tag (indexable pages must not carry one)');
  }

  const canon = [...html.matchAll(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi)];
  if (canon.length !== 1) {
    fail(path, `expected 1 canonical, found ${canon.length}`);
  } else {
    const href = canon[0][0].match(/href=["']([^"']+)["']/i)?.[1] ?? '';
    if (href !== url) fail(path, `canonical is "${href}", expected "${url}"`);
  }

  const desc = [...html.matchAll(/<meta\s+[^>]*name=["']description["'][^>]*>/gi)];
  if (desc.length !== 1) fail(path, `expected 1 meta description, found ${desc.length}`);

  const h1 = [...body.matchAll(/<h1[\s>]/gi)];
  if (h1.length !== 1) fail(path, `expected 1 <h1>, found ${h1.length}`);

  for (const m of html.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  )) {
    try {
      JSON.parse(m[1].trim());
    } catch (e) {
      fail(path, `JSON-LD does not parse: ${e.message}`);
    }
  }

  const text = body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length < MIN_BODY_TEXT) {
    fail(path, `rendered body text suspiciously small (${text.length} chars) — empty shell?`);
  }
}

if (errors.length) {
  console.error(`\n✗ SEO assertions FAILED (${errors.length}):`);
  errors.forEach((e) => console.error('  ' + e));
  process.exit(1);
}
console.log(`✓ SEO assertions passed for ${urls.length} indexable route(s).`);
