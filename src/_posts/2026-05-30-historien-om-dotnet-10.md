---
layout: post
title: "Historien om .NET 10 – Storskalig kontroll och modern arkitektur"
date: 2026-05-30 08:00
category: "c-sharp,.NET,programmering"
---

Detta är det sjunde inlägget i min bloggserie om "Historien om .NET". Idag har vi nått fram till den absoluta nutiden och kliver in i november 2025 då **.NET 10** och **C# 14** gjorde sin storslagna entré. Som en efterlängtad LTS-release (Long Term Support) cementerade den plattformens mognad och gav mjukvaruarkitekter verktygen som krävs för att tygla storskaliga mikrotjänststrukturer och monorepos med järnhand.

<!--more-->

## .NET 10 – Storskalig kontroll och modern arkitektur: En djupdykning i C# 14, Central Package Management (CPM) och Source Generators

Om .NET 9 handlade om att utforska AI och introducera smarta caching-mönster, så handlade **.NET 10** (LTS) om kontroll, förutsägbarhet och arkitektonisk struktur. När dussintals utvecklingsteam underhåller hundratals mikrotjänster parallellt blir det snabbt vilda västern med versionshantering och kodkvalitet. Microsoft hörde bönen från världens mjukvaruarkitekter och gjorde .NET 10 till den mest lätthanterade releasen för enterprise-miljöer någonsin.

Tillsammans med **C# 14** fick vi dessutom lösningen på en av de mest efterfrågade syntax-funktionerna i språksystemets historia, vilket gjorde slut på onödigt fält-slöseri en gång för alla.

Här är de absolut viktigaste arkitektur- och syntaxnyheterna du behöver ha koll på i .NET 10.

---

## 🚀 1. C# 14 – Slut på onödig boilerplate med `field`-nyckelordet

C# 14 levererade funktioner som fokuserade på extrem kod-ergonomi och att göra existerande mönster ännu mer intuitiva.

### Det efterlängtade `field`-nyckelordet i auto-properties
I alla år har vi älskat auto-properties (`public string Namn { get; set; }`). Men i samma sekund som du behövde lägga till enkel validering, loggning eller trigga ett event vid en `set`, tvingades du backa bandet, skapa ett privat fält (`private string _namn;`) och skriva om hela egenskapen manuellt.

C# 14 introducerade det automatiska nyckelordet **`field`**, vilket ger dig direktåtkomst till den underliggande, dolda backing-variabeln:

```csharp
public class Produkt
{
    // 'field' sparar rader och håller koden samlad på ett ställe!
    public string Namn
    {
        get;
        set => field = !string.IsNullOrWhiteSpace(value)
            ? value.Trim()
            : throw new ArgumentException("Namnet får inte vara tomt");
    }
}

```

### Förbättrade Primary Constructors

Primära konstruktorer som slog igenom stort i .NET 8 fick i C# 14 utökat stöd. Nu kan du applicera attribut direkt på de dolda fälten som genereras av den primära konstruktorn, och kompilatorn har blivit betydligt smartare på att varna om du råkar dubbelallokera minne genom att blanda traditionella fält med primära parametrar.

---

## 📦 2. Arkitektur i fokus: Central Package Management (CPM) på riktigt

I storskaliga system med många projektfiler (`.csproj`) blir det snabbt en mardröm att hålla NuGet-paket synkade mellan olika team. Om Team A kör version 7.0 av ett paket och Team B kör version 9.0 i samma systemarkitektur bjuder man in till subtila runtime-buggar.

I .NET 10 har **Central Package Management (CPM)** integrerats på djupet och blivit den rekommenderade standarden för enterprise-projekt.

Genom att använda en central **`Directory.Packages.props`**-fil i roten av ditt repo definierar du alla paketversioner på ett enda ställe. De individuella projektfilerna pekar sedan bara på paketet *utan* att ange versionsnummer:

```xml
<!-- I Directory.Packages.props på rotnivå -->
<Project>
  <PropertyGroup>
    <ManagePackageVersionsCentrally>true</ManagePackageVersionsCentrally>
  </PropertyGroup>
  <ItemGroup>
    <PackageVersion Include="System.Text.Json" Version="10.0.0"/>
  </ItemGroup>
</Project>

```

```xml
<!-- I din lokala Mikrotjänst.csproj – helt fritt från versionsnummer! -->
<Project Sdk="Microsoft.NET.Sdk.Web">
  <ItemGroup>
    <PackageReference Include="System.Text.Json"/>
  </ItemGroup>
</Project>

```

**Varför det är en arkitektonisk räddning:** Att uppgradera ett kritiskt paket över 20 olika applikationer tar nu tre sekunder istället för en hel arbetsdag, vilket drastiskt höjer säkerheten och minskar risken för versionskonflikter i dina CI/CD-pipelines.

---

## ⚡ 3. Source Generators 2.0 & Hypersnabb Native AOT

Prestandaförbättringarna i .NET 10 handlade inte bara om runtime, utan i högsta grad om **kompileringstid** och verktygskvalitet.

* **Blixtsnabba källgeneratorer:** Arkitekturen för *Source Generators* skrevs om för att köras inkrementellt och isolerat i kompilatorn. För stora system innebär detta att Visual Studio och `dotnet build` inte längre "laggar ihop" när kod genereras i realtid.
* **Native AOT för Enterprise:** Stödet för Ahead-Of-Time-kompilering utökades till att omfatta nästan hela ekosystemet kring ASP.NET Core, inklusive mer komplexa autentiseringsflöden och databasdrivna HttpClient-arkitekturer. Att köra .NET 10 i serverless-miljöer som AWS Lambda eller Azure Functions ger nu i princip noll "cold starts".
* **Förbättrad Trimming-analys:** Kompilatorn har blivit mycket bättre på att analysera och varna för kod som inte är kompatibel med länkning/trimning. Det gör det tryggare att skala ner sina Docker-images till absoluta minimum.

---

## ⚠️ 4. Att tänka på vid uppgradering (Kritiska Breaking Changes)

Eftersom .NET 10 är en LTS-version har Microsoft städat upp hårt i historiskt arv. Här är fallgroparna du måste hantera:

### 1. Slutgiltig utfasning av äldre Target Frameworks

.NET 10 stramar åt bygget av klassbibliotek. Stödet för att köra eller referera till mycket gamla .NET Core-versioner (2.1 och 3.1) utan explicit kompabilitetslager har tagits bort helt. Det är nu `net10.0` (eller `netstandard2.0` för legacy-delning) som gäller över hela linjen.

### 2. Striktare SBOM (Software Bill of Materials) vid paketering

När du packar dina interna NuGet-paket via `dotnet pack` i .NET 10, har säkerhetskraven skärpts. Systemet kräver nu mer transparent metadata kring beroenden för att automatiskt kunna validera leveranskedjan (Supply Chain Security). Projekt som saknar korrekt konfigurerade licens- eller källkodsdefinitioner kan ge upphov till nya byggvarningar eller fel i strikta bygg-pipelines.

### 3. Skärpt beteende i `System.Text.Json` för polymorfism

Om du förlitar dig på avancerad polymorf deserialisering (där JSON-objekt mappas till olika underklasser baserat på en diskriminator-sträng), har .NET 10 täppt till ett par logiska kryphål. Det här gör hanteringen säkrare mot typ-injektionsattacker, men kan kräva att du uppdaterar dina `JsonDerivedType`-attribut.

---

## 🎯 Sammanfattning: Resans mål

Med .NET 10 har Microsoft fullbordat den vision som påbörjades med den skakiga plattformsfusionen i .NET 5. Vi har gått från ett splittrat ekosystem till en hypermodern, Cloud Native-optimerad plattform. Genom att ge oss **Central Package Management**, det efterlängtade **`field`-nyckelordet i C# 14** och en kompromisslös **LTS-stabilitet**, bevisar .NET 10 att plattformen är det absolut bästa valet för att bygga robusta, långsiktiga och storskaliga mjukvaruarkitekturer.

Tack för att du har följt med på denna djupdykning genom .NET-plattformens moderna historia!

---

## Historien bakom .NET

*Detta inlägg sätter punkt för vår veckolånga artikelserie om .NET-plattformens evolution. Från det historiska beslutet att skrota .NET Framework, till dagens hypersnabba, AI-redo och arkitektoniskt fulländade ekosystem. Nu är det upp till oss utvecklare att fortsätta skriva historien – en rad ren, modern C#-kod i taget.*

Hela bloggserien för dig som vill läsa om hela resan:

* [Historien bakom .NET](https://blog.pownas.se/2026/05/24/historien-bakom-dotnet)
* [Historien om .NET 5 – Startskottet för den moderna eran](https://blog.pownas.se/2026/05/25/historien-om-dotnet-5)
* [Historien om .NET 6 – Den mogna LTS-versionen](https://blog.pownas.se/2026/05/26/historien-om-dotnet-6)
* [Historien om .NET 7 – Fokuserad på extrem prestanda och innovation](https://blog.pownas.se/2026/05/27/historien-om-dotnet-7)
* [Historien om .NET 8 – Den fulländade Cloud Native-plattformen](https://blog.pownas.se/2026/05/28/historien-om-dotnet-8)
* [Historien om .NET 9 – AI-åldern och nästa generations caching](https://blog.pownas.se/2026/05/29/historien-om-dotnet-9)

---

Källor:

* [What's new in .NET 10 (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/overview)
* [What's new in C# 14 (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-14)
* [Central Package Management overview (Microsoft Learn)](https://learn.microsoft.com/en-us/nuget/consume-packages/Central-Package-Management)
* [Breaking changes in .NET 10](https://learn.microsoft.com/en-us/dotnet/core/compatibility/10.0)
* [Breaking changes in ASP.NET Core 10 (Microsoft Learn)](https://learn.microsoft.com/en-us/aspnet/core/breaking-changes/10/overview?view=aspnetcore-10.0)
