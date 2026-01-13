import { test, expect } from '@playwright/test';

test.describe('P2 - Products Module', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('Password123!');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/simulator', { timeout: 10000 });
  });

  test('TC-009: View products list', async ({ page }) => {
    await page.getByRole('link', { name: 'Products' }).click();
    await expect(page).toHaveURL('/products');
    
    await expect(page.getByRole('heading', { name: 'Savings Products' })).toBeVisible();
    
    const productsList = page.getByTestId('products-list');
    await expect(productsList).toBeVisible();
    
    const productCards = productsList.locator('[data-testid^="product-card-"]');
    await expect(productCards).toHaveCount(4);
  });

  test('TC-010: View product details', async ({ page }) => {
    await page.getByRole('link', { name: 'Products' }).click();
    await expect(page).toHaveURL('/products');
    
    await page.getByTestId('product-card-1').click();
    
    await expect(page.getByTestId('product-modal')).toBeVisible();
    await expect(page.getByTestId('product-details')).toBeVisible();
    await expect(page.getByTestId('detail-product-name')).toBeVisible();
    await expect(page.getByTestId('simulate-button')).toBeVisible();
  });

  test('TC-010b: Close product modal', async ({ page }) => {
    await page.getByRole('link', { name: 'Products' }).click();
    await page.getByTestId('product-card-1').click();
    
    await expect(page.getByTestId('product-modal')).toBeVisible();
    
    await page.getByTestId('close-modal-button').click();
    
    await expect(page.getByTestId('product-modal')).not.toBeVisible();
  });

  test('TC-011: Products page - unauthorized access (401)', async ({ page, context }) => {
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
    
    await page.goto('/products');
    
    await expect(page).toHaveURL('/login');
  });
});
