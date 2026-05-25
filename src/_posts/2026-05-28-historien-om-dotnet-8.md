---
layout: post
title: "Historien om .NET 8 – Den fulländade Cloud Native-plattformen"
date: 2026-05-28 00:20 +0200
category: "c-sharp,.NET,programmering"
---

Detta är femte inlägget i min bloggserie om "Historien om .NET". Idag spolar vi fram till november 2023 då **.NET 8** och **C# 12** dundrade in på scenen. Som en stabil LTS-release (Long Term Support) knöt den ihop säcken för Microsofts vision om en modern, plattformsoberoende miljö och introducerade funktioner som gjorde plattformen redo för framtidens molnarkitekturer och AI. Fokus på "Cloud Native", fullfjädrad Blazor och efterlängtad kodsyntax.

<!--more-->

## .NET 8 – Den fulländade Cloud Native-plattformen: En djupdykning i C# 12, Blazor-revolutionen och Primary Constructors

Medan .NET 7 fungerade som en snabbrörlig testbädd för ny teknik (STS), var **.NET 8** (LTS) versionen där allt gjordes produktionsredo i absolut högsta skala. Microsofts huvudsakliga fokus med denna release var **"Cloud Native"** – att göra .NET-applikationer så små, snabba och resurssnåla som möjligt för att passa perfekt i moderna Docker-containers och mikrotjänst-kluster.

Tillsammans med **C# 12** fick vi dessutom efterlängtade ergonomiska förbättringar i språket som dramatiskt drog ner antalet rader kod vi behöver skriva i vår vardag.

Här är de absolut tyngsta nyheterna och fallgroparna du behöver ha koll på från .NET 8-releasen.

---

## 🚀 1. C# 12 – Expressiv kod och snyggare syntax

C# 12 fokuserade på att göra språket mer enhetligt och tog bort ännu mer boilerplate som vi utvecklare har stört oss på i åratal.

### Primary Constructors (Primära konstruktorer för alla!)
I C# 9 introducerades primära konstruktorer exklusivt för *records*. C# 12 tog den succén vidare till **vanliga klasser och structar**. Nu slipper du deklarera privata fält och tilldela dem manuellt i konstruktorn vid Dependency Injection:

```csharp
// Fälten injectas och är tillgängliga i hela klassen direkt!
public class OrderService(IOrderRepository repository, ILogger<OrderService> logger)
{
    public async Task ProcessOrder(int orderId)
    {
        logger.LogInformation($"Processar order {orderId}");
        await repository.MarkAsProcessed(orderId);
    }
}

```

### Collection Expressions (Enhetliga samlingar)

Innan C# 12 skapades arrayer, listor och spans med helt olika syntaxer (`new int[]`, `new List<int>`). Nu finns det **ett** enhetligt sätt att initiera samlingar med raka måsvingar (`[]`), och vi fick dessutom den smidiga *spread-operatorn* (`..`) för att slå ihop listor.

```csharp
int[] row1 = [1, 2, 3];
List<string> ord = ["kaffe", "kod", "dans"];

// Använd spread-operatorn (..) för att expandera samlingar
int[] combined = [..row1, 4, 5, 6]; // Innehåller: 1, 2, 3, 4, 5, 6

```

### Alias any type

Nu kan du använda `using`-nyckelordet för att skapa alias för i princip vilken typ som helst, inklusive tupler och arrayer. Det är perfekt för att snygga till komplexa datatyper utan att behöva skriva en hel klass:

```csharp
using Point2D = (int X, int Y); // Skapa ett alias för en tupel

```

---

## 📦 2. Fullfjädrad Native AOT & Molnoptimering

I .NET 7 var Ahead-of-Time (AOT)-kompilering mest ett experiment för konsolappar. I .NET 8 blev det redo på riktigt.

Nu fick **ASP.NET Core fullt stöd för Native AOT**. Det betyder att du kan kompilera ditt webb-API direkt till en plattformsspecifik maskinkod. Docker-containers för .NET-appar gick från att väga hundratals megabyte till att bli **under 10 MB**, med starttider på några millisekunder och dramatiskt sänkt minnesanvändning.

### Frozen Collections

För högpresterande scenarier introducerades `FrozenDictionary<TKey, TValue>` och `FrozenSet<T>`. De är optimerade för situationer där en samling skapas en gång vid applikationsstart och sedan bara läses (read-only). Att läsa från en frusen samling är extremt mycket snabbare än en vanlig `Dictionary`.

---

## 🌐 3. Blazor och Dependency Injection får superkrafter

Webb- och arkitekturstacken fick några av sina största uppdateringar på många år.

### Det nya enhetliga Blazor (Full-stack Blazor)

Innan .NET 8 tvingades du välja mellan *Blazor Server* eller *Blazor WebAssembly*. .NET 8 raderade ut den gränsen helt. Nu kan du blanda renderingstekniker i samma applikation:

* **Static Server-Side Rendering (SSR):** Renderar ren HTML från servern (snabb starttid, perfekt för publika sidor).
* **Interactive Auto:** Sidan startar blixtsnabbt via Blazor Server, och i bakgrunden laddas WebAssembly-filer ner så att nästa besök blir helt klientbaserat.

### Inbyggt stöd för Keyed Services

Äntligen! Efter år av att ha förlitat sig på tredjepartsbibliotek som Autofac fick .NET:s inbyggda Dependency Injection stöd för *Keyed Services*. Det betyder att du kan registrera flera olika implementationer av samma interface och skilja dem åt med ett namn (en nyckel):

```csharp
// Registrering i Program.cs
builder.Services.AddKeyedSingleton<ICacheService, RedisCache>("CloudCache");
builder.Services.AddKeyedSingleton<ICacheService, MemoryCache>("LocalCache");

// Användning i en controller/minimal API via [FromKeyedServices]
app.MapGet("/data", ([FromKeyedServices("CloudCache")] ICacheService cache) => {
    // Använder Redis-cachen här
});

```

---

## ⚠️ 4. Att tänka på vid uppgradering (Kritiska Breaking Changes)

Att gå till en LTS-version brukar vara smidigt, men .NET 8 har några vassa kanter under huven:

### 1. `System.Text.Json` blir mer strikt med dolda fält

För att förbättra prestanda och motverka säkerhetshål vid AOT-kompilering har JSON-serialiseraren blivit hårdare. Till exempel serialiseras inte längre `init`-only properties på samma sätt om de saknar publika konstruktorer i mer komplexa hierarkier, och hantering av cykliska referenser kräver mer explicit konfigurering.

### 2. Ändrat standardbeteende för HTTPS-portar i Docker

När du kör .NET 8 i officiella Ubuntu/Debian-baserade Docker-containers har standardporten ändrats från port `80` till port `8080`. Microsoft gjorde detta för att appen ska kunna köras som en "non-root"-användare i containern (vilket är säkrare). Om du har hårdkodade portmappningar i dina Kubernetes- eller Docker Compose-filer kommer trafiken att brytas om du inte uppdaterar till `8080`.

### 3. DataAnnotations validerar djupare

Om du använder attribut som `[Required]` eller `[Length]` på komplexa objekthierarkier (nästlade objekt), har valideringen i ASP.NET Core skärpts. .NET 8 validerar nu djupare i objekten än tidigare, vilket kan göra att requests som tidigare "slank igenom" nu plötsligt returnerar `400 Bad Request`.

---

## 🎯 Sammanfattning

.NET 8 var versionen där .NET slutgiltigt klev in i finrummet för moderna molnarkitekturer. Genom att kombinera **C# 12:s slimmade syntax** med **Native AOT** för webben, **Keyed Services** och ett helt **ombyggt Blazor**, gav Microsoft oss verktygen som krävs för att bygga blixtsnabba, skalbara system med minimal kodmängd.

---

## Historien bakom .NET

*I nästa del av vår resa kliver vi in i november 2024. Det är dags att snacka om .NET 9 – en release som tog plattformen rakt in i AI-åldern med TensorPrimitives och revolutionerade distribuerad cache med det nya, efterlängtade HybridCache-systemet...*

Tidier inlägg i bloggserien:

* [Historien bakom .NET](https://blog.pownas.se/2026/05/24/historien-bakom-dotnet)
* [Historien om .NET 5 – Startskottet för den moderna eran](https://blog.pownas.se/2026/05/25/historien-om-dotnet-5)
* [Historien om .NET 6 – Den mogna LTS-versionen](https://blog.pownas.se/2026/05/26/historien-om-dotnet-6)
* [Historien om .NET 7 – Fokuserad på extrem prestanda och innovation](https://blog.pownas.se/2026/05/27/historien-om-dotnet-7)

---

Källor:

* [What's new in .NET 8 (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8)
* [What's new in C# 12 (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-12)
* [Breaking changes in .NET 8](https://learn.microsoft.com/en-us/dotnet/core/compatibility/8.0)
* [Breaking changes in ASP.NET Core 8 (Microsoft Learn)](https://learn.microsoft.com/en-us/aspnet/core/breaking-changes/8/overview)
* [Performance Improvements in .NET 8 (Stephen Toub)](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/)
