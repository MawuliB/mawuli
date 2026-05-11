# Update Runbook

This is the playbook Claude follows when the user says `update`, `update the portfolio`, etc. (see [CLAUDE.md](CLAUDE.md) for the trigger list).

The runbook is also useful as documentation for anyone (or future-you) updating this repo by hand.

---

## 0. Source of truth

| Thing | Location |
|---|---|
| All page content | [src/assets/data/portfolio-data.json](src/assets/data/portfolio-data.json) |
| Models | [src/app/models/portfolio.model.ts](src/app/models/portfolio.model.ts) |
| Data service | [src/app/services/portfolio-data.service.ts](src/app/services/portfolio-data.service.ts) |
| Skill icon map | [src/app/services/skill-icons.ts](src/app/services/skill-icons.ts) |

## 1. Authoritative external sources

| Source | Where | How to read it |
|---|---|---|
| Resume PDF | `C:\Users\MawuliBadassou\OneDrive - AmaliTech gGmbH\Documents\mawuli\Mawuli Badassou - Resume 2026.pdf` | `Read` tool |
| Monthly work updates | Same folder: `October to December 2025.pdf`, `January to February.pdf`, `March to April 2026.pdf`, `June-July Update.docx`, `August Update.docx`, `September Update.docx`, etc. | `Read` tool |
| Certifications (Credly) | https://www.credly.com/users/mawuli-badassou/badges | JSON: `https://www.credly.com/users/mawuli-badassou/badges.json` (no auth) |
| Public GitHub repos | https://github.com/MawuliB | `https://api.github.com/users/MawuliB/repos?per_page=100&sort=updated` |
| LinkedIn | https://linkedin.com/in/mawulibadassou-8a3021225 | **Auth-gated — cannot fetch.** Ask the user. |

---

## 2. The "update" flow

When triggered, do this in order:

1. **Ask which sections to update.** Use `AskUserQuestion` with options:
   - `Everything` (recommended starting point)
   - `Resume → profile / experience / skills`
   - `Certifications` (Credly diff)
   - `Projects` (private work + GitHub diff)
   - `Just skills`
2. **For each chosen section**, run the matching sub-runbook below — but show a diff first and ask before applying.
3. **Bump `lastUpdated`** in `portfolio-data.json` to today's date (ISO `YYYY-MM-DD`).
4. **Build:** `npx ng build --configuration development`. Fail loud if the build fails.
5. **Summarise what changed** at the end (one paragraph, no headers).

---

## 3. Sub-runbook: Resume → profile + experience + skills

1. Read `Mawuli Badassou - Resume 2026.pdf`.
2. Skim the most recent monthly update files (`August Update`, `September Update`, etc.) for anything not yet on the resume.
3. Compare against `portfolio-data.json`:
   - `profile.bio` — overall positioning
   - `profile.title` — headline
   - `skills[]` — look for any tool/library mentioned in the resume that's not in the skills list
   - `experience[]` — new bullets, updated metrics, role changes, new positions
4. Build a **delta list** (one line per change: `+ added X`, `~ updated Y`, `- removed Z`).
5. Show the delta and ask which to apply. Default to "all unless you say otherwise" — these are edits the user wrote.
6. Apply approved deltas.

### Follow-up questions to ask

- "Anything in the resume you'd rather NOT show on the public site (e.g., NDA / client names)?"
- "Should the bio stay punchy or should I incorporate the new bullet points more explicitly?"
- "For new skills, what `yearsOfExperience` and `level` (0–100) do you want?"

---

## 4. Sub-runbook: Certifications (Credly diff)

1. Fetch `https://www.credly.com/users/mawuli-badassou/badges.json` (PowerShell `Invoke-RestMethod` works; curl + jq also works in Git Bash).
2. For each badge in the response, capture: `id`, `badge_template.name`, `badge_template.image_url`, `issued_at_date`, `expires_at_date`, and infer the issuer from the badge name (or `badge_template.owner.name` if present).
3. Compare badge `id`s against `certifications[]` in `portfolio-data.json`.
4. For each **new** badge, draft an entry in this shape:
   ```json
   {
     "id": "<credly-uuid>",
     "name": "<badge name>",
     "issuer": "Amazon Web Services (AWS)" | "The Linux Foundation" | ...,
     "issuedDate": "<YYYY-MM-DD>",
     "expiresDate": "<YYYY-MM-DD or omit>",
     "imageUrl": "<badge_template.image_url>",
     "verifyUrl": "https://www.credly.com/badges/<id>/public_url",
     "category": "aws-certification" | "kubernetes" | "training" | "other"
   }
   ```
5. Show the diff (new + removed + unchanged counts) and ask before adding.
6. **Cross-update implied skills.** If a new cert is for a tech not yet in `skills[]` (e.g., a Kubernetes cert), ask if you should add the skill too. Don't auto-add — ask.
7. Mirror the cert names into `education[0].honors` and `education[0].achievements` so they show up alongside the degree too.

### Categories
- `aws-certification` — the real AWS exam-based certs
- `kubernetes` — CKA, CKAD, LFS250, etc.
- `training` — AWS Partner accreditations, AWS Knowledge badges, re/Start grad, etc.
- `other` — anything else

### Follow-up questions to ask

- "Want me to add `<tech>` to the skills list since you have the cert now? At what level?"
- "Should the new cert update the `profile.title` headline?"

---

## 5. Sub-runbook: Projects

There are usually three project sources:

1. **AmaliTech work** (private, no `githubUrl`). User describes verbally.
2. **Other private projects.** User describes verbally.
3. **Public GitHub repos** at `github.com/MawuliB` — fetch via the GitHub REST API above.

### Process

1. Ask **which buckets to update**:
   - `Add new AmaliTech work item`
   - `Add new private (non-AmaliTech) project`
   - `Pull a new public repo from GitHub`
2. For private projects, prompt for:
   - title
   - organization (e.g., AmaliTech) — sets the `@organization` chip on the card
   - one-line `description` + longer `longDescription`
   - `technologies` array
   - `startDate`, `endDate`, `status` (completed / in-progress / planned)
   - 3–5 `highlights` (lead with `🔒 Private — <organization> production work` if applicable)
   - `featured: true` only for the user's strongest 2–3 picks total
3. For GitHub pulls, fetch `https://api.github.com/repos/MawuliB/<repo>` for `description`, `language`, `homepage`, `updated_at`, then prompt the user to confirm/edit before adding.

### Follow-up questions to ask

- "Which projects should be `featured`? Cap is 3–4 total across the whole list."
- "Any of these under NDA — anything I should not write out plainly?"

---

## 6. Sub-runbook: Skills

1. Ask the user **what to add / remove / re-level**.
2. Each skill needs:
   - `name` (string)
   - `category` (`frontend` / `backend` / `database` / `devops` / `tools` / `other`)
   - `level` (0–100)
   - `yearsOfExperience` (number)
   - `icon` (emoji fallback — used when no Devicon match)
3. If the new skill has a Devicon, also add an entry in [skill-icons.ts](src/app/services/skill-icons.ts) so it renders as an SVG instead of an emoji. Devicon slug list: https://devicon.dev.
4. If there's no Devicon for it, leave the emoji and skip the icon map.

---

## 7. Sub-runbook: Profile / contact / socials

These change rarely. When asked:

- `profile.bio`, `profile.tagline`, `profile.title` — edit in `portfolio-data.json` directly.
- `contact.email`, `contact.phone` — update both `profile.*` and `contact.*` so they stay consistent.
- `contact.socials[]` — add/remove. Currently GitHub + LinkedIn.

If contact email changes, also update the JSON-LD `Person` block in [src/index.html](src/index.html) and the Formspree endpoint config in [contact.component.ts](src/app/contact/contact.component.ts).

---

## 8. Final checks before reporting done

- [ ] `lastUpdated` bumped in `portfolio-data.json`.
- [ ] `npx ng build --configuration development` succeeds.
- [ ] If skill icons changed: verify the icon URL actually renders (Devicon slug exists).
- [ ] If certs changed: verify one of the `verifyUrl` links resolves to a real Credly page.
- [ ] One-paragraph summary of what changed, posted back to the user.

---

## 9. Known landmines

- The Devicon CDN has no entry for **CloudFormation**, **GitHub Actions**, **Jaeger**, **DynamoDB**, or **SQL** — they fall back to emoji. Don't add them to [skill-icons.ts](src/app/services/skill-icons.ts) and waste cycles wondering why nothing renders.
- The `production` branch is the deploy branch (not `main`). Pushing to it goes live.
- The carousel listens on `window:keydown` for arrow keys but skips when an input/textarea/select is focused — don't reintroduce a global listener that bypasses that check.
- Project images (`imageUrl`) are still in the model as optional but **never rendered** — don't waste time fabricating image paths.
