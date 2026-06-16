---
layout: post
title: ".NET Framework 4.8 eller .NET 10? Arkitekturvalet fram till 2032"
date: 2026-06-15 22:52 +0200
category: "c-sharp,.NET,programmering"
---

Det finns ett klassiskt ordspråk inom IT-världen: *"Om det fungerar, rör det inte."* Men när vi pratar om publika webbtjänster och interna API:er som förväntas rulla stabilt, säkert och prestandalätt fram till år 2032, så håller inte det gamla tänket längre.
Står du inför valet att låta dina applikationer ligga kvar på det beprövade .NET Framework 4.8 eller att migrera till det moderna .NET 10? Det korta svaret är att det finns en inbyggd paradox mellan målet att minimera livscykelhantering (LCM) och målet att ha ett modernt, säkert system.
Här bryter vi ner varför steget till .NET 10 är helt rätt väg att gå – särskilt om du kör i en lokal on-prem-miljö med både Windows-servrar och containers.

<!--more-->

## Paradoxen: Supporttid vs. Aktivt underhåll
Det starkaste argumentet för att stanna på .NET Framework 4.8 är bekvämlighet. Eftersom 4.8 räknas som en komponent i Windows-operativsystemet har det support så länge själva Windows Server-versionen har support. Det innebär att du kan glida förbi 2032 med noll förändring i kodbasen.
Men det finns en hake. Den moderna .NET-plattformen (.NET 10 och framåt) använder en annan supportmodell. .NET 10 är en **LTS-version (Long Term Support)**, vilket innebär tre års support. För att klara dig till 2032 på den moderna plattformen behöver du acceptera en uppgraderingstrappa:

 1. **Nu:** Migrera till .NET 10 LTS (Support till nov 2028).
 2. **Höst 2028:** Uppgradera till .NET 12 LTS (Support till nov 2030).
 3. **Höst 2030:** Uppgradera till .NET 14 LTS (Support till nov 2032).

Det låter kanske som mycket arbete, men sanningen är att stegen *mellan* de moderna .NET-versionerna är extremt smidiga. Tack vare funktioner som **Central Package Management (CPM)**, där alla versionsnummer samlas i en enda fil (Directory.Packages.props), handlar framtida uppgraderingar ofta bara om att ändra ett versionsnummer i projektfilen och testa av koden.

## Publika webbtjänster: En helt annan hotbild
Om du driftar publika webbtjänster blir riskerna med .NET Framework 4.8 snabbt kännbara. Publika gränssnitt lever i en fientlig miljö som förändras dagligen.
 * **Passiv vs. Aktiv säkerhet:** .NET 4.8 får endast kritiska säkerhetspatchar för själva runtimen via Windows Update. Det skyddar inte dina externa NuGet-paket. I .NET 10 kan du automatisera sårbarhetskontroller direkt i ditt byggsteg (CI/CD) så att du blockerar kod med kända sårbarheter (CVE:er) innan den når produktion.
 * **Moderna protokoll:** .NET 10 har inbyggt, högpresterande stöd för HTTP/3 och modern TLS 1.3-hantering. .NET 4.8 är i grunden byggt för HTTP/1.1, vilket gör applikationen tyngre och långsammare för klienterna.

## On-Prem Hybrid: Container-revolutionen
Många som kör lokala Windows-servrar blandat med container-lösningar on-prem missar hur mycket resurser (och därmed pengar i form av hårdvara och licenser) som går att spara på en modernisering.
När du kör .NET Framework 4.8 i en container är du låst till **Windows-containers** (Windows Server Core). Det betyder container-images på mellan 1,5 GB och 4 GB, långsamma starttider på upp till en minut, och tunga Windows-noder i ditt kluster.
Med .NET 10 kan du bygga för **Linux-containers** (t.ex. Alpine eller Ubuntu Chiseled). Skillnaden är monumental:

| Faktor | .NET 4.8 (Windows-container) | .NET 10 (Linux Chiseled) |
|---|---|---|
| **Image-storlek** | 1.5 GB – 4.0 GB | ~50 MB – 100 MB |
| **Starttid** | 30 – 60 sekunder | Under 1 sekund |
| **Attackyta** | Stor (hela Windows OS-kärnan ingår) | Minimal (inga skal, inga extra binärer) |

Genom att använda så kallade *Chiseled* containrar i .NET 10 rensas allt överflödigt bort. Din lokala säkerhetsscanner kommer att sluta larma om hundratals irrelevanta sårbarheter eftersom det helt enkelt inte finns något annat än din applikation i containern. Det sparar enormt mycket administrativ tid för ditt driftteam.

## Interna API:er blir "Ultra-Light" med Native AOT
För interna API:er handlar .NET 10-resan mycket om ren prestanda och resurssnålhet. Med **Native AOT (Ahead-Of-Time)** kompileras din C#-kod direkt till maskinkod.
Applikationen behöver inte längre .NET-runtimen installerad på servern eller i containern. API:et startar på några få millisekunder och minnesavtrycket krymper till ett absolut minimum. Detta gör att dina lokala hypervisors (VMware, Hyper-V) kan utnyttjas betydligt mer effektivt.

## Slutsats: Välj dina strider
Att stanna på .NET Framework 4.8 fram till 2032 ger dig till synes "gratis" LCM på pappret. Men i praktiken flyttar du bara kostnaden. Du kommer att tvingas lägga tid på att underhålla tunga Windows-servrar, hantera säkerhetsrisker i gamla bibliotek manuellt, och köpa mer hårdvara för att kompensera för sämre prestanda.
Genom att ta steget till .NET 10 gör du grovjobbet *en gång*. Därefter automatiserar du din pakethantering och dina säkerhetskontroller, flyttar in dina API:er i minimala Linux-containers och kan möta 2032 med en infrastruktur som är snabb, säker och billig i drift.

## Läs mer på Microsoft Learn
Här hittar du officiell dokumentation och djupdykningar för att planera ditt arkitekturval:
 * [Livscykel och supportpolicy för .NET Framework](https://learn.microsoft.com/en-us/lifecycle/products/microsoft-net-framework) – Detaljer kring hur länge .NET 4.8 stöds via Windows.
 * [Supportpolicy för det moderna .NET (.NET Core/10)](https://learn.microsoft.com/en-us/dotnet/core/releases-and-support) – Hur Microsofts LTS- och STS-releaser fungerar.
 * [Guide för migrering från .NET Framework till det moderna .NET](https://learn.microsoft.com/en-us/dotnet/core/porting/) – Strategier, verktyg och steg-för-steg-instruktioner för att flytta din kod.
 * [Introduktion till Native AOT-deployment](https://learn.microsoft.com/en-us/dotnet/core/deploying/native-aot/?tabs=windows%2Cnet9plus) – Så fungerar ahead-of-time-kompilering för minimala och snabba API:er.
 * [Modernisering av applikationer med Windows- och Linux-containers](https://github.com/dotnet-architecture/eBooks/blob/1ed30275281b9060964fcb2a4c363fe7797fe3f3/current/modernize-with-azure-containers/Modernize-Existing-.NET-applications-with-Azure-cloud-and-Windows-Containers.pdf) – Arkitekturråd kring containerisering av äldre kontra nya .NET-applikationer.

