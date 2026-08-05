---
layout: post
title: 'Guide för härdning av .NET 10-applikationer: Från HTTP-headers till HMAC och Passkeys'
date: 2026-08-04 21:55 +0200
category: "programmering,csharp,dotnet,säkerhet"
---

Säkerhet i moderna webbapplikationer handlar sällan om en enskild "silverkula". Det handlar om **Defense in Depth** – att bygga överlappande säkerhetsskikt så att om ett lagers skydd brister, står nästa redo att stoppa angriparen.

I och med releasen av **.NET 10** har Microsoft introducerat flera nya funktioner för autentisering, prestanda och telemetri som gör det enklare än någonsin att bygga extremt säkra applikationer – om man konfigurerar dem rätt.

I denna guide går vi igenom hur du härdar (*hardens*) din **Blazor-, MVC- eller Web API-applikation i .NET 10** från grunden till avancerad nivå.

<!--more-->
---

## 1. Nätverk & Säkerhetsheaders (CSP med Dynamisk Nonce)

Standardmallarna i ASP.NET Core levereras med en säker grund, men de saknar HTTP-headers för att förhindra klickkapning (*Clickjacking*), Cross-Site Scripting (XSS) och MIME-sniffning.

### Dynamisk CSP med Nonce och `MapStaticAssets()`

I .NET 10 ersätts den gamla `UseStaticFiles()` med `MapStaticAssets()`, vilket genererar unika fingeravtryck (hashes) för statiska skript och stilmallar vid kompilering. Detta gör att du i din CSP kan börja använda **SRI (Subresource Integrity)** eller **skripthashing** i stället för att tillåta broad `'self'` eller `'unsafe-inline'`. Webbläsaren exekverar då enbart skript vars SHA-256-hash matchar exakt vad servern har byggt och kan använda **Nonces** och **`'strict-dynamic'`**.

Själva **Content Security Policy (CSP)** är en öppna W3C-standard för webbläsare, vilket innebär att direktiven (`default-src`, `connect-src` etc.) inte ägs eller ändras av Microsoft.

Vad som däremot förändras i **.NET 10 och .NET 11** är hur **ASP.NET Core och Blazor samverkar med CSP**. Ramverket gör det enklare att bygga *striktare* policies utan att behöva ta till osäkra undantag.

---

## 2. Inbyggt Nonce-stöd i ASP.NET Core

Förr var man tvungen att skriva egna middleware eller använda tredjepartsbibliotek för att generera en unik *kryptografisk token* (nonce) per request och skicka med i både CSP-headern och på alla `<script nonce="...">`-taggar.

I .NET 10 och framåt finns förbättrad inbyggd hantering för **Nonces** och **CSP Level 3**-konceptet `'strict-dynamic'`:

```csharp
// Exempel på modern Nonce-generering i .NET 10/11 middleware
app.Use(async (context, next) =>
{
    // Generera en unik nonce per HTTP-begäran
    var nonce = Convert.ToBase64String(RandomNumberGenerator.GetBytes(16));
    context.Items["CSP-Nonce"] = nonce;

    // 'strict-dynamic' gör att skript som laddas av ett betrott nonce-skript automatiskt godkänns
    var csp = $"default-src 'self'; script-src 'nonce-{nonce}' 'strict-dynamic'; style-src 'self' 'nonce-{nonce}'; connect-src 'self' ws: wss:";

    context.Response.Headers.Append("Content-Security-Policy", csp);
    await next();
});

```

---

## 3. WebAssembly utan `'unsafe-eval'` (Blazor WASM)

I äldre Blazor WebAssembly-versioner behövdes ibland `'unsafe-eval'` eller `'wasm-unsafe-eval'` för att .NET-runtimet skulle kunna JIT-kompilera IL-kod i webbläsaren.

* **Trenden i .NET 10 / .NET 11:** Tack vare ständig utveckling av **Native AOT för WebAssembly** och förbättrad IL-interpreter i .NET kan du i större utsträckning köra helt AOT-kompilerade Blazor WASM-appar.
* **Säkerhetsvinst:** Du kan i vissa fall helt plocka bort `'wasm-unsafe-eval'` från din CSP om appen är helt AOT-kompilerad, vilket låser ned klientmiljön maximalt.

---

## 4. Trusted Types (CSP Level 3 i Blazor)

En av de största säkerhetsriskerna i encidiga applikationer (SPA) är DOM-baserad XSS när ramverket skriver strängar direkt till DOM:en (t.ex. via `element.innerHTML`).

I .NET 10/11 har Blazors interna rendering anpassats för att stödja webbläsarens **Trusted Types**:

* Genom att lägga till `require-trusted-types-for 'script';` i din CSP tvingas webbläsaren att stoppa alla obetrodda tilldelningar till farliga DOM-egenskaper.
* Blazor hanterar skapandet av godkända "policy-objekt" internt så att appen inte kraschar.

---

### Sammanfattande checklista för .NET 10 / 11

| Åtgärd | Gamla sättet (.NET 6–8) | Nya sättet (.NET 10–11) |
| --- | --- | --- |
| **Inline-skript/stilar** | Använde ofta `'unsafe-inline'` | Använd **Nonces** eller **Skripthashar** via `MapStaticAssets()`. |
| **WebAssembly-exekvering** | Krävde alltid `'wasm-unsafe-eval'` | Sträva mot **Full AOT** för att eventuellt helt ta bort detta direktiv. |
| **Dynamisk skriptladdning** | Långa listor av tillåtna domäner i `script-src` | Använd `'strict-dynamic'` tillsammans med en Nonce. |
| **DOM XSS-skydd** | Enbart sanitering i koden | Komplettera CSP med `require-trusted-types-for 'script'`. |


### Förklaring av Blazor-specifika CSP-direktiv

| Direktiv | Värde | Varför det krävdes i Blazor .NET 8 |
| --- | --- | --- |
| `connect-src` | `'self' ws: wss:` | SignalR upprättar en WebSocket-anslutning mellan klienten och servern. Utan `ws:` och `wss:` misslyckas anslutningen och Blazor Server slutar fungera. |
| `base-uri` | `'self'` | Blazors router förlitar sig på `<base href="/" />` i `App.razor`. Utan detta direktiv kan en angripare försöka injecta en extern base-tagg och omdirigera appens resurser. |
| `form-action` | `'self'` | I .NET 8 introducerades Static SSR och *Enhanced Forms*. Om användaren skickar in ett formulär måste `form-action` tillåta mål-URL:en. |
| `script-src` | `'self' 'wasm-unsafe-eval'` | `.NET 8 WebAssembly` nyttjar WebAssembly-kompilerad kod i webbläsaren. `'wasm-unsafe-eval'` tillåter WASM-exekvering utan att öppna upp för vanlig osäker JavaScript-`eval()`. |
| `style-src` | `'self' 'unsafe-inline'` | Blazor använder ofta komponentspecifika inline-styles och dynamisk stilhantering vid rendering. |

---

🔗 **Referenser:**

* [Microsoft Learn: Enforce HTTPS and SSL in ASP.NET Core](https://learn.microsoft.com/aspnet/core/security/enforcing-ssl)
* [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
* [Microsoft Learn: Static files in ASP.NET Core (MapStaticAssets)](https://learn.microsoft.com/aspnet/core/fundamentals/static-files)

---

## 5. Autentisering & Identitet: Passkeys i .NET 10

Att använda lösenord är en av de största riskfaktorerna för nätfiske (*phishing*) och dataläckor. .NET 10 har inbyggt stöd för **Passkeys (WebAuthn / FIDO2)** direkt i ASP.NET Core Identity.

### Fördelar med Passkeys:

* **Nätfiskesäkert:** Legitimeringen är bundet till domännamnet; webbläsaren vägrar skicka nyckeln till en falsk domän.
* **Inga lösenord på avvägar:** Inga hashade lösenord lagras i din databas som kan stjälas vid en läcka.

### Global Auktoriseringspolicy

Sätt en "Deny by Default"-policy i hela applikationen så att alla nya endpoints automatiskt kräver inloggning om de inte explicit märkts med `[AllowAnonymous]`.

```csharp
builder.Services.AddAuthorizationBuilder()
    .SetFallbackPolicy(new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build());

```

För Blazor WebAssembly rekommenderas starkt **BFF-mönstret (Backend For Frontend)** där inga tokens lagras i webbläsarens `LocalStorage`, utan hanteras via krypterade `HttpOnly`, `SameSite=Strict` cookies på servern.

🔗 **Referenser:**

* [Microsoft Learn: ASP.NET Core Identity Overview](https://learn.microsoft.com/aspnet/core/security/authentication/identity)
* [FIDO Alliance: Passkeys Overview](https://fidoalliance.org/passkeys/)

---

## 6. Web API: Skydd mot Replay-attacker (HMAC + Nonce)

För känsliga API:er (t.ex. finansiella transaktioner eller integrationer mellan system) räcker det inte alltid med standard-JWT. En angripare kan fånga upp ett giltigt datapaket och skicka det igen (*Replay Attack*).

Det ultimata skyddet bygger på tre steg:

1. **Tidsstämpel (Timestamp):** Anropet måste ligga inom ±5 minuter från serverns klocka.
2. **Nonce-cache:** Varje anrop har en unik slumptag. Om samma Nonce dyker upp igen inom 5 minuter spärras anropet direkt i minnes- eller Redis-cachen.
3. **HMAC-SHA256 Signatur:** En kryptografisk hash beräknas över alla parametrar + body och verifieras i **konstant tid** för att förhindra timingsattacker.

```
[Inkommande Anrop]
        │
        ▼
1. Tidsstämpel inom ±5 min? ───────────No──► [401 Reject & Log Warning]
        │ Yes
        ▼
2. Finns Nonce i Cache? ────────────────Yes──► [401 Reject & Log CRITICAL (Replay Attack!)]
        │ No (Spara Nonce i cache)
        ▼
3. Stämmer HMAC-signaturen? ────────────No──► [401 Reject & Log Error]
        │ Yes
        ▼
[Exekvera API Endpoint]

```

### Implementera Högpresterande Säkerhetsloggning i .NET 10

I .NET 10 använder vi partial-metoder och `[LoggerMessage]` för zero-allocation loggning vid attacker:

```csharp
public static partial class SecurityLogExtensions
{
    [LoggerMessage(EventId = 4004, Level = LogLevel.Critical, 
        Message = "REPLAY ATTACK UTPÅCKT! Nonce redan använd. ClientId: {ClientId}, Nonce: {Nonce}, IP: {RemoteIp}")]
    public static partial void LogReplayAttack(this ILogger logger, string clientId, string nonce, string remoteIp);
}

```

Vid jämförelse av HMAC-signaturer ska du alltid använda `CryptographicOperations.FixedTimeEquals()` istället för vanliga strängjämförelser (`==`) för att eliminera mikrosekundsskillnader som angripare kan mäta.

🔗 **Referenser:**

* [OWASP API Security Top 10](https://owasp.org/API-Security/)
* [Microsoft Learn: CryptographicOperations.FixedTimeEquals Method](https://www.google.com/search?q=https://learn.microsoft.com/dotnet/api/system.security.cryptography.cryptographicoperations.fixedtimeequals)
* [Microsoft Learn: High-performance logging in .NET](https://www.google.com/search?q=https://learn.microsoft.com/dotnet/core/diagnostics/high-performance-logging)

---

## 7. Infrastruktur & Container-härdning

Säkerheten i koden spelar ingen roll om exekveringsmiljön är vidöppen.

### Kör som "Non-Root" i Docker

.NET 10-containers bör alltid köras som opriviligierade användare. Om en angripare lyckas exekvera kod via en sårbarhet får de inte root-rättigheter på värdservern.

```dockerfile
# Använd den inbyggda opriviligierade användaren i .NET-containers
USER $APP_UID

```

### Kestrel-begränsningar för DoS-skydd

Begränsa hur mycket resurser en enskild klient kan förbruka för att förhindra *Slowloris*- och minnesöverbelastningsattacker:

```csharp
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 10 * 1024 * 1024; // Exempel: Max 10 MB
    options.Limits.RequestHeadersTimeout = TimeSpan.FromSeconds(15);
    options.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(2);
});

```

### Native AOT (Ahead-Of-Time)

I .NET 10 har stödet för Native AOT i Web API:er mognat avsevärt. Genom att kompilera koden direkt till maskinkod tas JIT-kompileraren bort från körtidsmiljön. Det minskar minnesanvändningen, snabbar upp starten och minskar attackytan då koden blir svår att analysera genom reverse engineering.

🔗 **Referenser:**

* [Microsoft Learn: Secure .NET Docker images (Non-root user)](https://www.google.com/search?q=https://learn.microsoft.com/dotnet/core/docker/introduction%23non-root-user)
* [Microsoft Learn: ASP.NET Core Native AOT Deployment](https://learn.microsoft.com/aspnet/core/fundamentals/native-aot)

---

## 8. Supply Chain Security & Datamaskering (PII)

### NuGet Audit i Byggpipelinen

Aktivera automatisk granskning av beroenden direkt i din projektfil (`.csproj`) eller i en central `Directory.Build.props`:

```xml
<PropertyGroup>
  <NuGetAudit>true</NuGetAudit>
  <NuGetAuditMode>all</NuGetAuditMode>
  <NuGetAuditLevel>high</NuGetAuditLevel>
</PropertyGroup>

```

Detta gör att bygget misslyckas direkt om någon inkluderar ett NuGet-paket med kända säkerhetshål.

### Maskera känsliga data i loggar (PII Redaction)

Använd paketet `Microsoft.Extensions.Compliance.Redaction` för att förhindra att personnummer, kreditkort eller lösenord av misstag skrivs ut i dina loggar.

```csharp
builder.Services.AddLogging(logging =>
{
    logging.EnableRedaction();
});

```

🔗 **Referenser:**

* [Microsoft Learn: Auditing package dependencies for security vulnerabilities](https://learn.microsoft.com/nuget/concepts/auditing-packages)
* [Microsoft Learn: Telemetry data redaction in .NET](https://www.google.com/search?q=https://learn.microsoft.com/dotnet/core/diagnostics/telemetry-data-redaction)

---

## 9. Komplett kodexempel: HMAC + Nonce + Timestamp i .NET 10

Här är ett komplett, produktionstryggt kodexempel i **.NET 10** för ditt valideringsflöde.

Exemplet använder moderna C#-funktioner som **Primary Constructors** och **Strukturerad Högprestandaloggning (`[LoggerMessage]`)**. Det innebär att loggningen genereras vid kompilering utan onödiga minnesallokeringar (zero-allocation), samtidigt som alla felkällor och eventuella säkerhetsattacker får egna unika **EventID:n** i applikationsloggen.

---

### 9.1. Högpresterande Logg-definitioner (`HmacLogMessages.cs`)

Genom att använda `[LoggerMessage]` skapar .NET 10 en optimerad loggare som inkluderar IP-adress, klient-ID, sökväg och nonces som strukturerade sökbara fält (idealiskt för Application Insights, Datadog eller Elasticsearch/OpenSearch).

```csharp
using Microsoft.Extensions.Logging;

namespace MyApi.Security;

public static partial class HmacLogMessages
{
    [LoggerMessage(EventId = 4001, Level = LogLevel.Warning, 
        Message = "HMAC-validering misslyckades: Obligatoriska headers saknas. IP: {RemoteIp}, Path: {Path}")]
    public static partial void LogMissingHeaders(this ILogger logger, string remoteIp, string path);

    [LoggerMessage(EventId = 4002, Level = LogLevel.Warning, 
        Message = "HMAC-validering misslyckades [Steg 1]: Ogiltigt format på tidsstämpel '{Timestamp}'. ClientId: {ClientId}, IP: {RemoteIp}")]
    public static partial void LogInvalidTimestampFormat(this ILogger logger, string timestamp, string clientId, string remoteIp);

    [LoggerMessage(EventId = 4003, Level = LogLevel.Warning, 
        Message = "HMAC-validering misslyckades [Steg 1]: Tidsstämpel utanför godkänt fönster (Time Skew). ClientId: {ClientId}, Tidsdiff: {TimeDiffSeconds}s, IP: {RemoteIp}")]
    public static partial void LogTimeSkewExceeded(this ILogger logger, string clientId, double timeDiffSeconds, string remoteIp);

    [LoggerMessage(EventId = 4004, Level = LogLevel.Critical, 
        Message = "SÄKERHETSVARNING [Steg 2]: Återuppspelningsattack upptäckt (Replay Attack)! Nonce redan använd. ClientId: {ClientId}, Nonce: {Nonce}, IP: {RemoteIp}, Path: {Path}")]
    public static partial void LogReplayAttackDetected(this ILogger logger, string clientId, string nonce, string remoteIp, string path);

    [LoggerMessage(EventId = 4005, Level = LogLevel.Warning, 
        Message = "HMAC-validering misslyckades: Okänd ClientId '{ClientId}'. IP: {RemoteIp}")]
    public static partial void LogUnknownClient(this ILogger logger, string clientId, string remoteIp);

    [LoggerMessage(EventId = 4006, Level = LogLevel.Error, 
        Message = "SÄKERHETSVARNING [Steg 3]: Ogiltig HMAC-signatur (Data ändrad eller fel nyckel). ClientId: {ClientId}, IP: {RemoteIp}, Path: {Path}")]
    public static partial void LogInvalidSignature(this ILogger logger, string clientId, string remoteIp, string path);

    [LoggerMessage(EventId = 4007, Level = LogLevel.Information, 
        Message = "HMAC-validering godkänd. ClientId: {ClientId}, Nonce: {Nonce}")]
    public static partial void LogValidationSuccess(this ILogger logger, string clientId, string nonce);
}

```

---

### 9.2. Tjänst för Klientnycklar (`IClientSecretProvider.cs`)

En enkel abstraktion för att slå upp hemliga nycklar (i produktion hämtas dessa från Azure Key Vault, databas eller konfiguration).

```csharp
namespace MyApi.Security;

public interface IClientSecretProvider
{
    Task<string?> GetSecretAsync(string clientId);
}

public class InMemoryClientSecretProvider : IClientSecretProvider
{
    private readonly Dictionary<string, string> _secrets = new()
    {
        { "partner_app_a", "KryptografiskHemligNyckelDeladMedKlienten123!" }
    };

    public Task<string?> GetSecretAsync(string clientId)
    {
        _secrets.TryGetValue(clientId, out var secret);
        return Task.FromResult(secret);
    }
}

```

---

### 9.3. Huvudkomponent: `HmacValidationMiddleware.cs`

Detta middleware exekverar ditt tre-stegs valideringsflöde exakt enligt schemat.

```csharp
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace MyApi.Security;

public class HmacValidationMiddleware(
    RequestDelegate next,
    ILogger<HmacValidationMiddleware> logger,
    IMemoryCache cache,
    IClientSecretProvider secretProvider)
{
    private static readonly TimeSpan MaxTimeSkew = TimeSpan.FromMinutes(5);

    public async Task InvokeAsync(HttpContext context)
    {
        var remoteIp = context.Connection.RemoteIpAddress?.ToString() ?? "OKÄND";
        var path = context.Request.Path.Value ?? "";

        // ---------------------------------------------------------------------
        // PRE-CHECK: Läs ut nödvändiga headers
        // ---------------------------------------------------------------------
        if (!context.Request.Headers.TryGetValue("X-Client-Id", out var clientIdHeader) ||
            !context.Request.Headers.TryGetValue("X-Timestamp", out var timestampHeader) ||
            !context.Request.Headers.TryGetValue("X-Nonce", out var nonceHeader) ||
            !context.Request.Headers.TryGetValue("X-Signature", out var signatureHeader))
        {
            logger.LogMissingHeaders(remoteIp, path);
            await RejectAsync(context, "Obligatoriska säkerhets-headers saknas.");
            return;
        }

        string clientId = clientIdHeader.ToString();
        string nonce = nonceHeader.ToString();
        string rawTimestamp = timestampHeader.ToString();
        string providedSignature = signatureHeader.ToString();

        // ---------------------------------------------------------------------
        // STEG 1: Är Tidsstämpeln inom godkänt intervall? (±5 min)
        // ---------------------------------------------------------------------
        if (!long.TryParse(rawTimestamp, out var unixTimestamp))
        {
            logger.LogInvalidTimestampFormat(rawTimestamp, clientId, remoteIp);
            await RejectAsync(context, "Ogiltigt format på X-Timestamp (förväntar unix epoch sekunder).");
            return;
        }

        var requestTime = DateTimeOffset.FromUnixTimeSeconds(unixTimestamp);
        var timeDifference = DateTimeOffset.UtcNow - requestTime;

        if (Math.Abs(timeDifference.TotalSeconds) > MaxTimeSkew.TotalSeconds)
        {
            logger.LogTimeSkewExceeded(clientId, timeDifference.TotalSeconds, remoteIp);
            await RejectAsync(context, $"Tidsstämpel utanför tillåtet fönster (±{MaxTimeSkew.TotalMinutes} minuter).");
            return;
        }

        // ---------------------------------------------------------------------
        // STEG 2: Finns (Client-Id + Nonce) i Cachen? (Skydd mot Replay Attack)
        // ---------------------------------------------------------------------
        var cacheKey = $"hmac_nonce:{clientId}:{nonce}";
        
        if (cache.TryGetValue(cacheKey, out _))
        {
            // CRITICAL LOG: Någon försöker spela upp ett tidigare anrop igen!
            logger.LogReplayAttackDetected(clientId, nonce, remoteIp, path);
            await RejectAsync(context, "Återuppspelningsattack upptäckt. Denna Nonce har redan använts.");
            return;
        }

        // ---------------------------------------------------------------------
        // STEG 3: Stämmer HMAC-signaturen?
        // ---------------------------------------------------------------------
        var secretKey = await secretProvider.GetSecretAsync(clientId);
        if (string.IsNullOrEmpty(secretKey))
        {
            logger.LogUnknownClient(clientId, remoteIp);
            await RejectAsync(context, "Ogiltig klient-identifierare.");
            return;
        }

        // Läs in request body och beräkna SHA256-hash
        string bodyHash = await ComputeBodyHashAsync(context.Request);

        // Bygg upp signaturunderlaget (Canonical String)
        var httpMethod = context.Request.Method.ToUpperInvariant();
        var rawDataToSign = $"{httpMethod}\n{path}\n{unixTimestamp}\n{nonce}\n{bodyHash}";

        // Beräkna HMAC-SHA256
        string expectedSignature = ComputeHmacSha256(rawDataToSign, secretKey);

        // Jämför signaturer i KONSTANT TID för att förhindra Timing Attacks
        byte[] providedBytes = Encoding.UTF8.GetBytes(providedSignature);
        byte[] expectedBytes = Encoding.UTF8.GetBytes(expectedSignature);

        if (!CryptographicOperations.FixedTimeEquals(providedBytes, expectedBytes))
        {
            // SECURITY ERROR: Signaturen stämmer inte (innehållet kan ha ändrats i transit)
            logger.LogInvalidSignature(clientId, remoteIp, path);
            await RejectAsync(context, "Ogiltig HMAC-signatur.");
            return;
        }

        // ---------------------------------------------------------------------
        // ALLA STEG GODKÄNDA: Spara Nonce i cachen med TTL = 5 min
        // ---------------------------------------------------------------------
        cache.Set(cacheKey, true, MaxTimeSkew);

        logger.LogValidationSuccess(clientId, nonce);

        // Fortsätt till API-endpointen
        await next(context);
    }

    /// <summary>
    /// Hjälpmetod för att läsa body utan att förstöra strömmen för downstream controllers.
    /// </summary>
    private static async Task<string> ComputeBodyHashAsync(HttpRequest request)
    {
        if (request.ContentLength is null or 0)
        {
            return string.Empty;
        }

        request.EnableBuffering();
        using var sha256 = SHA256.Create();
        var hashBytes = await sha256.ComputeHashAsync(request.Body);
        
        // Återställ strömmens position så att Controller/API-endpoint kan läsa den
        request.Body.Position = 0;
        
        return Convert.ToHexString(hashBytes).ToLowerInvariant();
    }

    private static string ComputeHmacSha256(string data, string secret)
    {
        var keyBytes = Encoding.UTF8.GetBytes(secret);
        var dataBytes = Encoding.UTF8.GetBytes(data);

        using var hmac = new HMACSHA256(keyBytes);
        var hash = hmac.ComputeHash(dataBytes);
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    /// <summary>
    /// Skickar ett strukturerat 401 Unauthorized ProblemDetails-svar.
    /// </summary>
    private static async Task RejectAsync(HttpContext context, string detail)
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        context.Response.ContentType = "application/problem+json";

        var problemDetails = new ProblemDetails
        {
            Status = StatusCodes.Status401Unauthorized,
            Title = "HMAC Autentisering Misslyckades",
            Detail = detail,
            Instance = context.Request.Path
        };

        await context.Response.WriteAsJsonAsync(problemDetails);
    }
}

```

---

### 9.4. Registrering i `Program.cs`

För att aktivera skyddet på dina API-rutter registrerar du tjänsterna och lägger till middlewaret i pipelinen.

```csharp
using MyApi.Security;

var builder = WebApplication.CreateBuilder(args);

// 1. Registrera beroenden
builder.Services.AddControllers();
builder.Services.AddMemoryCache(); // Minnescache för Nonce-lagring
builder.Services.AddSingleton<IClientSecretProvider, InMemoryClientSecretProvider>();

var app = builder.Build();

app.UseHttpsRedirection();

// 2. Koppla Middleware enbart till API-rutter (t.ex. alla anrop under /api)
app.UseWhen(context => context.Request.Path.StartsWithSegments("/api"), appBuilder =>
{
    appBuilder.UseMiddleware<HmacValidationMiddleware>();
});

app.MapControllers();

app.Run();

```

---

### 9.5. Vad som gör detta upplägg extra bra i produktion:

1. **`[LoggerMessage]` (Zero-Allocation Logging):** Istället för traditionell `logger.LogWarning($"Fel...")` som skapar strängallokeringar i minnet vid varje anrop, genererar source-generatorn högpresterande loggkod i .NET 10.
2. **Kritiska Logg-EventIDs (4004 & 4006):** Replay-attacker och ogiltiga signaturer har klassats som `Critical` respektive `Error` med unika id-nummer (4004 och 4006). Du kan enkelt sätta larm i Azure Monitor / Datadog som triggas om dessa dyker upp.
3. **`CryptographicOperations.FixedTimeEquals`:** Skyddar mot sidokanalsattacker (*Timing Attacks*), där angripare mäter svarstiden i mikrosekunder för att gissa signaturen tecken för tecken.
4. **`EnableBuffering()` + `Position = 0`:** Gör att HTTP-bodyn kan läsas av för HMAC-hashen utan att förstöra strömmen för controller-lagret.

---

## 10. Sammanfattning: Checklista för .NET 10 Hardening

| Område | Åtgärd | Status |
| --- | --- | --- |
| **Headers** | Konfigurera CSP med dynamisk Nonce, HSTS och X-Frame-Options | 🔳 |
| **Auth** | Implementera Passkeys och sätt fallback-policy (`RequireAuthenticatedUser`) | 🔳 |
| **API** | Bygg skydd mot Replay-attacker med HMAC, Timestamp och Nonce-cache | 🔳 |
| **Infrastruktur** | Kör containers som `USER $APP_UID` och sätt strikta Kestrel-gränser | 🔳 |
| **Loggning** | Använd `[LoggerMessage]` med EventIDs samt datamaskering (Redaction) | 🔳 |
| **Beroenden** | Aktivera `<NuGetAudit>true</NuGetAudit>` i projektet | 🔳 |

Genom att kombinera dessa skikt skapar du en **.NET 10-applikation med absolut toppklassad säkerhet** som står emot såväl automatiserade bot-attacker som riktade intrångsförsök.