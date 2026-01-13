import { test, expect } from '@playwright/test';

test.describe('P1 - Simulator Module', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('Password123!');
    await page.getByTestId('login-button').click();
    await expect(page).toHaveURL('/simulator', { timeout: 10000 });
  });

  test('TC-005: Successful savings simulation', async ({ page }) => {
    await page.getByTestId('amount-input').fill('1000000');
    await page.getByTestId('term-select').selectOption('12');
    
    await expect(page.getByTestId('calculate-button')).toBeEnabled();
    await page.getByTestId('calculate-button').click();
    
    await expect(page.getByTestId('simulation-results')).toBeVisible();
    await expect(page.getByTestId('product-name')).toBeVisible();
    await expect(page.getByTestId('initial-amount')).toContainText('1,000,000');
    await expect(page.getByTestId('term-result')).toContainText('12 months');
    await expect(page.getByTestId('annual-rate')).toBeVisible();
    await expect(page.getByTestId('interest-earned')).toBeVisible();
    await expect(page.getByTestId('final-amount')).toBeVisible();
  });

  test('TC-006: Simulation with zero amount', async ({ page }) => {
    await page.getByTestId('amount-input').fill('0');
    await page.getByTestId('term-select').selectOption('12');
    
    await expect(page.getByTestId('calculate-button')).toBeDisabled();
  });

  test('TC-007: Simulation with negative amount (input validation)', async ({ page }) => {
    const amountInput = page.getByTestId('amount-input');
    await amountInput.fill('-50000');
    
    const inputValue = await amountInput.inputValue();
    expect(inputValue).not.toContain('-');
  });

  test('TC-008: Simulation with different terms', async ({ page }) => {
    const amount = '500000';
    const results = {};
    
    for (const term of ['3', '6', '12', '24']) {
      await page.getByTestId('amount-input').clear();
      await page.getByTestId('amount-input').fill(amount);
      await page.getByTestId('term-select').selectOption(term);
      await page.getByTestId('calculate-button').click();
      
      await expect(page.getByTestId('simulation-results')).toBeVisible();
      
      const interestText = await page.getByTestId('interest-earned').textContent();
      results[term] = interestText;
    }
    
    const interestValues = Object.values(results).map(text => 
      parseFloat(text.replace(/[^0-9.]/g, ''))
    );
    
    for (let i = 1; i < interestValues.length; i++) {
      expect(interestValues[i]).toBeGreaterThan(interestValues[i - 1]);
    }
  });

  test('TC-008b: Calculate button disabled without term selection', async ({ page }) => {
    await page.getByTestId('amount-input').fill('1000000');
    
    await expect(page.getByTestId('calculate-button')).toBeDisabled();
  });

  test('TC-008c: Calculate button disabled without amount', async ({ page }) => {
    await page.getByTestId('term-select').selectOption('12');
    
    await expect(page.getByTestId('calculate-button')).toBeDisabled();
  });
});
