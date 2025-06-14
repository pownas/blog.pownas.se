# Så här skapar du nya bloggposter

Detta är en guide för hur du skapar nya bloggposter på blog.pownas.se.

## Skapa en ny bloggpost

1. Skapa en ny fil i mappen `_posts` med följande namnkonvention:
   ```
   ÅÅÅÅ-MM-DD-titel-med-bindestreck.md
   ```
   
   Exempel: `2025-06-15-min-nya-bloggpost.md`

2. Lägg till följande i början av filen (detta kallas "front matter"):

   ```yaml
   ---
   layout: post
   title: "Din titeln på bloggposten"
   date: 2025-06-15
   category: "Kategorinamn"
   ---
   ```

3. För att använda flera kategorier, separera dem med kommatecken:

   ```yaml
   category: "Kategori1,Kategori2"
   ```

4. Skriv bloggpostens innehåll i Markdown-format under front matter.

## Markdown-formatering

Här är några grundläggande Markdown-kommandon:

### Rubriker

```markdown
# Huvudrubrik (H1)
## Sekundär rubrik (H2)
### Tredje nivåns rubrik (H3)
```

### Text-formatering

```markdown
*Kursiv text*
**Fet text**
***Fet och kursiv text***
```

### Länkar

```markdown
[Länktext](https://www.example.com)
```

### Bilder

```markdown
![Alternativ text](sökväg/till/bild.jpg)
```

För att länka till bilder i din blog, använd relativa sökvägar:

```markdown
![Beskrivning av bilden](/img/blogposts/min-bild.jpg)
```

### Kodblock

För att visa kod, använd tre backticks (```) före och efter koden:

```markdown
```html
<div class="example">
  <p>Detta är ett exempel på HTML-kod</p>
</div>
```
```

### Listor

Numrerade listor:

```markdown
1. Första punkten
2. Andra punkten
3. Tredje punkten
```

Punktlistor:

```markdown
- Första punkten
- Andra punkten
- Tredje punkten
```

## Kategorier

Tillgängliga kategorier är:

- Hemsidan
- HTML-Code
- JavaScript-Code

Om du vill skapa en ny kategori, se [CHANGELOG.md](CHANGELOG.md) för instruktioner.

## Publicering

När du är klar med din bloggpost, gör en commit och push till GitHub-repositoryt. GitHub Pages kommer automatiskt att bygga din sida med den nya bloggposten.
