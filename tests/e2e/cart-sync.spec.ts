import { test, expect } from '@playwright/test';

const key = 'everyday-cart-v1';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('list', { name: 'Products' }).getByRole('listitem')).toHaveCount(12);
});

test('keeps catalog keyboard focus during real cross-tab cart updates', async ({
  page,
  context,
}) => {
  const add = page.getByRole('button', { name: 'Add Grid notebook to cart' });
  await add.focus();
  const other = await context.newPage();
  await other.goto('./');
  await other.getByRole('button', { name: 'Add Arc desk lamp to cart' }).click();
  await expect(page.getByRole('button', { name: 'Open cart, 1 items' })).toBeVisible();
  await page.bringToFront();
  await expect(add).toBeFocused();
  await other.evaluate((storageKey) => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ version: 1, lines: { 'grid-notebook': 20 } }),
    );
  }, key);
  await expect(add).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Open cart, 20 items' })).toBeFocused();
  await other.close();
});

test('requires cart review after another tab changes a checkout', async ({ page, context }) => {
  await page.getByRole('button', { name: 'Add Grid notebook to cart' }).click();
  await page.getByRole('button', { name: 'Open cart, 1 items' }).click();
  await page.getByRole('button', { name: /Continue to demo checkout/ }).click();
  await page.getByLabel('Demo name', { exact: true }).fill('Demo shopper');
  await page.getByLabel('Demo email (ending in .test)').fill('shopper@example.test');
  const other = await context.newPage();
  await other.goto('./');
  await other.getByRole('button', { name: 'Add Arc desk lamp to cart' }).click();
  await expect(page.locator('#dialog-title')).toHaveText('Your cart');
  await expect(page.locator('#checkout-form')).toBeHidden();
  await expect(
    page.getByRole('heading', { name: 'Arc desk lamp', exact: true }).last(),
  ).toBeVisible();
  await expect(page.locator('#cart-status')).toContainText('Review your cart');
  await page.bringToFront();
  await expect(page.getByRole('button', { name: /Continue to demo checkout/ })).toBeFocused();
  await other.close();
});

test('ignores session-storage notifications for the same key', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Grid notebook to cart' }).click();
  await page.evaluate((storageKey) => {
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: storageKey,
        newValue: JSON.stringify({ version: 1, lines: { 'arc-lamp': 2 } }),
        storageArea: sessionStorage,
      }),
    );
  }, key);
  await expect(page.getByRole('button', { name: 'Open cart, 1 items' })).toBeVisible();
});

test('a delayed storage notification cannot replay an older cart snapshot', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Grid notebook to cart' }).click();
  await page.evaluate((storageKey) => {
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: storageKey,
        newValue: JSON.stringify({ version: 1, lines: {} }),
        storageArea: localStorage,
      }),
    );
  }, key);
  await expect(page.getByRole('button', { name: 'Open cart, 1 items' })).toBeVisible();
});
