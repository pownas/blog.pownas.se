# blog.pownas.se

En personlig blogg byggd med Jekyll och GitHub Pages.

- **GitHub-visning:** [https://pownas.github.io/blog.pownas.se/](https://pownas.github.io/blog.pownas.se/)
- **Extern länk:** [https://blog.pownas.se/](https://blog.pownas.se/) (när den är konfigurerad)
- **Tidigare:** [https://Jonas.ArvidsonFoto.se/](https://Jonas.ArvidsonFoto.se/)

## Om projektet

Detta är en statisk blogg byggd med Jekyll och hostad på GitHub Pages. Bloggen innehåller funktionalitet för kategorisering av inlägg, paginering och en responsiv design.

## Struktur

Projektet följer standard Jekyll-struktur:

```
blog.pownas.se/
├── _category/              # Kategoridefinitioner
│   ├── hemsidan.md
│   ├── html-code.md
│   └── javascript-code.md
├── _includes/              # Återanvändbara HTML-komponenter
│   ├── footer.html
│   ├── head.html
│   └── header.html
├── _layouts/               # Layoutmallar
│   ├── category.html
│   ├── default.html
│   ├── home.html
│   ├── page.html
│   └── post.html
├── _posts/                 # Bloggposter (Markdown)
│   ├── YYYY-MM-DD-titel.md
│   └── ...
├── assets/                 # CSS, JavaScript, bilder
│   └── main.scss
├── img/                    # Bilder för bloggposter
│   └── blogposts/
├── _config.yml             # Jekyll-konfiguration
├── CHANGELOG.md            # Ändringslogg
├── Gemfile                 # Ruby gem-beroenden
├── index.md                # Startsidan
├── POSTING-GUIDE.md        # Guide för att skapa inlägg
└── README.md               # Denna fil
```

## Att komma igång lokalt

För att köra denna blogg lokalt behöver du Ruby och Jekyll. Följ dessa steg:

### Förutsättningar

- Ruby (minst version 2.5.0)
- RubyGems
- GCC och Make (för att kompilera utökningar)

### Installation

1. Klona repot:
   ```bash
   git clone https://github.com/pownas/blog.pownas.se.git
   cd blog.pownas.se
   ```

2. Installera beroenden:
   ```bash
   bundle install
   ```

3. Starta Jekyll-servern:
   ```bash
   bundle exec jekyll serve
   ```

4. Besök [http://localhost:4000](http://localhost:4000) i din webbläsare.

### För snabb start med Docker

Om du föredrar Docker:

```bash
docker run --rm -p 4000:4000 -v $(pwd):/site bretfisher/jekyll-serve
```

## Skapa innehåll

### Bloggposter

1. Skapa en ny fil i mappen `_posts` med namnformatet `YYYY-MM-DD-title.md`
2. Lägg till front matter:
   ```yaml
   ---
   layout: post
   title: "Din rubrik här"
   date: YYYY-MM-DD
   category: "Kategorinamn"
   ---
   ```
3. För flera kategorier, använd kommaseparering: `category: "Kategori1,Kategori2"`
4. Skriv ditt innehåll i Markdown under front matter

För detaljerade instruktioner, se [POSTING-GUIDE.md](POSTING-GUIDE.md).

### Kategorier

Alla kategorier definieras i mappen `_category/`. För att lägga till en ny kategori:

1. Skapa en ny fil `kategorinamn.md` i mappen `_category/`
2. Lägg till front matter:
   ```yaml
   ---
   layout: category
   title: Visningsnamn
   category_name: KategorinamnetSomAnvändsIBloggposter
   permalink: /kategori/kategorinamn/
   description: Beskrivning av kategorin
   ---
   ```

## Anpassning

### Konfiguration

De flesta inställningarna finns i `_config.yml`. Här kan du ändra:

- Sidrubrik och beskrivning
- Sociala medier-länkar
- Baswebbadress
- Antal inlägg per sida
- Och mer...

### Utseende

- Lägg till eller ändra stilar i `assets/main.scss`
- Modifiera layouter i mappen `_layouts/`
- Ändra sidhuvud/sidfot i mappen `_includes/`

## Deployment

Denna blogg är konfigurerad för att automatiskt byggas och publiceras till GitHub Pages. Varje gång du pushar ändringar till main-branchen kommer GitHub Actions att bygga sidan och publicera den.

För att använda en anpassad domän, följ GitHub Pages-dokumentationen.

## Mer information

- [Jekyll dokumentation](https://jekyllrb.com/docs/)
- [GitHub Pages dokumentation](https://docs.github.com/en/pages)
- [Ändringshistorik](CHANGELOG.md)
