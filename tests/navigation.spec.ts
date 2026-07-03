import { expect, test } from '@playwright/test';

test.describe('Navigation accessibility and responsiveness', () => {
  test('mobile menu stays within the viewport and supports keyboard navigation', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) > 700, 'Only relevant for narrow viewports.');

    await page.goto('/');

    const navToggle = page.locator('.nav-toggle');
    await navToggle.click();

    const navigation = page.locator('#site-navigation');
    await expect(navigation).toBeVisible();
    await expect(page.locator('body')).toHaveClass(/menu-open/);
    await expect(page.locator('#category-dropdown')).toBeHidden();
    await expect(page.locator('#recent-posts-dropdown')).toBeHidden();

    const navigationBounds = await navigation.boundingBox();
    expect(navigationBounds).not.toBeNull();
    expect(navigationBounds?.height ?? 0).toBeGreaterThan(150);
    expect((navigationBounds?.width ?? 0) - (page.viewportSize()?.width ?? 0)).toBeLessThanOrEqual(1);

    const horizontalOverflow = await page.evaluate(() => {
      const { documentElement, body } = document;
      return Math.max(documentElement.scrollWidth, body.scrollWidth) - documentElement.clientWidth;
    });
    expect(horizontalOverflow).toBeLessThanOrEqual(1);

    const categoriesToggle = page.locator('.dropdown-toggle').first();
    await categoriesToggle.focus();
    await page.keyboard.press('Enter');
    await expect(categoriesToggle).toHaveAttribute('aria-expanded', 'true');

    const firstCategoryLink = page.locator('#category-dropdown a').first();
    await expect(firstCategoryLink).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(categoriesToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#category-dropdown')).toBeHidden();

    const recentPostsToggle = page.locator('.dropdown-toggle').nth(1);
    await recentPostsToggle.scrollIntoViewIfNeeded();
    await expect(recentPostsToggle).toBeVisible();
    await recentPostsToggle.click();
    await expect(recentPostsToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#recent-posts-dropdown')).toBeVisible();
    await expect(page.locator('.theme-toggle--nav')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(recentPostsToggle).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Escape');
    await expect(navToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('desktop dropdown stays inside the viewport and theme toggle remains accessible', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) <= 700, 'Only relevant for non-mobile viewports.');

    await page.goto('/');

    await expect(page.locator('.nav-toggle')).not.toBeVisible();

    const recentPostsToggle = page.locator('.dropdown-toggle').nth(1);
    await recentPostsToggle.click();
    await expect(recentPostsToggle).toHaveAttribute('aria-expanded', 'true');

    const dropdownBounds = await page.locator('#recent-posts-dropdown').boundingBox();
    expect(dropdownBounds).not.toBeNull();

    if (dropdownBounds) {
      const viewport = page.viewportSize();
      expect(dropdownBounds.x).toBeGreaterThanOrEqual(0);
      expect(dropdownBounds.x + dropdownBounds.width).toBeLessThanOrEqual((viewport?.width ?? 0) + 1);
    }

    await page.keyboard.press('Escape');
    await expect(recentPostsToggle).toHaveAttribute('aria-expanded', 'false');

    const themeToggle = page.locator('.theme-toggle--nav');
    await expect(themeToggle).toBeVisible();
    await themeToggle.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('data-theme', /dark|light/);
  });
});
