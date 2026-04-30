import { test, expect } from '@playwright/test';

const pagesToTest = [
  { url: '/', name: 'homepage' },
  { url: '/kategori/dotnet/', name: 'kategori-dotnet' },
  { url: '/2020/09/01/NyEra/', name: 'blogpost-nyera' },
  { url: '/2025/01/09/comparing-lists/', name: 'blogpost-comparing-lists' },
  { url: '/2026/04/26/dotnet-livscykel-hantering/', name: 'blogpost-lifecycle' },
  { url: '/sida/2/', name: 'pagination-page-2' }
];

test.describe('Visual Regression Testing', () => {
  for (const pageInfo of pagesToTest) {
    test(`ska matcha snapshot för ${pageInfo.name}`, async ({ page }) => {
      await page.goto(pageInfo.url);
      // Dölj dynamiska element om nödvändigt, t.ex. datum
      // await page.locator('.post-meta').evaluateAll(elements => elements.forEach(el => el.style.visibility = 'hidden'));
      await expect(page).toHaveScreenshot(`${pageInfo.name}.png`, { fullPage: true, animations: 'disabled' });
    });
  }
});
