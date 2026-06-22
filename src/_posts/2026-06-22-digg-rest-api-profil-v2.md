---
layout: post
title: 'DIGG:s nya REST API-profil (v2.0.0): Så bygger du moderna, spårbara och robusta API:er i .NET 10'
date: 2026-06-22 22:24 +0200
category: "webbutveckling,wcag,css,programmering"
---

Offentlig sektor i Sverige digitaliseras i en rasande takt, och i navet av denna utveckling hittar vi Myndigheten för digital förvaltning (DIGG). Med lanseringen av [**REST API-profil version 2.0.0**](https://www.dataportal.se/rest-api-profil/om-rest-api-profilen) (nu den 16 juni 2026) har ribban höjts. Fokus har flyttats från isolerade system till hur API:er samverkar i stora, distribuerade kedjor över organisationsgränser.

För oss som bygger system i .NET-ekosystemet är tajmingen perfekt. Med **.NET 10** har vi inbyggda, kraftfulla verktyg för att möta dessa nya, strikta krav. Här går vi igenom de största nyheterna i v2.0.0 (och uppstramningarna från 1.2.0) och tittar på hur du implementerar dem rent praktiskt i C#.

<!--more-->
---

## 1. Den stora nyheten: Spårbarhet över systemgränser

När system kopplas samman i långa kedjor (Klient -> Portal -> Gateway -> Tjänst -> Register) blir felsökning en mardröm om man saknar en röd tråd. Version 2.0.0 introducerar ett helt nytt kapitel med skarpa krav på [**spårbarhet och korrelation**](https://www.dataportal.se/rest-api-profil/sparbarhet-och-korrelation).

DIGG förordar starkt industristandarden **W3C Trace Context** (`traceparent`-headern), med traditionella `X-Correlation-ID` som godkänd fallback. Detta måste propagera genom *hela* din anropskedja.

### Implementering i .NET 10 med OpenTelemetry

I .NET 10 är distribuerad spårning förstklassiga medborgare. Vi behöver inte bygga egna komplexa ramverk, utan vi kopplar in OpenTelemetry och skapar en anpassad middleware för att säkerställa att vi även stödjer X-Correlation-ID för äldre konsumenter.

**I `Program.cs`:**

```csharp
using OpenTelemetry.Trace;
using OpenTelemetry.Resources;

var builder = WebApplication.CreateBuilder(args);

// Aktivera W3C-spårning och skicka vidare i utgående HTTP-anrop automatiskt
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing
        .SetResourceBuilder(ResourceBuilder.CreateDefault().AddService("MyndighetsAPI-Kunder"))
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation());

builder.Services.AddControllers();
var app = builder.Build();

// Registrera vår Digg-middleware (se nedan)
app.UseMiddleware<DiggTraceabilityMiddleware>();
app.MapControllers();
app.Run();

```

**En anpassad Middleware (`DiggTraceabilityMiddleware.cs`):**
Denna ser till att ID:t loggas strukturerat och alltid returneras till klienten.

```csharp
public class DiggTraceabilityMiddleware
{
    private readonly RequestDelegate _next;

    public DiggTraceabilityMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context, ILogger<DiggTraceabilityMiddleware> logger)
    {
        var correlationId = context.Request.Headers["X-Correlation-ID"].FirstOrDefault()
                            ?? System.Diagnostics.Activity.Current?.TraceId.ToString()
                            ?? Guid.NewGuid().ToString();

        // Lägg till i logg-scopet så det indexeras i Elastic/Seq
        using (logger.BeginScope(new Dictionary<string, object> { ["CorrelationId"] = correlationId }))
        {
            context.Response.OnStarting(() =>
            {
                context.Response.Headers.TryAdd("X-Correlation-ID", correlationId);
                return Task.CompletedTask;
            });

            await _next(context);
        }
    }
}

```

---

## 2. Standardiserad Felhantering: Välkommen RFC 9457

Tiden då varje API hade sitt eget unika felformat är förbi. Digg kräver nu att fel returneras enligt **RFC 9457** (som ersätter den äldre RFC 7807), med Content-Type `application/problem+json`.

### Implementering i C#

ASP.NET Core har inbyggt stöd via `ProblemDetails`. Om du behöver hantera valideringsfel och möta profilen perfekt (som vill ha en specifik array för ogiltiga parametrar), gör du så här:

```csharp
[ApiController]
[Route("v{version:apiVersion}/[controller]")]
public class AnsokningarController : ControllerBase
{
    [HttpPost]
    public IActionResult SkapaAnsokan([FromBody] AnsokanDto request)
    {
        if (request.Personnummer.Length != 12)
        {
            var problem = new ProblemDetails
            {
                Type = "https://api.dataportal.se/errors/valideringsfel",
                Title = "Felaktigt indata i förfrågan",
                Status = StatusCodes.Status400BadRequest,
                Detail = "Fältet 'personnummer' har felaktigt format.",
                Instance = HttpContext.Request.Path
            };

            // DIGG-specifikt tillägg för valideringsfel
            problem.Extensions.Add("invalid-params", new[]
            {
                new { name = "personnummer", reason = "Måste bestå av 12 siffror" }
            });

            return BadRequest(problem);
        }
        return Ok();
    }
}

```

---

## 3. Ordning och reda: Namngivning och "Samlingar"

I profilens senaste uppdateringar har url-strukturer stramats åt avsevärt för att tvinga fram förutsägbarhet:

1. **Samlingar är alltid plural:** Det heter `/kunder`, inte `/kund`.
2. **Strikt Kebab-case:** Flerordsresurser måste separeras med bindestreck, t.ex. `/beviljade-ansokningar`. Inget `camelCase` eller `snake_case` i URL:er.
3. **Endast Major-version i URL:en:** Semantisk versionering gäller. Minor/Patch (som är bakåtkompatibla) ska *inte* ändra URL:en.

I .NET hanterar vi enklast detta med paketet `Asp.Versioning.Mvc`:

```csharp
// Accepteras av profilen (GET /v2/kunder/123/bestallningar)
[ApiVersion("2.0")]
[Route("v{version:apiVersion}/kunder")]
public class KunderController : ControllerBase
{
    [HttpGet("{id}/bestallningar")]
    public IActionResult GetBestallningar(int id) { ... }
}

```

---

## 4. UUIDv7: En räddare i nöden för dina databaser

En detalj i profilen som kan verka liten, men som har enorm arkitektonisk påverkan, är uppdateringen av IETF-standarder. Standarden för unika identifierare pekar nu på **RFC 9562**.

Detta innebär att vi officiellt uppmuntras att sluta använda `UUIDv4` (helt slumpmässiga GUIDs) och istället använda **UUIDv7**.

**Varför är detta viktigt?**
Slumpmässiga GUIDs skapar massiv indexfragmentering i relationsdatabaser (som SQL Server). UUIDv7 kombinerar en tidsstämpel i början med slumpmässighet på slutet. De är sekventiella, vilket gör att databasen kan sortera dem effektivt, samtidigt som de förblir globalt unika och säkra att exponera externt. I .NET 10 och nyare Entity Framework-versioner finns det fantastiskt stöd för att generera dessa direkt.

---

## 5. Goodbye XML, Hello JSON

Profilen förordar nu starkt `application/json` (med UTF-8 som självklar standard). Stödet för XML har degraderats till ett valfritt KAN-krav. För att säkerställa att ditt .NET-API inte av misstag returnerar något annat, och för att tvinga fram `camelCase` enligt profilens rekommendation, lägger du till detta i din konfiguration:

```csharp
builder.Services.AddControllers(options =>
{
    // Returnera 406 Not Acceptable om klienten envisas med XML
    options.ReturnHttpNotAcceptable = true;
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

```

---

## Sammanfattning

Att följa [DIGG:s REST API-profil v2.0.0](https://www.dataportal.se/rest-api-profil/om-rest-api-profilen) handlar inte bara om regelefterlevnad – det handlar om att bygga robusta, moderna och driftbara system. Genom att integrera distribuerad spårning från dag ett, använda RFC-standardiserad felhantering och låta UUIDv7 rädda dina databasindex, bygger du API:er som kommer att stå emot tidens tand.

*Tips! När ditt API är klart, glöm inte att köra din OpenAPI-specifikation genom DIGG:s valideringstjänst (RAP-LP) för att dubbelkolla att du uppfyller alla SKALL-krav.*

🔗 [raplp.digg.se](https://raplp.digg.se/), `RAP-LP` (står för: `REST API-profil Lint Processor`)


---

## Källor och Vidare Läsning

### 1. DIGG & Sveriges Dataportal

Dessa är de officiella riktlinjerna från Myndigheten för digital förvaltning (DIGG) som dikterar kraven för API-utveckling inom svensk offentlig sektor.

* **Sveriges Dataportal – Om REST API-profilen:**
Huvudsidan för profilen med changelog och nyckelord.
🔗 [dataportal.se/rest-api-profil/om-rest-api-profilen](https://www.dataportal.se/sv/rest-api-profil/om-rest-api-profilen)
* **Nyheten spårbarhet och korrelation i REST API-profil version 2.0.0:**
Detaljerad beskrivning av de nya kraven på spårbarhet och korrelation, inklusive varför det är viktigt och hur det ska implementeras.
🔗 [dataportal.se/rest-api-profil/sparbarhet-och-korrelation](https://www.dataportal.se/rest-api-profil/sparbarhet-och-korrelation)
* **DIGG:s valideringsverktyg (RAP-LP):** Tjänsten för att automatiskt lint-testa OpenAPI-specifikationer mot profilens SKALL-krav.
🔗 [Sveriges Dataportal Github / RAP-LP](https://github.com/diggsweden/rest-api-profil-lint-processor)

### 2. Microsoft & .NET-dokumentation

Officiell dokumentation för hur du implementerar de underliggande koncepten i moderna .NET-applikationer (C#).

* **Distribuerad spårning (Distributed Tracing) i .NET:** Beskriver hur `System.Diagnostics.Activity` och OpenTelemetry hanterar W3C Trace Context helt integrerat i ramverket.
🔗 [learn.microsoft.com/en-us/dotnet/core/diagnostics/distributed-tracing](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/distributed-tracing)
* **Felhantering i webb-API:er (Problem Details):** Microsofts guide till hur ASP.NET Core hanterar `ProblemDetails` för att uppfylla standardiserade felmeddelanden.
🔗 [learn.microsoft.com/en-us/aspnet/core/web-api/handle-errors](https://learn.microsoft.com/en-us/aspnet/core/web-api/handle-errors)
* **API Versioning i ASP.NET Core:** Dokumentationen för `Asp.Versioning.Mvc` som hanterar hur versionering via URL ska implementeras säkert och korrekt.
🔗 [github.com/dotnet/aspnet-api-versioning](https://github.com/dotnet/aspnet-api-versioning)
* **Stöd för UUIDv7 i .NET:** Dokumentation för den inbyggda metoden `Guid.CreateVersion7()` som introducerades för att skapa databasvänliga, tidsordnade identifierare.
🔗 [learn.microsoft.com/en-us/dotnet/api/system.guid.createversion7](https://learn.microsoft.com/en-us/dotnet/api/system.guid.createversion7)

### 3. IETF och W3C Standarder (RFC:er)

De internationella standarddokumenten som Diggs REST API-profil nu stöder sig på för att framtidssäkra offentlig sektors IT-infrastruktur.

* **W3C Trace Context (Level 3):** Standarden som definierar `traceparent`-headern för distribuerad spårning.
🔗 [w3.org/TR/trace-context/](https://www.w3.org/TR/trace-context/)
* **RFC 9457 – Problem Details for HTTP APIs:** Ersättaren till RFC 7807. Definierar formatet för hur fel ska struktureras i `application/problem+json`.
🔗 [datatracker.ietf.org/doc/html/rfc9457](https://datatracker.ietf.org/doc/html/rfc9457)
* **RFC 9562 – Universally Unique IDentifiers (UUIDs):** Den nya standarden som introducerar UUIDv7 för sekventiella, tidsbaserade unika nycklar.
🔗 [datatracker.ietf.org/doc/html/rfc9562](https://datatracker.ietf.org/doc/html/rfc9562)
* **RFC 9110 – HTTP Semantics:** Det moderna, uppdaterade regelverket för HTTP-metoder (GET, POST etc.) och statuskoder.
🔗 [datatracker.ietf.org/doc/html/rfc9110](https://datatracker.ietf.org/doc/html/rfc9110)

### 4. Microsoft & OpenAPI (Specifikt för .NET 8, 9 och 10)

När det gäller OpenAPI (tidigare känt som Swagger) i .NET har det skett ett stort och viktigt skifte nyligen, vilket är högst relevant om du bygger för **.NET 9 eller .NET 10**.

Från och med .NET 9 har Microsoft fasat ut tredjepartsbiblioteket *Swashbuckle* som standard i sina mallar, och istället byggt in ett eget, fullt integrerat (och snabbare) stöd för OpenAPI direkt i ramverket via paketet `Microsoft.AspNetCore.OpenApi`.

* **Översikt av OpenAPI i ASP.NET Core:**
Den officiella ingångssidan för hur Microsoft hanterar OpenAPI numera. Beskriver skillnaderna mellan det nya inbyggda systemet och äldre lösningar.
🔗 [learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/aspnetcore-openapi](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/aspnetcore-openapi)
* **Generera OpenAPI-dokument med inbyggda .NET-verktyg:**
Denna guide visar hur du använder `Microsoft.AspNetCore.OpenApi` för att autogenerera den JSON-specifikation som DIGG:s valideringsverktyg (RAP-LP) kräver.
🔗 [learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/using-openapi-documents](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/using-openapi-documents)
* **Anpassa OpenAPI-dokumentet (Transformers):**
*Detta är den absolut viktigaste länken för din implementation!* För att uppfylla DIGG:s krav (till exempel att lägga till dokumentation för din `X-Correlation-ID`-header på alla anrop) behöver du manipulera specifikationen. Denna artikel förklarar hur du skriver "Document Transformers" och "Operation Transformers" i .NET.
🔗 [learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/customize-openapi](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/customize-openapi)
* **Swagger UI i .NET (Scalar och tredjepart):**
Eftersom .NET numera bara genererar själva *datan* (JSON-filen) i sin inbyggda lösning, behöver man ett gränssnitt för att utforska det visuellt. Microsoft rekommenderar nu ofta verktyget **Scalar** istället för det traditionella Swagger UI. Här dokumenteras hur man lägger till det gränssnittet.
🔗 [learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/aspnetcore-openapi#generate-openapi-documents-at-build-time](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/aspnetcore-openapi#generate-openapi-documents-at-build-time)

---

**Ett hett tips:** Eftersom Digg:s Lint-verktyg kräver en väldigt exakt utformad OpenAPI-specifikation, är de nya "Transformers" i .NET 10 ovärderliga. De låter dig injicera globala regler (t.ex. att `Content-Type: application/problem+json` *alltid* är standard för 400- och 500-svar) direkt i C#-koden, så att din specifikation alltid är perfekt synkad med din kod och går igenom [RAP-LP-valideringen](https://raplp.digg.se/) utan anmärkning!