import { test, expect } from '@playwright/test';

test.describe('Mobilnavigering', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes('mobile'), 'Körs bara för mobila projekt');
    await page.goto('/');
  });

  test('mobilmenyn håller sig inom viewport och visar dropdown-innehåll', async ({ page }) => {
    const navToggle = page.locator('.nav-toggle-button');
    await navToggle.click();

    const navPanel = page.locator('.site-nav .trigger');
    await expect(navPanel).toBeVisible();

    const viewportWidth = page.viewportSize()?.width ?? 0;

    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(viewportWidth + 1);

    const navPanelBox = await navPanel.boundingBox();
    expect(navPanelBox).not.toBeNull();
    expect(navPanelBox!.x).toBeGreaterThanOrEqual(0);
    expect(navPanelBox!.x + navPanelBox!.width).toBeLessThanOrEqual(viewportWidth + 1);

    const categoriesToggle = page.getByRole('button', { name: 'Kategorier' });
    await categoriesToggle.click();

    const firstCategoryLink = page.locator('#category-dropdown a').first();
    await expect(firstCategoryLink).toBeVisible();

    const categoryLinkBox = await firstCategoryLink.boundingBox();
    expect(categoryLinkBox).not.toBeNull();
    expect(categoryLinkBox!.x).toBeGreaterThanOrEqual(0);
    expect(categoryLinkBox!.x + categoryLinkBox!.width).toBeLessThanOrEqual(viewportWidth + 1);

    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(viewportWidth + 1);
  });
});
