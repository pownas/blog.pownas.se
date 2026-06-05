---
layout: post
title: "Förstå .NET SDK-versioner: Vad är skillnaden på 10.0.108, 10.0.204 och 10.0.300?"
date: 2026-06-04 07:15 +0200
category: "c-sharp,.NET,programmering"
---

Har du någon gång tittat på versionsnumret för en .NET SDK och undrat varför det hoppar från `10.0.108` till `10.0.204` istället för att följa vanlig semantisk versionshantering (SemVer)?

Det är lätt att tro att det bara är slumpmässiga siffror, men sanningen är att de tre sista siffrorna i en .NET SDK-version döljer viktig information. Genom att förstå hur Microsoft paketerar sina utvecklingsverktyg kan du både säkra dina applikationer och förhindra att dina CI/CD-pipelines plötsligt går röda.

I det här inlägget reder vi ut begreppet **Feature Bands** och hur du bäst konfigurerar din `global.json` för en stabil och säker utvecklingsmiljö.

<!--more-->

---

## Hur .NET SDK versionshanteras (Feature Bands)

Till skillnad från .NET Runtime (som följer strikt SemVer för att garantera bakåtkompatibilitet), använder .NET SDK de tre sista siffrorna (`XYZ` i `Major.Minor.Patch`) för att representera **Feature Bands** (funktionsband) och **Patch-nivå**.

Strukturen för en SDK-version som `10.0.204` ser ut så här:

* **Hundratalet (X):** Identifierar vilket *Feature Band* SDK:n tillhör. Varje nytt funktionsband släpps vanligtvis kvartalsvis. De för med sig uppdaterade kodanalysatorer (analyzers), nya C#-kompilatorfunktioner och en tätare integration med specifika versioner av Visual Studio.
* **De sista två siffrorna (YZ):** Identifierar *patch-nivån* (servicing-versionen). Dessa släpps månadsvis (ofta på "Patch Tuesday") och innehåller renodlade säkerhetsuppdateringar och buggfixar inom det specifika bandet.

### De tre versionerna i praktiken

Alla dessa tre SDK-versioner bygger applikationer som targetar samma underliggande runtime (`net10.0`). Skillnaden ligger helt i utvecklingsverktygen och kompilatorns strikthed:

* **.NET SDK 10.0.108:** Tillhör funktionsband (feature band) `1xx` (det första stabila bandet för .NET 10). Detta skeppas i regel med den första skarpa versionen av det årets Visual Studio (t.ex. VS 2026 version 18.0). Siffran `08` innebär att det är den åttonde månatliga säkerhetsuppdateringen för detta band.
* **.NET SDK 10.0.204:** Tillhör funktionsband (feature band) `2xx` (släppt ca 3 månader efter det första). Innehåller nya produktivitetsfunktioner i CLI/MSBuild, nya analyzers och tätare koppling till t.ex. Visual Studio 18.4. Detta är den fjärde patchen för `2xx`-bandet.
* **.NET SDK 10.0.300:** Tillhör funktionsband (feature band) `3xx` (släppt ytterligare ett kvartal senare, kopplat till Visual Studio 18.6). Eftersom de sista siffrorna är `00` är detta den allra första RTM-releasen av det tredje funktionsbandet, vilket innebär att det ännu inte har fått några efterföljande säkerhetspatcher inom sitt eget band.

---

## Bästa inställning i `global.json` för högsta säkerhet

När du sätter upp en `global.json` för ditt projekt vill du uppnå en perfekt balans: **alltid använda de senaste säkerhetspatcharna**, men samtidigt **undvika att byggen går sönder oväntat** på grund av att ett nytt funktionsband introducerar strängare kodanalysatorer.

Om du har `TreatWarningsAsErrors` aktiverat i ditt projekt (vilket är best practice) kan ett hopp till ett nytt funktionsband plötsligt göra att gamla kodmönster flaggas som fel, och din pipeline går röd på en helt orelaterad Pull Request.

För den optimala balansen mellan deterministiska byggen och högsta säkerhet rekommenderas följande konfiguration:

```json
{
  "sdk": {
    "version": "10.0.108",
    "rollForward": "latestPatch",
    "allowPrerelease": false
  }
}

```

### Varför är detta den bästa strategin?

* **`"rollForward": "latestPatch"`**: Detta tvingar .NET CLI att stanna kvar inom det definierade funktionsbandet (i detta fall `1xx`), men det plockar automatiskt upp den absolut senaste månatliga säkerhetspatchen som finns installerad på maskinen eller i byggservern (t.ex. om `10.0.109` släpps). Den tillåter däremot *inte* att bygget hoppar upp till `10.0.204` eller `10.0.300` och skyddar dig därmed mot "breaking analyzers".
* **`"allowPrerelease": false`**: Säkerställer att produktionsbyggen aldrig av misstag rullar framåt till en Alpha-, Beta- eller Release Candidate-version av en framtida SDK som råkar finnas installerad på byggmiljön.

### Det strikta alternativet: Automatisera allt

Om du hanterar alla dina SDK-uppdateringar helt deklarativt via verktyg som Dependabot eller Renovate, eller kontrollerar exakt version direkt i dina GitHub Actions (`actions/setup-dotnet`), kan du välja att låsa versionen helt:

```json
{
  "sdk": {
    "version": "10.0.108",
    "rollForward": "disable"
  }
}

```

Detta ger 100 % deterministiska byggen, men det ställer höga krav på att du har automatiserade processer som uppdaterar själva strängen i `global.json` varje månad när Microsoft släpper nya säkerhetsfixar. Om du inte har den automatiseringen på plats är `"latestPatch"` det säkraste valet i praktiken.

---

## Officiella källor och vidare läsning

Vill du fördjupa dig i hur .NET-teamet designar sin versionshantering? Här är de officiella källorna från Microsofts dokumentation:

* **[Overview of .NET SDK versioning](https://learn.microsoft.com/en-us/dotnet/core/tools/sdk-versioning):** Beskriver i detalj hur de tre sista siffrorna i SDK-versionen representerar funktionsband och hur de mappar mot Visual Studio-releaser.
* **[global.json overview - Matching rules](https://learn.microsoft.com/en-us/dotnet/core/tools/global-json%3Ftabs%3Dnetcore3x%23matching-rules):** Dokumenterar exakt hur `rollForward`-policys utvärderas samt hur `allowPrerelease` påverkar valet av SDK vid kompilering.
* **[How .NET is versioned](https://learn.microsoft.com/en-us/dotnet/core/versions/):** Förklarar de övergripande principerna för hur hela .NET-ekosystemet versionshanteras, inklusive skillnaden mellan LTS- och STS-stöd.
* **[Download .NET 10.0](https://dotnet.microsoft.com/en-us/download/dotnet/10.0):** Den officiella nedladdningssidan och versionshistoriken där du kan se aktuella tabeller över släppta SDK-versioner och åtgärdade CVE-rapporter.
