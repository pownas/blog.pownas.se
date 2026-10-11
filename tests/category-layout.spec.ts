import { expect, test } from '@playwright/test';

test.describe('Category page layout', () => {
  test('category posts remain in a readable single column on desktop', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) <= 700, 'Only relevant for non-mobile viewports.');

    await page.goto('/kategori/dotnet/');

    const postItems = page.locator('.category-page > .post-list .post-item');
    await expect(postItems.first()).toBeVisible();
    const leftEdges = await postItems.evaluateAll(items =>
      items.slice(0, 2).map(item => item.getBoundingClientRect().left)
    );

    expect(leftEdges.length).toBe(2);
    expect(Math.abs(leftEdges[0] - leftEdges[1])).toBeLessThanOrEqual(1);
    await expect(page.locator('.all-categories')).toBeVisible();
    await expect(page.locator('.home-link')).toBeVisible();
  });

  test('category links fit the viewport on mobile', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) > 700, 'Only relevant for narrow viewports.');

    await page.goto('/kategori/dotnet/');

    const horizontalOverflow = await page.evaluate(() => {
      const { documentElement, body } = document;
      return Math.max(documentElement.scrollWidth, body.scrollWidth) - documentElement.clientWidth;
    });
    expect(horizontalOverflow).toBeLessThanOrEqual(1);

    const categoryLinks = page.locator('.all-categories .category-list a');
    await expect(categoryLinks.first()).toBeVisible();
    const linkBounds = await categoryLinks.first().boundingBox();
    expect(linkBounds).not.toBeNull();
    expect(linkBounds?.x ?? 0).toBeGreaterThanOrEqual(0);
    expect((linkBounds?.x ?? 0) + (linkBounds?.width ?? 0)).toBeLessThanOrEqual(
      (page.viewportSize()?.width ?? 0) + 1
    );
  });
});
