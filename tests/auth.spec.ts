import { test, expect } from '@playwright/test';
import { mockApi } from './fixtures/mock-api';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  // Wait for auth screen
  await expect(page.getByPlaceholder(/email/i)).toBeVisible({ timeout: 5000 });
});

test('shows login screen when not authenticated', async ({ page }) => {
  await expect(page.getByPlaceholder(/email/i)).toBeVisible();
  await expect(page.getByPlaceholder(/password/i)).toBeVisible();
});

test('can switch to register mode', async ({ page }) => {
  // The mode-switch link (not the submit button)
  await page.getByText(/sign up/i, { exact: false }).first().click();
  await expect(page.getByPlaceholder(/your name/i)).toBeVisible();
});

test('login with valid credentials → enters app', async ({ page }) => {
  await page.getByPlaceholder(/email/i).fill('test@example.com');
  await page.getByPlaceholder(/password/i).fill('password123');
  // Last button = submit (first = mode-switcher tab)
  await page.getByRole('button', { name: /sign in/i }).last().click();

  await expect(page.getByText(/today|сьогодні/i).first()).toBeVisible({ timeout: 5000 });
  await expect(page.getByPlaceholder(/email/i)).not.toBeVisible();
});

test('login with wrong password → shows error', async ({ page }) => {
  await page.getByPlaceholder(/email/i).fill('wrong@example.com');
  await page.getByPlaceholder(/password/i).fill('wrongpass');
  await page.getByRole('button', { name: /sign in/i }).last().click();

  await expect(page.getByText(/invalid credentials/i)).toBeVisible({ timeout: 3000 });
});

test('register → enters app', async ({ page }) => {
  // Switch to register mode
  await page.getByText(/sign up/i, { exact: false }).first().click();
  await expect(page.getByPlaceholder(/your name/i)).toBeVisible();

  await page.getByPlaceholder(/your name/i).fill('New User');
  await page.getByPlaceholder(/email/i).fill('new@example.com');
  await page.getByPlaceholder(/password/i).fill('newpass123');
  await page.getByRole('button', { name: /sign up/i }).last().click();

  await expect(page.getByText(/today|сьогодні/i).first()).toBeVisible({ timeout: 5000 });
});

test('logout → returns to login screen', async ({ page }) => {
  // Login first
  await page.getByPlaceholder(/email/i).fill('test@example.com');
  await page.getByPlaceholder(/password/i).fill('password123');
  await page.getByRole('button', { name: /sign in/i }).last().click();
  await expect(page.getByText(/today|сьогодні/i).first()).toBeVisible({ timeout: 5000 });

  // Go to settings and sign out
  await page.getByText(/settings|налаштування/i).click();
  await page.getByRole('button', { name: /sign out|вийти/i }).click();

  await expect(page.getByPlaceholder(/email/i)).toBeVisible({ timeout: 3000 });
});
