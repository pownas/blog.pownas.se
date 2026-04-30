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
│   └── main.scss           # Enda stilfilen för hela sidan
├── img/                    # Bilder för bloggposter
│   └── blogposts/
├── _config.yml             # Jekyll-konfiguration
├── CHANGELOG.md            # Ändringslogg
├── Gemfile                 # Ruby gem-beroenden
├── index.html              # Startsidan
├── POSTING-GUIDE.md        # Guide för att skapa inlägg
└── README.md               # Denna fil
```

## Att komma igång lokalt

För att köra denna blogg lokalt behöver du Ruby och Jekyll. Följ dessa steg:

### För snabb start med Podman Desktop (Rekommenderat)

Det enklaste sättet att köra bloggen lokalt på Windows är via Podman Desktop och den medföljande containerkonfigurationen. Detta kräver ingen lokal installation av Ruby.

1. Installera [Podman Desktop](https://podman-desktop.io/downloads) (eller via winget: `winget install -e --id RedHat.Podman-Desktop`).
2. Starta/initialisera Podman Machine (görs vanligtvis via Podman Desktop GUI).
3. Öppna en terminal (t.ex. PowerShell) i projektets rotmapp.
4. Starta miljön:
   ```powershell
   podman-compose up
   ```
   *(Har du aktiverat Docker-kompabilitet kan du även använda `podman compose up` eller `docker compose up`).*
5. Öppna sajten i din webbläsare på [http://localhost:4000](http://localhost:4000).

Alla ändringar du gör i filer återspeglas automatiskt i webbläsaren tack vare volymmontering och live-reloading.

#### Hantera containern via GUI

När containern är startad kan du enkelt övervaka loggar, stoppa eller starta om tjänsten direkt inifrån gränssnittet i **Podman Desktop**.

#### Felsökning: "podman-compose not recognized"

Om du får felmeddelandet att `podman-compose` inte hittas eller att "compose provider failed", beror det på att Compose-tillägget saknas i din PATH.

**Lösning A (Rekommenderat):**
1. Öppna **Podman Desktop**.
2. Gå till **Settings** (kugghjulet) -> **Resources**.
3. Leta upp sektionen för **Compose** och klicka på **Setup** eller **Install**.
4. Starta om din terminal.

**Lösning B (Kör utan Compose):**
Om du inte vill installera Compose kan du köra dessa två kommandon manuellt i terminalen:
```powershell
podman build -t jekyll-blog .
podman run --rm -p 4000:4000 -v "${PWD}:/srv/jekyll" jekyll-blog
```

---

### Alternativ 2: Lokal installation (kräver Ruby)

För att köra denna blogg lokalt utan containrar behöver du Ruby och Jekyll. Följ dessa steg:

#### Förutsättningar

- Ruby (minst version 2.5.0)
- RubyGems
- GCC och Make (för att kompilera utökningar)

#### Installation

1. Klona repot:
   ```powershell
   git clone https://github.com/pownas/blog.pownas.se.git
   cd blog.pownas.se
   ```

2. Installera beroenden:
   ```powershell
   bundle install
   ```

3. Starta Jekyll-servern:
   ```powershell
   bundle exec jekyll serve
   ```

   För snabbare byggning under utveckling:
   ```powershell
   bundle exec jekyll serve --incremental
   ```

4. Besök [http://localhost:4000](http://localhost:4000) i din webbläsare.

## Köra projektet lokalt

Det rekommenderade sättet att köra bloggen lokalt är via Podman. Detta säkerställer att du använder samma Ruby-miljö som i produktion utan att behöva installera Ruby på din egen dator.

### 1. Bygg containern
Första gången, eller om du ändrat `Gemfile`, behöver du bygga din container-image. Kör detta från projektets rot:
```powershell
podman build -t localhost/blog-site .
```

### 2. Starta bloggen
Kör följande kommando för att starta en webbserver på `http://localhost:4000`:
```powershell
podman run --rm -p 4000:4000 -v "${PWD}:/usr/src/app" localhost/blog-site
```
Bloggen kommer nu att vara tillgänglig i din webbläsare.

**Angående inkrementell uppdatering:**  
Du behöver **inte** bygga om din container (`podman build`) för varje text- eller designändring. Tack vare volymmonteringen (`-v`) och Jekylls `--watch`-läge kommer din sajt att **automatiskt och inkrementellt uppdateras** så fort du sparar en fil. Bygg bara om containern om du har ändrat i `Gemfile`.

### 3. Uppdatera `Gemfile.lock` (viktigt)
Om du har ändrat din `Gemfile` och behöver uppdatera `Gemfile.lock`, behöver du *inte* installera Ruby lokalt. Kör istället följande kommando. Det startar en tillfällig container som bara kör `bundle install` och sedan stänger ner sig.
```powershell
podman run --rm -v "${PWD}:/usr/src/app" localhost/blog-site bundle install
```
Detta kommer att uppdatera `Gemfile.lock` i din lokala projektmapp. Checka in den uppdaterade filen i Git efteråt.

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
