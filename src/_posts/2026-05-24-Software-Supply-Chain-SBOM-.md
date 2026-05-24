---
layout: post
title: "🔐 Säkra din Software Supply Chain: Så automatiserar du SBOM med Microsoft Sbom Tool och CycloneDX"
date: 2026-05-24 14:00 +0200
category: "c-sharp,.NET,programmering"
---

I en tid där cyberattacker allt oftare riktas mot mjukvarukedjan (Software Supply Chain) har begreppet **SBOM (Software Bill of Materials)** gått från att vara ett "bra att ha" till ett absolut krav. Att veta exakt vilka komponenter, öppna källkodspaket och beroenden din applikation består av är grundbulten i modern applikationssäkerhet.

<!--more-->

Om du rör dig i .NET-ekosystemet finns det framför allt två kraftfulla spår för att generera SBOM:s: Microsofts officiella **`Microsoft.Sbom.Tool`** (som fokuserar på SPDX-formatet) och **CycloneDX-dotnet** (som levererar det branschstandardiserade CycloneDX-formatet).

Här går vi igenom hur verktygen fungerar, hur du kör dem lokalt, hur du automatiserar dem i din CI/CD-pipeline, och hur du väljer rätt väg för din organisation.

---

## Del 1: Microsoft.Sbom.Tool – Det officiella spåret

Microsofts officiella SBOM-verktyg är en cross-platform CLI skrivet i .NET som är designat för att vara extremt skalbart. Det är samma verktyg som Microsoft själva använder internt för att signera och validera sina produkter. Verktyget producerar i dagsläget filer i **SPDX (Software Package Data Exchange)**-formatet.

### Köra lokalt

Du kan enkelt installera verktyget globalt via dotnet CLI eller ladda ner binären direkt från GitHub.

```bash
# Installera som ett globalt dotnet-verktyg
dotnet tool install --global Microsoft.Sbom.Tool

```

För att generera en SBOM för ditt projekt kör du kommandot `sbom-tool generate`. Här är ett typiskt exempel:

```bash
sbom-tool generate \
  -BuildDropPath "./bin/Release/net10.0/publish" \
  -BuildComponentPath "./" \
  -PackageName "MinApplikation" \
  -PackageVersion "1.0.0" \
  -Owner "MittFöretag" \
  -NamespaceUri "https://mittforetag.se/sbom/minapplikation/1.0.0" \
  -ManifestDirPath "./sbom-output"

```

* **`-BuildDropPath`**: Mappen där dina färdiga binärer ligger (det som ska distribueras). Verktyget hashar dessa filer.
* **`-BuildComponentPath`**: Mappen där källkoden och dina projektfiler (`.csproj`, `packages.config`) finns. Verktyget skannar dessa efter beroenden.
* **`-ManifestDirPath`**: Det katalog safeguards där den färdiga `manifest.json` (SPDX-filen) hamnar.

### Automatisera i CI/CD (GitHub Actions)

Att köra detta manuellt håller självklart inte i längden. Så här integrerar du `Microsoft.Sbom.Tool` i ett GitHub Actions-workflow efter att du har byggt eller publicerat din applikation:

```yaml
- name: Publish Application
  run: dotnet publish -c Release -o ./publish

- name: Install SBOM Tool
  run: dotnet tool install --global Microsoft.Sbom.Tool

- name: Generate SBOM
  run: |
    sbom-tool generate \
      -BuildDropPath "./publish" \
      -BuildComponentPath "./" \
      -PackageName "${{ github.event.repository.name }}" \
      -PackageVersion "1.0.${{ github.run_number }}" \
      -Owner "SoftArch Corp" \
      -NamespaceUri "https://github.com/${{ github.repository }}/sbom/${{ github.run_number }}" \
      -ManifestDirPath "./publish/_manifest"

- name: Upload Build Artifacts
  uses: actions/upload-artifact@v4
  with:
    name: published-app-with-sbom
    path: ./publish

```

---

## Del 2: OWASP CycloneDX – Branschstandardiserad flexibilitet

Medan Microsofts verktyg fokuserar på SPDX, föredrar många säkerhetsteam **CycloneDX**-formatet, vilket är OWASP:s flaggskeppsformat för just Supply Chain-säkerhet. Det är ofta mer lätthanterligt i JSON-format och har ett enormt ekosystem av verktyg kring sig (såsom Dependency-Track).

Inom .NET-världen hanterar vi detta på två sätt: via CLI-verktyget för automatisering, eller programmatiskt via NuGet-paket.

### Alternativ A: Globalt CLI-verktyg (`cyclonedx-dotnet`)

Detta är det snabbaste sättet att generera en CycloneDX-fil för en hel solution eller ett specifikt projekt.

```bash
# Installera verktyget
dotnet tool install --global CycloneDX

# Generera en JSON-fil baserad på din lösning
dotnet cyclonedx MinLosning.sln -o ./sbom-output -f json

```

Detta skapar en `bom.json` i målmappen som innehåller alla dina transienta och direkta NuGet-beroenden, kompletta med PURL (Package URL) och licensinformation.

### Alternativ B: Programmatiskt med `CycloneDX.Models`

Om du bygger egna interna verktyg, plattformar eller vill ha total kontroll över hur din SBOM genereras (kanske vill du slå ihop data från flera källor eller lägga till egna metadata), kan du använda NuGet-paketet `CycloneDX.Core` och `CycloneDX.Models`.

Här är ett exempel på hur du skapar en CycloneDX SBOM direkt i C#-kod:

```csharp
using System;
using System.IO;
using System.Collections.Generic;
using CycloneDX.Models;
using CycloneDX.Json;

// 1. Skapa grundmodellen för din BOM
var bom = new Bom
{
    SpecVersion = SpecificationVersion.v1_5,
    SerialNumber = $"urn:uuid:{Guid.NewGuid()}",
    Version = 1,
    Metadata = new Metadata
    {
        Timestamp = DateTime.UtcNow,
        Component = new Component
        {
            Type = Component.ComponentType.Application,
            Name = "MinArkitektur.CoreAPI",
            Version = "2.1.0",
            Description = "Huvud-API för affärslogik"
        }
    },
    Components = new List<Component>()
};

// 2. Lägg till komponenter/beroenden (här hårdkodat, men kan loopas från t.ex. en filskanning)
bom.Components.Add(new Component
{
    Type = Component.ComponentType.Library,
    Name = "Newtonsoft.Json",
    Version = "13.0.3",
    Purl = "pkg:nuget/Newtonsoft.Json@13.0.3",
    Licenses = new List<LicenseChoice>
    {
        new LicenseChoice { License = new License { Id = "MIT" } }
    }
});

// 3. Serialisera till JSON-format enligt standarden
string jsonOutput = BomSerializer.Serialize(bom);

// 4. Spara filen
File.WriteAllText("BomCustom.json", jsonOutput);
Console.WriteLine("CycloneDX SBOM har genererats programmatiskt!");

```

---

## Best Practices: Hur tar man fram SBOM på bästa sätt?

Att bara dumpa en JSON-fil i en mapp gör ingen säkrare. För att Supply Chain Security ska fungera i praktiken bör du applicera följande strategier:

### 1. Automatisera tidigt och konsekvent

Generera alltid din SBOM i din **Release-pipeline**. Den ska skapas i samband med att din artefakt byggs, så att du garanterat vet att det som hamnar i produktion matchar din SBOM exakt.

### 2. Signera din SBOM

En SBOM går att manipulera. Genom att signera din SBOM (exempelvis med verktyg som *Cosign* eller via interna certifikat i din pipeline) kan konsumenten (eller ditt produktionskluster) verifiera att filen inte har ändrats efter att den skapades i den säkra CI-miljön.

### 3. Integrera med kontinuerlig sårbarhetsskanning

Att titta i en rå JSON-fil är opraktiskt. Läs in dina genererade SBOM-filer i ett centralt verktyg som **OWASP Dependency-Track** eller **Trivy**. Dessa verktyg matchar kontinuerligt din SBOM mot kända sårbarhetsdatabaser (CVE:er). Det betyder att om en ny sårbarhet upptäcks i ett paket du använde för sex månader sedan, får du ett larm direkt – utan att du behöver bygga om applikationen.

### 4. Välj format strategiskt

* Välj **SPDX (`Microsoft.Sbom.Tool`)** om du levererar programvara till myndigheter eller enterprise-kunder som har strikta krav på Microsoft-kompatibilitet eller specifika upphandlingar där SPDX krävs.
* Välj **CycloneDX (`cyclonedx-dotnet`)** om du vill ha maximal flexibilitet, ett modernare JSON-stöd och smidig integration med moderna open-source säkerhetsverktyg.

---

## Sammanfattning

Att införa SBOM är inte svårt i .NET-ekosystemet tack vare verktygen vi har tillgång till idag. Genom att lägga till några rader i dina GitHub Actions eller Azure DevOps-pipelines kan du automatiskt generera kompletta innehållsförteckningar över din mjukvara. Det skyddar inte bara dina kunder, utan ger även ditt eget team full koll på er tekniska skuld och licenshantering.

Börja med att installera `CycloneDX` eller `Microsoft.Sbom.Tool` lokalt idag och se vad dina applikationer *egentligen* innehåller!