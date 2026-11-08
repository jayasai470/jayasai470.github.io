# Agent instructions: jayasai470.github.io

Portfolio site + PDF résumé for Jaya Sai Krishna Muppalla. Read this before making
changes — it captures decisions already made so they don't get re-litigated or
accidentally reverted.

## Setup

```
nvm install   # reads .nvmrc -> Node 24
nvm use
corepack enable   # or: npm install -g yarn
yarn install
yarn dev      # http://localhost:5173
```

`package.json#engines` requires Node >=24 — `yarn install` hard-fails below that
(yarn classic enforces `engines` strictly, it doesn't just warn).

## Architecture (read this before editing anything)

`content/resume.yaml` is the **single source of truth** — one hand-edited YAML file,
not a directory of per-job Markdown files (that was tried earlier in this project's
history and explicitly reverted per the owner's preference: "instead of lot of files
would prefer in a single file"). `scripts/build-content.mjs` compiles it into
`public/resumeData.json` (generated, but committed — see content/README.md), which
feeds both the React site and
`scripts/build-resume.cjs` (Handlebars + Puppeteer → `resume.hbs` → PDF). Full details
and the content-authoring format are in `content/README.md` — read that before adding
a job/project/skill.

## Hard constraints — do not violate these

- **The résumé PDF must stay plain and parseable**: single column, no tables, no
  graphical skill-rating bars, real selectable text, standard section headings. Any
  "make it more professional" styling pass must preserve this. Verify after changes:
  no `<table>` elements, `document.body.innerText` extracts in clean linear reading
  order, `/Type /Page` count in the raw PDF bytes tells you the actual page count.
- **Content lives in one file.** Don't reintroduce per-job Markdown files or split
  `resume.yaml` into multiple content files.
- **Never fabricate metrics.** When pulling "stronger" content from another resume
  draft, port over real numbers/achievements, not invented ones — if quantification
  is missing for an older role, say so rather than inventing a stat.
- **Avoid AI-sounding prose**: no em-dash asides as a crutch, no reusing the same
  stock phrase across two fields (e.g. `bio` and `summary` both said "...that keep
  them reliable" at one point — don't reintroduce that kind of duplication). Vary
  sentence length; let bullets use direct verbs without padding.

## What's been done so far (chronological, high-level)

1. Full migration off Create React App → **Vite** + React 19 functional components;
   CI (`.github/workflows/node.js.yml`) modernized to `checkout@v4`/`setup-node@v4`.
2. Visual rebuild of the site (navy/amber design system, Fraunces + Inter) and a
   from-scratch single-column résumé template (`resume.hbs` + `public/css/resume.css`).
3. Content architecture: single `content/resume.yaml` → generated
   `public/resumeData.json`, consumed by both the site and the PDF builder, with a
   live-reload Vite plugin (`vite.config.js`'s `contentWatcher()`, built on Vite's own
   `server.watcher`, not raw `fs.watch` — the latter hung Vitest's teardown).
4. Résumé polish pass: **company grouping** in `scripts/build-resume.cjs`
   (`groupByCompany()`) — consecutive `experience` entries with the same `company`
   render as one heading with nested roles (shows a promotion track instead of
   repeating the employer name), plus `page-break-inside: avoid` on role blocks so
   the PDF never splits an entry mid-bullet-list.
5. Pulled select quantified achievements from a differently-focused draft resume
   (7-version zero-downtime K8s upgrade w/ rollback process, on-call ownership,
   named observability migration, sub-100ms latency) into the Staff Engineer /
   Engineer 3 bullets — deliberately **excluded** cluster/node counts per the owner's
   explicit instruction, and kept the product-engineering bullets (FAST channel, ad
   platform, GPT/RAG) rather than replacing them with a pure infra/SRE narrative.
   Corrected the contractor role's actual employer to **First Object Inc** (was
   mislabeled "Samsung Electronics America (Contractor)").
6. Added LinkedIn to the résumé contact line (was missing entirely), added a
   dedicated `summary` field (PDF-only) separate from `skillmessage` (website-only,
   second paragraph under `bio`) so the two stop duplicating each other, fixed a
   hyphen/en-dash inconsistency in date ranges.
7. Site/SEO polish: replaced the stock Create React App favicon + app icons (were
   still the default React atom logo) with a navy/amber "J" monogram
   (`public/favicon.svg`, regenerated `logo192.png`/`logo512.png` via a Puppeteer
   screenshot of styled HTML — see pattern below), added Open Graph/Twitter Card tags
   + a generated `public/og-image.png` social preview, added `robots.txt`, removed
   unused legacy CRA image assets from `public/images/`.
8. De-AI-ified the prose fields (`tagline`, `bio`, `skillmessage`, `summary`) —
   removed em-dash asides and duplicated stock phrasing between fields.
9. Fixed the résumé contact line wrapping to 2 lines: converted it to a flex layout
   with CSS-drawn `·` separators (tighter than literal `&middot;` text) and tuned the
   font size against the *actual rendered width* (measured via Puppeteer
   `getBoundingClientRect()`, not `scrollWidth` — a flex container with `nowrap`
   children can report a misleadingly-clamped `scrollWidth`).
10. Bumped Node to 24 everywhere (`.nvmrc`, `package.json#engines`,
    the CI matrix) and installed/switched the local dev environment to it.
11. Replaced the hand-maintained `apt-get install libatk1.0-0 libc6 ...` package
    list in CI (used to satisfy Puppeteer's bundled Chromium's shared-library
    deps) with pointing `PUPPETEER_EXECUTABLE_PATH` at the Google Chrome that's
    already preinstalled on GitHub's `ubuntu-latest` runner image, and setting
    `PUPPETEER_SKIP_DOWNLOAD: true` on the install step so Puppeteer doesn't also
    download its own Chromium in CI. That package list broke whenever Ubuntu
    renamed a library (this session alone: `libgdk-pixbuf2.0-0` ->
    `libgdk-pixbuf-2.0-0`) — GitHub keeps the preinstalled browser working across
    runner image bumps, so this is no longer something to maintain by hand.
    Puppeteer reads `PUPPETEER_EXECUTABLE_PATH` from the environment automatically
    (`node_modules/puppeteer/lib/puppeteer/getConfiguration.js`), so
    `scripts/build-resume.cjs` needed no code change — `puppeteer.launch()` still
    takes no `executablePath` option and still works unmodified on a local machine
    (which doesn't set that env var, so it keeps using Puppeteer's own downloaded
    Chromium as before).
12. Simplified `scripts/build-resume.cjs`: it no longer writes an intermediate
    `public/resume.html` (that file was a leftover from the old CRA-era site, which
    is gone — nothing reads it anymore). The Handlebars template now renders
    straight to an in-memory string that's handed to Puppeteer. `public/resume.html`
    is gitignored since nothing produces it anymore. The résumé PDF
    (`public/Jaya-Sai-Krishna-Muppalla-Resume.pdf`) and `public/resumeData.json`
    **are** committed to git (by owner's preference — keeps a working checkout
    usable without requiring a build step first) even though both are regenerated
    on every `yarn build:file`/`yarn build:content` run; remember to regenerate and
    commit them after editing `content/resume.yaml`.

## Useful patterns

- **No browser extension connected in some sessions** → verification is done by
  using the project's own Puppeteer dependency: screenshot the Vite dev server or
  the generated PDF to a scratch path and read the image back, rather than guessing.
  (`scripts/build-resume.cjs` renders the Handlebars template to an HTML string in
  memory and feeds it straight to Puppeteer — there's no intermediate
  `public/resume.html` file anymore. If you need to eyeball the HTML before it
  becomes a PDF, temporarily add a `page.content()` dump in that script rather than
  reintroducing a committed output file.)
- **Résumé page-count check** without a PDF library: regex the raw PDF bytes for
  `/Type\s*\/Page\b(?!s)` occurrences, or read the `/Count` field.
- **Contact-line / layout-fit checks**: render in Puppeteer with print media
  emulated, then measure with `getBoundingClientRect()` on the first/last element,
  not `scrollWidth` (unreliable inside a `flex-wrap: nowrap` container).

## Search/AI-crawler visibility — intentionally blocked

`index.html` has `<meta name="robots" content="noindex, nofollow">` and
`public/robots.txt` disallows named AI crawlers (GPTBot, ClaudeBot, CCBot,
Google-Extended, PerplexityBot, etc.) — **this is deliberate, not leftover CRA
boilerplate.** The owner does not want this site showing up in Google/Bing search or
being scraped by AI assistants/training crawlers. Don't "fix" this by removing the
noindex tag or loosening robots.txt as part of an SEO/discoverability cleanup.
Note `robots.txt` alone can't deindex an already-crawled page — the wildcard
`Allow: /` is deliberate so Googlebot/Bingbot can still crawl in and see the
`noindex` tag (which is what actually removes/keeps it out of their index); only the
named AI-crawler lines are blocked outright, since they don't honor `noindex`.

## Known pending items (not yet done, not yet asked for)

- GitHub profile has no curated pinned repos — discussed as optional polish, not
  actioned (it's the owner's GitHub account, not something to script).
- Commits happen only when explicitly requested — don't assume prior changes are
  committed; check `git log` / `git status` before relying on that.
