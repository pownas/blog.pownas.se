---
layout: post
title: 'Gör telemetri enkelt: Bygg ett gemensamt NuGet-paket för .NET Aspire och OpenTelemetry'
date: 2026-07-26 22:20 +0200
category: "programmering,csharp,dotnet,arkitektur,observerbarhet"
---

Tänk dig att du leder en organisation med ett 20-tal olika applikationer och mikrotjänster. Du vill ha perfekt observerbarhet – strukturerad JSON-loggning, distribuerad spårning (Distributed Tracing) och prestandamätetal (Metrics). Men du vill *inte* tvinga varje enskilt produktteam att bli experter på OpenTelemetry-arkitektur, Serilog-konfiguration eller DevOps-pipelines.

Lösningen? Du bygger ett internt NuGet-paket (t.ex. `Company.Telemetry`) som paketerar organisationens best practices. Det bästa av allt? Genom att hålla oss strikt till .NET-standarder som `ILogger` och `Activity` kan produktteamen logga precis som vanligt, medan vårt paket sköter magin under huven – oavsett om de kör lokalt med **.NET Aspire** eller i produktion mot en central **OpenTelemetry Collector**.

I den här bloggposten går vi igenom exakt hur du bygger detta paket.

<!--more-->
---

## Varför standarder vinner i längden

Det absolut vanligaste misstaget när man centraliserar loggning är att introducera egna, proprietära logg-bibliotek eller tvinga teamen att injicera tredjeparts-klasser i sina tjänster. Det skapar ett hårt beroende (vendor lock-in) som är plågsamt att ta sig ur.

Genom att istället bygga paketet runt Microsofts inbyggda abstraktioner får vi det bästa av två världar:

* **`ILogger` & `ILogger<T>`:** Standardiserat gränssnitt för applikationsloggar.
* **`System.Diagnostics.Activity`:** .NET-motvarigheten till en OpenTelemetry "Span". Används för att spåra flöden och mäta tid.
* **Serilog som motor:** Vi använder Serilog i bakgrunden för dess kraftfulla "Enrichers" och flexibla JSON-formatering, men vi döljer det helt för slutanvändaren.

---

## Arkitekturen: Lokalt vs Produktion

För att ge utvecklarna en fantastisk upplevelse vill vi ha olika beteenden beroende på miljö:

1. **Lokal utveckling (Development):** Vi vill att appen pratar sömlöst med **.NET Aspire**. Aspire injicerar automatiskt miljövariabler för OTel-ändpunkter, och ger utvecklarna en fantastisk realtids-dashboard för loggar och spårningar.
2. **Test & Produktion (Cloud/On-Prem):** Vi vill strömma binär telemetri via gRPC/OTLP till en central OpenTelemetry Collector (som i sin tur skickar data vidare till t.ex. Elastic, Grafana, Jaeger eller Datadog). Vi vill också separera vanliga apploggar från strikta **Audit-loggar** (säkerhetsloggar).

---

## Implementationen: Skapa ditt gemensamma paket

Skapa ett nytt klassbibliotek i .NET och lägg till referenser till OpenTelemetry, Serilog och tillhörande instrumentering. Här är källkoden för din centrala extension-method som produktteamen kommer att anropa.

```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using System;
using System.Collections.Generic;

namespace Company.Telemetry;

public static class TelemetryExtensions
{
    public static WebApplicationBuilder AddCompanyTelemetry(this WebApplicationBuilder builder, string applicationName)
    {
        var isDev = builder.Environment.IsDevelopment();

        // 1. Hantera OTel-ändpunkter dynamiskt
        // I .NET Aspire injiceras "OTEL_EXPORTER_OTLP_ENDPOINT" automatiskt lokalt.
        string otlpEndpoint = isDev
            ? Environment.GetEnvironmentVariable("OTEL_EXPORTER_OTLP_ENDPOINT") ?? "http://localhost:4317"
            : builder.Configuration.GetValue<string>("Telemetry:OtlpEndpoint")
              ?? throw new InvalidOperationException("Måste konfigurera Telemetry:OtlpEndpoint i produktion!");

        var resourceBuilder = ResourceBuilder.CreateDefault()
            .AddService(applicationName)
            .AddTelemetrySdk();

        // 2. Konfigurera Serilog-motorn
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
            .MinimumLevel.Override("System", Serilog.Events.LogEventLevel.Warning)
            .Enrich.FromLogContext()

            // Vanliga apploggar till konsolen
            .WriteTo.Conditional(
                logEvent => !logEvent.Properties.ContainsKey("IsAudit"),
                sink => sink.Console(isDev
                    ? new Serilog.Formatting.SystemConsole.SystemConsoleThemeFormatter()
                    : new Serilog.Formatting.Compact.RenderedCompactJsonFormatter()))

            // Audit-loggar isoleras till en säker fil lokalt som backup
            .WriteTo.Conditional(
                logEvent => logEvent.Properties.ContainsKey("IsAudit"),
                sink => sink.File(new Serilog.Formatting.Compact.CompactJsonFormatter(), "logs/audit/audit-.json"))

            // Skeppa allt centralt via standardiserad OTLP (OpenTelemetry Protocol)
            .WriteTo.OpenTelemetry(options =>
            {
                options.Endpoint = otlpEndpoint;
                options.Protocol = Serilog.Sinks.OpenTelemetry.OtlpProtocol.Grpc;
                options.ResourceAttributes = new Dictionary<string, object> { ["service.name"] = applicationName };
            })
            .CreateLogger();

        builder.Host.UseSerilog();

        // 3. Konfigurera OpenTelemetry (Traces & Metrics)
        builder.Services.AddOpenTelemetry()
            .WithResourceBuilder(resourceBuilder)
            .WithTracing(tracing => tracing
                .AddAspNetCoreInstrumentation(o => o.Filter = (ctx) => !ctx.Request.Path.StartsWithSegments("/health"))
                .AddHttpClientInstrumentation() // Automatisk distribuerad spårning över HTTP
                .AddOtlpExporter(o => o.Endpoint = new Uri(otlpEndpoint)))
            .WithMetrics(metrics => metrics
                .AddAspNetCoreInstrumentation()
                .AddHttpClientInstrumentation()
                .AddRuntimeInstrumentation() // CPU, Minne och GC-statistik direkt ur lådan
                .AddOtlpExporter(o => o.Endpoint = new Uri(otlpEndpoint)));

        return builder;
    }
}

```

### Hantera Audit-loggning på ett säkert sätt

För att göra det enkelt för utvecklare att skriva formella audit-loggar (som kräver strikt spårbarhet) utan att de behöver konfigurera Serilog-tags manuellt, skapar vi en extension-method på Microsofts `ILogger`:

```csharp
using Microsoft.Extensions.Logging;

namespace Company.Telemetry;

public static class LoggerExtensions
{
    public static void LogAudit(this ILogger logger, string action, string userId, object details)
    {
        // Vi använder strukturerad loggning för att skicka med IsAudit som metadata
        logger.LogInformation(
            "{@AuditLog} utförd av {UserId}. Aktion: {Action}",
            new { IsAudit = true, Details = details },
            userId,
            action);
    }
}

```

---

## Hur produktteamen använder paketet

För utvecklarna i ditt produktteam blir implementationen löjligt enkel. De installerar ert interna NuGet-paket och lägger till **en enda rad kod** i sin `Program.cs`.

```csharp
var builder = WebApplication.CreateBuilder(args);

// Aktiverar Serilog, OpenTelemetry, Aspire-integration och Audit-hantering direkt
builder.AddCompanyTelemetry("BillingServiceAPI");

var app = builder.Build();
// ...

```

När de vill skriva en vanlig logg eller starta en spårning (Span) använder de bara .NET:s egna standardklasser:

```csharp
// Vanlig applogg - hamnar i rätt flöde tack vare paketet
_logger.LogInformation("Behandlar betalning för order {OrderId}", orderId);

// Skapa en explicit spårning för prestandamätning i t.ex. Aspire Dashboard eller Jaeger/Grafana
using var activity = myActivitySource.StartActivity("ProcessPayment");

```

Och när de behöver skriva en formell säkerhetslogg:

```csharp
_logger.LogAudit("RefundIssued", currentUserId, new { Amount = 500, OrderId = orderId });

```

---

## Källor och referenser för vidare läsning

För att fördjupa dig i tekniken och hålla dig uppdaterad med de senaste standarderna rekommenderas följande officiella dokumentation:

* **Microsoft Learn - .NET Observability:** [Officiell guide till loggning, metrics och traces i moderna .NET-applikationer](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/observability-with-otel).
* **.NET Aspire Telemetry:** [Hur .NET Aspire hanterar OpenTelemetry och sätter upp dashboards per automatik](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/telemetry).
* **OpenTelemetry Standard:** [Den officiella specifikationen för OTLP (OpenTelemetry Protocol)](https://opentelemetry.io/docs/specs/otlp/).
* **Serilog OpenTelemetry Sink:** [Dokumentation för hur Serilog strömmar strukturerad data direkt till en OTel-mottagare](https://github.com/serilog/serilog-sinks-opentelemetry).
