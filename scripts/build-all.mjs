// Generate both committed résumé outputs from the single YAML source.
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildContent } from './build-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

buildContent();
execFileSync(process.execPath, ['scripts/build-resume.cjs'], {
  cwd: root,
  stdio: 'inherit',
});
