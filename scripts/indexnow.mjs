// Submit this site's sitemap URLs to IndexNow (Bing, Yandex, Seznam, Naver).
//
// Google does NOT participate in IndexNow, so this only accelerates those engines
// (which is what feeds Bing-backed AI search like ChatGPT/Copilot). Google is still
// handled by the sitemap + "Request indexing" in Google Search Console.
//
// This is a static site — content only changes when the JSON is edited and redeployed.
// So run this AFTER a deploy that changed content:  npm run indexnow
//
// The key file (src/<KEY>.txt) must already be live at the domain root, or IndexNow
// will reject the submission when it fails to verify the key.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HOST = 'mawuli.thinks.work';
const KEY = '2155f677a1904aa18998a6254877e31c';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sitemap = await readFile(join(root, 'src', 'sitemap.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

if (urlList.length === 0) {
  console.error('No <loc> URLs found in src/sitemap.xml — nothing to submit.');
  process.exit(1);
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
});

// IndexNow replies 200 (accepted) or 202 (accepted, pending verification). Anything else is a fault.
console.log(`IndexNow -> ${res.status} ${res.statusText} for ${urlList.length} URL(s):`);
urlList.forEach((u) => console.log(`  ${u}`));

if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
