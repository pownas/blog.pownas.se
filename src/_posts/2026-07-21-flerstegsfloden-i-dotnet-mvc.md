---
layout: post
title: 'Flerstegsflöden i .NET: Sekventiella Vyer och Isolerad State Management'
date: 2026-07-21 13:56 +0200
category: "programmering, csharp, dotnet, mvc, arkitektur"
---

Att bygga e-tjänster och flerstegsflöden (wizards) i ASP.NET Core MVC är en vanlig uppgift i företagsapplikationer. Men när ett flöde växer från tre till tio steg blir det snabbt en utmaning att hålla ordning på vyer, specifika valideringsmodeller och tillståndshantering (state management). Om allt sprids ut i generiska mappar tappar utvecklare snabbt överblicken.

Genom att kombinera principer från **Vertical Slice Architecture** med en strikt **sekventiell namngivningsstandard** och en robust distribuerad sessionsarkitektur, kan vi skapa en struktur som är självförklarande, högpresterande, extremt underhållsvänlig och redo för produktion i molnet.

<!--more-->
---

## 1. Visuell Arkitektur: Kraften i Sekventiella Vyer

Det enklaste men mest kraftfulla steget för att öka läsbarheten är att döpa vyerna sekventiellt med ett tydligt index-prefix (`Steg0_`, `Steg1_`, osv.). När en utvecklare, testare eller arkitekt öppnar mappen ser de omedelbart exakt hur användarresan ser ut i webbläsaren utan att behöva gräva i controllerns routing-logik.

När en e-tjänst dessutom blir större och kräver komplex tillståndshantering, egna specifika datamodeller eller hjälpklasser, isolerar vi den i en egen dedikerad mapp under `Features`.

### Mappstruktur för Små vs. Stora Tjänster

Här är två konkreta exempel. `FelanmalanInfrastruktur` är en mindre, linjär tjänst där allt ryms direkt i mappen. `AnsokanOmBygglov` är en betydligt mer komplex tjänst med många steg och en intern `Models/`-mapp för att kapsla in specifika datamodeller.

```plaintext
Features/
│
├── FelanmalanInfrastruktur/           # Mindre tjänst - allt direkt i mappen
│   ├── FelanmalanController.cs
│   ├── FelanmalanViewModel.cs
│   ├── Steg0_Start.cshtml             # Information och villkor
│   ├── Steg1_Karta.cshtml             # Välj plats på karta
│   ├── Steg2_Beskrivning.cshtml       # Beskriv felet och bifoga bild
│   ├── Steg3_Kontaktuppgifter.cshtml  # Vem anmäler?
│   └── Steg4_Kvitto.cshtml            # Tack-sida med ärendenummer
│
└── AnsokanOmBygglov/                  # Större tjänst - med intern modell-mapp
    ├── BygglovController.cs
    ├── BygglovWizardState.cs          # Håller ordning på hela flödet i sessionen
    │
    ├── Models/                        # SPECIFIKA MODELLER FÖR DENNA TJÄNST
    │   ├── FastighetModel.cs          # Används i steg 1
    │   ├── RitningarModel.cs          # Används i steg 2
    │   └── BygglovInskickatResult.cs  # Används för kvittot
    │
    ├── Steg0_Start.cshtml             # BankID-inloggning och introduktion
    ├── Steg1_Fastighet.cshtml         # Sök fram fastighetsbeteckning
    ├── Steg2_Atgard.cshtml            # Vad ska byggas? (Nybyggnad, tillbyggnad)
    ├── Steg3_Ritningar.cshtml         # Ladda upp situationsplan, fasadritning
    ├── Steg4_Granskning.cshtml        # Sammanfattning innan inskick
    └── Steg5_Kvitto.cshtml            # Tack för din ansökan!

```

---

## 2. Central Konfiguration i Program.cs (.NET 10)

För att kunna använda sessioner i applikationen måste vi registrera rätt tjänster samt lägga till rätt middleware i vår request-pipeline. Sessionstate i ASP.NET Core är i grunden uppbyggt ovanpå ett cache-gränssnitt (`IDistributedCache`).

När vi utvecklar lokalt räcker det oftast med en in-memory-cache. Så här sätter du upp en säker och optimerad session i `Program.cs` med modern .NET 10-syntax:

```csharp
// Fil: Program.cs
var builder = WebApplication.CreateBuilder(args);

// 1. Registrera en lagringsplats för cachen (In-memory under lokal utveckling)
builder.Services.AddDistributedMemoryCache();

// 2. Konfigurera sessionshanteringen med strikta säkerhetsinställningar
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Tidsgräns för inaktivitet
    options.Cookie.HttpOnly = true;                 // Skyddar mot XSS-attacker genom att dölja cookien för JavaScript
    options.Cookie.IsEssential = true;               // Gör att sessionen fungerar även om användaren inte godkänt cookies (GDPR essential)
});

builder.Services.AddControllersWithViews();

var app = builder.Build();

// 3. Aktivera sessions-middleware i rätt ordning (MÅSTE ligga före routing/endpoints)
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseSession(); // Aktiverar sessionen för inkommande requests

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();

```

---

## 3. Skalbarhet i Web Farms (Out-of-Process Session State)

Standardkonfigurationen med `AddDistributedMemoryCache()` sparar sessionstillståndet i den specifika webbserverns arbetsminne. Om din applikation växer och distribueras över flera servrar (en så kallad Web Farm / lastbalanserad miljö) uppstår ett problem: om användaren skickar Steg 1 till Server A, och nästa klick (Steg 2) styrs om till Server B av lastbalanseraren, kommer servern inte att hitta användarens session. Användaren slängs då ut eller tvingas börja om.

För att lösa detta flyttar vi sessionen **Out-of-Process (OutProc)** till en delad, central datakälla. Då blir applikationen helt tillståndslös (stateless) och kan enkelt skalas linjärt.

### Alternativ A: Persistent lagring i SQL Server

Om du vill att sessionerna ska överleva applikationsomstarter, serverdriftsättningar samt ha en extremt stabil lagring är en SQL-databas ett utmärkt val.

1. Skapa cache-tabellen i din SQL-databas via .NET CLI med verktyget `sql-cache`:

```bash
dotnet tool install --global dotnet-sql-cache
dotnet sql-cache create "Data Source=DITT_SERVER_NAMN;Initial Catalog=SessionsDb;Integrated Security=True;" dbo AppSessionCache

```

2. Byt ut `AddDistributedMemoryCache()` i `Program.cs` mot SQL-cachen:

```csharp
builder.Services.AddDistributedSqlServerCache(options =>
{
    options.ConnectionString = builder.Configuration.GetConnectionString("SqlCacheConnection");
    options.SchemaName = "dbo";
    options.TableName = "AppSessionCache";
});

```

### Alternativ B: Högpresterande lagring i Redis

För extremt högpresterande e-tjänster med miljontals samtidiga klick rekommenderas en in-memory-nyckel-värdedatabas som Redis. Konfigurationen görs enkelt via NuGet-paketet `Microsoft.Extensions.Caching.StackExchangeRedis`:

```csharp
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("RedisConnection");
    options.InstanceName = "E Tjanster_";
});

```

---

## 4. Smart Datamodellering för Flerstegsflöden

När en användare navigerar genom stegen vill vi inte tappa bort information från tidigare steg, samtidigt som vi vill behålla en stark och träffsäker validering per skärm.

I modern .NET löser vi detta mest elegant genom att separera **små, specifika modeller per steg** (för hård validering i vyn) från en **gemensam flödesmodell** (för sessionen/tillståndet).

### Steg 1: Den specifika stegmodellen

Varje enskilt formulär får en fokuserad modell. Det gör datavalideringen (`ModelState.IsValid`) träffsäker och isolerad till just det stegets krav.

```csharp
// Fil: Features/AnsokanOmBygglov/Models/FastighetModel.cs
using System.ComponentModel.DataAnnotations;

public class FastighetModel
{
    [Required(ErrorMessage = "Du måste ange en fastighetsbeteckning.")]
    public string FastighetsBeteckning { get; set; } = string.Empty;

    [Range(1, 5, ErrorMessage = "Minst en ägare måste väljas.")]
    public int AntalAgare { get; set; }
}

```

### Steg 2: Den samlande flödesmodellen (`WizardState`)

För att applikationen ska komma ihåg all data under resans gång skapar du en samlingsklass för hela e-tjänsten. Det är denna klass som serialiseras och sparas undan i sessionen efter varje lyckat steg.

```csharp
// Fil: Features/AnsokanOmBygglov/BygglovWizardState.cs
using MinMvcApplikation.Features.AnsokanOmBygglov.Models;

public class BygglovWizardState
{
    public FastighetModel? FastighetStep { get; set; }
    public RitningarModel? RitningarStep { get; set; }

    // Flagga för att hålla koll på om granskningen är godkänd och redo att skickas in
    public bool IsReadyToSubmit => FastighetStep != null && RitningarStep != null;
}

```

---

## 5. Renodlad Flödesstyrning i Controllern

Tack vare den nya namngivningen och uppdelningen blir koden i din controller otroligt logisk, linjär och lättläst. Du hämtar tillståndet, mappar till vyn och slussar sedan användaren vidare till nästa vy i sekvensen:

```csharp
// Fil: Features/AnsokanOmBygglov/BygglovController.cs
using Microsoft.AspNetCore.Mvc;
using MinMvcApplikation.Features.AnsokanOmBygglov.Models;

namespace MinMvcApplikation.Features.AnsokanOmBygglov;

public class BygglovController(UserSessionContext sessionContext) : Controller
{
    private const string SessionKey = "Bygglov_Wizard_State";

    [HttpGet]
    public IActionResult Steg1_Fastighet()
    {
        // Hämta befintligt tillstånd eller skapa ett nytt om de börjar om
        var state = sessionContext.Get<BygglovWizardState>(SessionKey) ?? new BygglovWizardState();
        var model = state.FastighetStep ?? new FastighetModel();

        return View("Steg1_Fastighet", model);
    }

    [HttpPost]
    public IActionResult Steg1_Fastighet(FastighetModel model)
    {
        if (!ModelState.IsValid)
        {
            return View("Steg1_Fastighet", model); // Visa felmeddelanden på steg 1
        }

        // Spara undan datan för Steg 1 i det stora flödesobjektet
        var state = sessionContext.Get<BygglovWizardState>(SessionKey) ?? new BygglovWizardState();
        state.FastighetStep = model;
        sessionContext.Set(SessionKey, state);

        // Skicka användaren vidare till nästa logiska steg!
        return RedirectToAction(nameof(Steg2_Atgard));
    }
}

```

---

## Fördelar i Produktionsmiljö och Förvaltning

Att arkitektera dina e-tjänster på det här sättet ger omedelbara fördelar i produktion:

1. **Noll söktid vid buggfixar:** När en handläggare eller testare rapporterar att *"Det blir fel i granskningen på Bygglovs-tjänsten"*, vet du exakt vilken fil du ska öppna i hela repot på en sekund: `AnsokanOmBygglov/Steg4_Granskning.cshtml`. Inget letande, ingen förvirring.
2. **Kapslad komplexitet:** Förändringar i validering eller logik för ett enskilt steg är isolerat och riskerar inte att förstöra funktionalitet i andra delar av användarresan.
3. **Web Farm-ready:** Genom att frikoppla sessionen från det lokala serverminnet till SQL Server eller Redis kan ditt system enkelt hantera trafikspikar utan dataförluster under deploy eller vid serverkrascher.
4. **Visuell Storyboard:** Mappstrukturen fungerar som en direkt visuell kartläggning av e-tjänstens flöde, vilket förenklar onboarding av nya utvecklare markant.

---

## Referenser & Vidare Läsning

* **Microsoft Learn:** [Session and state management in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/app-state?view=aspnetcore-10.0)
* **Microsoft Learn:** [Distributed caching in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/performance/caching/distributed?view=aspnetcore-10.0)
* **Vertical Slice Architecture:** [Jimmy Bogard - Vertical Slice Architecture](https://jimmybogard.com/vertical-slice-architecture/)
* **Martin Fowler:** [Patterns of Enterprise Application Architecture (State Patterns)](https://martinfowler.com/eaaCatalog/)
