import { test, expect } from '@playwright/test';

test.describe('P0 - Onboarding Module', () => {
  
  test.describe('Registration', () => {
    
    test('TC-001: Successful user registration', async ({ page }) => {
      const uniqueEmail = `test${Date.now()}@example.com`;
      
      await page.goto('/register');
      
      await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
      
      await page.getByTestId('name-input').fill('Juan Pérez');
      await page.getByTestId('email-input').fill(uniqueEmail);
      await page.getByTestId('password-input').fill('Password123!');
      await page.getByTestId('confirm-password-input').fill('Password123!');
      
      await expect(page.getByTestId('register-button')).toBeEnabled();
      await page.getByTestId('register-button').click();
      
      await expect(page.getByTestId('success-message')).toBeVisible();
      await expect(page.getByTestId('success-message')).toContainText('Registration successful');
      
      await expect(page).toHaveURL('/login', { timeout: 5000 });
    });

    test('TC-002: Registration with missing required fields', async ({ page }) => {
      await page.goto('/register');
      
      const registerButton = page.getByTestId('register-button');
      await expect(registerButton).toBeDisabled();
      
      await page.getByTestId('name-input').fill('Test User');
      await expect(registerButton).toBeDisabled();
      
      await page.getByTestId('email-input').fill('test@example.com');
      await expect(registerButton).toBeDisabled();
      
      await page.getByTestId('password-input').fill('short');
      await expect(page.getByTestId('password-requirements')).toBeVisible();
      await expect(registerButton).toBeDisabled();
    });

    test('TC-002b: Registration with invalid email format', async ({ page }) => {
      await page.goto('/register');
      
      await page.getByTestId('name-input').fill('Test User');
      await page.getByTestId('email-input').fill('invalid-email');
      
      await expect(page.getByTestId('email-error')).toBeVisible();
      await expect(page.getByTestId('email-error')).toContainText('Please enter a valid email');
      
      await expect(page.getByTestId('register-button')).toBeDisabled();
    });

    test('TC-002c: Registration with password mismatch', async ({ page }) => {
      await page.goto('/register');
      
      await page.getByTestId('name-input').fill('Test User');
      await page.getByTestId('email-input').fill('test@example.com');
      await page.getByTestId('password-input').fill('Password123!');
      await page.getByTestId('confirm-password-input').fill('DifferentPassword123!');
      
      await expect(page.getByTestId('password-match-error')).toBeVisible();
      await expect(page.getByTestId('password-match-error')).toContainText('Passwords do not match');
      
      await expect(page.getByTestId('register-button')).toBeDisabled();
    });
  });

  test.describe('Login', () => {
    
    test('TC-003: Successful login', async ({ page }) => {
      await page.goto('/login');
      
      await expect(page.getByRole('heading', { name: 'Ahorro Digital' })).toBeVisible();
      
      await page.getByTestId('email-input').fill('test@example.com');
      await page.getByTestId('password-input').fill('Password123!');
      
      await expect(page.getByTestId('login-button')).toBeEnabled();
      await page.getByTestId('login-button').click();
      
      await expect(page).toHaveURL('/simulator', { timeout: 10000 });
      await expect(page.getByTestId('user-name')).toContainText('Test User');
    });

    test('TC-004: Login with invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
      await page.getByTestId('email-input').fill('wrong@example.com');
      await page.getByTestId('password-input').fill('WrongPassword!');
      await page.getByTestId('login-button').click();
      
      await expect(page.getByTestId('error-message')).toBeVisible();
      await expect(page.getByTestId('error-message')).toContainText('Invalid credentials');
      
      await expect(page).toHaveURL('/login');
    });

    test('TC-004b: Login with empty fields', async ({ page }) => {
      await page.goto('/login');
      
      await expect(page.getByTestId('login-button')).toBeDisabled();
      
      await page.getByTestId('email-input').fill('test@example.com');
      await expect(page.getByTestId('login-button')).toBeDisabled();
    });
  });

  test.describe('Session Management', () => {
    
    test('TC-003b: Logout functionality', async ({ page }) => {
      await page.goto('/login');
      await page.getByTestId('email-input').fill('test@example.com');
      await page.getByTestId('password-input').fill('Password123!');
      await page.getByTestId('login-button').click();
      
      await expect(page).toHaveURL('/simulator', { timeout: 10000 });
      
      await page.getByTestId('logout-button').click();
      
      await expect(page).toHaveURL('/login');
    });
  });
});
