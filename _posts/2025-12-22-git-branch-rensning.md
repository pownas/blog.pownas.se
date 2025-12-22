---
layout: post
title: "Git branch rensning"
date: 2025-12-22 20:07:10 +0200
category: "git,github,programmering"
---

Här kommer ett enkelt sätt hur man kan rensa upp bland git-brancher lokalt på sin dator, via PowerShell: 

```ps
git checkout main

git pull origin main

## Via PowerShell: 
git branch --merged main | Select-String -NotMatch "main|^\*" | ForEach-Object { git branch -d $_.Line.Trim() }

## Rensa sedan upp i remote, de som inte längre finns kvar: 
git fetch --prune
```

Eller via rensa via bash: 

```bash
git checkout main

git pull origin main

## Via bash: 
git branch --merged main | grep -v "^\*" | grep -v "main" | xargs git branch -d

## Rensa sedan upp i remote, de som inte längre finns kvar: 
git fetch --prune
```

Visa vilka brancher som redan blivit mergead in till main: 
```bash
git branch --merged main
```

Även ett par bra kommandon för att kolla git-historiken: 
```bash
git status

tig
```

`tig` visar tree view för git historiken.

Hoppas detta var några bra kommandon för dig. 
