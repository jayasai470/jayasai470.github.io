# Content

`resume.yaml` is the single source of truth for both the site and the resume PDF.
Nothing outside this file needs to change when you add a job, a project, or a skill.

`scripts/build-content.mjs` compiles it into `public/resumeData.json`, and
`scripts/build-resume.cjs` generates the résumé PDF. Both outputs are committed to
git, so the repo has a working build without requiring a build step first. Run
`yarn build:content` (also used by `yarn dev`, `yarn build`, and `yarn build:file`)
after editing the YAML to regenerate both files. While `yarn dev` is running, a
change to `resume.yaml` automatically regenerates both outputs and reloads the page.

## Two summaries: `skillmessage` vs `summary`

- `skillmessage` is shown on the website, directly under `main.bio` in the About
  section. Write it to complement the bio, not repeat it.
- `summary` is shown only in the resume PDF's "Summary" section (the website never
  reads it). Write it in resume voice — lead with years of experience and seniority,
  since the PDF doesn't show `main.bio` at all.

Keep both free of filler phrasing you'd reuse verbatim between the two (or between
`bio` and `summary`) — it reads as templated/AI-written when the same stock phrase
("specializing in architecting scalable, high-performance...", "that keep them
reliable") shows up twice.

## Résumé-only behavior worth knowing

- `main.resumedownload` is both the downloaded filename *and* the output path
  `scripts/build-resume.cjs` writes the PDF to (derived from this field, not
  hardcoded) — keep it a real, professional filename.
- `main.social` entries with `icon: linkedin` / `icon: github` are automatically
  pulled into the resume's contact line (as plain `linkedin.com/in/...` /
  `github.com/...` text, protocol and `www.` stripped) — add/remove them there,
  nothing in `resume.hbs` needs to change.
- Consecutive `experience` entries with the exact same `company` string are grouped
  under one company heading in the PDF (e.g. three promotions at the same employer
  render as one heading with nested roles instead of repeating the company name).
  Give a contractor role a distinct `company` string (e.g. `"Acme Inc"`, not
  `"Acme Corp (Contractor)"` under the same name as the FTE stint) so it doesn't
  merge into the wrong group — or does merge, if that's accurate.

## Adding a job

Append an entry to the top of the `experience:` list (display order = list order):

```yaml
  - company: Acme Corp
    title: Senior Engineer
    dateFrom: Jan 2024
    dateTo: Present
    summary: >
      One-sentence summary of the role, shown above the bullet list.
    highlights:
      - Bullet point describing an achievement. Lead with an action verb and include
        concrete technologies/numbers where you can — these become resume bullets too.
      - Another bullet.
```

## Adding a project

Append an entry to the `projects:` list:

```yaml
  - title: Project Name
    tags: [Tech, Tags, Here]
    summary: >
      A 2-3 sentence summary of what it is and what you built.
```

## Adding/editing skills

Add a category, or add to an existing `items` list, under `skillCategories:`.

## Regenerating by hand

```
yarn build:content
```
