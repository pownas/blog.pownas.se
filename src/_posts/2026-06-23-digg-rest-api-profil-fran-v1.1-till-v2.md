---
layout: post
title: 'Vad är nytt i DIGG:s nationella REST API-profil? Från v1.1.0 till v2.0.0'
date: 2026-06-23 18:10 +0200
category: "webbutveckling,wcag,css,programmering"
---

Om du har designat och byggt API:er för den offentliga sektorn under de senaste åren är chansen stor att du har använt DIGG:s (Myndigheten för digital förvaltning) nationella REST API-profil, troligtvis version 1.1.0. Syftet med profilen har alltid varit att standardisera och skapa interoperabilitet mellan offentliga aktörer.

Nyligen lanserades **version 2.0.0 av REST API-profilen**. Om du inte har haft tid att plöja igenom den uppdaterade dokumentationen ännu, är denna bloggpost för dig. Vi går igenom de största nyheterna, vad du behöver läsa in dig extra på och de relevanta standarder och RFC:er som styr arkitekturen.

<!--more-->
---

## Den stora nyheten: Spårbarhet och Korrelation (Traceability)

I version 1.1.0 låg stort fokus på grunderna: namngivning, versionering, felhantering (Problem Details) och paginering. Den absolut största nyheten i version 2.0.0 är det formaliserade fokuset på **Spårbarhet och korrelation**.

I takt med att systemlandskap blir alltmer distribuerade (mikrotjänster) och data delas i allt längre kedjor över myndighetsgränser, räcker det inte att bara logga fel lokalt i ett system. Man måste kunna spåra ett specifikt flöde (ett "trace") från den anropande klienten, genom API-gatewayen, och vidare ner genom de bakomliggande mikrotjänsterna och databaserna.

### W3C Trace Context

För att uppnå distribuerad spårbarhet pekar profil 2.0.0 på användningen av standardiserade HTTP-headers för att skicka vidare ("propagera") spårningsinformation. Standarden som numera är de facto-valet för detta är **W3C Trace Context**.

W3C-standarden definierar huvudsakligen två HTTP-headers:

1. `traceparent`: Den viktigaste headern. Den innehåller spårnings-ID (Trace ID), ett föräldra-ID (Parent Span ID) och flaggor som berättar om anropet ska loggas (samplas) eller inte.
* *Exempel:* `traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`


2. `tracestate`: Tillåter medskick av system- eller leverantörsspecifik spårningsdata utan att korrumpera den universella `traceparent`-headern.

**Vad detta betyder för dig:** När ditt API (API A) gör ett uthopp till en annan tjänst (API B), är det nu ett starkt riktmärke att ditt API "plockar upp" inkommande `traceparent` och skickar det vidare i anropet till API B.

### OpenTelemetry – Din bästa vän för implementationen

För att slippa skriva egen kod som pusslar ihop W3C-headers bör du titta närmare på **OpenTelemetry (OTel)**.

OpenTelemetry är en öppen branschstandard (underbyggd av CNCF) för hur vi instrumenterar applikationer, samt genererar och exporterar telemetridata (Spår, Mätvärden och Loggar). OTel använder *W3C Trace Context* som sitt standardformat. Genom att inkludera OpenTelemetry SDK i din teknikstack (vare sig det är .NET, Java Spring Boot eller Node.js) kommer propageringen av `traceparent`-headers mellan dina tjänster att ske mer eller mindre automatiskt.

## Uppgraderade verktyg: REST API-Profil Lint Processor (RAP-LP) v2.0.0

Vid sidan av den konceptuella 2.0.0-profilen, lanserade Digg även [**version 2.0.0 av REST API-Profil Lint Processor**](https://raplp.digg.se/). Det här är det öppna verktyg som används för att validera om din OpenAPI-specifikation (.yaml eller .json) faktiskt följer den nationella profilen.

Nyheter i verktyget som gör din vardag enklare:

* **API-läge & webbgränssnitt:** Tidigare var linter-verktyget enbart tillgängligt i kommandotolken (CLI). Den nya versionen kompletteras med ett webb-ramverk och ett REST-baserat gränssnitt. Detta gör att det blir otroligt mycket enklare att bygga in valideringen direkt i era CI/CD-pipelines (t.ex. GitHub Actions eller Azure DevOps).
* **DIGG:s nya centrala webbtjänst:** Om din organisation inte vill eller kan drifta Lint Processorn lokalt i er egen miljö, tillhandahåller Digg nu en öppen webbtjänst där ni direkt kan testa och validera era specifikationer online.

## Bibehållna principer och RFC:er – Glöm inte grunderna!

Även om spårbarhet är den skinande nya funktionen, bygger version 2.0.0 stolt vidare på de robusta grunderna från 1.1.0. Du måste fortfarande ha järnkoll på följande IETF-standarder (RFC:er):

* **Standardiserad felhantering (RFC 9457 / RFC 7807):** Specifikationen "Problem Details for HTTP APIs" gäller fortfarande. Svarar ditt API med ett fel (4xx eller 5xx) *ska* du svara med Content-Type `application/problem+json` och en strukturerad payload som förklarar felet. *(Notera att RFC 7807 numera har ersatts och uppdaterats tekniskt via RFC 9457).*
* **HTTP Semantik (RFC 9110):** Rätt HTTP-metod (GET, POST, PUT, PATCH, DELETE) på rätt plats och strikt korrekt nyttjande av HTTP-statuskoder förblir avgörande.
* **Säkerhet (OAuth 2.0 / OpenID Connect - RFC 6749 etc):** Profilen ställer fortsatt krav på modern och beprövad token-baserad autentisering och auktorisation.

## Namnstandarder och Pluralformer – Vad gäller?

När man diskuterar uppdateringar av API-profiler är det lätt att snöa in på tunga tekniska nyheter som distribuerad spårbarhet (Trace Context), men vi får inte glömma bort grundstenarna i god API-design: **URL-format och namngivning av resurser**.

En av de absolut vanligaste frågorna när det kommer till REST-design är: *"Ska resursen heta `/anstalld` eller `/anstallda`?"*

Diggs nationella REST API-profil står fast vid etablerad "best practice" för RESTful design. Samma gyllene regler gäller fortfarande för namngivning:

1. **Substantiv, inte verb:** Resurser ska namnges som substantiv. URL:en beskriver *vad* du interagerar med, medan HTTP-metoden (GET, POST, DELETE) beskriver *handlingen*.
* **Fel:** `/get-anstallda`


2. **Alltid Pluralform:** Resurser ska *alltid* namnges i pluralform, även i de fall där sökningen eller anropet förväntas returnera exakt en (eller noll) träffar. En resurs representerar en samling (collection).
* **Rätt:** `/organisationer/5560125790`
* **Fel:** `/bokning` (ska vara `/bokningar`)


3. **Kebab-case och gemener:** Resurser och stigar (paths) i URL:en ska uteslutande skrivas med gemener (små bokstäver). Om ett resursnamn består av flera ord ska dessa separeras med ett bindestreck (`-`), vilket kallas *kebab-case*.
* **Rätt:** `/personliga-uppgifter`
* **Fel:** `/TJANSTER` eller `/personligaUppgifter`



### Förtydliganden kring "Samlingar" (Collections)

I de senaste uppdateringarna av profilen (redan under version 1.2.0-cykeln och som naturligt följer med in i 2.0.0-tänket) har Digg förtydligat begreppet *Samling* (Collection) i namnsättningskonventionerna. En samling är en lista med resurser av samma typ. Profilen gör det tydligt att man i backend-systemet kan arbeta med logiska nycklar eller UUID:n, men att resursen som exponeras utåt via API-gatewayen konsekvent ska dölja intern databaslogik (som sekventiella id:n) bakom en välformulerad, pluraliserad URI.

Så, även om ni uppgraderar era verktyg till v2.0.0, kom ihåg: **Plural är fortfarande lagen.** Skriv inte `/kvitto/123`, skriv `/kvitton/123`.

---

## Sammanfattning: Checklista för utvecklaren

Om du ska migrera tankesättet från 1.1.0 till 2.0.0, gör följande:

1. **Börja med Spårbarheten:** Se över hur era nuvarande API:er tar emot, loggar och skickar vidare HTTP-headers för spårbarhet.
2. **Kolla på OpenTelemetry:** Om ni inte redan använder OpenTelemetry för loggning och distribuerad spårning är det dags att göra ett Proof of Concept.
3. **Uppdatera era linting-verktyg:** Bygg in RAP-LP (REST API-Profil Lint Processor) v2.0.0 i era bygg-pipelines för att omedelbart upptäcka om ni bryter mot den nya API-profilen under utvecklingens gång.
4. **Fortsätt följa grundprinciperna:** Se till att ni fortfarande följer [RFC 9457 för felhantering](https://www.rfc-editor.org/rfc/rfc9457.html), [RFC 9110 för HTTP-semantik](https://www.rfc-editor.org/rfc/rfc9110.html) och [OAuth 2.0/OpenID Connect för säkerhet](https://oauth.net/2/) .
5. **Granska era resursnamn:** Kontrollera att alla resurser är substantiv, plural och skrivna i kebab-case.


### Källor och vidare fördjupning

För den som vill gräva djupare (och det rekommenderar vi att du gör), finns här alla relevanta länkar:

* **Om DIGG:s REST API-profil:** [Sveriges Dataportal - Om profilen](https://www.dataportal.se/rest-api-profil/om-rest-api-profilen)
* **Specifikation för Spårbarhet och Korrelation:** [Dataportalens sektion om spårbarhet](https://www.dataportal.se/rest-api-profil/sparbarhet-och-korrelation)
* **Verktyget RAP-LP (REST API-Profil Lint Processor) v2.0.0:** [DIGG:s GitHub-repo för Lint Processorn](https://github.com/DIGG:sweden/rest-api-profil-lint-processor)
* **W3C Trace Context:** [Läs den officiella W3C-rekommendationen](https://www.w3.org/TR/trace-context/)
* **OpenTelemetry:** [Officiell dokumentation](https://opentelemetry.io/docs/)
* **Problem Details för felhantering:** [RFC 9457 (ersätter RFC 7807)](https://www.rfc-editor.org/rfc/rfc9457.html)
* **HTTP Semantik:** [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)
* **OAuth 2.0 / OpenID Connect:** [OAuth 2.0](https://oauth.net/2/) och [OpenID Connect](https://openid.net/connect/)
* **Pluralisering och namngivning:** [DIGG:s sektion om resurser och namngivning](https://www.dataportal.se/rest-api-profil/resurser#:~:text=Namns%C3%A4ttningskonvention%20f%C3%B6r%20resurser)

*** *Genom att anamma version 2.0.0 av profilen ser du inte bara till att ditt API är kompatibelt med framtidens nationella infrastruktur – med inbyggd spårbarhet bygger du också ett system som är oändligt mycket trevligare att drifta, övervaka och felsöka.*
