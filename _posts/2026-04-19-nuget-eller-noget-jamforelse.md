---
layout: post
title: "NuGet eller NoGet: En policy för hantering av paketberoenden i .NET-projekt"
date: 2026-04-19 10:37:14 +0200
category: "c-sharp,.NET,programmering"
---

Inom modern .NET-utveckling är lösningen ofta ett `dotnet add package` bort. Det är fantastiskt för produktiviteten, men varje ny dependency är också ett långsiktigt åtagande.

Så frågan är inte "NuGet eller NoGet" som ett svartvitt val, utan hur vi gör medvetna val.

Inspirerad av:

1. [NuGet eller NoGet, det är frågan](https://blogg.thomasbjork.net/nuget-eller-noget-det-ar-fragan/)
2. [Ersätt NuGet med NoGet: Priset vi betalar för Install-Package](https://blogg.thomasbjork.net/ersatt-nuget-med-noget/)

Här är en praktisk policy/checklista att använda i teamet innan ni tar in ett nytt paket.

## 1. Underhåll och Lindy-effekten

- **Senaste uppdatering:** Har paketet uppdaterats senaste året?
- **Community-aktivitet:** Svarar maintainers på issues och PR:er?
- **Nedladdningar:** Många användare är ingen garanti, men ett tecken på att paketet testats brett.

Ett paket som stått still i flera år i en aktiv teknikstack är en tydlig varningssignal.

## 2. Kartlägg transitiva beroenden

Ett litet paket kommer sällan ensamt. I praktiken får du ofta med dig flera lager av transitiva beroenden.

- **Regel:** Om ett enkelt hjälpbibliotek drar in ett stort träd av dependencies, leta alternativ.
- **Kommando:**  
  ```bash
  dotnet list package --include-transitive
  ```

Dependency hell börjar ofta här: versionskonflikter, svårdebuggade runtime-problem och högre attackyta.

## 3. Licensgranskning (ingen kompromiss)

- **Grönt ljus:** MIT, Apache 2.0, BSD.
- **Rött ljus (granska extra noga):** GPL/LGPL i kommersiella sammanhang.

Licensfrågan är inte teknikromantik. Den är juridik.

## 4. Kompatibilitet och lock-in

- Stödjer paketet era target frameworks (t.ex. moderna .NET-versioner)?
- Fungerar det på Linux och Windows om ni kör blandat?
- Har det dolda kopplingar till plattformsspecifika API:er?

Ett enda paket som släpar efter kan blockera en hel uppgradering av plattformen.

## 5. Make vs Buy: 60-minutersregeln

Ställ alltid frågan:

> "Kan vi implementera detta själva på under en timme?"

Om svaret är ja för en nischad funktion är NoGet ofta det bättre valet långsiktigt.

## 6. Bus factor och säkerhet

- Är projektet beroende av en enda maintainer?
- Finns kända sårbarheter (CVEs)?
- Har ni verktyg i pipeline för att upptäcka risker tidigt?

Varje externt paket är ett förtroende till en främmande leveranskedja.

## Praktiska verktyg i vardagen

- **NuGetTrends.com** – se om ett paket växer eller dör ut.
- **Fuget.org** – inspektera API och implementation innan installation.
- **dotnet-outdated** – hitta paket som halkat efter.
- **Dependabot/GitHub Security** – fånga kända sårbarheter.

## En enkel teampolicy (förslag)

Inga nya paket tas in utan att PR:n beskriver:

1. Varför paketet behövs.
2. Alternativ som övervägts (inklusive NoGet).
3. Licens.
4. Transitiva beroenden.
5. Exit-strategi om paketet blir övergivet.

## Sammanfattning

NuGet är ett kraftfullt verktyg, men NoGet är en nyttig motvikt. Målet är inte att undvika alla beroenden, utan att välja rätt beroenden av rätt skäl.

Gör beroenden till ett arkitekturbeslut, inte en reflex.
