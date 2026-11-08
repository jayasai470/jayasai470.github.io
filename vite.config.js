import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { buildContent } from './scripts/build-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Rebuilds public/resumeData.json and reloads the page whenever content/resume.yaml
// changes, so editing a job or project is reflected immediately. Reuses Vite's own
// watcher (rather than a separate fs.watch) so it's cleaned up correctly in every
// context, including Vitest's internal dev server.
function contentWatcher() {
  const resumeYaml = path.resolve(__dirname, 'content', 'resume.yaml');
  return {
    name: 'resume-content-watcher',
    configureServer(server) {
      server.watcher.add(resumeYaml);
      server.watcher.on('change', (file) => {
        if (file !== resumeYaml) return;
        try {
          buildContent();
          server.ws.send({ type: 'full-reload' });
        } catch (err) {
          console.error('[content] rebuild failed:', err.message);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), contentWatcher()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true,
  },
});
