import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
const output = process.argv[2] ?? 'reports/local/reproduced';
const url = 'http://127.0.0.1:4173/Amazon-Clone-Demo-Project/';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview'], {
  stdio: 'inherit',
});
function run(script, target) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [script, url, target, process.env.GITHUB_SHA ?? 'unpublished-local-tree'],
      { stdio: 'inherit' },
    );
    child.on('error', reject);
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`)),
    );
  });
}
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      if ((await fetch(url)).ok) {
        ready = true;
        break;
      }
    } catch {
      /* startup */
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error('Preview server failed to start within 15 seconds');
  await fs.mkdir(output, { recursive: true });
  await run('scripts/audit.mjs', path.join(output, 'audit'));
  await run('scripts/capture.mjs', path.join(output, 'screenshots'));
  await run('scripts/check_budgets.mjs', path.join(output, 'audit'));
} finally {
  server.kill('SIGTERM');
}
