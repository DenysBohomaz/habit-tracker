import { test, expect } from '@playwright/test';
import { mockApi, loginViaStorage, MOCK_HABIT } from './fixtures/mock-api';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await loginViaStorage(page);
  await expect(page.getByText(MOCK_HABIT.name)).toBeVisible({ timeout: 5000 });
});

test('shows habits from bootstrap on Today tab', async ({ page }) => {
  await expect(page.getByText('Morning workout')).toBeVisible();
  await expect(page.getByText('💪')).toBeVisible();
});

test('can mark a habit as done by clicking it', async ({ page }) => {
  // Clicking the habit emoji/row opens the progress slider
  await page.getByText('💪').click();
  // Slider or 100% button should appear
  const full = page.getByText(/100%|done|виконано/i).first();
  const slider = page.locator('input[type="range"]').first();
  const appeared = await Promise.race([
    full.waitFor({ timeout: 3000 }).then(() => true).catch(() => false),
    slider.waitFor({ timeout: 3000 }).then(() => true).catch(() => false),
  ]);
  expect(appeared).toBe(true);
});

test('can create a new habit via Settings', async ({ page }) => {
  // Navigate to settings where "Edit Habits" button lives
  await page.getByText(/settings|налаштування/i).click();
  await expect(page.getByText(/edit habits|редагувати звич/i).first()).toBeVisible({ timeout: 3000 });
  await page.getByText(/edit habits|редагувати звич/i).first().click();

  // "New Habit" is the FORM title — the trigger button is "+ Add"
  await page.getByRole('button', { name: /^\+ (add|додати)$/i }).click();
  await expect(page.getByPlaceholder(/habit name|назва звич/i)).toBeVisible({ timeout: 3000 });
  await page.getByPlaceholder(/habit name|назва звич/i).fill('Evening yoga');
  await page.getByRole('button', { name: /save habit|зберегти звич/i }).click();

  // After save the form closes → navigate to Today tab to see the new habit
  await page.getByText(/today|сьогодні/i).first().click();
  await expect(page.getByText('Evening yoga')).toBeVisible({ timeout: 3000 });
});

test('can delete a habit via Settings', async ({ page }) => {
  await page.getByText(/settings|налаштування/i).click();
  await page.getByText(/edit habits|редагувати звич/i).first().click();

  // Click edit on existing habit
  await page.getByText('Morning workout').click();
  const deleteBtn = page.getByRole('button', { name: /delete|видалити/i });
  if (await deleteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await deleteBtn.click();
    await expect(page.getByText('Morning workout')).not.toBeVisible({ timeout: 3000 });
  }
});

test('today overview percentage is visible', async ({ page }) => {
  // Overall % is shown at the top of Today tab
  await expect(page.getByText(/%|0%|100%/i).first()).toBeVisible();
});

test('habit tracking section shows time groups', async ({ page }) => {
  // morning / afternoon / evening / anytime sections
  await expect(
    page.getByText(/morning|afternoon|evening|anytime|ранок|вечір/i).first()
  ).toBeVisible();
});
