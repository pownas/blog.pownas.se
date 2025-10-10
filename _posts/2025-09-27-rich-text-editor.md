---
layout: post
title: "Rich text editor - document.execCommand()"
date: 2025-09-27 21:40:22 +0200
category: "HTML-Code,ai,JavaScript-code,programmering"
---

# Hur jag skapade en Rich Text Editor med webbläsarens inbyggda API:er och Copilot

Att bygga en egen rich-text-editor är ett klassiskt webbutvecklarprojekt – men idag är det enklare än någonsin tack vare moderna webbläsar-API:er och smart hjälp från GitHub Copilot.  
Här berättar jag hur jag skapade min editor, som du kan testa här: [Demo – Rich Text Editor](https://www.pownas.se/chat-gpt/rich-text-editor) (eller läs koden 👨‍💻: [rich-text-editor/index.html](https://github.com/pownas/pownas.se-static-github-pages/blob/main/docs/chat-gpt/rich-text-editor/index.html))

![En rich text editor](/img/blogposts/2025-09-27-rich-text-editor.png)  

## Inspiration och mål

Jag ville ha en enkel men kraftfull editor där man kan:
- Skriva och formatera text direkt i webbläsaren (fet, kursiv, understrykning)
- Skapa listor, länkar och styra textens placering
- Allt utan externa ramverk – bara HTML, CSS och JavaScript

## Steg 1 – Utforska webbläsarens API:er

Webbläsare har länge haft det inbyggda `contenteditable`-attributet, som gör ett element redigerbart. Med `document.execCommand()` kan man dessutom programstyra formatering, skapa länkar, listor och justera textens utseende.

Exempel:
```js
document.execCommand('bold');
document.execCommand('insertOrderedList');
document.execCommand('createLink', false, 'https://exempel.se');
```

## Steg 2 – Snabb prototyp med Copilot

Jag utnyttjade GitHub Copilot för att:
- Generera HTML för knappar och verktygsfält
- Skriva JavaScript som kopplar knapptryckningar till rätt kommandon
- Få förslag på CSS för snygg, enkel design

Copilot var perfekt för att snabbt pröva idéer och få kodexempel för allt från `contenteditable`-hantering till att lägga till nya verktygsfunktioner.

## Steg 3 – Design och användarvänlighet

Jag fokuserade på tydliga knappar, snygg färgsättning och hög användarvänlighet. Ingen inloggning eller backend behövs – det är bara att börja skriva!

Bilden ovan visar resultatet: ett rent och lättanvänt gränssnitt där man enkelt kan formatera sin text.

## Steg 4 – Funktioner och utbyggnad

Med Copilot gick det smidigt att bygga ut med fler funktioner:
- Knappar för vänster/höger/centrerad text
- Punktlistor och numrerade listor
- Automatisk hantering av länkar

Allt styrs av några rader JavaScript och de inbyggda API:erna – enkelt att förstå och utveckla vidare.

## Summering

Att skapa en egen rich-text-editor är ett perfekt projekt för att utforska webbläsarens kapacitet och lära sig om DOM-manipulering.  
Med Copilot som kodkompis blev resan både roligare och snabbare!

Vill du testa själv?  
👉 [Prova min Rich Text Editor här!](https://www.pownas.se/chat-gpt/rich-text-editor)  
 (eller läs koden 👨‍💻: [rich-text-editor/index.html](https://github.com/pownas/pownas.se-static-github-pages/blob/main/docs/chat-gpt/rich-text-editor/index.html))


Mer info:  
[MDN Web Docs - document.execCommand() method](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)  
[MDN Web Docs - HTML contenteditable global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/contenteditable)
---

*Har du frågor, vill se koden eller bygga vidare? Kommentera gärna!*
