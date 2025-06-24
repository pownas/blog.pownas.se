# Ändringslogg för blog.pownas.se

Denna fil innehåller en historik över ändringar som gjorts i bloggen.

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
3. För flera kategorier, använd kommaseparering: 
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
- Förbättrad responsivitet och användarupplevelse för navigeringsmenyn (navbar) på både mobil och desktop. Hamburger-meny och dropdowns fungerar nu bättre på alla enheter.

### Tekniska detaljer
- Navigeringsmenyn använder nu CSS Flexbox för bättre layoutkontroll
- Dropdown-menyerna är mer stabila och följer med vid scrollning
- Mobilmenyn (hamburger-meny) är förbättrad för enklare användning
- Dessa ändringar säkerställer en mer enhetlig och användarvänlig navigering på hela webbplatsen
