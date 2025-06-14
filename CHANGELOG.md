# Ändringslogg för blog.pownas.se

Denna fil innehåller en historik över ändringar som gjorts i bloggen.

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
