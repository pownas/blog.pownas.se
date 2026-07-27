/// <reference types="node" />
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

type PostCategoryRef = {
  postFile: string;
  category: string;
};

type CategoryPage = {
  file: string;
  categoryName: string;
  permalink: string | null;
};

function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function readPostCategoryRefs(postsDir: string): PostCategoryRef[] {
  const refs: PostCategoryRef[] = [];
  const postFiles = fs.readdirSync(postsDir).filter((name: string) => name.endsWith('.md'));

  for (const postFile of postFiles) {
    const fullPath = path.join(postsDir, postFile);
    const content = fs.readFileSync(fullPath, 'utf8');
    const categoryMatch = content.match(/^category:\s*"?(.*?)"?\s*$/m);
    if (!categoryMatch) {
      continue;
    }

    const categories = categoryMatch[1]
      .split(',')
      .map((entry: string) => stripWrappingQuotes(entry))
      .filter(Boolean);

    for (const category of categories) {
      refs.push({ postFile, category });
    }
  }

  return refs;
}

function readCategoryPages(categoryDir: string): CategoryPage[] {
  const pages: CategoryPage[] = [];
  const files = fs.readdirSync(categoryDir).filter((name: string) => name.endsWith('.md'));

  for (const file of files) {
    const fullPath = path.join(categoryDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const categoryNameMatch = content.match(/^category_name:\s*(.*?)\s*$/m);

    if (!categoryNameMatch) {
      continue;
    }

    const permalinkMatch = content.match(/^permalink:\s*(.*?)\s*$/m);
    pages.push({
      file,
      categoryName: stripWrappingQuotes(categoryNameMatch[1]),
      permalink: permalinkMatch ? stripWrappingQuotes(permalinkMatch[1]) : null,
    });
  }

  return pages;
}

test.describe('Kategori-tackning mellan bloggposter och _category', () => {
  test('metadata matchar category_name och kategorisidor svarar 200', async ({ request, baseURL }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'chromium-desktop-light',
      'Detta ar en ren datavalidering och kor en gang for att undvika dublettkorning i alla projekt.'
    );

    if (!baseURL) {
      throw new Error('baseURL ar inte definierat i Playwright-konfigurationen.');
    }

    const repoRoot = path.resolve(__dirname, '..');
    const postsDir = path.join(repoRoot, 'src', '_posts');
    const categoryDir = path.join(repoRoot, 'src', '_category');

    const postRefs = readPostCategoryRefs(postsDir);
    const categoryPages = readCategoryPages(categoryDir);

    const categoryNameSet = new Set(categoryPages.map((page) => page.categoryName));
    const postCategorySet = new Set(postRefs.map((ref) => ref.category));

    const missingCategories = postRefs.filter((ref) => !categoryNameSet.has(ref.category));
    const unusedCategoryPages = categoryPages.filter((page) => !postCategorySet.has(page.categoryName));

    const missingMessage = missingCategories
      .map(
        (entry) =>
          `Kategorin fran bloggpost ${entry.postFile}, saknas i category-mappen: ${entry.category}`
      )
      .join('\n');

    const unusedMessage = unusedCategoryPages
      .map(
        (page) =>
          `Kategorin i category-mappen ${page.categoryName} har inga bloggposter kopplade till sig`
      )
      .join('\n');

    expect(
      missingCategories,
      missingMessage || 'Alla kategorier i bloggposterna finns i category-mappen.'
    ).toEqual([]);

    expect(
      unusedCategoryPages,
      unusedMessage || 'Alla kategorier i category-mappen har minst en bloggpost kopplad till sig.'
    ).toEqual([]);

    for (const page of categoryPages) {
      if (!page.permalink) {
        continue;
      }

      const response = await request.get(page.permalink);
      expect(
        response.status(),
        `Kategorisidan ${page.permalink} (fil: ${page.file}) svarade med HTTP ${response.status()}.`
      ).toBeLessThan(400);
    }
  });
});