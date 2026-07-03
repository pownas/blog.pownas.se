import { expect, test } from '@playwright/test';

const VIEWPORT_BOUNDARY_TOLERANCE = 1;

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
    expect((navigationBounds?.width ?? 0) - (page.viewportSize()?.width ?? 0)).toBeLessThanOrEqual(VIEWPORT_BOUNDARY_TOLERANCE);

    const horizontalOverflow = await page.evaluate(() => {
      const { documentElement, body } = document;
      return Math.max(documentElement.scrollWidth, body.scrollWidth) - documentElement.clientWidth;
    });
    expect(horizontalOverflow).toBeLessThanOrEqual(1);

    const categoriesToggle = page.locator('.dropdown-toggle').first();
    await categoriesToggle.focus();
    await page.keyboard.press('Enter');
    await expect(categoriesToggle).toHaveAttribute('aria-expanded', 'true');

    const categoryDropdown = page.locator('#category-dropdown');
    const firstCategoryLink = categoryDropdown.locator('a').first();
    await expect(firstCategoryLink).toBeVisible();
    const categoryDropdownStyles = await categoryDropdown.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        overflowY: styles.overflowY,
        backgroundAttachment: styles.backgroundAttachment,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight
      };
    });
    expect(categoryDropdownStyles.overflowY).toBe('auto');
    expect(categoryDropdownStyles.backgroundAttachment).toContain('local');
    expect(categoryDropdownStyles.backgroundAttachment).toContain('scroll');
    expect(categoryDropdownStyles.scrollHeight).toBeGreaterThanOrEqual(categoryDropdownStyles.clientHeight);

    await page.keyboard.press('Escape');
    await expect(categoriesToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#category-dropdown')).toBeHidden();

    const recentPostsToggle = page.locator('.dropdown-toggle').nth(1);
    await recentPostsToggle.scrollIntoViewIfNeeded();
    await expect(recentPostsToggle).toBeVisible();
    await recentPostsToggle.click();
    await expect(recentPostsToggle).toHaveAttribute('aria-expanded', 'true');
    const recentPostsDropdown = page.locator('#recent-posts-dropdown');
    await expect(recentPostsDropdown).toBeVisible();
    const recentPostsDropdownBounds = await recentPostsDropdown.boundingBox();
    expect(recentPostsDropdownBounds).not.toBeNull();
    if (recentPostsDropdownBounds) {
      const viewport = page.viewportSize();
      expect(recentPostsDropdownBounds.y + recentPostsDropdownBounds.height).toBeLessThanOrEqual((viewport?.height ?? 0) + VIEWPORT_BOUNDARY_TOLERANCE);
    }
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
      expect(dropdownBounds.x + dropdownBounds.width).toBeLessThanOrEqual((viewport?.width ?? 0) + VIEWPORT_BOUNDARY_TOLERANCE);
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
