![Node.js CI](https://github.com/jayasai470/jayasai470.github.io/workflows/Node.js%20CI/badge.svg)

# jayasai470.github.io

Personal portfolio site and PDF resume for Jaya Sai Krishna Muppalla, built
on a single YAML source of truth so adding a job, project, or skill updates both
outputs at once.

## Stack

- **Vite + React 19** for the site (functional components, no class components)
- **Vitest** for tests
- **Handlebars + Puppeteer** to render the résumé to HTML and then to a PDF
- **Node 24** (see `.nvmrc` / `package.json#engines`)

## Architecture

```
content/resume.yaml  (hand-edited — the only file you need to touch for content changes)
        │
        ▼  yarn build:content (scripts/build-content.mjs)
public/resumeData.json  (generated, committed — see content/README.md)
        │
        ├──▶ the website (fetched at runtime by src/App.jsx)
        │
        └──▶ scripts/build-resume.cjs + resume.hbs + public/css/resume.css
                        │
                        ▼
             public/<name>-Resume.pdf  (generated: single column, no tables,
             no graphical skill bars, real selectable text)
```

See `content/README.md` for the content-authoring format (adding a job, a project,
editing skills) and the handful of résumé-specific conventions (the two summary
fields, how company grouping works, etc).

## Local setup

```
nvm install   # picks up the version pinned in .nvmrc
nvm use
corepack enable  # or: npm install -g yarn
yarn install
```

## Scripts

| Command             | What it does                                                |
| -------------------- | ------------------------------------------------------------ |
| `yarn dev`           | Builds content, then starts the Vite dev server (live-reloads on `content/resume.yaml` changes) |
| `yarn build`         | Builds content, then the production site into `dist/`       |
| `yarn build:file`    | Builds content, then regenerates the résumé PDF                   |
| `yarn build:content` | Just regenerates `public/resumeData.json` from the YAML      |
| `yarn test`          | Runs the Vitest suite                                        |
| `yarn deploy`        | Publishes `dist/` to the `master` branch (GitHub Pages)      |

## Deployment

Pushes to `source` run CI (`.github/workflows/node.js.yml`): install, generate the
résumé, test, build, then deploy `dist/` to the `master` branch, which GitHub Pages
serves.
