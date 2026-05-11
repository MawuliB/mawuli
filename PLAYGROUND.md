# Playground Scaffold Runbook

This is the playbook Claude follows when the user wants a new experiment built under `/playground/<slug>`. See [CLAUDE.md](CLAUDE.md) for the trigger phrases.

## Hard rule: own theme, never the portfolio's

Every playground experiment **must** be visually independent from the portfolio. The terminal/CRT/green-phosphor look belongs to the main portfolio routes — never reuse it for a playground page unless the user explicitly asks. Each experiment gets its own palette, typography, and surfaces.

## Required posture for every new experiment

- **Chromeless** — no site header, no footer. Add `data: { chromeless: true }` to the route.
- **Own palette** — define CSS variables inside the component scope. **Do not** reference `--terminal-*` variables.
- **Own typography** — if you need a non-default font, inject Google Fonts dynamically in `ngOnInit` and remove the `<link>` nodes in `ngOnDestroy` so they only load on that page.
- **Kill global CRT effects** — add `document.body.classList.add('on-<slug>')` in `ngOnInit`, remove in `ngOnDestroy`. Add a rule in [src/styles.css](src/styles.css) under the "PER-ROUTE ESCAPE HATCH" section to disable scanlines, the radial glow, and the custom cursor for that body class. (Pattern already exists for `body.on-trial`.)
- **Mobile-first sizing** — at minimum a `@media (max-width: 600px)` breakpoint.
- **No external GIF/image hotlinks** — they break. Prefer big emoji + CSS animation, inline SVG, or stable images committed to `src/assets/`.

## Steps

For each new experiment with slug `<slug>`:

1. **Create the folder**: `src/app/playground/experiments/<slug>/`
2. **Three files** inside:
   - `<slug>.component.ts` — standalone component, imports as needed
   - `<slug>.component.html`
   - `<slug>.component.css`
3. **Register** in [src/app/playground/experiments.ts](src/app/playground/experiments.ts):
   ```ts
   {
     slug: '<slug>',
     title: '<Title>',
     description: '<one-line description>',
     status: 'live' | 'wip' | 'draft',
     addedOn: '<YYYY-MM-DD>',
     hidden: <true|false>,   // true = direct-link-only, hidden from /playground index
   }
   ```
4. **Add the route** in [src/app/playground/playground.routes.ts](src/app/playground/playground.routes.ts):
   ```ts
   {
     path: '<slug>',
     loadComponent: () => import('./experiments/<slug>/<slug>.component').then((m) => m.<ComponentClassName>),
     title: '<browser tab title>',
     data: { chromeless: true },
   }
   ```
5. **In `<slug>.component.ts`** — implement `OnInit` + `OnDestroy`:
   ```ts
   private injectedNodes: HTMLElement[] = [];
   ngOnInit(): void {
     if (typeof document === 'undefined') return;
     document.body.classList.add('on-<slug>');
     // optional: inject Google Fonts link + push into this.injectedNodes
     // optional: inject custom favicon link
     // optional: inject noindex meta if private/personal
   }
   ngOnDestroy(): void {
     if (typeof document === 'undefined') return;
     document.body.classList.remove('on-<slug>');
     this.injectedNodes.forEach((n) => n.parentNode?.removeChild(n));
     this.injectedNodes = [];
   }
   ```
6. **In [src/styles.css](src/styles.css)** under the "PER-ROUTE ESCAPE HATCH" section, add:
   ```css
   body.on-<slug>::before,
   body.on-<slug>::after { display: none !important; }
   body.on-<slug> .custom-cursor,
   body.on-<slug> .cursor-trail { display: none !important; }
   body.on-<slug>,
   body.on-<slug> a,
   body.on-<slug> button,
   body.on-<slug> input,
   body.on-<slug> textarea,
   body.on-<slug> select { cursor: auto !important; }
   body.on-<slug> { background: transparent !important; }
   ```
   (Or — if a future similar group emerges — generalise to a single selector. For now, one-per-experiment is fine.)
7. **Build check**: `npx ng build --configuration development`. Confirm the new chunk is lazy-loaded.

## Follow-up questions to ask before scaffolding

Always ask these before writing any code so the result actually fits:

1. **Slug?** URL-safe, lowercase, hyphenated.
2. **Audience?** Tech-savvy / general / a specific person? Drives tone + palette.
3. **Public on `/playground` index, or hidden?** `hidden: true` = direct-link-only.
4. **Flow shape?** Single page / multi-step / form / something else.
5. **Palette + vibe?** "Cute pastel", "minimal black/white", "neon synthwave", etc.
6. **Anything else important?** External data, animation density, special interactions.

Cap at 3–4 questions per turn. Use `AskUserQuestion` with `preview` when comparing visual options.

## Reference example

The canonical reference is **/playground/the-trial** (private apology page, hidden). It demonstrates every convention:

- [the-trial.component.ts](src/app/playground/experiments/the-trial/the-trial.component.ts) — body class management, font injection in `ngOnInit`, dynamic favicon, full cleanup in `ngOnDestroy`.
- [the-trial.component.html](src/app/playground/experiments/the-trial/the-trial.component.html) — scene-based structure, no terminal-window chrome.
- [the-trial.component.css](src/app/playground/experiments/the-trial/the-trial.component.css) — fully independent palette (rose / cream / blush / gold), Playfair + Lora + Caveat typography, floating decorations.
- Route registered with `data: { chromeless: true }`.
- `body.on-trial` overrides in [src/styles.css](src/styles.css).

For a simpler reference (visible on /playground index, less custom theming) see **/playground/dummy-flow** under [src/app/playground/experiments/dummy-flow/](src/app/playground/experiments/dummy-flow/).

## What NOT to do

- Don't reuse `terminal-window`, traffic-light buttons, `--terminal-*` variables for the experiment — that's portfolio chrome.
- Don't add the experiment to the main app routes — playground experiments live under `/playground/<slug>` only.
- Don't hardcode big external images / GIF URLs — they rot.
- Don't skip the `body.on-<slug>` cleanup in `ngOnDestroy` — leaving the class set leaks the theme into other pages.
- Don't forget to bump the build and confirm the chunk appears as `lazy` (not in the initial bundle).
