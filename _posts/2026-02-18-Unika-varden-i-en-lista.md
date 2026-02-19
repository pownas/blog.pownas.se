---
layout: post
title: "Hur många unika värden har vi i en lista?"
date: 2026-02-18
category: "c-sharp,programmering"
---


För att räkna ut hur många unika värden som finns i en lista med hjälp av LINQ i C#, så kan du använda metoden `.Distinct()`.

## Här är lösningen:
Lösning med `.Distinct().Count()`.  
Metoden `Distinct()` filtrerar listan så att alla dubbletter försvinner. Därefter använder du `Count()` för att se hur många som är kvar.
```cs
using System;
using System.Collections.Generic;
using System.Linq; // Viktigt! Krävs för LINQ

// Exempel 1: Samma ID upprepat
List<string> lista1 = new List<string> { "Id1", "Id1", "Id1" };

int unikaILista1 = lista1.Distinct().Count();
Console.WriteLine($"Lista 1 har {unikaILista1} unikt id."); // Output: 1

// ---------------------------------------------------------

// Exempel 2: Blandade ID:n
List<string> lista2 = new List<string> { "Id1", "Id2", "Id1" };

int unikaILista2 = lista2.Distinct().Count();
Console.WriteLine($"Lista 2 har {unikaILista2} unika id:n."); // Output: 2
```

Om du vill göra en kontroll (If-sats)
Om du vill skriva logik baserat på detta, till exempel "Om det bara finns 1 unikt ID, gör X, annars gör Y":
`var antalUnika = lista.Distinct().Count();`

```cs
if (antalUnika == 1)
{
    Console.WriteLine("Alla värden i listan är likadana (eller listan har bara 1 element).");
}
else if (antalUnika > 1)
{
    Console.WriteLine("Det finns flera olika värden i listan.");
}
``` 

## Viktigt att tänka på (Case Sensitivity)
C# skiljer på stora och små bokstäver som standard.  
"Id1" och "id1" räknas som 2 unika värden.  
Om du vill ignorera stora/små bokstäver gör du så här:  
```cs
// Detta ignorerar om det är "ID1" eller "id1"
int antal = lista.Distinct(StringComparer.OrdinalIgnoreCase).Count();
```

## Grupper ihop resultatet
Behöver du hjälp att gruppera dem för att se exakt vilka som det finns dubbletter av?

Då använder vi GroupBy. Det är det bästa sättet att sortera upp listan i "högar" baserat på värdet, så att du kan se antal av varje.

Här är två vanliga scenarion:
### 1. Se hur många det finns av varje ID
Detta ger dig en lista på varje unikt ID och antalet gånger det förekommer.

```cs
var lista = new List<string> { "Id1", "Id2", "Id1", "Id3", "Id2", "Id1" };

// Gruppera på själva värdet (x => x)
var grupper = lista.GroupBy(x => x)
                   .Select(g => new { 
                       Id = g.Key, 
                       Antal = g.Count() 
                   });

foreach (var grupp in grupper)
{
    Console.WriteLine($"Värde: {grupp.Id}, Antal: {grupp.Antal}");
}

// Output:
// Värde: Id1, Antal: 3
// Värde: Id2, Antal: 2
// Värde: Id3, Antal: 1
``` 

### 2. Hitta BARA de som är dubbletter
Om du vill filtrera bort de som är unika och bara se de som ställer till problem (finns mer än 1 gång):

```cs
var dubbletter = lista.GroupBy(x => x)
                      .Where(g => g.Count() > 1) // Filtrera: Bara de med mer än 1
                      .Select(g => g.Key);       // Plocka ut själva ID:t

Console.WriteLine("Dessa ID:n finns det dubbletter av: " + string.Join(", ", dubbletter));

// Output:
// Dessa ID:n finns det dubbletter av: Id1, Id2
```

Kort förklaring:  
* `GroupBy(x => x)`: Skapar en grupp för varje unikt värde.  
* `g.Key`: Är värdet (t.ex. "Id1").  
* `g.Count()`: Är hur många gånger det värdet fanns i listan.



