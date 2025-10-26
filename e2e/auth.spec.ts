import { test, expect, Page } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login form', async ({ page }: { page: Page }) => {
    await page.goto('/');

    // Check if login form is visible
    await expect(page.getByRole('heading', { name: 'Government Dashboard Login' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should login with mock credentials', async ({ page }: { page: Page }) => {
    await page.goto('/');

    // Fill in login form
    await page.getByLabel('Email').fill('executive@example.com');
    await page.getByLabel('Password').fill('password');

    // Click login button
    await page.getByRole('button', { name: 'Login' }).click();

    // Check if redirected to dashboard
    await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();
    await expect(page.getByText('Welcome, Executive User')).toBeVisible();
  });

  test('should display role-specific dashboard', async ({ page }: { page: Page }) => {
    await page.goto('/');

    // Login as executive
    await page.getByLabel('Email').fill('executive@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();

    // Check for executive-specific content
    await expect(page.getByText('Portfolio Overview')).toBeVisible();
    await expect(page.getByText('Risk Management')).toBeVisible();
    await expect(page.getByText('Project Statistics')).toBeVisible();
  });

  test('should logout successfully', async ({ page }: { page: Page }) => {
    await page.goto('/');

    // Login first
    await page.getByLabel('Email').fill('executive@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for dashboard to load
    await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();

    // Click logout
    await page.getByRole('button', { name: /Logout/i }).click();

    // Should be redirected to login page
    await expect(page.getByRole('heading', { name: 'Government Dashboard Login' })).toBeVisible();
  });
});
