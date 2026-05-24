---
layout: post
title: "Så här skapade jag påskspelet **Liggi 🐤** på en enda dag"
date: 2026-04-04 09:58:52 +0200
category: "c-sharp,.NET,programmering"
---

Det var lördagen den 4 april 2026 – dagen innan påskdagen – och vi hade besök hemma. Jag lade märke till hur min sambos systerdotter mest satt klistrad vid sin surfplatta, och då slog det mig plötsligt: varför inte kanalisera den där skärmtiden till något unikt? Varför inte bygga ett eget, litet påskspel till henne direkt på webben?
<!--more-->

Idén var väckt. Jag satte mig vid datorn, öppnade kodeditorn och började bygga. Resultatet blev **Liggi**!

Du kan testa att spela det själv direkt i din webbläsare (det fungerar såklart på både dator och surfplatta): [https://pownas.se/liggi](https://pownas.se/liggi)

## Spelmekaniken: Ägg, kycklingar och en väldigt arg tupp 🐓

Tanken från början var att göra ett ganska enkelt "fånga-spel" anpassat för barn, men det utvecklades snabbt till ett peka-och-klicka-äventyr (som även stödjer WASD/piltangenter för oss som spelar på dator). Målet med spelet bjuder på lite utmaning ju längre man kommer:

1. **Samla äggen:** På varje bana ska man leta rätt på alla gömda ägg. Varje ägg ger en liten ledtråd om påskens djur!
2. **Fånga de snälla kycklingarna:** De piper och springer runt, men behöver lite hjälp på traven.
3. **Akta dig för Tuppen:** Det finns en arg tupp som vaktar området. Om han får syn på dig börjar han jaga dig – och blir du fångad är det tyvärr *Game Over*.
4. **Vinn chokladägget:** När alla ägg är samlade låser du upp målet och belönas med ett stort, härligt chokladägg. 🍫

## Utvecklingsprocessen och AI som kodar-kompis 🤖

Hela spelet byggdes i ren HTML, CSS och JavaScript med en HTML5 Canvas som grund. Om du kikar på min [commit-historik på GitHub](https://github.com/pownas/webbgame-html/commits), ser du snabbt att jag tog hjälp av en digital assistent under dagen. Jag parade ihop mig med **GitHub Copilot**, som fungerade som en utmärkt par-programmerare.

Här är några höjdpunkter från hur spelet växte fram under timmarna:

* **Snabb uppstart:** Med Copilots hjälp kunde vi smacka upp en grundläggande spel-loop, canvas-rendering och CSS-styling på rekordtid.
* **Från statiskt till äventyr:** Spelet designades om mitt under dagen till att bli ett peka-och-klicka-spel med en hel värld att röra sig i, istället för bara en tråkig, statisk skärm.
* **Procedurella banor & AI-rörelser:** Vi lade till logik för hur kycklingarna rör sig slumpmässigt, samt tuppens *chase behavior*-mekanik som gör att han sätter fart mot spelaren baserat på närhet.
* **Detaljerna som gör det:** För att få spelet att rulla smidigt implementerade vi oberoende bilduppdateringshastighet (frame-rate independence) med `performance.now()`, fixade kollisionsradier och såg till att spelet anpassar och skalar sig snyggt oavsett skärmstorlek – ett måste när målgruppen kör på surfplattor!

## Slutresultatet

Efter några intensiva timmars kodande, pillande med kollisionsdetektorer och finjustering av tuppens hastighet hade spelet en helt fungerande loop från bana ett till vinstskärmen. Det var fantastiskt roligt att se hur snabbt man kan gå från en spontan idé vid frukostbordet till ett fullt spelbart, färgglatt webbspel.

Gå in och [spela 🐥 Liggi 🐤](https://pownas.se/liggi) du också, och se om du kan överlista den arga tuppen och knipa chokladägget!

Glad påsk! 🐣