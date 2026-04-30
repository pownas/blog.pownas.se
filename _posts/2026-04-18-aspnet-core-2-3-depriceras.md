---
layout: post
title: "ASP.NET Core 2.3 deprecieras – planera migration innan 2027-04-13"
date: 2026-04-18 09:00:00 +0200
category: "c-sharp,.NET,programmering"
---

ASP.NET Core utvecklades som den moderna, öppna och plattformsoberoende efterföljaren till klassisk ASP.NET. Nu är det dags att agera för team som fortfarande använder ASP.NET Core 2.3.
<!--more-->

## 1. ASP.NET Core 2.3 deprecieras

Microsoft har annonserat att ASP.NET Core 2.3 når **end of support 2027-04-13**. Efter det datumet ska man räkna med att versionen inte längre får support eller säkerhetsuppdateringar.

## 2. Viktiga datum och vad det innebär

- **2026-04-07:** Besked om kommande end of support för ASP.NET Core 2.3.
- **2027-04-13:** End of support.

Det innebär i praktiken högre risk för sårbarheter, svårare regelefterlevnad och ökade kostnader för drift och underhåll om man ligger kvar på 2.3.

## 3. Rekommendation: Migrera till .NET 10

Microsoft rekommenderar att migrera till en supportad modern .NET-version, exempelvis **.NET 10 (LTS)**, i stället för en tillfällig mellanlandning.

Varför .NET 10 är ett bättre mål:

- Långsiktigt stöd och tydlig livscykel.
- Bättre prestanda och modern runtime.
- Starkare stöd för container, cloud-native och modern CI/CD.
- Aktiv utveckling i ekosystem, verktyg och bibliotek.

## 4. Undvik att gå till .NET Framework 4.8

Att gå mot .NET Framework 4.8 kan kännas tryggt kortsiktigt, men blir ofta dyrare långsiktigt.

- ASP.NET Core 2.3 har bara haft ett tidsbegränsat stöd på .NET Framework. Vid end of support 2027-04-13 upphör även det.
- Efter 2027-04-13 får ASP.NET Core 2.3 inga nya säkerhetspatchar, buggrättningar eller teknisk support på .NET Framework 4.8.
- För supportad **ASP.NET Core på .NET 10** behöver du modern .NET, inte .NET Framework 4.8.
- .NET Framework 4.8 är i praktiken en slutstation, inte framtidsplattformen.
- Plattformen är Windows-bunden, vilket minskar flexibiliteten i driftmiljö.
- Du riskerar en dubbel migrering: först till 4.8, sedan ändå till modern .NET.
- Nyare investeringar i .NET-ekosystemet sker främst i moderna .NET-versioner.

Om målet är stabilitet, säkerhet och framtidssäkring är det klokare att gå direkt mot modern .NET.

## 5. Ytterligare information / källor

- ASP.NET Core på Wikipedia: https://en.wikipedia.org/wiki/ASP.NET_Core
- ASP.NET Core 2.3 End of Support (Microsoft DevBlogs): https://devblogs.microsoft.com/dotnet/aspnet-core-2-3-end-of-support/
- Officiell supportpolicy för ASP.NET: https://dotnet.microsoft.com/en-us/platform/support/policy/aspnet
