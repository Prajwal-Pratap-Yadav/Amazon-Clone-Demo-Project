import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/lr-desktop-config.js';
import { launch } from 'chrome-launcher';

const [url, destination, sourceSha] = process.argv.slice(2);
if (!url || !destination || !sourceSha) throw new Error('Usage: audit.mjs URL OUTPUT SOURCE_SHA');
const output = path.resolve(destination);
await fs.mkdir(path.join(output, 'lighthouse'), { recursive: true });
const browser = await chromium.launch({ channel: 'chromium' });
const chromeVersion = browser.version();
const axeReports = {};
try {
  for (const [profile, viewport] of Object.entries({
    desktop: { width: 1440, height: 1000 },
    mobile: { width: 390, height: 844 },
  })) {
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const consoleErrors = [];
    const failedRequests = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));
    page.on('requestfailed', (request) =>
      failedRequests.push({ url: request.url(), error: request.failure() }),
    );
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.screenshot({ path: path.join(output, `${profile}.png`), fullPage: true });
    axeReports[profile] = {
      ...(await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()),
      consoleErrors,
      failedRequests,
      viewport,
      horizontalOverflow: await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      ),
    };
    await context.close();
  }
} finally {
  await browser.close();
}
await fs.writeFile(path.join(output, 'axe.json'), JSON.stringify(axeReports, null, 2));

const medians = {};
const configurations = {};
let lighthouseVersion;
for (const profile of ['mobile', 'desktop']) {
  const scores = [];
  for (let run = 1; run <= 5; run += 1) {
    const chrome = await launch({
      chromePath: chromium.executablePath(),
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
    });
    try {
      const result = await lighthouse(
        url,
        {
          port: chrome.port,
          output: 'json',
          logLevel: 'error',
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        },
        profile === 'desktop' ? desktopConfig : undefined,
      );
      if (!result || result.lhr.runtimeError)
        throw new Error(JSON.stringify(result?.lhr.runtimeError));
      lighthouseVersion = result.lhr.lighthouseVersion;
      configurations[profile] = result.lhr.configSettings;
      scores.push(
        Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, value]) => [key, value.score]),
        ),
      );
      await fs.writeFile(
        path.join(output, 'lighthouse', `${profile}-${run}.json`),
        JSON.stringify(result.lhr),
      );
      console.log(profile, run, scores.at(-1));
    } finally {
      await chrome.kill();
    }
  }
  medians[profile] = Object.fromEntries(
    Object.keys(scores[0]).map((key) => {
      const values = scores.map((row) => row[key]).sort((a, b) => a - b);
      return [key, { median: values[2], minimum: values[0], maximum: values[4], values }];
    }),
  );
}
const manifest = {
  sourceSha,
  url,
  dateUtc: new Date().toISOString(),
  node: process.version,
  platform: `${os.platform()} ${os.release()} ${os.arch()}`,
  cpu: os.cpus()[0]?.model,
  logicalCpus: os.cpus().length,
  chromeVersion,
  lighthouseVersion,
  runsPerProfile: 5,
  configurations,
  medians,
  scope:
    'Local headless Chromium; synthetic static page; lab scores vary. Automated accessibility is not full WCAG conformance.',
};
await fs.writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Audit medians:', JSON.stringify(medians));
