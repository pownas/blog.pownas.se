# Ändringslogg för blog.pownas.se

Denna fil innehåller en historik över ändringar som gjorts i bloggen.

## 2025-06-24 - Fixade tema-persistens mellan sidnavigeringar (del 20)

### Fixat
- Åtgärdat problem där temat återställdes vid navigering mellan sidor
- Förbättrat felhantering för localStorage-användning 
- Säkerställt att temat konsekvent sparas och läses från localStorage
- Lagt till loggning för att underlätta framtida felsökning

### Tekniska detaljer
- Förbättrat script i head-taggen för att korrekt läsa och validera temainställning
- Implementerat robustare typkontroll för sparade temavärden
- Lagt till try-catch-block för att hantera eventuella localStorage-fel
- Förbättrat logiken för att konsistent tillämpa samma tema mellan sidnavigeringar

## 2025-06-24 - Fixade pagineringsbuggar och förbättrad temabyte (del 19)

### Fixat
- Åtgärdat 404-fel vid navigering till /sida/1 genom att dirigera om till startsidan
- Förbättrat mörkt tema-hantering för att förhindra "flimmer" vid sidladdning
- Säkerställt att temainställningen läses från localStorage direkt vid sidladdning
- Förbättrat pagineringslogiken för att korrekt hantera alla sidnummer

### Tekniska detaljer
- Lagt till tidigt script i head-taggen som tillämpar tema innan sidladdning
- Förbättrat pagineringslogiken för att använda hemsidans rot för första sidan
- Optimerat localStorage-funktionalitet för att säkerställa enhetlig temakänsla
- Säkerställt sömlös navigering mellan alla pagineringssidor

## 2025-06-24 - Förbättrad paginering med modern design (del 18)

### Tillagt
- Helt omdesignad paginering med tydliga navigeringsknappar
- Visuell indikator för föregående/nästa med pilar istället för punkter
- Sidonumrering som visar flera sidor samtidigt för enklare navigation
- Ellipsis (...) för att indikera att det finns fler sidor

### Fixat
- Ersatt enkla punkter (•) med tydliga "Föregående" och "Nästa" knappar
- Förbättrat tillgänglighet med aria-attribut för skärmläsare
- Lagt till responsiv design som anpassar sig till mobilskärmar
- Konsekvent design i både ljust och mörkt tema

### Tekniska detaljer
- Förbättrad Liquid-logik för att visa relevanta sidonummer
- Intelligent hantering av första/sista sidan och ellipsis
- Förbättrad stilsättning med flexbox för bättre layout
- Tydligare visuellt tillstånd för inaktiva navigeringsknappar

## 2025-06-24 - Förbättrad läsbarhet för kodblock i mörkt läge (del 17)

### Tillagt
- Dedikerade stilar för kodblock och syntaxmarkering i både ljust och mörkt tema
- Förbättrad kontrast för `.language-plaintext.highlighter-rouge` kodblock
- Konsekvent typografi för alla kodblock på sidan

### Fixat
- Åtgärdat kontrastproblem där kod var oläslig i mörkt läge (ljus text på ljus bakgrund)
- Förbättrad synlighet för kodblock med språkspecifika stilar
- Säkerställt att alla kodblock uppfyller WCAG kontrastkrav i båda teman

### Tekniska detaljer
- Lagt till en ny sektion för kodblock och syntaxmarkering i stilmallen
- Anpassat kodblock för både inline-kod och större kodblock
- Förbättrat utseendet på kodblock med mer konsekvent stil och bättre kantlinje

## 2025-06-24 - Förbättrad temaväxlare och fixad mobilmeny (del 16)

### Tillagt
- Flyttat temaväxlaren från övre höger hörn till sidfoten
- Lagt till ikonbaserad visning för mörkt/ljust läge (sol/måne)
- Förbättrad tooltip för temaväxlarknappen
- Automatisk anpassning av ikonen baserat på aktuellt tema

### Fixat
- Åtgärdat överlappning mellan hamburgermenyn och temaväxlaren på mobila enheter
- Förbättrat utseendet på temaväxlarknappen med bättre kontrast
- Konsekvent temastöd i hela gränssnittet 
- Animeringar och visuell feedback för bättre användarupplevelse

### Tekniska detaljer
- Centraliserat temaväxlarfunktionaliteten till footern
- Lagt till CSS för att styra temaväxlarens utseende i olika lägen
- Förbättrat JavaScript för automatisk anpassning av ikoner

## 2025-06-24 - Förbättrat mörkt tema och kontrastförhållande (del 15)

### Tillagt
- Automatisk detektering av systemets mörkt läge-inställning
- Ökad kontrast i navigationsmenyn för mörkt läge enligt WCAG riktlinjer
- Anpassade färger för dropdown-menyer i mörkt läge

### Fixat
- Löst problemet med svart text på mörk bakgrund i navigationsmenyn
- Förbättrat kontrastförhållande i mörkt läge från 1.06:1 till över 4.5:1
- Säkerställt att alla interaktiva element har tillräckligt med kontrast
- Förbättrat synligheten av dropdown-innehåll i mörkt läge

### Tekniska detaljer
- Lagt till [data-theme="dark"] CSS-selektorer för navigationsmenyn
- Implementerat automatisk lägesinställning baserat på användarens systeminställningar
- Förbättrat UI/UX i mörkt läge med bättre visuella indikatorer för interaktiva element

## 2025-06-24 - Förbättrad mobilnavigering och tillgänglighet (del 14)

### Tillagt
- Förbättrat mobilgränssnitt för navigationsmeny med smidigare interaktioner
- Tangentbordsnavigering för dropdown-menyer på mobila enheter
- Stöd för att stänga menyn med Escape-tangenten
- Visuella indikatorer för aktiva/expanderade tillstånd på mobilmeny

### Fixat
- Förbättrad tillgänglighet i navigationsmenyn med korrekt ARIA-attribut
- Förhindrat scrollning av bakgrunden när mobilmenyn är öppen
- Tydligare visuell indikering av dropdown-menyer på mobila enheter
- Förbättrat fokustillstånd för tangentbordsnavigation

### Tekniska detaljer
- Lagt till en ny CSS-sektion för tillgänglighetsförbättringar
- Förbättrat JavaScript för menyhantering på mobila enheter
- Lagt till hantering av aria-expanded och aria-controls attribut
- Implementerat animationer för dropdown-menyer för bättre användarupplevelse

## 2025-06-24 - WCAG 2 förbättringar för färger och kontrast (del 13)

### Tillagt
- Förbättrade färgkontraster i både ljust och mörkt tema för att möta WCAG 2 riktlinjer
- Fokus-stilar för alla interaktiva element för förbättrad tangentbordsnavigering
- Nya CSS-variabler för fokus-markering med hög kontrast

### Fixat
- Uppdaterat textfärger för bättre läsbarhet och kontrast
- Förbättrat kontrastförhållanden i länkar, knappar och navigeringselement
- Säkerställt tydliga visuella indikationer när element är i fokus
- Standardiserat färgschema för konsekvent design och tillgänglighet

### Tekniska detaljer
- Uppgraderat färgpaletten i CSS-variabler för att uppfylla WCAG 2 AA-standard
- Lagt till dedikerade fokus-stilar för tillgänglighet vid tangentbordsnavigering
- Optimerat kontrast i kategoritaggar, knappar och navigeringselement

## 2025-06-14 - Förbättrad paginering och mörkt tema (del 12)

### Tillagt
- Ny styling för paginering som liknar knappar istället för enkel lista
- Förbättrad visuell feedback vid hover-effekter på pagineringsknappar
- Nya CSS-variabler för bättre stöd av mörkt tema i navigering

### Fixat
- Åtgärdat problem med svart text på svart bakgrund i navigeringen i mörkt läge
- Förbättrat kontrasten i dropdown-menyer för bättre läsbarhet
- Optimerat mobilnavigering för mörkt tema

### Tekniska detaljer
- Implementerat CSS-variabler för navigerings- och dropdown-bakgrunder
- Lagt till dedikerad sektion för pagineringsstilar i CSS-filen
- Säkerställt konsekvent design över både ljust och mörkt tema

## 2025-06-14 - Återställning av SCSS-kommentarer (del 11)

### Tillagt
- Återställt detaljerade kommentarer i main.scss filen
- Förbättrat dokumentationen för varje sektion i stilfilen
- Lagt till beskrivande kommentarer för alla huvudkomponenter

### Tekniska detaljer
- Kommentarer förklarar nu syftet med varje CSS-sektion
- Dokumenterat hur mörkt/ljust tema-systemet fungerar
- Förbättrat förståelsen för hur responsiva stilar är organiserade

## 2025-06-14 - Syntax- och byggkorrigeringar (del 10)

### Fixat
- Åtgärdat syntaxfel i SCSS-filen som förhindrade korrekt byggande
- Omorganiserat och rengjort hela SCSS-koden för bättre struktur
- Säkerställt att alla stilar kompileras korrekt av Jekyll

### Tekniska detaljer
- Korrekt front matter-syntax i SCSS-filen
- Förbättrad organisation med tydlig sektionsuppdelning
- Konsekvent formatering och indrag för bättre läsbarhet

## 2025-06-14 - Förbättrad navigation och layout (del 9)

### Ändrat
- Flyttat tema-växlarknappen från övre högra hörnet till sidfoten för att undvika överlappning med navigationen
- Förbättrat den mobila navigationens funktion och användbarhet
- Lagt till tydligare visuella indikatorer för dropdown-menyer på mobila enheter
- Optimerat JavaScript för menyer för bättre prestanda och användarupplevelse

### Tekniska detaljer
- Tagit bort position: fixed från tema-knappen för att frigöra skärmutrymme
- Förbättrat mobilmenyn med bättre stängningslogik och tydligare interaktioner
- Lagt till ARIA-attribut för bättre tillgänglighet på dropdown-menyer
- Förhindrar scrollning av bakgrund när menyn är öppen på mobila enheter

## 2025-06-14 - CSS-optimering och kommentering (del 8)

### Ändrat
- Optimerat CSS-filens struktur med förbättrad organisation
- Lagt till omfattande kommentarer i CSS-filen för enklare underhåll
- Infört förbättrat temastöd för ljust/mörkt läge med CSS-variabler
- Fixat potentiella stilproblem i olika webbläsare

### Tekniska detaljer
- CSS-filen är nu organiserad i logiska sektioner (tema, kategorier, navigation, bloggposter, responsiv design)
- Konverterat hårdkodade färgvärden till CSS-variabler för konsekvent utseende
- Säkerställt att både ljust och mörkt tema fungerar korrekt
- Eliminerat kodduplicering som tidigare fanns i filen

## 2025-06-14 - CSS-konsolidering (del 7)

### Ändrat
- Konsoliderat alla CSS-stilar till en enda fil (assets/main.scss)
- Tagit bort den oanvända _styles/style.css filen
- Säkerställt att alla stilar finns bevarade i main.scss

### Tekniska detaljer
- Jekyll kompilerar main.scss till main.css, vilket är den enda stilfilen som refereras i head.html
- Detta gör att webbplatsen har färre HTTP-förfrågningar och därmed snabbare laddningstider
- Enklare underhåll när alla stilar finns på ett ställe

## 2025-06-14 - Prestandaoptimering (del 6)

### Tillagt
- Aktiverat inkrementell byggning (incremental: true) i _config.yml
- Detta gör byggprocessen snabbare genom att endast bygga om ändrade filer

### Tekniska detaljer
- Inkrementell byggning (--incremental) i Jekyll håller reda på vilka filer som har ändrats
- Det minskar byggtiden avsevärt för större webbplatser
- Särskilt användbart under lokal utveckling för snabbare förhandsgranskning
- Inga negativa effekter på slutlig webbplats, bara en prestandaförbättring

## 2025-06-14 - Syntax buggfix (del 5)

### Fixat
- Åtgärdat Liquid-syntaxfel i header.html där det fanns duplicerade HTML-taggar och en obalanserad `endif`-tag
- Borttaget onödiga extra stängningstaggar för att möjliggöra korrekt Liquid-rendering

### Tekniska detaljer
- Jekyll/Liquid är känslig för korrekt syntax i mallfilerna
- Felet "Unknown tag 'endif'" uppstår när det finns obalanserade Liquid-kontrollstrukturer
- Duplicerade HTML-taggar kan också orsaka oväntade renderingsproblem

## 2025-06-14 - Förbättrad navigering och startsida (del 4)

### Fixat
- Åtgärdat problem med visning av blogg på GitHub Pages där bara en bild visades
- Korrigerat baseurl och url i _config.yml för att matcha GitHub Pages struktur
- Tagit bort konflikerande --index.html från rot-mappen
- Flyttat bilden IMG_1903.jpeg till img-mappen för bättre organisation

### Tillagt
- Förbättrad navigeringsmeny med dropdown-menyer för kategorier och senaste inlägg
- Sida för att visa alla bloggposter (/alla-inlagg/)
- Bättre styling av startsidan med presentation och framhävda inlägg
- Responsiv design för dropdown-menyer på mobila enheter

### Ändrat
- Omdesignad startsida som visar de tre senaste bloggposterna
- Förbättrat utseende på bloggpostlistan
- Mer användarvänlig navigering med dropdown-menyer

## 2025-06-14 - Buggfixar och startsidekorrigering (del 3)

### Fixat
- Åtgärdat problem med pagination genom att byta från index.md till index.html
- Lagt till explicit konfiguration för Jekyll plugins i _config.yml
- Förbättrat startsidan för att visa bloggposter och kategorier korrekt

### Tekniska detaljer
- Jekyll kräver en index.html-fil (inte index.md) för att pagination ska fungera
- Plugins-konfiguration i _config.yml behöver inkludera jekyll-paginate explicit
- Dessa ändringar säkerställer att bloggposter och kategorier visas korrekt på GitHub Pages

## 2025-06-14 - Buggfixar och kompletteringar (del 2)

### Fixat
- Korrigerat YAML-syntaxfel i bloggposten `2025-01-09-comparing-lists.md`
- Lagt till filändelse (.md) på bloggposten om DevSum 2025
- Skapade ytterligare kategorifiler för alla befintliga kategorier som används i bloggposterna:
  - C-Sharp-Code
  - C#
  - Advent-of-Code
  - Visual Studio
  - Youtube
  - ArvidsonFoto
  - .NET
  - Konferens

### Tillagt
- Uppdaterad README.md med detaljerade instruktioner för projektet
- Tydligare anvisningar för lokal utveckling och deployment
- Dokumentation för hur man hanterar kategorier korrekt

### Viktiga noteringar
- Kategoriformat i front matter ska vara kommaseparerade inom samma sträng: `category: "Kategori1,Kategori2"`
- Inte: `category: "Kategori1", "Kategori2"` (fel format som orsakar YAML-fel)

## 2025-06-14 - Stor omstrukturering av bloggplattformen (del 1)

### Tillagt
- Stöd för kategorisering av bloggposter
- Kategorilistning på startsidan
- Kategorisidor för alla tillgängliga kategorier
- Förbättrad styling för bloggen
- Bättre navigering mellan olika delar av bloggen
- Uppdaterad layout för bloggposter med kategori-taggar

### Ändrat
- Förbättrad konfiguration i `_config.yml`
- Uppdaterade Gemfile för att inkludera nödvändiga paket
- Omstrukturerade layoutfiler för att stödja kategorier
- Förbättrade header- och footer-element
- Ändrade strukturen på index.md för att använda korrekt layout

### Tekniska detaljer
- Bloggen använder nu Jekyll som statisk webbplattform
- Minima-temat används som bas men med anpassningar
- Kategorierna sparas i markdown-filer under mappen `_category`
- Bloggposter sparas i markdown-filer under mappen `_posts`
- Bloggposter kan taggas med flera kategorier genom att använda kommaseparerade värden i front matter
- Exempel på kategoritaggning i front matter: `category: "HTML-Code,JavaScript-Code"`

### Hur man lägger till en ny bloggpost
1. Skapa en ny fil i mappen `_posts` med namnformatet: `YYYY-MM-DD-titel-för-posten.md`
2. Lägg till front matter med layout, titel, datum och kategori:
   ```yaml
   ---
   layout: post
   title: "Din titeln på posten"
   date: 2025-06-14
   category: "Kategorinamn"
   ---
   ```
3. För flera kategorier, använd kommasepering: 
   ```yaml
   category: "Kategori1,Kategori2"
   ```
4. Skriv innehållet i markdown-format

### Hur man lägger till en ny kategori
1. Skapa en ny fil i mappen `_category` med filnamnet: `kategorinamn.md`
2. Lägg till front matter:
   ```yaml
   ---
   layout: category
   title: Visningsnamn för kategorin
   category_name: KategorinamnetSomAnvändsIBloggposter
   permalink: /kategori/kategorinamn/
   description: Beskrivning av kategorin
   ---
   ```
3. Se till att `category_name` matchar det som används i bloggposterna

## 2025-06-14 - Temabyte och mörkt läge

### Tillagt
- Lagt till stöd för ljust/mörkt tema (dark mode) med dark som standard och en knapp för att byta tema.

### Tekniska detaljer
- Temat växlar mellan ljust och mörkt läge baserat på användarens val
- Standardläget är mörkt för att minska ögonbelastning i svagt ljus
- En knapp har lagts till i sidfoten för att enkelt byta tema
- Valet av tema sparas i webbläsarens lokal lagring så att det kvarstår vid uppdatering av sidan

## 2025-06-14 - Förbättrad navigering (del 7)

### Fixat
- Förbättrad responsivitet och användarupplevelse för navigeringsmenyn (navbar) på både mobil och desktop. Hamburger-meny och dropdowns fungerar nu bättre på alla enheter

### Tekniska detaljer
- Navigeringsmenyn använder nu CSS Flexbox för bättre layoutkontroll
- Dropdown-menyerna är mer stabila och följer med vid scrollning
- Mobilmenyn (hamburger-meny) är förbättrad för enklare användning
- Dessa ändringar säkerställer en mer enhetlig och användarvänlig navigering på hela webbplatsen
