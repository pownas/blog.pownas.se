---
layout: post
title: "CSS-klasser vs. data-testid: Så väljer du rätt selectors för robusta E2E-tester"
date: 2026-02-12
category: "testning,frontend,best-practices,web,programmering"
---

CSS-klasser är till för styling, inte för testning – dags att vi använder `data-testid`

![Visualiserar data-testid](/img/blogposts/2026-02-12-CSS--vs--data-testid.png)

Vi har alla varit där. Det är fredag eftermiddag, en ny feature ska deployas, och plötsligt lyser CI/CD-pipelinen rött. Testerna failar.

Varför? Gick koden sönder? Nej. Någon frontend-utvecklare bytte namn på en CSS-klass från `.submit-btn` till `.confirm-button` för att det lät bättre i den nya designen. Ditt automatiserade test, som förlitade sig på den CSS-klassen, kraschade precis.
<!-- Eller så höll vi på att utveckla dark mode på webben, och någon hade missat att kolla de där sista "egde case", för att det saknades tester som täckte vissa av våra knappar på sidan. -->

Detta kan vara lite av definitionen för ett **skört test**. Det går sönder inte för att funktionaliteten är trasig, utan för att implementationen har ändrats.

Lösningen på detta stavas `data-testid`. I den här posten går vi igenom varför du måste börja använda dedikerade testattribut och hur det gör din kodbas mer robust.


## Problemet med traditionella selectors

När vi skriver E2E (End-to-End) eller integrationstester måste vi på något sätt berätta för testverktyget (som Cypress, Testing Library, Playwright eller Selenium) vilket element på sidan det ska interagera med.

Historiskt har vi använt det som funnits tillgängligt:

* **CSS-klasser:** `cy.get('.btn-primary')`.
    * *Problem:* Klasser är till för styling. De ändras ofta när designen uppdateras. De är inte unika.
* **HTML-taggar:** `cy.get('button').click()`.
    * *Problem:* Alldeles för generellt. Vad händer när du lägger till en knapp till på sidan?
* **Hierarki/XPath:** `cy.get('div > div:nth-child(3) > span > button')`.
    * *Problem:* Mardrömmen. Minsta lilla ändring i HTML-strukturen (en extra `<div>` för layout) så går testet sönder.
* **ID:n:** `cy.get('#submit-order')`.
    * *Problem:* Bättre, men ID:n används ofta för funktionalitet (JS hooks) eller ankarlänkar. De kan också genereras dynamiskt av ramverk, vilket gör dem opålitliga.

**Gemensam nämnare:** Alla dessa metoder kopplar dina tester hårt till *implementationen* (hur det ser ut eller är uppbyggt) istället för *intentionen* (vad elementet gör).


## Lösningen: Ett kontrakt `data-testid`

`data-testid` (eller `data-cy`, `data-test-id` – kärt barn har många namn) är ett anpassat HTML5-attribut vars enda syfte är att agera ankare för automatiserade tester.

```html
<button class="btn btn-blue large confirm-purchase">Köp nu</button>

<button data-testid="confirm-purchase-button" class="btn btn-blue large">Köp nu</button>
```

Genom att använda detta attribut skapar du ett kontrakt mellan utveckling och test (QA).
När en utvecklare ser ett data-testid i koden signalerar det tydligt: "Detta element används av ett test. Om jag tar bort eller ändrar detta attribut kommer ett test att gå sönder."
De största fördelarna
1. Frippling (Decoupling) och Stabilitet
Detta är den största vinsten. Du kan göra en total redesign av din sajt, byta från Bootstrap till Tailwind, och ändra hela HTML-strukturen. Så länge knappen fortfarande har kvar sitt data-testid="purchase-btn", kommer testet att passera. Dina tester blir motståndskraftiga mot förändring.
2. Tydlighet och Intention
Jämför dessa två selectors i en testfil för PlayWright (C#):
 * `page.Locator(".modal-footer > .btn-success").Click()`
 * `page.GetByTestId("accept-terms-modal-button").Click()`
 eller i Cypress testfil:
 * `cy.get('.modal-footer > .btn-success').click()`
 * `cy.get('[data-testid="accept-terms-modal-button"]').click()`
Vilken är av dessa lättast att förstå sex månader senare? `'.modal-footer > .btn-success'` eller `"accept-terms-modal-button"` Det dedikerade attributet beskriver vad elementet är till för, inte var det råkar befinna sig just nu.
3. Snabbare testutveckling
Testare/QA-ingenjörer behöver inte gissa sig till komplexa CSS-selectors eller be utvecklare lägga till unika ID:n. De kan enkelt hitta elementen de behöver, och om de saknas är det tydligt vad som behöver läggas till.
Men vänta... vad hände med tillgänglighet (A11y/WCAG)?
Det finns en viktig nyans här. I den moderna testskolan (särskilt populäriserad av Kent C. Dodds och Testing Library) finns det en hierarki av selectors.
Attributet data-testid är fantastiskt, men det ska faktiskt inte vara ditt förstaval.
Den gyllene regeln är: Testa din applikation så som en användare använder den.
En användare (särskilt de som använder skärmläsare) letar inte efter CSS-klasser eller dolda data-attribut. De letar efter knappar med texten "Spara", eller formulärfält med etiketten "E-post".
Prioriteringsordningen för selectors:
 * Använd semantiska roller och labels (BÄST):
   * `getByRole('button', { name: /spara/i })`
   * `getByLabelText('Användarnamn')`
   * Varför? Om du kan välja elementet baserat på dess tillgänglighetsroll, vet du att ditt test fungerar OCH att din app är tillgänglig. Två flugor i en smäll.
 * Använd `data-testid` (NÄST BÄST):
   * Ibland går det inte att använda semantiska roller. Du kanske måste klicka på en `<div>` som agerar som en custom dropdown, eller en `<span>` som visar ett felmeddelande utan en tydlig roll.
   * Det är här `data-testid` skiner. Det är din "escape hatch" när semantisk HTML inte räcker till.

## Hur kan vi visualisera sidans `data-testid`?
Det finns flera sätt att göra detta på, beroende på om du vill ha ett dedikerat verktyg (extension) eller en snabb lösning direkt i webbläsaren.

Här är de bästa metoderna för att visualisera `data-testid` attribut:

### 1. Webbläsartillägg (Rekommenderat)

Det absolut smidigaste sättet är att använda ett tillägg som är byggt för just detta.

* **Testing Playground:** Detta är "guldstandarden" om du arbetar med *Testing Library*, Cypress eller Playwright.
* **Hur det funkar:** Det lägger till en flik i DevTools men har också en "pick"-funktion som visualiserar element och föreslår bästa möjliga selector (oftast `data-testid`).


* **Bird eats Bug** eller **CSS Scan:** Dessa är mer generella verktyg som kan konfigureras för att visa attribut, men Testing Playground är oftast bäst för just test-attribut.


### 2. "Det Snabba Hack:et" (CSS i Konsolen)

Om du inte vill installera ett tillägg kan du visualisera alla `data-testid` direkt genom att klistra in en liten CSS-snutt i din webbläsares konsol.

Detta script ritar en röd ram runt alla element som har attributet och skriver ut namnet på ID:t ovanpå elementet.

**Gör så här:**

1. Öppna DevTools (F12) -> Gå till **Console**.
2. Klistra in följande kod och tryck Enter:

```javascript
var style = document.createElement('style');
style.innerHTML = `
  [data-testid] {
    outline: 3px solid #ff00ff !important; /* Lila ram */
    position: relative !important;
  }
  [data-testid]::after {
    content: attr(data-testid);
    position: absolute;
    top: -20px;
    left: 0;
    background: #ff00ff;
    color: white;
    padding: 2px 5px;
    font-size: 12px;
    font-weight: bold;
    z-index: 9999;
    pointer-events: none;
    white-space: nowrap;
    border-radius: 3px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;
document.head.appendChild(style);

```

> **Tips:** Om ditt team använder `data-cy` (för Cypress) eller `data-test` eller något annat unikt html attribut istället, byt bara ut `data-testid` i koden ovan mot det attribut ni använder.

![Visualiserar data-testid](/img/blogposts/2026-02-12-CSS--vs--data-testid.png)


### 3. Skapa en "Bookmarklet"

Om du gör detta ofta kan du spara koden ovan som ett bokmärke i din webbläsare.

1. Skapa ett nytt bokmärke.
2. I fältet för URL/Adress, klistra in koden nedan (det är samma kod som ovan, men komprimerad till en rad):

```javascript
javascript:(function(){var style=document.createElement('style');style.innerHTML='[data-testid]{outline:3px solid #ff00ff!important;position:relative!important}[data-testid]::after{content:attr(data-testid);position:absolute;top:-20px;left:0;background:#ff00ff;color:white;padding:2px 5px;font-size:12px;font-weight:bold;z-index:9999;pointer-events:none;white-space:nowrap;border-radius:3px;box-shadow:0 2px 4px rgba(0,0,0,0.2)}';document.head.appendChild(style);})();
```

Nu kan du bara klicka på bokmärket när du är inne på din applikation för att tända upp alla test-ID:n.


### 4. Sök via DevTools (Elements Panel)

Om du bara vill hitta dem snabbt utan visuell overlay:

1. Tryck `Ctrl + F` (eller `Cmd + F` på Mac) i **Elements**-fliken.
2. Sök efter `[data-testid]`.
3. Webbläsaren kommer att markera dem en efter en i DOM-trädet och scrolla till dem på sidan.

> **Tips:** Vill du att jag ska justera CSS-koden ovan för att även inkludera andra attribut som `data-cy` eller `aria-label`?


## Sammanfattning
Att använda CSS-klasser för testning är som att bygga ett hus på en grund av sand. Det fungerar tills vinden vänder.
Genom att implementera data-testid som standard i er utvecklingsprocess får ni:
 * Färre falska negativa testsvar när designen ändras.
 * Tydligare och mer läsbar testkod.
 * Ett bättre samarbete mellan Dev och Test (QA).
Det är en liten investering i tid när du skriver HTML-koden, men det betalar sig tiofaldigt i minskat underhåll av tester över tid.

Börja gärna använda det idag. Ditt framtida jag (och din Test(/QA)-avdelning) kommer att tacka dig.

### Mer information
* PlayWright - Locators: https://playwright.dev/docs/locators
* Cypress - Find/Get: https://docs.cypress.io/api/commands/find
* Testing Library - Queries: https://testing-library.com/docs/queries/about