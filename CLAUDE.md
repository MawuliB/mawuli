# Claude Code — Repo Instructions

This is **Mawuli Badassou's personal portfolio** (Angular 17, terminal-themed, deployed at https://mawuli.thinks.work via Vercel from the `production` branch).

The **playground** (ad-hoc experiments, dummy flows, private pages) lives in a separate sibling repo at [github.com/MawuliB/playground](https://github.com/MawuliB/playground) and a sibling local folder at [`../mawuli-playground`](../mawuli-playground). It used to live under `/playground` in this repo but was extracted so this repo is purely portfolio. **Don't add playground experiments here.**

## Trigger phrases

When the user says any of:

- `update`
- `update the portfolio`
- `refresh the portfolio`
- `pull the latest from my resume`
- `add my new cert(s)`

…follow the runbook in **[UPDATE.md](UPDATE.md)**. Don't try to remember the steps — read the file each time so you stay in sync with whatever conventions are there now.

### Posture for updates

- **Never silently apply changes** scraped from the resume PDF or Credly. The resume may be ahead of what Mawuli wants public, and certs/work bullets need user-controlled wording.
- **Always ask which deltas to apply.** Show the comparison (what's there vs. what's new), then ask which to fold in.
- **Always bump `lastUpdated`** in `src/assets/data/portfolio-data.json` to today's date at the end of an update.
- **Always run a build + tests** after non-trivial changes: `npx ng build --configuration development` then `npm test`.

## Project shape

- Angular 17, **standalone components** — no NgModules.
- All page content lives in **`src/assets/data/portfolio-data.json`** and is consumed via `PortfolioDataService` ([src/app/services/portfolio-data.service.ts](src/app/services/portfolio-data.service.ts)).
- Models in [src/app/models/portfolio.model.ts](src/app/models/portfolio.model.ts).
- Terminal/CRT aesthetic — green phosphor by default, with amber/blue themes available via [theme.service.ts](src/app/services/theme.service.ts). Preserve it.
- Tests run in **Jest** (no browser). `npm test`.

## Key conventions

- Components don't fetch HTTP — they consume the JSON via the service.
- Skill icons resolve via Devicon CDN in [skill-icons.ts](src/app/services/skill-icons.ts); emoji is fallback for unmapped skills.
- 404 fallback is wired via wildcard route to `not-found.component.ts`.
- Contact form posts to Formspree (configured) with hCaptcha + a `mailto:` fallback in [contact.component.ts](src/app/contact/contact.component.ts).
- Routes are lazy-loaded (`loadComponent`) — keeps `main.js` small.

## What NOT to do

- Don't introduce backwards-compatibility shims or "removed" comments — delete cleanly.
- Don't add documentation files unless the user asks for them.
- Don't fetch authenticated sources (LinkedIn, private repos). Stick to public APIs: GitHub public REST, Credly public JSON.
- Don't reintroduce the fake `setTimeout` delays for "loading effect" — they were intentionally removed.
- Don't add playground experiments here — that's a separate repo. If the user asks for an experiment, point them at the playground repo / suggest making the change there.
