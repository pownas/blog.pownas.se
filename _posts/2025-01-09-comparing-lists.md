---
layout: post
title: "Jämföra 2st listor med varandra"
date: 2025-01-09
category: "C-Sharp-Code", "C#"
---

Här är ett enkelt sätt att jämföra två listor med varandra för att se vilka objekt som saknas i ena eller andra listan:

```csharp

List<string> list1Data = ["Monkey", "Donkey", "Mouse", "Elephant", "Dog"];
List<string> list2Data = ["Monkey", "House", "Elephant", "Dog", "Cat"];
 
 
// DIFF kollen::
 
 
list1Data = list1Data.OrderBy(x => x).ToList();
list2Data = list2Data.OrderBy(x => x).ToList();
 
Console.WriteLine("Elements in list1Data:");
foreach (var item in list1Data)
{
    Console.Write(item);
    Console.Write(", ");
}
 
Console.WriteLine("");
Console.WriteLine("");
Console.WriteLine("Elements in list2Data:");
foreach (var item in list2Data)
{
    Console.Write(item);
    Console.Write(", ");
}
 
Console.WriteLine("");
Console.WriteLine("");
 
Console.WriteLine(list1Data.SequenceEqual(list2Data) ? 
                  "Lists are equal" : 
                  "Lists differ");
 
var differences1 = list1Data.Except(list2Data);
var differences2 = list2Data.Except(list1Data);
 
Console.WriteLine("");
Console.WriteLine("Elements in list1Data but not in list2Data:");
foreach (var item in differences1)
{
    Console.WriteLine(item);
}
 
Console.WriteLine("");
Console.WriteLine("Elements in list2Data but not in list1Data:");
foreach (var item in differences2)
{
    Console.WriteLine(item);
}

//// Output:


``` 

Detta ger en enkel och tydlig jämförelse av de två listorna. 

