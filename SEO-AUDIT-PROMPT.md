<!--
Reusable SEO audit + fix prompt for any web project.
HOW TO USE: fill in the two placeholders in the CONTEXT block, then paste everything
inside the ``` fence below into the assistant on the target project. Portable across repos.
-->

# SEO Audit Prompt (portable)

Fill in `{{PRIMARY_DOMAIN}}` and `{{OLD_DOMAINS}}`, then paste the block below:

````text
Audit and optimize the SEO for this website end to end, then hand me the off-site steps.
Make the code edits yourself — don't just report — but ask before changing anything
user-facing (brand name, copy, prices, product wording).

CONTEXT (fill these in):
- Primary domain (the ONE canonical URL, https): {{PRIMARY_DOMAIN e.g. https://example.thinks.work}}
- Old/secondary domains that should redirect to it: {{OLD_DOMAINS or "none"}}
- The site may have multiple sections — e.g. a portfolio/content area AND a shop/e-commerce
  area. Cover ALL of them, applying the right structured data to each.

FIRST, DISCOVER (read the code, don't assume):
- Detect the framework, router, build tool, and how it's deployed/hosted.
- Find where <head>, routes, robots.txt, sitemap.xml, and static assets live.
- Grep the whole repo for hardcoded URLs and flag any that don't match the primary domain
  (stale domains, http://, localhost, staging, trailing-slash inconsistencies).

*** RENDERING — CHECK THIS FIRST, IT'S THE ONE THAT ACTUALLY BREAKS INDEXING ***
- Determine whether the site is client-side rendered (SPA) or server-rendered/prerendered.
- Fetch the primary URL and inspect the RAW HTML before JS runs. If the <body> is basically
  empty (just a root element) and the real content only appears after JavaScript:
    - Google will usually still index it (it renders JS), BUT
    - Bingbot renders JS poorly, and most AI crawlers (ChatGPT/Perplexity/etc.) don't run JS
      at all — so they see an empty page and won't index or surface the site.
  - If content depends on JS, recommend SSR or prerendering (SSG). For static, data-driven
    sites with known routes, prefer PRERENDERING — it emits real static HTML per route with
    no server needed. Explain the trade-off before making a big change; then offer to do it.

THEN CHECK & FIX IN CODE:
1. Canonical: exactly one <link rel="canonical"> per page, and it must equal THAT page's own
   absolute URL — verify on EVERY route, not just the homepage.
   PRERENDER TRAP (this one silently costs sub-page indexing): when you prerender an SPA, the
   per-route <title> bakes automatically (the router sets it), BUT a static canonical / og:url /
   meta description sitting in index.html gets copied VERBATIM into every prerendered route — so
   every page canonicalizes to the homepage and Google drops the sub-pages as duplicates of "/".
   Fix with a tiny service that sets title + description + canonical + og/twitter PER ROUTE on
   each navigation (Angular: subscribe to NavigationEnd, update Title + Meta + the canonical
   <link> from the deepest route's data — it runs during prerender so the tags bake into each
   route's HTML). Next.js: generateMetadata()/alternates.canonical per route handles this.
2. robots.txt: exists, references the sitemap URL, and allows normal crawlers AND AI crawlers
   (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended) — don't block them.
3. sitemap.xml: exists, lists every indexable route across ALL sections (content pages AND
   shop/category/product pages), uses the primary domain, has <lastmod>. If URLs are many or
   dynamic, GENERATE it from data and split into a sitemap index if large.
4. Per-page <title> and <meta name="description"> — unique and descriptive, including shop
   category and product pages, not just the homepage.
5. Open Graph + Twitter Card tags with ABSOLUTE image URLs on the primary domain.
6. Structured data (JSON-LD), matched to each section, and valid JSON:
   - Personal/portfolio: Person or Organization + sameAs links to social profiles.
   - Content/articles: Article / CreativeWork / BreadcrumbList.
   - Shop: Product + Offer (price, currency, availability), AggregateRating/Review if present,
     BreadcrumbList on product/category pages, and a WebSite entry with SearchAction if there's
     site search.
7. Semantic HTML: one <h1> per page, meaningful headings, alt text on images.
8. Consistency: zero leftover references to old domains anywhere (meta, JSON-LD, sitemap, links).
9. meta keywords: Google IGNORES this tag — add a modest one only if I ask; real keyword
   signals come from title/h1/description/body/structured data.
10. Add a slot/file for a Google Search Console verification token so it's ready.

ROBOTS / NOINDEX (the class of bug that quietly kills indexing):
- No indexable page should carry ANY robots meta. A page-level <meta name="robots"
  content="noindex"> OVERRIDES an index HTTP header and surfaces only in Search Console as
  "Excluded by 'noindex' tag".
- If a shared shell/layout carries a blanket noindex that a build step strips from public
  pages, NEVER match that tag by its exact value string (matching "noindex, nofollow" exactly
  breaks the day someone changes it to "noindex, follow" — the strip matches nothing and the
  page ships a live noindex for days). Match STRUCTURALLY: /<meta\s+name=["']robots["'][^>]*>/gi.
  Better: don't inherit a blanket noindex at all — mark excluded pages noindex explicitly.
- Pages you DO exclude but want crawled-through (hub pages) should use "noindex, follow" so
  crawlers still follow links out of them to the pages you want indexed.
- Check HEADERS too: curl -sI <url> | grep -i x-robots-tag. An X-Robots-Tag: noindex header is
  invisible in the HTML and just as fatal; the header must agree with the meta.

ADD BUILD-TIME ASSERTIONS so none of the above can regress silently. Wire a post-build script
into the build command so a failure BLOCKS the deploy. Take the indexable set from the sitemap,
and for each prerendered page fail the build if it has:
   - any robots meta at all
   - != 1 canonical, OR a canonical that isn't that page's own absolute URL (count == 1 is NOT
     enough — "every canonical points to home" passes a count check; assert the VALUE)
   - != 1 meta description, or != 1 <h1>
   - JSON-LD that doesn't JSON.parse
   - a suspiciously small rendered body (prerender produced an empty shell)

INDEXNOW (accelerates Bing/Yandex/Seznam/Naver — NOT Google):
- Add an IndexNow key file served at the domain root (a static asset).
- If the app has a backend and content changes at runtime (e.g. admin CRUD on products),
  ping IndexNow from those mutation endpoints for the affected URLs (use the framework's
  "keep-alive after response" mechanism, e.g. Next.js after(), so the ping isn't dropped;
  and add a short per-URL cooldown so bulk edits don't spam-throttle the domain).
- If it's a static site with no backend, add a small script that submits the sitemap URLs and
  runs on deploy (npm script + optional CI action on the deploy branch). Don't wire it into
  non-existent endpoints.

AFTER CHANGES — VERIFY AGAINST REAL OUTPUT, NOT ASSUMPTIONS:
- Run the project's build and test commands and report results.
- Fetch EACH public URL's raw HTML (curl -s <url>, before JS) and confirm: content is present
  in <body>; canonical == that route's own URL; description + og are per-route; exactly one h1.
- Fetch headers (curl -sI <url>) and confirm no X-Robots-Tag: noindex; headers agree with meta.
- Fetch the key file, robots.txt, and sitemap.xml (sitemap Content-Type should be xml).
- Keep edits minimal and consistent with the existing code style.

FINALLY, GIVE ME THE OFF-SITE STEPS (I'll do these myself):
- Google Search Console: add property (URL-prefix vs Domain — tell me which fits), verify
  (HTML file or meta tag — say which suits this setup), submit the sitemap, request indexing.
- Bing Webmaster Tools: add the site (one-click import from Search Console works), verify,
  submit the SAME sitemap and confirm it shows "Success", and register the IndexNow key.
- Domain redirect: old domain -> primary (where to set it in the host dashboard).
- Realistic expectations:
    * Google usually indexes a correct new site within hours-to-days.
    * Bing is slow and selective for new/low-authority sites — often 2-3 crawl cycles / several
      weeks EVEN when everything is set up right. Edge uses Bing's index, so it follows Bing.
    * A brand-new domain ranks below high-authority profiles (LinkedIn etc.) at first; the main
      off-site lever is BACKLINKS from my own established profiles (GitHub/LinkedIn/X) pointing
      at the primary domain, plus time.
    * AI search tools (ChatGPT/Perplexity/Copilot) find sites via their own crawlers + Bing's
      index, so Bing indexing + allowing AI crawlers + real server-rendered content is what
      makes the site show up there.
````
