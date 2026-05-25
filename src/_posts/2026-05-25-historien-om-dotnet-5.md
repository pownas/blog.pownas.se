---
layout: post
title: "Historien om .NET 5 – Startskottet för den moderna eran"
date: 2026-05-25 23:57 +0200
category: "c-sharp,.NET,programmering"
---

Detta är andra inlägget i min blogg serie om "Historien om .NET". Vi hoppar dock över de tidigaste skedena av .NET Framework och .NET Core, de kan du läsa om i första bloggposten. Istället så hoppar vi rakt in i den moderna .NET5.0 och C# 9. Det var här den moderna dotNET (.NET) äntligen sammanfogade allt sedan november 2020.

<!--more-->

## Historien om .NET 5 – Startskottet för den moderna eran: En komplett genomgång av plattformsrevolutionen och C# 9

När Microsoft i slutet av 2020 släppte .NET 5 markerade det slutet på en lång splittring inom .NET-ekosystemet och början på något helt nytt. Efter år av parallell utveckling av det Windows-specifika **.NET Framework** och det plattformsoberoende **.NET Core**, slogs allt samman till en enda, gemensam plattform.

För att undvika förvirring med .NET Framework 4.x hoppade man helt över versionsnummer 4 och slopade ordet "Core". Kvar blev bara **.NET 5** – grundstenen för all framtida .NET-utveckling.

Även om .NET 5 i sig har nått sitt *End of Support* (eftersom det var en STS-version, Short Term Support) lever dess arkitektur, innovationer och språksyntax i allra högsta grad kvar idag i efterföljare som .NET 8 och .NET 10. I den här bloggposten gör vi en djupdykning i plattformsnyheterna, de revolutionerande språksakerna i C# 9, samt vad man måste hålla koll på gällande kompatibilitet och uppgraderingar.

---

## 🚀 1. Den stora plattformsfusionen

Målet med .NET 5 var att skapa **en** runtime och **ett** ramverk som fungerar överallt: webb, moln, skrivbord, mobil, IoT och spelutveckling. 

### Slutet för .NET Framework och .NET Standard?
* **.NET Framework 4.8** blev den sista versionen av det gamla traditionella ramverket. Det underhålls fortfarande för systemsäkerhet men vidareutvecklas inte.
* **.NET Standard** ersattes i praktiken av den nya **Target Framework Moniker (TFM)** `net5.0`. Istället för att klura på vilken .NET Standard-version ditt klassbibliotek behöver stödja, räcker det nu att specificera `net5.0` för att dela kod sömlöst mellan alla .NET 5-applikationer. 
    *(Obs: Om du fortfarande behöver dela kod med gamla .NET Framework-applikationer är det fortfarande `netstandard2.0` som gäller).*

### Ramverksteknikerna som lämnades kvar
I och med övergången till den moderna arkitekturen valde Microsoft att inte porta vissa äldre tekniker från .NET Framework. Om du migrerar äldre system behöver du titta på moderna alternativ:

| Gammal teknik (.NET Framework) | Rekommenderat modernt alternativ i .NET 5+ |
| :--- | :--- |
| **ASP.NET Web Forms** | ASP.NET Core Blazor eller Razor Pages |
| **Windows Communication Foundation (WCF) Server** | gRPC eller community-projektet CoreWCF (officiellt stött av MS) |
| **Windows Workflow Foundation (WF)** | Elsa Workflows eller CoreWF |

---

## ✍️ 2. Språkuppdateringar: C# 9 och F# 5

Tillsammans med .NET 5 lanserades C# 9 och F# 5, vilket gav utvecklare kraftfulla verktyg för att kapa onödig kod och skriva mer deklarativt.

### Höjdpunkter i C# 9:

#### 1. Top-Level Statements (Toppnivå-statements)
Innan C# 9 krävdes det en hel del ceremonikod bara för att skriva ut en enkel textrad i konsolen. Du behövde ett `namespace`, en `class Program` och en rörig `static void Main`-metod.

**Förr (Boilerplate):**
```csharp
using System;

namespace MittProgram
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hej världen!");
        }
    }
}

```

**Från och med C# 9:**

```csharp
using System;

Console.WriteLine("Hej världen!");

```

Kompilatorn skapar automatiskt den underliggande klassen och `Main`-metoden i bakgrunden. Detta gör C# perfekt för mindre mikrotjänster, Azure Functions och skriptliknande kod.

#### 2. Records (Datacentrerade typer)

Nyheten **`record`** introducerade en ny referenstyp som är **oföränderlig (immutable)** som standard och använder **värdebaserad jämförelse**. Det innebär att två helt olika objekt anses vara lika om de innehåller exakt samma data.

```csharp
// En hel datamodell definierad på en enda rad!
public record Person(string FirstName, string LastName);

var p1 = new Person("Anna", "Andersson");
var p2 = new Person("Anna", "Andersson");

// Värdebaserad jämförelse (kollar innehållet, inte minnesadressen)
Console.WriteLine(p1 == p2); // Skriver ut: True

// Icke-destruktiv mutation via 'with'-uttrycket
var p3 = p1 with { LastName = "Pettersson" };

```

#### 3. Init-Only Setters

Om du vill ha properties som är skrivskyddade efter initiering, men ändå vill kunna använda smidiga objektinitierare istället för långa konstruktorer, är `init` lösningen.

```csharp
public class Produkt
{
    public int Id { get; init; }      // Kan BARA sättas under själva skapandet
    public string Namn { get; set; }  // Kan ändras när som helst
}

var p = new Produkt { Id = 42, Namn = "Bryggkaffe" };
p.Namn = "Espresso"; // OK!
// p.Id = 99;        // KOMPILATORFEL! Går inte att ändra efter initiering.

```

#### 4. Avancerad mönstermatchning (Relational & Logical Patterns)

Mönstermatchningen i `switch`-uttryck tog ett jättekliv framåt. Nu kan du använda logiska ord som `and`, `or` och `not`, i kombination med matematiska relationsoperatorer (`<`, `>`, `<=`, `>=`).

```csharp
int speed = 110;

string meddelande = speed switch
{
    < 30 => "Kör sakta",
    >= 30 and <= 70 => "Normal hastighet",
    > 70 and not 120 => "Det går undan",
    _ => "Hög eller kritisk hastighet"
};

```

#### 5. Source Generators (Källgeneratorer)

En enorm nyhet under huven var Source Generators. Det gör det möjligt för kompilatorn att inspektera din kod under pågående kompilering och generera extra C#-kod i realtid. Detta har dramatiskt minskat behovet av långsam reflektion (reflection) vid runtime i moderna applikationer.

### Nyheter i F# 5

F# (det funktionella språket i .NET) fick också en stor uppdatering i och med F# 5. Den största nyheten här var introduktionen av **interpolerade strängar** (likt C# och JavaScript), samt **typad interpolering** där formatspecifikationen valideras direkt av kompilatorn:

```fsharp
let name = "David"
let age = 36
let message = $"%s{name} is %d{age} years old." // Typsäker formatering!

```

---

## ⚡ 3. Prestanda och Runtime-förbättringar

.NET 5 var känt som en utpräglad "prestanda-release". Microsoft optimerade nästan varje hörn av körtidsmiljön:

* **Skräpinsamlingen (Garbage Collection):** Drastiskt sänkt minnesallokering och snabbare hantering av trådar i stora servermiljöer.
* **System.Text.Json:** Fick inbyggt stöd för C# 9-records, hantering av cirkelreferenser, deserialisering av citat-tecken i tal samt tilläggsmetoder direkt på `HttpClient` (t.ex. `GetFromJsonAsync`), vilket eliminerar behovet av att strömma och omvandla JSON-strängar manuellt.
* **ValueTask-poolning:** Förbättrad asynkron prestanda genom att återanvända interna objekt i högpresterande loopar.
* **Appar med en enda fil (Single-file apps):** Förbättrad paketering där hela applikationen och dess beroenden kan kompileras till en enda körbar fil (`.exe`), och en aggressiv *App trimming* som analyserar koden och kastar bort oanvända binärer för att minska filstorleken.

---

## ⚠️ 4. Att tänka på vid uppgradering (Breaking Changes)

Att migrera en applikation från .NET Core 3.1 eller äldre .NET Framework till .NET 5 innebär en del förändringar i applikationsbeteendet som kan leda till buggar om man inte är förberedd. Här är de absolut viktigaste kompatibilitetsaspekterna:

### 🛠️ Kritiska ändringar i Runtime och bibliotek

1. **`Thread.Abort` är föråldrat (Obsolete):**
I .NET 5 genererar anrop till `Thread.Abort()` ett kompilatorfel (eller en `PlatformNotSupportedException` vid runtime). Det beror på att metoden är direkt osäker för trådsäkerheten och applikationsstabiliteten. Du bör istället migrera till moderna `CancellationToken`-mönster.
2. **`BinaryFormatter` fasas ut av säkerhetsskäl:**
På grund av allvarliga, fundamentala säkerhetssårbarheter (där skadlig binärdata kan utnyttjas för att exekvera godtycklig kod på servern) har `BinaryFormatter` markerats som föråldrad och blockerats i många flöden. Det rekommenderas starkt att använda `System.Text.Json`, `Protobuf` eller `MessagePack`.
3. **Skiftet till ICU på Windows (Globalisering):**
Tidigare använde .NET på Windows *National Language Support (NLS)* för globaliseringsfunktioner (såsom strängsortering och kulturspecifika jämförelser). Från och med .NET 5 använder alla operativsystem (inklusive Windows) **ICU (International Components for Unicode)** som standard. Det här kan leda till subtila men märkbara skillnader i hur strängar sorteras eller hur tecken jämförs i dina databaser och listor.
4. **Inbyggt WinRT-stöd borttaget:**
Det tidigare inbyggda stödet i runtime för att anropa WinRT-API:er (Windows Runtime) togs bort till förmån för verktygsuppsättningen *C#/WinRT*. Detta gjordes för att göra själva .NET-runtime helt plattformsoberoende och frikopplad från Windows interna arkitektur.
5. **Stramare `JsonSerializer`:**
Deserialiseringen blev mer strikt. Till exempel ignoreras icke-publika eller parameterlösa konstruktorer som standard vid deserialisering, vilket kan bryta äldre DTO-strukturer om de inte annoteras eller konfigureras korrekt.

---

## 🎯 Sammanfattning

.NET 5 handlade om att ena plattformen, kapa historiskt arv och ge utvecklare verktyg för att skriva extremt ren, modern och högpresterande kod. Funktionerna som introducerades här – framförallt **records**, **top-level statements** och övergången till den gemensamma **`net` TFM-strukturen** – lade hela grunden för den moderna guldålder vi befinner oss i idag med .NET 8 och framåt.

Om du sitter på äldre system är stegen via .NET 5:s grundprinciper den absolut viktigaste arkitektoniska språngbrädan du kan ta för att framtidssäkra dina applikationer!

---

## Historien bakom .NET
*Nu i kommande delar av bloggserien, så tänker jag att vi djupdyker i versionnyheterna, sedan i november 2020. Då startskottet för den moderna eran, dagen då .NET 5 och C# 9 släpptes lös och förändrade hur vi skriver C#-kod för alltid...*

Föregående bloggpost med hela historian runt .NET:
* [Historien bakom .NET](https://blog.pownas.se/2026/05/24/historien-bakom-dotnet)

---

Källor:
* [Nyheter i .NET 5 (Svenska - Microsoft Learn)](https://learn.microsoft.com/sv-se/dotnet/core/whats-new/dotnet-5)
* [What's new in .NET 5 (Engelska - Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-5)
* [Breaking changes in .NET 5 (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/core/compatibility/5.0)
* [Breaking changes in ASP.NET Core 5 (Microsoft Learn)](https://learn.microsoft.com/en-us/aspnet/core/breaking-changes/5/overview)
* [.NET and .NET Core release lifecycle (.NET platform support)](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core#lifecycle)
