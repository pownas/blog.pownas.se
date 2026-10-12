---
layout: post
title: '.NET 11 & C# 15: De 11 största nyheterna du måste känna till'
date: 2026-10-02 18:23 +0200
category: "programmering,csharp,dotnet,nyheter"
---

Vad innebär .NET 11 för oss utvecklare?

Med releasen av **.NET 11** och **C# 15** fortsätter Microsoft sin långsiktiga satsning på två huvudsakliga pelare: **utvecklarproduktivitet** (renare syntax och kraftfullare typ-system) och **extrema prestandavinst under huven** (utan att du behöver skriva om din kod).

I denna artikel går vi igenom de 11 viktigaste nyheterna från Ed Andersens populära videogenomgång. Vi kikar på vad varje funktion innebär i praktiken och jämför direkt hur koden såg ut **före .NET 11** gentemot hur den skrivs **idag**.

<!--more-->
---

* **Baserad på:** Ed Andersens genomgång *"Top 11 New Features in .NET 11"*  
* **Lästid:** ca 8 minuter  

## Snabböversikt & Viktigaste Key Takeaways

> 💡 **3 Snabba slutsatser:**
> 1. **C# 15 blir mer uttrycksfullt:** Discriminated Unions (`union`), stängda klasshierarkier (`closed`) och märkta slingor (`break label;`) löser gamla språk-brister.
> 2. **ASP.NET Core blir snabbare & mer flexibelt:** Blixtsnabb bypass med `[ShortCircuit]`, inbyggd Zstandard-komprimering och asynkron validering i Minimal APIs.
> 3. **CoreCLR-revolution under huven:** Asynkrona tillståndsmaskiner ligger nu direkt i CLR-runtimen – vilket ger renare stack traces och lägre minnesallokeringar.

---

## 1. Collection Expression Arguments (C# 15)
⏱️ **Tidsstämpel i klippet:** `00:00:06`

### Vad är nyheten?
Collection expressions (introducerade i C# 12 med `[...]`) utvecklas i C# 15. Nu kan du skicka **konstruktorargument** direkt i hakparenteserna. Det gör det möjligt att explicit sätta en startkapacitet samtidigt som du sprider (`..`) befintliga element eller lägger till nya.

### Varför är det bra?
Tidigare var du tvungen att välja mellan den nya renare `[...]`-syntaxen eller att manuellt instansiera en `List<T>` med en kapacitet för att undvika minnes-omallokeringar (re-allocations). Nu får du det bästa av två världar!

#### 🔴 Före .NET 11
```csharp
// Förut: Antingen manuell kapacitet ELLER collection expression
var list = new List<int>(100);
list.AddRange(existingItems);
list.Add(10);
list.Add(20);
```

#### 🟢 Med .NET 11 & C# 15
```csharp
// C# 15: Kapacitet + Spread operator i samma uttryck!
List<int> list = [capacity: 100, ..existingItems, 10, 20];
```

---

## 2. Inbyggda Union Types i C# 15
⏱️ **Tidsstämpel i klippet:** `00:01:29`

### Vad är nyheten?
C# får äntligen fullvärdiga **Discriminated Unions** (summatyper) via nyckelordet `union`. En variabel av en union-typ kan bara innehålla exakt en av de angivna typerna. 

### Varför är det bra?
Kompilatorn tvingar dig att hantera **alla** fall i ett `switch`-uttryck (exhaustive pattern matching). Om någon lägger till en ny typ i unionen i framtiden får du ett kompileringsfel direkt om du glömt att hantera den.

#### 🔴 Före .NET 11
```csharp
// Förut: Krångliga klasshierarkier och behov av default-fall (_)
public abstract record Result;
public record Success(string Data) : Result;
public record Failure(string Error) : Result;

var msg = result switch {
    Success s => s.Data,
    Failure f => f.Error,
    _ => throw new InvalidOperationException() // Måste finnas med!
};
```

#### 绿 Med .NET 11 & C# 15
```csharp
// C# 15: Ren union-deklaration och garanterad täckning!
public union Result = Success(string Data) | Failure(string Error);

var msg = result switch {
    Success s => s.Data,
    Failure f => f.Error
    // Ingen '_' behövs! Kompilatorn vet att alla fall täcks.
};
```

---

## 3. Closed Class Hierarchies (`closed`)
⏱️ **Tidsstämpel i klippet:** `00:02:24`

### Vad är nyheten?
Nyckelordet `closed` låter dig begränsa nedärvning av en abstrakt klass eller ett gränssnitt till enbart den **egna assemblyn (projektet)**. 

### Varför är det bra?
Det förhindrar att externa konsumenter av ditt bibliotek skapar egna subklasser som du inte har kontroll över. Detta underlättar API-design och ger kompilatorn möjlighet att göra prestandaoptimeringar som *de-virtualization*.

#### 🔴 Före .NET 11
```csharp
// Förut: Använde interna konstruktorer som ett "hack"
public abstract class Shape {
    internal Shape() { } // Förhindrar extern nedärvning
}
public class Circle : Shape { }
```

#### 🟢 Med .NET 11 & C# 15
```csharp
// C# 15: Tydlig avsikt med 'closed'
public closed abstract class Shape { }

public class Circle : Shape { } // Tillåtet i samma assembly
// Externa projekt får kompileringsfel om de försöker ärva från Shape!
```

---

## 4. Extension Indexers
⏱️ **Tidsstämpel i klippet:** `00:03:08`

### Vad är nyheten?
Det nya `extension`-blocket i C# 15 bygger vidare på tilläggsmetoder (extension methods). Nu kan du även lägga till **indexerare** (`this[...]`) på befintliga typer från externa bibliotek eller .NET-standarden.

### Varför är det bra?
Gör att du kan skriva betydligt mer intuitiv och "ren" kod när du arbetar med samlingar och strängar.

#### 🔴 Före .NET 11
```csharp
// Förut: Begränsad till vanliga extension-metoder
public static class StringExtensions {
    public static char GetCharOrDefault(this string str, int idx, char fallback)
        => idx < str.Length ? str[idx] : fallback;
}

// Användning:
char c = "DotNet".GetCharOrDefault(10, '?');
```

#### 🟢 Med .NET 11 & C# 15
```csharp
// C# 15: Tilläggsindexerare via extension block
public implicit extension StringExtensions for string {
    public char this[Index idx, char fallback] {
        get => idx.GetOffset(this.Length) < this.Length ? this[idx] : fallback;
    }
}

// Användning: Naturlig indexeringssyntax!
char c = "DotNet"[10, '?']; // Returnerar '?'
```

---

## 5. Labeled Break & Continue
⏱️ **Tidsstämpel i klippet:** `00:04:00`

### Vad är nyheten?
Märkta slingor (Labels) gör att du kan namnge en yttre loop och hoppa ur eller fortsätta den direkt från en inre nästlad loop.

### Varför är det bra?
Slipper krångliga `bool found = true;`-flaggor eller otympliga `goto`-satser i matriser och nästlade algoritmer.

#### 🔴 Före .NET 11
```csharp
// Förut: Kräver extra flaggor eller goto
bool breakOuter = false;
for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 10; j++) {
        if (grid[i, j] == target) {
            breakOuter = true;
            break;
        }
    }
    if (breakOuter) break;
}
```

#### 🟢 Med .NET 11 & C# 15
```csharp
// C# 15: Bryt den yttre loopen direkt med label
outer: for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 10; j++) {
        if (grid[i, j] == target) {
            break outer; // Avbryter båda slingorna direkt!
        }
    }
}
```

---

## 6. Native C Union Support (`cunion`)
⏱️ **Tidsstämpel i klippet:** `00:04:55`

### Vad är nyheten?
Inbyggd syntax för C-unions vid interoperabilitet med nativ kod (C/C++/Rust via P/Invoke).

### Varför är det bra?
Ersätter felbenägna attribut som `[StructLayout(LayoutKind.Explicit)]` och manuella `[FieldOffset(0)]`.

#### 🔴 Före .NET 11
```csharp
// Förut: Manuell minneslayout med attribut
[StructLayout(LayoutKind.Explicit)]
public struct NativeValue {
    [FieldOffset(0)] public int IntValue;
    [FieldOffset(0)] public float FloatValue;
}
```

#### 🟢 Med .NET 11 & C# 15
```csharp
// C# 15: Nativ cunion syntax direkt i språket
public cunion struct NativeValue {
    public int IntValue;
    public float FloatValue;
}
```

---

## 7. `[ShortCircuit]` i ASP.NET Core MVC
⏱️ **Tidsstämpel i klippet:** `00:05:41`

### Vad är nyheten?
Attributet `[ShortCircuit]` gör sin entré i traditional MVC Controllers (fanns tidigare för Minimal APIs). Det gör att anropet hoppar över hela middleware-pipelinen (t.ex. session, tunga loggar, auth) för specifika endpoints.

### Varför är det bra?
Ger enorma prestandavinster för lätta anrop som t.ex. `healthz`, `robots.txt` eller statiska filer.

#### 🔴 Före .NET 11
```csharp
// Förut: Exekverade alla middlewares i appen innan svar returnerades
public class HealthController : Controller {
    [HttpGet("/healthz")]
    public IActionResult Health() => Ok("OK");
}
```

#### 🟢 Med .NET 11
```csharp
// .NET 11: Hoppar över tunga pipelines helt!
[ShortCircuit]
public class HealthController : Controller {
    [HttpGet("/healthz")]
    public IActionResult Health() => Ok("OK");
}
```

---

## 8. Asynkron Validering i Minimal APIs
⏱️ **Tidsstämpel i klippet:** `00:07:01`

### Vad är nyheten?
Nya `AsyncValidationAttribute` tillåter asynkron validering direkt under parameter-binding i Minimal APIs.

### Varför är det bra?
Tidigare var valideringsattribut strikt synkrona. Behövde du kontrollera om ett e-postmeddelande fanns i databasen var du tvungen att antingen köra synkron blockering (vilket skadar skalbarheten) eller skriva manuell valideringskod inuti handlern.

#### 🔴 Före .NET 11
```csharp
// Förut: Riskerade thread starvation med synkron blockering (.Result)
public class UniqueEmailAttribute : ValidationAttribute {
    protected override ValidationResult IsValid(object val, ValidationContext ctx) {
        var exists = CheckDbAsync(val).GetAwaiter().GetResult(); // Farligt!
        return exists ? new ValidationResult("Upptaget") : ValidationResult.Success;
    }
}
```

#### 🟢 Med .NET 11
```csharp
// .NET 11: I/O-vänlig asynkron validering
public class UniqueEmailAttribute : AsyncValidationAttribute {
    public override async ValueTask<ValidationResult> IsValidAsync(
        object? value, ValidationContext context, CancellationToken ct) {
        
        bool exists = await CheckDbAsync(value, ct);
        return exists ? new ValidationResult("Upptaget") : ValidationResult.Success!;
    }
}
```

---

## 9. Zstandard (zstd) Komprimering
⏱️ **Tidsstämpel i klippet:** `00:08:13`

### Vad är nyheten?
Nativt stöd för Metas **Zstandard (zstd)** i ASP.NET Core Response Compression.

### Varför är det bra?
Zstandard erbjuder dramatiskt bättre komprimeringshastighet och lägre CPU-belastning än GZip och Brotli, med nästintill samma komprimeringsgrad.

#### 🔴 Före .NET 11
```csharp
// Förut: Begränsad till Brotli och GZip ur kartongen
builder.Services.AddResponseCompression(options => {
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});
```

#### 🟢 Med .NET 11
```csharp
// .NET 11: Zstandard natively tillgängligt!
builder.Services.AddResponseCompression(options => {
    options.Providers.Add<ZstandardCompressionProvider>();
});
```

---

## 10. Dynamisk Output Caching Policy Provider
⏱️ **Tidsstämpel i klippet:** `00:09:18`

### Vad är nyheten?
Introduktionen av gränssnittet `IOutputCachePolicyProvider` i ASP.NET Core.

### Varför är det bra?
Gör det möjligt att dynamiskt utvärdera inkommande HTTP-förfrågningar, användarroller eller tenant-id vid runtime för att bestämma hur och vad som ska cachas, istället för statiska regler.

#### 🔴 Före .NET 11
```csharp
// Förut: Statiskt konfigurerade regler vid applikationsstart
builder.Services.AddOutputCache(options => {
    options.AddPolicy("StandardPolicy", b => b.Expire(TimeSpan.FromSeconds(60)));
});
```

#### 🟢 Med .NET 11
```csharp
// .NET 11: Dynamisk utvärdering vid runtime!
builder.Services.AddSingleton<IOutputCachePolicyProvider, DynamicTenantCacheProvider>();
```

---

## 11. Runtime Native Async i CoreCLR
⏱️ **Tidsstämpel i klippet:** `00:10:15`

### Vad är nyheten?
Hanteringen av `async/await` flyttas från att genereras av C#-kompilatorn som tunga C#-strukturer (`IAsyncStateMachine`) till att köras **nativt i CoreCLR-runtimen**.

### Varför är det bra?
1. **Upp till 35% mindre minnesallokeringar** för async-tunga applikationer.
2. **Kaskadförbättring av stack traces:** Du slipper de otympliga och otydliga `AsyncMethodBuilderCore`-raderna när ett undantag kastas.

#### 🔴 Före .NET 11 (Svårläst stack trace vid fel)
```text
System.Exception: Något gick fel!
  at Program.<Main>$d__0.MoveNext() in Program.cs:line 12
  at System.Runtime.CompilerServices.AsyncMethodBuilderCore.Start[TMethodBuilder](TMethodBuilder& stateMachine)
  --- End of stack trace from previous location ---
  at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()
```

#### 🟢 Med .NET 11 (Kristallklar nativ stack trace)
```text
System.Exception: Något gick fel!
  at Program.CalculateDataAsync() in Program.cs:line 18
  at Program.Main() in Program.cs:line 5
```

---

## Sammanfattning: Vad bör du göra nu?

.NET 11 och C# 15 visar tydligt att Microsoft fortsätter att finslipa C# till ett av världens mest moderna och mångsidiga språk. Genom att kombinera funktionell styrka (Discriminated Unions) med högpresterande lågnivåkontroll (C-unions och Runtime Async) får vi verktyg som gör koden både säkrare och snabbare.

* Om du bygger **webb-API:er**: Kika närmare på `[ShortCircuit]` och `ZstandardCompressionProvider` för snabba prestandavinster.
* Om du bygger **komplex domänlogik**: Börja planera för hur `union` och `closed` kan göra din domänmodell helt felsäker.

Källhänvisning: [Titta gärna på hela originalvideon på YouTube av Ed Andersen för fler visuella exempel](https://www.youtube.com/watch?v=Qxy8-cKE5pQ).