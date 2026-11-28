import { expect, test } from '@playwright/test';

test.describe('All posts page', () => {
  test('shows a single page heading and renders posts as blog cards', async ({ page }) => {
    await page.goto('/alla-inlagg/');

    await expect(page.locator('.all-posts > .page-heading')).toHaveCount(1);
    await expect(page.locator('.all-posts > .page-heading')).toHaveText('Alla inlägg');
    await expect(page.locator('main > .wrapper > article.post > .post-header')).toHaveCount(0);

    const postCards = page.locator('.all-posts > .post-list > li > .post-card');
    await expect(postCards.first()).toBeVisible();
    expect(await postCards.count()).toBeGreaterThan(12);
    await expect(postCards.first().locator('.post-meta')).toBeVisible();
    await expect(postCards.first().locator('h3 a')).toBeVisible();
    await expect(postCards.first().locator('.post-excerpt')).toBeVisible();
  });

  test('post cards fit the viewport on mobile', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) > 700, 'Only relevant for narrow viewports.');

    await page.goto('/alla-inlagg/');

    const horizontalOverflow = await page.evaluate(() => {
      const { documentElement, body } = document;
      return Math.max(documentElement.scrollWidth, body.scrollWidth) - documentElement.clientWidth;
    });
    expect(horizontalOverflow).toBeLessThanOrEqual(1);
  });
});
