---
layout: post
title: "Bygg en egen blixtsnabb (och gratis) SBOM- och Sårbarhetsscanner för .NET"
date: 2026-05-24 13:52 +0200
category: "c-sharp,.NET,programmering"
---

I dagens landskap av "Supply Chain Security" är kraven på kontroll över tredjepartsberoenden högre än någonsin. Att veta exakt vilka paket dina applikationer använder – och om de innehåller kända säkerhetshål – är inte längre valfritt. Många företag betalar dyra licenser för tredjepartstjänster och API:er för att lösa detta.
<!--more-->

Men visste du att hela .NET-ekosystemet och NuGet.org erbjuder all data du behöver helt gratis?

I den här guiden tittar vi på hur du kan bygga en egen C#-applikation som skannar hundratals Git-repon, extraherar det kompletta beroendeträdet, identifierar sårbarheter i minnet och samlar allt underlag som krävs för en formell Software Bill of Materials (SBOM).

## Steg 1: Genvägen till det kompletta beroendeträdet (Lock-filer)

Det absolut svåraste med att bygga en SBOM-scanner är att kartlägga *transitiva* beroenden (paket som dina paket i sin tur installerar). Att utvärdera MSBuild-träd programmatiskt är komplext.

Lösningen? **Lock-filer**. Om du har `RestorePackagesWithLockFile = true` aktiverat i dina projekt, genereras en `packages.lock.json`. Denna incheckade fil är guld värd – den ger dig hela trädet och de kryptografiska hashar (SHA-512) som krävs för ett SBOM, utan att du behöver kompilera koden.

Här är koden för att plocka ut alla paket och hashar:

```csharp
using System.Text.Json;
using System.Text.Json.Serialization;

string jsonContent = await File.ReadAllTextAsync("packages.lock.json");
var lockFile = JsonSerializer.Deserialize<LockFile>(jsonContent);

var extractedPackages = new List<NuGetPackage>();

foreach (var framework in lockFile!.Dependencies)
{
    foreach (var package in framework.Value)
    {
        if (package.Value.Type == "Project" || string.IsNullOrEmpty(package.Value.ContentHash))
            continue; // Skippa interna projekt

        extractedPackages.Add(new NuGetPackage(
            package.Key,
            package.Value.Resolved ?? "Okänd",
            package.Value.ContentHash));
    }
}

// Datamodeller
record LockFile(
    [property: JsonPropertyName("dependencies")]
    Dictionary<string, Dictionary<string, LockDependency>> Dependencies
);
record LockDependency(
    [property: JsonPropertyName("type")]
    string Type,
    [property: JsonPropertyName("resolved")]
    string Resolved,
    [property: JsonPropertyName("contentHash")]
    string ContentHash
);
record NuGetPackage(string Name, string Version, string ContentHash);

```

## Steg 2: Fånga arkitekturreglerna med Central Package Management

Om ni arbetar i en större arkitektur (t.ex. över tjugo applikationer) använder ni förmodligen Central Package Management (CPM). Medan lock-filen ger oss de exakta versionerna för ett specifikt bygge, ger `Directory.Packages.props` oss den övergripande bilden av vilka paketversioner som är *tillåtna* eller tvingade centralt.

Att läsa denna är supersmidigt med LINQ to XML:

```csharp
using System.Xml.Linq;

var doc = XDocument.Load("Directory.Packages.props");
var centralPackages = doc.Descendants("PackageVersion")
    .Select(node => new
    {
        Id = node.Attribute("Include")?.Value ?? node.Attribute("Update")?.Value ?? "",
        Version = node.Attribute("Version")?.Value ?? ""
    })
    .Where(p => !string.IsNullOrWhiteSpace(p.Id))
    .ToList();

```

## Steg 3: Sårbarhetsscanning utan nätverkskostnad

Nu när vi har listan med paket, hur kollar vi dem mot CVE-databaser? Istället för att fråga ett API paket för paket, erbjuder NuGet.org ett öppet **Vulnerability Info API**.

Tricket är att ladda ner hela databasen (`base.json`) till minnet. Det tar någon sekund, men därefter kan du scanna tusentals paket på millisekunder.

```csharp
using System.Net.Http.Json;
using System.Text.Json.Serialization;

using var client = new HttpClient();

// Ladda ner sårbarhetsdatabasen (base.json URL hämtas via NuGet Service Index v3)
var vulnerabilities = await client.GetFromJsonAsync<Dictionary<string, List<Vulnerability>>>(baseJsonUrl);

// Scanna dina extraherade paket i minnet
foreach (var pkg in extractedPackages)
{
    string searchKey = pkg.Name.ToLowerInvariant(); // Viktigt med små bokstäver

    if (vulnerabilities!.TryGetValue(searchKey, out var vulns))
    {
        Console.WriteLine($"VARNING: Hittade sårbarhet i {pkg.Name}!");
        // Kolla om din version (pkg.Version) faller inom vulns[i].Versions
    }
}

record Vulnerability([property: JsonPropertyName("severity")] int Severity, [property: JsonPropertyName("versions")] string Versions);

```

### Exempelkod för komplett körning
eller hela exemplet där base också laddas ned:

```csharp
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Xml.Linq;

string jsonContent = await File.ReadAllTextAsync("packages.lock.json");
var lockFile = JsonSerializer.Deserialize<LockFile>(jsonContent);

var extractedPackages = new List<NuGetPackage>();

foreach (var framework in lockFile!.Dependencies)
{
    foreach (var package in framework.Value)
    {
        if (package.Value.Type == "Project" || string.IsNullOrEmpty(package.Value.ContentHash))
            continue; // Skippa interna projekt

        extractedPackages.Add(new NuGetPackage(
            package.Key,
            package.Value.Resolved ?? "Okänd",
            package.Value.ContentHash));
    }
}

//// TODO: Förbättra detta genom att även inkludera paket från Directory.Packages.props (om det finns) för att få en mer komplett bild av alla paket som används i projektet, inte bara de som är låsta i lock-filen. Detta kan hjälpa till att identifiera sårbarheter i paket som kanske inte är låsta.
//var doc = XDocument.Load("Directory.Packages.props");
//var centralPackages = doc.Descendants("PackageVersion")
//    .Select(node => new
//    {
//        Id = node.Attribute("Include")?.Value ?? node.Attribute("Update")?.Value ?? "",
//        Version = node.Attribute("Version")?.Value ?? ""
//    })
//    .Where(p => !string.IsNullOrWhiteSpace(p.Id))
//    .ToList();



// 1. Konfigurera HttpClient med automatisk dekomprimering (Gzip och Brotli)
// Detta löser 0x1F-felet (Gzip magic number) när den stora base laddas ner.
var handler = new HttpClientHandler
{
    AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Brotli
};

using var client = new HttpClient(handler);

Console.WriteLine("Hämtar Service Index från NuGet...");

// 2. Hämta NuGet V3 Service Index
var serviceIndexUrl = "https://api.nuget.org/v3/index.json";
ServiceIndex? serviceIndex;
try
{
    serviceIndex = await client.GetFromJsonAsync<ServiceIndex>(serviceIndexUrl);
}
catch (Exception ex)
{
    Console.WriteLine($"Kunde inte hämta Service Index: {ex.Message}");
    return;
}

// 3. Hitta slutpunkten för VulnerabilityInfo i indexet
var vulnResourceUrl = serviceIndex?.Resources
    .FirstOrDefault(r => r.Type.StartsWith("VulnerabilityInfo"))?.Id;

if (vulnResourceUrl is null)
{
    Console.WriteLine("Kunde inte hitta sårbarhets-API:et i Service Index.");
    return;
}

Console.WriteLine($"Hittade sårbarhetsindex på: {vulnResourceUrl}");
Console.WriteLine("Hämtar fillistan för sårbarheter...");

// 4. Hämta fillistan (innehåller referenser till base)
var vulnFiles = await client.GetFromJsonAsync<List<VulnerabilityFile>>(vulnResourceUrl);
string? baseJsonUrl = vulnFiles?.FirstOrDefault(f => f.Name == "base")?.Id;

if (baseJsonUrl is null)
{
    Console.WriteLine("Kunde inte hitta URL:en till base.");
    return;
}

Console.WriteLine($"Laddar ner och packar upp sårbarhetsdatabasen (base)...");

// 5. Ladda ner hela sårbarhetsdatabasen
// Tack vare HttpClientHandler kommer detta nu att dekomprimeras sömlöst i minnet.
var vulnerabilities = await client.GetFromJsonAsync<Dictionary<string, List<Vulnerability>>>(baseJsonUrl);

if (vulnerabilities is null)
{
    Console.WriteLine("Sårbarhetsdatabasen var tom.");
    return;
}

Console.WriteLine($"Databasen inladdad! Hittade sårbarhetsdata för {vulnerabilities.Count} unika paket.");

Console.WriteLine("\n=== PÅBÖRJAR SÅRBARHETSSKANNING ===");

foreach (var pkg in extractedPackages)
{
    // NuGet-API:et kräver att alla paket-ID:n är i gemener (små bokstäver) vid sökning
    string searchKey = pkg.Name.ToLowerInvariant();

    if (vulnerabilities.TryGetValue(searchKey, out var vulnList))
    {
        Console.WriteLine($"\n[AVVISNING/VARNING] Paket: {pkg.Name} (Använd version: {pkg.Version})");
        Console.WriteLine($" -> Hittade {vulnList.Count} kända sårbarhetsintervall i databasen:");

        foreach (var vuln in vulnList)
        {
            var severityStr = vuln.Severity switch
            {
                0 => "Låg",
                1 => "Medel",
                2 => "Hög",
                3 => "Kritisk",
                _ => "Okänd"
            };

            Console.WriteLine($"    - Allvarlighetsgrad: {severityStr}");
            Console.WriteLine($"      Berörda versioner:  {vuln.Versions}");
            Console.WriteLine($"      Mer information:    {vuln.Url}");
        }
    }
    else
    {
        Console.WriteLine($"\n[OK] Paket: {pkg.Name} ({pkg.Version}) - Inga kända sårbarheter registrerade.");
    }
}


#region DATAMODELLER (Strikta definitioner för NuGets API-format)

record ServiceIndex(
    [property: JsonPropertyName("resources")] List<Resource> Resources
);

record Resource(
    [property: JsonPropertyName("@id")] string Id,
    [property: JsonPropertyName("@type")] string Type
);

record VulnerabilityFile(
    [property: JsonPropertyName("@name")] string Name,
    [property: JsonPropertyName("@id")] string Id
);

record Vulnerability(
    [property: JsonPropertyName("severity")] int Severity,
    [property: JsonPropertyName("versions")] string Versions,
    [property: JsonPropertyName("url")] string Url
);

record LockFile(
    [property: JsonPropertyName("dependencies")]
    Dictionary<string, Dictionary<string, LockDependency>> Dependencies
);

record LockDependency(
    [property: JsonPropertyName("type")]
    string Type,
    [property: JsonPropertyName("resolved")]
    string Resolved,
    [property: JsonPropertyName("contentHash")]
    string ContentHash
);

record NuGetPackage(string Name, string Version, string ContentHash);

#endregion

```

### Reultatet
Resultatet av en körning blir då något i stil med:

```ps1
Hämtar Service Index från NuGet...
Hittade sårbarhetsindex på: https://api.nuget.org/v3/vulnerabilities/index.json
Hämtar fillistan för sårbarheter...
Laddar ner och packar upp sårbarhetsdatabasen (base)...
Databasen inladdad! Hittade sårbarhetsdata för 559 unika paket.

=== PÅBÖRJAR SÅRBARHETSSKANNING ===

[AVVISNING/VARNING] Paket: Azure.Identity (Använd version: 1.19.0)
 -> Hittade 3 kända sårbarhetsintervall i databasen:
    - Allvarlighetsgrad: Medel
      Berörda versioner:  (, 1.11.0)
      Mer information:    https://github.com/advisories/GHSA-wvxc-855f-jvrv
    - Allvarlighetsgrad: Hög
      Berörda versioner:  (, 1.10.2)
      Mer information:    https://github.com/advisories/GHSA-5mfx-4wcx-rv27
    - Allvarlighetsgrad: Medel
      Berörda versioner:  (, 1.11.4)
      Mer information:    https://github.com/advisories/GHSA-m5vv-6r4h-3vj9

[OK] Paket: JavaScriptEngineSwitcher.Extensions.MsDependencyInjection (3.31.0) - Inga kända sårbarheter registrerade.

[OK] Paket: JavaScriptEngineSwitcher.V8 (3.31.0) - Inga kända sårbarheter registrerade.

[OK] Paket: LigerShark.WebOptimizer.Core (3.0.477) - Inga kända sårbarheter registrerade.

[OK] Paket: LigerShark.WebOptimizer.Sass (3.0.147) - Inga kända sårbarheter registrerade.

[AVVISNING/VARNING] Paket: MailKit (Använd version: 4.16.0)
 -> Hittade 1 kända sårbarhetsintervall i databasen:
    - Allvarlighetsgrad: Medel
      Berörda versioner:  (, 4.16.0)
      Mer information:    https://github.com/advisories/GHSA-9j88-vvj5-vhgr

[OK] Paket: Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore (10.0.5) - Inga kända sårbarheter registrerade.

[OK] Paket: Microsoft.AspNetCore.Identity.EntityFrameworkCore (10.0.5) - Inga kända sårbarheter registrerade.

[OK] Paket: Microsoft.AspNetCore.Identity.UI (10.0.5) - Inga kända sårbarheter registrerade.

[OK] Paket: Microsoft.AspNetCore.OpenApi (10.0.5) - Inga kända sårbarheter registrerade.

```

## Steg 4: Knyt ihop säcken – Enterprise-arkitekturen

För att bygga en komplett applikation som scannar hela företagets kodbas och uppfyller SBOM-kraven, sätter vi nu ihop dessa delar i en orkestrerande tjänst:

1. **Git-orkestrering:** Använd ett bibliotek som `LibGit2Sharp` för att loopa igenom alla era C#-repon. Klona ner dem lokalt eller läs direkt ur Git-trädet.
2. **Datainsamling:**
* Extrahera `packages.lock.json` för att få trädet och säkerhetshasharna (vårt Steg 1).
* Läs eventuellt av `Directory.Packages.props` och projektets alla `*.csproj` för att hitta felkonfigurationer (för att skanna alla äldre projekt också som ännu inte kör .NET8+).


3. **Licensuppslag:** Ett formellt SBOM kräver licensinformation. Eftersom lock-filen saknar detta, kompletterar du dina paket genom att slå upp deras licensuttryck (ex. MIT) via NuGets vanliga registrerings-API.
4. **Säkerhetskontroll:** Kör hela listan mot den cachade sårbarhetsdatabasen (vårt Steg 3).
5. **Export:** Använd NuGet-paketet `CycloneDX.Models` för att formatera om din data (paket, hashar, licenser) till en branschstandardiserad CycloneDX JSON/XML-fil.

### Resultatet

Du har nu byggt en centraliserad tjänst som kan köras varje natt. Den genererar formella, compliance-redo SBOM:er för alla era applikationer, flaggar omedelbart om ett sårbart paket har smygit sig in i ett underliggande beroende, och det kostar er inte en krona i licensavgifter.

---

*Har ni implementerat liknande lösningar för att hantera Supply Chain Security? Dela gärna med er av era erfarenheter!*
