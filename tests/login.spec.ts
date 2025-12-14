import { test, expect } from '@playwright/test';

// Login Page Component Visibility Tests
test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('http://localhost:3000/');
  });

  test('should display the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Go-card management system' })).toBeVisible();
  });

  test('should display the sign in heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('should display username input field', async ({ page }) => {
    const usernameInput = page.getByPlaceholder('Enter username');
    await expect(usernameInput).toBeVisible();
  });

  test('should display password input field', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('Enter password');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should display sign in button', async ({ page }) => {
    const signInButton = page.getByRole('button', { name: 'Sign in' });
    await expect(signInButton).toBeVisible();
  });

  test('should display all login form elements', async ({ page }) => {
    // Check all elements are present together
    await expect(page.getByRole('heading', { name: 'Go-card management system' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter username')).toBeVisible();
    await expect(page.getByPlaceholder('Enter password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  // Functional Test: Successful Login
  test('should login successfully and navigate to management page', async ({ page }) => {
    // Fill in username
    await page.getByPlaceholder('Enter username').fill('alice');
    
    // Fill in password
    await page.getByPlaceholder('Enter password').fill('1234');
    
    // Click sign in button
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Wait for navigation to management page
    await page.waitForURL('**/dashboard-admin', { timeout: 5000 });
    
    // Verify we're on the management page
    await expect(page).toHaveURL(/.*dashboard-admin/);
  });

  // Negative Test: Failed Login
  test('should show error toast for invalid credentials', async ({ page }) => {
    // Fill in invalid username
    await page.getByPlaceholder('Enter username').fill('hackerman');
    
    // Fill in password
    await page.getByPlaceholder('Enter password').fill('1234');
    
    // Click sign in button
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Wait for and verify error toast appears
    await expect(page.getByText('Sign in failed')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Invalid username or password.')).toBeVisible();
    await expect(page).toHaveURL(/.*/);
  });
});
