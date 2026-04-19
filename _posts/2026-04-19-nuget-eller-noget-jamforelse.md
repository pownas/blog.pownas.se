---
layout: post
title: "NuGet eller NoGet (No Get) – en jämförelse"
date: 2026-04-19 10:37:14 +0200
category: "c-sharp,.NET,programmering"
---

I två tidigare poster diskuteras samma kärnfråga från olika håll:

1. [NuGet eller Noget – det är frågan?](https://blogg.thomasbjork.net/nuget-eller-noget-det-ar-fragan/)
2. [Ersätt NuGet med Noget?](https://blogg.thomasbjork.net/ersatt-nuget-med-noget/)

Här är en sammanfattning för dig som vill förstå resonemanget snabbt.

## Vad menas med NoGet?

**NoGet ("no get")** handlar om att medvetet minimera eller undvika externa paketberoenden. Tanken är att i större utsträckning bygga och förvalta funktionalitet i den egna källkoden, istället för att hämta in många tredjepartsbibliotek.

## NuGet – styrkor

NuGet är effektivt när du vill:

- komma igång snabbt
- återanvända välbeprövade lösningar
- slippa uppfinna hjulet
- dra nytta av ett stort ekosystem

För mycket som är standardiserat eller icke-affärskritiskt är NuGet ofta ett rimligt val.

## NoGet – argumenten för bytet

I resonemanget kring "ersätt NuGet med NoGet" lyfts särskilt att du får bättre kontroll över:

- **källkoden** (du vet exakt vad som körs)
- **säkerhet och leveranskedja** (färre externa beroenden att granska)
- **förutsägbarhet över tid** (mindre risk att externa uppdateringar bryter din lösning)
- **underhåll av affärskritisk logik** (kunskapen stannar i teamet)

Kort sagt: mindre beroende av andras roadmap och releasecykler.

## Nackdelar att väga in

NoGet är inte gratis. Du byter beroenderisk mot eget ansvar:

- mer kod att skriva och testa själv
- större krav på intern kompetens
- högre initial utvecklingskostnad

Därför blir den praktiska frågan sällan "allt NuGet" eller "allt NoGet", utan **var gränsen ska dras**.

## En pragmatisk tumregel

Ett balanserat arbetssätt kan vara:

- använd NuGet för generiska, mogna och utbytbara funktioner
- överväg NoGet för central domänlogik och kritiska delar där kontroll är viktigast

Poängen i de två inläggen är just detta vägval: gör beroenden till ett aktivt arkitekturbeslut, inte en vana.
