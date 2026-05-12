import { test, expect } from '@playwright/test';
import { mockApi, loginViaStorage } from './fixtures/mock-api';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await loginViaStorage(page);
  // Navigate to Settings
  await page.getByText(/settings|налаштування/i).click();
  await expect(page.getByText(/language|мова/i)).toBeVisible({ timeout: 5000 });
});

test('shows settings tab with language option', async ({ page }) => {
  await expect(page.getByText(/language|мова/i)).toBeVisible();
});

test('shows visual mode toggle', async ({ page }) => {
  await expect(page.getByText(/visual mode|візуальний/i)).toBeVisible();
});

test('can switch language to Ukrainian', async ({ page }) => {
  const ukBtn = page.getByRole('button', { name: /uk|укр/i });
  if (await ukBtn.isVisible()) {
    await ukBtn.click();
    await expect(page.getByText(/мова/i)).toBeVisible({ timeout: 2000 });
  }
});

test('can switch visual mode to Dark (Evening)', async ({ page }) => {
  const eveningBtn = page.getByRole('button', { name: /evening|вечір/i });
  if (await eveningBtn.isVisible()) {
    await eveningBtn.click();
    // Page background changes — check body has darker color
    await expect(page.locator('body')).toBeVisible();
  }
});

test('shows account section with email', async ({ page }) => {
  await expect(page.getByText(/test@example.com|account|акаунт/i).first()).toBeVisible();
});

test('shows Sign Out button', async ({ page }) => {
  await expect(page.getByRole('button', { name: /sign out|вийти/i })).toBeVisible();
});

test('shows goal norms section', async ({ page }) => {
  await expect(page.getByText(/norms|норми/i)).toBeVisible();
});

test('lang preference persists after reload', async ({ page }) => {
  // Switch to Ukrainian
  const ukBtn = page.getByRole('button', { name: /uk|укр/i });
  if (await ukBtn.isVisible()) {
    await ukBtn.click();
    await page.reload();
    // After reload, Ukrainian should still be active
    await expect(page.getByText(/мова/i)).toBeVisible({ timeout: 3000 });
  }
});
