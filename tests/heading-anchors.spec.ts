import { expect, test } from '@playwright/test';

const postUrl = '/2026/07/14/kartlagg-systemlandskap-med-c4-modellen/';
const headingId = 'c4-modellen-arkitekturens-svar-på-google-maps';

test.describe('Heading anchors', () => {
  test('adds accessible fragment links to headings with ids', async ({ page }) => {
    await page.goto(postUrl);

    const heading = page.locator(`.post-content h2#${headingId}`);
    const anchor = heading.locator('a.heading-anchor');
    const headingText = heading.locator('.heading-anchor-text');

    await expect(anchor).toHaveAttribute('href', `#${headingId}`);
    await expect(anchor).toHaveAttribute('aria-label', /Länka till rubriken/);
    await expect(headingText).toContainText('C4-modellen: Arkitekturens svar på Google Maps');

    const supportsHover = await page.evaluate(() => window.matchMedia('(hover: hover)').matches);

    if (supportsHover) {
      await expect(anchor).toHaveCSS('opacity', '0');
      await heading.hover();
      await expect(anchor).toHaveCSS('opacity', '1');
    } else {
      await expect(anchor).toHaveCSS('opacity', '1');
    }

    await anchor.focus();
    await expect(anchor).toHaveCSS('opacity', '1');

    await anchor.click();
    await expect(page).toHaveURL(new RegExp(`#${headingId.replace('på', 'p%C3%A5')}$`));
  });
});
