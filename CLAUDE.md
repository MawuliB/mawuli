# Claude Code — Repo Instructions

This is **Mawuli Badassou's personal portfolio** (Angular 17, terminal-themed, deployed at https://mawuli-vert.vercel.app via Vercel from the `production` branch).

## Trigger phrases

### Updating portfolio content
When the user says any of:

- `update`
- `update the portfolio`
- `refresh the portfolio`
- `pull the latest from my resume`
- `add my new cert(s)`

…follow the runbook in **[UPDATE.md](UPDATE.md)**. Don't try to remember the steps — read the file each time so you stay in sync with whatever conventions are there now.

### Scaffolding a playground experiment
When the user says any of:

- `scaffold something in the playground`
- `add a playground experiment`
- `make me a quick playground for X`
- `build a playground page for X`
- `new playground page`
- `quick page to send to <someone>`
- anything that implies a one-off interactive page outside the portfolio narrative

…follow the runbook in **[PLAYGROUND.md](PLAYGROUND.md)**. **Critical rule**: every playground experiment uses its own theme — never the portfolio's terminal/green-phosphor look. The runbook covers chromeless routing, body-class management for stripping global CRT effects, font injection, and the questions to ask before writing any code.

### Posture for updates

- **Never silently apply changes** scraped from the resume PDF or Credly. The resume may be ahead of what Mawuli wants public, and certs/work bullets need user-controlled wording.
- **Always ask which deltas to apply.** Show the comparison (what's there vs. what's new), then ask which to fold in.
- **Always bump `lastUpdated`** in `src/assets/data/portfolio-data.json` to today's date at the end of an update.
- **Always run a build** after non-trivial changes: `npx ng build --configuration development`.

## Project shape

- Angular 17, **standalone components** — no NgModules.
- All page content lives in **`src/assets/data/portfolio-data.json`** and is consumed via `PortfolioDataService` ([src/app/services/portfolio-data.service.ts](src/app/services/portfolio-data.service.ts)).
- Models in [src/app/models/portfolio.model.ts](src/app/models/portfolio.model.ts).
- Terminal/CRT aesthetic — green phosphor by default, with amber/blue themes available via [theme.service.ts](src/app/services/theme.service.ts). Preserve it.

## Key conventions

- Components don't fetch HTTP — they consume the JSON via the service.
- `/playground` is for ad-hoc experiments. New experiments go under `src/app/playground/experiments/<slug>/` and register in [experiments.ts](src/app/playground/experiments.ts).
- Skill icons resolve via Devicon CDN in [skill-icons.ts](src/app/services/skill-icons.ts); emoji is fallback for unmapped skills.
- 404 fallback is wired via wildcard route to `not-found.component.ts`.
- Contact form posts to Formspree (configured) with a `mailto:` fallback in [contact.component.ts](src/app/contact/contact.component.ts).

## What NOT to do

- Don't introduce backwards-compatibility shims or "removed" comments — delete cleanly.
- Don't add documentation files unless the user asks for them.
- Don't fetch authenticated sources (LinkedIn, private repos). Stick to public APIs: GitHub public REST, Credly public JSON.
- Don't reintroduce the fake `setTimeout` delays for "loading effect" — they were intentionally removed.
