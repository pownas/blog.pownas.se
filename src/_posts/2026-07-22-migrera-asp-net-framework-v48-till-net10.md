---
layout: post
title: 'Migrera din ASP.NET MVC 4.8 till .NET 10 – En komplett guide'
date: 2026-07-22 12:40 +0200
category: "programmering, csharp, dotnet, mvc, arkitektur, migrering"
---

Att migrera en ASP.NET MVC-applikation från gamla .NET Framework 4.8 till det moderna **.NET 10** är inte bara en uppgradering – det är ett generationsskifte. Du lämnar det tunga, Windows-bundna IIS-ekosystemet och kliver in i en värld av blixtsnabb prestanda, plattformsoberoende och otroligt ren kod.

Det är sällan en "sök och ersätt"-manöver. För att få ut maximalt av .NET 10 behöver du tänka om kring hur applikationen startar, hur filer hanteras och, framför allt, hur du strukturerar din kod.

Här är en guiden (med kod, arkitekturtips och referenser) för att göra resan smidig och resultatet uppdelat enligt vertikala slices.

<!--more-->
---

## 1. Farväl Global.asax – Hej Program.cs

Det gamla `.csproj`-formatet och dess XML-trassel är borta, ersatt av det minimala SDK-style-formatet. Men den största förändringen sker vid uppstarten. Hela livscykeln med `Application_Start` i `Global.asax` är skrotad. I .NET 10 sker allt i `Program.cs` via **Minimal Hosting API**.

Här registrerar du din inbyggda Dependency Injection (DI) och bygger din "middleware pipeline". Ordningen här är kritisk!

```csharp
var builder = WebApplication.CreateBuilder(args);

// 1. Registrera tjänster i DI-containern
builder.Services.AddControllersWithViews();
builder.Services.AddHttpContextAccessor(); // Ersätter gamla HttpContext.Current

var app = builder.Build();

// 2. Bygg Middleware-pipelinen (ORDNINGEN SPELAR ROLL!)
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Shared/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.MapStaticAssets(); // Nyhet i NET9! Optimerad statisk filhantering
app.UseRouting();
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

```

---

## 2. Den eleganta konfigurationen: appsettings.json och IOptions<T>

`Web.config` och ständiga typkonverteringar som `int.Parse(ConfigurationManager.AppSettings["Port"])` är ett minne blott. Modern .NET använder starkt typad konfiguration.

Du definierar dina inställningar i `appsettings.json`:

```json
{
  "SmtpSettings": {
    "Server": "smtp.example.com",
    "Port": 587,
    "EnableSsl": true
  }
}

```

Skapa sedan en motsvarande C#-klass (`SmtpSettings`). I `Program.cs` binder du ihop dem:

```csharp
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));

```

Nu kan du injicera detta var som helst – helt typsäkert! Tillsammans med moderna **Primary Constructors** (introducerat i C# 12) blir dina controllers fantastiskt rena:

```csharp
// Primary constructor eliminerar all boilerplate-kod!
public class MailController(IOptions<SmtpSettings> smtpOptions) : Controller
{
    public IActionResult Send()
    {
        var port = smtpOptions.Value.Port; // Redan en int!
        return View();
    }
}

```

---

## 3. Spöket av System.Web och HttpContext.Current

Ett av redirection-felen vid migrering är försök att använda `System.Web.HttpContext.Current`. Denna statiska "slaskhink" togs bort eftersom den orsakade massiva problem i asynkrona flöden (`async/await`) och gjorde koden nästan omöjlig att enhetstesta.

Behöver en tjänst (utanför en controller) komma åt webbkontexten? Då injicerar du **`IHttpContextAccessor`**.

> **Smart tips:** Skapa en dedikerad wrapper för din session så att övrig kod slipper bry sig om HTTP-kontexten direkt.

```csharp
public class UserSessionContext(IHttpContextAccessor httpContextAccessor)
{
    private ISession? Session => httpContextAccessor.HttpContext?.Session;

    public string? GetCurrentUserId() => Session?.GetString("UserId");
    public void SetCurrentUserId(string userId) => Session?.SetString("UserId", userId);
}

```

---

## 4. Blixtsnabba resurser med MapStaticAssets

I äldre ASP.NET Core använde vi `app.UseStaticFiles()` och förlitade oss på `asp-append-version="true"` för att cacha CSS och JS. Från .NET 9 och vidare in i .NET 10 har Microsoft introducerat **`MapStaticAssets`**.

Denna funktion gör två fantastiska saker automatiskt vid uppstart och build:

* **Fingerprinting:** Genererar kryptografiska hashar (ETags) baserat på filens faktiska innehåll för perfekt cache-busting.
* **Förkomprimering:** Komprimerar statiska filer till både Gzip och Brotli vid kompilation, vilket sparar enormt med CPU-kraft på servern vid varje anrop.

---

## 5. Arkitekturlyftet: Vertikala Slices i MVC

Om din applikation innehåller flera "e-tjänster" (t.ex. Bygglov, Felanmälan), sluta lägga alla controllers i en mapp och alla vyer i en annan. Det skapar onödig friktion.

Strukturera istället koden i **Vertical Slices (Feature Folders)**, där allt som rör en e-tjänst bor i samma mapp, komplett med en intern `Views`-mapp!

### Mappstrukturen

```text
MinMvcApplikation/       # Roten på projektet
│
├── wwwroot/                       # Statiska filer (CSS, JS, Bilder)
|   |   ├── css/                           ## Stilmallar
|   |   ├── fonts/                         ## Typsnitt
|   |   ├── lib/                           ## Tredjepartsbibliotek (Bootstrap, jQuery, etc.)
|   |   ├── js/                            ## JavaScript-filer
|   |   └── images/                        ## Bilder
│
├── Features/                      # HÄR BOR ALLA VERTIVALA SLICES
│   │
│   ├── Shared/                            # Delade layouter och felhantering
│   │   ├── SharedController.cs            ## Gemensam controller för delade vyer
│   │   ├── ErrorController.cs             ## Controller för globala fel
│   │   └── Views/                         ## Delade vyer
│   │       ├── _Layout.cshtml             ### Gemensam layout för alla e-tjänster
│   │       ├── Error.cshtml               ### Gemensam felhanteringsvy
│   │       ├── Home.cshtml                ### Gemensam startsida
│   │       ├── Kontakt.cshtml             ### Gemensam kontaktvy
│   │       └── Privacy.cshtml             ### Gemensam integritetspolicy
│   │
│   ├── FelanmalanInfrastruktur/           # Mindre e-tjänst
│   │   ├── FelanmalanController.cs          ## Huvudkontroller för flödet
│   │   ├── FelanmalanViewModel.cs           ## Håller sessionstillståndet för steg 1-3
│   │   └── Views/                           ## Alla steg samlade och isolerade
│   │       ├── Steg0_Start.cshtml             ### Introduktion och villkor
│   │       ├── Steg1_Karta.cshtml             ### Välj på karta var felet finns
│   │       ├── Steg2_Beskrivning.cshtml       ### Formulär för beskrivning av felet
│   │       ├── Steg3_Kontaktuppgifter.cshtml  ### Formulär för kontaktuppgifter
│   │       └── Steg4_Kvitto.cshtml            ### Slutvy med kvitto och vad som händer härnäst
│   │
│   ├── AnsokanOmBygglov/                  # Den stora E-tjänsten
│   │   ├── BygglovController.cs             ## Huvudkontroller för flödet
│   │   ├── BygglovWizardState.cs            ## Håller sessionstillståndet för steg 1-3
│   │   ├── Models/                          ## Modeller för validering
│   │   │   ├── FastighetModel.cs              ### Specifik validering för steg 1
│   │   │   └── RitningModel.cs                ### Specifik validering för steg 2
│   │   └── Views/                           ## Sekventiella vyer för hela flödet
│   │       ├── Steg0_Start.cshtml             ### Introduktion och villkor
│   │       ├── Steg1_Fastighet.cshtml         ### Formulär för fastighetsuppgifter
│   │       ├── Steg2_Ritningar.cshtml         ### Formulär för ritningsuppladdning
│   │       └── Steg3_Kvitto.cshtml            ### Slutvy med kvitto och vad som händer härnäst
│   │
│   └── Infrastructure/                    # Tvärsgående teknik som används av flera e-tjänster
│       ├── Services/                      ## Tjänster som inte är direkt kopplade till en e-tjänst
│       │   ├── EmailService.cs            ### Skickar e-post via SMTP
│       │   └── PdfGeneratorService.cs     ### Genererar PDF:er från Razor-vyer
│       ├── Session/                       ## Hjälpklasser för session och HttpContext
│       │   ├── SessionExtensions.cs       ### Smarta extensions för typad session
│       │   └── UserSessionContext.cs      ### Wrapper kring IHttpContextAccessor
│       └── Data/                          ## Databaslogik och Entity Framework Core
│           ├── FileStorageService.cs      ### Lagrar filer i filsystemet
│           └── ApplicationDbContext.cs    ### DbContext för hela applikationen
│
├── appsettings.json    # Konfigurationsfil för SMTP, databas, loggning etc.
└── Program.cs          # Huvudfilen som startar appen och bygger DI-container + middleware-pipeline

```

### Konfigurera MVC att hitta vyerna

För att få MVC att förstå denna struktur lägger vi till en "View Location Expander" i `Program.cs`:

```csharp
builder.Services.AddControllersWithViews()
    .AddRazorOptions(options =>
    {
        options.ViewLocationFormats.Clear();
        // Leta i e-tjänstens Views-mapp: /Features/{Mappnamn}/Views/{Vynamn}.cshtml
        options.ViewLocationFormats.Add("/Features/{2}/Views/{0}.cshtml");
        // Fallback till delade vyer
        options.ViewLocationFormats.Add("/Features/Shared/Views/{0}.cshtml");
    });

```

Tack vare sekventiella namn (`Steg1_...`) blir det glasklart för alla utvecklare i teamet hur användarresan hänger ihop, direkt i Solution Explorer.

---

## 6. Projekt vs Mappar: Håll nere komplexiteten

När man moderniserar är det frestande att bryta ut varje feature eller infrastruktur i egna `.csproj`-projekt. Gör inte det om du inte måste.

I små till medelstora applikationer skapar separata projekt mest bara boilerplate-kod, krångliga referenser och "Razor Class Library"-huvudvärk. Vår rekommendation:

* Håll allt i ett enda webbprojekt.
* Använd mappar (som `/Features` och `/Infrastructure`) strikt.
* Bryt ut infrastrukturen till ett eget projekt endast om du vet att du inom kort ska bygga en helt fristående tjänst (t.ex. en nattlig *Worker Service*) som behöver dela samma databaslogik.

---

## Sammanfattning

Att flytta till .NET 10 handlar om att lämna det gamla bagaget bakom sig. Genom att anamma Dependency Injection fullt ut, ersätta `System.Web` med moderna mönster och organisera koden efter faktiska funktioner snarare än tekniska lager, får du en applikation som är ett rent nöje att underhålla de kommande tio åren.

Lycka till med migreringen!

---

## Nyttiga Referenser & Vidareläsning

* [Migrate from ASP.NET Framework to ASP.NET Core (Microsoft Learn)](https://learn.microsoft.com/en-us/aspnet/core/migration/fx-to-core/?view=aspnetcore-10.0) – Migrera från gamla .NET Framework till moderna .NET 10, steg för steg.
* [Get started with incremental ASP.NET to ASP.NET Core migration (Microsoft Learn)](https://learn.microsoft.com/en-us/aspnet/core/migration/fx-to-core/start?view=aspnetcore-10.0) – Den officiella guiden för att mappa gamla koncept till nya.
* [Enable ASP.NET Core Blazor Server support with Yarp in incremental migration (Microsoft Learn)](https://learn.microsoft.com/en-us/aspnet/core/migration/fx-to-core/inc/blazor?view=aspnetcore-7.0&viewFallbackFrom=aspnetcore-10.0) – Aktivera Blazor Server i en gammal MVC-applikation, för att kunna bygga moderna interaktiva vyer utan att byta hela plattformen.
* [Options Pattern in .NET (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/core/extensions/options) – Läs mer om hur `IOptions<T>` fungerar för starkt typad konfiguration.
* [Configuration Options in ASP.NET Core (Microsoft Learn)](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options?view=aspnetcore-10.0) – Läs mer om hur konfiguration fungerar i ASP.NET Core.
* [Access HttpContext in ASP.NET Core (Microsoft Learn)](https://learn.microsoft.com/aspnet/core/fundamentals/http-context) – Varför `HttpContext.Current` är borta och hur du implementerar `IHttpContextAccessor` korrekt.
* [Optimize static web assets (Microsoft Learn)](https://learn.microsoft.com/aspnet/core/fundamentals/static-files) – Detaljer om `MapStaticAssets` och modern, effektiv filhantering.
* [Vertical Slice Architecture av Jimmy Bogard](https://jimmybogard.com/vertical-slice-architecture/) – Mannen bakom mönstret förklarar varför vi ska sluta bygga tekniska lager och börja bygga konkreta features.
