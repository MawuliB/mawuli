# Portfolio Review & Improvement Plan

_Audit date: 2026-05-11_

A three-perspective audit of the Angular 17 portfolio at [src/app](src/app/), followed by a phased plan to ship the gaps.

---

## 1. UI / UX Perspective

The site has a **strong, cohesive Linux/terminal aesthetic** — green phosphor palette, scanlines, monospace, CRT glow. That's the personality. Where it falls short is in the basics that turn a personality piece into a working portfolio.

### What's working
- Consistent visual language across every page (terminal window chrome, command prompts, ASCII art on home).
- Keyboard-first navigation (Alt+1–6, arrow keys to paginate).
- Custom cursor + trail adds polish; correctly disabled on touch via `(hover: none)`.
- Distinct section metaphors (skills as cards with bars, projects as `ls -la`, experience as timeline, education as folder tree).

### Issues
| # | Issue | Where | Impact |
|---|---|---|---|
| U1 | **No visible mobile nav** — `nav ul li { display: block }` at <480px stacks vertically but the hamburger lives in [header.component.html](src/app/header/header.component.html) and may not surface all routes consistently | Header | Mobile users can't navigate well |
| U2 | **Custom cursor blocks default cursor everywhere** (`cursor: none !important` on body/a/button/input) — text inputs lose the I-beam, harms form usability on desktop | [src/styles.css:50-57](src/styles.css#L50-L57) | Contact form feels wrong |
| U3 | **Scanline overlay sits at `z-index: var(--z-cursor)` (9999)** — same layer as the cursor, can occlude modals (`--z-modal: 1000`) | [src/styles.css:107](src/styles.css#L107) | Project detail modal may render under scanlines |
| U4 | **No "back / esc" handling on project modal** — only click-outside closes it | [projects.component.ts](src/app/projects/projects.component.ts) | Keyboard-only users stuck |
| U5 | **Arrow-key pagination is global** — pressing → in a form input still navigates between routes because carousel listens on `window` | [carousel.component.ts:40](src/app/carousel/carousel.component.ts#L40) | Bug when typing in contact form |
| U6 | **No loading skeletons** — pages flash blank then content; everything is synchronous `of()` but the projects page even adds a fake 500ms `setTimeout` | [projects.component.ts:27](src/app/projects/projects.component.ts#L27) | Feels janky |
| U7 | **Hero typing animation has no cursor blink during type** and never restarts on visibility change — feels static if user navigates back | [home.component.ts:45-72](src/app/home/home.component.ts#L45-L72) | Loses signature interaction |
| U8 | **Color contrast** — `--terminal-text-muted: #008800` on `#0c0c0c` is ~3.7:1; below WCAG AA (4.5:1) for body text | [src/styles.css:15](src/styles.css#L15) | Accessibility |
| U9 | **Currently no theme switcher** — palette has amber + blue variables defined but no toggle exposes them | [src/styles.css:20-28](src/styles.css#L20-L28) | Easy win, half-built |
| U10 | **Heavy emoji use in skills section** — emoji rendering varies wildly across OSes; "🅰️" for Angular and "🔴" for Ansible feel arbitrary | [portfolio-data.json](src/assets/data/portfolio-data.json) | Visual consistency |

### Recommendations
- Replace `cursor: none` blanket rule with class-based opt-in; keep I-beam on inputs.
- Lower scanline z-index to `1` or `2`; reserve `z-cursor` for the cursor itself.
- Add Escape-key handler on modals; scope arrow keys to home / a `.carousel-stage` only when no input is focused.
- Replace emoji icons with `lucide-angular` or simple inline SVG (currency in DevOps icons especially).
- Add theme toggle (green / amber / blue) — leverage existing CSS vars.
- Bump `--terminal-text-muted` to `#00aa00` or similar to pass AA.

---

## 2. Engineering Perspective

The Angular 17 setup is **modern (standalone components, no NgModules)** and the data layer is cleanly typed. The pain is in the small things — leaks, dead code, missing tests, no SEO, broken assets.

### Bugs / correctness
| # | Issue | Where |
|---|---|---|
| E1 | **Hardcoded placeholder project URLs** — `https://github.com/yourusername/...` | [portfolio-data.json:265,285,...](src/assets/data/portfolio-data.json) |
| E2 | **Project images referenced but files do not exist** — `assets/project1.jpg`...`project6.jpg` are in JSON but the `src/assets/` folder only has `mine.png`, `xbone.png`. The `imageUrl` field is also never rendered in the template anyway. | [projects.component.html](src/app/projects/projects.component.html) |
| E3 | **`setInterval` in `home.component.ts` not cleared on destroy** — if the user nav-leaves mid-type, the interval keeps firing on a null reference path | [home.component.ts:49,64](src/app/home/home.component.ts#L49-L64) |
| E4 | **`console.log` debug statements in production** | [carousel.component.ts:27,33](src/app/carousel/carousel.component.ts#L27-L33) |
| E5 | **Carousel `currentIndex` desyncs** — user clicks routerLink directly, then presses → and jumps to wrong page | [carousel.component.ts](src/app/carousel/carousel.component.ts) |
| E6 | **Projects component re-subscribes to service on every filter click** instead of filtering the local array — minor perf, no `takeUntil` | [projects.component.ts:36-67](src/app/projects/projects.component.ts#L36-L67) |
| E7 | **Fake 500ms delay** before showing projects — gives the appearance of slow load | [projects.component.ts:27](src/app/projects/projects.component.ts#L27) |
| E8 | **Contact form submission is a no-op** — 2s timeout, no HTTP, no FormSpree/Resend/EmailJS wiring | [contact](src/app/contact/) |
| E9 | **Unused imports** (`RouterOutlet` in app, `HostListener` in header, `ViewChild` carousel ref) | multiple |
| E10 | **No 404 / wildcard route** — invalid URLs show blank page | [app.routes.ts](src/app/app.routes.ts) |

### Missing infrastructure
- **No SEO** — `index.html` has only `<title>Mawuli</title>` + viewport. No `<meta name="description">`, no OpenGraph, no Twitter card, no canonical URL, no JSON-LD `Person` schema. Angular `Title` / `Meta` services are never used.
- **No analytics or error tracking** — no Plausible, no Vercel Analytics, no Sentry.
- **No lazy-loading** — every component eagerly imported in `app.routes.ts`. Initial bundle bigger than it needs to be.
- **No tests beyond scaffolds** — every `.spec.ts` is the default "should create" check.
- **No CI** — no `.github/workflows`, no Vercel/Netlify config in repo.
- **`tsconfig.json` warning** flagged in README but unaddressed: `moduleResolution: node` deprecated.
- **No `prerender` / SSR** — pure CSR; harms SEO for a portfolio.
- **No `robots.txt` / `sitemap.xml`**.
- **No `manifest.json`** (PWA / install).

### Code-organization smells
- Each component re-implements terminal chrome (top bar with traffic-light buttons) — extract a `<app-terminal-window>` wrapper.
- `formatDate` / `calculateDuration` are duplicated in projects and experience — move to a `DatePipe` or shared util.
- Skill category icons hardcoded in component — should live with the data.
- `simulateCommandExecution` in experience uses fake delays — drop.

---

## 3. Project-Management Perspective

The README ([README.md](README.md)) reads like a status report and the JSON data has been touched recently, but several pieces of the user-facing story are still wrong or stale.

### State of the world
- **Branch `production` is the working branch** (unusual — typically `main` is dev and `production` is the deploy target). Acceptable, but it means every commit is "live."
- **Live site exists** at `https://mawuli-vert.vercel.app` (from GitHub repo homepage).
- **`portfolio-data.json` is the single source of truth** — good. But it doesn't match the new resume.
- The **resume** ([Mawuli Badassou - Resume 2026.pdf](C:/Users/MawuliBadassou/OneDrive%20-%20AmaliTech%20gGmbH/Documents/mawuli/Mawuli%20Badassou%20-%20Resume%202026.pdf)) is several iterations ahead of the site.

### Resume vs. site delta
| Field | Resume (truth) | portfolio-data.json (current) |
|---|---|---|
| Bio focus | "2+ yrs AWS infra automation; backend dev background enables cross-team collab" | Older, mentions 2 yrs |
| Skills missing | **GitLab CI/CD, Jaeger, Kafka** | Absent |
| Skills present but resume dropped them | _none critical_ | Java Spring Boot kept (fine — historic) |
| Experience bullet: DR sim RTO 16 min | ✓ | ✗ |
| Experience bullet: Grafana API Gateway dashboards | ✓ | ✗ |
| Experience bullet: Jaeger distributed tracing | ✓ | ✗ |
| Experience bullet: Storage crisis 90% → 55% | ✓ | ✗ |
| Experience bullet: AWS SES migration | ✓ | ✗ |
| Experience bullet: DB migration in CI/CD build | ✓ | ✗ |
| Experience bullet: Cost cut 45–50% | ✓ (specific %) | ✓ (vague) |
| Projects | _resume omits — that section is your call_ | 6 fake projects |

### Risks
- **`portfolio-data.json` has hardcoded `https://github.com/yourusername/...` links** that are publicly indexed on the live site. Anyone visiting can see they're placeholders.
- **Fake project images** (project1.jpg…project6.jpg) — broken paths if they ever get rendered.
- **Branch confusion** — `production` as default; no `main` / `dev` separation means there's no preview environment to test in.

---

## 4. Improvement Plan

Sequenced into four phases. Each phase ends in a usable site.

### Phase 1 — Truthfulness & blockers (do now)
**Goal: site stops lying.**
1. Rewrite `portfolio-data.json` to match Resume 2026 (profile bio, skills incl. Jaeger/Kafka/GitLab, all 10 experience bullets).
2. Replace the 6 placeholder projects with real public repos from `github.com/MawuliB` (curated list pending user pick — see candidates in the section below).
3. Remove the broken `imageUrl` field from project entries (or wire it up with a real image and a fallback).
4. Add wildcard 404 route to [app.routes.ts](src/app/app.routes.ts).
5. Remove `console.log` from carousel; remove unused imports across the app.

### Phase 2 — Polish & correctness
**Goal: it works smoothly.**
6. Fix `setInterval` cleanup in [home.component.ts](src/app/home/home.component.ts).
7. Scope arrow-key navigation to home only (or to a stage element) — stop hijacking inputs.
8. Add Escape-key + click-outside close on projects modal.
9. Replace `cursor: none` blanket with class-based opt-in so inputs keep I-beam.
10. Lower scanline z-index below modal z-index.
11. Drop fake `setTimeout(500)` in projects load.
12. Add a shared `DatePipe` / util for `formatDate` + `calculateDuration`.

### Phase 3 — Discoverability
**Goal: someone can actually find this site.**
13. Add SEO: `<meta name="description">`, OG tags, Twitter card, canonical URL, JSON-LD `Person`.
14. Use Angular `Title` + `Meta` services to set per-route titles + descriptions.
15. Add `robots.txt` + `sitemap.xml` (5 routes — easy to hand-author).
16. Wire contact form to a real backend — Formspree, Resend, or a single Vercel/AWS Lambda endpoint.

### Phase 4 — Playground & beyond
**Goal: experimentation surface.**
17. Add `/playground` route + child routes for sub-experiments (see "Playground" section).
18. Add theme switcher (green / amber / blue) using existing CSS vars.
19. Lazy-load all route components (`loadComponent`).
20. Add `@angular/service-worker` for offline + install.
21. Write at least smoke tests for each route renders.

---

## 5. Real Project Candidates

Pulled from `github.com/MawuliB` (public repos, non-forks, DevOps-aligned). Use as the new `projects[]`:

| Slug | Lang | Why it belongs |
|---|---|---|
| `MawuliShop` | C# | 3 stars, recently updated, ecommerce — shows full-app work |
| `terraform_disaster_recovery` | HCL | Ties directly to resume's DR simulation bullet (RTO 16 min) |
| `dr_app` | Python | Companion piece to the DR Terraform work |
| `monitoring-tool` | Python | Reinforces the Prometheus / Grafana resume bullets |
| `aws_cdk_app` | Python | Shows IaC fluency beyond Terraform |
| `sam-app` | Python | AWS Serverless / SAM — extends the cloud story |
| `terraform_for_static_webhosting` | HCL/HTML | Practical Terraform — easy to demo |
| `ansible-blog` | HTML | Backs up Ansible bullets in resume |

Note: some repos have no description — those will need a one-liner from you, or I can draft them based on the code.

---

## 6. Playground Plan (`/playground`)

A sub-area for ad-hoc demos that share the site's terminal aesthetic without polluting the portfolio narrative.

Proposed structure:
```
/playground                  → index of experiments (terminal `ls` style)
/playground/dummy-flow       → multi-step form demo for stakeholder review
/playground/<future-thing>   → free slot
```

Implementation:
- New `playground` folder with `playground.component.ts` (index) + a router child routes config.
- Lazy-loaded (`loadChildren`) — keeps playground code out of the main bundle.
- Each experiment is a sibling component under `playground/experiments/<name>/`.
- Each experiment self-registers in a small `experiments.ts` array so the index page auto-lists them.

This isolates experimental UI from the portfolio sections and stays SEO-neutral (a `noindex` meta on the playground tree).

---

## 7. What was shipped in this pass

### Phase 1 — Truthfulness & blockers ✅
- Rewrote [portfolio-data.json](src/assets/data/portfolio-data.json) profile, skills (added Jaeger, Kafka, GitLab CI/CD), and experience to match the 2026 resume.
- Replaced all 6 placeholder projects with **AmaliTech production work** reframed as projects (DR strategy, Terraform migration, observability stack, API Gateway dashboards, AWS SES migration, cost reduction, CI/CD-integrated migrations) + this portfolio site. None of them have `githubUrl` since they're private; each carries a `🔒 Private — AmaliTech production work` highlight.
- Added `organization?` field to the Project model and a small `@AmaliTech` chip in [projects.component.html](src/app/projects/projects.component.html).
- Added a wildcard 404 route + [not-found.component.ts](src/app/not-found/not-found.component.ts) (terminal-styled "bash: route not found").
- Removed `console.log` from carousel; removed unused `RouterOutlet` import from `app.component`.

### Phase 2 — Polish & correctness ✅
- Fixed `setInterval` cleanup in [home.component.ts](src/app/home/home.component.ts) (no more leak on unmount).
- Scoped arrow-key navigation in [carousel.component.ts](src/app/carousel/carousel.component.ts) — skips when an input/textarea/select/contentEditable is focused, and skips when modifier keys are held.
- Added Escape-key close on the projects modal.
- Dropped the fake 500ms `setTimeout` in projects + contact load.
- Switched the projects "filter" buttons from re-subscribing to the service to filtering the local array.
- Replaced blanket `cursor: none !important` with `body, a, button` only — inputs keep their I-beam in [src/styles.css](src/styles.css) and [src/app/app.component.css](src/app/app.component.css).
- Lowered scanline overlay z-index from `--z-cursor` (9999) to a new `--z-scanlines` (2), so modals render above it.
- Bumped `--terminal-text-muted` from `#008800` to `#00aa00` to inch toward WCAG AA.

### Phase 3 — Discoverability ✅ (partial)
- Rebuilt [index.html](src/index.html) with description, OG tags, Twitter card, `theme-color`, canonical URL, and JSON-LD `Person` schema.
- Added per-route `title` strings to [app.routes.ts](src/app/app.routes.ts) (Angular sets the document title from these).
- Added [robots.txt](src/robots.txt) and [sitemap.xml](src/sitemap.xml); referenced them in `angular.json` so they ship with the build.
- Wired the contact form to **Formspree** with a `mailto:` fallback (see "Formspree setup" below).

### Phase 4 — Playground & beyond ✅ (mostly)
- Added `/playground` route with **lazy-loaded** child routes — see [playground.routes.ts](src/app/playground/playground.routes.ts).
- Shipped one experiment: [/playground/dummy-flow](src/app/playground/experiments/dummy-flow/) — a 4-step form with progress stepper for stakeholder reviews.
- Drop new experiments under `src/app/playground/experiments/<slug>/`, register them in [experiments.ts](src/app/playground/experiments.ts), and add a route to [playground.routes.ts](src/app/playground/playground.routes.ts).
- Added a **theme switcher** (green / amber / blue) in the header — driven by [theme.service.ts](src/app/services/theme.service.ts), persisted to `localStorage`, applied as `html.theme-*` classes that override the existing CSS variables.
- Swapped emoji skill icons for **Devicon SVGs** for the major skills (AWS, Terraform, Docker, Python, etc.) with emoji fallback for ones Devicon doesn't cover — see [skill-icons.ts](src/app/services/skill-icons.ts).

### Not yet done — leftovers for a future pass
- **Tests**: `.spec.ts` files are still scaffolds. Each route should have at least a "renders without error" smoke test.
- **Lazy-loading for portfolio routes**: Currently only `/playground` and `/404` are lazy. Convert each main route to `loadComponent` to shrink the initial bundle (~226 KB main.js right now).
- **Service worker / PWA** (offline + install).
- **Shared `DatePipe` / util** for `formatDate` + `calculateDuration` (duplicated in projects and experience).
- **Carousel `currentIndex` desync** when user navigates via routerLink — needs a `NavigationEnd` subscription to keep state in sync.
- **Mobile-first refactor**: current breakpoints are desktop-first 768/480; could rebuild bottom-up.

---

## 8. Formspree setup (5-minute task for you)

The contact form is wired but needs your form ID once.

1. Go to **https://formspree.io** and create a free account (50 submissions/month free tier).
2. Create a new form pointing at `mawulibadassou5@gmail.com`. Formspree gives you a URL like `https://formspree.io/f/abcd1234`.
3. Open [contact.component.ts](src/app/contact/contact.component.ts) and replace the placeholder:
   ```ts
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/your-form-id';
   ```
   with your real URL.
4. Until you do, the form falls back to opening the visitor's mail client via `mailto:` — still works, just clunkier.

Alternative backends if you don't want Formspree: swap the `fetch()` call for a Resend / AWS Lambda / Vercel serverless function. The component already centralises the call so it's a one-spot change.

---

## 9. Where to go from here (first-pass close-out)

Most impactful next pieces, in order:
1. **Fill in Formspree ID** — five minutes, completes the contact loop. ✅ (Done — `xkoykvpg`.)
2. **Make portfolio routes lazy** (`loadComponent`) — shaves real bytes off the initial bundle.
3. **Write smoke tests** — even just `it('renders', () => { ... })` for each route catches accidental regressions.
4. **Tell me your private projects** — when you've got 2–3 you want featured, I can fold them into [portfolio-data.json](src/assets/data/portfolio-data.json) alongside the AmaliTech work; they share the same `organization` chip pattern.

---

# Second-Pass Audit — 2026-05-12

Three parallel deep audits: **security**, **UI/UX**, and **code-quality** — each scanning the codebase with its own lens. Below is the compiled report + what was shipped in this pass + what's queued for a decision.

## 10. Security (compiled)

### High risk
| # | Issue | Where | Status |
|---|---|---|---|
| S1 | **`innerHTML` cursor-trail builder** — defensive XSS risk if the source ever changes | [app.component.ts:67-79](src/app/app.component.ts#L67-L79) | ✅ Fixed — now builds DOM nodes with `createElement` + `replaceChildren()` |
| S2 | **Real phone/email/WhatsApp number visible on public site** — spam/phishing surface, especially the trial's WhatsApp number which is a personal mobile | [portfolio-data.json:9-10, 289](src/assets/data/portfolio-data.json), [the-trial.component.ts:108](src/app/playground/experiments/the-trial/the-trial.component.ts#L108) | ⏸ Held — user decision (recruiters may need the phone; trial WhatsApp is intentional) |
| S3 | **No rate-limit / captcha on contact form** — Formspree endpoint is wide open, can be abused | [contact.component.ts:165-209](src/app/contact/contact.component.ts#L165-L209) | ⏸ Held — needs hCaptcha or Cloudflare Turnstile signup |
| S4 | **No CSP** — no `<meta http-equiv="Content-Security-Policy">` in [index.html](src/index.html); browser defaults are permissive | [index.html](src/index.html) | ⏸ Held — needs deploy testing; would break inline pre-paint script unless `'unsafe-inline'` allowed or moved to file with nonce |

### Medium risk
| # | Issue | Status |
|---|---|---|
| S5 | **No SRI on Devicon / Credly badges / Google Fonts / Formspree** — supply-chain risk if any CDN is compromised | ⏸ Held — SRI hashes need to be computed at build time (Devicon URLs are dynamic) |
| S6 | **WhatsApp number hardcoded** — minor — should live in config | ⏸ Held (intentional — trial is self-contained) |
| S7 | **Formspree endpoint in source** — fine for current form ID (quasi-public); flag for any future real secrets | Documented |

### Low risk / hardening
- **`frame-ancestors` / `X-Frame-Options`** — set via Vercel headers (`vercel.json`) when CSP gets added.
- **Source maps in production** — already absent (✓).

### Non-issues that look scary
- All `document.*` queries are for internally-injected elements; no user input touches them.
- The trial's dynamic `<meta>` and `<link>` injection is fine — only hardcoded values, cleaned up on destroy.
- All external resources are HTTPS — no mixed content.
- `as PortfolioData` cast is safe (JSON is bundled, not fetched).

---

## 11. UI / UX (compiled)

### Critical
| # | Issue | Where | Status |
|---|---|---|---|
| U1 | **No `prefers-reduced-motion` honored** — scanlines, blinking cursor, typing animation, floating hearts, sparkle, drift, bloom all run unconditionally (WCAG fail) | [styles.css](src/styles.css), [the-trial.component.css](src/app/playground/experiments/the-trial/the-trial.component.css), [home.component.css](src/app/home/home.component.css) | ✅ Fixed — global media query in [styles.css](src/styles.css) reduces all animations + transitions to 0.001ms and hides scanlines for reduced-motion users |
| U2 | **Touch targets** — theme switcher 30×30px ([header.css:63](src/app/header/header.component.css#L63)), trial checkboxes 22×22px — under 44×44 minimum | | ⏸ Queued — minor visual cost to bump |
| U3 | **Amber-theme muted text contrast** — `#aa7700` on `#0c0c0c` ≈ 2.8:1, fails AA | [styles.css:116](src/styles.css#L116) | ✅ Fixed — bumped to `#d49b34` (~5.1:1) |
| U4 | **iOS auto-zoom on form focus** — inputs use 1rem (~14–15px on some viewports), triggering zoom-on-tap | [styles.css](src/styles.css) | ✅ Fixed — `@media (max-width: 480px)` forces inputs to 16px |
| U5 | **Trial "not yet 💔" button** — phrasing + broken heart could read as dismissive of valid feelings | [the-trial.component.html:287](src/app/playground/experiments/the-trial/the-trial.component.html#L287) | ✅ Fixed — now `I need more time 💙` (frames it as her pacing, not rejection) |

### High-impact
| # | Issue | Status |
|---|---|---|
| U6 | **Skip-to-content link defined in [styles.css:544](src/styles.css#L544) but never rendered** | ✅ Fixed — rendered in [app.component.html](src/app/app.component.html) with `<main id="main-content" tabindex="-1">` |
| U7 | **Focus rings not customized on trial buttons** — could appear inside padding | ⏸ Queued — small CSS bump |
| U8 | **FOUT for trial fonts** — Playfair/Lora/Caveat load with `display=swap`, causing layout shift | ⏸ Queued — change to `display=optional` or system fallbacks |
| U9 | **Theme switcher not discoverable** — small icon-only button, no tooltip animation | ⏸ Queued — could add a 2-second pulse on first visit |

### Polish
| # | Issue | Status |
|---|---|---|
| U10 | **Heading hierarchy** — education uses h3 with no h2 parent | ⏸ Queued |
| U11 | **Contact form summary** — can't edit individual fields without resetting whole form | ⏸ Queued — bigger refactor |
| U12 | **Active nav indicator** — green overlay on blue/amber themes feels off | ⏸ Queued |
| U13 | **Projects modal Esc handler** — UI/UX agent flagged as missing, but it's already implemented at [projects.component.ts:62-65](src/app/projects/projects.component.ts#L62-L65). No action needed. | ✅ Already in place |

### What works well (do not break)
- Hamburger menu fixed in this same pass — discoverable, X transforms cleanly, no overlap.
- Contact form progressive disclosure pattern lowers cognitive load.
- Theme persistence via localStorage is seamless.
- Trial page narrative pacing & verdict-loop ("not yet" → softer plea → forgiven) gives the recipient real agency.
- Responsive breakpoints (1024/768/480) reflow cleanly.

---

## 12. Code Quality / Developer (compiled)

### Bugs / correctness
| # | Issue | Where | Status |
|---|---|---|---|
| D1 | **`event: any` in router subscribe** | [header.component.ts:32](src/app/header/header.component.ts#L32) | ✅ Fixed — typed via `event is NavigationEnd` predicate |
| D2 | **Leftover fake `setTimeout(500)` in experience load** | [experience.component.ts:24-33](src/app/experience/experience.component.ts#L24-L33) | ✅ Fixed — dropped; same cleanup as projects/contact/education |
| D3 | **`iconUrl(skill)` called per skill per CD cycle** | [skills.component.html:63](src/app/skills/skills.component.html#L63) | ⏸ Held — pure O(1) lookup, no measurable cost; not worth a pipe yet |

### Tech debt worth paying down
| # | Item | Effort | Benefit | Status |
|---|---|---|---|---|
| D4 | **Duplicated `formatDate` / `calculateDuration`** in projects + experience + education | 2–3 hrs | DRY, one source of truth | ⏸ Queued |
| D5 | **Magic route-path strings** repeated in [header.component.ts:19-26](src/app/header/header.component.ts#L19-L26), [carousel.component.ts:12-19](src/app/carousel/carousel.component.ts#L12-L19), [app.routes.ts](src/app/app.routes.ts) | 1 hr | Single rename point | ⏸ Queued |
| D6 | **No smoke tests** beyond Angular scaffolds | 3–4 hrs | Catch regressions in CI | ⏸ Queued |
| D7 | **Portfolio routes are eager-loaded** | 2 hrs | Smaller initial bundle | ⏸ Queued |
| D8 | **`app.component.ts` DOM touches not guarded** with `typeof document` check | 1 hr | SSR/prerender readiness | ⏸ Queued |
| D9 | **README.md date stale** ("October 23, 2025") | 5 min | Cosmetic | ⏸ Queued |

### Performance wins (low-effort)
- Memoize `iconUrl` (negligible; skip).
- `ChangeDetectionStrategy.OnPush` for skills + projects (both load static data once) — small win.

### What's well-built (per audit)
- Strict TypeScript across the board (`strict`, `noImplicitAny`, `strictNullChecks`, `strictTemplates`).
- Fully standalone, no NgModule remnants.
- Data-driven architecture; clean service layer.
- DOM safety in [theme.service.ts](src/app/services/theme.service.ts), [the-trial.component.ts](src/app/playground/experiments/the-trial/the-trial.component.ts), [not-found.component.ts](src/app/not-found/not-found.component.ts).
- Documentation set (CLAUDE.md + UPDATE.md + PLAYGROUND.md + REVIEW.md) is unusually thorough for a personal portfolio.

---

## 13. FOUC flash on /playground/the-trial — fixed

The user reported a brief flash of the green terminal background before the trial's pastel theme kicks in on direct URL loads (worse on slow networks).

**Root cause**: the trial component only added `body.on-trial` in `ngOnInit`, which fires *after* Angular bootstraps + lazy-loads the chunk. The browser paints the body's terminal styling in between.

**Fix** (3 files):
- [index.html](src/index.html) — inline `<script>` in `<head>` runs *before paint*, checks the URL path against a chromeless-routes allowlist, and tags `<html class="chromeless">`.
- [styles.css](src/styles.css) — selectors moved from `body.on-trial` to `html.chromeless body`; kills the green background, scanlines, glow, custom cursor for chromeless routes.
- [the-trial.component.ts](src/app/playground/experiments/the-trial/the-trial.component.ts) — `ngOnInit`/`ngOnDestroy` now toggle the class on `document.documentElement` (handles SPA navigation when the inline script didn't run).
- [PLAYGROUND.md](PLAYGROUND.md) — runbook updated so future chromeless experiments register in the inline-script allowlist.

---

## 14. Where to go from here (second-pass close-out)

Already shipped in this pass: 8 fixes (S1, U1, U3, U4, U5, U6, D1, D2, FOUC). What's left, in priority order:

1. **Decisions needed from you** (I'll ask before doing):
   - Remove or obfuscate phone / email on public site? (S2)
   - Add captcha / rate limit to contact form? Which provider (hCaptcha vs. Cloudflare Turnstile)? (S3)
   - Add CSP? (S4) — needs careful header + inline script handling.

2. **Concrete next batch I can do unprompted**:
   - Extract shared date pipe (D4).
   - Route-path constants file (D5).
   - Make portfolio routes lazy (D7).
   - Bump touch-target sizes (U2).
   - Font-display=optional for trial fonts (U8).
   - Heading hierarchy on education (U10).

3. **Bigger work**: smoke tests (D6), SRI hashes at build time (S5), contact form summary inline-edit (U11).
