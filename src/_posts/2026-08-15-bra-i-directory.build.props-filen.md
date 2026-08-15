---
layout: post
title: 'Skala din .NET-arkitektur: Best Practices för Directory.Build.props i Enterprisemiljöer'
date: 2026-08-15 20:20 +0200
category: "programmering,csharp,dotnet,säkerhet"
---


När en .NET-lösning växer från ett fåtal mikrotjänster till tiotals eller hundratals projekt blir hanteringen av .csproj-filer snabbt en administrativ mardröm. Att manuellt synkronisera C#-versioner, kodanalysregler, säkerhetspolicyer och bygginställningar över hela kodbasen leder obönhörligen till "configuration drift" – där olika delar av systemet byggs med olika regler.
Lösningen heter Directory.Build.props. Genom att placera denna fil i roten av ert repository importerar MSBuild automatiskt dess innehåll i samtliga underliggande projekt.
Här är de viktigaste inställningarna du bör införa i Directory.Build.props för att säkra kodkvalitet, säkerhet och deterministiska byggen i en enterprisemiljö.
## 1. Kodkvalitet utan kompromisser
I stora team räcker det inte med skrivna riktlinjer för kodkvalitet; reglerna måste tvingas fram av kompilatorn. Genom att centralisera kodanalysen i MSBuild säkerställer ni att alla utvecklare och byggservrar arbetar mot exakt samma standard.
```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <ImplicitUsings>enable</ImplicitUsings>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
</PropertyGroup>
```

 * TreatWarningsAsErrors: Förvandlar kompilatorvarningar till hårda fel. Detta förhindrar att teamet drabbas av "varningströtthet" där varningar ignoreras tills de hopar sig.
 * EnforceCodeStyleInBuild: Gör att regler definierade i er .editorconfig valideras direkt under kompileringen och inte bara som visuella vinkar i IDE-miljön.
 * AnalysisLevel: Aktiverar automatiskt de senaste rekommenderade Roslyn-analysatorerna för er installerade SDK-version.
🔗 Läs mer: Microsoft Learn: MSBuild Code Analysis Properties

## 2. Automatisk säkerhetsaudit av NuGet-beroenden
Sårbarheter i tredjepartsbibliotek (Supply Chain Attacks) är ett av de största hoten mot modern programvara. Från och med .NET 8/9 har .NET SDK inbyggt stöd för att granska NuGet-paket mot kända CVE-databaser under sjäva byggskedet.
```xml
<PropertyGroup>
  <NuGetAudit>true</NuGetAudit>
  <NuGetAuditMode>all</NuGetAuditMode>
  <NuGetAuditLevel>low</NuGetAuditLevel>
</PropertyGroup>
``` 

 * NuGetAuditMode = all: Standardinställningen kollar enbart direkt importerade paket. Genom att sätta all tvingar du MSBuild att även granska alla transitiva beroenden (paket som dina direktimporterade paket i sin tur drar in).
 * NuGetAuditLevel = low: Avbryter bygget (om TreatWarningsAsErrors är aktiverat) så fort en känd sårbarhet på nivå low eller högre upptäcks.
🔗 Läs mer: Microsoft Learn: Auditing package dependencies

## 3. Deterministiska byggen och maskering av källkodssökvägar
I en CI/CD-pipeline vill du uppnå två saker:
 * Identiska binärer: Samma källkod ska ge exakt samma byte-för-byte-output oavsett vilken agent som bygger den.
 * Säkerhet & Renhet: Absoluta sökvägar från byggagenten (t.ex. D:\a\1\s\src\...) ska inte läcka ut i publicerade binärer, PDB-filer eller stack traces.
```xml
<PropertyGroup>
  <Deterministic>true</Deterministic>
  <ContinuousIntegrationBuild Condition="'$(TF_BUILD)' == 'true' OR '$(GITHUB_ACTIONS)' == 'true'">true</ContinuousIntegrationBuild>
</PropertyGroup>
```

 * Deterministic: Tar bort maskinspecifik data som tidsstämplar och slumpmässiga GUID:er från kompileringen.
 * ContinuousIntegrationBuild: Mappar om alla absoluta filvägar på byggagenten till strukturerade, relativa sökvägar (t.ex. /_/src/Program.cs). Genom att villkorstyra detta mot miljövariabler som TF_BUILD (Azure DevOps) eller GITHUB_ACTIONS bevaras de vanliga lokala sökvägarna på utvecklarnas datorer så att lokal debugging fungerar smidigt.
🔗 Läs mer: Microsoft Learn: C# Compiler Options for Deterministic Builds

## 4. Renare projektstruktur med .NET Artifacts Output
Klassiska .NET-lösningar skräpar ner kodbasen genom att skapa bin/ och obj/ i varje enskilt underprojekt. För stora lösningar försvårar detta städning, git-hantering och CI-skript.
```xml
<PropertyGroup>
  <UseArtifactsOutput>true</UseArtifactsOutput>
</PropertyGroup>
```

Med UseArtifactsOutput aktiverat samlas all bygg-output i en gemensam struktur i lösningens rot:
./artifacts/bin/, ./artifacts/obj/ och ./artifacts/package/. Detta gör det extremt enkelt i t.ex. Azure Pipelines att peka ut var artefakter och testresultat finns utan att behöva söka igenom hela trädstrukturen.
🔗 Läs mer: Microsoft Learn: Artifacts output layout

## 5. SourceLink: Sömlös felsökning av interna NuGet-paket
Om företaget delar källkod internt via egna NuGet-paket drabbas utvecklare ofta av mardrömmen att inte kunna stega sig in i kod som ligger i ett internt bibliotek. SourceLink löser detta genom att bädda in kopplingar till er Git-repository direkt i symbolfilerna (.snupkg).
```xml
<PropertyGroup>
  <PublishRepositoryUrl>true</PublishRepositoryUrl>
  <EmbedUntrackedSources>true</EmbedUntrackedSources>
  <IncludeSymbols>true</IncludeSymbols>
  <SymbolPackageFormat>snupkg</SymbolPackageFormat>
</PropertyGroup>
``` 

Detta gör att Visual Studio och Rider automatiskt kan hämta exakt rätt version av källkodsfilen från Azure Repos eller GitHub när en utvecklare "stegade in" (F11) i en metod från ert interna NuGet-paket.
🔗 Läs mer: Microsoft Learn: SourceLink Overview
Den kompletta Enterprise-mallen
Skapa filen Directory.Build.props i källkodens rotmapp (bredvid er .sln-fil) och klistra in följande basmönster:

```xml
<Project>
  <PropertyGroup>
    <!-- Språk & Grundinställningar -->
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    
    <!-- Kodkvalitet & Analys -->
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
    <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
    <AnalysisLevel>latest-recommended</AnalysisLevel>

    <!-- Säkerhetsgranskning av NuGet-beroenden -->
    <NuGetAudit>true</NuGetAudit>
    <NuGetAuditMode>all</NuGetAuditMode>
    <NuGetAuditLevel>low</NuGetAuditLevel>

    <!-- Centraliserad bygg-output -->
    <UseArtifactsOutput>true</UseArtifactsOutput>

    <!-- Deterministiska byggen & Maskering av agent-sökvägar -->
    <Deterministic>true</Deterministic>
    <ContinuousIntegrationBuild Condition="'$(TF_BUILD)' == 'true' OR '$(GITHUB_ACTIONS)' == 'true'">true</ContinuousIntegrationBuild>

    <!-- SourceLink & Symboler -->
    <PublishRepositoryUrl>true</PublishRepositoryUrl>
    <EmbedUntrackedSources>true</EmbedUntrackedSources>
    <IncludeSymbols>true</IncludeSymbols>
    <SymbolPackageFormat>snupkg</SymbolPackageFormat>

    <!-- Företagsmetadata -->
    <Company>Ditt Företag AB</Company>
    <Copyright>Copyright © Ditt Företag AB $([System.DateTime]::Now.Year)</Copyright>
  </PropertyGroup>
</Project>
```

Att införa `Directory.Build.props` på detta sätt flyttar tyngdpunkten från reaktiv rensning av teknisk skuld till automatisk, proaktiv kvalitetssäkring. Det ger ett tryggare flöde från den lokala utvecklingsmaskinen hela vägen ut till produktionssatta container-avbildningar och serverlösa funktioner.
