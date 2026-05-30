---
layout: post
title: "Skillnaderna mellan .NET SDK 10.0.108, 10.0.204 och 10.0.300"
date: 2026-06-04 07:15 +0200
category: "c-sharp,.NET,programmering"
---

Skillnaderna mellan dessa tre SDK-versioner ligger primärt i begreppet **"Feature Bands"** (funktionsband) och hur Microsoft paketerar nya funktioner samt verktygsuppdateringar i .NET CLI och MSBuild under en versions livscykel.

En .NET SDK-version är uppbyggd enligt strukturen `Major.Minor.Patch` (t.ex. `10.0.XYZ`), men för just SDK:n har de tre sista siffrorna (`XYZ`) en särskild betydelse:

<!--more-->

* **Hundratalet (X):** Identifierar vilket *Feature Band* SDK:n tillhör. Varje nytt funktionsband släpps vanligtvis kvartalsvis och för med sig uppdaterade analysatorer (analyzers), nya C#-kompilatorfunktioner, samt tätare integration med specifika versioner av Visual Studio.
* **De sista två siffrorna (YZ):** Identifierar *patch-nivån* (servicing-versionen). Dessa släpps månadsvis (ofta på "Patch Tuesday") och innehåller renodlade säkerhetsuppdateringar och buggfixar.

### Specifik uppdelning:

* **SDK 10.0.108**
* **Feature Band:** `1xx` (Det första stabila funktionsbandet för .NET 10).
* **Innebörd:** Det här bandet skeppas i regel med den första skarpa versionen av det årets Visual Studio (t.ex. VS 2026 version 18.0).
* **Patch-nivå:** `08`. Detta innebär att det är den 8:e månatliga säkerhets- och stabilitetsuppdateringen för just `1xx`-bandet.


* **SDK 10.0.204**
* **Feature Band:** `2xx` (Det andra funktionsbandet, släppt ca 3 månader efter det första).
* **Innebörd:** Innehåller nya produktivitetsfunktioner i CLI/MSBuild, nya kodanalysatorer och förbättrat verktygsstöd (ofta kopplat till en mindre Visual Studio-uppdatering, t.ex. VS 18.1).
* **Patch-nivå:** `04`. Den 4:e månatliga patchen för detta specifika band.


* **SDK 10.0.300**
* **Feature Band:** `3xx` (Det tredje funktionsbandet, släppt ytterligare ett kvartal senare).
* **Innebörd:** Ytterligare utökat verktygsstöd och uppdaterade kompilatorvarningar/analyzers (ofta kopplat till t.ex. VS 18.2).
* **Patch-nivå:** `00`. Detta är den första RTM-releasen av det tredje funktionsbandet, vilket innebär att det ännu inte har fått några efterföljande månatliga säkerhetspatcher inom sitt eget band.



> **Viktigt att notera:** Alla dessa tre SDK:er kan bygga applikationer som targetar runtime-versionen `net10.0`. Skillnaden ligger helt i utvecklingsverktygen, kompilatorns strikthed (nya analyzers) och MSBuild-funktionerna.

---

## Bästa inställning i `global.json` för högsta säkerhet

När det gäller säkerhet i CI/CD-pipelines och lokala miljöer vill man uppnå två saker samtidigt: **alltid använda de senaste säkerhetspatcharna** men samtidigt **undvika att byggen går sönder oväntat** på grund av att nya funktionsband introducerar strängare kodanalysatorer (vilket är ett vanligt problem om man har `TreatWarningsAsErrors` aktiverat).

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

### Varför är detta den säkraste och bästa inställningen?

* **`"rollForward": "latestPatch"`**
Detta tvingar .NET CLI att stanna kvar inom det definierade funktionsbandet (i detta fall `1xx`), men det plockar automatiskt upp den absolut senaste månatliga säkerhetspatchen som finns installerad på maskinen eller i byggservern (t.ex. om `10.0.109` eller `10.0.110` släpps). Den tillåter däremot *inte* att bygget hoppar upp till `10.0.204` eller `10.0.300`.
* **Skydd mot "Breaking Analyzers":** Om du skulle använda `"rollForward": "latestFeature"` och byggservern plötsligt installerar SDK `10.0.300`, kan nya inbyggda kodanalysatorer börja varna för gammal kod. Om du har `TreatWarningsAsErrors` påslaget (vilket i sig är en best practice för säkerhet) kommer din pipeline plötsligt att gå röd på helt orelaterade PR-ändringar.
* **`"allowPrerelease": false`**
Säkerställer att produktionsbyggen aldrig av misstag rullar framåt till en Alpha-, Beta- eller Release Candidate-version av en framtida SDK (t.ex. .NET 11 previews) som råkar finnas installerad på miljöerna.

### Ett alternativ för miljöer med extremt strikt patch-kontroll

Om du hanterar alla dina SDK-uppdateringar helt deklarativt via verktyg som Dependabot/Renovate, eller kontrollerar exakt version i dina GitHub Actions (`actions/setup-dotnet`), kan du välja att låsa versionen helt:

```json
{
  "sdk": {
    "version": "10.0.108",
    "rollForward": "disable"
  }
}

```

Detta ger 100 % deterministiska byggen, men det ställer höga krav på att du har automatiserade processer som uppdaterar själva strängen i `global.json` varje månad när Microsoft släpper nya säkerhetsfixar. Om du inte har den automatiseringen är `"latestPatch"` det säkraste valet i praktiken.



Här är en sammanfattning av informationen samt de officiella källorna från Microsofts dokumentation.























## Sammanfattning

### 1. Skillnaden mellan SDK-versionerna (.NET Feature Bands)

* **Strukturen för .NET SDK-versioner:** Till skillnad från rariteter (runtimes) som följer vanlig semantisk versinering, använder .NET SDK de tre sista siffrorna (`XYZ` i `Major.Minor.Patch`) för att representera **Feature Bands** och **Patch-nivå**.
* **Hundratalet (X):** Representerar *funktionsbandet* (Feature Band). Det släpps nya funktionsband (t.ex. `1xx`, `2xx`, `3xx`) i takt med mindre uppdateringar av Visual Studio (t.ex. 18.0, 18.1, 18.2). Dessa innehåller nya CLI-funktioner, MSBuild-uppdateringar och strängare kodanalysatorer (analyzers).
* **De sista två siffrorna (YZ):** Representerar *patch-nivån* (servicing-releaser) inom det specifika bandet, vilket främst innebär månatliga säkerhets- och buggfixar.
* **Applikationspåverkan:** Alla tre SDK-versioner (`10.0.108`, `10.0.204`, `10.0.300`) kan kompilera applikationer mot målplattformen `net10.0`. Skillnaden ligger enbart i utvecklingsverktygen och kompilatorns strikthed.

### 2. Säkraste inställningen i `global.json`

För att balansera **högsta säkerhet** (alltid ha senaste säkerhetspatcharna) med **stabila byggen** (undvika att pipelines går sönder av nya kompilatorvarningar) är rekommendationen:

```json
{
  "sdk": {
    "version": "10.0.108",
    "rollForward": "latestPatch",
    "allowPrerelease": false
  }
}

```

* **`latestPatch`:** Tillåter SDK:n att rulla framåt till senaste månatliga säkerhetsfix (t.ex. `.109`), men hindrar den från att hoppa till ett nytt funktionsband (`2xx` eller `3xx`) som kan introducera nya "breaking" analyzers (vilket fäller byggen om `TreatWarningsAsErrors` är aktivt).
* **`allowPrerelease: false`:** Spärrar systemet från att av misstag använda instabila förhandsversioner (Previews/RCs).
* **Alternativet `disable`:** Kan användas om du strikt hanterar alla SDK-uppdateringar deklarativt via automatiserade verktyg som Renovate eller Dependabot.

---

## Källor och officiell dokumentation

Informationen bygger på Microsofts officiella arkitekturregler för hur .NET SDK versionshanteras och hur `global.json` utvärderas av .NET CLI:

1. **Hur .NET SDK versionshanteras (Feature Bands):**
* [Microsoft Learn: Overview of .NET SDK versioning](https://learn.microsoft.com/en-us/dotnet/core/tools/sdk-versioning)
* *Beskriver i detalj hur de tre sista siffrorna i SDK-versionen (t.ex. 100, 200, 300) representerar funktionsband och hur de mappar mot Visual Studio-releaser.*


2. **Konfiguration och beteende för `global.json` (`rollForward`):**
* [Microsoft Learn: global.json overview - Matching rules](https://learn.microsoft.com/en-us/dotnet/core/tools/global-json%3Ftabs%3Dnetcore3x%23matching-rules)
* *Dokumenterar exakt hur `rollForward`-policys som `latestPatch`, `latestFeature` och `disable` utvärderas samt hur `allowPrerelease` påverkar valet av SDK vid kompilering.*









3. **Övergripande versionshantering för .NET-plattformen**

* **Länk:** [Microsoft Learn: How .NET is versioned](https://learn.microsoft.com/en-us/dotnet/core/versions/)
* **Beskrivning:** Den här sidan förklarar de övergripande principerna för hur hela .NET-ekosystemet versionshanteras (inte bara SDK:n). Den går igenom skillnaden på **LTS** (Long-Term Support) och **STS** (Standard-Term Support, tidigare kallat Current), samt hur Microsoft garanterar bakåtkompatibilitet. Sidan är viktig för att förstå den underliggande filosofin: att runtime-versionen (t.ex. `net10.0`) hålls strikt kompatibel och stabil, medan utvecklingsverktygen (SDK) tillåts utvecklas snabbare.

4. **Nedladdning och versionshistorik för .NET 10.0**

* **Länk:** [Microsoft .NET: Download .NET 10.0](https://dotnet.microsoft.com/en-us/download/dotnet/10.0)
* **Beskrivning:** Detta är den officiella nedladdningssidan för .NET 10.0. Utöver att ladda ner installationsfiler fungerar den som en levande versionshistorik (release notes). Det är här du rent praktiskt kan se tabeller över exakt vilka SDK-versioner som är aktuella just nu (t.ex. om det har släppts en `.109` eller `.205`), vilka säkerhetsbulletiner (CVE-rapporter) som åtgärdats i varje månadspatch, samt vilken specifik version av Visual Studio som varje funktionsband kräver.



