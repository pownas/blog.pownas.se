---
layout: post
title: "Tillgänglighet för alla: Så granskar du din webbplats enligt WCAG 2.1"
date: 2026-06-19 21:47 +0200
category: "webbutveckling,wcag,html,programmering"
---

Oavsett om plattformen du bygger är en komplex .NET-lösning, ett interaktivt webbaserat spel, eller en inbjudande informationssida för den lokala dansklubben, finns det en gemensam nämnare som aldrig får ignoreras: **tillgänglighet**.

Att granska en webbplats enligt WCAG 2.1 (Web Content Accessibility Guidelines) handlar inte bara om att bocka av lagkrav, utan om att säkerställa att din kod och design fungerar för alla användare, oavsett funktionsvariationer. Här är de viktigaste tekniska och designmässiga aspekterna du bör fokusera på vid en granskning.

<!--more-->

---

## 1. Navigering och hanterbarhet (Tangentbordsfokus)

En av de mest kritiska testerna är att lägga undan musen. Kan hela webbplatsen, inklusive menyer, formulär och modalfönster, navigeras enbart med tangentbordet (Tab, Enter, Space, piltangenter)?

* **Tydligt fokus:** Det måste finnas en tydlig visuell markering (`:focus`) som visar vilket element som är aktivt.
* **Inga tangentbordsfällor:** Användaren får aldrig fastna i en komponent (exempelvis en popup) utan att kunna ta sig ur den med tangentbordet (oftast via Esc-tangenten).
* **Hoppa över innehåll:** Det bör finnas en "Hoppa till huvudinnehåll"-länk för skärmläsare och tangentbordsanvändare så de slipper stega igenom huvudmenyn på varje sidladdning.

## 2. Kontrast och visuell presentation

WCAG 2.1 lade extra stor vikt vid hur vi presenterar information, särskilt på mobila enheter och för personer med nedsatt syn.

* **Textkontrast:** Vanlig text måste ha ett kontrastvärde på minst 4.5:1 mot sin bakgrund (3:1 för stor text).
* **Kontrast för gränssnittskomponenter:** (Nytt i 2.1) Även ikoner, knappar, inmatningsfält och grafer måste ha en kontrast på minst 3:1 mot intilliggande färger.
* **Responsivitet (Reflow):** (Nytt i 2.1) Användare ska kunna zooma in till 400 % på en skärm (motsvarande 320 CSS-pixlar i bredd) utan att behöva skrolla i två dimensioner. Layouten måste flöda om korrekt.

## 3. Semantik och kodkvalitet (Robusthet)

Din HTML måste vara logiskt uppbyggd för att tekniska hjälpmedel, som skärmläsare, ska kunna tolka sidan korrekt.

* **Rubrikstruktur:** Använd `<h1>` till `<h6>` i logisk ordning. Rubrikerna bygger sidans skelett.
* **Alternativtexter (Alt-attribut):** Alla informativa bilder måste ha en beskrivande `alt`-text. Rent dekorativa bilder ska ha ett tomt attribut (`alt=""`).
* **ARIA-attribut:** Om du bygger anpassade interaktiva komponenter måste du använda WAI-ARIA för att kommunicera tillstånd (t.ex. `aria-expanded="true"`) till skärmläsare.

## 4. Interaktion och felhantering

När en användare fyller i formulär eller interagerar med systemet måste gränssnittet vara förlåtande och tydligt.

* **Felmeddelanden:** Om ett fel uppstår (exempelvis ett felaktigt ifyllt fält) måste felet beskrivas i text, och systemet bör ge förslag på hur det kan åtgärdas. Färg ensamt får aldrig vara det enda sättet att förmedla ett fel.
* **Etiketter (Labels):** Alla inmatningsfält måste vara kopplade till en tydlig `<label>`.

## Sammanfattning: Verktyg för granskning

En framgångsrik granskning kombinerar automatiserade verktyg (som Lighthouse eller axe DevTools) med manuell testning (tangentbordsnavigering och skärmläsare som NVDA eller VoiceOver). Automatiska verktyg fångar syntaxfel och uppenbara kontrastbrister, men bara mänsklig testning kan avgöra om flödet faktiskt är logiskt.

---

## Källor och vidare läsning

För att fördjupa dig i riktlinjerna och hitta verktyg för din egen granskning, rekommenderas följande officiella källor:

* **W3C (World Wide Web Consortium):** Den officiella specifikationen för WCAG 2.1. Här hittar du de exakta tekniska kraven och framgångskriterierna.
* *Länk:* [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/)


* **DIGG (Myndigheten för digital förvaltning):** De svenska riktlinjerna för hur du utvecklar webbplatser enligt lagkraven (DOS-lagen), vilket är en utmärkt praktisk tolkning av WCAG för svenska förhållanden.
* *Länk:* [Vägledning för webbutveckling (webbriktlinjer.se)](https://webbriktlinjer.se/)


* **WebAIM (Web Accessibility In Mind):** En av de bästa resurserna för att förstå WCAG i praktiken. De erbjuder utmärkta guider, checklistor och det branschstandardiserade verktyget för kontrastmätning.
* *Länk:* [WebAIM's WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist)
* *Verktyg:* [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)


* **Deque Systems (axe):** Skaparna av axe-core, industristandarden för automatiserad tillgänglighetstestning. Deras dokumentation är ovärderlig för utvecklare.
* *Länk:* [Deque Accessibility Resources](https://www.deque.com/resources/)
