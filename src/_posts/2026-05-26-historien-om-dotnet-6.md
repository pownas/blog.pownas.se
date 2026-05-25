---
layout: post
title: "Historien om .NET 6 – Den mogna LTS-versionen"
date: 2026-05-26 00:37 +0200
category: "c-sharp,.NET,programmering"
---

Detta är tredje inlägget i min blogg serie om "Historien om .NET". Här går vi in på nyheternba i moderna .NET6.0 och C# 10, som släpptes noveber 2021. En enorm prestandabomb till LTS-version som revolutionerade webbutvecklingen genom introduktionen av Minimala API:er.

<!--more-->

## .NET 6 – Den mogna LTS-versionen: En djupdykning i C# 10, Minimal APIs och Hot Reload

Om .NET 5 var startskottet för Microsofts nya, enhetliga era, så var **.NET 6** (som släpptes i slutet av 2021) versionen där allt landade, stabiliserades och blev redo för storskalig produktion. Som en **LTS-version** (Long Term Support) gav den företag den trygghet som krävdes för att slutgiltigt migrera bort från det gamla .NET Framework.

Tillsammans med **C# 10** tog Microsoft steget fullt ut för att rensa bort onödig ceremonikod (boilerplate) och introducerade funktioner som förändrade hur vi bygger webbapplikationer i grunden.

Här går vi igenom de absolut största nyheterna, prestandahoppen och de dolda fallgroparna du behöver ha koll på vid en uppgradering.

---

## 🚀 1. C# 10 och de nya slimmade projektmallarna

Tillsammans med .NET 6 lanserades C# 10. Om du skapar ett nytt konsolprogram eller webbprojekt i .NET 6 möts du av en radikal förändring: `Program.cs` innehåller nästan ingen kod alls. Detta möjliggjordes genom tre stora språksaker:

### Global Usings & Implicit Usings

Trött på att ha tio rader med `using System;`, `using System.Linq;` längst upp i *varje* fil?

* **Global Usings:** Du kan nu skriva `global using System.Net.Http;` i en enda fil, så är det tillgängligt i hela projektet.
* **Implicit Usings:** Kompilatorn lägger automatiskt till de vanligaste namespaces baserat på vilken typ av projekt du kör (t.ex. webb eller konsol).

### File-scoped Namespaces

Istället för att omsluta hela din klass med måsvingar för ett namespace (vilket skjuter in all din kod ett snäpp åt höger), kan du nu deklarera ditt namespace på en enda rad med ett semikolon.

**Förr:**

```csharp
namespace MittProgram
{
    public class Kund { }
}

```

**Från och med C# 10:**

```csharp
namespace MittProgram; // Snyggt, rent och sparar indentation!

public class Kund { }

```

### Record Structs

I C# 9 fick vi `record` som var en klass (referenstyp) under huven. C# 10 introducerade **`record struct`**, vilket ger dig samma smidiga fördelar (oföränderlighet och värdebaserad jämförelse) men som en **värdetyp** (struct). Det är perfekt för små, högpresterande datastrukturer där du vill undvika minnesallokeringar på heapen.

---

## 🌐 2. Minimal APIs – Webbstackens revolution

Detta är förmodligen den största arkitektoniska nyheten i ASP.NET Core sedan starten. Innan .NET 6 behövde du skapa en hel controller-arkitektur med klasser, attribut och injiceringar bara för att bygga ett enkelt API-endpoint.

Med **Minimal APIs** kombineras C# 9:s *Top-level statements* med ASP.NET Core för att du ska kunna bygga mikrotjänster på bara några rader kod direkt i `Program.cs`:

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Ett fullt fungerande API-endpoint på en enda rad!
app.MapGet("/api/hallo", () => new { Meddelande = "Hej från Minimal APIs!" });

app.Run();

```

**Varför det är bra:** Det gör att .NET kan tävla med Node.js och Python i snabbhet när det gäller att sätta upp små, lätta mikrotjänster, samtidigt som det behåller .NET-plattformens brutala prestanda.

---

## ⚡ 3. Produktivitet och Prestanda under huven

.NET 6 flyttade fram gränserna för hur snabbt en applikation kan köras – och hur snabbt en utvecklare kan arbeta.

* **Hot Reload (Varm omstart):** Nu slipper du starta om applikationen så fort du ändrar en rad kod eller uppdaterar en Blazor-komponent. Med Hot Reload (via Visual Studio eller CLI-verktyget `dotnet watch`) appliceras dina kodändringar direkt i den rullande appen utan att tappa applikationens nuvarande tillstånd.
* **Inbyggt stöd för Arm64:** .NET 6 introducerade fullt, nativt stöd för Apple Silicon (M1/M2/M3-chipp) samt Windows Arm64, vilket gav ett enormt prestandalyft för utvecklare som kör macOS.
* **Dynamisk PGO (Profile-Guided Optimization):** JIT-kompilatorn blev smartare. Den analyserar hur din kod körs i realtid (tier 0) och kompilerar sedan om de mest använda kodvägarna till en superoptimerad maskinkod (tier 1).
* **Supersnabb FileStream:** Hela `System.IO.FileStream` skrevs om från grunden för Windows, vilket eliminerade blockeringar vid asynkron I/O och gjorde filhanteringen drastiskt mycket snabbare.

---

## ⚠️ 4. Att tänka på vid uppgradering (Kritiska Breaking Changes)

När du migrerar ett projekt till .NET 6 från .NET Core 3.1 eller .NET 5 finns det ett par dolda förändringar i beteende som du måste se upp med:

### 1. `System.Drawing.Common` blir Windows-specifik! (Viktigt för Docker/Linux)

Detta är den absolut vanligaste fallgropen vid migrering. Om du använder `System.Drawing.Common` för att generera bilder, QR-koder eller hantera grafik på en Linux-server (eller i en Linux-baserad Docker-container), kommer din kod att krascha med en `PlatformNotSupportedException` i .NET 6.

* **Lösning:** Microsoft rekommenderar att man migrerar till plattformsoberoende bibliotek som *ImageSharp*, *SkiaSharp* eller *Microsoft.Maui.Graphics*.

### 2. Ohanterade fel i `BackgroundService` kraschar appen

I tidigare versioner av .NET kunde en bakgrundstråd (`BackgroundService` eller `IHostedService`) krascha i tysthet utan att huvudapplikationen dog. Från och med .NET 6 följer bakgrundstjänster normal felhanteringsstandard: om en bakgrundstjänst kastar ett ohanterat undantag (unhandled exception), **stängs hela applikationen ner**.

* **Lösning:** Se till att du har robusta `try-catch`-block inuti dina `ExecuteAsync`-metoder i bakgrundstjänsterna.

### 3. `WebRequest` och `WebClient` markeras som föråldrade

De gamla klasserna `WebRequest`, `WebClient` och `ServicePoint` är nu officiellt markerade som `Obsolete`. De underhålls inte längre och kommer att tas bort helt i framtida versioner.

* **Lösning:** Ersätt dem helt med `HttpClient`.

### 4. `IAsyncEnumerable` i System.Text.Json

Om du skickar en `IAsyncEnumerable<T>` till `JsonSerializer` kommer .NET 6 nu att serialisera den asynkront som en JSON-array. Det är jättebra för prestandan, men om din äldre kod förväntade sig ett annat beteende kan det bryta integrationer.

---

## 🎯 Sammanfattning

Medan .NET 5 ritade om kartan, såg .NET 6 till att bygga motorvägarna. Med funktioner som **Minimal APIs**, **Hot Reload** och de slimmade kompilatorfunktionerna i **C# 10** blev .NET-utveckling roligare, snabbare och mer modern än någonsin tidigare.

Har du applikationer som fortfarande snurrar på äldre plattformar är steget upp till senaste .NET 10 (med alla nyheter från .NET 5+) den bästa investeringen du kan göra för både systemets prestanda och ditt teams kodglädje!

---

## Historien bakom .NET

*I nästa del av bloggserien fortsätter vi resan och kliver in i november 2022. Då släpptes .NET 7 och C# 11 – en release som handlade om kompromisslös innovation och rå prestanda. Vi kommer titta närmare på hur Microsoft kapade starttider i molnet med Native AOT och hur vi äntligen slapp escape-tecken i JSON tack vare råa strängliteraler...*

Föregående inlägg med hela historian runt .NET:

* [Historien bakom .NET](https://blog.pownas.se/2026/05/24/historien-bakom-dotnet)
* [Historien om .NET 5 – Startskottet för den moderna eran](https://blog.pownas.se/2026/05/25/historien-om-dotnet-5)

---

Källor:
* [Nyheter i .NET 6 (Svenska - Microsoft Learn)](https://learn.microsoft.com/sv-se/dotnet/core/whats-new/dotnet-6)
* [What's new in .NET 6 (Engelska - Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-6)
* [Breaking changes in .NET 6 (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/core/compatibility/6.0)
* [Breaking changes in ASP.NET Core 6 (Microsoft Learn)](https://learn.microsoft.com/en-us/aspnet/core/breaking-changes/6/overview)
* [.NET and .NET Core release lifecycle (.NET platform support)](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core#lifecycle)
