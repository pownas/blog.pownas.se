---
layout: post
title: "🚀 Framtidssäkra din kodbas"
date: 2026-04-26 07:37:14 +0200
category: "c-sharp,.NET,programmering"
---

Från flera röriga .NET 5-8 C#-projekt till en modern .NET 10-arkitektur. 

Om du har jobbat med .NET ett tag vet du exakt hur ett versionslyft brukar se ut. När det är dags för Lifecycle Management (LCM) och applikationen ska uppgraderas från .NET 6 till nästa version, börjar den stora jakten. Du måste öppna varenda .csproj-fil för att uppdatera TargetFramework. Sedan måste du leta upp alla NuGet-paket och försöka synka versionerna mellan dina trettio olika projekt för att undvika konflikter. Lägg därtill en klassisk .sln-fil fylld av oändliga GUIDs som skapar merge-konflikter i Git så fort två utvecklare lägger till en fil samtidigt.
Men det behöver inte vara så här längre.
I takt med releasen av **.NET 10** har ekosystemet mognat enormt. Genom att kombinera fyra kraftfulla verktyg kan vi skapa en arkitektur där framtida uppgraderingar (till .NET 11, 12 och framåt) bokstavligen kan göras genom att ändra ett par rader kod på ett enda ställe.
Här är din guide till en modern, friktionsfri .NET-lösning.
## De fyra pelarna i en modern .NET-lösning
För att slippa redundans och bygga en arkitektur som är redo för smidig LCM, flyttar vi ut konfigurationen från de enskilda projekten och centraliserar den. Vi använder följande fyra komponenter:
### 1. global.json – Lås SDK-versionen för hela teamet
Har du någonsin hört "det fungerar på min maskin"? Ofta beror det på att utvecklare och CI/CD-pipelines kör olika versioner av .NET SDK:t. Genom att lägga en global.json i roten av ditt repo tvingar du alla miljöer att använda exakt samma kompilator och verktyg.
```json
{
  "sdk": {
    "version": "10.0.100",
    "rollForward": "latestFeature"
  }
}

```
### 2. Directory.Build.props – Centralisera dina byggregler
Istället för att varje projekt (Web.csproj, Api.csproj, Tests.csproj) ska deklarera att de använder .NET 10, C# 14 och Nullable reference types, lägger vi detta i en Directory.Build.props-fil i rotnivån. MSBuild kommer automatiskt att ärva ner dessa inställningar till *alla* underliggande projekt.
```xml
<Project>
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <LangVersion>latest</LangVersion>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  </PropertyGroup>
</Project>

```
**LCM-vinst:** Nästa gång du uppgraderar ramverket ändrar du net10.0 till net11.0 på exakt *ett* ställe.
### 3. Directory.Packages.props – Central Package Management (CPM)
Detta är slutet på "Dependency Hell". Med CPM bestämmer du versionerna för dina NuGet-paket centralt. Dina individuella .csproj-filer anger bara *vilka* paket de behöver, inte *vilken version*.
```xml
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
  </PropertyGroup>
  <ItemGroup>
    <PackageVersion Include="Azure.Storage.Blobs" Version="12.19.1" />
    <PackageVersion Include="Microsoft.EntityFrameworkCore" Version="10.0.0" />
  </ItemGroup>
</Project>

```
Dina projektfiler blir extremt rena: <PackageReference Include="Azure.Storage.Blobs" />.
**LCM-vinst:** Du kan nu enkelt koppla på verktyg som Dependabot eller Renovate som automatiskt skapar Pull Requests som uppdaterar en enda rad i hela repot när en ny version släpps.
### 4. .slnx – Lösningen på merge-konflikter
Vi säger äntligen hejdå till det gamla .sln-formatet. Det nya .slnx-formatet är rent, XML-baserat och helt fritt från magiska GUID-koder och konstig formatering.
```xml
<Solution>
  <Project Path="src\MyWebProject\MyWebProject.csproj" />
  <Project Path="tests\MyTests\MyTests.csproj" />
</Solution>

```
## Före och Efter: Hur det faktiskt ser ut
| Egenskap | Traditionell .NET 5-8 | Modern .NET 10 |
|---|---|---|
| **Versionshantering av paket** | Utspritt i varje .csproj | Samlat i Directory.Packages.props |
| **.NET Ramverksversion** | Hårdkodat i varje .csproj | Centraliserat i Directory.Build.props |
| **Solution-filen** | Svårläst .sln med GUIDs | Lättläst XML i .slnx |
| **SDK-version** | Odefinierad (tar senaste på datorn) | Låst via global.json |
| **LCM Uppgradering** | Dagar av sök-och-ersätt, testning | Minuter av centrala ändringar |
## Sammanfattning: Varför du bör göra detta idag
Att migrera en äldre kodbas till denna struktur tar oftast inte mer än några timmar, men avkastningen (ROI) är enorm. Genom att separera *konfiguration* från *kod* bygger du ett repo som är designat för att leva länge.
När Lifecycle Management slutar vara ett ångestladdat detektivarbete över dussintals filer och istället reduceras till att uppdatera ett fåtal centrala parametrar, frigör du tid till det som faktiskt spelar roll: att bygga värdeskapande funktioner.
Ta steget, skapa dina `Directory.*`-filer, rensa dina projektfiler och njut av en modern, framtidssäkrad utvecklarupplevelse!


## Källor
Här är de officiella dokumentationslänkarna från Microsoft Learn som styrker de olika koncepten vi gick igenom. De är uppdelade per område så att du eller ditt team enkelt kan läsa vidare om detaljerna!
### 1. Central Package Management (Directory.Packages.props)
Här beskrivs hur man slår på ManagePackageVersionsCentrally och frikopplar paketversionerna från de enskilda .csproj-filerna för att undvika beroendekonflikter ("Dependency Hell").
 * **Dokumentation:** Central Package Management (CPM)
### 2. Centralisering av byggregler (Directory.Build.props)
Den här guiden förklarar hur MSBuild automatiskt letar efter en Directory.Build.props högre upp i mappstrukturen för att applicera standardinställningar (som TargetFramework eller C#-version) på alla projekt i lösningen.
 * **Dokumentation:** Customize your build (Directory.Build.props)
### 3. Låsa SDK-versioner (global.json)
Den officiella dokumentationen för hur .NET CLI läser in global.json för att fastställa exakt vilken .NET SDK-version (och tillhörande rullningspolicy, rollForward) som ska användas för att bygga repot.
 * **Dokumentation:** global.json overview
### 4. Det nya Solution-formatet (.slnx)
Detta är ett nyare tillägg i .NET-ekosystemet. Även om det började som en Preview i Visual Studio 2022, integreras det nu allt djupare i .NET CLI och MSBuild.
 * **Dokumentation via CLI:** dotnet sln command *(Visar hur .NET CLI stödjer migrering och hantering av .slnx istället för .sln)*
 * **Visual Studio Blogg/Video:** Introducing support for the modern .slnx solution file format *(En genomgång av Mads Kristensen kring hur och varför formatet introducerades)*

Lycka till med dina framtida migreringar. 
