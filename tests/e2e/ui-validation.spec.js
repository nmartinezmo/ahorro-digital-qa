import { test, expect } from '@playwright/test';

test.describe('P2 - UI Validation Tests', () => {
  
  test('TC-012: Disabled button states on registration', async ({ page }) => {
    await page.goto('/register');
    
    const registerButton = page.getByTestId('register-button');
    await expect(registerButton).toBeDisabled();
    await expect(registerButton).toHaveCSS('opacity', '0.5');
    
    await page.getByTestId('name-input').fill('Test User');
    await expect(registerButton).toBeDisabled();
    
    await page.getByTestId('email-input').fill('test@example.com');
    await expect(registerButton).toBeDisabled();
    
    await page.getByTestId('password-input').fill('Password123!');
    await expect(registerButton).toBeDisabled();
    
    await page.getByTestId('confirm-password-input').fill('Password123!');
    await expect(registerButton).toBeEnabled();
    await expect(registerButton).not.toHaveCSS('opacity', '0.5');
  });

  test('TC-012b: Disabled button states on login', async ({ page }) => {
    await page.goto('/login');
    
    const loginButton = page.getByTestId('login-button');
    await expect(loginButton).toBeDisabled();
    
    await page.getByTestId('email-input').fill('test@example.com');
    await expect(loginButton).toBeDisabled();
    
    await page.getByTestId('password-input').fill('Password123!');
    await expect(loginButton).toBeEnabled();
  });

  test('TC-012c: Error message visibility on invalid login', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByTestId('email-input').fill('wrong@example.com');
    await page.getByTestId('password-input').fill('WrongPass123!');
    await page.getByTestId('login-button').click();
    
    const errorMessage = page.getByTestId('error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveCSS('background-color', 'rgb(254, 242, 242)');
  });

  test('TC-012d: Navigation between pages', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('Password123!');
    await page.getByTestId('login-button').click();
    
    await expect(page).toHaveURL('/simulator', { timeout: 10000 });
    
    await page.getByRole('link', { name: 'Products' }).click();
    await expect(page).toHaveURL('/products');
    
    await page.getByRole('link', { name: 'Simulator' }).click();
    await expect(page).toHaveURL('/simulator');
  });

  test('TC-012e: Form input validation feedback', async ({ page }) => {
    await page.goto('/register');
    
    await page.getByTestId('email-input').fill('invalid');
    await page.getByTestId('email-input').blur();
    
    const emailInput = page.getByTestId('email-input');
    await expect(emailInput).toHaveClass(/border-red-300/);
    await expect(page.getByTestId('email-error')).toBeVisible();
    
    await page.getByTestId('email-input').fill('valid@example.com');
    await expect(emailInput).not.toHaveClass(/border-red-300/);
    await expect(page.getByTestId('email-error')).not.toBeVisible();
  });
});
