---
layout: post
title: 'Modernisera din byggstruktur när du uppgraderar till .NET 10'
date: 2026-06-26 22:15 +0200
category: "c#,sql,programmering"
---

Att kliva från en .NET 8-applikation – speciellt en som bär på legacy-bagage – direkt till .NET 10 är ett fantastiskt tillfälle att inte bara lyfta ramverket, utan att faktiskt städa bort teknisk skuld. För att göra kodbasen mer lätthanterlig, enhetlig och framtidssäker bör fokus ligga på att centralisera inställningar, utnyttja kompilatorn hårdare och implementera moderna arkitekturmönster.

I den här guiden går vi igenom hur du sätter upp en modern, strömlinjeformad projektstruktur från grunden med hjälp av det nya .slnx-formatet, global.json, Directory.Build.props, och Central Package Management (CPM).

<!--more-->
---

## Den optimala filstrukturen på disken
För att dra nytta av moderna MSBuild-funktioner är det viktigt att filerna ligger på rätt plats. Genom att placera konfigurationsfilerna i roten av ditt repository slipper du duplicera inställningar i varje enskilt .csproj-projekt, och med det nya .slnx-formatet blir själva roten mycket renare.
Så här bör roten av ditt moderna .NET 10-projekt se ut:

```text
📁 MittProjekt/
 ├── 📄 MittProjekt.slnx                # Den moderna, rena Solution-filen
 ├── 📄 .SolutionItems.csproj           # Samlar dokumentation och inställningsfiler
 ├── 📄 global.json                     # Låser SDK-versionen
 ├── 📄 Directory.Build.props           # Globala kompilatorinställningar
 ├── 📄 Directory.Packages.props        # Central Package Management (CPM)
 ├── 📄 .editorconfig                   # Kodstandard för hela projektet
 ├── 📁 artifacts/                      # (Autogenererad) All bygg-output hamnar här
 ├── 📁 docs/                           # Projektets dokumentation (markdown etc.)
 ├── 📁 src/                            # Källkod
 │    ├── 📁 MittProjekt.Api/
 │    │    └── 📄 MittProjekt.Api.csproj
 │    └── 📁 MittProjekt.Core/
 │         └── 📄 MittProjekt.Core.csproj
 └── 📁 tests/                          # Enhetstester
      └── 📁 MittProjekt.Tests/
           └── 📄 MittProjekt.Tests.csproj
```

## 1. Global.json – Lås SDK-versionen
Det första steget mot ett förutsägbart byggflöde är att garantera att alla utvecklare och byggservrar använder samma version av .NET SDK. Detta hanteras bäst med en global.json i repots rot.

**global.json**
```json
{
  "sdk": {
    "version": "10.0.100",
    "rollForward": "latestFeature"
  }
}
```

*Tips: rollForward gör att systemet kan använda nyare patch-versioner av SDK:t om exakt 10.0.100 inte finns installerad, vilket minskar friktionen för utvecklare.*

## 2. Det nya moderna .slnx-formatet
Ett av de absolut mest välkomna tillskotten i Visual Studio 2026 är det fulla stödet för .slnx. Det gamla .sln-formatet var ökänt för att bestå av hundratals obegripliga GUID:s som ständigt orsakade plågsamma merge-konflikter i Git. Det nya formatet är rent, läsbart XML.
**Så här uppgraderar du:** Markera din befintliga solution i Visual Studio 2026, välj "Save as..." och spara den som en .slnx-fil. Helt plötsligt krymper din lösning till några få rader.

### Smart hantering av root-filer med ett NoBuild-projekt
Ett klassiskt problem i .NET är att hålla koll på filer som .editorconfig, pipeline-YAML eller markdown-filer i en /docs/- eller /wiki/-katalog direkt inne i Visual Studio. Istället för att krångla med gamla "Solution Folders" skapar du ett osynligt projekt, t.ex. .SolutionItems.csproj.

**.SolutionItems.csproj**
Genom att sätta projektet till NoBuild blir det aldrig en del av kompileringen, utan fungerar bara som en snygg samlingsplats i IDE:n.
```xml
<Project Sdk="Microsoft.Build.NoTargets/3.7.0">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <IsPackable>false</IsPackable>
    <GenerateDependencyFile>false</GenerateDependencyFile>
  </PropertyGroup>

  <ItemGroup>
    <None Include="*\**" Exclude="**\bin\**;**\obj\**;**\.git\**;**\.vs\**" />
    <None Include="docs\**\*.md" />
    <None Include="wiki\**\*.md" />
    <None Include="..\.editorconfig" />
    <None Include="..\Directory.Build.props" />
    <None Include="..\Directory.Packages.props" />
  </ItemGroup>
</Project>
```

**Integrera det i .slnx:**
I din nya .slnx-fil lägger du till referensen till detta projekt, men talar explicit om att det inte ska byggas genom att sätta Build="false" (och eventuellt Deploy="false").

**MittProjekt.slnx**
```xml
<Solution>
  <Project Path=".SolutionItems.csproj" Build="false" />
  
  <Project Path="src\MittProjekt.Api\MittProjekt.Api.csproj" />
  <Project Path="src\MittProjekt.Core\MittProjekt.Core.csproj" />
  <Project Path="tests\MittProjekt.Tests\MittProjekt.Tests.csproj" />
</Solution>
```

## 3. Centraliserad projektkonfiguration (Directory.Build.props)
Med Directory.Build.props samlar du alla MSBuild-inställningar som ska gälla för hela solutionen.
**Directory.Build.props**
```xml
<Project>
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    
    <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>

    <UseArtifactsOutput>true</UseArtifactsOutput>
  </PropertyGroup>
</Project>
```

### De smarta flaggorna förklarade:
 * **<Nullable>enable</Nullable>:** Om legacy-koden inte redan använder detta, är det dags nu. Det utrotar i princip NullReferenceException från din kodbas.
 * **<ImplicitUsings>enable</ImplicitUsings>:** Låter kompilatorn injicera vanliga namespaces automatiskt, vilket rensar upp toppen av alla dina filer.
 * **<EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>:** Tvingar fram kodstandarden från din .editorconfig redan vid kompilering.
 * **<UseArtifactsOutput>true</UseArtifactsOutput>:** En fantastisk funktion som slutar skräpa ner varje projektmapp med bin och obj. Istället genereras en gemensam artifacts-mapp i rotkatalogen. Det snabbar upp byggtider, undviker fil-låsningar och gör det otroligt enkelt att rensa solutionen.

## 4. Central Package Management (CPM)
Att ha olika NuGet-versioner i olika projekt inom samma solution är en klassisk källa till buggar. Med CPM definierar du versionen av ett paket på *ett* ställe.

**Directory.Packages.props**
```xml
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
  </PropertyGroup>
  
  <ItemGroup>
    <PackageVersion Include="Microsoft.EntityFrameworkCore.SqlServer" Version="10.0.0" />
    <PackageVersion Include="Swashbuckle.AspNetCore" Version="6.5.0" />
  </ItemGroup>
</Project>
```

I dina individuella .csproj-filer anger du numera bara paketet *utan* version:

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" />
</ItemGroup>
```

## 5. Utnyttja moderna C#-funktioner (C# 13 & 14)
När du går till .NET 10 får du tillgång till finesser som drastiskt minskar "boilerplate"-kod:
 * **Primary Constructors:** Gör Dependency Injection extremt mycket renare: public class MyService(ILogger<MyService> logger) { ... }.
 * **Collection Expressions:** Förenklar initiering av listor avsevärt. Istället för new List<int> { 1, 2, 3 } skriver du bara [1, 2, 3].
 * **Fält-nyckelordet (field i C# 14):** Om du har properties med anpassad logik slipper du deklarera dolda privata variabler (backing fields). Nyckelordet field gör detta automatiskt.

## 6. Arkitektur och Beroenden
 * **Från N-tier till Feature-fokus:** Att röra sig bort från traditionella, djupt nästlade lager-arkitekturer mot en mer feature-orienterad struktur, som **Vertical Slice Architecture**, är ofta en befrielse för äldre kodbaser. Genom att kapsla in allt som rör en specifik feature (API-endpoint, domänlogik, databasanrop) i en isolerad "slice" minskar du risken att bryta funktionalitet oavsiktligt.

## 7. DevOps och Byggflöden
Att modernisera koden är bara halva jobbet; hur den byggs och rullas ut spelar lika stor roll.
 * **Inbyggt Container-stöd:** Med dotnet publish -t:PublishContainer paketeras din applikation i en OCI-kompatibel avbildning direkt från SDK:t. Du kan ofta kasta bort komplexa Dockerfiles och låta .NET hantera optimering och att säkra imagen som *non-root*.
 * **CI/CD-optimering:** Genom att utnyttja UseArtifactsOutput och införa låsfiler (packages.lock.json) tillsammans med CPM, optimerar du cachningen av NuGet-paket och kan ofta halvera byggtiderna i dina pipelines.

### Referenser och vidare läsning
 * **Exempel på NoBuild Solution Items:** Se en implementation av .SolutionItems.csproj i ArvidsonFoto-MVC-NET-web
 * **Exempel på modern .slnx:** Se hur .slnx hanterar NoBuild-projekt
 * **Directory.Build.props och struktur:** Microsoft Learn: Customize your build
 * **Artifacts Output (UseArtifactsOutput):** Microsoft Learn: Artifacts output layout
 * **Central Package Management (CPM):** Microsoft Learn: Central Package Management
 * **Inbyggt Container-stöd:** Microsoft Learn: Containerize a .NET app with dotnet publish

