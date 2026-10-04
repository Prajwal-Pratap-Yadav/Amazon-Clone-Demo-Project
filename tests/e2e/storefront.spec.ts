import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('list', { name: 'Products' }).getByRole('listitem')).toHaveCount(12);
});
test('combines search category and price sort and resets empty results', async ({ page }) => {
  await page.getByRole('searchbox').fill('DESK light');
  await expect(page.getByRole('list', { name: 'Products' }).getByRole('listitem')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Arc desk lamp' })).toBeVisible();
  await page.getByRole('searchbox').fill('');
  await page.getByLabel('Category', { exact: true }).selectOption('Home');
  await page.getByLabel('Sort by').selectOption('price-high');
  await expect(
    page.getByRole('list', { name: 'Products' }).getByRole('heading').first(),
  ).toHaveText('Linen cushion');
  await page.getByRole('searchbox').fill('<img onerror=alert(1)>');
  await expect(page.getByRole('heading', { name: 'No matches this time.' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(page.getByRole('list', { name: 'Products' }).getByRole('listitem')).toHaveCount(12);
});
test('persists a cart changes integer totals and validates simulated checkout', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Add Grid notebook to cart' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Open cart, 1 items' }).click();
  const quantity = page.getByRole('spinbutton', { name: 'Quantity for Grid notebook' });
  await quantity.fill('2');
  await quantity.press('Tab');
  await expect(page.locator('#total')).toHaveText('₹847');
  await page.getByRole('button', { name: /Continue to demo checkout/ }).click();
  await page.getByRole('button', { name: 'Complete demo — no payment' }).click();
  await expect(page.locator('#error-summary')).toBeFocused();
  await expect(page.locator('#demo-name')).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Demo name', { exact: true }).fill('Demo shopper');
  await page.getByLabel('Demo email (ending in .test)').fill('shopper@example.test');
  await page.getByRole('button', { name: 'Complete demo — no payment' }).click();
  await expect(page.getByRole('heading', { name: 'That was a practice order.' })).toBeFocused();
  await expect(page.locator('#confirmation-total')).toContainText('₹847');
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('everyday-cart-v1') ?? '{}')),
  ).toEqual({ version: 1, lines: {} });
  await page.getByRole('button', { name: 'Keep exploring' }).click();
  await expect(page.getByRole('button', { name: 'Open cart, 0 items' })).toBeFocused();
});
test('rejects invalid quantities and removes lines without losing modal focus', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Add Grid notebook to cart' }).click();
  await page.getByRole('button', { name: 'Open cart, 1 items' }).click();
  const quantity = page.getByRole('spinbutton', { name: 'Quantity for Grid notebook' });
  await quantity.fill('21');
  await quantity.press('Tab');
  await expect(quantity).toHaveValue('1');
  await expect(page.locator('#cart-status')).toContainText('Choose a quantity');
  await page.getByRole('button', { name: 'Remove Grid notebook' }).click();
  await expect(page.getByRole('button', { name: 'Close cart' })).toBeFocused();
  await expect(page.getByRole('button', { name: /Continue to demo checkout/ })).toBeDisabled();
});
test('supports native keyboard modal focus and Escape return', async ({ page }) => {
  const cart = page.getByRole('button', { name: 'Open cart, 0 items' });
  await cart.focus();
  await cart.press('Enter');
  await expect(page.getByRole('button', { name: 'Close cart' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  expect(
    await page.evaluate(() =>
      document.querySelector('#cart-dialog')?.contains(document.activeElement),
    ),
  ).toBe(true);
  await page.keyboard.press('Escape');
  await expect(cart).toBeFocused();
});
test('has no serious or critical WCAG axe violations in catalog cart and checkout', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const state of ['catalog', 'cart', 'checkout']) {
    if (state === 'cart') {
      await page.getByRole('button', { name: 'Add Grid notebook to cart' }).click();
      await page.getByRole('button', { name: 'Open cart, 1 items' }).click();
    }
    if (state === 'checkout')
      await page.getByRole('button', { name: /Continue to demo checkout/ }).click();
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      result.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')),
      state,
    ).toEqual([]);
  }
  expect(errors).toEqual([]);
});
test('fits a narrow viewport and loads all local illustrations', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const image of await page.locator('main img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty('complete', true);
    expect(await image.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(
      0,
    );
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});
test('continues in memory when storage is blocked', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Storage blocked');
      },
    });
  });
  await page.reload();
  await page.getByRole('button', { name: 'Add Grid notebook to cart' }).click();
  await page.getByRole('button', { name: 'Open cart, 1 items' }).click();
  await expect(page.locator('#storage-note')).toContainText('storage is unavailable');
  await expect(page.locator('#total')).toHaveText('₹498');
});
test('recovers a tampered persisted cart and observes other tab clearing', async ({
  page,
  context,
}) => {
  await page.evaluate(() =>
    localStorage.setItem(
      'everyday-cart-v1',
      '{"version":1,"lines":{"grid-notebook":1,"unknown":10,"arc-lamp":99}}',
    ),
  );
  await page.reload();
  await page.getByRole('button', { name: 'Open cart, 1 items' }).click();
  await expect(page.locator('#total')).toHaveText('₹498');
  const other = await context.newPage();
  await other.goto('./');
  await other.evaluate(() => localStorage.clear());
  await expect(page.locator('#empty-cart')).toBeVisible();
  await expect(page.getByRole('button', { name: /Continue to demo checkout/ })).toBeDisabled();
  await other.close();
});
