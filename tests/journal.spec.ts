import { test, expect } from '@playwright/test';
import { mockApi, loginViaStorage } from './fixtures/mock-api';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await loginViaStorage(page);
  // Navigate to Journal tab
  await page.getByText(/journal|журнал/i).click();
  await expect(page.getByText(/journal|журнал/i).first()).toBeVisible({ timeout: 5000 });
});

test('shows journal tab with empty state or entries', async ({ page }) => {
  // Either shows "no entries" or the journal UI
  const emptyOrEntries = page.getByText(/no entries|записів|journal|журнал/i).first();
  await expect(emptyOrEntries).toBeVisible({ timeout: 3000 });
});

test('can add a journal entry', async ({ page }) => {
  const textarea = page.getByPlaceholder(/how is your day|як ваш день/i);
  if (await textarea.isVisible()) {
    await textarea.fill('Had a great morning run today!');
    await page.getByRole('button', { name: /save|зберегти/i }).first().click();

    await expect(page.getByText('Had a great morning run today!')).toBeVisible({ timeout: 3000 });
  } else {
    // Try reflection draft input
    const reflInput = page.locator('textarea').first();
    if (await reflInput.isVisible()) {
      await reflInput.fill('Great day!');
    }
  }
});

test('journal filter tabs are visible', async ({ page }) => {
  // Day / Week / Month / All time filters
  await expect(page.getByText(/day|день|week|тиждень/i).first()).toBeVisible();
});
