---
layout: post
title: "Historien bakom det moderna .NET: Från arv till revolution"
date: 2026-05-24 22:45 +0200
category: "c-sharp,.NET,programmering"
---

Jag tänkte börja en liten blogg serie, om historian bakom det moderna dotNET (.NET). Vad var det som hände när man gick från den gamla "legacy" .NET Framework v1-v4 till en sväng förbi .NET Core v1-v3, vidare med den moderna .NET5 som sedan inkrementerat ett nummer varje år i november, till dagens .NET10. Där vi har landat idag (sedan 2025-11).

<!--more-->

Välkommen till en resa genom tiden. Om du skriver C#-kod idag, under 2026, är du förmodligen van vid att allt bara fungerar. Du kan köra din kod på en Windows PC, Mac, mobil Android eller iOS. Driftsätta koden i en Windows Server eller Linux-container i molnet, samt bygga ett högpresterande WebAPI:er med ett par rader kod.

Men det har inte alltid varit så. För att förstå varför dagens .NET 10 är ett tekniskt öppen källkods mästerverk, så måste vi spola tillbaka bandet till tiden då Microsofts ekosystem var fastlåst i en helt annan värld.

---

## Eran av ett monopol på Windows: .NET Framework

Under 2000- och 2010-talet var det **.NET Framework** som gällde. Det var kraftfullt, stabilt och drev tusentals företag runtom i världen. Men det hade två gigantiska begränsningar: det var proprietärt (inte öppen källkod) och det var **helt låst till Windows**.

En liten rolig detalj som är värd att nämna är att **Microsoft faktiskt hoppade över versionerna 4.1 till 4.4**. Efter den stora uppdateringen i .NET 4.0 gick de, efter ett par mindre patch uppdateringar (som 4.0.3), direkt till .NET 4.5 år 2012.

---

## Evolutionen: .NET Framework (2002 – 2019)

För att förstå hur vi hamnade i dagens moderna, plattformsoberoende .NET v5-v10, måste vi titta på de milstolpar som formade ramverket under dess första två decennier.

### Från födelse till den sista Windows-låsta versionen

<div class="table-container" markdown="1" Whiteout-fix>

| Version | Släpptes (År) | De viktigaste nyheterna |
| --- | --- | --- |
| **.NET Framework 1.0** | 2002 | Startskottet för hela plattformen som introducerade språket C# 1.0 och den gemensamma exekveringsmiljön (CLR). |
| **.NET Framework 1.1** | 2003 | Första uppdateringen som lade till inbyggt stöd för tidiga mobiltelefoner och bättre databashantering via ODBC. |
| **.NET Framework 2.0** | 2005 | En enorm milstolpe som introducerade Generics (generiska typer) vilket revolutionerade hur effektivt vi kan hantera datasamlingar. |
| **.NET Framework 3.0** | 2006 | Gav oss grundstenarna för moderna Windows-appar genom att introduceras tunga undersystem som WPF för design och WCF för kommunikation. |
| **.NET Framework 3.5** | 2007 | Introducerade den revolutionerande sökfunktionen LINQ och lambda-uttryck som förändrade hur vi filtrerar och hanterar data i kod. |
| **.NET Framework 3.5 SP1** | 2008 | Gav världen den allra första versionen av Entity Framework, vilket lade grunden för hur vi än idag mappar databaser till C#-objekt. |
| **.NET Framework 4.0** | 2010 | Fokuserade stenhårt på parallellprogrammering och flertrådskörning genom introduktionen av Task Parallel Library (TPL). |
| **.NET Framework 4.5** | 2012 | Förändrade asynkron programmering för alltid genom att introducera de ikoniska nyckelorden `async` och `await`. |
| **.NET Framework 4.6** | 2015 | Gav oss den nya, mycket snabbare 64-bitars kompilatorn (RyuJIT) och bättre stöd för moderna krypteringsstandarder, samt nyare Windows-funktioner. |
| **.NET Framework 4.7** | 2017 | Fokuserade mycket på touch-stöd, kryptografi och bättre hantering av högupplösta skärmar (High DPI) i gamla skrivbordsappar och uppdaterade säkerheten i webbkommunikation. |
| **.NET Framework 4.8** | 2019 | Den absoluta slutstationen för det klassiska ramverket (.NET Framework). Fokus var på maximal stabilitet, buggfixar, förbättrade säkerheten och cementerades som den sista stora uppdateringen av det gamla ramverket. |

</div>

---

## Revolutionen: .NET Core-eran (2016 – 2019)

Parallellspåret och kaoset... Detta var den spännande men stundtals kaotiska perioden då Microsoft byggde om sin motor från grunden för att göra den öppen, modulär och helt oberoende av Windows.

Microsoft jobbade dock i ett rasande tempo. Världen förändrades snabbt. Utvecklare ville köra sina appar i lätta Linux-miljöer i molnet, och Mac blev allt populärare bland programmerare. Microsoft insåg att de var tvungna att tänka om från grunden.

Svaret blev **.NET Core 1.0**, som släpptes i **juni 2016**.

Detta var en helt ny, modulär och cross-platform version av .NET skrivet helt som öppen källkod (Open Source). Plötsligt kunde C#-kod köras på Linux! Men den tidiga resan var smärtsam. Många gamla bibliotek saknades, och utvecklarvärlden splittrades i två läger: de som körde det gamla, säkra ".NET Framework" och de som vågade testa det nya, snabba ".NET Core".

> **Arkitektur-kaoset:** Under den här perioden var det förvirrande för utvecklare. Vi hade *.NET Framework* (för Windows), *.NET Core* (för cross-platform) och *Mono/Xamarin* (för mobilappar). För att försöka hålla ihop allt skapades *.NET Standard* – ett slags kontrakt som sa vilka funktioner som måste finnas i alla systemen. Det fungerade, men det var rörigt.

<div class="table-container" markdown="1" Whiteout-fix>

| Version | Släpptes (År) | De viktigaste nyheterna |
| --- | --- | --- |
| **.NET Core 1.0** | 2016 | Den första helt öppna (open source) och plattformsoberoende versionen som gjorde det möjligt att köra .NET på Linux och macOS. |
| [**.NET Core 2.0**](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-core-2-0) | 2017 | Öppnade upp tusentals saknade API:er via [.NET Standard 2.0](https://learn.microsoft.com/en-us/dotnet/standard/whats-new/whats-new-in-dotnet-standard?tabs=csharp), vilket gjorde det möjligt att faktiskt flytta över existerande affärssystem till den nya plattformen, användbart på riktigt för vanliga utvecklare. |
| [**.NET Core 3.0**](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-core-3-0) | 2019 | Tog det historiska steget att flytta över stöd för traditionella Windows-skrivbordsappar (WPF och WinForms) till Core-plattformen samt introducerade gRPC för supersnabb API-kommunikation. |
| [**.NET Core 3.1**](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-core-3-1) | 2019 | En stabil långtidssupport-version (LTS) som polerade prestandan och cementerade .NET Core som redo att helt pensionera det gamla .NET ramverket (.NET Framework). |

</div>

Nu fanns det plötsligt väldigt få anledningar att stanna kvar i det gamla legacy .NET Framework...

---

## Enandet: Den moderna .NET-eran (2020 – Idag)

Här raderade Microsoft namnen "Core" och "Framework" för att skapa en enda gemensam plattform för allt från molntjänster och mobilappar till AI och spelutveckling.

<div class="table-container" markdown="1" Whiteout-fix>

| Version | Släpptes (År) | De viktigaste nyheterna |
| --- | --- | --- |
| [**.NET 5**](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-5) | 2020 | Det stora namnbytet där "Core" skrotades för att ena plattformen, samt introduktionen av C# 9 med Records och Top-Level Statements. |
| [**.NET 6**](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-6) | 2021 | En enorm prestandabomb till LTS-version som revolutionerade webbutvecklingen genom introduktionen av Minimal API:er och C# 10. |
| [**.NET 7**](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-7) | 2022 | Fokuserade på molnbaserade applikationer (cloud-native) och banade väg för C# 11 med fantastiska verktyg som Generic Math och Raw String Literals. |
| [**.NET 8**](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8/overview) | 2023 | Tog applikationshastigheten till extrema nivåer med Dynamic PGO, introducerade `TimeProvider` för enhetstester och gjorde C# 12:s Primary Constructors till standard. |
| [**.NET 9**](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-9/overview) | 2024 | Integrerade djupa optimeringar för AI-utveckling och bjöd på smarta språktillägg i C# 13, som metoden `.Index()` i loopar och det nya, snabbare `Lock`-objektet. |
| [**.NET 10**](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/overview) | 2025 | Den senaste LTS-versionen med inbyggt fullskaligt stöd för tunga tensor-beräkningar (AI) och det efterlängtade `field`-nyckelordet i C# 14 för ännu renare kodstruktur. |
| [**.NET 11** *PREVIEW*](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-11/overview) | 2026 | (nästa STS-release för november 2026) fokuserar på en djupgående modernisering av plattformens fundament genom att aktivera *Runtime Async* som standard, flytta mobil- (MAUI) och WebAssembly-appar helt till *CoreCLR* för en enhetlig exekveringsmiljö, samt leverera kraftfulla JIT- och AI-optimeringar direkt under huven. |

</div>

---

## Det stora namnbytet: Varför försvann "Core" och "Framework"?

I slutet av 2019 stod Microsoft inför ett vägskäl. .NET Core 3.1 var en enorm succé, och .NET Framework 4.8 var vid vägs ände. Det var dags att slå ihop visionerna och skapa **en enda plattform för att styra allt**.

Man fattade då tre strategiska beslut:

1. **Skrota namnet "Framework":** Det förknippades med den gamla Windows-låsta tekniken.
2. **Skrota namnet "Core":** Eftersom detta nu skulle bli den enda, huvudsakliga plattformen behövdes ingen särskiljning längre. Det nya namnet blev kort och gott bara **.NET**.
3. **Hoppa över version 4:** Eftersom det gamla ramverket slutade på version 4.8, insåg man att om den nya plattformen döptes till *.NET 4.0*, skulle folk tro att det var en uppdatering till det gamla systemet. För att undvika total förvirring hoppade man direkt till **nummer 5**.

Resultatet... Vi landade under 2020, kort och gott på [**.NET 5**, den nya och moderna plattformen](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-5).

Målet med denna nya era var glasklart: *En plattform, en runtime, ett verktygsset – för webb, moln, skrivbord, mobil och spel.*

---

*I nästa del av bloggserien dyker vi rakt in i november 2020. Startskottet för den moderna eran, dagen då .NET 5 och C# 9 släpptes lös och förändrade hur vi skriver C#-kod för alltid...*

Källor:
* [Microsoft .NET Framework - https://learn.microsoft.com/en-us/lifecycle/products/microsoft-net-framework](https://learn.microsoft.com/en-us/lifecycle/products/microsoft-net-framework)
* [Microsoft .NET and .NET Core - https://learn.microsoft.com/en-us/lifecycle/products/microsoft-net-and-net-core](https://learn.microsoft.com/en-us/lifecycle/products/microsoft-net-and-net-core)
* [.NET and .NET Core Support Policy - https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core#lifecycle](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core#lifecycle)
* [.NET10 - https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/overview](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/overview)
* [Download .NET - https://dotnet.microsoft.com/en-us/download/dotnet](https://dotnet.microsoft.com/en-us/download/dotnet)
* Samt flertalet webbsökningar...
