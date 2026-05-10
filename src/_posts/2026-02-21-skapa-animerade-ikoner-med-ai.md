---
layout: post
title: "Skapa animerade ikoner med AI"
date: 2026-02-21
category: "ai,programmering"
---

Idag är det väldigt enkelt att skapa snygga animerade ikoner. att bara fråga en AI om att skapa "SVG ikoner, som är animerade i flat ui design", ger ett snyggt resultat.. 
<!--more-->

Sen är det bara att fantasin sätter gränser. 

Exempel:

<svg id="theme-switch" viewBox="0 0 100 50" width="100%" height="100%" style="max-width: 200px;" xmlns="http://www.w3.org/2000/svg">
  <style>
    #theme-switch { cursor: pointer; -webkit-tap-highlight-color: transparent; }
    #track { fill: #1E1E2E; transition: fill 0.6s cubic-bezier(0.4, 0.0, 0.2, 1); }
    #theme-switch.light #track { fill: #68A9FF; }
    #knob-group { transform: translateX(0px); transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
    #theme-switch.light #knob-group { transform: translateX(50px); }
    #moon, #sun { transform-origin: 25px 25px; }
    #moon { opacity: 1; transform: rotate(0deg); transition: opacity 0.3s ease 0.1s, transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1); }
    #theme-switch.light #moon { opacity: 0; transform: rotate(-100deg); transition: opacity 0.2s ease, transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1); }
    #sun { opacity: 0; transform: rotate(100deg); transition: opacity 0.2s ease, transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1); }
    #theme-switch.light #sun { opacity: 1; transform: rotate(0deg); transition: opacity 0.3s ease 0.2s, transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1); }
    .star { opacity: 1; fill: #FFFFFF; transition: opacity 0.3s ease 0.2s, transform 0.6s ease; }
    #theme-switch.light .star { opacity: 0; transform: translateY(-15px); transition: opacity 0.2s ease, transform 0.6s ease; }
    .cloud { opacity: 0; fill: #FFFFFF; transform: translateY(15px); transition: opacity 0.2s ease, transform 0.6s ease; }
    #theme-switch.light .cloud { opacity: 1; transform: translateY(0px); transition: opacity 0.4s ease 0.2s, transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1); }
  </style>
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect id="track" x="0" y="0" width="100" height="50" rx="25" />
  <g id="stars">
    <circle class="star" cx="62" cy="15" r="1.5" />
    <circle class="star" cx="78" cy="22" r="2" />
    <circle class="star" cx="88" cy="12" r="1" />
    <circle class="star" cx="66" cy="34" r="1.5" />
    <circle class="star" cx="84" cy="38" r="1.5" />
  </g>
  <g id="clouds">
    <path class="cloud" d="M 20 35 A 4 4 0 0 1 24 31 A 6 6 0 0 1 34 31 A 4 4 0 0 1 38 35 Z" />
    <path class="cloud" d="M 9 23 A 3 3 0 0 1 12 20 A 4 4 0 0 1 18 20 A 3 3 0 0 1 21 23 Z" />
    <path class="cloud" d="M 40 19 A 2.5 2.5 0 0 1 42.5 16.5 A 3.5 3.5 0 0 1 48.5 16.5 A 2.5 2.5 0 0 1 51 19 Z" opacity="0.6"/>
  </g>
  <g id="knob-group">
    <circle cx="25" cy="25" r="21" fill="#FFFFFF" filter="url(#shadow)" />
    <g id="icons">
      <path id="moon" d="M 15 12 C 23 12 29.5 18.5 29.5 26.5 C 29.5 34.5 23 41 15 41 C 21 39 25 33.5 25 26.5 C 25 19.5 21 14 15 12 Z" fill="#1E1E2E" />
      <g id="sun">
        <circle cx="25" cy="25" r="6.5" fill="#FFB703" />
        <line x1="25" y1="11" x2="25" y2="14.5" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="25" y1="35.5" x2="25" y2="39" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="11" y1="25" x2="14.5" y2="25" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="35.5" y1="25" x2="39" y2="25" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="15.1" y1="15.1" x2="17.6" y2="17.6" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="34.9" y1="34.9" x2="32.4" y2="32.4" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="34.9" y1="15.1" x2="32.4" y2="17.6" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="17.6" y1="34.9" x2="15.1" y2="32.4" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    </g>
  </g>
  <script>
    document.getElementById('theme-switch').addEventListener('click', function() {
      this.classList.toggle('light');
      if (document.body) document.body.classList.toggle('light');
    });
  </script>
</svg>

Generate a SVG for an sliding light and dark mode toggle switcher. It should be a dark mode with a moon, and then toggle and fade smooth to a light mode with a sun on toggle. Clean flat ui design

```xml
<svg id="theme-switch" viewBox="0 0 100 50" width="100%" height="100%" style="max-width: 200px;" xmlns="http://www.w3.org/2000/svg">
  <style>
    #theme-switch { cursor: pointer; -webkit-tap-highlight-color: transparent; }
    #track { fill: #1E1E2E; transition: fill 0.6s cubic-bezier(0.4, 0.0, 0.2, 1); }
    #theme-switch.light #track { fill: #68A9FF; }
    #knob-group { transform: translateX(0px); transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
    #theme-switch.light #knob-group { transform: translateX(50px); }
    #moon, #sun { transform-origin: 25px 25px; }
    #moon { opacity: 1; transform: rotate(0deg); transition: opacity 0.3s ease 0.1s, transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1); }
    #theme-switch.light #moon { opacity: 0; transform: rotate(-100deg); transition: opacity 0.2s ease, transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1); }
    #sun { opacity: 0; transform: rotate(100deg); transition: opacity 0.2s ease, transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1); }
    #theme-switch.light #sun { opacity: 1; transform: rotate(0deg); transition: opacity 0.3s ease 0.2s, transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1); }
    .star { opacity: 1; fill: #FFFFFF; transition: opacity 0.3s ease 0.2s, transform 0.6s ease; }
    #theme-switch.light .star { opacity: 0; transform: translateY(-15px); transition: opacity 0.2s ease, transform 0.6s ease; }
    .cloud { opacity: 0; fill: #FFFFFF; transform: translateY(15px); transition: opacity 0.2s ease, transform 0.6s ease; }
    #theme-switch.light .cloud { opacity: 1; transform: translateY(0px); transition: opacity 0.4s ease 0.2s, transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1); }
  </style>
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect id="track" x="0" y="0" width="100" height="50" rx="25" />
  <g id="stars">
    <circle class="star" cx="62" cy="15" r="1.5" />
    <circle class="star" cx="78" cy="22" r="2" />
    <circle class="star" cx="88" cy="12" r="1" />
    <circle class="star" cx="66" cy="34" r="1.5" />
    <circle class="star" cx="84" cy="38" r="1.5" />
  </g>
  <g id="clouds">
    <path class="cloud" d="M 20 35 A 4 4 0 0 1 24 31 A 6 6 0 0 1 34 31 A 4 4 0 0 1 38 35 Z" />
    <path class="cloud" d="M 9 23 A 3 3 0 0 1 12 20 A 4 4 0 0 1 18 20 A 3 3 0 0 1 21 23 Z" />
    <path class="cloud" d="M 40 19 A 2.5 2.5 0 0 1 42.5 16.5 A 3.5 3.5 0 0 1 48.5 16.5 A 2.5 2.5 0 0 1 51 19 Z" opacity="0.6"/>
  </g>
  <g id="knob-group">
    <circle cx="25" cy="25" r="21" fill="#FFFFFF" filter="url(#shadow)" />
    <g id="icons">
      <path id="moon" d="M 15 12 C 23 12 29.5 18.5 29.5 26.5 C 29.5 34.5 23 41 15 41 C 21 39 25 33.5 25 26.5 C 25 19.5 21 14 15 12 Z" fill="#1E1E2E" />
      <g id="sun">
        <circle cx="25" cy="25" r="6.5" fill="#FFB703" />
        <line x1="25" y1="11" x2="25" y2="14.5" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="25" y1="35.5" x2="25" y2="39" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="11" y1="25" x2="14.5" y2="25" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="35.5" y1="25" x2="39" y2="25" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="15.1" y1="15.1" x2="17.6" y2="17.6" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="34.9" y1="34.9" x2="32.4" y2="32.4" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="34.9" y1="15.1" x2="32.4" y2="17.6" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="17.6" y1="34.9" x2="15.1" y2="32.4" stroke="#FFB703" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    </g>
  </g>
  <script>
    document.getElementById('theme-switch').addEventListener('click', function() {
      this.classList.toggle('light');
      if (document.body) document.body.classList.toggle('light');
    });
  </script>
</svg>
``` 

<svg id="bulb-switch" viewBox="0 0 100 100" width="100%" height="100%" style="max-width: 200px;" xmlns="http://www.w3.org/2000/svg">
  <style>
    /* Grundinställningar */
    #bulb-switch {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    
    /* Ikonens bakgrund (Knappen) */
    #bg {
      fill: #1E1E2E; /* Mörkt tema */
      transition: fill 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #bulb-switch.on #bg {
      fill: #E6EBF5; /* Ljust tema */
    }

    /* Glödlampans glas */
    #glass {
      fill: #313244;
      transition: fill 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #bulb-switch.on #glass {
      fill: #FFD166; /* Varmgul färg när den är tänd */
    }

    /* Glödtråden inuti */
    #filament {
      stroke: #181825;
      transition: stroke 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #bulb-switch.on #filament {
      stroke: #FF9F1C;
    }

    /* Glow-effekt bakom lampan (syns bara när den är tänd) */
    #glow {
      opacity: 0;
      transform: scale(0.8);
      transform-origin: 50px 35px;
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #bulb-switch.on #glow {
      opacity: 0.6;
      transform: scale(1.2);
    }

    /* Ljusstrålarna (roterar och poppar ut) */
    #rays {
      opacity: 0;
      transform: scale(0.5) rotate(-30deg);
      transform-origin: 50px 35px;
      transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    #bulb-switch.on #rays {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }

    /* Lampfoten (metallen i botten) */
    .base { fill: #5C5F77; transition: fill 0.6s ease; }
    .base-dark { fill: #4C4F69; transition: fill 0.6s ease; }
    #bulb-switch.on .base { fill: #9CA0B0; }
    #bulb-switch.on .base-dark { fill: #7F849C; }
  </style>

  <defs>
    <filter id="bulb-blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
  </defs>

  <rect id="bg" x="0" y="0" width="100" height="100" rx="25" />

  <g id="rays">
    <line x1="12" y1="35" x2="22" y2="35" stroke="#FFB703" stroke-width="4" stroke-linecap="round"/>
    <line x1="24" y1="9" x2="30" y2="15" stroke="#FFB703" stroke-width="4" stroke-linecap="round"/>
    <line x1="50" y1="2" x2="50" y2="10" stroke="#FFB703" stroke-width="4" stroke-linecap="round"/>
    <line x1="76" y1="9" x2="70" y2="15" stroke="#FFB703" stroke-width="4" stroke-linecap="round"/>
    <line x1="88" y1="35" x2="78" y2="35" stroke="#FFB703" stroke-width="4" stroke-linecap="round"/>
  </g>

  <circle id="glow" cx="50" cy="35" r="22" fill="#FFB703" filter="url(#bulb-blur)" />

  <path id="glass" d="M 38 65 C 38 48, 25 45, 25 35 C 25 20, 36 12, 50 12 C 64 12, 75 20, 75 35 C 75 45, 62 48, 62 65 Z" />

  <path d="M 32 35 C 32 24, 39 18, 48 16" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.25" />

  <polyline id="filament" points="42,65 42,45 46,38 50,43 54,38 58,45 58,65" stroke-width="2.5" stroke-linejoin="round" fill="none" />
  
  <rect class="base" x="36" y="66" width="28" height="6" rx="2" />
  <rect class="base-dark" x="37" y="73" width="26" height="5" rx="2" />
  <rect class="base" x="38" y="79" width="24" height="5" rx="2" />
  <path class="base-dark" d="M 42 85 L 58 85 L 54 93 L 46 93 Z" />
  
  <script>
    document.getElementById('bulb-switch').addEventListener('click', function() {
      // Byter klass på SVG:n
      this.classList.toggle('on');
      
      // Byter klass på HTML-bodyn för att testa hela sidans bakgrund (om den används på en sida)
      if (document.body) {
        document.body.classList.toggle('light');
      }
    });
  </script>
</svg>

Gör en flat ui design SVG ikon som är som en lampa som tonar från släckt till tänd. 

```xml
<svg id="bulb-switch" viewBox="0 0 100 100" width="100%" height="100%" style="max-width: 200px;" xmlns="http://www.w3.org/2000/svg">
  <style>
    /* Grundinställningar */
    #bulb-switch {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    
    /* Ikonens bakgrund (Knappen) */
    #bg {
      fill: #1E1E2E; /* Mörkt tema */
      transition: fill 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #bulb-switch.on #bg {
      fill: #E6EBF5; /* Ljust tema */
    }

    /* Glödlampans glas */
    #glass {
      fill: #313244;
      transition: fill 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #bulb-switch.on #glass {
      fill: #FFD166; /* Varmgul färg när den är tänd */
    }

    /* Glödtråden inuti */
    #filament {
      stroke: #181825;
      transition: stroke 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #bulb-switch.on #filament {
      stroke: #FF9F1C;
    }

    /* Glow-effekt bakom lampan (syns bara när den är tänd) */
    #glow {
      opacity: 0;
      transform: scale(0.8);
      transform-origin: 50px 35px;
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    #bulb-switch.on #glow {
      opacity: 0.6;
      transform: scale(1.2);
    }

    /* Ljusstrålarna (roterar och poppar ut) */
    #rays {
      opacity: 0;
      transform: scale(0.5) rotate(-30deg);
      transform-origin: 50px 35px;
      transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    #bulb-switch.on #rays {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }

    /* Lampfoten (metallen i botten) */
    .base { fill: #5C5F77; transition: fill 0.6s ease; }
    .base-dark { fill: #4C4F69; transition: fill 0.6s ease; }
    #bulb-switch.on .base { fill: #9CA0B0; }
    #bulb-switch.on .base-dark { fill: #7F849C; }
  </style>

  <defs>
    <filter id="bulb-blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
  </defs>

  <rect id="bg" x="0" y="0" width="100" height="100" rx="25" />

  <g id="rays">
    <line x1="12" y1="35" x2="22" y2="35" stroke="#FFB703" stroke-width="4" stroke-linecap="round"/>
    <line x1="24" y1="9" x2="30" y2="15" stroke="#FFB703" stroke-width="4" stroke-linecap="round"/>
    <line x1="50" y1="2" x2="50" y2="10" stroke="#FFB703" stroke-width="4" stroke-linecap="round"/>
    <line x1="76" y1="9" x2="70" y2="15" stroke="#FFB703" stroke-width="4" stroke-linecap="round"/>
    <line x1="88" y1="35" x2="78" y2="35" stroke="#FFB703" stroke-width="4" stroke-linecap="round"/>
  </g>

  <circle id="glow" cx="50" cy="35" r="22" fill="#FFB703" filter="url(#bulb-blur)" />

  <path id="glass" d="M 38 65 C 38 48, 25 45, 25 35 C 25 20, 36 12, 50 12 C 64 12, 75 20, 75 35 C 75 45, 62 48, 62 65 Z" />

  <path d="M 32 35 C 32 24, 39 18, 48 16" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.25" />

  <polyline id="filament" points="42,65 42,45 46,38 50,43 54,38 58,45 58,65" stroke-width="2.5" stroke-linejoin="round" fill="none" />
  
  <rect class="base" x="36" y="66" width="28" height="6" rx="2" />
  <rect class="base-dark" x="37" y="73" width="26" height="5" rx="2" />
  <rect class="base" x="38" y="79" width="24" height="5" rx="2" />
  <path class="base-dark" d="M 42 85 L 58 85 L 54 93 L 46 93 Z" />
  
  <script>
    document.getElementById('bulb-switch').addEventListener('click', function() {
      // Byter klass på SVG:n
      this.classList.toggle('on');
      
      // Byter klass på HTML-bodyn för att testa hela sidans bakgrund (om den används på en sida)
      if (document.body) {
        document.body.classList.toggle('light');
      }
    });
  </script>
</svg>
``` 

Hoppas ni kommer på massvis av häftiga animerade ikoner. :)
