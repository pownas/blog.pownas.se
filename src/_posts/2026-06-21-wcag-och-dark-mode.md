---
layout: post
title: "Mörkt läge/Dark Mode: Inte ett lagkrav, men viktigt för dina användare (Så implementerar du det)"
date: 2026-06-21 22:52 +0200
category: "webbutveckling,css,programmering"
---

"Måste vi verkligen bygga ett mörkt läge för att uppfylla tillgänglighetskraven?" Det är en av de vanligaste frågorna när organisationer ska anpassa sina digitala tjänster efter DOS-lagen och det europeiska tillgänglighetsdirektivet. Svaret är både enklare och mer komplext än man kan tro. Låt oss reda ut juridiken, den medicinska vetenskapen och hur du bygger en skottsäker teknisk arkitektur.

<!--more-->
---

## 1. Mytbusting: Är Dark Mode ett lagkrav?

Låt oss börja med att dra plåstret: **Nej, det är tyvärr inte ett lagkrav ännu att erbjuda både ett ljust och ett mörkt läge.**

Den europeiska standarden för digital tillgänglighet, [EN 301 549 V3.2.1](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf) (som svensk lagstiftning lutar sig mot), bygger på riktlinjerna i [WCAG 2.1](https://www.w3.org/TR/WCAG21/) på nivå AA. Varken EN-standarden eller WCAG innehåller någon definition av begreppet "dark mode", och det finns inga framgångskriterier som tvingar fram en "switch" mellan ljust och mörkt tema.

### Vad lagen faktiskt kräver

Det du däremot *måste* uppfylla rent juridiskt är kontrast och anpassningsbarhet:

* **Kontrast (WCAG 1.4.3 & 1.4.11):** Oavsett om din applikation är svart, vit eller neonrosa måste text ha ett kontrastvärde på minst 4,5:1 mot sin bakgrund (3:1 för stor text och UI-komponenter).
* **Respekt för systeminställningar:** Din webbplats eller app får inte gå sönder om användaren tvingar fram egna färger via sitt operativsystem, exempelvis genom Windows Högkontrastläge.

Du bryter alltså inte mot lagen om du bygger enbart en ljus webbplats – så länge färgerna har rätt kontrast.

---

## 2. Varför du ändå bör bygga det (God Praxis)

Även om lagen inte kräver det, anses mörkt läge idag vara branschstandard och extremt god praxis. Anledningarna sträcker sig långt förbi trender och estetik.

### Den medicinska och kognitiva aspekten

För många användare är ett mörkt läge skillnaden mellan att kunna använda en tjänst eller att tvingas stänga ner den.

* **Fotofobi och Migrän:** För personer med extrem ljuskänslighet eller migrän kan en stor, vit skärm kännas som att stirra in i en ficklampa.
* **Grå starr (Katarakt):** Minskar bländning, vilket hjälper personer med grumlingar i ögats lins.
* **Astigmatism och det viktiga valet:** För personer med astigmatism kan mörkt läge faktiskt göra det *svårare* att läsa på grund av en "halation-effekt" (en suddig gloria kring vit text på svart bakgrund). Det är just därför det handlar om att erbjuda ett **val** – tvinga aldrig in användaren i varken ljust eller mörkt läge.

### Plattformsstandarder och WCAG AAA

Apple, Google och W3C uppmanar alla utvecklare att respektera användarens systemval. Dessutom, om din organisation strävar efter absolut högsta tillgänglighetsnivå (WCAG Nivå AAA), finns kriteriet *1.4.8 Visuell presentation* som kräver att användaren själv ska kunna ställa in förgrunds- och bakgrundsfärger. Ett dark mode-stöd är ett branschstandardiserat steg i den riktningen.

---

## 3. Teknisk arkitektur: Så bygger du det rätt

Hur bygger vi detta så det blir skalbart, oavsett om det är en webbplats, en Blazor-applikation eller en Native-app? Hemligheten stavas **Design Tokens** och semantisk frikoppling.

### Steg 1: Design Tokens i CSS

För webb och Blazor bygger du en arkitektur i tre lager med hjälp av CSS-variabler (Custom Properties):

**1. Primitiva färger:** Vad färgen *är*.

```css
:root {
    --gray-100: #f8f9fa;
    --gray-900: #212529;
    --brand-blue: #0d6efd;
}

```

**2. Semantiska färger:** Vad färgen *gör* (Här sker magin). Vi använder `@media (prefers-color-scheme: dark)` för att lyssna på systemet, och `data-theme` för manuell överstyrning.

```css
/* Ljust läge (Standard) */
:root, [data-theme="light"] {
    --bg-primary: var(--gray-100);
    --text-primary: var(--gray-900);
}

/* Mörkt läge */
@media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
        --bg-primary: var(--gray-900);
        --text-primary: var(--gray-100);
    }
}

```

**3. Komponentlagret:** Dina UI-komponenter refererar nu *enbart* till det semantiska lagret.

```css
.card {
    background-color: var(--bg-primary);
    color: var(--text-primary);
}

```

### Steg 2: Native Appar (iOS & Android)

Bygger du native-appar slipper du ofta skriva egna variabler från grunden, eftersom operativsystemen har detta inbyggt:

* **.NET MAUI:** Använd `AppThemeBinding` i XAML för att automatiskt växla färger.
* **iOS (SwiftUI):** Använd Asset Catalogs för att sätta en "Dark Appearance" på dina färger, eller använd Apples inbyggda semantiska färger som `.systemBackground`.
* **Android (Jetpack Compose):** Skapa ett `MaterialTheme` som dynamiskt byter färgpalett baserat på funktionen `isSystemInDarkTheme()`.

### Steg 3: Frikoppla logiken (Exempel för .NET/Blazor)

För att låta användaren byta tema manuellt, utan att smutsa ner dina komponenter med JavaScript-anrop, är det elegant att använda *Dependency Injection*.

Skapa en `IThemeService` som hanterar kommunikationen med `localStorage` och sätter rätt `data-theme`-attribut på HTML-dokumentet. Genom att köra ett minimalt inline-skript i din `<head>` som läser av `localStorage` omedelbart, slipper du dessutom den fruktade "FOUC" (Flash of Unstyled Content) innan Blazor hunnit ladda.

---

## Sammanfattning

Att bygga stöd för mörkt läge handlar inte om att bocka av ett lagkrav i DOS-lagen. Det handlar om principerna för **Universell utformning** – att skapa ett gränssnitt med en inbyggd flexibilitet som respekterar att människor har olika kognitiva och visuella behov.

Genom att använda Design Tokens och respektera `prefers-color-scheme` framtidssäkrar du din kodbas, gör dina designers glada och skapar framförallt en mycket vänligare upplevelse för dina slutanvändare.

---

## Källor och Vidare läsning

### Lagar, direktiv och standarder

* **Digg (Myndigheten för digital förvaltning):** [Vägledning för webbutveckling och DOS-lagen](https://www.digg.se). Här finns Sveriges officiella tolkningar av Lagen om tillgänglighet till digital offentlig service och hur du uppfyller kraven i praktiken.
* **ETSI - EN 301 549 V3.2.1:** [Accessibility requirements for ICT products and services](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf). Det officiella standarddokumentet som utgör den juridiska grunden för tillgänglighetskrav i Europa.

### WCAG och Webbtillgänglighet

* **W3C (World Wide Web Consortium):** [WCAG 2.1 Standard](https://www.w3.org/TR/WCAG21/). De fullständiga riktlinjerna för tillgängligt webbinnehåll.
* *Specifikt för kontrast:* Läs mer under framgångskriterierna [1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html) och [1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html).
* *Specifikt för visuell anpassning:* Läs mer under nivå AAA-kriteriet [1.4.8 Visual Presentation](https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation.html).

### Kognitiva och medicinska aspekter

* **W3C Web Accessibility Initiative (WAI):** [Cognitive Accessibility Guidance](https://www.w3.org/WAI/cognitive/). Resurser och forskning från arbetsgruppen för kognitiv tillgänglighet angående hur flexibla gränssnitt hjälper personer med olika behov.
* **The A11y Project:** [a11yproject.com](https://www.a11yproject.com/). Ett fantastiskt community-drivet initiativ som samlar mönster, checklistor och artiklar om digital tillgänglighet.
* **Forskning om Dark Mode & Astigmatism:** En av de mest djupgående och refererade artiklarna (som täcker både den tekniska implementationen och de medicinska aspekterna som astigmatism och "halation"-effekten) är skriven av Thomas Steiner på Google/Web.dev: [Hello darkness, my old friend](https://web.dev/articles/prefers-color-scheme).
* **Nielsen Norman Group:** [Dark Mode vs. Light Mode: Which Is Better?](https://www.nngroup.com/articles/dark-mode/). En stark källa baserad på användningstester och kognitiv forskning kring när ljust respektive mörkt läge fungerar bäst för läsbarhet.
* Sök även efter artiklar kring *"Astigmatism and Dark Mode halation effect"* eller *"Photophobia web accessibility"* för medicinsk och tillgänglighetsfokuserad fördjupning om varför mörkt läge alltid bör vara ett val (opt-in/opt-out) snarare än ett tvingat läge


### Teknisk dokumentation och plattformsriktlinjer

* **MDN Web Docs (Mozilla):** [CSS @media(prefers-color-scheme)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme). Utmärkt teknisk referens för hur du implementerar CSS-medieregeln på webben.
* **Apple Human Interface Guidelines:** [Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode). Apples officiella rekommendationer för hur och varför mörkt läge ska designas och implementeras i iOS-appar.
* **Google Material Design 3:** [Dark theme](https://www.google.com/search?q=https://m3.material.io/styles/color/advanced/dark-theme). Googles omfattande guide till hur färgpaletter bör anpassas för Android och webb.
* **Microsoft Learn (.NET MAUI):** [Respond to system theme changes in .NET MAUI](https://learn.microsoft.com/en-us/dotnet/maui/user-interface/system-theme-changes). Den officiella guiden till hur du implementerar och använder `AppThemeBinding` för att automatiskt anpassa appen efter iOS och Androids systeminställningar.
* **Microsoft Learn (Blazor):** [ASP.NET Core Blazor CSS isolation](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/css-isolation). Microsofts dokumentation för hur du strukturerar CSS per komponent, vilket är en utmärkt grund när du sätter upp dina Design Tokens för olika teman.
