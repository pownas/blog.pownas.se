---
layout: post
title: "Så byggde jag appen Privatekonomi"
date: 2025-10-28 07:55:32 +0200
category: "Ai"
---

– från idé till komplett privatekonomi-app i .NET

Jag har länge velat ha ett verktyg som ger mig verklig kontroll över min 
privatekonomi – något som är snabbt, privat, körs lokalt eller i mitt eget moln
och samtidigt är roligt att använda. Det blev startskottet för Privatekonomi: 
en Blazor Server-applikation med .NET 9, MudBlazor och .NET Aspire som orkestrerar 
alla tjänster. I den här bloggposten berättar jag hur jag byggde systemet på 1,5 vecka 
med GitHub copilot, vilka designval jag gjort och visar en massa skärmbilder.

Repo: https://github.com/pownas/Privatekonomi

---

## Varför jag byggde Privatekonomi

- Jag ville ha 100% kontroll över min data (lokal-first, enkelt att backa upp/exportera).
- Svenska banker, skattesystem och vardagsflöden kräver svensk kontext och funktionalitet.
- De flesta appar är antingen för enkla, för låsta eller för krångliga att anpassa.

Målet blev en komplett budget- och ekonomiplattform där jag kan:
- Importera transaktioner (CSV eller automatiskt via PSD2-API)
- Kategorisera smart (regler, split-kategorisering, förslag)
- Hantera investeringar, lån, balansräkning och nettoförmögenhet
- Samarbeta inom hushållet (gemensamma budgetar, barnkonton, veckopeng)
- Köra den var jag vill (lokalt, NAS, Raspberry Pi, server) med flexibel lagring

---

## Teknisk stack i korthet

- Frontend: Blazor Server + MudBlazor
- Backend: ASP.NET Core Web API
- Orkestrering: .NET Aspire (telemetri, service discovery, dashboard)
- Data: EF Core med stöd för InMemory, SQLite, SQL Server samt JsonFile (backup/portabilitet)
- Tester: Playwright för end-to-end
- Språk: C# (.NET 9)

---

## Arkitektur med .NET Aspire

Jag valde .NET Aspire för att:
- Starta hela lösningen med en enda `dotnet run`
- Få telemetri (logs, traces, metrics) utan extra friktion
- Enklare service discovery mellan Web och API
- Bättre utvecklarupplevelse i vardagen

AppHost startar webben och API:t, kopplar samman dem och visar allt i Aspire Dashboard.
Det ger snabb feedback-loop vid utveckling och felsökning.

---

## Data- och lagringsstrategi

Från början använde jag EF Core InMemory för att snabbt iterera UX och flöden. 
När datamodellen stabiliserades lade jag till:
- SQLite (standard för produktion, enkelt, portabelt)
- SQL Server (för större installationer)
- JsonFile (backup/export och portabilitet)

Allt styrs via `appsettings.json`, så jag kan byta lagringsmotor utan att röra koden.

---

## Viktiga funktioner jag byggt

- Användarautentisering och isolerad data per användare
- Dashboard med översikt, kategoridiagram och tidsserier
- Transaktioner med split-kategorisering, regler och förslag
- Budgetar: planerat vs utfall
- Investeringar: Avanza-import, automatisk kursuppdatering
- Lån och amorteringsöversikt
- Sparmål och gemensamma sparmål med inbjudningar och roller
- Löneutveckling över hela karriären
- Export per år (JSON/CSV), fullständig backup/export
- Automatisk bankimport via PSD2-API (Swedbank, Avanza, ICA Banken)
- Dark mode och tillgänglighet (WCAG 2.1 AA)

---

## Skärmbilder från appen

Nedan är ett urval av skärmbilder från appen (light/dark där det passar):

- Dashboard (ljust läge)  
  ![Dashboard (ljust läge)](https://github.com/pownas/Privatekonomi/blob/8cbf92a5f832b83a54682477a16e8d05f90aeaab/docs/screenshots/dashboard-light.png)

- Dashboard (mörkt läge)  
  ![Dashboard (mörkt läge)](https://github.com/pownas/Privatekonomi/blob/8cbf92a5f832b83a54682477a16e8d05f90aeaab/docs/screenshots/dashboard-dark.png)

- Transaktioner med sök/filter och kategorichips  
  ![Transaktioner](https://github.com/pownas/Privatekonomi/blob/8cbf92a5f832b83a54682477a16e8d05f90aeaab/docs/screenshots/transactions-light.png)

- Budgetar: plan vs utfall  
  ![Budgetar](https://github.com/pownas/Privatekonomi/blob/8cbf92a5f832b83a54682477a16e8d05f90aeaab/docs/screenshots/budgets-light.png)

- Kategorier med färgkodning och hierarki  
  ![Kategorier](https://github.com/pownas/Privatekonomi/blob/8cbf92a5f832b83a54682477a16e8d05f90aeaab/docs/screenshots/categories-light.png)

- Importflöde (CSV)  
  ![Importflöde CSV](https://github.com/pownas/Privatekonomi/blob/8cbf92a5f832b83a54682477a16e8d05f90aeaab/docs/screenshots/import-light.png)

- Investeringar (översikt och avkastning)  
  ![Investeringar](https://github.com/pownas/Privatekonomi/blob/8cbf92a5f832b83a54682477a16e8d05f90aeaab/docs/screenshots/investments-light.png)

- Nettoförmögenhet över tid  
  ![Nettoförmögenhet (graf)](https://github.com/pownas/Privatekonomi/blob/8cbf92a5f832b83a54682477a16e8d05f90aeaab/docs/screenshots/networth-chart-light.png)

- Balansräkning  
  ![Balansräkning](https://github.com/pownas/Privatekonomi/blob/8cbf92a5f832b83a54682477a16e8d05f90aeaab/docs/screenshots/balance-sheet-light.png)

- Lån och amortering  
  ![Lån och amortering](https://github.com/pownas/Privatekonomi/blob/8cbf92a5f832b83a54682477a16e8d05f90aeaab/docs/screenshots/loans-light.png)

- Sparmål  
  ![Sparmål](https://github.com/pownas/Privatekonomi/blob/8cbf92a5f832b83a54682477a16e8d05f90aeaab/docs/screenshots/goals-light.png)

- Löneutveckling  
  ![Löneutveckling](https://github.com/pownas/Privatekonomi/blob/8cbf92a5f832b83a54682477a16e8d05f90aeaab/docs/screenshots/salary-history-light.png)

---

## Automatisering och importflöden

Jag började med CSV-import (ICA-banken och Swedbank) för att validera datamodellen
och UI. Sen byggde jag automatisk bankimport via PSD2-API med OAuth2 och
BankID-flöden. För investeringar finns Avanza-import med dubbletthantering via ISIN.

- CSV-import hjälper vid historisk data eller när bank-API inte är tillgängligt.
- PSD2 ger realtidsdata och minimerar manuellt jobb.
- Export per år (JSON/CSV) gör att jag kan arkivera och analysera extern.

---

## UI/UX och tillgänglighet

MudBlazor gav mig ett snabbt, enhetligt och snyggt UI med:
- Dark mode med systempreferens
- Tillgänglighet enligt WCAG 2.1 AA
- Tydliga fokusindikatorer och tangentbordsnavigation
- Färgkontraster testade för både ljust och mörkt läge

---

## Testning

Jag använder Playwright för E2E-tester. Applikationen seedas automatiskt med
ca 50 realistiska transaktioner (svenska exempel) vid utveckling. Testerna
verifierar att listor, format, filter och interaktioner fungerar i UI:t.

Exempel på flöde:
```bash
cd tests/playwright
npm install
npx playwright install chromium
npm test
```

---

## Körning och utvecklarupplevelse

För snabbstart i Codespaces eller lokalt använder jag startskript som:
- Installerar Aspire-workload vid behov
- Startar alla tjänster och öppnar Aspire Dashboard
- Sätter upp en dev-miljö med testdata

Manuellt:
```bash
# Orkestrera allt med Aspire
cd src/Privatekonomi.AppHost
dotnet run

# Endast webben
cd src/Privatekonomi.Web
dotnet run
```

---

## Lärdomar

- Börja med InMemory för snabb UX/flow-iteration; lägg till persistens när modellen stabiliserats.
- .NET Aspire är en game-changer för utvecklarupplevelsen i multi-tjänsteprojekt.
- Bygg kategori- och regelmotor tidigt – det påverkar nästan allt i en ekonomiapp.
- Satsa på export/backup från dag 1 för trygghet och portabilitet.
- Sätt upp realistiska, lokala testdata – det gör UI-beslut och tester bättre.

---

## Nästa steg

- CI/CD med GitHub Actions
- Flytta standardpersistens till SQL Server/SQLite i fler miljöer
- Enhetstester och mer täckning
- ML-förbättringar av automatisk kategorisering
- GUI för bankkopplingar och mer visualiseringar
- Mobilanpassning och ev. companion-app

---

## Länkar

- Repo: https://github.com/pownas/Privatekonomi
- Dokumentation och guider (lagring, PSD2, import/export, Aspire, m.m.) finns i repo:t under `docs/` och `wiki/`.

Tack för att du läste! Hoppas att Privatekonomi kan inspirera eller
hjälpa fler att få bättre koll på sin ekonomi – på sina egna villkor.
