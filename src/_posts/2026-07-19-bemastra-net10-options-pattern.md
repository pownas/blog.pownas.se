---
layout: post
title: 'Bemästra .NET 10 Options Pattern — IOptions vs. IOptionsSnapshot vs. IOptionsMonitor'
date: 2026-07-19 20:56 +0200
category: "programmering, csharp, dotnet"
---

Att hantera konfiguration i ett modernt enterprise-system handlar om betydligt mer än att bara läsa en sträng från `appsettings.json`. I storskaliga system – som ofta bygger på arkitekturer som Vertical Slice Architecture, distribuerade mikrotjänster och molnbaserad infrastruktur – blir hanteringen av inställningningarnas livscykel (lifetime) helt kritisk.

Om du injicerar fel typ av Options-gränssnitt riskerar du allt från subtila buggar med datakonsistens under en HTTP-request, till applikationskrascher på grund av *Captive Dependencies* (fångade beroenden).

I .NET 10 har vi tre primära verktyg för att läsa konfiguration: `IOptions<T>`, `IOptionsSnapshot<T>` och `IOptionsMonitor<T>`. Låt oss gå till botten med exakt hur de fungerar, hur de presterar under huven och hur du väljer rätt i din arkitektur.

<!--more-->
---

## 🚀 De tre utmanarna: En teknisk djupdykning

För att förstå skillnaderna måste vi titta på hur Dependency Injection (DI)-containern i .NET hanterar deras livslängd och hur de förhåller sig till ändringar i den underliggande konfigurationskällan.

### 1. IOptions<T> — Den statiska Singleton-prestandan

`IOptions<T>` är den enklaste och mest resurssnåla varianten. När din applikation startar upp (eller när inställningen efterfrågas för första gången) läser .NET av konfigurationen, mappar den mot din C#-klass och cachelagrar resultatet permanent i minnet.

* **DI-Livslängd:** `Singleton`. Den skapas en gång och lever under hela applikationens livstid.
* **Realtidsuppdateringar:** Nej. Om en fil ändras på disken eller om en miljövariabel uppdateras i din container, kommer `IOptions<T>` fortfarande att envist returnera exakt samma värde som vid uppstart via egenskapen `.Value`.
* **Bäst för:** Kritiska kärninställningar som aldrig (eller extremt sällan) ändras utan en deployment, till exempel anslutningssträngar till databaser eller fasta domänadresser för interna API-anrop.

### 2. IOptionsSnapshot<T> — Request-konsistens för webben

`IOptionsSnapshot<T>` introducerades för att lösa problemet med förändringar under körtid i webbapplikationer, utan att offra trådsäkerhet och datakonsistens.

* **DI-Livslängd:** `Scoped`. Det betyder att ett helt nytt objekt instansieras eller utvärderas för varje unikt scope (oftast en inkommande HTTP-request eller en meddelandekonsument i en kö).
* **Realtidsuppdateringar:** Ja, men *per request*. Om du uppdaterar en inställning i `appsettings.json` mitt under en pågående exekvering, kommer nuvarande HTTP-anrop inte att märka något. Nästa inkommande HTTP-anrop kommer däremot att läsa in den uppdaterade konfigurationen.
* **Bäst för:** Affärslogik, valutaomvandlingar, momssatser eller externa integrationsinställningar som körs inuti dina Web API-controllers, minimal API-endpoints eller MediatR-handlers.

### 3. IOptionsMonitor<T> — Den reaktiva realtidsbevakaren

`IOptionsMonitor<T>` är utformad för system som kräver absolut omedelbar förändring utan omstarter, och den fungerar helt oberoende av HTTP-scopes.

* **DI-Livslängd:** `Singleton`. Precis som `IOptions<T>` kan den injiceras var som helst, men den interna implementationen lyssnar aktivt på filändringar (file change tokens) eller externa triggers.
* **Realtidsuppdateringar:** Ja, omedelbart via `.CurrentValue`. Varje gång du anropar egenskapen får du det absolut senaste tillgängliga värdet. Den erbjuder också ett `OnChange`-event där du kan registrera callbacks för att köra egen kod när en inställning skiftar värde.
* **Bäst för:** Långlevande bakgrundstjänster (`IHostedService` / `BackgroundService`), SignalR-hubbar, dynamisk loggnivåhantering (t.ex. skifta från `Information` till `Debug` under ett pågående produktionsfel) eller centraliserade Feature Flags.

---

## 📊 Den ultimata jämförelsematrisen

Här är matrisen du kan hålla i huvudet (eller klistra in i ditt teams interna dokumentation) när du designar dina tjänster:

| Egenskap | `IOptions<T>` | `IOptionsSnapshot<T>` | `IOptionsMonitor<T>` |
| --- | --- | --- | --- |
| **Åtkomstmetod** | `.Value` | `.Value` | `.CurrentValue` |
| **DI-Livslängd** | **Singleton** | **Scoped** | **Singleton** |
| **Ändringshantering** | Låst vid appstart | Uppdateras per nytt scope | Realtid via fil/trådbevakning |
| **Request-konsistens** | Ja (Alltid statisk) | Ja (Fast under scopets livstid) | Nej (Kan skifta mitt i en metod) |
| **Stöd för namngivna options** | Nej | Ja | Ja |
| **Kan trigga kod vid ändring** | Nej | Nej | Ja, via `.OnChange()`. |
| **Prestandaprofil** | Minimal overhead | Liten overhead (valideras per scope) | Kontinuerlig lyssnings-overhead |

---

## 🛠 Komplett kod-blueprint och registrering

Låt oss titta på hur vi sätter upp detta i modern .NET 10-kod, inklusive starkt typad validering vid applikationens uppstart.

### 1. Konfiguration och C#-klass

```json
// appsettings.json
{
  "OrderSettings": {
    "MaxItemsPerOrder": 50,
    "DiscountPercentage": 15
  }
}

```

```csharp
// OrderSettings.cs
using System.ComponentModel.DataAnnotations;

public class OrderSettings
{
    [Range(1, 1000)]
    public int MaxItemsPerOrder { get; set; }

    [Range(0, 100)]
    public int DiscountPercentage { get; set; }
}

```

### 2. Uppstart och validering i Program.cs

I .NET 10 använder vi det rekommenderade Fluent-liknande API:et för att säkra upp konfigurationen innan appen ens börjar ta emot trafik.

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Registrera och validera direkt vid start
builder.Services.AddOptions<OrderSettings>()
    .Bind(builder.Configuration.GetSection("OrderSettings"))
    .ValidateDataAnnotations()
    .ValidateOnStart(); // Kastar undantag direkt vid start om värdena är felaktiga

builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddSingleton<IQueueProcessor, QueueProcessor>();

var app = builder.Build();
app.Run();

```

---

## 🎯 De tre scenarierna i praktiken

### Scenario 1: Prestandakritisk integrationskod med `IOptions<T>`

Här injiceras inställningarna som en statisk trådsäker **Singleton**. Perfekt för beräkningsintensiva eller högfrekventa tjänster där prestanda är högsta prioritet.

```csharp
// OrderService.cs (Högpresterande kärnkomponent)
using Microsoft.Extensions.Options;

public class OrderService : IOrderService
{
    private readonly OrderSettings _settings;

    // IOptions är Singleton, så vi kan läsa ut .Value direkt i konstruktorn
    public OrderService(IOptions<OrderSettings> options)
    {
        _settings = options.Value;
    }

    public void ValidateOrderLimit(int itemCount)
    {
        // Minimal overhead - ingen trådlåsning eller filbevakning vid anrop
        if (itemCount > _settings.MaxItemsPerOrder)
        {
            throw new InvalidOperationException("Ordern innehåller för många artiklar.");
        }
    }
}

```

### Scenario 2: Web API / Transaktionssäker affärslogik med `IOptionsSnapshot<T>`

Här fryses inställningarna exakt när HTTP-anropet skapas. Det eliminerar risken för datainkonsekvens under ett pågående asynkront arbetsflöde.

```csharp
// OrderProcessor.cs (Vertical Slice Handler / Web API-tjänst)
using Microsoft.Extensions.Options;

public class OrderProcessor
{
    private readonly IOptionsSnapshot<OrderSettings> _snapshot;

    public OrderProcessor(IOptionsSnapshot<OrderSettings> snapshot)
    {
        _snapshot = snapshot;
    }

    public async Task ProcessInvoiceAsync(Order order)
    {
        // Värdet fryses per HTTP-request.
        // Även om filen på disken ändras under tiden dessa asynkrona
        // operationer körs, kommer DiscountPercentage att förbli exakt densamma.

        var discount = order.Total * (_snapshot.Value.DiscountPercentage / 100.0);
        await SaveDiscountToDatabaseAsync(order.Id, discount);

        // ... Några sekunders asynkront databas- eller nätverksarbete ...

        var finalTotal = order.Total - discount;
        await CompleteTransactionAsync(order.Id, finalTotal);
    }
}

```

### Scenario 3: Långlevande bakgrundstjänster med `IOptionsMonitor<T>`

Eftersom en bakgrundstråd körs som en `Singleton`, måste den använda `IOptionsMonitor<T>` för att säkert kunna läsa in förändringar under drift utan omstart.

```csharp
// QueueProcessor.cs (Långlevande bakgrundstråd / BackgroundService)
using Microsoft.Extensions.Options;

public class QueueProcessor : IQueueProcessor
{
    private readonly IOptionsMonitor<OrderSettings> _monitor;

    public QueueProcessor(IOptionsMonitor<OrderSettings> monitor)
    {
        _monitor = monitor;

        // Valfritt: Agera direkt när en fil ändras på disken
        _monitor.OnChange(newSettings =>
        {
            Console.WriteLine($"Konfiguration ändrad live! Max antal är nu: {newSettings.MaxItemsPerOrder}");
        });
    }

    public async Task StartProcessingAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            // Vi använder .CurrentValue inuti loopen.
            // Om appsettings.json uppdateras läser nästa iteration av det nya värdet omedelbart.
            var batchSize = _monitor.CurrentValue.MaxItemsPerOrder;

            await ProcessNextBatchAsync(batchSize);
            await Task.Delay(5000, ct);
        }
    }
}

```

---

## ⚠️ Enterprise-fällorna du måste undvika

### Fälla 1: Captive Dependencies (Fångade beroenden)

Eftersom `IOptionsSnapshot<T>` är en **Scoped** tjänst, kan du **inte** injicera den direkt i en tjänst som är en **Singleton** (t.ex. `QueueProcessor` ovan). Om du försöker med detta kommer .NET:s DI-container att kasta ett runtime-undantag vid uppstart:

> *InvalidOperationException: Cannot consume scoped service 'Microsoft.Extensions.Options.IOptionsSnapshot`1[OrderSettings]' from singleton...*

**Lösning:** Använd alltid `IOptionsMonitor<T>` i långlevande Singleton-tjänster.

### Fälla 2: Det dolda hotet mot datakonsistens

Om du slentrianmässigt använder `IOptionsMonitor<T>` i dina vanliga API-tjänster (som i *Scenario 2*), utsätter du dig för race conditions. Om en administratör eller en extern provider (t.ex. Azure App Configuration) uppdaterar ett värde exakt under den millisekund din kod väntar på ett databasanrop, kommer första halvan av din metod köra med ett värde och den andra halvan med ett annat.

**Lösning:** För affärslogik i webbrequests, använd **alltid** `IOptionsSnapshot<T>`.

---

## 📚 Officiella referenser från Microsoft Learn

För vidareläsning och verifiering av gränssnittens källkod och beteenden i .NET 10, se följande officiella resurser:

* **Huvuddokumentation för Options-mönstret:** [Options pattern in .NET / ASP.NET Core](https://learn.microsoft.com/en-us/dotnet/core/extensions/options) — Går igenom grunderna för bindning, validering och livscykler.
* **Djupdykning i Snapshot-mekanismen:** [Use IOptionsSnapshot to read updated data](https://learn.microsoft.com/en-us/dotnet/core/extensions/options#use-ioptionssnapshot-to-read-updated-data) — Beskriver i detalj hur cachelagringen är isolerad per scope samt hantering av namngivna alternativ.
* **Klassbiblioteksreferens:** [Microsoft.Extensions.Options Namespace](https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.options) — Den fullständiga API-specifikationen för utvecklare som vill förstå de underliggande klasserna som `OptionsManager<TOptions>`.
