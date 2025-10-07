---
layout: post
title: "Bilderbok: Astrid och isslottens värld"
date: 2025-10-07 23:44:22 +0200
category: "livsstil,ai,HTML-code,JavaScript-code,css,programmering"
---

# Hur jag skapade "Astrid och Isslottens värld" – en AI-genererad bilderbok med bara HTML, JavaScript och CSS

När min tjejs systerbarn upptäckte hur roligt det är att läsa AI-genererade bilderböcker, fick jag en idé: varför inte skapa en egen interaktiv bok direkt på webben? Resultatet blev ["Astrid och Isslottens värld"](https://www.pownas.se/chat-gpt/bilderbok/astrid-och-isslottens-varld) ([https://www.pownas.se/chat-gpt/bilderbok/astrid-och-isslottens-varld](https://www.pownas.se/chat-gpt/bilderbok/astrid-och-isslottens-varld)), en sagobok där både text och bilder är skapade av AI – och allt byggt med bara **en HTML-, en JavaScript- och en CSS-fil** (se: [Pownas - GitHub](https://github.com/pownas/pownas.se-static-github-pages/tree/main/docs/chat-gpt/bilderbok/astrid-och-isslottens-varld)).  

## Idén: En magisk bok som lever på webben

Barnet i fråga hade fascinerats av att Google Gemini kan skapa berättelser och bilder (via storybooks). Jag ville ta det steget längre:  
- **En interaktiv bok** som går att läsa direkt i webbläsaren  
- **AI-genererade bilder och text** som skapar en unik upplevelse  
- **Enkel teknik** – inga ramverk, bara webben (HTML, JS, CSS)

## Steg 1 – Planera strukturen

Först skissade jag upp hur boken skulle fungera:
- Varje sida har en bild och text
- Läsaren kan bläddra mellan sidorna
- Förbättringsförslag är att: Allt laddas från en JSON-struktur i JavaScript, så det är enkelt att ändra berättelsen

## Steg 2 – GitHub Copilot som medskapare

Jag använde **GitHub Copilot** för att skriva kodsnuttar och få hjälp med:
- Hur man bygger en enkel bildvisare i JavaScript  
- CSS för att få bilder och text att se ut som en sagobok  
- Navigationslogik för att bläddra mellan boksidor

Copilot var ovärderlig för att snabbt generera kod, komma med layoutförslag och föreslå lösningar på småproblem.

## Steg 3 – HTML, JavaScript och CSS i en enkel struktur

Projektet består av tre filer:

- **index.html**  
  Grundstrukturen med ett element för bild, ett för text och knappar för att bläddra.

- **style.css**  
  Bokdesign: mjuka färger, ram runt bilder, stor läsbar text.

- **script.js**  
  Håller hela berättelsen som en JS-array/JSON. Här finns också logiken för att byta sida, visa bild och text.

<pre class="mermaid">
graph TD
    html[<b>index.html</b><br/>Grundstruktur: bild, text, knappar för att bläddra]
    css[<b>style.css</b><br/>Bokdesign: mjuka färger, ram runt bilder, stor läsbar text]
    js[<b>script.js</b><br/>Berättelse JS-array/JSON och logik för att byta sida, visa bild och text]

    html --> css
    html --> js
</pre>

Allt hostas statiskt, så du kan läsa boken direkt utan installation eller backend.

## Steg 4 – AI-genererade bilder och berättelse

Själva berättelsen och bilderna genererade jag via ChatGPT och DALL-E. Jag bad om sagotexter och bilder i stil med barnböcker. Resultatet blev en magisk resa för Astrid genom isslottets värld.

## Slutsats

Det här projektet visar hur enkelt det är att skapa interaktiva, AI-drivna upplevelser på webben – med bara tre filer och hjälp av Copilot!  
Barnen älskade att bläddra och läsa, och jag lärde mig massor om både JavaScript och AI-verktyg på vägen.

**Prova själv – koden är minimal, och du behöver bara en idé!**

[Besök Astrid och Isslottens värld](https://www.pownas.se/chat-gpt/bilderbok/astrid-och-isslottens-varld)

Eller läs filerna via: 
[Pownas - GitHub](https://github.com/pownas/pownas.se-static-github-pages/tree/main/docs/chat-gpt/bilderbok/astrid-och-isslottens-varld)

---

*Har du frågor om hur jag gjorde eller vill du skapa din egen AI-bok? Kommentera gärna!*