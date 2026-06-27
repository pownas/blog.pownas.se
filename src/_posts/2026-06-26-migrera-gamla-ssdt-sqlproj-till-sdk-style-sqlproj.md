---
layout: post
title: 'Migrera dina gamla SSDT-databasprojekt till SDK-style SQL-projekt'
date: 2026-06-26 22:15 +0200
category: "c#,sql,programmering"
---

För oss som bygger moderna .NET-lösningar – kanske med en Vertical Slice-arkitektur och med siktet inställt på .NET 10 – är smidiga CI/CD-flöden helt avgörande. Ett historiskt smärtområde i våra Azure DevOps-pipelines har varit databasprojekten. Klassiska SQL Server Data Tools (SSDT) `.sqlproj`-filer är ökända för att skapa enorma merge-konflikter eftersom varje enskild fil måste registreras i en gigantisk XML-struktur [1].

Lösningen stavas **SDK-style SQL-projekt**. Genom att använda Microsofts SDK `Microsoft.Build.Sql` får vi minimala projektfiler, wildcard-inkludering av skript och fullt plattformsoberoende kompilering via kommandoraden.

Här är en komplett guide till hur du migrerar dina gamla databasprojekt till det moderna formatet, hur filstrukturen bör se ut och en viktig varning gällande stödet i Visual Studio 2026.

<!--more-->
---

## 1. Den nya projektfilen (.sqlproj)

I ett klassiskt SSDT-projekt listar XML-filen explicit varje tabell, vy och lagrad procedur med `<Build Include="..." />`. I det nya SDK-formatet elimineras detta helt. Byggmotorn hittar automatiskt alla `.sql`-filer i mappen, precis som moderna C#-projekt hanterar sina `.cs`-filer [2].

Så här ser en komplett, modern `.sqlproj`-fil ut när vi använder den stabila versionen **2.2.0**:

```xml
<Project Sdk="Microsoft.Build.Sql/2.2.0">
  <PropertyGroup>
    <Name>ApplikationsNamn.Database</Name>
    
    <DSP>Microsoft.Data.Tools.Schema.Sql.Sql160DatabaseSchemaProvider</DSP>
    
    <TargetFramework>netstandard2.0</TargetFramework>
    
    <ModelCollation>1035, CI</ModelCollation>
  </PropertyGroup>

  <ItemGroup>
    <PreDeploy Include="Scripts\Script.PreDeployment.sql" />
    <PostDeploy Include="Scripts\Script.PostDeployment.sql" />
  </ItemGroup>
</Project>

```

### Vad hände med TargetFramework v4.8?

Tidigare projekt angav ofta `<TargetFrameworkVersion>v4.8</TargetFrameworkVersion>`. I SDK-stilen använder vi `netstandard2.0` (eller nyare `net8.0`/`net10.0`) för själva *byggprocessen* av `.dacpac`-filen. Om du har SQL CLR-objekt skriven i C# som *måste* köras i .NET Framework 4.8 inuti SQL Server, rekommenderas det att bryta ut dessa till ett separat `.csproj`-klassbibliotek som din `.sqlproj` sedan refererar till [3].

---

## 2. Projektets filstruktur på disken

Eftersom du slipper underhålla filreferenser i projektfilen kan du fokusera på att hålla en ren och logisk struktur på disken. När du lägger till en ny fil i filsystemet inkluderas den omedelbart i bygget.

```text
ApplikationsNamn.Database/
│
├── ApplikationsNamn.Database.sqlproj   <-- Den slimmade SDK-filen
│
├── Security/                             <-- Scheman och roller
│   └── AppSchema.sql
│
├── Tables/                               <-- Alla DDL-skript för tabeller
│   ├── Kunder.sql
│   └── Ordrar.sql
│
├── Views/                                <-- Vyer
│   └── V_AktivaOrdrar.sql
│
├── Programmability/                      <-- SP:s och funktioner
│   └── Sp_SkapaOrder.sql
│
└── Scripts/                              <-- Manuellt definierade pre/post-skript
    ├── Script.PreDeployment.sql
    └── Script.PostDeployment.sql

```

---

## 3. Viktig Varning: Utmaningar i Visual Studio 2026

Även om Microsoft pushat hårt för SDK-style projekt de senaste åren, finns det en viktig arkitektonisk aspekt att vara medveten om: **DacFx (Data-Tier Application Framework) som detta bygger på är idag primärt optimerat för Command Line Interface (CLI) och lättviktsredigerare** [4].

Att hantera dessa projekt i den tunga **Visual Studio 2026 IDE:n** kan tyvärr fortfarande upplevas som problematiskt.

### Varför är det ett problem i VS 2026?

1. **Laddning och UI-integration:** Visual Studios inbyggda SQL Server Object Explorer (SSOX) och schema-jämförelseverktyg (Schema Compare) är historiskt hårdkodade mot det äldre projektformatet. Det kan leda till att filer inte alltid visas korrekt i Solution Explorer om de inte lagts till via IDE:ts egna dialogrutor, trots att wildcard-inkluderingen bygger dem korrekt.
2. **Prestanda:** IDE:n kan ibland låsa sig vid uppdatering av referenser, eftersom den försöker bygga en intern modell av databasen i realtid, en process som inte alltid synkar perfekt med `Microsoft.Build.Sql`-motorn i bakgrunden.

### Best Practice för framtiden

För att få bästa möjliga utvecklarupplevelse i våra framtida system rekommenderas följande arbetsflöde:

* **CI/CD och Byggen:** Använd uteslutande .NET CLI (`dotnet build`) för att kompilera projektet. Det är blixtsnabbt, plattformsoberoende och fungerar felfritt i Azure DevOps eller GitHub Actions [5].
* **Utvecklingsmiljö:** Överväg att skriva och redigera SQL-skripten i **VS Code** (med tillägget *SQL Database Projects*) eller **Azure Data Studio**. Båda dessa miljöer är byggda från grunden för att prata direkt med DacFx-motorn och hanterar SDK-style projekt mycket mer nativt än den traditionella Visual Studio-miljön [6].
* **Om du måste använda VS 2026:** Acceptera att vissa visuella verktyg för SQL-hantering kan bete sig oförutsägbart, och förlita dig på kommandoraden (`dotnet build` / `dotnet publish`) när du vill säkerställa att din `.dacpac` byggs korrekt.

---

### Referenser

1. [Microsoft Learn: MSBuild and SDK-style projects in SQL Server Data Tools](https://learn.microsoft.com/en-us/sql/ssdt/sdk-style-projects) - *Förklarar grundkonceptet och fördelarna med färre merge-konflikter.*
2. [NuGet Gallery: Microsoft.Build.Sql](https://www.nuget.org/packages/Microsoft.Build.Sql/2.2.0) - *Dokumentation och versionshistorik för version 2.2.0.*
3. [DacFx GitHub Repository - SDK Migration Guide](https://github.com/microsoft/DacFx) - *Detaljerade guider från produktteamet om hur TFM och referenser hanteras i moderna projekt.*
4. [Microsoft Learn: SqlPackage in CI/CD pipelines](https://learn.microsoft.com/en-us/sql/tools/sqlpackage/sqlpackage-pipelines) - *Dokumenterar hur DacFx är optimerat för CLI och automatiserade byggen.*
5. [Microsoft Learn: Build and Publish a database with dotnet build](https://learn.microsoft.com/en-us/sql/tools/sql-database-projects/concepts/build-publish-deploy) - *Bekräftar kommandoradens överlägsenhet för plattformsoberoende byggen.*
6. [SQL Database Projects extension for VS Code / Azure Data Studio](https://learn.microsoft.com/en-us/sql/tools/sql-database-projects/concepts/workspace) - *Microsofts egna rekommendationer för moderna, lättviktiga SQL-utvecklingsmiljöer som fullt ut stödjer SDK-stilen.*
