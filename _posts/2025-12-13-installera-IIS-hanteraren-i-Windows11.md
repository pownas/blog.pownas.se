---
layout: post
title: "Installera IIS Hanteraren i Windows 11"
date: 2025-12-13 14:07:10 +0200
category: "c-sharp,.NET,programmering"
---

Här kommer en liten guide över hur man kan aktivera och installera IIS fjärr  hanteraren via Windows 11.

Det man då behöver göra är att gå in under: Start -> Sök: Kontrollpanelen -> Program -> "Aktivera eller inaktivera Windows-funktioner" -> Bocka först i "Internet Information Services" (IIS).

![Kontrollpanelen/Program](/img/blogposts/2025-12-13-IIS-hanteraren-Win11-bild-0.png)  
![IIS](/img/blogposts/2025-12-13-IIS-hanteraren-Win11-bild-1.png)

Detta kommer bara ha aktivera IIS, men inte fjärrhanteringen mot andra servrar (t.ex. ett webbhotell).

Det resulterar i att vi inte ser andra serverar att ansluta till under "Arkiv":  
![alt text](/img/blogposts/2025-12-13-IIS-hanteraren-Win11-bild-3.png)

För att aktivera fjärrhanteringen behöver vi också slå på en extra inställning för att komma åt IIS remote på en annan server, dvs:  
Under "Internet Information Services" så väljer vi: "Webbhanteringsverktyg/IIS Hanteringstjänst", som är det extra tillägget vi behöver aktivera för att komma åt en IIS tjänst på en annan server (t.ex. via ett webbhotell).

![IIS Hanteringstjänst](/img/blogposts/2025-12-13-IIS-hanteraren-Win11-bild-2.png)
![IIS Hanteringstjänst + script](/img/blogposts/2025-12-13-IIS-hanteraren-Win11-bild-5.png)

Det verkar också behövas: "IIS Manager for Remote Administration 1.2", som laddas ned här:  
https://www.microsoft.com/en-us/download/details.aspx?id=41177

Efter den installationen (IIS 7+), så ska vi kunna komma åt IIS -> Arkiv -> Anslut till en server...

![IIS Anslut till en server](/img/blogposts/2025-12-13-IIS-hanteraren-Win11-bild-4.png)


Hoppas detta löser ditt problem med att få till anslutningen mot din fjärrhanterade IIS-server.

