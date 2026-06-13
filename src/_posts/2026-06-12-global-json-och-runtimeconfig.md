---
layout: post
title: ".NET-versionsförvirring? Så styr `global.json` och `*.runtimeconfig.json`"
date: 2026-06-12 23:15 +0200
category: "c-sharp,.NET,programmering"
---

Har du någon gång kliat dig i huvudet när pipelinen kraschar för att en .NET SDK saknas, eller funderat på om din app faktiskt kommer att starta på produktionsservern efter den senaste säkerhetspatchen?

Du är inte ensam. .NET-världen är full av versionsnummer: `10.0.106`, `10.0.301`, `10.0.108`. Men sanningen är att .NET har ett väldigt smart (och ibland missförstått) system för att hålla isär **byggtid** och **körtid**.

Allt kokar ner till två filer: `global.json` och `*.runtimeconfig.json`. Låt oss reda ut vem som gör vad!

<!--more-->

---

## 🛠️ Byggtid: global.json är chefen i fabriken

Tänk på din utvecklardator eller din CI/CD-pipeline som en fabrik. För att bygga din applikation behöver fabriken verktyg – i det här fallet **.NET SDK** (kompilatorn, MSBuild och allt som gör din C#-kod till körbara binärer).

Det är här `global.json` kommer in i bilden.

* **Var bor den?** Oftast i rotmappen på ditt Git-repo.
* **Vad gör den?** Den talar om för .NET CLI exakt *vilken verktygsuppsättning (SDK)* som ska användas för att bygga koden.
* **Varför behövs den?** För att säkerställa att alla utvecklare i teamet och byggservern använder exakt samma kompilator. Om din `global.json` säger `10.0.100` men du har installerat `10.0.301` på datorn, kommer .NET att tvinga datorn att använda den äldre kompilatorn för just detta projekt.

> **Viktigt att komma ihåg:** `global.json` bryr sig bara om själva bygget. När appen väl är kompilerad har den filen gjort sitt jobb. Den ska **aldrig** kopieras med eller deployas till produktionsservern.

---

## 🚀 Körtid: DinApp.runtimeconfig.json styr på servern

När fabriken har byggt färdigt din app och du kör `dotnet publish`, skapas dina `.dll`-filer. Men bredvid dem dyker det upp en liten doldis: `DinApp.runtimeconfig.json`.

Det här är appens "pass" i produktionen, och det är den som styr **.NET Runtime** (motorn som faktiskt kör appen på servern).

Om du öppnar den filen kommer du se något i stil med:

```json
"framework": {
  "name": "Microsoft.NETCore.App",
  "version": "10.0.0"
}

```

* **Var bor den?** Den skapas automatiskt i din `publish`-mapp och hänger med till servern.
* **Vad gör den?** Den talar om för servern: *"Hejsan, jag är en .NET 10-app. För att jag ska starta måste du ha minst version 10.0.0 av runtimen installerad."*

---

## 🤝 Det magiska samspelet: Roll-Forward

Nu till den vanligaste frågan: **Vad händer om jag bygger appen med en superny SDK (t.ex. 10.0.301), men servern bara har en lite äldre runtime-patch installerad (t.ex. 10.0.108)?**

Svaret är enkelt: **Det fungerar alldeles utmärkt!**

Eftersom `runtimeconfig.json` bara ber om lägsta version `10.0.0`, kommer servern att titta på sina installerade versioner, hitta `10.0.108` och säga: *"Perfekt, den är nyare än 10.0.0, så vi kör!"* Denna mekanism kallas **Roll-Forward** (framåtrullning). .NET antar som standard att patch-uppdateringar (den sista siffran i versionsnumret) bara innehåller säkra buggfixar, och låter därför appen rulla framåt till den senaste tillgängliga patchen på servern.

### De tre gyllene reglerna att ta med sig:

1. **global.json** = För utvecklare och byggservrar. Styr *kompilatorn*. Stannar kvar i repot.
2. **runtimeconfig.json** = För produktionsservern. Styr *motorn*. Följer med i deployen.
3. **Du behöver inte matcha exakt** = Du kan tryggt sitta på en nyare SDK på din utvecklardator än vad som finns installerat på servern – .NET löser kompatibiliteten i bakgrunden.

---

## Officiella källor och vidare läsning

Vill du fördjupa dig i detaljerna kring hur .NET hanterar byggtid, körtid och versionsmatchning? Här är de officiella källorna från Microsofts dokumentation som ligger till grund för inlägget:

* **[global.json overview](https://learn.microsoft.com/en-us/dotnet/core/tools/global-json):** Den kompletta guiden till hur `global.json` används för att definiera och låsa vilken .NET SDK-version som ska styra verktygskedjan vid kompilering.
* **[Runtime configuration options](https://learn.microsoft.com/en-us/dotnet/core/runtime-config/):** Microsofts tekniska dokumentation över hur `runtimeconfig.json` struktureras och hur den instruerar värdmiljön (hosten) på servern vilka ramverk som krävs.
* **[Control how .NET rolls forward](https://learn.microsoft.com/en-us/dotnet/core/versions/selection):** Förklarar i detalj hur ramverksvalet sker under körtid och hur arkitekturen bakom *Roll-Forward* (framåtrullning) utvärderar patch-versioner på servern.
* **[.NET application publishing overview](https://learn.microsoft.com/en-us/dotnet/core/deploying/):** Beskriver vad som faktiskt händer när du kör `dotnet publish` och hur dina binärer samt konfigurationsfiler paketeras inför deployment.