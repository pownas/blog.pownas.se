---
layout: post
title: 'Att tämja felhanteringen: Så bygger du ett smart, delat felbibliotek i .NET'
date: 2026-07-27 23:55 +0200
category: "programmering,csharp,dotnet,arkitektur,felhantering"
---

I en växande mikrotjänstarkitektur eller en organisation med tiotals olika applikationer blir felhantering snabbt vilda västern. Ett team returnerar råa strängar, ett annat kastar generiska `500 Internal Server Error` för valideringsfel, och ett tredje uppfinner sitt eget slutpunktformat. När arkitekturen växer till ett 20-tal appar med hundratals unika interna felkoder blir bristen på enhetlighet en ren mardröm för både frontend-utvecklare och supporttekniker.

Lösningen är inte att tvinga alla utvecklare att skriva hundratals rader repetitiv `try-catch`-logik. Svaret är att centralisera arkitekturen i ett internt, delat NuGet-bibliotek.

Här är en ritning för hur du bygger ett enhetligt, utökbart och säkert felhanteringsbibliotek baserat på modern .NET-arkitektur.

<!--more-->
---

## Utmaningen: Varför räcker inte vanliga HTTP-koder?

HTTP-statuskoder är fantastiska för grovkornig kategorisering (t.ex. *404 Not Found* eller *400 Bad Request*). Men i komplexa affärssystem räcker de helt enkelt inte till. Om en användare inte kan slutföra en order kan det bero på:

1. Att varan är slut i lager.
2. Att användarens betalkort har löpt ut.
3. Att leveransadressen ligger utanför distributionsområdet.

Alla tre scenarier resulterar tekniskt sett i en affärsregelöverträdelse som kan mappas till `400 Bad Request` eller `409 Conflict`. Men frontend-appen behöver veta *exakt* vad som gick fel för att visa rätt gränssnitt, och supporten behöver en spårbar felkod.

Vårt delade bibliotek måste därför uppfylla tre krav:

* **Följa standarder:** Använda **RFC 7807 (Problem Details)** för API-responser.
* **Skala över domäner:** Hantera över 100+ interna felkoder utan kodkaos.
* **Vara säkert:** Skydda känslig intern information i produktionsmiljöer men underlätta felsökning under utveckling.

---

## Arkitekturen bakom biblioteket

Ett robust felhanteringsbibliotek vilar på tre tekniska pelare: **Rich Domain Errors**, en **Centraliserad felöversättare** och **Konfigurerbar säkerhet**.

### 1. Strukturera felkoder med "Smart Enums"

Att dumpa 300 felkoder i en traditionell, platt `enum` gör koden svårläst och svår att underhålla. Istället använder vi rika objekt (`records`) uppdelade i logiska domänfiler. Detta håller ihop den interna koden, den publika beskrivningen och HTTP-statuskoden på ett och samma ställe.

```csharp
// Delad bastyp i biblioteket
public record ErrorDetails(string Code, string Description, int HttpStatus);

// Uppdelat i separata filer per domän, men under samma namespace
public static class UserErrors
{
    public static readonly ErrorDetails NotFound = new("USR_001", "Användaren hittades inte.", 404);
    public static readonly ErrorDetails InvalidEmail = new("USR_002", "E-postadressen har fel format.", 400);
}

public static class OrderErrors
{
    public static readonly ErrorDetails InsufficientStock = new("ORD_105", "Lagersaldot är för lågt.", 409);
}

```

Genom att kapsla in dessa i en anpassad `BusinessException` kan domänlogiken kasta fel på ett semantiskt och tydligt sätt:

```csharp
public class BusinessException : Exception
{
    public ErrorDetails Error { get; }
    public string? InternalMessage { get; }

    public BusinessException(ErrorDetails error, string? internalMessage = null)
        : base(error.Description)
    {
        Error = error;
        InternalMessage = internalMessage;
    }
}

```

### 2. Motorn: Centraliserad hantering med `IExceptionHandler`

Från och med .NET 8 använder vi gränssnittet `IExceptionHandler` för att bygga vår globala felhanterare. Den fångar upp alla ohanterade undantag i applikationen och översätter dem till standardiserad JSON enligt RFC 7807.

Här injicerar vi de interna felkoderna och det unika spårnings-ID:t (`traceId`) direkt i `Extensions`-objektet:

```csharp
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ErrorHandlingOptions _options;
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ErrorHandlingOptions options, ILogger<GlobalExceptionHandler> logger)
    {
        _options = options;
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var traceId = httpContext.TraceIdentifier;
        var problemDetails = new ProblemDetails { Instance = httpContext.Request.Path };
        problemDetails.Extensions.Add("traceId", traceId);

        if (exception is BusinessException busEx)
        {
            problemDetails.Status = busEx.Error.HttpStatus;
            problemDetails.Title = "Business Rule Violation";
            problemDetails.Detail = busEx.Error.Description;
            problemDetails.Extensions.Add("errorCode", busEx.Error.Code);

            // Logga ALLTID fullständiga detaljer internt
            _logger.LogWarning("Fel {Code} (Trace: {TraceId}): {Internal}", busEx.Error.Code, traceId, busEx.InternalMessage);

            if (_options.ExposeInternalMessages && !string.IsNullOrEmpty(busEx.InternalMessage))
            {
                problemDetails.Extensions.Add("internalMessage", busEx.InternalMessage);
            }
        }
        else
        {
            // Oväntade systemfel (t.ex. NullReferenceException)
            problemDetails.Status = StatusCodes.Status500InternalServerError;
            problemDetails.Title = "An unexpected error occurred";
            problemDetails.Detail = "Ett internt fel uppstod. Uppge ditt Trace ID till supporten.";
            problemDetails.Extensions.Add("errorCode", "SYS_500");

            _logger.LogError(exception, "Oväntat fel uppstod (Trace: {TraceId})", traceId);

            if (_options.ExposeInternalMessages)
            {
                problemDetails.Extensions.Add("internalMessage", exception.Message);
            }
        }

        httpContext.Response.StatusCode = problemDetails.Status.Value;
        httpContext.Response.ContentType = "application/problem+json";
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }
}

```

### 3. Säkra publika API:er via Options-mönstret

Beteendet måste vara konfigurerbart. En intern mikrotjänst under utveckling ska kunna visa tekniska detaljer, medan ett publikt API som exponeras mot internet absolut inte får läcka databas-ID:n eller stackspår.

Genom att exponera en inställning via en Extension Method blir implementeringen i konsumerande appar extremt ren:

```csharp
// I det delade biblioteket
public class ErrorHandlingOptions
{
    public bool ExposeInternalMessages { get; set; } = false;
}

public static class ErrorHandlingExtensions
{
    public static IServiceCollection AddSharedErrorHandling(this IServiceCollection services, Action<ErrorHandlingOptions>? configure = null)
    {
        var options = new ErrorHandlingOptions();
        configure?.Invoke(options);

        services.AddSingleton(options);
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();
        return services;
    }
}

```

---

## Hur applikationerna konsumerar biblioteket

När arkitekturen väl är på plats blir tröskeln för att använda biblioteket i era 20+ applikationer minimal.

I ett **publikt Gateway-API** körs standardinställningen (säkert läge):

```csharp
// Program.cs
builder.Services.AddSharedErrorHandling();

var app = builder.Build();
app.UseExceptionHandler(); // Aktiverar middleware-komponenten

```

I en **intern mikrotjänst** eller under lokal utveckling kan utvecklarna slå på det bekväma felläget:

```csharp
builder.Services.AddSharedErrorHandling(options =>
{
    options.ExposeInternalMessages = builder.Environment.IsDevelopment();
});

```

---

## CI/CD-tips: Automatiserad "Living Documentation"

Ett av de största problemen med att ha 100+ unika felkoder spridda över olika domänfiler är att hålla dokumentationen uppdaterad för frontend-teamen. Eftersom alla felkoder i biblioteket är deklarerade som `public static readonly ErrorDetails` kan du lösa detta helt automatiskt.

Skriv ett enhetstest i bibliotekets CI/CD-pipeline som körs vid varje release. Testet använder **reflektion** för att skanna av biblioteket, samla in alla `ErrorDetails` och generera en snygg Markdown-tabell eller JSON-fil:

```csharp
[Fact]
public void Export_Error_Codes_To_Markdown()
{
    var errorFields = typeof(UserErrors).Assembly.GetTypes()
        .SelectMany(t => t.GetFields(BindingFlags.Public | BindingFlags.Static))
        .Where(f => f.FieldType == typeof(ErrorDetails))
        .Select(f => (ErrorDetails)f.GetValue(null)!)
        .OrderBy(e => e.Code);

    var sb = new StringBuilder();
    sb.AppendLine("| Felkod | Publik beskrivning | HTTP Status |");
    sb.AppendLine("|--------|--------------------|-------------|");
    foreach (var err in errorFields)
    {
        sb.AppendLine($"| {err.Code} | {err.Description} | {err.HttpStatus} |");
    }

    File.WriteAllText("../../../ERROR_CODES.md", sb.ToString());
}

```

Denna Markdown-fil kan sedan automatiskt pushas till ert interna utvecklarportal eller Azure DevOps Wiki vid varje ny version av NuGet-paketet. Ingen manuell dokumentation krävs.

---

## Sammanfattning av fördelarna

Genom att investera tid i ett gemensamt felhanteringsbibliotek uppnår ni flera stora fördelar:

* **Bättre utvecklarupplevelse (DX):** Utvecklare behöver inte fundera på *hur* fel ska returneras, utan kastar bara ett semantiskt undantag.
* **Färre säkerhetsrisker:** Känsliga systemdetaljer maskeras automatiskt i produktion tack vare konfigurerbar kryptering/borttagning av interna meddelanden.
* **Snabbare felsökning:** Kundtjänst och support kan matcha en klients `traceId` eller `errorCode` direkt mot loggarna för att se exakt vad som orsakade felet.

---

## Referenser och vidare läsning

* **RFC 7807 - Problem Details for HTTP APIs:** Den officiella IETF-standarden för hur felmeddelanden ska struktureras i HTTP-responser. [IETF Tools - RFC 7807](https://tools.ietf.org/html/rfc7807).
* **Felhantering i ASP.NET Core:** Microsofts officiella dokumentation kring hur du implementerar `IExceptionHandler` och använder `ProblemDetails` i moderna .NET-applikationer. [Microsoft Learn - Handle errors in ASP.NET Core web APIs](https://learn.microsoft.com/en-us/aspnet/core/web-api/handle-errors).
* **Ardalis.SmartEnum:** Ett populärt mönster och bibliotek i .NET-sfären som visar fördelarna med att använda rika klasser istället för traditionella enums. [GitHub - Ardalis.SmartEnum](https://github.com/ardalis/SmartEnum).
