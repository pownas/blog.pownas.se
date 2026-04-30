import { test, expect, Page } from '@playwright/test';

const visited = new Set<string>();
let internalLinks = new Set<string>();
let baseUrl: string;

async function crawl(page: Page, url: string) {
  const normalizedUrl = new URL(url, baseUrl).href.split('#')[0];

  if (visited.has(normalizedUrl) || !normalizedUrl.startsWith(baseUrl)) {
    return;
  }
  
  visited.add(normalizedUrl);
  console.log(`Besöker: ${normalizedUrl}`);

  try {
    const response = await page.goto(normalizedUrl, { waitUntil: 'domcontentloaded' });
    
    // Kontrollera att vi faktiskt fick ett svar
    if (!response) {
      throw new Error(`Fick inget svar från sidan: ${normalizedUrl}`);
    }

    // Vi accepterar inte serverfel (5xx) eller clientfel (4xx), förutom 404 som vi loggar separat.
    if (response.status() >= 400) {
      console.error(`Felstatus ${response.status()} för ${normalizedUrl}`);
    }
    expect(response.status()).toBeLessThan(400);

    const links = await page.$$eval('a[href]', (anchors) =>
      anchors.map((a) => (a as HTMLAnchorElement).href)
    );

    for (const link of links) {
        const cleanLink = new URL(link, baseUrl).href.split('#')[0];
        if (cleanLink.startsWith(baseUrl) && !visited.has(cleanLink)) {
            internalLinks.add(cleanLink);
        }
    }
  } catch (error) {
    console.error(`Kunde inte ladda sidan ${normalizedUrl}: ${error}`);
    // Kasta om felet så att testet misslyckas
    throw error;
  }
}

test.describe('Crawler för trasiga länkar', () => {
    test('ska crawla alla interna länkar utan att hitta fel', async ({ page, baseURL }) => {
      if (!baseURL) {
        throw new Error("baseURL är inte definierat i Playwright-konfigurationen.");
      }
      baseUrl = baseURL;
      const startUrl = baseUrl;
      internalLinks.add(startUrl);

      // Använd en while-loop för att hantera dynamiskt upptäckta länkar
      while (internalLinks.size > 0) {
        // Hämta första elementet från Set på ett typsäkert sätt
        const [nextUrl] = [...internalLinks]; 
        internalLinks.delete(nextUrl);
        await crawl(page, nextUrl);
      }
    });
});
