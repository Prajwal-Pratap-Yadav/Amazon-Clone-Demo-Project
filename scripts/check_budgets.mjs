import fs from 'node:fs/promises';
import path from 'node:path';
const folder = process.argv[3] ?? process.argv[2];
if (!folder) throw new Error('Provide an audit folder');
const manifest = JSON.parse(await fs.readFile(path.join(folder, 'manifest.json'), 'utf8'));
const budgets = JSON.parse(
  await fs.readFile(new URL('../configs/budgets.json', import.meta.url), 'utf8'),
);
const failures = [];
for (const [profile, metrics] of Object.entries(manifest.medians))
  for (const [category, budget] of Object.entries(budgets))
    if (metrics[category].median < budget)
      failures.push(`${profile}/${category}: ${metrics[category].median} < ${budget}`);
const axe = JSON.parse(await fs.readFile(path.join(folder, 'axe.json'), 'utf8'));
for (const [profile, result] of Object.entries(axe)) {
  if (result.violations.some((v) => ['serious', 'critical'].includes(v.impact)))
    failures.push(`${profile}: axe serious/critical`);
  if (result.horizontalOverflow || result.consoleErrors.length || result.failedRequests.length)
    failures.push(`${profile}: overflow or browser error`);
}
if (failures.length) throw new Error(failures.join('\n'));
console.log('Median Lighthouse budgets, browser error and accessibility gates passed.');
