import { expect, test } from '@playwright/test';

test.describe('Mermaid rendering', () => {
  test('renders Mermaid diagrams while keeping regular code blocks intact', async ({ page }) => {
    await page.goto('/2026/06/16/open-telemetry/');

    await expect(page.locator('.post-content .mermaid-diagram svg')).toHaveCount(2);
    await expect(page.locator('.post-content pre > code.language-mermaid')).toHaveCount(0);
    await expect(page.locator('.post-content .language-csharp pre code').first()).toBeVisible();
  });

  test('falls back to the original code block when Mermaid syntax is invalid', async ({ page }) => {
    await page.goto('/2026/06/16/open-telemetry/');

    await page.evaluate(async () => {
      const postContent = document.querySelector('.post-content');

      if (!postContent || typeof window.renderMermaidDiagrams !== 'function') {
        throw new Error('Mermaid rendering helpers are not available.');
      }

      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.className = 'language-mermaid';
      code.textContent = 'graph TD\n  A-->\n';
      pre.appendChild(code);
      postContent.appendChild(pre);

      await window.renderMermaidDiagrams();
    });

    const fallbackCodeBlock = page.locator('.post-content pre[data-mermaid-failed="true"] code.language-mermaid').last();
    await expect(fallbackCodeBlock).toContainText('graph TD');
    await expect(page.locator('.post-content .mermaid-error').last()).toBeVisible();
  });
});
