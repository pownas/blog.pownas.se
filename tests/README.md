# Playwright E2E Tests för blog.pownas.se

Detta är en test-suite för att säkerställa att designen och funktionaliteten på bloggen inte går sönder vid uppdateringar.

## Installation

1.  **Förutsättningar (Ruby/Jekyll):**
    Se till att du har Ruby och Bundler installerat. Kör sedan detta kommando från projektets rotmapp för att installera Jekyll-beroenden:
    ```bash
    bundle install
    ```

2.  **Installera Node.js-beroenden:**
    ```bash
    npm install
    ```

3.  **Installera Playwright-webbläsare:**
    ```bash
    npx playwright install
    ```

## Köra Testerna

### Steg 1: Skapa referensbilder (första gången)
Första gången du kör de visuella testerna måste du skapa "godkända" referensbilder (snapshots).
```bash
npx playwright test --update-snapshots
```
Detta skapar en mapp `tests/visual-regression.spec.ts-snapshots`. **Viktigt: Checka in denna mapp i Git.**

### Steg 2: Kör testerna (normal körning)
När referensbilderna finns, kör du testerna så här:
```bash
npm test
```
eller för produktion:
```bash
npm run test:prod
```

### Steg 3: Uppdatera referensbilder (vid designändringar)
Om du medvetet ändrar designen kommer de visuella testerna att misslyckas. Uppdatera då referensbilderna med samma kommando som i steg 1:
```bash
npx playwright test --update-snapshots
```

### Se test-rapport
```bash
npm run test:report
```

## Testfiler

### `visual-regression.spec.ts`
Tar skärmdumpar av viktiga sidor och jämför dem med tidigare versioner för att upptäcka oavsiktliga visuella ändringar.

### `crawler.spec.ts`
Startar på startsidan och följer alla interna länkar. Testet misslyckas om någon länk leder till en sida med ett felmeddelande (t.ex. 404 Not Found).

## CI/CD Integration

För att köra testerna i GitHub Actions, lägg till denna workflow i `.github/workflows/`:

**Viktigt:** Glöm inte att checka in `tests/visual-regression.spec.ts-snapshots/`-mappen i Git. Annars kommer testerna att misslyckas i CI-pipelinen.

```yaml
name: Playwright Tests

```yaml
name: Playwright Tests

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'
          bundler-cache: true
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Debugging

### Visa vad testerna gör
```bash
npm run test:headed
```

### Debugga steg-för-steg
```bash
npm run test:debug
```

### Inspektera element
```bash
npx playwright codegen http://localhost:4000
```

## Tips

1. **Lägg till nya tester:** Skapa en ny `.spec.ts`-fil i `/tests/`-mappen
2. **Inspektera element:** Använd `npx playwright codegen` för att generera test-kod
3. **Se vad som gick fel:** Testerna sparar skärmbilder på misslyckade tester i `test-results/`
4. **Parallell körning:** Tester körs parallellt som standard - använd `--workers=1` för sekventiell körning

## Vanliga Problem

### "Port 4000 redan i bruk"
```bash
# Linux/Mac
lsof -ti:4000 | xargs kill -9

# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Tester timeout
Öka timeout i `playwright.config.ts`:
```typescript
timeout: 30 * 1000,
```

### Webbläsare-problem
```bash
npx playwright install
npx playwright install --with-deps
```

## Dokumentation

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test Guide](https://playwright.dev/docs/intro)
- [API Reference](https://playwright.dev/docs/api/class-test)
