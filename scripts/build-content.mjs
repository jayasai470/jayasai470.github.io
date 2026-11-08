// Compiles content/resume.yaml (hand-edited) into public/resumeData.json (generated —
// consumed by the React site at runtime and by scripts/build-resume.cjs for the PDF).
// See content/README.md for the authoring format.

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'content', 'resume.yaml');
const outputPath = path.join(root, 'public', 'resumeData.json');

// YAML folded scalars (`>`) keep a trailing newline by default — trim every string
// leaf so free-text fields (bio, summary, ...) come out clean regardless of how
// they're authored.
function deepTrim(value) {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map(deepTrim);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, deepTrim(v)]));
  }
  return value;
}

export function buildContent() {
  const content = deepTrim(YAML.parse(readFileSync(sourcePath, 'utf8')));
  const { main, skillmessage, summary, education, experience, skillCategories, projects } = content;

  const resumeData = {
    main,
    resume: {
      skillmessage,
      summary,
      education,
      skillCategories,
      work: (experience ?? []).map((role) => ({
        ...role,
        years: `${role.dateFrom} – ${role.dateTo}`,
      })),
    },
    projects: projects ?? [],
  };

  writeFileSync(outputPath, `${JSON.stringify(resumeData, null, 2)}\n`);
  console.log(
    `Generated public/resumeData.json from content/resume.yaml (${resumeData.resume.work.length} roles, ${resumeData.projects.length} projects)`
  );
  return resumeData;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  buildContent();
}
