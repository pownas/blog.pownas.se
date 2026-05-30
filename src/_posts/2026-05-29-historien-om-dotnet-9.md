---
layout: post
title: "Historien om .NET 9 – AI-åldern och nästa generations caching"
date: 2026-05-29 09:15 +0200
category: "c-sharp,.NET,programmering"
---

Detta är sjätte inlägget i min bloggserie om "Historien om .NET". Idag kliver vi in i november 2024 då **.NET 9** och **C# 13** släpptes lös. Som en funktionsrik STS-version (Standard-Term Support) tog Microsoft plattformen rakt in i AI-eran, samtidigt som de revolutionerade hur vi hanterar distribuerad data med det nya HybridCache-systemet. Fokus på smartare trådsäkerhet, molnoptimering och efterlängtad kodsyntax.

<!--more-->

## .NET 9 – AI-åldern och nästa generations caching: En djupdykning i C# 13, HybridCache och MapStaticAssets

Efter den gigantiska och stabila framgången med .NET 8 (LTS) använde Microsoft **.NET 9** till att finslipa molninfrastrukturen, bygga in nativt stöd för AI-arbetsbelastningar och lösa arkitektoniska problem som webbutvecklare dragits med i åratal.

Tillsammans med **C# 13** fick vi äntligen dedikerade och prestandaoptimerade typer för trådsynkronisering, samtidigt som klyftan mellan in-memory cache och distribuerad cache raderades ut helt med en enda rad kod.

Här är de absolut viktigaste nyheterna, arkitekturförbättringarna och fallgroparna du behöver känna till från .NET 9-releasen.

---

## 🚀 1. C# 13 – Smartare kodergonomi och dedikerad trådsäkerhet

C# 13 fokuserade på prestanda under huven och att göra existerande funktioner mer flexibla i vardagen.

### 1.1. Det nya Lock-objektet (`System.Threading.Lock`)
Historiskt sett har vi i C# alltid låst trådar genom att använda ett godtyckligt, tomt `object` tillsammans med `lock`-nyckelordet. C# 13 introducerade äntligen en dedikerad **`System.Threading.Lock`**-typ.

```csharp
public class KassaService
{
    // Det nya dedikerade låsobjektet
    private readonly Lock _orderLock = new();

    public void HanteraBetalning()
    {
        lock (_orderLock)
        {
            // Kritisk trådsäker kod här
        }
    }
}
```
**Varför det är bra:** Det nya låsobjektet använder mycket mer effektiva operativsystemsanrop under huven, vilket ger bättre prestanda, lägre overhead och kompilatorvarningar om du råkar använda objektet felaktigt.

### 1.2. `params` för alla samlingstyper
Innan C# 13 var nyckelordet `params` strikt begränsat till vanliga arrayer (`params int[] siffror`). Nu kan du använda `params` med i princip vilken samlingstyp som helst, inklusive `List<T>`, `IEnumerable<T>` och framförallt **`ReadOnlySpan<T>`**. Att använda det med Span innebär att kompilatorn kan optimera anropet så att noll minne allokeras på heapen vid metodanropet!

```csharp
// Nu helt giltigt med List eller ReadOnlySpan!
public void SkrivUtOrd(params ReadOnlySpan<string> ord)
{
    foreach (var o in ord)
    {
        Console.WriteLine(o);
    }
}
```

### 1.3. Indexering bakifrån i objektinitierare
C# 11 och 12 gav oss kraftfull indexering, men i objektinitierare kunde vi inte räkna bakifrån från slutet av en samling. C# 13 fixade detta med det välkända hatt-tecknet (`^`):

```csharp
var buffer = new MyBuffer
{
    Data = { [^1] = 0xFF } // Sätter sista elementet i samlingen direkt vid initiering!
};
```

---

## 📦 2. HybridCache & MapStaticAssets – Webbstacken växlar upp

ASP.NET Core 9 introducerade två enorma förändringar i hur vi optimerar prestanda och levererar data till användarna.

### 2.1. Hejdå Cache-Stampedes med `HybridCache`
Tidigare var vi tvungna och välja mellan det snabba `IMemoryCache` (L1 - lokalt minne) eller det skalbara `IDistributedCache` (L2 - t.ex. Redis). Att synka dessa och skydda databasen mot så kallade *cache stampedes* (när tusen trådar försöker hämta samma utgångna data samtidigt) krävde massor av kod.

Nya **`HybridCache`** löser allt detta i en enda rad kod:

```csharp
// Kombinerar L1 (lokalt) och L2 (Redis) automatiskt samt har inbyggt cache-stampede skydd!
var produkt = await _hybridCache.GetOrCreateAsync($"produkt-{id}",
    async token => await _db.GetProduktAsync(id, token));
```
Den har dessutom inbyggt stöd för **Tagging**, vilket gör att du kan rensa hundratals cache-instanser samtidigt genom att bara kalla på en specifik tagg (t.ex. "rensa alla produkter i kategorin kaffe").

### 2.2. Optimerade statiska filer med `MapStaticAssets`
Innan .NET 9 använde vi standardkomponenten `app.UseStaticFiles()`. Den har nu ersatts av **`app.MapStaticAssets()`**. Denna funktion komprimerar dina filer i `wwwroot` (med Gzip och Brotli) redan vid byggtillfället och lägger till unika fingeravtryck (hashes) i filnamnen. Det gör att webbläsare kan cacha dina CSS- och JS-filer för evigt utan risk för att användarna sitter på gammal kod efter en ny deploy.

---

## 🌐 3. AI-muskler och inbyggt OpenAPI-stöd

### 3.1. Nativ AI med `TensorPrimitives`
I takt med att AI-verktyg och lokala modeller tagit över, introducerade .NET 9 kraftfulla bibliotek i `System.Numerics.Tensors`. Genom klassen `TensorPrimitives` kan du nu köra avancerade matematiska vektor-operationer (vilket är grundbulten i AI-modeller och sökalgoritmer) med direkt hårdvaruacceleration via SIMD-instruktioner.

### 3.2. Smidigt LINQ-godis: `CountBy` och `AggregateBy`
LINQ fick några efterlängtade tillskott för att aggregera data utan onödiga minnesallokeringar. Det mest använda är `CountBy`, där du slipper köra en rörig `.GroupBy().Select()` för att räkna förekomster:

```csharp
var danser = new List<string> { "Bugg", "Fox", "Bugg", "WCS", "Fox", "Bugg" };

// Räknar blixtsnabbt upp förekomsten av varje element
foreach (var (dans, antal) in danser.CountBy(d => d))
{
    Console.WriteLine($"{dans}: {antal} gånger");
}
// Skriver ut: Bugg: 3, Fox: 2, WCS: 1
```

### 3.3. Inbyggt OpenAPI (Hejdå Swashbuckle)
Microsoft tog beslutet att ta bort standardstödet för det klassiska NuGet-paketet *Swashbuckle* från sina projektmallar. Istället har .NET 9 fått ett helt eget, inbyggt stöd för OpenAPI-metadata vilket gör genereringen av JSON-specifikationer mycket snabbare och helt integrerad med Minimal APIs.

---

## ⚠️ 4. Att tänka på vid uppgradering (Kritiska Breaking Changes)

När du lyfter dina projekt till .NET 9 bör du kika extra noga på dessa punkter:

### 4.1. `BinaryFormatter` är helt borttagen (Kastar alltid exception)
Den långa resan som påbörjades i .NET 5 är nu slutgiltigt i mål. `BinaryFormatter` har raderats helt från runtime-kärnan av säkerhetsskäl. Om du har äldre bibliotek som absolut måste köra binär serialisering kommer koden att krascha direkt. Du *måste* migrera till moderna alternativ som `System.Text.Json` eller `Protobuf`.

### 4.2. Strängare DI-validering i utvecklingsmiljö
När du kör din applikation i `Development`-läge kommer `HostBuilder` nu automatiskt att sätta `ValidateOnBuild` och `ValidateScopes` till `true`. Det betyder och innebär att appen kommer att vägra starta om du har felaktigt registrerade Dependency Injection-tjänster (t.ex. om du försöker injecta en *Scoped* tjänst in i en *Singleton*).

### 4.3. Ändrat beteende i `String.Trim`
Metodöverlagringen `String.Trim(params char[])` ändrades till `String.Trim(params ReadOnlySpan<char>)`. För de allra flesta fungerar koden precis som vanligt, och du märker ingenting, men det är en binär breaking change som kan påverka speglingen (reflection) eller äldre länkade externa bibliotek.

---

## 🎯 Sammanfattning

.NET 9 visade att plattformen är ready för framtidens utmaningar. Genom att lösa klassiska arkitekturproblem med **`HybridCache`** och **`MapStaticAssets`**, samt ge utvecklare inbyggda verktyg för **AI-prestanda** och renare kod via **C# 13**, cementerade Microsoft .NET-plattformens position som en av marknadens absolut snabbaste utvecklingsmiljöer.

---

## Historien bakom .NET

*I nästa – och tills vidare sista – del av vår resa kliver vi in i november 2025. Det är dags att snacka om den rykande färska .NET 10 (LTS). Vi djupdyker i hur C# 14, förbättrad källgenerering och introduktionen av Central Package Management (CPM) sätter helt nya standarder för storskalig systemarkitektur och hantering av mikrotjänster...*

Tidigare inlägg i bloggserien:

* [Historien bakom .NET](https://blog.pownas.se/2026/05/24/historien-bakom-dotnet)
* [Historien om .NET 5 – Startskottet för den moderna eran](https://blog.pownas.se/2026/05/25/historien-om-dotnet-5)
* [Historien om .NET 6 – Den mogna LTS-versionen](https://blog.pownas.se/2026/05/26/historien-om-dotnet-6)
* [Historien om .NET 7 – Fokuserad på extrem prestanda och innovation](https://blog.pownas.se/2026/05/27/historien-om-dotnet-7)
* [Historien om .NET 8 – Den fulländade Cloud Native-plattformen](https://blog.pownas.se/2026/05/28/historien-om-dotnet-8)

---

Källor:

* [What's new in .NET 9 (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-9/overview)
* [What's new in C# 13 (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-13)
* [Breaking changes in .NET 9](https://learn.microsoft.com/en-us/dotnet/core/compatibility/9.0)
* [Breaking changes in ASP.NET Core 9 (Microsoft Learn)](https://learn.microsoft.com/en-us/aspnet/core/breaking-changes/9/overview)
* [HybridCache is now GA (.NET Blog)](https://devblogs.microsoft.com/dotnet/hybrid-cache-is-now-ga/)
