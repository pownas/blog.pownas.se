---
layout: post
title: "Historien om .NET 7 – Fokuserad på extrem prestanda och innovation"
date: 2026-05-27 11:23 +0200
category: "c-sharp,.NET,programmering"
---

Detta är fjärde inlägget i min bloggserie om "Historien om .NET". Idag tar vi steget in i november 2022 då .NET 7 och C# 11 släpptes. Även om det var en STS-version (Short Term Support), blev det en av de mest innovationsrika releaserna där Microsoft banade väg för molnbaserad mikroprestanda med Native AOT och inbyggda Enterprise-verktyg.

<!--more-->

## .NET 7 – Snabbare, smartare och redo för molnet: En djupdykning i C# 11, Native AOT och Rate Limiting

Om .NET 6 handlade om stabilitet och att landa den gemensamma plattformen, så handlade **.NET 7** om rå, kompromisslös innovation. Eftersom det var en så kallad STS-version (stddes i 18 månader) använde Microsoft den till att rulla ut banbrytande tekniker som förändrade hur vi optimerar våra applikationer i molnet.

Tillsammans med **C# 11** fick vi äntligen lösningar på gamla syntax-problem som vi brottats med i åratal, samtidigt som webbstacken berikades med funktioner som vi tidigare tvingats använda externa NuGet-paket för.

Här går vi igenom de absolut största höjdpunkterna och vad du behöver se upp med vid en uppgradering.

---

## 🚀 1. C# 11 – Ergonomi och smartare kodslimming

C# 11 fortsatte på inslagna spår: att göra språket mer modernt, säkert och mindre tidskrävande att skriva.

### 1.1. Raw String Literals (Råa strängliteraler)
Detta är utan tvekan en av de mest älskade funktionerna i C# 11. Om du någonsin har försökt klistra in ett JSON- eller XML-objekt i en C#-sträng vet du hur frustrerande det är att behöva "escapa" alla citattecken (`\"`).

Nu kan du använda minst tre citattecken (`"""`) i början och slutet. Allt där emellan tolkas exakt som det står – inklusive citattecken och radbrytningar!

```csharp
// Ingen mer krånglig escaping av citattecken!
string json = """
{
    "namn": "Kaffe",
    "pris": 39
}
""";

```

Kombinerar du det dessutom med stränginterpolering (`$$"""`) bestämmer antalet dollartecken hur många måsvingar som krävs för att läsa av en variabel, vilket gör det busenkelt att generera dynamisk JSON.

### 1.2. Required Members (Obligatoriska medlemmar)

I C# 9 och 10 blev det populärt att använda `init`-setters och objektinitierare istället för långa konstruktorer. Problemet var att kompilatorn inte kunde tvinga en utvecklare att faktiskt sätta ett värde vid initieringen.

C# 11 löste detta med nyckelordet **`required`**:

```csharp
public class Användare
{
    public required string Epost { get; init; } // MÅSTE sättas vid skapandet
    public string? Namn { get; set; }
}

// Det här fungerar perfekt:
var u1 = new Användare { Epost = "test@pownas.se" };

// KOMPILATORFEL! Kompilatorn ryter ifrån eftersom 'Epost' saknas:
// var u2 = new Användare { Namn = "Anna" };

```

### 1.3. List Patterns (Listmönster)

Mönstermatchningen tog ytterligare ett kliv. Nu kan du matcha arrayer och listor mot specifika sekvenser av element, och till och med använda "slice-operatorn" (`..`) för att matcha resten av listan.

```csharp
int[] siffror = { 1, 2, 3, 4, 5 };

if (siffror is [1, 2, .. var resten])
{
    Console.WriteLine("Listan börjar med 1 och 2!");
}

```

---

## 📦 2. Native AOT – Hejdå JIT-kompilering!

Den absolut största arkitektoniska nyheten under huven i .NET 7 var introduktionen av **Native AOT (Ahead-Of-Time compilation)** för konsolapplikationer och fristående tjänster.

I vanliga fall kompileras C#-kod till ett mellanspråk (IL) som sedan JIT-kompileras (Just-In-Time) till maskinkod i samma sekund som applikationen startar. Med Native AOT kompileras koden direkt till ren maskinkod (t.ex. en `.exe`-fil eller Linux-binär) redan vid byggtillfället.

**Fördelarna i molnmiljöer (Docker / Kubernetes):**

* **Blixtsnabb starttid:** Applikationen startar på bråkdelar av en millisekund eftersom ingen JIT-kompilator behöver värmas upp.
* **Minimalt minnesavtryck (Memory Footprint):** Eftersom hela .NET-runtimen inte behöver lyftas in i minnet blir applikationerna extremt slimmade.
* **Ingen extern .NET-dependency:** Den färdiga binären är helt fristående och kan köras på maskiner som saknar .NET SDK/Runtime installerat.

---

## 🌐 3. ASP.NET Core får Enterprise-muskler

Webbstacken fick två efterlängtade funktioner som löste problem där vi tidigare behövt förlita oss på tredjepartslösningar:

### 3.1. Inbyggd Rate Limiting (Anropsbegränsning)

Att skydda sina API:er mot överbelastning eller brute-force har blivit standard. .NET 7 introducerade en inbyggd middleware för *Rate Limiting*. Du kan enkelt konfigurera algoritmer som *Fixed Window*, *Sliding Window* eller *Token Bucket* direkt i `Program.cs`:

```csharp
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("StriktPolicy", opt =>
    {
        opt.PermitLimit = 10; // Max 10 anrop
        opt.Window = TimeSpan.FromSeconds(60); // Per minut
    });
});

```

### 3.2. Output Caching (Svars-cachning på riktigt)

Tidigare fanns *Response Caching*, som i princip bara skickade med HTTP-headers till webbläsaren. Med nya **Output Caching** cachas API-svaren direkt på servern. Du kan enkelt styra ogiltigförklaring (eviction) av cache och basera cachen på specifika query-parametrar eller headers, vilket sparar enorma mängder databasresurser.

---

## ⚠️ 4. Att tänka på vid uppgradering (Breaking Changes)

Även om .NET 7 har hög bakåtkompatibilitet finns det några förändringar som kan ställa till det om du uppgraderar äldre system:

### 4.1. Generisk matematik (Generic Math) ändrar interfaces

I och med införandet av *Generic Math* (möjligheten att använda matematiska operatorer som `+` och `-` direkt på generiska typer via `static abstract`-medlemmar i interfaces) har flera av de inbyggda numeriska typerna i .NET strukturerats om. Om du har skrivit egna avancerade matematiska bibliotek eller egna implementationer av `IFormattable`, kan du stöta på kompileringstyper som krockar.

### 4.2. Auto-genererade Regex-ändringar

I .NET 7 introducerades en ny källgenerator (Source Generator) för reguljära uttryck via attributet `[GeneratedRegex]`. Om du migrerar till detta förändras hur din Regex kompileras, vilket är fantastiskt för prestandan men kan i sällsynta fall ge subtila beteendeskillnader vid felaktigt formaterade strängar.

### 4.3. `BinaryFormatter` stryps ytterligare

Fasningen av den osäkra `BinaryFormatter` som påbörjades i .NET 5 fortsatte i .NET 7. Flera interna metoder i underliggande bibliotek har helt slutat att stödja den, vilket gör att gamla legacy-objekt som förlitar sig på binär serialisering nu helt slutar fungera om man inte explicit slår på legacy-flaggor i `.csproj`.

---

## 🎯 Sammanfattning

.NET 7 visade att Microsoft inte är rädda för att röra sig snabbt. Genom att introducera **Native AOT**, **Raw string literals** och inbyggda funktioner för **Rate Limiting** och **Output Caching**, gjorde de .NET 7 till en av de mest spännande versionerna för molnbaserad utveckling.

Även om .NET 7 bara var en tillfällig anhalt på vägen mot nästa stora stabila punkt (.NET 8), var det här som grunden för den moderna, hypersnabba mikrotjänst-arkitekturen i C# cementerades!

---

## Historien bakom .NET

*I nästa del av bloggserien tar vi steget till nästa gigantiska milstolpe. Det är dags att prata om .NET 8 – den fulländade LTS-versionen där molnet blev "Cloud Native" på riktigt, och C# 12 introducerade primära konstruktorer för alla...*

Tidigare inlägg i bloggserien:

* [Historien bakom .NET](https://blog.pownas.se/2026/05/24/historien-bakom-dotnet)
* [Historien om .NET 5 – Startskottet för den moderna eran](https://blog.pownas.se/2026/05/25/historien-om-dotnet-5)
* [Historien om .NET 6 – Den mogna LTS-versionen](https://www.google.com/search?q=https://blog.pownas.se/2026/05/26/historien-om-dotnet-6)

---

Källor:

* [Nyheter i .NET 7 (Svenska - Microsoft Learn)](https://learn.microsoft.com/sv-se/dotnet/core/whats-new/dotnet-7)
* [What's new in .NET 7 (Engelska - Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-7)
* [Breaking changes in .NET 7 (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/core/compatibility/7.0)
* [Breaking changes in ASP.NET Core 7 (Microsoft Learn)](https://learn.microsoft.com/en-us/aspnet/core/breaking-changes/7/overview)
* [Performance Improvements in .NET 7 (Stephen Toub)](https://devblogs.microsoft.com/dotnet/performance_improvements_in_net_7)
* [.NET and .NET Core release lifecycle (.NET platform support)](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core#lifecycle)
