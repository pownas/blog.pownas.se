---
layout: post
title: "Installera Podman Desktop i Windows 11"
date: 2025-12-13 14:07:10 +0200
category: "programmering,github"
---

Podman desktop är en kontainer-lösning (containers) där man kan köra sina olika kontainrar genom (lite som docker vad jag förstått det som...). 
Det används för att sätta upp t.ex. lokal utvecklings-miljö där man inte kan ha alla servrar och databaser och liknande publicerade och åtkomliga från sin lokala maskin. 

För att installera "Podman Desktop", så fick jag göra följande: 

## 1 - Ladda ned "Podman Desktop"
Går till sidan: https://podman.io/ , och där valde jag "Download" och "Podman Desktop for Windows - Windows Installer v-1.24.2". Se bild: 
![Ladda ned Podman desktop](/img/blogposts/2025-12-21-PodmanDesktop-bild.png)

## 2 - Installera "Podman Desktop"
Nu körde jag installationen jag laddade ned, och valde att installera för en eller alla användare på datorn. 

## 3 - Starta applikationen och kontrollera krav
När vi sedan startat applikationen första gången, så kommer det upp att ett krav: "Virtual Macheine Platform", behöver vara aktiverad för att köra Podman. 
![Podman Desktop - Första start av applikationen](/img/blogposts/2025-12-21-PodmanDesktop-bild-1.png)

Klickar man på länken: "Enable Virtual Macheine Platform", så visar den oss till länken:  
https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-3---enable-virtual-machine-feature
![Enable Virtual Macheine Platform](/img/blogposts/2025-12-21-PodmanDesktop-bild-2.png)

## 4 - Aktivera VirtualMachinePlatform (Om inte redan aktiverat) 
Kör igång en PowerShell som admin, och kör kommandot som Microsoft länken visade oss till: 
```ps
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

## 5 - Installera Linux kernel
Sedan kör vi vidare i guiden från länken ovanför:  
https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package

Step 4 där: "Download the Linux kernel update package"
Kör då i din PowerShell admin: 
```ps
wsl.exe --install
```
![Installera WSL i PowerShell](/img/blogposts/2025-12-21-PodmanDesktop-bild-3.png)

## 6 - Starta om datorn efter installationen av Linux kernel
För att ändringarna ska träda i kraft, behöver datorn startas om. 

## 7 - Sätt WSL 2, som din standard version
https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-5---set-wsl-2-as-your-default-version 

```ps
wsl --set-default-version 2
```
![Sätt WSL2 som default](/img/blogposts/2025-12-21-PodmanDesktop-bild-4.png)

## 8 - (Osäker om detta behövs...) Installera Linux dist
https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-6---install-your-linux-distribution-of-choice

## 8 - Starta "Podman Desktop" - slutför installationen
Nu när vi startar "Podman Desktop" igen, så vill den att vi fortsätter installationen: 
![Podman Desktop - Fortsätt installationen efter start](/img/blogposts/2025-12-21-PodmanDesktop-bild-5.png)

## 9 - Fortsätter med nästa
![Podman Desktop - Fortsätt med nästa](/img/blogposts/2025-12-21-PodmanDesktop-bild-6.png)

## 10 - Podman är inte installerat, installera
Nu tycker Podman Desktop, att själva Podman inte är installerat på maskinen, installera då v5.7.1 eller nyare: 
![Podman Desktop - Podman är inte installerat](/img/blogposts/2025-12-21-PodmanDesktop-bild-7.png)

## 11 - Installera via WSL2
![Installera Podman med WSL2](/img/blogposts/2025-12-21-PodmanDesktop-bild-8.png)

Klart: 
![Installation klar](/img/blogposts/2025-12-21-PodmanDesktop-bild-9.png)

## 12 - Slå på autostart
![Sätt igång autostart](/img/blogposts/2025-12-21-PodmanDesktop-bild-10.png)

## 13 - Skapa en Podman maskin: 
![Skapa en podman maskin](/img/blogposts/2025-12-21-PodmanDesktop-bild-11.png)

Följ guiden under: 
file:///C:/Program%20Files/RedHat/Podman/podman-for-windows.html

Standard vid start: 
![Standard inställningar för en Podman-maskin](/img/blogposts/2025-12-21-PodmanDesktop-bild-12.png)

Efter skapadet så kommer man till en "Hur använder jag detta?" guide:
![Hur kan jag använda detta?](/img/blogposts/2025-12-21-PodmanDesktop-bild-13.png)

Info om networking: 
https://docs.podman.io/en/latest/markdown/podman-machine-init.1.html#user-mode-networking


-------------------

Hoppas denna guide kanske kan vara till nytta för någon, och att ni kommer igång med er VM/Docker miljö för att kunna hantera containers från en utvecklingsmiljö. 

