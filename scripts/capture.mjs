import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
const [url, destination = 'reports/local/screenshots', sourceSha = 'unpublished-local-tree'] =
  process.argv.slice(2);
if (!url) throw new Error('Usage: capture.mjs URL [OUTPUT] [SOURCE_SHA]');
await fs.mkdir(destination, { recursive: true });
const browser = await chromium.launch({ channel: 'chromium' });
try {
  for (const [profile, viewport] of Object.entries({
    desktop: { width: 1440, height: 1000 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 390, height: 844 },
  })) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    for (const image of await page.locator('main img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((node) => node.decode());
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole('button', { name: 'Add Grid notebook to cart' }).click();
    // A full-page shot starts from the top so fixed skip navigation stays outside its unfocused viewport.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => window.scrollY === 0);
    await page.screenshot({
      path: path.join(destination, `${profile}-catalog.png`),
      fullPage: true,
    });
    await page.getByRole('button', { name: 'Open cart, 1 items' }).click();
    await page.screenshot({ path: path.join(destination, `${profile}-cart.png`) });
    await page.getByRole('button', { name: /Continue to demo checkout/ }).click();
    await page.getByRole('button', { name: 'Complete demo — no payment' }).click();
    await page.screenshot({ path: path.join(destination, `${profile}-checkout-error.png`) });
    await context.close();
  }
  await fs.writeFile(
    path.join(destination, 'manifest.json'),
    JSON.stringify(
      {
        url,
        sourceSha,
        dateUtc: new Date().toISOString(),
        chromeVersion: browser.version(),
        command: 'node scripts/capture.mjs URL OUTPUT SOURCE_SHA',
        scope: 'Actual local Chromium capture of synthetic products; no live commerce.',
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
